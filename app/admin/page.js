import Link from "next/link";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [
    { count: totalUsers },
    { count: totalOrders },
    { count: activeOrders },
    { data: users },
    { data: recentOrders },
  ] = await Promise.all([
    supabaseAdmin
      .from("users")
      .select("*", { count: "exact", head: true }),

    supabaseAdmin
      .from("orders")
      .select("*", { count: "exact", head: true }),

    supabaseAdmin
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "ACTIVE"),

    supabaseAdmin
      .from("users")
      .select("balance"),

    supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const totalBalance =
    users?.reduce(
      (total, user) => total + Number(user.balance || 0),
      0
    ) || 0;

  const menus = [
    {
      name: "Users",
      icon: "👥",
      href: "/admin/users",
    },
    {
      name: "Orders",
      icon: "📦",
      href: "/admin/orders",
    },
    {
      name: "Deposits",
      icon: "💳",
      href: "/admin/deposits",
    },
    {
      name: "Transactions",
      icon: "💰",
      href: "/admin/transactions",
    },
    {
      name: "Support",
      icon: "🎫",
      href: "/admin/support",
    },
    {
      name: "Affiliate",
      icon: "🤝",
      href: "/admin/affiliate",
    },
    {
      name: "Pricing",
      icon: "⚙️",
      href: "/admin/pricing",
    },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#070b14",
        color: "#fff",
      }}
    >
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
        }}
      >
        {/* SIDEBAR */}
        <aside
          style={{
            width: "240px",
            background: "#0b1120",
            borderRight: "1px solid #1f2937",
            padding: "24px 16px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              fontSize: "21px",
              fontWeight: 800,
              color: "#5eead4",
              padding: "0 10px",
              marginBottom: "35px",
            }}
          >
            NOKOS{" "}
            <span style={{ color: "#fff" }}>
              VIRTUAL
            </span>
          </div>

          <div
            style={{
              color: "#64748b",
              fontSize: "11px",
              fontWeight: 800,
              padding: "0 10px",
              marginBottom: "10px",
            }}
          >
            ADMIN PANEL
          </div>

          <Link
            href="/admin"
            style={{
              display: "block",
              padding: "12px",
              borderRadius: "10px",
              background: "#102b2c",
              color: "#5eead4",
              textDecoration: "none",
              fontWeight: 700,
              marginBottom: "6px",
            }}
          >
            📊 Dashboard
          </Link>

          {menus.map((menu) => (
            <Link
              key={menu.name}
              href={menu.href}
              style={{
                display: "block",
                padding: "12px",
                color: "#94a3b8",
                borderRadius: "10px",
                marginBottom: "3px",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              {menu.icon}{" "}
              <span style={{ marginLeft: "6px" }}>
                {menu.name}
              </span>
            </Link>
          ))}
        </aside>

        {/* CONTENT */}
        <section
          style={{
            flex: 1,
            padding: "30px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              marginBottom: "35px",
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
              Dashboard Admin
            </h1>

            <p
              style={{
                color: "#64748b",
                margin: 0,
              }}
            >
              Data realtime dari Supabase.
            </p>
          </div>

          {/* STATS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(210px, 1fr))",
              gap: "16px",
            }}
          >
            <Stat
              icon="👥"
              title="Total Users"
              value={totalUsers || 0}
            />

            <Stat
              icon="📦"
              title="Total Orders"
              value={totalOrders || 0}
            />

            <Stat
              icon="⚡"
              title="Order Aktif"
              value={activeOrders || 0}
            />

            <Stat
              icon="💰"
              title="Total Saldo"
              value={`Rp ${totalBalance.toLocaleString(
                "id-ID"
              )}`}
            />
          </div>

          {/* QUICK MENU */}
          <div
            style={{
              marginTop: "25px",
              background: "#111827",
              border: "1px solid #1f2937",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              Quick Management
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "12px",
                marginTop: "20px",
              }}
            >
              {menus.map((menu) => (
                <Link
                  key={menu.name}
                  href={menu.href}
                  style={{
                    padding: "18px",
                    background: "#070b14",
                    border: "1px solid #1f2937",
                    borderRadius: "12px",
                    color: "#cbd5e1",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  {menu.icon} {menu.name}
                </Link>
              ))}
            </div>
          </div>

          {/* RECENT ORDERS */}
          <div
            style={{
              marginTop: "25px",
              background: "#111827",
              border: "1px solid #1f2937",
              borderRadius: "16px",
              padding: "24px",
              overflowX: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ marginTop: 0 }}>
                📦 Pesanan Terbaru
              </h2>

              <Link
                href="/admin/orders"
                style={{
                  color: "#5eead4",
                  textDecoration: "none",
                }}
              >
                Lihat semua →
              </Link>
            </div>

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
                    borderBottom:
                      "1px solid #1f2937",
                  }}
                >
                  <th style={{ padding: "12px" }}>
                    ID
                  </th>
                  <th style={{ padding: "12px" }}>
                    Service
                  </th>
                  <th style={{ padding: "12px" }}>
                    Country
                  </th>
                  <th style={{ padding: "12px" }}>
                    Harga
                  </th>
                  <th style={{ padding: "12px" }}>
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentOrders?.length ? (
                  recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      style={{
                        borderBottom:
                          "1px solid #1f2937",
                      }}
                    >
                      <td style={{ padding: "12px" }}>
                        {order.id}
                      </td>

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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
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
        </section>
      </div>
    </main>
  );
}

function Stat({ icon, title, value }) {
  return (
    <div
      style={{
        background: "#111827",
        border: "1px solid #1f2937",
        borderRadius: "16px",
        padding: "22px",
      }}
    >
      <div
        style={{
          fontSize: "25px",
          marginBottom: "15px",
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
          fontSize: "24px",
          fontWeight: 800,
          marginTop: "6px",
        }}
      >
        {value}
      </div>
    </div>
  );
}
