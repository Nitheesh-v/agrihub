import React, { useState } from "react";
import { Link } from "react-router-dom";

const NAV_LINKS = ["Funding", "Marketplace", "About", "Contact"];
const STATS = [
  { value: "15K+", label: "Active farmers" },
  { value: "₹40L+", label: "Funding provided" },
  { value: "500+", label: "Partner companies" },
  { value: "92%", label: "Success rate" },
];
const WHY = [
  { icon: "💸", title: "Zero interest funding", desc: "Get capital without any interest charges from verified partners" },
  { icon: "🏪", title: "Direct market access", desc: "Sell directly to buyers with zero middlemen cuts" },
  { icon: "✅", title: "Guaranteed purchase", desc: "Your harvest is guaranteed to be bought at fair prices" },
];
const HOW_IT_WORKS = [
  { step: 1, emoji: "📝", title: "Apply for funding", desc: "Submit your farming plan and required documents online" },
  { step: 2, emoji: "🔍", title: "Get approved", desc: "Our partners review and approve your application" },
  { step: 3, emoji: "💰", title: "Receive funds", desc: "Get funding directly in your bank account" },
  { step: 4, emoji: "🌾", title: "Grow & sell", desc: "Cultivate crops and sell back at guaranteed rates" },
];
const ROLES = [
  {
    emoji: "👨‍🌾", title: "For Farmers", color: "#14532d", accent: "#4ade80",
    items: ["Get pre-harvest funding", "Guaranteed buyers", "Fair market prices", "Direct market access"],
  },
  {
    emoji: "🏢", title: "For Companies", color: "#1e3a8a", accent: "#60a5fa",
    items: ["Reliable raw materials", "Consistent quality control", "Reduced procurement costs", "Direct farmer partnerships"],
  },
  {
    emoji: "🛒", title: "For Buyers", color: "#78350f", accent: "#fbbf24",
    items: ["Farm-fresh produce", "Lower prices, no markup", "Quality transparency", "Support local farmers"],
  },
];
const TESTIMONIALS = [
  { name: "Ravi Kumar", role: "Wheat Farmer, Punjab", avatar: "RK", text: "AgriHub helped me get ₹2L in funding before sowing. No interest, no middlemen. My income doubled this season." },
  { name: "Priya Foods Ltd.", role: "Food Processing Company", avatar: "PF", text: "We now source directly from 200+ verified farmers. Quality is consistent and costs are 30% lower than market." },
  { name: "Anita Singh", role: "Organic Produce Buyer", avatar: "AS", text: "I get farm-fresh vegetables at wholesale prices. I can see exactly where my food comes from." },
];

