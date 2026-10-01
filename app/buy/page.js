"use client";

import { useEffect, useMemo, useState } from "react";

export default function BuyPage() {
  const [countries, setCountries] = useState([]);
  const [services, setServices] = useState([]);
  const [operators, setOperators] = useState([]);
  const [products, setProducts] = useState([]);

  const [country, setCountry] = useState("");
  const [service, setService] = useState("");
  const [operator, setOperator] = useState("all");

  const [loadingCountries, setLoadingCountries] =
    useState(true);

  const [loadingServices, setLoadingServices] =
    useState(false);

  const [loadingOperators, setLoadingOperators] =
    useState(false);

  const [loadingProducts, setLoadingProducts] =
    useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] =
    useState("");

  const [buyingId, setBuyingId] =
    useState(null);

  const [buyError, setBuyError] =
    useState("");

  const [successOrder, setSuccessOrder] =
    useState(null);

  /*
   * ==================================================
   * LOAD COUNTRIES
   * ==================================================
   */

  useEffect(() => {
    loadCountries();
  }, []);

  async function loadCountries() {
    try {
      setLoadingCountries(true);
      setError("");

      const response = await fetch(
        "/api/catalog?action=countries",
        {
          cache: "no-store",
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result?.error?.message ||
            result?.error ||
            "Gagal mengambil negara."
        );
      }

      setCountries(
        result.data || []
      );
    } catch (error) {
      console.error(
        "LOAD COUNTRIES ERROR:",
        error
      );

      setError(
        error?.message ||
          "Gagal mengambil negara."
      );
    } finally {
      setLoadingCountries(false);
    }
  }

  /*
   * ==================================================
   * COUNTRY BERUBAH
   * ==================================================
   */

  async function handleCountryChange(
    value
  ) {
    setCountry(value);

    setService("");
    setOperator("all");

    setServices([]);
    setOperators([]);
    setProducts([]);

    setSearch("");
    setBuyError("");
    setSuccessOrder(null);

    if (!value) {
      return;
    }

    await loadServices(value);
  }

  /*
   * ==================================================
   * LOAD SERVICES
   * ==================================================
   */

  async function loadServices(
    countryId
  ) {
    try {
      setLoadingServices(true);
      setError("");

      const params =
        new URLSearchParams();

      params.set(
        "action",
        "services"
      );

      params.set(
        "country_id",
        countryId
      );

      const response = await fetch(
        `/api/catalog?${params.toString()}`,
        {
          cache: "no-store",
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result?.error?.message ||
            result?.error ||
            "Gagal mengambil service."
        );
      }

      setServices(
        result.data || []
      );
    } catch (error) {
      console.error(
        "LOAD SERVICES ERROR:",
        error
      );

      setError(
        error?.message ||
          "Gagal mengambil service."
      );
    } finally {
      setLoadingServices(false);
    }
  }

  /*
   * ==================================================
   * SERVICE BERUBAH
   * ==================================================
   */

  async function handleServiceChange(
    value
  ) {
    setService(value);

    setOperator("all");

    setOperators([]);
    setProducts([]);

    setSearch("");
    setBuyError("");
    setSuccessOrder(null);

    if (
      !country ||
      !value
    ) {
      return;
    }

    await loadOperators(
      country,
      value
    );
  }

  /*
   * ==================================================
   * LOAD OPERATORS
   * ==================================================
   */

  async function loadOperators(
    countryId,
    platformId
  ) {
    try {
      setLoadingOperators(true);
      setError("");

      const params =
        new URLSearchParams();

      params.set(
        "action",
        "operators"
      );

      params.set(
        "country_id",
        countryId
      );

      params.set(
        "platform_id",
        platformId
      );

      const response = await fetch(
        `/api/catalog?${params.toString()}`,
        {
          cache: "no-store",
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result?.error?.message ||
            result?.error ||
            "Gagal mengambil operator."
        );
      }

      setOperators(
        result.data || []
      );

      /*
       * Setelah service dipilih,
       * langsung ambil produk "all operator".
       */

      await loadProducts(
        countryId,
        platformId,
        "all"
      );
    } catch (error) {
      console.error(
        "LOAD OPERATORS ERROR:",
        error
      );

      setError(
        error?.message ||
          "Gagal mengambil operator."
      );
    } finally {
      setLoadingOperators(false);
    }
  }

  /*
   * ==================================================
   * OPERATOR BERUBAH
   * ==================================================
   */

  async function handleOperatorChange(
    value
  ) {
    setOperator(value);

    setProducts([]);

    setSearch("");
    setBuyError("");
    setSuccessOrder(null);

    if (
      !country ||
      !service
    ) {
      return;
    }

    await loadProducts(
      country,
      service,
      value
    );
  }

  /*
   * ==================================================
   * LOAD PRODUCTS
   * ==================================================
   */

  async function loadProducts(
    countryId,
    platformId,
    operatorId
  ) {
    try {
      setLoadingProducts(true);
      setError("");

      const params =
        new URLSearchParams();

      params.set(
        "action",
        "products"
      );

      params.set(
        "country_id",
        countryId
      );

      params.set(
        "platform_id",
        platformId
      );

      params.set(
        "operator_id",
        operatorId || "all"
      );

      const response = await fetch(
        `/api/catalog?${params.toString()}`,
        {
          cache: "no-store",
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result?.error?.message ||
            result?.error ||
            "Gagal mengambil produk."
        );
      }

      setProducts(
        result.data || []
      );
    } catch (error) {
      console.error(
        "LOAD PRODUCTS ERROR:",
        error
      );

      setError(
        error?.message ||
          "Gagal mengambil produk."
      );

      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }

  /*
   * ==================================================
   * SEARCH
   * ==================================================
   */

  const filteredProducts =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      if (!keyword) {
        return products;
      }

      return products.filter(
        (item) => {
          return (
            String(
              item.name || ""
            )
              .toLowerCase()
              .includes(keyword) ||

            String(
              item.operator_name ||
                ""
            )
              .toLowerCase()
              .includes(keyword)
          );
        }
      );
    }, [
      products,
      search,
    ]);

  /*
   * ==================================================
   * BUY REAL NUMBER
   * ==================================================
   *
   * STEP PURCHASE BELUM KITA UBAH.
   *
   * Untuk sementara tombol akan memanggil
   * /api/orders dengan product_id.
   *
   * API orders akan kita perbaiki di STEP 2.
   */

  async function buyNumber(
    product
  ) {
    try {
      setBuyingId(
        product.id
      );

      setBuyError("");
      setSuccessOrder(null);

      const response =
        await fetch(
          "/api/orders",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              product_id:
                product.id,
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

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result?.error?.message ||
            result?.error ||
            "Gagal membeli nomor."
        );
      }

      setSuccessOrder(
        result.order || null
      );
    } catch (error) {
      console.error(
        "BUY NUMBER ERROR:",
        error
      );

      setBuyError(
        error?.message ||
          "Gagal membeli nomor."
      );
    } finally {
      setBuyingId(null);
    }
  }

  /*
   * ==================================================
   * RENDER
   * ==================================================
   */

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
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            marginBottom: "8px",
          }}
        >
          Beli Nomor
        </h1>

        <p
          style={{
            color: "#94a3b8",
            marginTop: 0,
          }}
        >
          Catalog langsung dari SMSCode.
        </p>

        {/* ERROR */}

        {error && (
          <div
            style={{
              marginTop: "20px",
              padding: "14px",
              borderRadius: "10px",
              background: "#3f1d2e",
              color: "#fda4af",
            }}
          >
            {error}
          </div>
        )}

        {/* FILTER */}

        <section
          style={{
            marginTop: "25px",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "14px",
          }}
        >
          {/* COUNTRY */}

          <div>
            <label
              style={labelStyle}
            >
              Negara
            </label>

            <select
              value={country}
              onChange={(event) =>
                handleCountryChange(
                  event.target.value
                )
              }
              style={selectStyle}
              disabled={
                loadingCountries
              }
            >
              <option value="">
                {loadingCountries
                  ? "Memuat negara..."
                  : "Pilih negara"}
              </option>

              {countries.map(
                (item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.emoji || ""}{" "}
                    {item.name}
                  </option>
                )
              )}
            </select>
          </div>

          {/* SERVICE */}

          <div>
            <label
              style={labelStyle}
            >
              Service
            </label>

            <select
              value={service}
              onChange={(event) =>
                handleServiceChange(
                  event.target.value
                )
              }
              style={selectStyle}
              disabled={
                !country ||
                loadingServices
              }
            >
              <option value="">
                {loadingServices
                  ? "Memuat service..."
                  : "Pilih service"}
              </option>

              {services.map(
                (item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </option>
                )
              )}
            </select>
          </div>

          {/* OPERATOR */}

          <div>
            <label
              style={labelStyle}
            >
              Operator
            </label>

            <select
              value={operator}
              onChange={(event) =>
                handleOperatorChange(
                  event.target.value
                )
              }
              style={selectStyle}
              disabled={
                !service ||
                loadingOperators
              }
            >
              <option value="all">
                {loadingOperators
                  ? "Memuat operator..."
                  : "Semua Operator"}
              </option>

              {operators
                .filter(
                  (item) =>
                    item.id != null
                )
                .map(
                  (item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.display_name ||
                        item.name ||
                        item.operator_name ||
                        `Operator ${item.id}`}
                    </option>
                  )
                )}
            </select>
          </div>

          {/* SEARCH */}

          <div>
            <label
              style={labelStyle}
            >
              Cari
            </label>

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Cari produk..."
              style={inputStyle}
              disabled={
                products.length === 0
              }
            />
          </div>
        </section>

        {/* BUY ERROR */}

        {buyError && (
          <div
            style={{
              marginTop: "20px",
              padding: "14px",
              borderRadius: "10px",
              background: "#3f1d2e",
              color: "#fda4af",
            }}
          >
            {buyError}
          </div>
        )}

        {/* SUCCESS */}

        {successOrder && (
          <div
            style={{
              marginTop: "20px",
              padding: "18px",
              borderRadius: "12px",
              background: "#14532d",
              color: "#86efac",
            }}
          >
            <strong>
              Nomor berhasil dibeli.
            </strong>

            <div
              style={{
                marginTop: "8px",
              }}
            >
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

        {/* PRODUCTS */}

        <section
          style={{
            marginTop: "30px",
          }}
        >
          {!country ||
          !service ? (
            <div
              style={{
                padding: "40px",
                textAlign: "center",
                background: "#111827",
                borderRadius: "14px",
                color: "#94a3b8",
              }}
            >
              Pilih negara dan service
              untuk melihat nomor.
            </div>
          ) : loadingProducts ? (
            <div
              style={{
                padding: "40px",
                textAlign: "center",
                background: "#111827",
                borderRadius: "14px",
                color: "#94a3b8",
              }}
            >
              Mengambil produk
              langsung dari SMSCode...
            </div>
          ) : (
            <>
              <div
                style={{
                  marginBottom: "15px",
                  color: "#94a3b8",
                }}
              >
                Menampilkan{" "}
                <strong
                  style={{
                    color: "#fff",
                  }}
                >
                  {
                    filteredProducts.length
                  }
                </strong>{" "}
                produk
              </div>

              {filteredProducts.length ===
              0 ? (
                <div
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    background:
                      "#111827",
                    borderRadius:
                      "14px",
                    color:
                      "#94a3b8",
                  }}
                >
                  Produk tidak
                  tersedia untuk
                  kombinasi ini.
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(250px, 1fr))",
                    gap: "15px",
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

                      const isBuying =
                        buyingId ===
                        product.id;

                      return (
                        <div
                          key={
                            product.id
                          }
                          style={{
                            background:
                              "#111827",
                            border:
                              "1px solid #1f2937",
                            borderRadius:
                              "14px",
                            padding:
                              "18px",
                          }}
                        >
                          <div
                            style={{
                              display:
                                "flex",
                              justifyContent:
                                "space-between",
                              gap: "10px",
                            }}
                          >
                            <strong>
                              {product.name ||
                                `Product ${product.id}`}
                            </strong>

                            <span
                              style={{
                                color:
                                  stock >
                                  0
                                    ? "#5eead4"
                                    : "#f87171",
                                fontSize:
                                  "13px",
                              }}
                            >
                              Stock{" "}
                              {stock}
                            </span>
                          </div>

                          <div
                            style={{
                              marginTop:
                                "14px",
                              color:
                                "#94a3b8",
                              fontSize:
                                "14px",
                            }}
                          >
                            {product.country_emoji ||
                              ""}{" "}
                            {
                              product.country_name
                            }
                          </div>

                          <div
                            style={{
                              marginTop:
                                "8px",
                              color:
                                "#94a3b8",
                              fontSize:
                                "14px",
                            }}
                          >
                            Service:{" "}
                            {
                              product.service_name
                            }
                          </div>

                          <div
                            style={{
                              marginTop:
                                "8px",
                              color:
                                "#94a3b8",
                              fontSize:
                                "14px",
                            }}
                          >
                            Operator:{" "}
                            {
                              product.operator_name
                            }
                          </div>

                          <div
                            style={{
                              marginTop:
                                "18px",
                              fontSize:
                                "22px",
                              fontWeight:
                                800,
                            }}
                          >
                            Rp{" "}
                            {Number(
                              product.selling_price ||
                                0
                            ).toLocaleString(
                              "id-ID"
                            )}
                          </div>

                          <div
                            style={{
                              marginTop:
                                "4px",
                              color:
                                "#64748b",
                              fontSize:
                                "12px",
                            }}
                          >
                            Supplier: Rp{" "}
                            {Number(
                              product.supplier_price ||
                                0
                            ).toLocaleString(
                              "id-ID"
                            )}
                          </div>

                          <button
                            type="button"
                            disabled={
                              stock <= 0 ||
                              isBuying
                            }
                            onClick={() =>
                              buyNumber(
                                product
                              )
                            }
                            style={{
                              width:
                                "100%",
                              marginTop:
                                "16px",
                              padding:
                                "12px",
                              border:
                                "none",
                              borderRadius:
                                "10px",
                              background:
                                stock <=
                                0
                                  ? "#374151"
                                  : "#5eead4",
                              color:
                                stock <=
                                0
                                  ? "#9ca3af"
                                  : "#06111a",
                              fontWeight:
                                800,
                              cursor:
                                stock <=
                                  0 ||
                                isBuying
                                  ? "not-allowed"
                                  : "pointer",
                            }}
                          >
                            {isBuying
                              ? "Membeli..."
                              : stock <=
                                0
                              ? "Stock Habis"
                              : "Beli Nomor"}
                          </button>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "7px",
  color: "#cbd5e1",
  fontSize: "14px",
  fontWeight: 700,
};

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
