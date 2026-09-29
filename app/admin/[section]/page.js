import Link from "next/link";

const pages = {
  users: {
    title: "Users",
    icon: "👥",
    description: "Kelola akun user NOKOS VIRTUAL.",
  },

  orders: {
    title: "Orders",
    icon: "📦",
    description: "Kelola pesanan nomor virtual dan status order.",
  },

  deposits: {
    title: "Deposits",
    icon: "💳",
    description: "Kelola deposit dan permintaan top up user.",
  },

  transactions: {
    title: "Transactions",
    icon: "💰",
    description: "Lihat transaksi saldo dan pembayaran.",
  },

  support: {
    title: "Support Tickets",
    icon: "🎫",
    description: "Kelola tiket bantuan dari user.",
  },

  affiliate: {
    title: "Affiliate",
    icon: "🤝",
    description: "Kelola sistem affiliate dan komisi.",
  },

  pricing: {
    title: "Pricing",
    icon: "⚙️",
    description: "Kelola harga produk dan margin NOKOS.",
  },
};

export default async function AdminSectionPage({ params }) {
  const { section } = await params;

  const page = pages[section];

  if (!page) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#070b14",
          color: "#fff",
          padding: "40px",
          boxSizing: "border-box",
        }}
      >
        <h1>404 - Menu tidak ditemukan</h1>

        <Link
          href="/admin"
          style={{
            color: "#5eead4",
            textDecoration: "none",
          }}
        >
          ← Kembali ke Admin
        </Link>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#070b14",
        color: "#fff",
        padding: "30px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* BACK */}
        <Link
          href="/admin"
          style={{
            color: "#5eead4",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          ← Kembali ke Dashboard
        </Link>

        {/* CARD */}
        <div
          style={{
            marginTop: "25px",
            background: "#111827",
            border: "1px solid #1f2937",
            borderRadius: "16px",
            padding: "30px",
          }}
        >
          <div
            style={{
              fontSize: "40px",
            }}
          >
            {page.icon}
          </div>

          <h1
            style={{
              margin: "12px 0 8px",
              fontSize: "32px",
            }}
          >
            {page.title}
          </h1>

          <p
            style={{
              color: "#94a3b8",
              margin: 0,
            }}
          >
            {page.description}
          </p>

          <div
            style={{
              marginTop: "30px",
              padding: "20px",
              border: "1px dashed #334155",
              borderRadius: "12px",
              color: "#64748b",
            }}
          >
            Halaman {page.title} sudah aktif.
            <br />
            Fungsionalitas database akan kita pasang
            di tahap berikutnya.
          </div>
        </div>
      </div>
    </main>
  );
}
