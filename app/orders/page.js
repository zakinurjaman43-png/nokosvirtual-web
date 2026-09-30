"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const googleId = `google:${user.id}`;

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("telegram_id", googleId)
      .order("created_at", {
        ascending: false,
      });

    if (!error) {
      setOrders(data || []);
    }

    setLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  const filteredOrders =
    filter === "ALL"
      ? orders
      : orders.filter(
          (order) =>
            String(order.status).toUpperCase() ===
            filter
        );

  function statusStyle(status) {
    const value = String(status || "").toUpperCase();

    if (
      ["ACTIVE", "PENDING", "WAITING", "WAITING_OTP"].includes(
        value
      )
    ) {
      return {
        background: "#164e63",
        color: "#67e8f9",
      };
    }

    if (value === "COMPLETED") {
      return {
        background: "#14532d",
        color: "#86efac",
      };
    }

    return {
      background: "#3f1d2e",
      color: "#fda4af",
    };
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
      <div
        style={{
          maxWidth: "1300px",
          margin: "auto",
        }}
      >
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
            NOKOS{" "}
            <span style={{ color: "#fff" }}>
              VIRTUAL
            </span>
          </div>

          <div
            style={{
              display: "flex",
              gap: "18px",
            }}
          >
            <Link href="/dashboard">
              Dashboard
            </Link>

            <Link href="/buy">
              Beli Nomor
            </Link>

            <button
              onClick={logout}
              style={{
                background: "none",
                border: "none",
                color: "#f87171",
                cursor: "pointer",
              }}
            >
              Keluar
            </button>
          </div>
        </nav>

        <section style={{ marginTop: "40px" }}>
          <p
            style={{
              color: "#5eead4",
              fontWeight: 700,
            }}
          >
            PESANAN
          </p>

          <h1
            style={{
              fontSize: "32px",
              margin: "8px 0",
            }}
          >
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
          {[
            "ALL",
            "ACTIVE",
            "PENDING",
            "COMPLETED",
            "EXPIRED",
            "CANCELED",
          ].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                border: "1px solid #374151",
                background:
                  filter === status
                    ? "#5eead4"
                    : "#111827",
                color:
                  filter === status
                    ? "#06111a"
                    : "#cbd5e1",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {status === "ALL"
                ? "Semua"
                : status}
            </button>
          ))}
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
          {loading ? (
            <div
              style={{
                padding: "50px",
                textAlign: "center",
                color: "#94a3b8",
              }}
            >
              Memuat pesanan...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div
              style={{
                padding: "60px",
                textAlign: "center",
                color: "#64748b",
              }}
            >
              Belum ada pesanan.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "1000px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom:
                        "1px solid #1f2937",
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
                        borderBottom:
                          "1px solid #1f2937",
                      }}
                    >
                      <td style={td}>
                        #{order.id}
                      </td>

                      <td style={td}>
                        📱{" "}
                        {order.service_id || "-"}
                      </td>

                      <td style={td}>
                        🌎{" "}
                        {order.country_id || "-"}
                      </td>

                      <td style={td}>
                        {order.phone_number || "-"}
                      </td>

                      <td style={td}>
                        <span
                          style={{
                            ...statusStyle(
                              order.status
                            ),
                            padding:
                              "6px 10px",
                            borderRadius:
                              "999px",
                            fontSize: "12px",
                            fontWeight: 800,
                          }}
                        >
                          {order.status || "-"}
                        </span>
                      </td>

                      <td style={td}>
                        Rp{" "}
                        {Number(
                          order.price || 0
                        ).toLocaleString("id-ID")}
                      </td>

                      <td style={td}>
                        {order.created_at
                          ? new Date(
                              order.created_at
                            ).toLocaleString(
                              "id-ID"
                            )
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
