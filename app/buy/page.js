"use client";

import { useEffect, useState } from "react";

export default function BuyPage() {
  const [countries, setCountries] = useState([]);
  const [services, setServices] = useState([]);
  const [operators, setOperators] = useState([]);
  const [products, setProducts] = useState([]);

  const [country, setCountry] = useState("");
  const [service, setService] = useState("");
  const [operator, setOperator] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [buyingId, setBuyingId] = useState(null);
  const [buyError, setBuyError] = useState("");
  const [successOrder, setSuccessOrder] =
    useState(null);

  // =========================
  // COUNTRIES
  // =========================

  useEffect(() => {
    loadCountries();
  }, []);

  async function loadCountries() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/catalog?action=countries",
        { cache: "no-store" }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "Gagal mengambil negara."
        );
      }

      setCountries(result.data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // COUNTRY
  // =========================

  async function changeCountry(value) {
    setCountry(value);

    setService("");
    setOperator("");

    setServices([]);
    setOperators([]);
    setProducts([]);

    setError("");

    if (!value) return;

    try {
      setLoading(true);

      const response = await fetch(
        `/api/catalog?action=services&country_id=${encodeURIComponent(
          value
        )}`,
        { cache: "no-store" }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            "Gagal mengambil service."
        );
      }

      setServices(result.data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // SERVICE
  // =========================

  async function changeService(value) {
    setService(value);

    setOperator("");
    setOperators([]);
    setProducts([]);

    if (!country || !value) return;

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/catalog?action=operators&country_id=${encodeURIComponent(
          country
        )}&platform_id=${encodeURIComponent(
          value
        )}`,
        { cache: "no-store" }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            "Gagal mengambil operator."
        );
      }

      const list = result.data || [];

      setOperators(list);

      /*
       * Cari operator Any.
       */
      const anyOperator = list.find(
        (item) =>
          item.operator_id == null
      );

      /*
       * Cari operator nyata.
       */
      const realOperators = list.filter(
        (item) =>
          item.operator_id != null
      );

      /*
       * Kalau ada Any,
       * gunakan Semua Operator.
       */
      if (anyOperator) {
        setOperator("all");

        await loadProducts(
          country,
          value,
          "all"
        );
      }

      /*
       * Kalau tidak ada Any,
       * langsung gunakan operator pertama.
       */
      else if (realOperators.length > 0) {
        const first =
          String(
            realOperators[0].operator_id
          );

        setOperator(first);

        await loadProducts(
          country,
          value,
          first
        );
      } else {
        setProducts([]);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // OPERATOR
  // =========================

  async function changeOperator(value) {
    setOperator(value);
    setProducts([]);

    if (!country || !service) return;

    await loadProducts(
      country,
      service,
      value
    );
  }

  // =========================
  // PRODUCTS
  // =========================

  async function loadProducts(
    countryId,
    platformId,
    operatorId
  ) {
    try {
      setLoading(true);
      setError("");

      const url =
        `/api/catalog?action=products` +
        `&country_id=${encodeURIComponent(
          countryId
        )}` +
        `&platform_id=${encodeURIComponent(
          platformId
        )}` +
        `&operator_id=${encodeURIComponent(
          operatorId
        )}`;

      const response = await fetch(url, {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            "Gagal mengambil produk."
        );
      }

      setProducts(result.data || []);
    } catch (error) {
      console.error(
        "PRODUCT ERROR:",
        error
      );

      setProducts([]);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // BUY
  // =========================

  async function buyNumber(product) {
    try {
      setBuyingId(product.id);
      setBuyError("");
      setSuccessOrder(null);

      const response = await fetch(
        "/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            product_id: product.id,
            country_id:
              product.country_id,
            platform_id:
              product.platform_id,
            operator_id:
              product.operator_id ??
              null,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            "Gagal membeli nomor."
        );
      }

      setSuccessOrder(
        result.order || null
      );
    } catch (error) {
      console.error(
        "BUY ERROR:",
        error
      );

      setBuyError(
        error.message
      );
    } finally {
      setBuyingId(null);
    }
  }

  // =========================
  // FILTER SEARCH
  // =========================

  const filteredProducts =
    products.filter((item) => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      if (!keyword) return true;

      return (
        String(
          item.name || ""
        )
          .toLowerCase()
          .includes(keyword) ||
        String(
          item.operator_name || ""
        )
          .toLowerCase()
          .includes(keyword)
      );
    });

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#070b14",
        color: "#fff",
        padding: "30px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "auto",
        }}
      >
        <h1>
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

        {error && (
          <div
            style={{
              marginTop: 20,
              padding: 15,
              background: "#3f1d2e",
              color: "#fda4af",
              borderRadius: 10,
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: 15,
            marginTop: 25,
          }}
        >
          <div>
            <label>Negara</label>

            <select
              value={country}
              onChange={(e) =>
                changeCountry(
                  e.target.value
                )
              }
              style={selectStyle}
            >
              <option value="">
                Pilih Negara
              </option>

              {countries.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.emoji || ""}{" "}
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Service</label>

            <select
              value={service}
              onChange={(e) =>
                changeService(
                  e.target.value
                )
              }
              disabled={!country}
              style={selectStyle}
            >
              <option value="">
                Pilih Service
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
          </div>

          <div>
            <label>Operator</label>

            <select
              value={operator}
              onChange={(e) =>
                changeOperator(
                  e.target.value
                )
              }
              disabled={!service}
              style={selectStyle}
            >
              <option value="">
                Pilih Operator
              </option>

              {operators.map((item) => (
                <option
                  key={
                    item.operator_id ??
                    "any"
                  }
                  value={
                    item.operator_id ??
                    "all"
                  }
                >
                  {item.display_name ||
                    item.name ||
                    item.local_name ||
                    "Semua Operator"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Cari</label>

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Cari produk..."
              style={inputStyle}
            />
          </div>
        </div>

        {buyError && (
          <div
            style={{
              marginTop: 20,
              padding: 15,
              background: "#3f1d2e",
              color: "#fda4af",
              borderRadius: 10,
            }}
          >
            {buyError}
          </div>
        )}

        {successOrder && (
          <div
            style={{
              marginTop: 20,
              padding: 18,
              background: "#14532d",
              color: "#86efac",
              borderRadius: 12,
            }}
          >
            <strong>
              Nomor berhasil dibeli.
            </strong>

            <div>
              Nomor:{" "}
              {successOrder.phone_number ||
                "-"}
            </div>

            <div>
              OTP:{" "}
              {successOrder.otp_code ||
                "Menunggu OTP"}
            </div>
          </div>
        )}

        <div
          style={{
            marginTop: 30,
          }}
        >
          {loading ? (
            <div
              style={{
                padding: 40,
                textAlign: "center",
              }}
            >
              Mengambil data
              SMSCode...
            </div>
          ) : !country ||
            !service ? (
            <div
              style={{
                padding: 40,
                textAlign: "center",
                color: "#94a3b8",
              }}
            >
              Pilih negara dan service
              terlebih dahulu.
            </div>
          ) : filteredProducts.length ===
            0 ? (
            <div
              style={{
                padding: 40,
                textAlign: "center",
                color: "#94a3b8",
              }}
            >
              Nomor tidak ditemukan.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill,minmax(250px,1fr))",
                gap: 15,
              }}
            >
              {filteredProducts.map(
                (product) => {
                  const stock =
                    Number(
                      product.available ??
                        product.stock ??
                        0
                    );

                  const buying =
                    buyingId ===
                    product.id;

                  return (
                    <div
                      key={product.id}
                      style={{
                        background:
                          "#111827",
                        border:
                          "1px solid #1f2937",
                        borderRadius: 14,
                        padding: 18,
                      }}
                    >
                      <strong>
                        {product.name ||
                          `Product ${product.id}`}
                      </strong>

                      <div
                        style={{
                          marginTop: 10,
                          color: "#94a3b8",
                        }}
                      >
                        Operator:{" "}
                        {
                          product.operator_name
                        }
                      </div>

                      <div
                        style={{
                          marginTop: 10,
                          color: "#94a3b8",
                        }}
                      >
                        Stock: {stock}
                      </div>

                      <div
                        style={{
                          marginTop: 15,
                          fontSize: 22,
                          fontWeight: 800,
                        }}
                      >
                        Rp{" "}
                        {Number(
                          product.selling_price
                        ).toLocaleString(
                          "id-ID"
                        )}
                      </div>

                      <div
                        style={{
                          marginTop: 5,
                          color: "#64748b",
                          fontSize: 12,
                        }}
                      >
                        Supplier Rp{" "}
                        {Number(
                          product.supplier_price
                        ).toLocaleString(
                          "id-ID"
                        )}
                      </div>

                      <button
                        type="button"
                        disabled={
                          stock <= 0 ||
                          buying
                        }
                        onClick={() =>
                          buyNumber(
                            product
                          )
                        }
                        style={{
                          width: "100%",
                          marginTop: 15,
                          padding: 12,
                          border: "none",
                          borderRadius: 10,
                          background:
                            stock > 0
                              ? "#5eead4"
                              : "#374151",
                          color:
                            stock > 0
                              ? "#06111a"
                              : "#9ca3af",
                          fontWeight: 800,
                        }}
                      >
                        {buying
                          ? "Membeli..."
                          : stock > 0
                          ? "Beli Nomor"
                          : "Stock Habis"}
                      </button>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

const selectStyle = {
  width: "100%",
  marginTop: 7,
  padding: 13,
  borderRadius: 10,
  border: "1px solid #374151",
  background: "#070b14",
  color: "#fff",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  marginTop: 7,
  padding: 13,
  borderRadius: 10,
  border: "1px solid #374151",
  background: "#070b14",
  color: "#fff",
};
