import Link from "next/link";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const { data: orders, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#070b14",
        color: "#fff",
        padding: "30px",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>

        <Link
          href="/admin"
          style={{
            color: "#5eead4",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          ← Kembali ke Dashboard
        </Link>

        <div
          style={{
            marginTop: "25px",
            background: "#111827",
            border: "1px solid #1f2937",
            borderRadius: "16px",
            padding: "25px",
          }}
        >
          <h1 style={{ marginTop: 0 }}>📦 Orders</h1>

          <p style={{ color: "#94a3b8" }}>
            Pesanan terbaru dari Supabase.
          </p>

          {error ? (
            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                background: "#3f1515",
                border: "1px solid #7f1d1d",
                borderRadius: "10px",
                color: "#fca5a5",
              }}
            >
              <strong>Gagal mengambil data:</strong>
              <br />
              {error.message}
            </div>
          ) : (
            <div
              style={{
                marginTop: "25px",
                overflowX: "auto",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "950px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      textAlign: "left",
                      color: "#94a3b8",
                      borderBottom: "1px solid #1f2937",
                    }}
                  >
                    <th style={{ padding: "12px" }}>ID</th>
                    <th style={{ padding: "12px" }}>Telegram ID</th>
                    <th style={{ padding: "12px" }}>Service</th>
                    <th style={{ padding: "12px" }}>Country</th>
                    <th style={{ padding: "12px" }}>Nomor</th>
                    <th style={{ padding: "12px" }}>Harga</th>
                    <th style={{ padding: "12px" }}>Status</th>
                    <th style={{ padding: "12px" }}>Tanggal</th>
                  </tr>
                </thead>

                <tbody>
                  {orders?.length ? (
                    orders.map((order) => (
                      <tr
                        key={order.id}
                        style={{
                          borderBottom: "1px solid #1f2937",
                        }}
                      >
                        <td style={{ padding: "12px" }}>
                          {order.id}
                        </td>

                        <td style={{ padding: "12px" }}>
                          {order.telegram_id || "-"}
                        </td>

                        <td style={{ padding: "12px" }}>
                          {order.service_id || "-"}
                        </td>

                        <td style={{ padding: "12px" }}>
                          {order.country_id || "-"}
                        </td>

                        <td style={{ padding: "12px" }}>
                          {order.phone_number || "-"}
                        </td>

                        <td
                          style={{
                            padding: "12px",
                            color: "#5eead4",
                            fontWeight: 700,
                          }}
                        >
                          Rp{" "}
                          {Number(
                            order.price || 0
                          ).toLocaleString("id-ID")}
                        </td>

                        <td style={{ padding: "12px" }}>
                          {order.status || "-"}
                        </td>

                        <td
                          style={{
                            padding: "12px",
                            color: "#94a3b8",
                          }}
                        >
                          {order.created_at
                            ? new Date(
                                order.created_at
                              ).toLocaleString("id-ID")
                            : "-"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        style={{
                          padding: "40px",
                          textAlign: "center",
                          color: "#64748b",
                        }}
                      >
                        Belum ada order.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
