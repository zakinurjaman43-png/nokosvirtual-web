"use client";

import { useState } from "react";

const QUICK_AMOUNTS = [
  15000,
  25000,
  50000,
  100000,
  250000,
  500000,
];

const MIN_DEPOSIT = 15000;

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID").format(value);
}

export default function DepositPage() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [deposit, setDeposit] = useState(null);

  const numericAmount = Number(
    String(amount).replace(/\D/g, "")
  );

  function chooseAmount(value) {
    setAmount(String(value));
    setMessage("");
    setDeposit(null);
  }

  function handleAmountChange(e) {
    const value = e.target.value.replace(/\D/g, "");

    setAmount(value);
    setMessage("");
    setDeposit(null);
  }

  async function handleDeposit() {
    setMessage("");
    setDeposit(null);

    if (
      !Number.isInteger(numericAmount) ||
      numericAmount < MIN_DEPOSIT
    ) {
      setMessage(
        `Minimum deposit Rp${formatRupiah(
          MIN_DEPOSIT
        )}.`
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/deposit/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: numericAmount,
          }),
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            "Gagal membuat pembayaran."
        );
      }

      setDeposit(data.deposit);
    } catch (error) {
      setMessage(
        error.message ||
          "Terjadi kesalahan saat membuat pembayaran."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b1020",
        color: "#fff",
        padding: "40px 20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: 700,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            marginBottom: 28,
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: 1,
            }}
          >
            NOKOS <span style={{ color: "#72efb1" }}>
              STORE
            </span>
          </div>

          <h1
            style={{
              marginTop: 28,
              marginBottom: 8,
            }}
          >
            Deposit Saldo
          </h1>

          <p
            style={{
              color: "#9eabbf",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Tambahkan saldo untuk membeli nomor
            virtual.
          </p>
        </div>

        <section
          style={{
            background: "#11182b",
            border: "1px solid #26304a",
            borderRadius: 16,
            padding: 22,
          }}
        >
          <h3
            style={{
              marginTop: 0,
              marginBottom: 14,
            }}
          >
            Pilih nominal
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, minmax(0, 1fr))",
              gap: 10,
            }}
          >
            {QUICK_AMOUNTS.map((value) => {
              const selected =
                numericAmount === value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    chooseAmount(value)
                  }
                  style={{
                    padding: "13px 10px",
                    borderRadius: 10,
                    border: selected
                      ? "1px solid #72efb1"
                      : "1px solid #303a55",
                    background: selected
                      ? "#17382d"
                      : "#151d32",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  Rp{formatRupiah(value)}
                </button>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 22,
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              Atau masukkan nominal sendiri
            </label>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "#0c1324",
                border: "1px solid #303a55",
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              <span
                style={{
                  paddingLeft: 14,
                  color: "#9eabbf",
                }}
              >
                Rp
              </span>

              <input
                type="text"
                inputMode="numeric"
                value={
                  amount
                    ? formatRupiah(
                        numericAmount
                      )
                    : ""
                }
                onChange={handleAmountChange}
                placeholder="15000"
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: "#fff",
                  padding: "14px 12px",
                  fontSize: 16,
                }}
              />
            </div>

            <p
              style={{
                color: "#7f8ca3",
                fontSize: 13,
                marginTop: 8,
              }}
            >
              Minimum deposit Rp15.000
            </p>
          </div>

          <button
            type="button"
            onClick={handleDeposit}
            disabled={loading}
            style={{
              width: "100%",
              marginTop: 10,
              padding: "14px",
              border: "none",
              borderRadius: 10,
              background: loading
                ? "#40504a"
                : "#72efb1",
              color: "#07120d",
              fontSize: 16,
              fontWeight: 800,
              cursor: loading
                ? "wait"
                : "pointer",
            }}
          >
            {loading
              ? "Membuat QRIS..."
              : "Deposit Sekarang"}
          </button>

          {message && (
            <div
              style={{
                marginTop: 16,
                padding: 13,
                borderRadius: 10,
                background: "#3a1d25",
                color: "#ff9daa",
                lineHeight: 1.5,
              }}
            >
              {message}
            </div>
          )}
        </section>

        {deposit && (
          <section
            style={{
              marginTop: 20,
              background: "#11182b",
              border: "1px solid #26304a",
              borderRadius: 16,
              padding: 22,
              textAlign: "center",
            }}
          >
            <h2
              style={{
                marginTop: 0,
              }}
            >
              QRIS Pembayaran
            </h2>

            <p
              style={{
                color: "#9eabbf",
                marginBottom: 5,
              }}
            >
              Nominal
            </p>

            <div
              style={{
                fontSize: 25,
                fontWeight: 800,
                color: "#72efb1",
                marginBottom: 18,
              }}
            >
              Rp{formatRupiah(deposit.amount)}
            </div>

            {deposit.qr_url ? (
              <img
                src={deposit.qr_url}
                alt="QRIS Pembayaran"
                style={{
                  width: 280,
                  maxWidth: "100%",
                  background: "#fff",
                  padding: 12,
                  borderRadius: 12,
                }}
              />
            ) : (
              <p
                style={{
                  color: "#ffcf70",
                }}
              >
                QR belum tersedia dari Midtrans.
              </p>
            )}

            <div
              style={{
                marginTop: 18,
                padding: 14,
                background: "#0c1324",
                borderRadius: 10,
                textAlign: "left",
              }}
            >
              <div
                style={{
                  color: "#7f8ca3",
                  fontSize: 13,
                }}
              >
                Order ID
              </div>

              <div
                style={{
                  marginTop: 4,
                  wordBreak: "break-all",
                }}
              >
                {deposit.order_id}
              </div>

              <div
                style={{
                  marginTop: 14,
                  color: "#7f8ca3",
                  fontSize: 13,
                }}
              >
                Status
              </div>

              <div
                style={{
                  marginTop: 4,
                  color: "#72efb1",
                  fontWeight: 700,
                }}
              >
                {deposit.status}
              </div>
            </div>

            <p
              style={{
                color: "#9eabbf",
                fontSize: 13,
                lineHeight: 1.6,
                marginTop: 18,
              }}
            >
              Scan QRIS menggunakan aplikasi
              pembayaran yang mendukung QRIS.
              Setelah pembayaran terverifikasi,
              saldo akan diproses otomatis.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
