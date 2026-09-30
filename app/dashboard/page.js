"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      window.location.href = "/login";
      return;
    }

    setUser(user);

    const googleId = `google:${user.id}`;

    // Ambil data user dari Supabase
    const { data: userData } = await supabase
      .from("users")
      .select("balance")
      .eq("telegram_id", googleId)
      .maybeSingle();

    if (userData) {
      setBalance(Number(userData.balance || 0));
    }

    // Ambil order user
    const { data: orderData } = await supabase
      .from("orders")
      .select("*")
      .eq("telegram_id", googleId)
      .order("created_at", { ascending: false })
      .limit(10);

    setOrders(orderData || []);
    setLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();

    window.location.href = "/login";
  }

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#070b14",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Memuat dashboard...
      </main>
    );
  }

  const completedOrders = orders.filter(
    (order) =>
      String(order.status).toUpperCase() === "COMPLETED"
  ).length;

  const activeOrders = orders.filter(
    (order) =>
      ["ACTIVE", "PENDING", "WAITING", "WAITING_OTP"].includes(
        String(order.status).toUpperCase()
      )
  ).length;

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
          maxWidth: "1200px",
          margin: "auto",
        }}
      >
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
            NOKOS{" "}
            <span style={{ color: "#fff" }}>
              VIRTUAL
            </span>
          </div>

          <div
            style={{
              display: "flex",
              gap: "20px",
              alignItems: "center",
            }}
          >
            <Link href="/dashboard">
              Dashboard
            </Link>

            <Link href="/buy">
              Beli Nomor
            </Link>

            <Link href="/orders">
              Pesanan
            </Link>

            <button
              onClick={logout}
              style={{
                background: "transparent",
                border: "none",
                color: "#f87171",
                cursor: "pointer",
                fontSize: "15px",
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
            DASHBOARD
          </p>

          <h1
            style={{
              fontSize: "32px",
              margin: "8px 0",
            }}
          >
            Selamat datang kembali 👋
          </h1>

          <p style={{ color: "#94a3b8" }}>
            {user?.email || "Pengguna"}
          </p>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginTop: "30px",
          }}
        >
          <div className="feature">
            <p>💰 Saldo</p>

            <h2>
              Rp {balance.toLocaleString("id-ID")}
            </h2>
          </div>

          <div className="feature">
            <p>📦 Total Pesanan</p>

            <h2>
              {orders.length}
            </h2>
          </div>

          <div className="feature">
            <p>📱 Pesanan Aktif</p>

            <h2>
              {activeOrders}
            </h2>
          </div>

          <div className="feature">
            <p>✅ Selesai</p>

            <h2>
              {completedOrders}
            </h2>
          </div>
        </section>

        <section style={{ marginTop: "35px" }}>
          <h2>Menu Cepat</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              marginTop: "16px",
            }}
          >
            <Link
              href="/buy"
              className="feature"
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <h3>🛒 Beli Nomor</h3>

              <p>
                Pilih negara, layanan, dan operator.
              </p>
            </Link>

            <Link
              href="/deposit"
              className="feature"
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <h3>💳 Deposit</h3>

              <p>
                Tambahkan saldo ke akun.
              </p>
            </Link>

            <Link
              href="/orders"
              className="feature"
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <h3>📦 Pesanan</h3>

              <p>
                Lihat pesanan dan status OTP.
              </p>
            </Link>
          </div>
        </section>

        <section style={{ marginTop: "35px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2>Pesanan Terbaru</h2>

            <Link
              href="/orders"
              style={{
                color: "#5eead4",
              }}
            >
              Lihat semua →
            </Link>
          </div>

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
            {orders.length === 0 ? (
              <div
                style={{
                  padding: "30px",
                  textAlign: "center",
                  color: "#64748b",
                }}
              >
                Belum ada pesanan.
              </div>
            ) : (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "700px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      textAlign: "left",
                      color: "#94a3b8",
                    }}
                  >
                    <th style={{ padding: "12px" }}>
                      Layanan
                    </th>

                    <th style={{ padding: "12px" }}>
                      Negara
                    </th>

                    <th style={{ padding: "12px" }}>
                      Status
                    </th>

                    <th style={{ padding: "12px" }}>
                      Harga
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      style={{
                        borderTop:
                          "1px solid #1f2937",
                      }}
                    >
                      <td style={{ padding: "12px" }}>
                        {order.service_id || "-"}
                      </td>

                      <td style={{ padding: "12px" }}>
                        {order.country_id || "-"}
                      </td>

                      <td
                        style={{
                          padding: "12px",
                          color: "#5eead4",
                        }}
                      >
                        {order.status || "-"}
                      </td>

                      <td style={{ padding: "12px" }}>
                        Rp{" "}
                        {Number(
                          order.price || 0
                        ).toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
