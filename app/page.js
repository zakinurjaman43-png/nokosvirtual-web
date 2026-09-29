import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div className="container">
        <nav className="nav">
          <div className="brand">
            NOKOS <span>STORE</span>
          </div>

          <div>
            <Link href="/">Home</Link>
            <Link href="#fitur">Fitur</Link>
            <Link href="/login">Masuk</Link>
          </div>
        </nav>

        <section className="hero">
          <div style={{ color: "#5eead4", fontWeight: 700 }}>
            ⚡ Virtual Number Service
          </div>

          <h1>
            Nomor virtual.
            <br />
            Cepat & simpel.
          </h1>

          <p>
            Beli nomor virtual untuk kebutuhan verifikasi SMS dengan proses
            otomatis, saldo fleksibel, dan riwayat pesanan yang rapi.
          </p>

          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <Link href="/login" className="btn primary">
              Mulai Sekarang
            </Link>

            <a href="#fitur" className="btn dark">
              Lihat Fitur
            </a>
          </div>
        </section>

        <section id="fitur" className="features">
          <div className="feature">
            <h3>🌎 Banyak Negara</h3>
            <p>
              Pilih negara dan layanan dari katalog yang tersedia.
            </p>
          </div>

          <div className="feature">
            <h3>⚡ OTP Realtime</h3>
            <p>
              Status pesanan dan OTP dirancang untuk dipantau realtime.
            </p>
          </div>

          <div className="feature">
            <h3>💳 Saldo & QRIS</h3>
            <p>
              Isi saldo dengan metode pembayaran yang tersedia.
            </p>
          </div>

          <div className="feature">
            <h3>📦 Riwayat Pesanan</h3>
            <p>
              Pantau nomor, status pesanan, dan riwayat transaksi.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
