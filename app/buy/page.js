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
  const [search, setSearch] = useState("");

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
        setError("Katalog gagal dimuat.");
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
      const name = item.operator_display || "Semua Operator";

      if (!map.has(String(id))) {
        map.set(String(id), name);
      }
    });

    return Array.from(map.entries());
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
        String(item.operator_id ?? "any") === String(operator);

      const searchText = search.toLowerCase();

      const searchMatch =
        !searchText ||
        String(item.name || "")
          .toLowerCase()
          .includes(searchText) ||
        String(item.service_name || "")
          .toLowerCase()
          .includes(searchText) ||
        String(item.country_name || "")
          .toLowerCase()
          .includes(searchText) ||
        String(item.operator_display || "")
          .toLowerCase()
          .includes(searchText);

      return (
        serviceMatch &&
        countryMatch &&
        operatorMatch &&
        searchMatch
      );
    });
  }, [products, service, country, operator, search]);

  function getPrice(price) {
    return Number(price || 0) + 1000;
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
          maxWidth: "1400px",
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

        <section style={{ marginTop: "40px" }}>
          <p
            style={{
              color: "#5eead4",
              fontWeight: 700,
            }}
          >
            BELI NOMOR
          </p>

          <h1
            style={{
              fontSize: "32px",
              margin: "8px 0",
            }}
          >
            Pilih Nomor Virtual
          </h1>

          <p style={{ color: "#94a3b8" }}>
            Pilih layanan, negara dan operator yang tersedia.
          </p>
        </section>

        <section
          style={{
            marginTop: "30px",
            padding: "20px",
            background: "#111827",
            border: "1px solid #1f2937",
            borderRadius: "16px",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
          }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔎 Cari layanan..."
            style={inputStyle}
          />

          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            style={selectStyle}
          >
            <option value="all">
              Semua Layanan
            </option>

            {services.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={selectStyle}
          >
            <option value="all">
              Semua Negara
            </option>

            {countries.map((item) => (
              <option key={item.id} value={item.id}>
                {item.emoji || "🌎"} {item.name}
              </option>
            ))}
          </select>

          <select
            value={operator}
            onChange={(e) => setOperator(e.target.value)}
            style={selectStyle}
          >
            <option value="all">
              Semua Operator
            </option>

            {operators.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </section>

        <div
          style={{
            marginTop: "25px",
            color: "#94a3b8",
          }}
        >
          {loading && "Memuat katalog..."}

          {!loading && !error && (
            <>
              Menampilkan{" "}
              <strong style={{ color: "#fff" }}>
                {filteredProducts.length}
              </strong>{" "}
              nomor
            </>
          )}

          {error && (
            <span style={{ color: "#f87171" }}>
              {error}
            </span>
          )}
        </div>

        {!loading && !error && (
          <section
            style={{
              marginTop: "16px",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(270px, 1fr))",
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
                    {item.service_name}
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

                <p
                  style={{
                    color: "#cbd5e1",
                    marginTop: "16px",
                  }}
                >
                  {item.country_emoji}{" "}
                  {item.country_name}
                </p>

                <p style={{ color: "#94a3b8" }}>
                  📡 {item.operator_display}
                </p>

                <p style={{ color: "#94a3b8" }}>
                  📱 {item.name}
                </p>

                <h2 style={{ marginTop: "20px" }}>
                  Rp{" "}
                  {getPrice(item.price).toLocaleString(
                    "id-ID"
                  )}
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

        {!loading &&
          !error &&
          filteredProducts.length === 0 && (
            <div
              style={{
                marginTop: "30px",
                padding: "30px",
                textAlign: "center",
                background: "#111827",
                borderRadius: "16px",
                color: "#94a3b8",
              }}
            >
              Nomor tidak ditemukan.
            </div>
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

const inputStyle = {
  width: "100%",
  padding: "13px",
  borderRadius: "10px",
  border: "1px solid #374151",
  background: "#070b14",
  color: "#fff",
  fontSize: "15px",
  boxSizing: "border-box",
};
