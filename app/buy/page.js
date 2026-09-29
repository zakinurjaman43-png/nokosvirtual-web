import Link from "next/link";

const products = [
  {
    country: "🇮🇩 Indonesia",
    service: "WhatsApp",
    price: "Rp5.250",
  },
  {
    country: "🇮🇩 Indonesia",
    service: "Telegram",
    price: "Rp2.250",
  },
  {
    country: "🇺🇸 United States",
    service: "WhatsApp",
    price: "Rp2.700",
  },
  {
    country: "🇲🇾 Malaysia",
    service: "Telegram",
    price: "Rp1.750",
  },
];

export default function BuyPage() {
  return (
    <main>
      <div className="container">
        <nav className="nav">
          <div className="brand">
            NOKOS <span>STORE</span>
          </div>

          <div>
            <Link href="/">Home</Link>
            <Link href="/buy">Beli Nomor</Link>
            <Link href="/login">Masuk</Link>
          </div>
        </nav>

        <section className="hero">
          <div style={{ color: "#5eead4", fontWeight: 700 }}>
            🛒 BELI NOMOR
          </div>

          <h1>
            Pilih nomor
            <br />
            yang lu butuhkan.
          </h1>

          <p>
            Pilih negara dan layanan untuk mendapatkan nomor virtual
            dan menerima kode OTP.
          </p>
        </section>

        <section className="features">
          {products.map((product, index) => (
            <div className="feature" key={index}>
              <div style={{ fontSize: 30 }}>
                {product.country.split(" ")[0]}
              </div>

              <h3>{product.country}</h3>

              <p>
                Layanan: <b>{product.service}</b>
              </p>

              <p
                style={{
                  color: "#5eead4",
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                {product.price}
              </p>

              <button
                className="btn primary"
                style={{
                  border: "none",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                Beli Nomor
              </button>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
