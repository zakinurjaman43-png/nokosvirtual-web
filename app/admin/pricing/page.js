"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function formatRupiah(value) {
  return Number(value || 0).toLocaleString(
    "id-ID"
  );
}

export default function PricingPage() {
  const [markup, setMarkup] =
    useState("1000");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    async function loadPricing() {
      try {
        const response =
          await fetch(
            "/api/admin/pricing",
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
              "Gagal memuat pricing."
          );
        }

        setMarkup(
          String(
            data.pricing?.markup ??
              1000
          )
        );
      } catch (error) {
        setMessage(
          error.message
        );
      } finally {
        setLoading(false);
      }
    }

    loadPricing();
  }, []);

  async function savePricing() {
    const value =
      Number(markup);

    if (
      !Number.isInteger(value) ||
      value < 0
    ) {
      setMessage(
        "Markup harus angka bulat 0 atau lebih."
      );
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response =
        await fetch(
          "/api/admin/pricing",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              markup: value,
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
            "Gagal menyimpan pricing."
        );
      }

      setMarkup(
        String(
          data.pricing.markup
        )
      );

      setMessage(
        "Pricing berhasil disimpan."
      );
    } catch (error) {
      setMessage(
        error.message
      );
    } finally {
      setSaving(false);
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
          maxWidth: 700,
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

        <section
          style={{
            marginTop: 25,
            background: "#111827",
            border:
              "1px solid #1f2937",
            borderRadius: 16,
            padding: 25,
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
              margin:
                "8px 0",
            }}
          >
            ⚙️ Pricing
          </h1>

          <p
            style={{
              color: "#94a3b8",
              lineHeight: 1.6,
            }}
          >
            Atur markup harga jual
            dari harga supplier
            SMSCode.
          </p>

          <label
            style={{
              display: "block",
              marginTop: 25,
              marginBottom: 8,
              fontWeight: 700,
            }}
          >
            Markup per nomor
          </label>

          <div
            style={{
              display: "flex",
              alignItems:
                "center",
              background:
                "#070b14",
              border:
                "1px solid #374151",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <span
              style={{
                paddingLeft: 14,
                color: "#94a3b8",
              }}
            >
              Rp
            </span>

            <input
              type="number"
              min="0"
              step="100"
              value={markup}
              onChange={(e) =>
                setMarkup(
                  e.target.value
                )
              }
              disabled={
                loading || saving
              }
              style={{
                width: "100%",
                padding: 14,
                border: "none",
                outline: "none",
                background:
                  "transparent",
                color: "#fff",
                fontSize: 18,
              }}
            />
          </div>

          <p
            style={{
              color: "#64748b",
              fontSize: 13,
            }}
          >
            Default saat ini:
            Rp1.000.
          </p>

          <div
            style={{
              marginTop: 18,
              padding: 15,
              background:
                "#0b1120",
              borderRadius: 10,
              color: "#cbd5e1",
            }}
          >
            Contoh: supplier
            Rp5.000 → harga jual
            Rp
            {formatRupiah(
              5000 +
                Number(
                  markup || 0
                )
            )}
          </div>

          <button
            type="button"
            onClick={
              savePricing
            }
            disabled={
              loading || saving
            }
            style={{
              width: "100%",
              marginTop: 18,
              padding: 14,
              border: "none",
              borderRadius: 10,
              background:
                "#5eead4",
              color: "#06111a",
              fontWeight: 800,
              cursor: saving
                ? "wait"
                : "pointer",
            }}
          >
            {saving
              ? "Menyimpan..."
              : "Simpan Pricing"}
          </button>

          {message && (
            <p
              style={{
                marginTop: 15,
                color: "#5eead4",
              }}
            >
              {message}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
