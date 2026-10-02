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
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch("/api/orders", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Gagal memuat pesanan.");
      }
      setOrders(result.orders || []);
    } catch (error) {
      console.error(
        "ORDERS ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
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
    const value = String(
      status || ""
    ).toUpperCase();

    if (
      [
        "ACTIVE",
        "PENDING",
        "WAITING",
        "WAITING_OTP",
        "CREATING",
      ].includes(value)
    ) {
      return {
        background: "#164e63",
        color: "#67e8f9",
      };
    }

    if (
      [
        "COMPLETED",
        "SUCCESS",
        "FINISHED",
      ].includes(value)
    ) {
      return {
        background: "#14532d",
        color: "#86efac",
      };
    }

    if (
      [
        "EXPIRED",
        "CANCELED",
        "CANCELLED",
        "REFUNDED",
        "FAILED",
      ].includes(value)
    ) {
      return {
        background: "#3f1d2e",
        color: "#fda4af",
      };
    }

    return {
      background: "#1f2937",
      color: "#cbd5e1",
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
        {/* NAVBAR */}

        <nav
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            paddingBottom: "20px",
            borderBottom:
              "1px solid #1f2937",
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
            <span
              style={{
                color: "#fff",
              }}
            >
              VIRTUAL
            </span>
          </div>

          <div
            style={{
              display: "flex",
              gap: "18px",
              alignItems: "center",
            }}
          >
            <Link
              href="/dashboard"
              style={{
                color: "#cbd5e1",
                textDecoration: "none",
              }}
            >
              Dashboard
            </Link>

            <Link
              href="/buy"
              style={{
                color: "#cbd5e1",
                textDecoration: "none",
              }}
            >
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

        {/* HEADER */}

        <section
          style={{
            marginTop: "40px",
          }}
        >
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

          <p
            style={{
              color: "#94a3b8",
            }}
          >
            Riwayat nomor virtual dan
            status pesanan lu.
          </p>
        </section>

        {/* FILTER */}

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
              onClick={() =>
                setFilter(status)
              }
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                border:
                  "1px solid #374151",
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

        {/* TABLE */}

        <section
          style={{
            marginTop: "20px",
            background: "#111827",
            border:
              "1px solid #1f2937",
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
          ) : filteredOrders.length ===
            0 ? (
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
            <div
              style={{
                overflowX: "auto",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse:
                    "collapse",
                  minWidth: "1100px",
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
                    <th style={th}>
                      ORDER
                    </th>

                    <th style={th}>
                      SERVICE
                    </th>

                    <th style={th}>
                      COUNTRY
                    </th>

                    <th style={th}>
                      PHONE
                    </th>

                    <th style={th}>
                      OTP
                    </th>

                    <th style={th}>
                      STATUS
                    </th>

                    <th style={th}>
                      PRICE
                    </th>

                    <th style={th}>
                      DATE
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map(
                    (order) => (
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
                          {order.service_id ||
                            "-"}
                        </td>

                        <td style={td}>
                          🌎{" "}
                          {order.country_id ||
                            "-"}
                        </td>

                        <td style={td}>
                          {order.phone_number ||
                            "-"}
                        </td>

                        <td
                          style={{
                            ...td,
                            fontWeight: 800,
                            color:
                              order.otp_code
                                ? "#5eead4"
                                : "#64748b",
                          }}
                        >
                          {order.otp_code ||
                            "-"}
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
                              fontSize:
                                "12px",
                              fontWeight: 800,
                              display:
                                "inline-block",
                            }}
                          >
                            {order.status ||
                              "-"}
                          </span>
                        </td>

                        <td style={td}>
                          Rp{" "}
                          {Number(
                            order.price ||
                              0
                          ).toLocaleString(
                            "id-ID"
                          )}
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
                    )
                  )}
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