export const Home = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="font-sans" style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

      {/* ── NAVBAR ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center h-16">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#27500A" }}>
              <span className="text-lg">🌱</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">AgriHub</span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">{l}</a>
            ))}
            <Link to="/register">
              <button className="text-sm font-medium px-5 h-9 rounded-lg transition-all hover:opacity-90 active:scale-95" style={{ background: "#27500A", color: "#EAF3DE" }}>
                Get started
              </button>
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200" onClick={() => setMobileMenuOpen(v => !v)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? <path d="M18 6L6 18M6 6l12 12"/> : <path d="M3 12h18M3 6h18M3 18h18"/>}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
            {NAV_LINKS.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="block text-sm text-gray-600 py-2 border-b border-gray-50" onClick={() => setMobileMenuOpen(false)}>{l}</a>
            ))}
            <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
              <button className="w-full mt-2 text-sm font-medium px-5 h-10 rounded-lg" style={{ background: "#27500A", color: "#EAF3DE" }}>
                Get started
              </button>
            </Link>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #052e16 0%, #14532d 50%, #166534 100%)", minHeight: "100vh" }}>
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #4ade80, transparent)", transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #4ade80, transparent)", transform: "translate(-30%, 30%)" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left text */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ background: "rgba(74,222,128,0.15)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.3)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                India's #1 Agricultural Network
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ color: "#EAF3DE" }}>
                Empowering<br />
                <span style={{ color: "#4ade80" }}>farmers</span><br />
                together.
              </h1>
              <p className="text-base sm:text-lg leading-relaxed mb-8" style={{ color: "#9FE1CB", maxWidth: 480 }}>
                Connect with funding partners and sell directly to buyers. Eliminate middlemen, maximize profits, and build sustainable agricultural partnerships.
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                <Link to="/register">
                  <button className="h-11 px-7 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg" style={{ background: "#EAF3DE", color: "#27500A" }}>
                    🌾 Get funding
                  </button>
                </Link>
                <Link to="/register">
                  <button className="h-11 px-7 rounded-xl text-sm font-semibold border-2 transition-all hover:scale-105" style={{ borderColor: "#4ade80", color: "#4ade80", background: "transparent" }}>
                    Browse marketplace →
                  </button>
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-6">
                {[["🔒", "100% Secure"], ["✅", "Verified Partners"], ["⚡", "Instant Disbursal"]].map(([icon, label]) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="text-base">{icon}</span>
                    <span className="text-sm font-medium" style={{ color: "#9FE1CB" }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right stats grid */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {STATS.map(({ value, label }) => (
                  <div key={label} className="rounded-2xl p-5 sm:p-6 hover:scale-105 transition-transform cursor-default" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}>
                    <p className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: "#EAF3DE" }}>{value}</p>
                    <p className="text-sm" style={{ color: "#9FE1CB" }}>{label}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl p-5 sm:p-6" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
                <p className="text-sm font-semibold mb-4" style={{ color: "#EAF3DE" }}>Why choose AgriHub?</p>
                <div className="space-y-4">
                  {WHY.map(({ icon, title, desc }) => (
                    <div key={title} className="flex gap-3 items-start">
                      <span className="text-xl flex-shrink-0">{icon}</span>
                      <div>
                        <p className="text-sm font-medium" style={{ color: "#EAF3DE" }}>{title}</p>
                        <p className="text-xs mt-0.5" style={{ color: "#9FE1CB" }}>{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60 L0 30 Q360 0 720 30 Q1080 60 1440 30 L1440 60 Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* ── TWO SOLUTIONS ── */}
      <section id="marketplace" className="py-16 sm:py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4" style={{ background: "#EAF3DE", color: "#27500A" }}>Our Solutions</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Two powerful solutions</h2>
            <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto">AgriHub offers integrated solutions for sustainable farming and direct market access</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                emoji: "📋", title: "Contract cultivation", bg: "#14532d",
                desc: "Companies fund farmers before planting. Digital agreements guarantee purchase at fair market prices post-harvest.",
                note: "Contracted crops are exclusively for the funding company and cannot be sold in the open marketplace.",
                noteLabel: "⚠ Important note",
                features: ["Secured supply for companies", "Guaranteed fair income for farmers", "Zero middlemen involvement"],
              },
              {
                emoji: "🏪", title: "Direct sales portal", bg: "#d97706",
                desc: "List your harvest directly on our marketplace. Connect with buyers, shops, and factories without intermediaries.",
                note: "Access farm-fresh produce directly from farmers. Quality guaranteed, fair prices, support local agriculture.",
                noteLabel: "👥 For buyers",
                features: ["Better prices, faster sales", "Direct buyer relationships", "Fresh produce at lower costs"],
              },
            ].map(card => (
              <div key={card.title} className="rounded-2xl p-7 sm:p-9 text-white relative overflow-hidden" style={{ background: card.bg }}>
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10" style={{ background: "radial-gradient(circle, white, transparent)", transform: "translate(30%, -30%)" }} />
                <div className="text-3xl mb-4">{card.emoji}</div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3" style={{ color: "#EAF3DE" }}>{card.title}</h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.75)" }}>{card.desc}</p>
                <ul className="space-y-2.5 mb-7">
                  {card.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: "rgba(255,255,255,0.9)" }}>
                      <div className="w-1.5 h-1.5 rounded-full bg-white opacity-70 flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <div className="pt-5 border-t" style={{ borderColor: "rgba(255,255,255,0.2)" }}>
                  <p className="text-xs font-semibold mb-1.5" style={{ color: "#fbbf24" }}>{card.noteLabel}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>{card.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="funding" className="py-16 sm:py-24 px-4 sm:px-6" style={{ background: "#f9fafb" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4" style={{ background: "#dcfce7", color: "#166534" }}>How it works</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Contract cultivation</h2>
            <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto">Partner with trusted companies who provide funding and buy your harvest at guaranteed market prices.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {HOW_IT_WORKS.map(({ step, emoji, title, desc }, i) => (
              <div key={step} className="text-center relative group">
                {/* connector line */}
                {i < 3 && <div className="hidden md:block absolute top-7 left-[calc(50%+36px)] right-[-50%] h-0.5" style={{ background: "linear-gradient(90deg, #bbf7d0, #dcfce7)" }} />}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl transition-transform group-hover:scale-110" style={{ background: "linear-gradient(135deg, #14532d, #16a34a)", boxShadow: "0 8px 24px rgba(22,163,74,0.3)" }}>
                  {emoji}
                </div>
                <div className="w-6 h-6 rounded-full flex items-center justify-center mx-auto mb-3 text-xs font-bold text-white" style={{ background: "#166534" }}>{step}</div>
                <p className="text-sm font-semibold text-gray-900 mb-1">{title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BUILT FOR EVERYONE ── */}
      <section id="about" className="py-16 sm:py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4" style={{ background: "#fef3c7", color: "#92400e" }}>For everyone</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Built for everyone</h2>
            <p className="text-base sm:text-lg text-gray-500">Whether you grow, buy, or process — AgriHub has a solution for you</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {ROLES.map(role => (
              <div key={role.title} className="bg-white rounded-2xl p-7 border border-gray-100 hover:border-opacity-50 hover:shadow-xl transition-all duration-300 group" style={{ "--accent": role.accent }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-2xl transition-transform group-hover:scale-110" style={{ background: `${role.color}15`, border: `2px solid ${role.color}25` }}>
                  {role.emoji}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{role.title}</h3>
                <ul className="space-y-2.5">
                  {role.items.map(item => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: role.accent }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6" style={{ background: "linear-gradient(135deg, #052e16, #14532d)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4" style={{ background: "rgba(74,222,128,0.15)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.3)" }}>Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: "#EAF3DE" }}>Trusted by thousands</h2>
            <p className="text-base" style={{ color: "#9FE1CB" }}>Real stories from farmers, companies, and buyers across India</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="rounded-2xl p-6 hover:-translate-y-1 transition-transform" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: "rgba(74,222,128,0.2)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.3)" }}>{t.avatar}</div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: "#EAF3DE" }}>{t.name}</div>
                    <div className="text-xs" style={{ color: "#9FE1CB" }}>{t.role}</div>
                  </div>
                </div>
                <div className="text-2xl mb-2" style={{ color: "#4ade80" }}>"</div>
                <p className="text-sm leading-relaxed" style={{ color: "#9FE1CB" }}>{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, #14532d, #166534)" }}>
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10" style={{ background: "radial-gradient(circle, white, transparent)", transform: "translate(30%,-30%)" }} />
            <div className="text-4xl mb-4">🚀</div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ color: "#EAF3DE" }}>Ready to transform your agricultural business?</h2>
            <p className="text-sm sm:text-base leading-relaxed mb-8" style={{ color: "#9FE1CB" }}>
              Join thousands of farmers, companies, and buyers who are already benefiting from direct connections.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/register">
                <button className="h-11 px-8 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95 w-full sm:w-auto" style={{ background: "#EAF3DE", color: "#27500A" }}>
                  Create free account →
                </button>
              </Link>
              <Link to="/login">
                <button className="h-11 px-8 rounded-xl text-sm font-semibold border-2 transition-all hover:scale-105 w-full sm:w-auto" style={{ borderColor: "rgba(255,255,255,0.3)", color: "#EAF3DE", background: "rgba(255,255,255,0.1)" }}>
                  Sign in
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer id="contact" className="py-12 sm:py-16 px-4 sm:px-6" style={{ background: "#052e16" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-10">
            <div className="sm:col-span-2 md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#27500A" }}>🌱</div>
                <span className="text-lg font-semibold" style={{ color: "#EAF3DE" }}>AgriHub</span>
              </div>
              <p className="text-sm leading-relaxed mb-5 max-w-xs" style={{ color: "#9FE1CB" }}>
                Empowering farmers across India by connecting them with funding partners and direct buyers. Building a sustainable agricultural ecosystem.
              </p>
              <div className="flex gap-3">
                {["F", "T", "I", "L"].map((s, i) => (
                  <a key={i} href="#" className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors" style={{ background: "rgba(255,255,255,0.08)", color: "#9FE1CB" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#27500A"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                  >{s}</a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold mb-4" style={{ color: "#EAF3DE" }}>Quick links</p>
              <ul className="space-y-2.5">
                {["Get funding", "Marketplace", "How it works", "Success stories", "Support", "About us"].map(l => (
                  <li key={l}><a href="#" className="text-sm transition-colors" style={{ color: "#9FE1CB" }}
                    onMouseEnter={e => e.target.style.color = "#EAF3DE"}
                    onMouseLeave={e => e.target.style.color = "#9FE1CB"}
                  >{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold mb-4" style={{ color: "#EAF3DE" }}>Contact us</p>
              <div className="space-y-3 text-sm" style={{ color: "#9FE1CB" }}>
                <p>📍 123 AgriHub, Coimbatore, India — 642002</p>
                <p>📞 +91 93601 81060</p>
                <p>✉️ info@agrihub.com</p>
                <div className="rounded-xl px-4 py-3 mt-3" style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)" }}>
                  <p className="text-xs font-semibold" style={{ color: "#4ade80" }}>🌿 24/7 farmer helpline</p>
                  <p className="text-xs mt-1">1800-AGRI-HUB (toll free)</p>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-xs" style={{ borderColor: "rgba(255,255,255,0.1)", color: "#9FE1CB" }}>
            <p>© 2025 AgriHub. All rights reserved.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              {["Privacy policy", "Terms of service", "Cookie policy"].map(l => (
                <a key={l} href="#" style={{ color: "#9FE1CB" }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};