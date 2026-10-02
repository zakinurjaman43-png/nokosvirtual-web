"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError) throw signInError;

      // /admin is protected by middleware and remains the authorization
      // boundary; a valid non-admin session is redirected to /dashboard.
      router.replace("/admin");
      router.refresh();
    } catch (loginError) {
      setError(loginError.message || "Login admin gagal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={pageStyle}>
      <div style={cardStyle}>
        <div style={brandStyle}>NOKOS <span style={{ color: "#fff" }}>VIRTUAL</span></div>
        <p style={subtitleStyle}>Masuk ke panel administrator</p>
        <form onSubmit={handleLogin}>
          <label>Email administrator</label>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@domain.com" autoComplete="email" required style={inputStyle} />
          <label>Password</label>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" autoComplete="current-password" required style={inputStyle} />
          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "Memverifikasi..." : "Masuk Admin"}
          </button>
        </form>
        {error && <p role="alert" style={{ color: "#fda4af", lineHeight: 1.5 }}>{error}</p>}
        <p style={footerStyle}>Akses hanya untuk email yang terdaftar dalam ADMIN_EMAILS.</p>
      </div>
    </main>
  );
}

const pageStyle = { minHeight: "100vh", background: "#070b14", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" };
const cardStyle = { width: "100%", maxWidth: "420px", background: "#111827", border: "1px solid #1f2937", borderRadius: "18px", padding: "30px", boxSizing: "border-box" };
const brandStyle = { textAlign: "center", color: "#5eead4", fontSize: "24px", fontWeight: 800 };
const subtitleStyle = { textAlign: "center", color: "#94a3b8", marginTop: "8px", marginBottom: "26px" };
const inputStyle = { width: "100%", boxSizing: "border-box", padding: "13px", marginTop: "8px", marginBottom: "18px", borderRadius: "10px", border: "1px solid #374151", background: "#070b14", color: "#fff", fontSize: "15px" };
const buttonStyle = { width: "100%", padding: "14px", marginTop: "4px", border: "none", borderRadius: "10px", background: "#5eead4", color: "#06111a", fontWeight: 800, cursor: "pointer" };
const footerStyle = { textAlign: "center", color: "#64748b", fontSize: "12px", marginTop: "20px", lineHeight: 1.5 };
