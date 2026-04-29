import React from "react";
import { Link } from "react-router-dom";
const NAV_LINKS = ["Funding", "Marketplace", "About", "Contact"];

const STATS = [
  { value: "15+", label: "Active farmers" },
  { value: "₹40k+", label: "Funding provided" },
  { value: "50+", label: "Partner companies" },
  { value: "92%", label: "Success rate" },
];

const WHY = [
  { title: "Zero interest funding", desc: "Get capital without any interest charges" },
  { title: "Direct market access", desc: "Sell directly to buyers, no middlemen" },
  { title: "Guaranteed purchase", desc: "Your harvest is guaranteed to be bought" },
];

const HOW_IT_WORKS = [
  { step: 1, title: "Apply for funding", desc: "Submit your farming plan and required documents" },
  { step: 2, title: "Get approved", desc: "Our partners review and approve your application" },
  { step: 3, title: "Receive funds", desc: "Get funding directly in your bank account" },
  { step: 4, title: "Grow & sell", desc: "Cultivate crops and sell back at market rates" },
];

const ROLES = [
  {
    title: "For farmers", color: "#1a4d2e", items: ["Get pre-harvest funding", "Guaranteed buyers", "Fair market prices", "Direct market access"],
    icon: <svg viewBox="0 0 24 24" width={28} height={28} fill="none" stroke="white" strokeWidth={2}><path d="M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3"/><path d="M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4"/><path d="M5 21h14"/></svg>,
  },
  {
    title: "For companies", color: "#e07a5f", items: ["Reliable raw materials", "Consistent quality control", "Reduced procurement costs", "Direct farmer partnerships"],
    icon: <svg viewBox="0 0 24 24" width={28} height={28} fill="none" stroke="white" strokeWidth={2}><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/></svg>,
  },
  {
    title: "For buyers", color: "#f2cc8f", textColor: "#1a4d2e", items: ["Farm-fresh produce", "Lower prices, no markup", "Quality transparency", "Support local farmers"],
    icon: <svg viewBox="0 0 24 24" width={28} height={28} fill="none" stroke="#1a4d2e" strokeWidth={2}><path d="M16 10a4 4 0 0 1-8 0"/><path d="M3.103 6.034h17.794"/><path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z"/></svg>,
  },
];

