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
    <main className="auth-page">
      <div className="auth-backdrop" />
      <section className="auth-card">
        <Link href="/" className="wordmark"><span className="wordmark-mark">N</span>NOKOS<span>VIRTUAL</span></Link>
        <p className="eyebrow">{mode === "login" ? "AKSES AKUN" : "BUAT AKUN"}</p>
        <h1>{mode === "login" ? "Masuk dan lanjutkan transaksi." : "Mulai dengan akun NOKOS."}</h1>
        <p className="auth-copy">{mode === "login" ? "Akses saldo, nomor virtual, dan riwayat OTP Anda." : "Daftar untuk membeli nomor virtual melalui katalog live."}</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>Email<input type="email" placeholder="nama@email.com" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label>
          <label>Password<input type="password" placeholder="Minimal 6 karakter" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={6} required /></label>
          <button type="submit" className="button button-primary" disabled={loading}>{loading ? "Memproses..." : mode === "login" ? "Masuk ke dashboard →" : "Buat akun →"}</button>
        </form>
        {message && <p className="auth-message" role="status">{message}</p>}
        <button type="button" className="auth-switch" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMessage(""); }}>{mode === "login" ? "Belum punya akun? Daftar sekarang" : "Sudah memiliki akun? Masuk"}</button>
        <Link href="/" className="auth-back">← Kembali ke beranda</Link>
      </section>
    </main>
  );
}
