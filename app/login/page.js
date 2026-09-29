import Link from "next/link";

export default function Login() {
  return (
    <main>
      <div className="container">
        <div className="formbox">
          <div className="brand">
            NOKOS <span>STORE</span>
          </div>

          <h2>Masuk ke akun</h2>

          <p style={{ color: "#9eabbf" }}>
            Masuk untuk membeli nomor virtual dan mengelola saldo.
          </p>

          <button
            className="btn primary"
            style={{ width: "100%", marginTop: 12 }}
          >
            Masuk dengan Google
          </button>

          <button
            className="btn dark"
            style={{ width: "100%", marginTop: 10 }}
          >
            Masuk dengan Telegram
          </button>

          <Link
            href="/"
            style={{
              display: "block",
              marginTop: 22,
              color: "#72efb1"
            }}
          >
            ← Kembali
          </Link>
        </div>
      </div>
    </main>
  );
}
