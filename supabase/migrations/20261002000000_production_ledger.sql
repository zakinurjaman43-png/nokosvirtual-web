-- Run this migration in Supabase before enabling payment or purchase traffic.
-- All money values are integer Rupiah; direct client writes must remain blocked by RLS.
create table if not exists public.pricing_settings (
  id integer primary key check (id = 1),
  markup integer not null check (markup >= 0),
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);

alter table public.users add column if not exists auth_user_id uuid unique;
alter table public.users add column if not exists balance bigint not null default 0 check (balance >= 0);
alter table public.users add column if not exists is_active boolean not null default true;

create table if not exists public.deposits (
  id uuid primary key default gen_random_uuid(),
  user_id bigint not null references public.users(id),
  auth_user_id uuid not null references auth.users(id),
  order_id text not null unique,
  transaction_id text unique,
  amount bigint not null check (amount >= 15000),
  status text not null check (status in ('pending','paid','failed','expired','cancelled','denied')),
  qr_url text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.balance_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id bigint not null references public.users(id),
  auth_user_id uuid references auth.users(id),
  type text not null,
  amount bigint not null,
  balance_before bigint not null check (balance_before >= 0),
  balance_after bigint not null check (balance_after >= 0),
  reference_type text not null,
  reference_id text not null,
  description text,
  created_at timestamptz not null default now(),
  unique (reference_type, reference_id, type)
);

-- Payment notification processing is atomic and idempotent: the row lock plus
-- unique ledger reference prevents double credit when Midtrans retries.
create or replace function public.settle_deposit(p_order_id text, p_transaction_id text, p_paid_at timestamptz)
returns jsonb language plpgsql security definer set search_path = public as $$
declare d public.deposits; before_balance bigint; after_balance bigint;
begin
  select * into d from deposits where order_id = p_order_id for update;
  if not found then raise exception 'deposit tidak ditemukan'; end if;
  if d.status = 'paid' then return jsonb_build_object('already_settled', true); end if;
  if d.status <> 'pending' then raise exception 'deposit tidak dapat diselesaikan dari status %', d.status; end if;
  select balance into before_balance from users where id = d.user_id for update;
  if before_balance is null then raise exception 'user deposit tidak ditemukan'; end if;
  after_balance := before_balance + d.amount;
  update users set balance = after_balance where id = d.user_id;
  update deposits set status = 'paid', transaction_id = coalesce(p_transaction_id, transaction_id), paid_at = p_paid_at, updated_at = now() where id = d.id;
  insert into balance_transactions(user_id, auth_user_id, type, amount, balance_before, balance_after, reference_type, reference_id, description)
  values (d.user_id, d.auth_user_id, 'deposit_credit', d.amount, before_balance, after_balance, 'deposit', d.order_id, 'Midtrans settlement');
  return jsonb_build_object('settled', true, 'balance_after', after_balance);
end $$;

-- Administrative adjustments use one transaction rather than a read/update/
-- compensating update sequence. Grant execute only to service_role.
create or replace function public.adjust_admin_balance(p_user_id bigint, p_amount bigint, p_admin_auth_user_id uuid, p_reference_id text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare before_balance bigint; after_balance bigint; target public.users;
begin
  if p_amount = 0 then raise exception 'nominal tidak boleh nol'; end if;
  select * into target from users where id = p_user_id for update;
  if not found then raise exception 'user tidak ditemukan'; end if;
  before_balance := target.balance; after_balance := before_balance + p_amount;
  if after_balance < 0 then raise exception 'saldo tidak cukup'; end if;
  update users set balance = after_balance where id = p_user_id;
  insert into balance_transactions(user_id, auth_user_id, type, amount, balance_before, balance_after, reference_type, reference_id, description)
  values (target.id, target.auth_user_id, case when p_amount > 0 then 'admin_add' else 'admin_subtract' end, p_amount, before_balance, after_balance, 'admin', p_reference_id, 'Penyesuaian saldo administrator');
  return jsonb_build_object('balance_before', before_balance, 'balance_after', after_balance);
end $$;

alter table public.deposits enable row level security;
alter table public.balance_transactions enable row level security;
-- API routes use service_role. Users may only read their own records through
-- explicit policies; no INSERT/UPDATE policy is intentionally provided.
create policy "read own deposits" on public.deposits for select to authenticated using (auth.uid() = auth_user_id);
create policy "read own ledger" on public.balance_transactions for select to authenticated using (auth.uid() = auth_user_id);
