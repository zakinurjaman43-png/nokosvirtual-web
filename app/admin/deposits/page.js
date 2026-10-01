import Link from "next/link";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export const dynamic = "force-dynamic";

function formatRupiah(value) {
  return Number(value || 0).toLocaleString("id-ID");
}

function formatDate(value) {
  if (!value) return "-";

  return new Date(value).toLocaleString(
    "id-ID",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );
}

function getStatusStyle(status) {
  switch (status) {
    case "settlement":
      return {
        background: "#123b2d",
        color: "#5eead4",
      };

    case "pending":
      return {
        background: "#3b3218",
        color: "#facc15",
      };

    case "expire":
    case "cancel":
    case "deny":
    case "failed":
      return {
        background: "#3b1d24",
        color: "#fca5a5",
      };

    default:
      return {
        background: "#172033",
        color: "#94a3b8",
      };
  }
}

export default async function DepositsPage() {
  const [
    { data: deposits, error: depositsError },
    { data: users, error: usersError },
  ] = await Promise.all([
    supabaseAdmin
      .from("deposits")
      .select("*")
      .order("created_at", {
        ascending: false,
      })
      .limit(200),

    supabaseAdmin
      .from("users")
      .select(
        "id, email, telegram_id, first_name"
      ),
  ]);

  const userMap = new Map();

  (users || []).forEach((user) => {
    userMap.set(user.id, user);
  });

  const rows = (deposits || []).map(
    (deposit) => ({
      ...deposit,
      user: userMap.get(
        deposit.user_id
      ),
    })
  );

  const totalDeposits = rows.length;

  const pendingCount = rows.filter(
    (deposit) =>
      deposit.status === "pending"
  ).length;

  const settlementCount = rows.filter(
    (deposit) =>
      deposit.status === "settlement"
  ).length;

  const totalSettlement = rows
    .filter(
      (deposit) =>
        deposit.status === "settlement"
    )
    .reduce(
      (total, deposit) =>
        total +
        Number(deposit.amount || 0),
      0
    );

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
      <div
        style={{
          maxWidth: "1500px",
          margin: "0 auto",
        }}
      >
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
            marginBottom: "25px",
          }}
        >
          <p
            style={{
              color: "#5eead4",
              fontWeight: 700,
              margin: 0,
            }}
          >
            ADMIN
          </p>

          <h1
            style={{
              fontSize: "32px",
              margin: "8px 0",
            }}
          >
            💳 Deposits
          </h1>

          <p
            style={{
              color: "#64748b",
              margin: 0,
            }}
          >
            Pantau semua deposit saldo user.
          </p>
        </div>

        {depositsError ||
        usersError ? (
          <div
            style={{
              background: "#3f1515",
              border:
                "1px solid #7f1d1d",
              borderRadius: "12px",
              padding: "18px",
              color: "#fca5a5",
              marginBottom: "20px",
            }}
          >
            <strong>
              Gagal mengambil data.
            </strong>

            <br />

            {depositsError?.message ||
              usersError?.message}
          </div>
        ) : null}

        {/* STATS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
            marginBottom: "25px",
          }}
        >
          <StatCard
            icon="💳"
            title="Total Deposit"
            value={totalDeposits}
          />

          <StatCard
            icon="⏳"
            title="Pending"
            value={pendingCount}
          />

          <StatCard
            icon="✅"
            title="Berhasil"
            value={settlementCount}
          />

          <StatCard
            icon="💰"
            title="Total Masuk"
            value={`Rp ${formatRupiah(
              totalSettlement
            )}`}
          />
        </div>

        {/* TABLE */}

        <section
          style={{
            background: "#111827",
            border:
              "1px solid #1f2937",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              gap: "15px",
              marginBottom: "20px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                }}
              >
                Riwayat Deposit
              </h2>

              <p
                style={{
                  color: "#64748b",
                  margin:
                    "6px 0 0",
                }}
              >
                Maksimal 200 transaksi
                terbaru.
              </p>
            </div>

            <Link
              href="/admin"
              style={{
                color: "#5eead4",
                textDecoration:
                  "none",
                fontWeight: 700,
              }}
            >
              Dashboard →
            </Link>
          </div>

          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                minWidth: "1200px",
                borderCollapse:
                  "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    textAlign: "left",
                    color:
                      "#94a3b8",
                    borderBottom:
                      "1px solid #1f2937",
                  }}
                >
                  <th
                    style={{
                      padding:
                        "12px",
                    }}
                  >
                    ID
                  </th>

                  <th
                    style={{
                      padding:
                        "12px",
                    }}
                  >
                    User
                  </th>

                  <th
                    style={{
                      padding:
                        "12px",
                    }}
                  >
                    Nominal
                  </th>

                  <th
                    style={{
                      padding:
                        "12px",
                    }}
                  >
                    Order ID
                  </th>

                  <th
                    style={{
                      padding:
                        "12px",
                    }}
                  >
                    Transaction ID
                  </th>

                  <th
                    style={{
                      padding:
                        "12px",
                    }}
                  >
                    Status
                  </th>

                  <th
                    style={{
                      padding:
                        "12px",
                    }}
                  >
                    Dibuat
                  </th>

                  <th
                    style={{
                      padding:
                        "12px",
                    }}
                  >
                    Dibayar
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.length > 0 ? (
                  rows.map(
                    (deposit) => {
                      const statusStyle =
                        getStatusStyle(
                          deposit.status
                        );

                      const user =
                        deposit.user;

                      return (
                        <tr
                          key={
                            deposit.id
                          }
                          style={{
                            borderBottom:
                              "1px solid #1f2937",
                          }}
                        >
                          <td
                            style={{
                              padding:
                                "12px",
                            }}
                          >
                            {
                              deposit.id
                            }
                          </td>

                          <td
                            style={{
                              padding:
                                "12px",
                            }}
                          >
                            <div
                              style={{
                                fontWeight:
                                  700,
                              }}
                            >
                              {user
                                ?.email ||
                                "-"}
                            </div>

                            <div
                              style={{
                                color:
                                  "#64748b",
                                fontSize:
                                  "12px",
                                marginTop:
                                  "4px",
                              }}
                            >
                              ID:{" "}
                              {deposit.user_id}

                              {user?.telegram_id
                                ? ` • ${user.telegram_id}`
                                : ""}
                            </div>
                          </td>

                          <td
                            style={{
                              padding:
                                "12px",
                              color:
                                "#5eead4",
                              fontWeight:
                                800,
                            }}
                          >
                            Rp{" "}
                            {formatRupiah(
                              deposit.amount
                            )}
                          </td>

                          <td
                            style={{
                              padding:
                                "12px",
                              maxWidth:
                                "220px",
                              wordBreak:
                                "break-all",
                              fontSize:
                                "12px",
                            }}
                          >
                            {
                              deposit.order_id
                            }
                          </td>

                          <td
                            style={{
                              padding:
                                "12px",
                              maxWidth:
                                "220px",
                              wordBreak:
                                "break-all",
                              color:
                                "#94a3b8",
                              fontSize:
                                "12px",
                            }}
                          >
                            {deposit
                              .transaction_id ||
                              "-"}
                          </td>

                          <td
                            style={{
                              padding:
                                "12px",
                            }}
                          >
                            <span
                              style={{
                                display:
                                  "inline-block",
                                padding:
                                  "6px 10px",
                                borderRadius:
                                  "999px",
                                background:
                                  statusStyle.background,
                                color:
                                  statusStyle.color,
                                fontSize:
                                  "12px",
                                fontWeight:
                                  800,
                              }}
                            >
                              {deposit.status ||
                                "-"}
                            </span>
                          </td>

                          <td
                            style={{
                              padding:
                                "12px",
                              color:
                                "#94a3b8",
                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            {formatDate(
                              deposit.created_at
                            )}
                          </td>

                          <td
                            style={{
                              padding:
                                "12px",
                              color:
                                "#94a3b8",
                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            {formatDate(
                              deposit.paid_at
                            )}
                          </td>
                        </tr>
                      );
                    }
                  )
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      style={{
                        padding:
                          "50px",
                        textAlign:
                          "center",
                        color:
                          "#64748b",
                      }}
                    >
                      Belum ada
                      transaksi
                      deposit.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  title,
  value,
}) {
  return (
    <div
      style={{
        background: "#111827",
        border:
          "1px solid #1f2937",
        borderRadius: "16px",
        padding: "20px",
      }}
    >
      <div
        style={{
          fontSize: "25px",
          marginBottom: "12px",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          color: "#64748b",
          fontSize: "13px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: "6px",
          fontSize: "22px",
          fontWeight: 800,
        }}
      >
        {value}
      </div>
    </div>
  );
}
