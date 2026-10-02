"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const [countries, setCountries] = useState([]);
  const [query, setQuery] = useState("");
  const [state, setState] = useState("loading");

  useEffect(() => {
    async function loadCountries() {
      try {
        const response = await fetch("/api/catalog?action=countries", { cache: "no-store" });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.error || "Katalog belum dapat dimuat.");
        setCountries(result.data || []);
        setState("ready");
      } catch {
        setState("error");
      }
    }
    loadCountries();
  }, []);

  const visibleCountries = useMemo(() => countries.filter((country) =>
    String(country.name || "").toLowerCase().includes(query.trim().toLowerCase())
  ).slice(0, 8), [countries, query]);

  return (
    <main className="marketing-page">
      <div className="shell">
        <nav className="site-nav">
          <Link href="/" className="wordmark"><span className="wordmark-mark">N</span>NOKOS<span>VIRTUAL</span></Link>
          <div className="site-nav-links"><a href="#catalog">Katalog</a><a href="#cara-kerja">Cara kerja</a><Link href="/login">Masuk</Link><Link href="/login" className="button button-primary">Daftar</Link></div>
        </nav>

        <section className="hero-grid">
          <div>
            <p className="eyebrow">VIRTUAL NUMBER MARKETPLACE</p>
            <h1>Verifikasi lebih cepat, dengan alur yang jelas.</h1>
            <p className="hero-copy">Temukan nomor virtual dari katalog supplier secara langsung, bayar dengan saldo, lalu pantau OTP dan status pesanan dari satu dashboard.</p>
            <div className="hero-actions"><Link href="/buy" className="button button-primary">Beli nomor <span>→</span></Link><Link href="/login" className="button button-secondary">Masuk ke dashboard</Link></div>
            <div className="trust-row"><span>✓ Harga dihitung di server</span><span>✓ Status order aktual</span><span>✓ Pembayaran QRIS</span></div>
          </div>
          <div className="catalog-preview" aria-label="Ringkasan alur pembelian">
            <div className="preview-top"><span className="live-dot" />KATALOG LANGSUNG <span className="preview-secure">Terproteksi</span></div>
            <div className="preview-step"><b>01</b><div><strong>Pilih layanan</strong><small>Sesuaikan kebutuhan verifikasi</small></div><span>→</span></div>
            <div className="preview-step"><b>02</b><div><strong>Pilih negara & produk</strong><small>Harga dan ketersediaan dari supplier</small></div><span>→</span></div>
            <div className="preview-step"><b>03</b><div><strong>Terima nomor & OTP</strong><small>Pantau dari halaman pesanan</small></div><span>→</span></div>
            <div className="preview-footer">Harga final dan saldo selalu diverifikasi ulang sebelum pembelian.</div>
          </div>
        </section>

        <section id="catalog" className="catalog-section">
          <div className="section-heading"><div><p className="eyebrow">JELAJAHI KATALOG</p><h2>Mulai dari negara yang tersedia</h2><p>Daftar berikut diambil dari katalog supplier saat halaman dimuat.</p></div><Link href="/buy" className="text-link">Buka katalog lengkap →</Link></div>
          <label className="catalog-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari negara di katalog" aria-label="Cari negara" /></label>
          {state === "loading" && <div className="country-grid">{Array.from({ length: 8 }).map((_, index) => <div className="skeleton country-card" key={index} />)}</div>}
          {state === "ready" && visibleCountries.length > 0 && <div className="country-grid">{visibleCountries.map((country) => <Link href={`/buy?country=${encodeURIComponent(country.id)}`} className="country-card" key={country.id}><span className="country-flag">{country.emoji || "◌"}</span><span><strong>{country.name}</strong><small>Lihat layanan tersedia</small></span><b>→</b></Link>)}</div>}
          {state === "ready" && visibleCountries.length === 0 && <div className="empty-panel">Tidak ada negara yang sesuai pencarian. Coba kata kunci lain atau buka katalog lengkap.</div>}
          {state === "error" && <div className="error-panel">Katalog live belum dapat dihubungi. Silakan coba lagi atau kembali setelah integrasi supplier tersedia.</div>}
        </section>

        <section id="cara-kerja" className="benefit-grid"><article><span>01</span><h3>Katalog aktual</h3><p>Ketersediaan dan harga produk dimuat dari backend, bukan daftar statis di browser.</p></article><article><span>02</span><h3>Checkout aman</h3><p>Harga dan saldo divalidasi kembali saat Anda mengonfirmasi pembelian.</p></article><article><span>03</span><h3>Order terpantau</h3><p>Nomor, status, dan OTP tersedia dalam riwayat pesanan setelah supplier merespons.</p></article></section>
        <section className="faq-section"><div><p className="eyebrow">PERTANYAAN UMUM</p><h2>Semua yang perlu Anda ketahui.</h2></div><div className="faq-list"><details open><summary>Bagaimana harga ditentukan?</summary><p>Harga jual dihitung di server berdasarkan harga supplier saat katalog dimuat dan markup yang dikonfigurasi administrator.</p></details><details><summary>Kapan saldo bertambah setelah deposit?</summary><p>Saldo dikreditkan otomatis setelah Midtrans mengonfirmasi pembayaran melalui webhook terverifikasi.</p></details><details><summary>Di mana saya melihat OTP?</summary><p>Nomor, status, dan OTP yang diterima supplier tersedia di halaman Pesanan setelah order diproses.</p></details></div></section>
        <section className="final-cta"><p className="eyebrow">SIAP MEMULAI?</p><h2>Temukan nomor virtual untuk kebutuhan Anda.</h2><Link href="/buy" className="button button-primary">Jelajahi katalog →</Link></section>
      </div>
      <footer className="site-footer"><div className="shell">NOKOS VIRTUAL <span>•</span> Marketplace nomor virtual dengan transaksi terverifikasi.</div></footer>
    </main>
  );
}