export const Home = () => {
  return (
    <div>
      {/* Navbar */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "#27500A" }}>
              <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="#C0DD97" strokeWidth={2}>
                <path d="M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3"/>
                <path d="M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4"/>
                <path d="M5 21h14"/>
              </svg>
            </div>
            <span className="text-lg font-medium text-gray-900">AgriHub</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="text-sm text-gray-500 hover:text-gray-900 transition">{l}</a>
            ))}
            <Link to="/register">
          
              <button className="text-sm font-medium px-4 h-9 rounded-lg transition" style={{ background: "#27500A", color: "#EAF3DE" }}
                onMouseEnter={(e) => (e.target.style.background = "#1a3d06")}
                onMouseLeave={(e) => (e.target.style.background = "#27500A")}>
                Sign in
              </button>
           
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="min-h-screen flex items-center" style={{ background: "#1a3d1f" }}>
        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest mb-6" style={{ color: "#5DCAA5" }}>
              India's agricultural network
            </p>
            <h1 className="text-5xl md:text-6xl font-medium leading-tight mb-6" style={{ color: "#EAF3DE" }}>
              Empowering<br />
              <span style={{ color: "#9FE1CB" }}>farmers</span><br />
              together.
            </h1>
            <p className="text-lg leading-relaxed mb-10" style={{ color: "#9FE1CB", maxWidth: 480 }}>
              Connect with funding partners and sell directly to buyers. Eliminate middlemen, maximize profits, and build sustainable agricultural partnerships.
            </p>
            <div className="flex flex-wrap gap-3 mb-12">
              <a href="register">
                <button className="h-11 px-7 rounded-lg text-sm font-medium transition-all"
                  style={{ background: "#EAF3DE", color: "#27500A" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#C0DD97")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#EAF3DE")}>
                  Get funding
                </button>
              </a>
              <a href="register">
                <button className="h-11 px-7 rounded-lg text-sm font-medium border transition-all"
                  style={{ borderColor: "#5DCAA5", color: "#9FE1CB" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(93,202,165,0.1)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                  Sell direct
                </button>
              </a>
            </div>
            <div className="flex gap-6">
              {[["100% Secure", "shield"], ["Verified Partners", "check"]].map(([label]) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#5DCAA5" }} />
                  <span className="text-sm" style={{ color: "#9FE1CB" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {STATS.map(({ value, label }) => (
                <div key={label} className="rounded-xl p-6" style={{ background: "rgba(255,255,255,0.07)", border: "0.5px solid rgba(255,255,255,0.12)" }}>
                  <p className="text-3xl font-medium mb-1" style={{ color: "#EAF3DE" }}>{value}</p>
                  <p className="text-sm" style={{ color: "#9FE1CB" }}>{label}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl p-7" style={{ background: "rgba(255,255,255,0.07)", border: "0.5px solid rgba(255,255,255,0.12)" }}>
              <p className="text-base font-medium mb-5" style={{ color: "#EAF3DE" }}>Why choose AgriHub?</p>
              <div className="space-y-4">
                {WHY.map(({ title, desc }) => (
                  <div key={title} className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: "#5DCAA5" }} />
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
      </section>

      {/* Two Solutions */}
      <section id="marketplace" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-medium text-gray-900 mb-3">Two powerful solutions</h2>
            <p className="text-lg text-gray-500">AgriHub offers integrated solutions for sustainable farming and direct market access</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Contract cultivation", bg: "#1a4d2e", desc: "Companies fund farmers before planting. Digital agreements guarantee purchase at fair market prices post-harvest.", note: "Contracted crops are exclusively for the funding company and cannot be sold in the open marketplace.", noteLabel: "Important note", features: ["Secured supply for companies", "Guaranteed fair income for farmers", "Zero middlemen involvement"] },
              { title: "Direct sales portal", bg: "#D85A30", desc: "List your harvest directly on our marketplace. Connect with buyers, shops, and factories without intermediaries.", note: "Access farm-fresh produce directly from farmers. Quality guaranteed, fair prices, and support local agriculture.", noteLabel: "For buyers", features: ["Better prices, faster sales", "Direct buyer relationships", "Fresh produce at lower costs"] },
            ].map((card) => (
              <div key={card.title} className="rounded-2xl p-9 text-white" style={{ background: card.bg }}>
                <h3 className="text-2xl font-medium mb-3" style={{ color: "#EAF3DE" }}>{card.title}</h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.7)" }}>{card.desc}</p>
                <ul className="space-y-2.5 mb-8">
                  {card.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>
                      <div className="w-1 h-1 rounded-full bg-white opacity-60 flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <div className="pt-5 border-t" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
                  <p className="text-xs font-medium uppercase tracking-wide mb-1.5" style={{ color: "#f2cc8f" }}>{card.noteLabel}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>{card.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="funding" className="py-24 px-6" style={{ background: "#F1EFE8" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-medium text-gray-900 mb-3">Contract cultivation</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Need capital for cultivation? Partner with trusted companies who provide funding and buy your harvest at guaranteed market prices.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map(({ step, title, desc }, i) => (
              <div key={step} className="text-center relative">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-medium" style={{ background: "#27500A", color: "#EAF3DE" }}>
                  {step}
                </div>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-7 left-[calc(50%+28px)] right-[-28px] h-px" style={{ background: "#C0DD97" }} />
                )}
                <p className="text-sm font-medium text-gray-900 mb-1">{title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built for everyone */}
      <section id="about" className="py-24 px-6 bg-amber-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-medium text-gray-900 mb-3">Built for everyone</h2>
            <p className="text-lg text-gray-500">Whether you grow, buy, or process — AgriHub has a solution for you</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {ROLES.map((role) => (
              <div key={role.title} className="bg-white rounded-2xl p-8 border-2 border-stone-100 hover:border-green-800 transition-all">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: role.color }}>
                  {role.icon}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">{role.title}</h3>
                <ul className="space-y-2.5">
                  {role.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: role.color }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-blue-50">
        <div className="max-w-2xl mx-auto text-center rounded-2xl p-14" style={{ background: "#27500A" }}>
          <h2 className="text-3xl font-medium mb-4" style={{ color: "#EAF3DE" }}>Ready to transform your agricultural business?</h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: "#9FE1CB" }}>
            Join thousands of farmers, companies, and buyers who are already benefiting from direct connections.
          </p>
          <a href="/auth/register">
            <button className="h-11 px-8 rounded-lg text-sm font-medium transition-all"
              style={{ background: "#EAF3DE", color: "#27500A" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#C0DD97")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#EAF3DE")}>
              Create your free account
            </button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-16 px-6" style={{ background: "#1a3d1f" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "#3B6D11" }}>
                <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="#C0DD97" strokeWidth={2}>
                  <path d="M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3"/>
                  <path d="M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4"/>
                  <path d="M5 21h14"/>
                </svg>
              </div>
              <span className="text-lg font-medium" style={{ color: "#EAF3DE" }}>AgriHub</span>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#9FE1CB" }}>
              Empowering farmers across India by connecting them with funding partners and direct buyers. Together, we're building a sustainable agricultural ecosystem.
            </p>
            <div className="flex gap-3">
              {["facebook", "twitter", "instagram", "linkedin"].map((s) => (
                <a key={s} href="#" className="w-9 h-9 rounded-full flex items-center justify-center text-xs transition"
                  style={{ background: "rgba(255,255,255,0.08)", color: "#9FE1CB" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#3B6D11")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}>
                  {s[0].toUpperCase()}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-5" style={{ color: "#EAF3DE" }}>Quick links</p>
            <ul className="space-y-3">
              {["Get funding", "Marketplace", "How it works", "Success stories", "Support", "About us"].map((l) => (
                <li key={l}><a href="#" className="text-sm transition" style={{ color: "#9FE1CB" }}
                  onMouseEnter={(e) => (e.target.style.color = "#EAF3DE")}
                  onMouseLeave={(e) => (e.target.style.color = "#9FE1CB")}>{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium mb-5" style={{ color: "#EAF3DE" }}>Contact us</p>
            <div className="space-y-4 text-sm" style={{ color: "#9FE1CB" }}>
              <p>123 AgriHub, Coimbatore, India — 642002</p>
              <p>+91 93601 81060<br />+91 87654 32109</p>
              <p>info@agrihub.com<br />support@agrihub.com</p>
              <div className="rounded-lg px-4 py-3 mt-4" style={{ background: "rgba(255,255,255,0.07)" }}>
                <p className="text-xs font-medium" style={{ color: "#EAF3DE" }}>24/7 farmer helpline</p>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs" style={{ borderColor: "rgba(255,255,255,0.1)", color: "#9FE1CB" }}>
          <p>© 2025 AgriHub. All rights reserved.</p>
          <div className="flex gap-6">
            {["Privacy policy", "Terms of service", "Cookie policy"].map((l) => (
              <a key={l} href="#" style={{ color: "#9FE1CB" }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};