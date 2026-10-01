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

  // STATUS PEMBELIAN
  const [buyingId, setBuyingId] = useState(null);
  const [buyError, setBuyError] = useState("");
  const [successOrder, setSuccessOrder] = useState(null);

  useEffect(() => {
    async function loadCatalog() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/catalog", {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result?.error?.message ||
              result?.error ||
              "Gagal mengambil katalog"
          );
        }

        setProducts(result.data || []);
        setCountries(result.countries || []);
        setServices(result.services || []);
      } catch (err) {
        console.error("CATALOG LOAD ERROR:", err);

        setError(
          err.message ||
            "Katalog gagal dimuat."
        );
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

      const name =
        item.operator_display ||
        item.operator_name ||
        "Semua Operator";

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
        String(item.platform_id) ===
          String(service);

      const countryMatch =
        country === "all" ||
        String(item.country_id) ===
          String(country);

      const operatorMatch =
        operator === "all" ||
        String(item.operator_id ?? "any") ===
          String(operator);

      const searchText =
        search.toLowerCase().trim();

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
        String(
          item.operator_display ||
            item.operator_name ||
            ""
        )
          .toLowerCase()
          .includes(searchText);

      return (
        serviceMatch &&
        countryMatch &&
        operatorMatch &&
        searchMatch
      );
    });
  }, [
    products,
    service,
    country,
    operator,
    search,
  ]);

  // ==========================================
  // BELI NOMOR
  // ==========================================

  async function buyNumber(item) {
    try {
      setBuyingId(item.id);
      setBuyError("");
      setSuccessOrder(null);

      const response = await fetch(
        "/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_id: item.id,
          }),
        }
      );

      const result = await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result?.error ||
            result?.message ||
            "Gagal membeli nomor."
        );
      }

      setSuccessOrder(result.order || null);
    } catch (error) {
      console.error(
        "BUY NUMBER ERROR:",
        error
      );

      setBuyError(
        error.message ||
          "Gagal membeli nomor."
      );
    } finally {
      setBuyingId(null);
    }
  }

  function closePurchaseMessage() {
    setBuyError("");
    setSuccessOrder(null);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#070b14",
        color: "#fff",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "auto",
        }}
      >
        {/* NAVBAR */}

        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
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
              marginBottom: "8px",
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

          <p
            style={{
              color: "#94a3b8",
            }}
          >
            Pilih layanan, negara dan
            operator yang tersedia.
          </p>
        </section>

        {/* SUCCESS */}

        {successOrder && (
          <section
            style={{
              marginTop: "20px",
              padding: "20px",
              background: "#052e2b",
              border:
                "1px solid #14b8a6",
              borderRadius: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                gap: "20px",
              }}
            >
              <div>
                <h3
                  style={{
                    margin:
                      "0 0 10px",
                    color: "#5eead4",
                  }}
                >
                  ✅ Nomor berhasil dibeli
                </h3>

                <p
                  style={{
                    margin: "5px 0",
                    color: "#cbd5e1",
                  }}
                >
                  Order: #
                  {successOrder.id || "-"}
                </p>

                <p
                  style={{
                    margin: "5px 0",
                    color: "#cbd5e1",
                  }}
                >
                  Nomor:{" "}
                  <strong>
                    {successOrder.phone_number ||
                      "-"}
                  </strong>
                </p>

                <p
                  style={{
                    margin: "5px 0",
                    color: "#cbd5e1",
                  }}
                >
                  Status:{" "}
                  <strong>
                    {successOrder.status ||
                      "CREATING"}
                  </strong>
                </p>

                {successOrder.otp_code && (
                  <p
                    style={{
                      margin: "5px 0",
                      color: "#cbd5e1",
                    }}
                  >
                    OTP:{" "}
                    <strong>
                      {
                        successOrder.otp_code
                      }
                    </strong>
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={
                  closePurchaseMessage
                }
                style={{
                  height: "36px",
                  padding: "0 12px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#134e4a",
                  color: "#99f6e4",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Tutup
              </button>
            </div>
          </section>
        )}

        {/* ERROR BELI */}

        {buyError && (
          <section
            style={{
              marginTop: "20px",
              padding: "16px 20px",
              background: "#3f1720",
              border:
                "1px solid #ef4444",
              borderRadius: "16px",
              color: "#fca5a5",
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <span>
              ❌ {buyError}
            </span>

            <button
              type="button"
              onClick={
                closePurchaseMessage
              }
              style={{
                border: "none",
                background: "transparent",
                color: "#fca5a5",
                cursor: "pointer",
                fontSize: "18px",
              }}
            >
              ✕
            </button>
          </section>
        )}

        {/* FILTER */}

        <section
          style={{
            marginTop: "30px",
            padding: "20px",
            background: "#111827",
            border:
              "1px solid #1f2937",
            borderRadius: "16px",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
          }}
        >
          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="🔎 Cari layanan..."
            style={inputStyle}
          />

          <select
            value={service}
            onChange={(e) =>
              setService(e.target.value)
            }
            style={selectStyle}
          >
            <option value="all">
              Semua Layanan
            </option>

            {services.map((item) => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.name}
              </option>
            ))}
          </select>

          <select
            value={country}
            onChange={(e) =>
              setCountry(e.target.value)
            }
            style={selectStyle}
          >
            <option value="all">
              Semua Negara
            </option>

            {countries.map((item) => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.emoji || "🌎"}{" "}
                {item.name}
              </option>
            ))}
          </select>

          <select
            value={operator}
            onChange={(e) =>
              setOperator(e.target.value)
            }
            style={selectStyle}
          >
            <option value="all">
              Semua Operator
            </option>

            {operators.map(
              ([id, name]) => (
                <option
                  key={id}
                  value={id}
                >
                  {name}
                </option>
              )
            )}
          </select>
        </section>

        {/* INFO */}

        <div
          style={{
            marginTop: "25px",
            color: "#94a3b8",
          }}
        >
          {loading &&
            "Memuat katalog..."}

          {!loading && !error && (
            <>
              Menampilkan{" "}
              <strong
                style={{
                  color: "#fff",
                }}
              >
                {filteredProducts.length}
              </strong>{" "}
              nomor
            </>
          )}

          {error && (
            <span
              style={{
                color: "#f87171",
              }}
            >
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
                "repeat(auto-fill, minmax(270px, 1fr))",
              gap: "16px",
            }}
          >
            {filteredProducts.map(
              (item) => {
                const stock =
                  Number(
                    item.available || 0
                  );

                const isBuying =
                  buyingId === item.id;

                return (
                  <div
                    key={item.id}
                    style={{
                      background: "#111827",
                      border:
                        "1px solid #1f2937",
                      borderRadius: "16px",
                      padding: "20px",
                    }}
                  >
                    {/* SERVICE + STOCK */}

                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        gap: "10px",
                      }}
                    >
                      <h2
                        style={{
                          margin: 0,
                          fontSize: "18px",
                        }}
                      >
                        {
                          item.service_name
                        }
                      </h2>

                      <span
                        style={{
                          color: "#5eead4",
                          fontSize: "13px",
                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        Stock {stock}
                      </span>
                    </div>

                    {/* COUNTRY */}

                    <p
                      style={{
                        color: "#cbd5e1",
                        marginTop: "16px",
                      }}
                    >
                      {
                        item.country_emoji
                      }{" "}
                      {
                        item.country_name
                      }
                    </p>

                    {/* OPERATOR */}

                    <p
                      style={{
                        color: "#94a3b8",
                      }}
                    >
                      📡{" "}
                      {item.operator_display ||
                        item.operator_name ||
                        "Semua Operator"}
                    </p>

                    {/* PRODUCT */}

                    <p
                      style={{
                        color: "#94a3b8",
                      }}
                    >
                      📱 {item.name}
                    </p>

                    {/* PRICE */}

                    <h2
                      style={{
                        marginTop: "20px",
                      }}
                    >
                      Rp{" "}
                      {Number(
                        item.selling_price ||
                          0
                      ).toLocaleString(
                        "id-ID"
                      )}
                    </h2>

                    {/* BUY */}

                    <button
                      type="button"
                      disabled={
                        isBuying ||
                        stock <= 0
                      }
                      onClick={() =>
                        buyNumber(item)
                      }
                      style={{
                        width: "100%",
                        marginTop: "10px",
                        padding: "12px",
                        border: "none",
                        borderRadius: "10px",
                        background:
                          stock <= 0
                            ? "#374151"
                            : isBuying
                            ? "#0f766e"
                            : "#5eead4",
                        color:
                          stock <= 0
                            ? "#9ca3af"
                            : "#06111a",
                        fontWeight: 800,
                        cursor:
                          isBuying ||
                          stock <= 0
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      {isBuying
                        ? "⏳ Membeli..."
                        : stock <= 0
                        ? "Stock Habis"
                        : "Beli Nomor"}
                    </button>
                  </div>
                );
              }
            )}
          </section>
        )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          filteredProducts.length ===
            0 && (
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
