"use client";

import Link from "next/link";

const platforms = [
  "WhatsApp",
  "Telegram",
  "Gmail",
  "TikTok",
  "Instagram",
  "Facebook",
  "Discord",
  "X",
  "Shopee",
  "Google",
  "Signal",
  "Tinder",
];

const features = [
  {
    icon: "01",
    title: "Nomor Virtual Instan",
    text: "Pilih negara dan layanan yang kamu butuhkan, lalu dapatkan nomor virtual dalam beberapa langkah.",
  },
  {
    icon: "02",
    title: "Verifikasi OTP",
    text: "Pantau proses penerimaan kode OTP langsung dari halaman pesanan kamu.",
  },
  {
    icon: "03",
    title: "Stok Real-Time",
    text: "Ketersediaan nomor mengikuti stok supplier sehingga informasi yang ditampilkan lebih aktual.",
  },
  {
    icon: "04",
    title: "Harga Transparan",
    text: "Harga ditampilkan sebelum pembelian sehingga kamu tahu biaya yang harus dibayar.",
  },
  {
    icon: "05",
    title: "Pembayaran QRIS",
    text: "Isi saldo dengan metode pembayaran yang praktis dan saldo diproses secara otomatis setelah pembayaran terverifikasi.",
  },
  {
    icon: "06",
    title: "Riwayat Pesanan",
    text: "Semua transaksi, nomor, status dan informasi OTP tersimpan dalam satu dashboard.",
  },
];

const steps = [
  {
    number: "01",
    title: "Pilih layanan",
    text: "Tentukan layanan atau platform yang ingin kamu gunakan.",
  },
  {
    number: "02",
    title: "Pilih negara & nomor",
    text: "Pilih negara dan produk yang tersedia sesuai kebutuhan.",
  },
  {
    number: "03",
    title: "Terima OTP",
    text: "Nomor diberikan dan kode OTP dapat dipantau melalui pesanan.",
  },
];

const faqs = [
  {
    q: "Apa itu NOKOS Virtual?",
    a: "NOKOS Virtual adalah marketplace nomor virtual yang menyediakan nomor dari berbagai negara untuk kebutuhan verifikasi SMS dan OTP.",
  },
  {
    q: "Apakah harus login untuk membeli nomor?",
    a: "Ya. Katalog pembelian, saldo, checkout dan riwayat pesanan tersedia setelah kamu masuk ke akun.",
  },
  {
    q: "Bagaimana cara mengisi saldo?",
    a: "Kamu dapat melakukan deposit melalui halaman Deposit. Setelah pembayaran berhasil dan terverifikasi, saldo akan diproses otomatis.",
  },
  {
    q: "Di mana saya melihat OTP?",
    a: "Informasi nomor dan status penerimaan OTP dapat dilihat melalui halaman Pesanan setelah transaksi dibuat.",
  },
  {
    q: "Apakah harga nomor selalu sama?",
    a: "Tidak selalu. Harga mengikuti produk dan stok supplier yang tersedia serta konfigurasi harga pada sistem.",
  },
];

