"use client";

import Link from "next/link";

const stats = [
  { title: "Total Users", value: "0", icon: "👥" },
  { title: "Total Orders", value: "0", icon: "📦" },
  { title: "Pending Deposits", value: "0", icon: "💳" },
  { title: "Revenue", value: "Rp 0", icon: "💰" },
];

const menus = [
  { name: "Users", icon: "👥", href: "/admin/users" },
  { name: "Orders", icon: "📦", href: "/admin/orders" },
  { name: "Deposits", icon: "💳", href: "/admin/deposits" },
  { name: "Transactions", icon: "💰", href: "/admin/transactions" },
  { name: "Support Tickets", icon: "🎫", href: "/admin/support" },
  { name: "Affiliate", icon: "🤝", href: "/admin/affiliate" },
  { name: "Pricing", icon: "⚙️", href: "/admin/pricing" },
];

export default function AdminPage() {
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
            NOKOS <span style={{ color: "#fff" }}>VIRTUAL</span>
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

          {/* DASHBOARD */}
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

          {/* MENU */}
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

          {/* WEBSITE */}
          <div
            style={{
              borderTop: "1px solid #1f2937",
              marginTop: "25px",
              paddingTop: "20px",
            }}
          >
            <Link
              href="/dashboard"
              style={{
                color: "#94a3b8",
                textDecoration: "none",
                padding: "12px",
                display: "block",
              }}
            >
              ← Website
            </Link>
          </div>
        </aside>

        {/* CONTENT */}
        <section
          style={{
            flex: 1,
            padding: "30px",
            boxSizing: "border-box",
          }}
        >
          {/* HEADER */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "35px",
            }}
          >
            <div>
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
                Kelola sistem NOKOS VIRTUAL.
              </p>
            </div>

            <div
              style={{
                background: "#111827",
                border: "1px solid #1f2937",
                borderRadius: "10px",
                padding: "10px 14px",
                color: "#94a3b8",
                fontSize: "14px",
              }}
            >
              👤 Administrator
            </div>
          </div>

          {/* STATS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
            }}
          >
            {stats.map((stat) => (
              <div
                key={stat.title}
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
                  {stat.icon}
                </div>

                <div
                  style={{
                    color: "#64748b",
                    fontSize: "13px",
                  }}
                >
                  {stat.title}
                </div>

                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: 800,
                    marginTop: "6px",
                  }}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* QUICK MANAGEMENT */}
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

            <p style={{ color: "#64748b" }}>
              Pilih menu untuk membuka halaman administrasinya.
            </p>

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
                    display: "block",
                    padding: "15px",
                    background: "#070b14",
                    border: "1px solid #1f2937",
                    borderRadius: "10px",
                    color: "#cbd5e1",
                    textAlign: "left",
                    cursor: "pointer",
                    textDecoration: "none",
                    boxSizing: "border-box",
                  }}
                >
                  {menu.icon} {menu.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
