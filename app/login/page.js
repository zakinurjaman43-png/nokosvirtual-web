"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Login() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      if (!email || !password) {
        setMessage("Email dan password wajib diisi.");
        return;
      }

      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo:
              window.location.origin + "/dashboard",
          },
        });

        if (error) throw error;

        if (data.session) {
          window.location.href = "/dashboard";
        } else {
          setMessage(
            "Akun berhasil dibuat. Cek email untuk verifikasi sebelum login."
          );
          setMode("login");
        }
      } else {
        const { error } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (error) throw error;

        window.location.href = "/dashboard";
      }
    } catch (error) {
      setMessage(error.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <div className="container">
        <div className="formbox">

          <div className="brand">
            NOKOS <span>STORE</span>
          </div>

          <h2>
            {mode === "login"
              ? "Masuk ke akun"
              : "Buat akun"}
          </h2>

          <p style={{ color: "#9eabbf" }}>
            {mode === "login"
              ? "Masuk untuk membeli nomor virtual dan mengelola saldo."
              : "Buat akun untuk mulai menggunakan NOKOS STORE."}
          </p>

          <form onSubmit={handleSubmit}>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              style={{
                width: "100%",
                marginTop: 16,
                padding: "12px 14px",
                boxSizing: "border-box",
              }}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              autoComplete={
                mode === "login"
                  ? "current-password"
                  : "new-password"
              }
              minLength={6}
              required
              style={{
                width: "100%",
                marginTop: 10,
                padding: "12px 14px",
                boxSizing: "border-box",
              }}
            />

            <button
              type="submit"
              className="btn primary"
              disabled={loading}
              style={{
                width: "100%",
                marginTop: 12,
                cursor: loading
                  ? "wait"
                  : "pointer",
              }}
            >
              {loading
                ? "Memproses..."
                : mode === "login"
                ? "Masuk"
                : "Daftar"}
            </button>

          </form>

          {message && (
            <p
              style={{
                color: "#72efb1",
                marginTop: 14,
                lineHeight: 1.5,
              }}
            >
              {message}
            </p>
          )}

          <button
            type="button"
            className="btn dark"
            onClick={() => {
              setMode(
                mode === "login"
                  ? "signup"
                  : "login"
              );
              setMessage("");
            }}
            style={{
              width: "100%",
              marginTop: 10,
              cursor: "pointer",
            }}
          >
            {mode === "login"
              ? "Belum punya akun? Daftar"
              : "Sudah punya akun? Masuk"}
          </button>

          <Link
            href="/"
            style={{
              display: "block",
              marginTop: 22,
              color: "#72efb1",
            }}
          >
            ← Kembali
          </Link>

        </div>
      </div>
    </main>
  );
}
