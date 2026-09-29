"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    alert("Login admin akan kita sambungkan ke sistem keamanan.");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#070b14",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#111827",
          border: "1px solid #1f2937",
          borderRadius: "18px",
          padding: "30px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            textAlign: "center",
            color: "#5eead4",
            fontSize: "24px",
            fontWeight: 800,
          }}
        >
          NOKOS <span style={{ color: "#fff" }}>VIRTUAL</span>
        </div>

        <p
          style={{
            textAlign: "center",
            color: "#64748b",
            marginTop: "8px",
          }}
        >
          Admin Panel
        </p>

        <form onSubmit={handleLogin}>
          <label>Username</label>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username admin"
            style={inputStyle}
          />

          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password admin"
            style={inputStyle}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              marginTop: "20px",
              border: "none",
              borderRadius: "10px",
              background: "#5eead4",
              color: "#06111a",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Masuk Admin
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            color: "#475569",
            fontSize: "12px",
            marginTop: "20px",
          }}
        >
          Akses khusus administrator
        </p>
      </div>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px",
  marginTop: "8px",
  marginBottom: "18px",
  borderRadius: "10px",
  border: "1px solid #374151",
  background: "#070b14",
  color: "#fff",
  fontSize: "15px",
};