export default function Home() {
  return (
    <main className="nk-home">
      {/* NAVBAR */}
      <header className="nk-navbar">
        <div className="nk-container nk-nav-inner">
          <Link href="/" className="nk-brand">
            <span className="nk-brand-icon">N</span>
            <span className="nk-brand-main">NOKOS</span>
            <span className="nk-brand-sub">VIRTUAL</span>
          </Link>

          <nav className="nk-nav-links">
            <a href="#layanan">Layanan</a>
            <a href="#cara-kerja">Cara Kerja</a>
            <a href="#platform">Platform</a>
            <a href="#faq">FAQ</a>
          </nav>

          <div className="nk-nav-actions">
            <Link href="/login" className="nk-login-link">
              Masuk
            </Link>
            <Link href="/login" className="nk-btn nk-btn-primary">
              Mulai Sekarang
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="nk-hero">
        <div className="nk-hero-glow nk-glow-one" />
        <div className="nk-hero-glow nk-glow-two" />

        <div className="nk-container nk-hero-inner">
          <div className="nk-hero-copy">
            <div className="nk-badge">
              <span className="nk-badge-dot" />
              NOMOR VIRTUAL & OTP
            </div>

            <h1>
              Nomor virtual untuk
              <span> verifikasi yang lebih mudah.</span>
            </h1>

            <p>
              Dapatkan nomor virtual dari berbagai negara untuk kebutuhan
              verifikasi SMS dan OTP. Pilih layanan, pilih nomor, dan pantau
              pesanan dari satu dashboard.
            </p>

            <div className="nk-hero-buttons">
              <Link href="/login" className="nk-btn nk-btn-primary nk-btn-large">
                Mulai Sekarang
                <span>→</span>
              </Link>

              <a
                href="#cara-kerja"
                className="nk-btn nk-btn-outline nk-btn-large"
              >
                Lihat Cara Kerja
              </a>
            </div>

            <div className="nk-trust">
              <span>✓ Harga transparan</span>
              <span>✓ Stok diperbarui</span>
              <span>✓ Pembayaran QRIS</span>
            </div>
          </div>

          {/* HERO VISUAL */}
          <div className="nk-hero-card">
            <div className="nk-window-bar">
              <span />
              <span />
              <span />

              <div className="nk-window-title">
                NOKOS VIRTUAL
              </div>
            </div>

            <div className="nk-hero-card-body">
              <div className="nk-live-label">
                <span className="nk-live-dot" />
                LIVE CATALOG
                <span>ONLINE</span>
              </div>

              <div className="nk-hero-select">
                <div className="nk-select-icon">🌎</div>
                <div>
                  <small>NEGARA</small>
                  <strong>Pilih negara</strong>
                </div>
                <b>⌄</b>
              </div>

              <div className="nk-hero-select">
                <div className="nk-select-icon">▣</div>
                <div>
                  <small>LAYANAN</small>
                  <strong>Pilih platform</strong>
                </div>
                <b>⌄</b>
              </div>

              <div className="nk-number-preview">
                <div>
                  <small>VIRTUAL NUMBER</small>
                  <strong>+XX XXX XXX XXXX</strong>
                </div>

                <span className="nk-stock">
                  STOCK
                </span>
              </div>

              <div className="nk-otp-preview">
                <div className="nk-otp-title">
                  <span>OTP</span>
                  Menunggu kode verifikasi
                </div>

                <div className="nk-otp-boxes">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="nk-stats">
        <div className="nk-container nk-stats-grid">
          <div>
            <strong>Global</strong>
            <span>Cakupan nomor virtual</span>
          </div>

          <div>
            <strong>Real-Time</strong>
            <span>Ketersediaan katalog</span>
          </div>

          <div>
            <strong>24/7</strong>
            <span>Akses platform</span>
          </div>

          <div>
            <strong>OTP</strong>
            <span>Pantau dari dashboard</span>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="cara-kerja" className="nk-section nk-how">
        <div className="nk-container">
          <div className="nk-section-heading">
            <div>
              <div className="nk-section-label">
                <span>›</span> CARA KERJA
              </div>

              <h2>
                Tiga langkah sederhana.
                <span> Langsung ke tujuan.</span>
              </h2>

              <p>
                Proses dibuat sederhana supaya kamu tidak perlu melewati
                langkah yang tidak diperlukan.
              </p>
            </div>
          </div>

          <div className="nk-steps">
            {steps.map((step) => (
              <div className="nk-step-card" key={step.number}>
                <div className="nk-step-number">{step.number}</div>

                <div className="nk-step-line" />

                <h3>{step.title}</h3>
                <p>{step.text}</p>

                <div className="nk-step-arrow">→</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="layanan" className="nk-section nk-features-section">
        <div className="nk-container">
          <div className="nk-section-heading">
            <div>
              <div className="nk-section-label">
                <span>›</span> APA YANG KAMI SEDIAKAN
              </div>

              <h2>
                Semua kebutuhan nomor virtual
                <span> dalam satu tempat.</span>
              </h2>

              <p>
                Mulai dari pemilihan nomor sampai pemantauan OTP, semuanya
                dirancang dalam satu alur.
              </p>
            </div>
          </div>

          <div className="nk-feature-grid">
            {features.map((feature) => (
              <article className="nk-feature-card" key={feature.number}>
                <div className="nk-feature-icon">{feature.icon}</div>

                <h3>{feature.title}</h3>

                <p>{feature.text}</p>

                <span className="nk-feature-arrow">→</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM */}
      <section id="platform" className="nk-section nk-platform-section">
        <div className="nk-container">
          <div className="nk-platform-heading">
            <div>
              <div className="nk-section-label">
                <span>›</span> PLATFORM
              </div>

              <h2>
                Untuk berbagai kebutuhan
                <span> verifikasi.</span>
              </h2>

              <p>
                Pilih layanan yang tersedia ketika kamu sudah masuk ke
                dashboard.
              </p>
            </div>
          </div>

          <div className="nk-platform-list">
            {platforms.map((platform) => (
              <span key={platform} className="nk-platform-pill">
                <span className="nk-platform-dot" />
                {platform}
              </span>
            ))}
          </div>

          <div className="nk-platform-note">
            <span>→</span>
            Ketersediaan layanan mengikuti katalog yang tersedia pada sistem.
          </div>
        </div>
      </section>

      {/* WHY NOKOS */}
      <section className="nk-section nk-why">
        <div className="nk-container nk-why-grid">
          <div>
            <div className="nk-section-label">
              <span>›</span> NOKOS VIRTUAL
            </div>

            <h2>
              Dibuat supaya proses
              <span> tidak ribet.</span>
            </h2>

            <p>
              Kami membuat pengalaman pembelian nomor virtual lebih sederhana:
              katalog jelas, harga terlihat, saldo mudah digunakan, dan
              pesanan dapat dipantau dari satu tempat.
            </p>

            <Link href="/login" className="nk-btn nk-btn-primary">
              Buka Dashboard →
            </Link>
          </div>

          <div className="nk-why-list">
            <div>
              <strong>01</strong>
              <section>
                <h3>Satu dashboard</h3>
                <p>
                  Saldo, pembelian dan pesanan tersedia dalam satu akun.
                </p>
              </section>
            </div>

            <div>
              <strong>02</strong>
              <section>
                <h3>Informasi jelas</h3>
                <p>
                  Produk, harga dan status transaksi ditampilkan sebelum
                  proses pembelian.
                </p>
              </section>
            </div>

            <div>
              <strong>03</strong>
              <section>
                <h3>Alur otomatis</h3>
                <p>
                  Deposit dan proses pesanan terhubung dengan sistem sehingga
                  mengurangi proses manual.
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="nk-section nk-faq">
        <div className="nk-container nk-faq-grid">
          <div>
            <div className="nk-section-label">
              <span>›</span> FAQ
            </div>

            <h2>
              Pertanyaan yang
              <span> sering ditanyakan.</span>
            </h2>

            <p>
              Masih ada yang ingin kamu ketahui? Berikut beberapa pertanyaan
              yang paling umum.
            </p>
          </div>

          <div className="nk-faq-list">
            {faqs.map((faq, index) => (
              <details key={faq.q} open={index === 0}>
                <summary>
                  <span>{faq.q}</span>
                  <b>+</b>
                </summary>

                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="nk-cta-section">
        <div className="nk-container">
          <div className="nk-cta">
            <div className="nk-cta-glow" />

            <div className="nk-section-label">
              <span>›</span> SIAP MEMULAI?
            </div>

            <h2>
              Dapatkan nomor virtual
              <span> dengan cara yang lebih sederhana.</span>
            </h2>

            <p>
              Buat akun gratis dan mulai menjelajahi layanan yang tersedia di
              NOKOS Virtual.
            </p>

            <Link href="/login" className="nk-btn nk-btn-primary nk-btn-large">
              Mulai Sekarang
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="nk-footer">
        <div className="nk-container nk-footer-grid">
          <div>
            <Link href="/" className="nk-brand">
              <span className="nk-brand-icon">N</span>
              <span className="nk-brand-main">NOKOS</span>
              <span className="nk-brand-sub">VIRTUAL</span>
            </Link>

            <p>
              Marketplace nomor virtual untuk kebutuhan verifikasi SMS dan OTP.
            </p>
          </div>

          <div>
            <strong>Platform</strong>
            <a href="#layanan">Layanan</a>
            <a href="#cara-kerja">Cara Kerja</a>
            <a href="#platform">Platform</a>
          </div>

          <div>
            <strong>Akun</strong>
            <Link href="/login">Masuk</Link>
            <Link href="/login">Daftar</Link>
          </div>

          <div>
            <strong>Bantuan</strong>
            <a href="#faq">FAQ</a>
            <a href="#cara-kerja">Cara Kerja</a>
          </div>
        </div>

        <div className="nk-container nk-footer-bottom">
          <span>© 2026 NOKOS VIRTUAL. All rights reserved.</span>
          <span>Virtual Number Marketplace</span>
        </div>
      </footer>
    </main>
  );
}
