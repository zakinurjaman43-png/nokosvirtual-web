"use client";

import { useState } from "react";

export default function DepositPage() {
  const [amount, setAmount] = useState("");

  const quickAmounts = [15000, 25000, 50000, 100000, 250000, 500000];

  function formatRupiah(value) {
    return Number(value || 0).toLocaleString("id-ID");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#070b14",
        color: "#fff",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "auto" }}>
        <nav
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
        </nav>

        <section style={{ marginTop: "40px" }}>
          <p style={{ color: "#5eead4", fontWeight: 700 }}>
            DEPOSIT
          </p>

          <h1 style={{ fontSize: "32px", margin: "8px 0" }}>
            Isi Saldo
          </h1>

          <p style={{ color: "#94a3b8" }}>
            Tambahkan saldo untuk membeli nomor virtual.
          </p>
        </section>

        <section
          style={{
            marginTop: "30px",
            background: "#111827",
            border: "1px solid #1f2937",
            borderRadius: "18px",
            padding: "24px",
          }}
        >
          <label
            style={{
              display: "block",
              marginBottom: "10px",
              fontWeight: 700,
            }}
          >
            Nominal Deposit
          </label>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#070b14",
              border: "1px solid #374151",
              borderRadius: "12px",
              padding: "0 14px",
            }}
          >
            <span style={{ color: "#94a3b8" }}>Rp</span>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Masukkan nominal"
              style={{
                width: "100%",
                padding: "15px 10px",
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#fff",
                fontSize: "16px",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(120px, 1fr))",
              gap: "10px",
              marginTop: "15px",
            }}
          >
            {quickAmounts.map((value) => (
              <button
                key={value}
                onClick={() => setAmount(String(value))}
                style={{
                  padding: "11px",
                  borderRadius: "10px",
                  border: "1px solid #374151",
                  background: "#070b14",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Rp {formatRupiah(value)}
              </button>
            ))}
          </div>

          <div
            style={{
              marginTop: "22px",
              padding: "15px",
              borderRadius: "12px",
              background: "#0b1220",
              color: "#94a3b8",
            }}
          >
            💳 Pembayaran: <strong style={{ color: "#fff" }}>
              QRIS
            </strong>
            <br />
            <small>
              Minimum deposit Rp15.000
            </small>
          </div>

          <button
            disabled={!amount || Number(amount) < 15000}
            style={{
              width: "100%",
              marginTop: "20px",
              padding: "14px",
              border: "none",
              borderRadius: "12px",
              background:
                amount && Number(amount) >= 15000
                  ? "#5eead4"
                  : "#374151",
              color:
                amount && Number(amount) >= 15000
                  ? "#06111a"
                  : "#94a3b8",
              fontWeight: 800,
              fontSize: "16px",
              cursor:
                amount && Number(amount) >= 15000
                  ? "pointer"
                  : "not-allowed",
            }}
          >
            Buat Pembayaran QRIS
          </button>
        </section>

        <section
          style={{
            marginTop: "25px",
            padding: "20px",
            background: "#111827",
            border: "1px solid #1f2937",
            borderRadius: "18px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            Riwayat Deposit
          </h2>

          <p style={{ color: "#94a3b8" }}>
            Belum ada transaksi deposit.
          </p>
        </section>
      </div>
    </main>
  );
}
