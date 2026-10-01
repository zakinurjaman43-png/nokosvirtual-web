"use client";

import Link from "next/link";
import { useState } from "react";

function formatRupiah(value) {
  return Number(value || 0).toLocaleString(
    "id-ID"
  );
}

export default function UsersClient({
  initialUsers,
}) {
  const [users, setUsers] =
    useState(initialUsers || []);

  const [selectedUser, setSelectedUser] =
    useState(null);

  const [amount, setAmount] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  function openBalance(user) {
    setSelectedUser(user);
    setAmount("");
    setMessage("");
    setError("");
  }

  function closeBalance() {
    if (loading) return;

    setSelectedUser(null);
    setAmount("");
    setMessage("");
    setError("");
  }

  async function updateBalance() {
    setMessage("");
    setError("");

    const numericAmount = Number(
      String(amount).replace(/\D/g, "")
    );

    if (
      !Number.isInteger(numericAmount) ||
      numericAmount <= 0
    ) {
      setError(
        "Masukkan nominal lebih dari Rp0."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/admin/users/balance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: selectedUser.id,
            amount:
              selectedUser.action === "add"
                ? numericAmount
                : -numericAmount,
          }),
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
            "Gagal mengubah saldo."
        );
      }

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id ===
          data.user.id
            ? {
                ...user,
                balance:
                  data.user.balance,
              }
            : user
        )
      );

      setMessage(
        "Saldo berhasil diperbarui."
      );

      setAmount("");
    } catch (err) {
      setError(
        err.message ||
          "Terjadi kesalahan."
      );
    } finally {
      setLoading(false);
    }
  }

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
          maxWidth: "1200px",
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
            background: "#111827",
            border:
              "1px solid #1f2937",
            borderRadius: "16px",
            padding: "25px",
          }}
        >
          <h1
            style={{
              marginTop: 0,
            }}
          >
            👥 Users
          </h1>

          <p
            style={{
              color: "#94a3b8",
            }}
          >
            Kelola user dan saldo.
          </p>

          <div
            style={{
              marginTop: "25px",
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
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
                    Email
                  </th>

                  <th
                    style={{
                      padding: "12px",
                    }}
                  >
                    Telegram ID
                  </th>

                  <th
                    style={{
                      padding: "12px",
                    }}
                  >
                    Nama
                  </th>

                  <th
                    style={{
                      padding: "12px",
                    }}
                  >
                    Saldo
                  </th>

                  <th
                    style={{
                      padding: "12px",
                    }}
                  >
                    Status
                  </th>

                  <th
                    style={{
                      padding: "12px",
                    }}
                  >
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {users &&
                users.length > 0 ? (
                  users.map(
                    (user) => (
                      <tr
                        key={
                          user.id
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
                          {user.id}
                        </td>

                        <td
                          style={{
                            padding:
                              "12px",
                          }}
                        >
                          {user.email ||
                            "-"}
                        </td>

                        <td
                          style={{
                            padding:
                              "12px",
                          }}
                        >
                          {user.telegram_id ||
                            "-"}
                        </td>

                        <td
                          style={{
                            padding:
                              "12px",
                          }}
                        >
                          {user.first_name ||
                            "-"}
                        </td>

                        <td
                          style={{
                            padding:
                              "12px",
                            color:
                              "#5eead4",
                            fontWeight:
                              700,
                          }}
                        >
                          Rp{" "}
                          {formatRupiah(
                            user.balance
                          )}
                        </td>

                        <td
                          style={{
                            padding:
                              "12px",
                          }}
                        >
                          {user.is_active ? (
                            <span
                              style={{
                                color:
                                  "#22c55e",
                              }}
                            >
                              ● Aktif
                            </span>
                          ) : (
                            <span
                              style={{
                                color:
                                  "#ef4444",
                              }}
                            >
                              ● Nonaktif
                            </span>
                          )}
                        </td>

                        <td
                          style={{
                            padding:
                              "12px",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              openBalance(
                                user
                              )
                            }
                            style={{
                              padding:
                                "9px 13px",
                              border:
                                "1px solid #334155",
                              borderRadius:
                                "8px",
                              background:
                                "#172033",
                              color:
                                "#5eead4",
                              cursor:
                                "pointer",
                              fontWeight:
                                700,
                            }}
                          >
                            💰 Kelola
                            Saldo
                          </button>
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      style={{
                        padding:
                          "40px",
                        textAlign:
                          "center",
                        color:
                          "#64748b",
                      }}
                    >
                      Belum ada
                      user.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div
            style={{
              marginTop: "20px",
              color: "#64748b",
            }}
          >
            Total user:{" "}
            <strong>
              {users?.length || 0}
            </strong>
          </div>
        </div>
      </div>

      {selectedUser && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            padding: "20px",
            boxSizing:
              "border-box",
            zIndex: 100,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "430px",
              background:
                "#111827",
              border:
                "1px solid #334155",
              borderRadius:
                "16px",
              padding: "24px",
              boxSizing:
                "border-box",
            }}
          >
            <h2
              style={{
                marginTop: 0,
              }}
            >
              💰 Kelola Saldo
            </h2>

            <p
              style={{
                color:
                  "#94a3b8",
                marginBottom:
                  "5px",
              }}
            >
              User
            </p>

            <strong>
              {selectedUser.email ||
                selectedUser.telegram_id ||
                `ID ${selectedUser.id}`}
            </strong>

            <p
              style={{
                color:
                  "#94a3b8",
                marginTop:
                  "18px",
                marginBottom:
                  "5px",
              }}
            >
              Saldo sekarang
            </p>

            <div
              style={{
                fontSize:
                  "24px",
                fontWeight:
                  800,
                color:
                  "#5eead4",
              }}
            >
              Rp{" "}
              {formatRupiah(
                selectedUser.balance
              )}
            </div>

            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: "10px",
                marginTop:
                  "20px",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setSelectedUser({
                    ...selectedUser,
                    action: "add",
                  });
                  setMessage("");
                  setError("");
                }}
                style={{
                  padding:
                    "12px",
                  border:
                    selectedUser.action ===
                    "add"
                      ? "1px solid #5eead4"
                      : "1px solid #334155",
                  borderRadius:
                    "10px",
                  background:
                    selectedUser.action ===
                    "add"
                      ? "#123b38"
                      : "#172033",
                  color:
                    "#fff",
                  cursor:
                    "pointer",
                  fontWeight:
                    700,
                }}
              >
                + Tambah
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedUser({
                    ...selectedUser,
                    action: "subtract",
                  });
                  setMessage("");
                  setError("");
                }}
                style={{
                  padding:
                    "12px",
                  border:
                    selectedUser.action ===
                    "subtract"
                      ? "1px solid #f87171"
                      : "1px solid #334155",
                  borderRadius:
                    "10px",
                  background:
                    selectedUser.action ===
                    "subtract"
                      ? "#3b1d24"
                      : "#172033",
                  color:
                    "#fff",
                  cursor:
                    "pointer",
                  fontWeight:
                    700,
                }}
              >
                − Kurangi
              </button>
            </div>

            <input
              type="text"
              inputMode="numeric"
              placeholder="Nominal"
              value={
                amount
                  ? Number(
                      amount
                    ).toLocaleString(
                      "id-ID"
                    )
                  : ""
              }
              onChange={(e) => {
                const value =
                  e.target.value.replace(
                    /\D/g,
                    ""
                  );

                setAmount(
                  value
                );
                setMessage("");
                setError("");
              }}
              style={{
                width:
                  "100%",
                boxSizing:
                  "border-box",
                marginTop:
                  "14px",
                padding:
                  "13px",
                border:
                  "1px solid #334155",
                borderRadius:
                  "10px",
                background:
                  "#0b1120",
                color:
                  "#fff",
                outline:
                  "none",
                fontSize:
                  "16px",
              }}
            />

            {error && (
              <div
                style={{
                  marginTop:
                    "12px",
                  padding:
                    "11px",
                  borderRadius:
                    "8px",
                  background:
                    "#3b1d24",
                  color:
                    "#fca5a5",
                }}
              >
                {error}
              </div>
            )}

            {message && (
              <div
                style={{
                  marginTop:
                    "12px",
                  padding:
                    "11px",
                  borderRadius:
                    "8px",
                  background:
                    "#123b38",
                  color:
                    "#5eead4",
                }}
              >
                {message}
              </div>
            )}

            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: "10px",
                marginTop:
                  "18px",
              }}
            >
              <button
                type="button"
                onClick={
                  closeBalance
                }
                disabled={
                  loading
                }
                style={{
                  padding:
                    "13px",
                  border:
                    "1px solid #334155",
                  borderRadius:
                    "10px",
                  background:
                    "#172033",
                  color:
                    "#fff",
                  cursor:
                    "pointer",
                }}
              >
                Batal
              </button>

              <button
                type="button"
                onClick={
                  updateBalance
                }
                disabled={
                  loading ||
                  !selectedUser.action
                }
                style={{
                  padding:
                    "13px",
                  border:
                    "none",
                  borderRadius:
                    "10px",
                  background:
                    loading
                      ? "#40504a"
                      : "#5eead4",
                  color:
                    "#06100f",
                  cursor:
                    loading
                      ? "wait"
                      : "pointer",
                  fontWeight:
                    800,
                }}
              >
                {loading
                  ? "Menyimpan..."
                  : "Simpan Saldo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
