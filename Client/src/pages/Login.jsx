import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/services/authService";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser(form);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "admin") {
        window.location.href = "/admin";
      } else if (data.user.role === "farmer") {
        window.location.href = "/farmer";
      } else if (data.user.role === "company") {
        window.location.href = "/company";
      } else {
        window.location.href = "/buyer";
      }
    } catch (err) {
      console.log(err);
      alert("Login failed ❌");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "row", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* ── Left Panel ── */}
      <div
        style={{
          width: "48%",
          position: "relative",
          overflow: "hidden",
          background: "#1a3d1f",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1050&q=80"
          alt="Scenic landscape"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.38,
          }}
        />

        {/* Content pinned to bottom */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            height: "100%",
            padding: "2.5rem",
            gap: "1.5rem",
          }}
        >
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "#3B6D11",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, fill: "#C0DD97" }}>
                <path d="M12 2C9 7 4 9 4 14a8 8 0 0016 0c0-5-5-7-8-12z" />
              </svg>
            </div>
            <span style={{ color: "#EAF3DE", fontSize: "1.2rem", fontWeight: 500 }}>AgriHub</span>
          </div>

          {/* Tagline */}
          <div>
            <h1 style={{ color: "#EAF3DE", fontSize: "2.4rem", fontWeight: 500, lineHeight: 1.25, marginBottom: "0.75rem" }}>
              Farming smarter,<br />together.
            </h1>
            <p style={{ color: "#9FE1CB", fontSize: "0.92rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
              One platform for farmers, buyers, and companies to collaborate, trade, and grow.
            </p>

            {/* Features */}
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                "Contract farming & direct marketplace",
                "Scheduled payments & risk sharing",
                "Crop insurance & partial funding",
                "Secure operations end-to-end",
              ].map((feat) => (
                <li key={feat} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#5DCAA5",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ color: "#9FE1CB", fontSize: "0.875rem" }}>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#fff",
          padding: "2rem",
        }}
      >
        <div style={{ width: "100%", maxWidth: 380 }}>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 500, color: "#111", marginBottom: "0.25rem" }}>
            Welcome back
          </h2>
          <p style={{ fontSize: "0.9rem", color: "#6b7280", marginBottom: "1.75rem" }}>
            Sign in to your account to continue
          </p>

          {/* Info banner */}
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "flex-start",
              background: "#EAF3DE",
              borderRadius: 8,
              padding: "0.75rem 1rem",
              marginBottom: "1.5rem",
              fontSize: "0.85rem",
              color: "#27500A",
              lineHeight: 1.6,
            }}
          >
            <svg style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2 }} viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="#3B6D11" strokeWidth="1.2" />
              <path d="M8 7v5M8 5v1" stroke="#3B6D11" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <span>Your dashboard will load automatically based on your role — farmer, buyer, or company.</span>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* Email */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              <label style={{ fontSize: "0.72rem", fontWeight: 500, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                style={{
                  height: 40,
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  padding: "0 0.75rem",
                  fontSize: "0.9rem",
                  color: "#111",
                  outline: "none",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                  background: "#fff",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3B6D11";
                  e.target.style.boxShadow = "0 0 0 3px #EAF3DE";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Password */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <label style={{ fontSize: "0.72rem", fontWeight: 500, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 500,
                    color: "#3B6D11",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                style={{
                  height: 40,
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  padding: "0 0.75rem",
                  fontSize: "0.9rem",
                  color: "#111",
                  outline: "none",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                  background: "#fff",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3B6D11";
                  e.target.style.boxShadow = "0 0 0 3px #EAF3DE";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              style={{
                height: 40,
                borderRadius: 8,
                background: "#27500A",
                color: "#EAF3DE",
                fontSize: "0.9rem",
                fontWeight: 500,
                border: "none",
                cursor: "pointer",
                transition: "background 0.15s, transform 0.1s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#1a3d06")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#27500A")}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Sign in
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "1.25rem 0" }}>
            <hr style={{ flex: 1, border: "none", borderTop: "1px solid #f3f4f6" }} />
            <span style={{ fontSize: "0.8rem", color: "#9ca3af" }}>or</span>
            <hr style={{ flex: 1, border: "none", borderTop: "1px solid #f3f4f6" }} />
          </div>

          {/* Google */}
          <button
            type="button"
            style={{
              width: "100%",
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              background: "#f9fafb",
              color: "#374151",
              fontSize: "0.875rem",
              cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#f9fafb")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          {/* Register link */}
          <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#6b7280", marginTop: "1.5rem" }}>
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              style={{
                fontWeight: 500,
                color: "#3B6D11",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
            >
              Create one
            </button>
          </p>
        </div>
      </div>

      {/* Responsive: hide left panel on small screens */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="width: 48%"] { display: none !important; }
        }
      `}</style>
    </div>
  );
}