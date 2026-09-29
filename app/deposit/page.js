"use client";

import { useState } from "react";

const deposits = [
  {
    id: "#D36EFE35",
    amount: 10000,
    fee: 200,
    method: "QRIS",
    status: "CREDITED",
    date: "Sep 27 07:47 PM",
  },
  {
    id: "#EB66B513",
    amount: 10000,
    fee: 200,
    method: "QRIS",
    status: "CREDITED",
    date: "Sep 20 08:11 AM",
  },
  {
    id: "#E0FC2876",
    amount: 10000,
    fee: 200,
    method: "QRIS",
    status: "CREDITED",
    date: "Aug 18 04:23 AM",
  },
];

export default function DepositPage() {
  const [method, setMethod] = useState("QRIS");
  const [amount, setAmount] = useState("");

  const quickAmounts = [10000, 25000, 50000, 100000, 500000];

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
            padding: "24px",
            background: "#111827",
            border: "1px solid #1f2937",
            borderRadius: "16px",
            maxWidth: "700px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            New Deposit
          </h2>

          <p style={{ color: "#94a3b8", fontSize: "14px" }}>
            Payment Method
          </p>

          <button
            onClick={() => setMethod("QRIS")}
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "10px",
              border:
                method === "QRIS"
                  ? "1px solid #5eead4"
                  : "1px solid #374151",
              background:
                method === "QRIS" ? "#0f292b" : "#070b14",
              color: "#fff",
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            💳 <strong>QRIS</strong>
            <br />
            <span style={{ color: "#94a3b8", fontSize: "13px" }}>
              Pembayaran otomatis melalui QRIS
            </span>
          </button>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "14px",
              marginTop: "24px",
            }}
          >
            Amount (IDR)
          </p>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter deposit amount"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #374151",
              background: "#070b14",
              color: "#fff",
              fontSize: "15px",
            }}
          />

          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              marginTop: "12px",
            }}
          >
            {quickAmounts.map((value) => (
              <button
                key={value}
                onClick={() => setAmount(value)}
                style={{
                  padding: "9px 13px",
                  borderRadius: "8px",
                  border: "1px solid #374151",
                  background: "#070b14",
                  color: "#cbd5e1",
                  cursor: "pointer",
                }}
              >
                Rp {value.toLocaleString("id-ID")}
              </button>
            ))}
          </div>

          <button
            onClick={() =>
              alert(
                "Fitur pembayaran akan dihubungkan ke Midtrans."
              )
            }
            style={{
              width: "100%",
              marginTop: "22px",
              padding: "14px",
              border: "none",
              borderRadius: "10px",
              background: "#5eead4",
              color: "#06111a",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Create Deposit
          </button>
        </section>

        <section style={{ marginTop: "40px" }}>
          <h2>Deposit History</h2>

          <div
            style={{
              marginTop: "16px",
              background: "#111827",
              border: "1px solid #1f2937",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  minWidth: "750px",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: "1px solid #1f2937",
                      color: "#64748b",
                      textAlign: "left",
                    }}
                  >
                    <th style={th}>ID</th>
                    <th style={th}>AMOUNT</th>
                    <th style={th}>FEE</th>
                    <th style={th}>METHOD</th>
                    <th style={th}>STATUS</th>
                    <th style={th}>DATE</th>
                  </tr>
                </thead>

                <tbody>
                  {deposits.map((deposit) => (
                    <tr
                      key={deposit.id}
                      style={{
                        borderBottom: "1px solid #1f2937",
                      }}
                    >
                      <td style={td}>{deposit.id}</td>
                      <td style={td}>
                        Rp {deposit.amount.toLocaleString("id-ID")}
                      </td>
                      <td style={td}>
                        Rp {deposit.fee.toLocaleString("id-ID")}
                      </td>
                      <td style={td}>{deposit.method}</td>
                      <td style={td}>
                        <span
                          style={{
                            padding: "6px 10px",
                            borderRadius: "999px",
                            background: "#14532d",
                            color: "#86efac",
                            fontSize: "12px",
                            fontWeight: 800,
                          }}
                        >
                          {deposit.status}
                        </span>
                      </td>
                      <td style={td}>{deposit.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

const th = {
  padding: "16px",
  fontSize: "12px",
  fontWeight: 800,
};

const td = {
  padding: "17px 16px",
  color: "#cbd5e1",
  fontSize: "14px",
};
