import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const { data: users, error } = await supabaseAdmin
    .from("users")
    .select(
      "id, telegram_id, username, first_name, balance, is_active, created_at"
    )
    .order("created_at", { ascending: false });

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#070b14",
        color: "#fff",
        padding: "30px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
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
          <h1 style={{ marginTop: 0 }}>👥 Users</h1>

          <p style={{ color: "#94a3b8" }}>
            Data user langsung dari Supabase.
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
              Gagal mengambil data:
              <br />
              {error.message}
            </div>
          ) : (
            <div style={{ marginTop: "25px", overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
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
                    <th style={{ padding: "12px" }}>Username</th>
                    <th style={{ padding: "12px" }}>Nama</th>
                    <th style={{ padding: "12px" }}>Saldo</th>
                    <th style={{ padding: "12px" }}>Status</th>
                    <th style={{ padding: "12px" }}>Terdaftar</th>
                  </tr>
                </thead>

                <tbody>
                  {users?.length ? (
                    users.map((user) => (
                      <tr
                        key={user.id}
                        style={{
                          borderBottom: "1px solid #1f2937",
                        }}
                      >
                        <td style={{ padding: "12px" }}>
                          {user.id}
                        </td>

                        <td style={{ padding: "12px" }}>
                          {user.telegram_id || "-"}
                        </td>

                        <td style={{ padding: "12px" }}>
                          {user.username
                            ? `@${user.username}`
                            : "-"}
                        </td>

                        <td style={{ padding: "12px" }}>
                          {user.first_name || "-"}
                        </td>

                        <td
                          style={{
                            padding: "12px",
                            color: "#5eead4",
                            fontWeight: 700,
                          }}
                        >
                          Rp{" "}
                          {Number(user.balance || 0).toLocaleString(
                            "id-ID"
                          )}
                        </td>

                        <td style={{ padding: "12px" }}>
                          {user.is_active ? (
                            <span style={{ color: "#22c55e" }}>
                              ● Aktif
                            </span>
                          ) : (
                            <span style={{ color: "#ef4444" }}>
                              ● Nonaktif
                            </span>
                          )}
                        </td>

                        <td
                          style={{
                            padding: "12px",
                            color: "#94a3b8",
                          }}
                        >
                          {user.created_at
                            ? new Date(
                                user.created_at
                              ).toLocaleString("id-ID")
                            : "-"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        style={{
                          padding: "30px",
                          textAlign: "center",
                          color: "#64748b",
                        }}
                      >
                        Belum ada user.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div
            style={{
              marginTop: "20px",
              color: "#64748b",
            }}
          >
            Total user:{" "}
            <strong>{users?.length || 0}</strong>
          </div>
        </div>
      </div>
    </main>
  );
}
