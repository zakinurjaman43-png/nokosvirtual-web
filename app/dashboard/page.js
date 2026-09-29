import Link from "next/link";

export default function Dashboard() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#070b14",
        color: "#fff",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "auto" }}>

        {/* NAVBAR */}
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "18px 0",
            borderBottom: "1px solid #1f2937",
          }}
        >
          <div
            style={{
              fontSize: "22px",
              fontWeight: 800,
              color: "#5eead4",
            }}
          >
            NOKOS <span style={{ color: "#fff" }}>VIRTUAL</span>
          </div>

          <div style={{ display: "flex", gap: "22px" }}>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/buy">Beli Nomor</Link>
            <Link href="/login">Keluar</Link>
          </div>
        </nav>

        {/* WELCOME */}
        <section style={{ marginTop: "40px" }}>
          <p style={{ color: "#5eead4", fontWeight: 700 }}>
            DASHBOARD
          </p>

          <h1 style={{ fontSize: "32px", margin: "8px 0" }}>
            Selamat datang kembali 👋
          </h1>

          <p style={{ color: "#94a3b8" }}>
            Kelola saldo, pesanan, dan nomor virtual lu di sini.
          </p>
        </section>

        {/* STAT CARDS */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginTop: "30px",
          }}
        >
          <div className="feature">
            <p>💰 Saldo</p>
            <h2>Rp 95.000</h2>
          </div>

          <div className="feature">
            <p>📦 Pesanan</p>
            <h2>14</h2>
          </div>

          <div className="feature">
            <p>📱 Nomor Aktif</p>
            <h2>2</h2>
          </div>

          <div className="feature">
            <p>💳 Total Deposit</p>
            <h2>Rp 250.000</h2>
          </div>
        </section>

        {/* QUICK MENU */}
        <section style={{ marginTop: "35px" }}>
          <h2>Menu Cepat</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              marginTop: "16px",
            }}
          >
            <Link href="/buy" className="feature">
              <h3>🛒 Beli Nomor</h3>
              <p>Pilih negara, layanan, dan operator.</p>
            </Link>

            <div className="feature">
              <h3>💳 Deposit</h3>
              <p>Tambah saldo untuk membeli nomor.</p>
            </div>

            <div className="feature">
              <h3>📦 Pesanan</h3>
              <p>Lihat semua pesanan dan status OTP.</p>
            </div>

            <div className="feature">
              <h3>📊 Transaksi</h3>
              <p>Lihat riwayat saldo dan pembayaran.</p>
            </div>
          </div>
        </section>

        {/* RECENT ORDERS */}
        <section style={{ marginTop: "35px" }}>
          <h2>Pesanan Terbaru</h2>

          <div
            style={{
              marginTop: "16px",
              padding: "20px",
              background: "#111827",
              border: "1px solid #1f2937",
              borderRadius: "16px",
              overflowX: "auto",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", color: "#94a3b8" }}>
                  <th style={{ padding: "12px" }}>Layanan</th>
                  <th style={{ padding: "12px" }}>Negara</th>
                  <th style={{ padding: "12px" }}>Status</th>
                  <th style={{ padding: "12px" }}>Harga</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td style={{ padding: "12px" }}>WhatsApp</td>
                  <td style={{ padding: "12px" }}>🇮🇩 Indonesia</td>
                  <td style={{ padding: "12px", color: "#5eead4" }}>
                    Menunggu OTP
                  </td>
                  <td style={{ padding: "12px" }}>Rp 5.250</td>
                </tr>

                <tr>
                  <td style={{ padding: "12px" }}>Telegram</td>
                  <td style={{ padding: "12px" }}>🇲🇾 Malaysia</td>
                  <td style={{ padding: "12px", color: "#22c55e" }}>
                    Selesai
                  </td>
                  <td style={{ padding: "12px" }}>Rp 1.750</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </main>
  );
}
