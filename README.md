# Nokos Virtual

Production Next.js marketplace for virtual numbers. Catalog, order creation, and OTP data are proxied server-side to SMSCode; QRIS is charged through Midtrans; balances are maintained by a Supabase ledger.

## Required configuration

Copy `.env.example` into the deployment secret store and set every value. Never expose `SMSCODE_TOKEN`, `MIDTRANS_SERVER_KEY`, or `SUPABASE_SERVICE_ROLE_KEY` as `NEXT_PUBLIC_*` variables. `ADMIN_EMAILS` is a comma-separated, lower/upper-case-insensitive allow-list used by middleware and every admin API route.

## Database deployment

1. Review and apply `supabase/migrations/20261002000000_production_ledger.sql` using the Supabase CLI or SQL Editor **before** deploying this release.
2. Confirm existing `users` IDs are compatible with the migration (`bigint` is the current application contract).
3. Ensure `reserve_purchase` and `refund_purchase` are deployed as atomic, service-role-only functions. The application deliberately does not debit balances in browser code.
4. Set the Midtrans notification URL to `https://YOUR_DOMAIN/api/midtrans/webhook` and configure the production/sandbox server key to match `MIDTRANS_IS_PRODUCTION`.
5. Add authorized administrator addresses to `ADMIN_EMAILS`, then create those accounts with Supabase Auth.

## Security and operational checks

- `/admin/login` authenticates with Supabase Auth. Middleware protects all other `/admin/*` pages, and admin APIs verify the same server-side allow-list.
- Midtrans notifications are signature-checked and credited only by the idempotent `settle_deposit` database function.
- Supplier pricing and stock are fetched from SMSCode at request time. The browser never sends a final price; the order route recalculates it and records the ledger reservation.
- An administrator must create `pricing_settings` row `id = 1` with a real markup before catalog sales are enabled. There is intentionally no fallback selling price.

## Local verification

```bash
npm install
npm run build
```

Production smoke tests require real Supabase, Midtrans sandbox, and SMSCode credentials; do not substitute mock payment, catalog, or balance data.
