"use client";

import { useEffect, useMemo, useState } from "react";

export default function BuyPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [service, setService] = useState("all");
  const [country, setCountry] = useState("all");
  const [operator, setOperator] = useState("all");

  useEffect(() => {
    async function loadCatalog() {
      try {
        setLoading(true);

        const response = await fetch("/api/catalog", {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error("Gagal mengambil katalog");
        }

        setProducts(result.data || []);
      } catch (err) {
        setError("Katalog SMSCode gagal dimuat.");
      } finally {
        setLoading(false);
      }
    }

    loadCatalog();
  }, []);

  const services = useMemo(() => {
    return [...new Set(products.map((item) => item.platform_id))]
      .filter(Boolean)
      .sort((a, b) => Number(a) - Number(b));
  }, [products]);

  const countries = useMemo(() => {
    return [...new Set(products.map((item) => item.country_id))]
      .filter(Boolean)
      .sort((a, b) => Number(a) - Number(b));
  }, [products]);

  const operators = useMemo(() => {
    return [...new Set(products.map((item) => item.operator_id))]
      .filter(Boolean)
      .sort((a, b) => Number(a) - Number(b));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const serviceMatch =
        service === "all" ||
        String(item.platform_id) === String(service);

      const countryMatch =
        country === "all" ||
        String(item.country_id) === String(country);

      const operatorMatch =
        operator === "all" ||
        String(item.operator_id) === String(operator);

      return serviceMatch && countryMatch && operatorMatch;
    });
  }, [products, service, country, operator]);

  function getPrice(price) {
    const supplierPrice = Number(price || 0);
    return supplierPrice + 1000;
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
      <div style={{ maxWidth: "1300px", margin: "auto" }}>

        {/* HEADER */}
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

        {/* TITLE */}
        <section style={{ marginTop: "40px" }}>
          <p style={{ color: "#5eead4", fontWeight: 700 }}>
            BELI NOMOR
          </p>

          <h1 style={{ fontSize: "32px", margin: "8px 0" }}>
            Pilih Nomor Virtual
          </h1>

          <p style={{ color: "#94a3b8" }}>
            Data layanan diambil langsung dari supplier.
          </p>
        </section>

        {/* FILTER */}
        <section
          style={{
            marginTop: "30px",
            padding: "20px",
            background: "#111827",
            border: "1px solid #1f2937",
            borderRadius: "16px",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "15px",
          }}
        >
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            style={selectStyle}
          >
            <option value="all">
              Semua Layanan ({services.length})
            </option>

            {services.map((id) => (
              <option key={id} value={id}>
                Platform {id}
              </option>
            ))}
          </select>

          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={selectStyle}
          >
            <option value="all">
              Semua Negara ({countries.length})
            </option>

            {countries.map((id) => (
              <option key={id} value={id}>
                Negara {id}
              </option>
            ))}
          </select>

          <select
            value={operator}
            onChange={(e) => setOperator(e.target.value)}
            style={selectStyle}
          >
            <option value="all">
              Semua Operator ({operators.length})
            </option>

            {operators.map((id) => (
              <option key={id} value={id}>
                Operator {id}
              </option>
            ))}
          </select>
        </section>

        {/* STATUS */}
        <div style={{ marginTop: "25px", color: "#94a3b8" }}>
          {loading && "Memuat katalog SMSCode..."}

          {!loading && !error && (
            <>
              Menampilkan{" "}
              <strong style={{ color: "#fff" }}>
                {filteredProducts.length}
              </strong>{" "}
              produk
            </>
          )}

          {error && (
            <span style={{ color: "#f87171" }}>
              {error}
            </span>
          )}
        </div>

        {/* PRODUCTS */}
        {!loading && !error && (
          <section
            style={{
              marginTop: "16px",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "16px",
            }}
          >
            {filteredProducts.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "#111827",
                  border: "1px solid #1f2937",
                  borderRadius: "16px",
                  padding: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "18px",
                    }}
                  >
                    {item.name || "Layanan"}
                  </h2>

                  <span
                    style={{
                      color: "#5eead4",
                      fontSize: "13px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Stock {item.available ?? 0}
                  </span>
                </div>

                <p style={{ color: "#94a3b8" }}>
                  🌎 Negara ID: {item.country_id}
                </p>

                <p style={{ color: "#94a3b8" }}>
                  📡{" "}
                  {item.operator_name ||
                    `Operator ${item.operator_id || "-"}`}
                </p>

                <p style={{ color: "#94a3b8" }}>
                  📱 Platform ID: {item.platform_id}
                </p>

                <h2 style={{ marginTop: "20px" }}>
                  Rp{" "}
                  {getPrice(item.price).toLocaleString("id-ID")}
                </h2>

                <button
                  style={{
                    width: "100%",
                    marginTop: "10px",
                    padding: "12px",
                    border: "none",
                    borderRadius: "10px",
                    background: "#5eead4",
                    color: "#06111a",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  Beli Nomor
                </button>
              </div>
            ))}
          </section>
        )}

      </div>
    </main>
  );
}

const selectStyle = {
  width: "100%",
  padding: "13px",
  borderRadius: "10px",
  border: "1px solid #374151",
  background: "#070b14",
  color: "#fff",
  fontSize: "15px",
};
