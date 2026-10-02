"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

const activeStatuses = ["ACTIVE", "PENDING", "WAITING", "WAITING_OTP", "CREATING"];
const formatRupiah = (value) => `Rp ${Number(value || 0).toLocaleString("id-ID")}`;

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDashboard(); }, []);
  async function loadDashboard() {
    try {
      const { data: { user: authenticatedUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !authenticatedUser) { window.location.href = "/login"; return; }
      setUser(authenticatedUser);
      const [syncResponse, ordersResponse] = await Promise.all([
        fetch("/api/user/sync", { method: "POST", headers: { "Content-Type": "application/json" } }),
        fetch("/api/orders", { cache: "no-store" }),
      ]);
      const sync = await syncResponse.json();
      const orderResult = await ordersResponse.json();
      if (!syncResponse.ok || !sync.success) throw new Error(sync.error || "Gagal memuat saldo.");
      if (!ordersResponse.ok || !orderResult.success) throw new Error(orderResult.error || "Gagal memuat pesanan.");
      setBalance(Number(sync.user?.balance || 0));
      setOrders((orderResult.orders || []).slice(0, 6));
    } catch (loadError) { setError(loadError.message || "Dashboard belum dapat dimuat."); }
    finally { setLoading(false); }
  }
  async function logout() { await supabase.auth.signOut(); window.location.href = "/login"; }
  const active = orders.filter((order) => activeStatuses.includes(String(order.status).toUpperCase())).length;

  return <main className="app-page"><div className="app-shell">
    <header className="app-header"><Link href="/" className="wordmark"><span className="wordmark-mark">N</span>NOKOS<span>VIRTUAL</span></Link><nav><Link href="/dashboard">Dashboard</Link><Link href="/buy">Beli Nomor</Link><Link href="/orders">Pesanan</Link><button onClick={logout}>Keluar</button></nav></header>
    {loading ? <DashboardSkeleton /> : <>
      <section className="dashboard-welcome"><div><p className="eyebrow">DASHBOARD AKUN</p><h1>Selamat datang, {user?.email?.split("@")[0] || "pengguna"}.</h1><p>Kelola saldo, pembelian nomor, dan status OTP dari satu tempat.</p></div><Link href="/buy" className="button button-primary">Beli nomor →</Link></section>
      {error && <div className="error-panel">{error}</div>}
      <section className="metric-grid"><article className="balance-card"><span>Saldo tersedia</span><strong>{formatRupiah(balance)}</strong><Link href="/deposit">+ Deposit saldo</Link></article><article className="metric-card"><span>Total order terbaru</span><strong>{orders.length}</strong><small>Riwayat pembelian akun</small></article><article className="metric-card"><span>Order aktif</span><strong>{active}</strong><small>Menunggu nomor atau OTP</small></article></section>
      <section className="quick-actions"><Link href="/deposit"><b>⌁</b><span><strong>Deposit QRIS</strong><small>Tambah saldo melalui Midtrans</small></span><i>→</i></Link><Link href="/orders"><b>◫</b><span><strong>Pesanan saya</strong><small>Lihat nomor, OTP, dan status</small></span><i>→</i></Link></section>
      <section className="recent-section"><div className="section-heading"><div><p className="eyebrow">AKTIVITAS TERBARU</p><h2>Pesanan terakhir</h2></div><Link href="/orders" className="text-link">Lihat semua →</Link></div>{orders.length ? <div className="order-list">{orders.map((order) => <article key={order.id}><div><strong>{order.service_name || order.platform_name || `Order #${order.id}`}</strong><small>{order.phone_number || "Nomor sedang diproses"}</small></div><span className={`status-pill status-${String(order.status || "pending").toLowerCase()}`}>{order.status || "PENDING"}</span><b>{formatRupiah(order.price)}</b></article>)}</div> : <div className="empty-panel">Belum ada pesanan. Katalog tersedia setelah Anda memilih negara dan layanan.</div>}</section>
    </>}
  </div></main>;
}
function DashboardSkeleton() { return <main className="app-page"><div className="app-shell"><div className="skeleton" style={{height:68}} /><div className="skeleton" style={{height:180,marginTop:30}} /><div className="metric-grid" style={{marginTop:20}}>{[1,2,3].map((key)=><div className="skeleton metric-card" key={key}/>)}</div></div></main>; }
