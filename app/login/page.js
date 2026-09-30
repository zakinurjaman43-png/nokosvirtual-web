"use client";

import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

export default function Login() {
  async function loginGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      alert("Login Google gagal: " + error.message);
    }
  }

  return (
    <main>
      <div className="container">
        <div className="formbox">
          <div className="brand">
            NOKOS <span>STORE</span>
          </div>

          <h2>Masuk ke akun</h2>

          <p style={{ color: "#9eabbf" }}>
            Masuk untuk membeli nomor virtual dan mengelola saldo.
          </p>

          <button
            onClick={loginGoogle}
            className="btn primary"
            style={{
              width: "100%",
              marginTop: 12,
              cursor: "pointer",
            }}
          >
            Masuk dengan Google
          </button>

          <button
            className="btn dark"
            style={{
              width: "100%",
              marginTop: 10,
            }}
            disabled
          >
            Telegram — segera hadir
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
