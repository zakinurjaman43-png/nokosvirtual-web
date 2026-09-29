"use client";

import { useState } from "react";

export default function BuyPage() {
  const [service, setService] = useState("Semua Layanan");
  const [country, setCountry] = useState("Semua Negara");
  const [operator, setOperator] = useState("Semua Operator");

  const products = [
    {
      service: "WhatsApp",
      country: "Indonesia",
      operator: "Telkomsel",
      stock: 24,
      price: 5250,
    },
    {
      service: "Telegram",
      country: "Indonesia",
      operator: "Indosat",
      stock: 18,
      price: 4750,
    },
    {
      service: "WhatsApp",
      country: "Malaysia",
      operator: "Celcom",
      stock: 12,
      price: 6750,
    },
    {
      service: "Telegram",
      country: "Malaysia",
      operator: "Digi",
      stock: 9,
      price: 5750,
    },
  ];

  const filteredProducts = products.filter((item) => {
    return (
      (service === "Semua Layanan" || item.service === service) &&
      (country === "Semua Negara" || item.country === country) &&
      (operator === "Semua Operator" || item.operator === operator)
    );
  });

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

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: "20px",
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

          <a
            href="/dashboard"
            style={{
              color: "#94a3b8",
              textDecoration: "none",
            }}
          >
            ← Dashboard
          </a>
        </div>

        <section style={{ marginTop: "40px" }}>
          <p style={{ color: "#5eead4", fontWeight: 700 }}>
            BELI NOMOR
          </p>

          <h1 style={{ fontSize: "32px", margin: "8px 0" }}>
            Pilih Nomor Virtual
          </h1>

          <p style={{ color: "#94a3b8" }}>
            Pilih layanan, negara, dan operator yang tersedia.
          </p>
        </section>

        <section
          style={{
            marginTop: "30px",
            padding: "20px",
            background: "#111827",
            border: "1px solid #1f2937",
            borderRadius: "16px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
          }}
        >
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            style={selectStyle}
          >
            <option>Semua Layanan</option>
            <option>WhatsApp</option>
            <option>Telegram</option>
          </select>

          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={selectStyle}
          >
            <option>Semua Negara</option>
            <option>Indonesia</option>
            <option>Malaysia</option>
          </select>

          <select
            value={operator}
            onChange={(e) => setOperator(e.target.value)}
            style={selectStyle}
          >
            <option>Semua Operator</option>
            <option>Telkomsel</option>
            <option>Indosat</option>
            <option>Celcom</option>
            <option>Digi</option>
          </select>
        </section>

        <section
          style={{
            marginTop: "25px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "16px",
          }}
        >
          {filteredProducts.map((item, index) => (
            <div
              key={index}
              style={{
                background: "#111827",
                border: "1px solid #1f2937",
                borderRadius: "16px",
                padding: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <h2 style={{ margin: 0 }}>{item.service}</h2>

                <span
                  style={{
                    color: "#5eead4",
                    fontSize: "13px",
                  }}
                >
                  Stock {item.stock}
                </span>
              </div>

              <p style={{ color: "#94a3b8", marginBottom: "6px" }}>
                🌎 {item.country}
              </p>

              <p style={{ color: "#94a3b8" }}>
                📡 {item.operator}
              </p>

              <h2 style={{ marginTop: "20px" }}>
                Rp {item.price.toLocaleString("id-ID")}
              </h2>

              <button
                style={{
                  width: "100%",
                  marginTop: "10px",
                  padding: "12px",
                  border: "none",
                  borderRadius: "10px",
                  background: "#5eead4",
                  color: "#06111a",
                  fontWeight: 800,
                  cursor: "pointer",
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

const selectStyle = {
  width: "100%",
  padding: "13px",
  borderRadius: "10px",
  border: "1px solid #374151",
  background: "#070b14",
  color: "#fff",
  fontSize: "15px",
};
