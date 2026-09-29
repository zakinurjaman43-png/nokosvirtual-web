"use client";

import { useEffect, useMemo, useState } from "react";

export default function BuyPage() {
  const [products, setProducts] = useState([]);
  const [countries, setCountries] = useState([]);
  const [services, setServices] = useState([]);

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
        setCountries(result.countries || []);
        setServices(result.services || []);
      } catch (err) {
        setError("Katalog SMSCode gagal dimuat.");
      } finally {
        setLoading(false);
      }
    }

    loadCatalog();
  }, []);

  const operators = useMemo(() => {
    const map = new Map();

    products.forEach((item) => {
      const id = item.operator_id ?? "any";
      const name = item.operator_name || "Semua Operator";

      if (!map.has(String(id))) {
        map.set(String(id), {
          id,
          name,
        });
      }
    });

    return Array.from(map.values());
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
        (operator === "any"
          ? item.operator_id == null
          : String(item.operator_id) === String(operator));

      return serviceMatch && countryMatch && operatorMatch;
    });
  }, [products, service, country, operator]);

  function getPrice(price) {
    return Number(price || 0) + 1000;
  }

  function getFlag(code) {
    if (!code || code.length !== 2) return "🌎";

    return code
      .toUpperCase()
      .split("")
      .map((char) =>
        String.fromCodePoint(127397 + char.charCodeAt(0))
      )
      .join("");
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
            Pilih layanan, negara, dan operator yang tersedia.
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
          {/* SERVICE */}
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            style={selectStyle}
          >
            <option value="all">
              Semua Layanan ({services.length})
            </option>

            {services.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          {/* COUNTRY */}
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={selectStyle}
          >
            <option value="all">
              Semua Negara ({countries.length})
            </option>

            {countries.map((item) => (
              <option key={item.id} value={item.id}>
                {getFlag(item.code)} {item.name}
              </option>
            ))}
          </select>

          {/* OPERATOR */}
          <select
            value={operator}
            onChange={(e) => setOperator(e.target.value)}
            style={selectStyle}
          >
            <option value="all">
              Semua Operator
            </option>

            {operators.map((item) => (
              <option
                key={String(item.id)}
                value={String(item.id)}
              >
                {item.name}
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
                    {item.service_name || item.name}
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
                  {getFlag(item.country_code)}{" "}
                  {item.country_name}
                </p>

                <p style={{ color: "#94a3b8" }}>
                  📡 {item.operator_name}
                </p>

                <p
                  style={{
                    color: "#64748b",
                    fontSize: "13px",
                  }}
                >
                  {item.name}
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
