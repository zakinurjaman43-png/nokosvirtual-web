"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function formatRupiah(value) {
  const number = Number(value || 0);

  return `${number < 0 ? "-" : ""}Rp${Math.abs(
    number
  ).toLocaleString("id-ID")}`;
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

function getTypeLabel(type) {
  const labels = {
    deposit: "Deposit",
    purchase: "Pembelian",
    refund: "Refund",
    admin_add: "Admin Tambah",
    admin_subtract: "Admin Kurangi",
  };

  return labels[type] || type || "-";
}

function getTypeStyle(type) {
  if (
    type === "deposit" ||
    type === "refund" ||
    type === "admin_add"
  ) {
    return {
      background: "#123b2d",
      color: "#5eead4",
    };
  }

  if (
    type === "purchase" ||
    type === "admin_subtract"
  ) {
    return {
      background: "#3b1d24",
      color: "#fca5a5",
    };
  }

  return {
    background: "#172033",
    color: "#94a3b8",
  };
}

export default function TransactionsPage() {
  const [transactions, setTransactions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [typeFilter, setTypeFilter] =
    useState("all");

  async function loadTransactions() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/admin/transactions",
        {
          cache: "no-store",
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.error ||
            "Gagal mengambil transaksi."
        );
      }

      setTransactions(
        data.transactions || []
      );
    } catch (error) {
      setError(
        error.message ||
          "Gagal mengambil transaksi."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  const filteredTransactions =
    transactions.filter(
      (transaction) =>
        typeFilter === "all" ||
        transaction.type ===
          typeFilter
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
            💰 Transactions
          </h1>

          <p
            style={{
              color: "#64748b",
              margin: 0,
            }}
          >
            Riwayat seluruh perubahan
            saldo user.
          </p>
        </div>

        <section
          style={{
            background: "#111827",
            border:
              "1px solid #1f2937",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <label
            style={{
              display: "block",
              color: "#94a3b8",
              marginBottom: "8px",
            }}
          >
            Filter transaksi
          </label>

          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(
                e.target.value
              )
            }
            style={{
              width: "100%",
              maxWidth: "350px",
              padding: "12px",
              borderRadius: "10px",
              border:
                "1px solid #374151",
              background: "#070b14",
              color: "#fff",
            }}
          >
            <option value="all">
              Semua Transaksi
            </option>

            <option value="deposit">
              Deposit
            </option>

            <option value="purchase">
              Pembelian
            </option>

            <option value="refund">
              Refund
            </option>

            <option value="admin_add">
              Admin Tambah
            </option>

            <option value="admin_subtract">
              Admin Kurangi
            </option>
          </select>
        </section>

        {loading && (
          <div
            style={{
              background: "#111827",
              border:
                "1px solid #1f2937",
              borderRadius: "16px",
              padding: "25px",
              color: "#94a3b8",
            }}
          >
            Memuat transaksi...
          </div>
        )}

        {error && !loading && (
          <div
            style={{
              background: "#3f1515",
              border:
                "1px solid #7f1d1d",
              borderRadius: "12px",
              padding: "18px",
              color: "#fca5a5",
            }}
          >
            <strong>
              Gagal mengambil data:
            </strong>

            <br />

            {error}
          </div>
        )}

        {!loading &&
          !error && (
            <section
              style={{
                background: "#111827",
                border:
                  "1px solid #1f2937",
                borderRadius: "16px",
                padding: "20px",
                overflowX: "auto",
              }}
            >
              <table
                style={{
                  width: "100%",
                  minWidth: "1100px",
                  borderCollapse:
                    "collapse",
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
                    <th
                      style={{
                        padding: "12px",
                      }}
                    >
                      ID
                    </th>

                    <th
                      style={{
                        padding: "12px",
                      }}
                    >
                      User
                    </th>

                    <th
                      style={{
                        padding: "12px",
                      }}
                    >
                      Tipe
                    </th>

                    <th
                      style={{
                        padding: "12px",
                      }}
                    >
                      Nominal
                    </th>

                    <th
                      style={{
                        padding: "12px",
                      }}
                    >
                      Saldo Sebelum
                    </th>

                    <th
                      style={{
                        padding: "12px",
                      }}
                    >
                      Saldo Sesudah
                    </th>

                    <th
                      style={{
                        padding: "12px",
                      }}
                    >
                      Keterangan
                    </th>

                    <th
                      style={{
                        padding: "12px",
                      }}
                    >
                      Tanggal
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTransactions.length >
                  0 ? (
                    filteredTransactions.map(
                      (transaction) => {
                        const typeStyle =
                          getTypeStyle(
                            transaction.type
                          );

                        return (
                          <tr
                            key={
                              transaction.id
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
                                transaction.id
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
                                  fontWeight: 700,
                                }}
                              >
                                {transaction
                                  .user
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
                                User ID:{" "}
                                {
                                  transaction.user_id
                                }
                              </div>
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
                                    "6px 9px",
                                  borderRadius:
                                    "8px",
                                  fontSize:
                                    "12px",
                                  fontWeight:
                                    700,
                                  ...typeStyle,
                                }}
                              >
                                {getTypeLabel(
                                  transaction.type
                                )}
                              </span>
                            </td>

                            <td
                              style={{
                                padding:
                                  "12px",
                                fontWeight:
                                  800,
                                color:
                                  transaction.amount >=
                                  0
                                    ? "#5eead4"
                                    : "#fca5a5",
                              }}
                            >
                              {formatRupiah(
                                transaction.amount
                              )}
                            </td>

                            <td
                              style={{
                                padding:
                                  "12px",
                              }}
                            >
                              {formatRupiah(
                                transaction.balance_before
                              )}
                            </td>

                            <td
                              style={{
                                padding:
                                  "12px",
                              }}
                            >
                              {formatRupiah(
                                transaction.balance_after
                              )}
                            </td>

                            <td
                              style={{
                                padding:
                                  "12px",
                                color:
                                  "#cbd5e1",
                              }}
                            >
                              {transaction.description ||
                                "-"}
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
                                transaction.created_at
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
                            "40px",
                          textAlign:
                            "center",
                          color:
                            "#64748b",
                        }}
                      >
                        Belum ada transaksi.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
          )}
      </div>
    </main>
  );
}
