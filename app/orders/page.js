"use client";

import { useState } from "react";

const orders = [
  {
    id: "#161086557",
    service: "WhatsApp",
    country: "Indonesia",
    phone: "6283172620894",
    status: "ACTIVE",
    price: 1748,
    date: "Sep 27 19:51",
  },
  {
    id: "#161086556",
    service: "WhatsApp",
    country: "Indonesia",
    phone: "6281234567890",
    status: "COMPLETED",
    price: 2250,
    date: "Sep 27 19:40",
  },
  {
    id: "#161086555",
    service: "Telegram",
    country: "Malaysia",
    phone: "60123456789",
    status: "EXPIRED",
    price: 2750,
    date: "Sep 27 19:32",
  },
  {
    id: "#161086554",
    service: "WhatsApp",
    country: "Indonesia",
    phone: "6289876543210",
    status: "CANCELED",
    price: 1970,
    date: "Sep 27 19:20",
  },
];

export default function OrdersPage() {
  const [filter, setFilter] = useState("ALL");

  const filteredOrders =
    filter === "ALL"
      ? orders
      : orders.filter((order) => order.status === filter);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#070b14",
        color: "#fff",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: "1300px", margin: "auto" }}>

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
          <p
            style={{
              color: "#5eead4",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            PESANAN
          </p>

          <h1 style={{ fontSize: "32px", margin: 0 }}>
            Semua Pesanan
          </h1>

          <p style={{ color: "#94a3b8" }}>
            Riwayat nomor virtual dan status pesanan lu.
          </p>
        </section>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginTop: "28px",
          }}
        >
          {["ALL", "ACTIVE", "COMPLETED", "EXPIRED", "CANCELED"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                style={{
                  padding: "10px 16px",
                  borderRadius: "10px",
                  border: "1px solid #374151",
                  background:
                    filter === status ? "#5eead4" : "#111827",
                  color:
                    filter === status ? "#06111a" : "#cbd5e1",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {status === "ALL" ? "Semua" : status}
              </button>
            )
          )}
        </div>

        <section
          style={{
            marginTop: "20px",
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
                borderCollapse: "collapse",
                minWidth: "900px",
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
                  <th style={th}>ORDER</th>
                  <th style={th}>SERVICE</th>
                  <th style={th}>COUNTRY</th>
                  <th style={th}>PHONE</th>
                  <th style={th}>STATUS</th>
                  <th style={th}>PRICE</th>
                  <th style={th}>DATE</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    style={{
                      borderBottom: "1px solid #1f2937",
                    }}
                  >
                    <td style={td}>{order.id}</td>

                    <td style={td}>
                      📱 {order.service}
                    </td>

                    <td style={td}>
                      🇮🇩 {order.country}
                    </td>

                    <td style={td}>
                      {order.phone}
                    </td>

                    <td style={td}>
                      <span
                        style={{
                          padding: "6px 10px",
                          borderRadius: "999px",
                          fontSize: "12px",
                          fontWeight: 800,
                          background:
                            order.status === "ACTIVE"
                              ? "#164e63"
                              : order.status === "COMPLETED"
                              ? "#14532d"
                              : "#3f1d2e",
                          color:
                            order.status === "ACTIVE"
                              ? "#67e8f9"
                              : order.status === "COMPLETED"
                              ? "#86efac"
                              : "#fda4af",
                        }}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td style={td}>
                      Rp {order.price.toLocaleString("id-ID")}
                    </td>

                    <td style={td}>
                      {order.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div
              style={{
                padding: "50px",
                textAlign: "center",
                color: "#64748b",
              }}
            >
              Belum ada pesanan.
            </div>
          )}
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
  padding: "18px 16px",
  color: "#cbd5e1",
  fontSize: "14px",
};
