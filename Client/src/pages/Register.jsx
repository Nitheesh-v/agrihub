import { useState } from "react";
import { registerUser } from "@/services/authService";
import { useNavigate } from "react-router-dom";

const roles = [
  {
    value: "farmer",
    label: "Farmer",
    desc: "Manage crops, contracts & payments",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M12 2C9 7 4 9 4 14a8 8 0 0016 0c0-5-5-7-8-12z" />
      </svg>
    ),
  },
  {
    value: "buyer",
    label: "Buyer",
    desc: "Browse & purchase directly from farmers",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
      </svg>
    ),
  },
  {
    value: "company",
    label: "Company",
    desc: "Offer contracts, funding & insurance",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
];

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "farmer" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);
      alert("Registered successfully");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* Left Panel */}
      <div className="hidden md:flex md:w-[48%] relative overflow-hidden" style={{ background: "#1a3d1f" }}>
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1050&q=80"
          alt="Farming"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.35 }}
        />

        <div className="relative z-10 flex flex-col justify-end h-full p-10 space-y-6">
          {/* Brand */}
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: "#3B6D11" }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" style={{ fill: "#C0DD97" }}>
                <path d="M12 2C9 7 4 9 4 14a8 8 0 0016 0c0-5-5-7-8-12z" />
              </svg>
            </div>
            <span className="text-xl font-medium" style={{ color: "#EAF3DE" }}>
              AgriHub
            </span>
          </div>

          <div>
            <h1 className="text-4xl font-medium leading-snug mb-3" style={{ color: "#EAF3DE" }}>
              Grow your<br />agriculture business.
            </h1>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#9FE1CB" }}>
              Join thousands of farmers, buyers, and companies already using AgriConnect to trade smarter and grow faster.
            </p>

            <ul className="space-y-3">
              {[
                "Contract farming management",
                "Direct marketplace access",
                "Scheduled payments & risk sharing",
                "Crop insurance & partial funding",
              ].map((feat) => (
                <li key={feat} className="flex items-center gap-3">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: "#5DCAA5" }}
                  />
                  <span className="text-sm" style={{ color: "#9FE1CB" }}>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-1 justify-center items-center bg-white p-8">
        <div className="w-full max-w-sm">

          <h2 className="text-2xl font-medium text-gray-900 mb-1">Create your account</h2>
          <p className="text-sm text-gray-500 mb-7">Join AgriConnect and start managing your operations</p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500 tracking-wide uppercase">
                Full name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="h-10 w-full border border-gray-200 rounded-lg px-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-700 transition"
                style={{ boxShadow: "none" }}
                onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px #EAF3DE")}
                onBlur={(e) => (e.target.style.boxShadow = "none")}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500 tracking-wide uppercase">
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="h-10 w-full border border-gray-200 rounded-lg px-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-700 transition"
                style={{ boxShadow: "none" }}
                onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px #EAF3DE")}
                onBlur={(e) => (e.target.style.boxShadow = "none")}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500 tracking-wide uppercase">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="h-10 w-full border border-gray-200 rounded-lg px-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-700 transition"
                style={{ boxShadow: "none" }}
                onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px #EAF3DE")}
                onBlur={(e) => (e.target.style.boxShadow = "none")}
              />
            </div>

            {/* Role selector — card style */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500 tracking-wide uppercase">
                I am a
              </label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((r) => {
                  const selected = form.role === r.value;
                  return (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setForm({ ...form, role: r.value })}
                      className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg border text-center transition-all"
                      style={{
                        border: selected ? "1.5px solid #3B6D11" : "0.5px solid #e5e7eb",
                        background: selected ? "#EAF3DE" : "#fff",
                        color: selected ? "#27500A" : "#6b7280",
                      }}
                    >
                      <span style={{ color: selected ? "#3B6D11" : "#9ca3af" }}>{r.icon}</span>
                      <span className="text-xs font-medium">{r.label}</span>
                      <span className="text-xs leading-tight" style={{ color: selected ? "#3B6D11" : "#9ca3af", fontSize: "10px" }}>
                        {r.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full h-10 rounded-lg text-sm font-medium transition-all active:scale-[0.98] mt-2"
              style={{ background: "#27500A", color: "#EAF3DE" }}
              onMouseEnter={(e) => (e.target.style.background = "#1a3d06")}
              onMouseLeave={(e) => (e.target.style.background = "#27500A")}
            >
              Create account
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <button
              type="button"
              className="font-medium hover:underline"
              style={{ color: "#3B6D11" }}
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}