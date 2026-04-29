import { useState } from "react";
import { createCrop } from "@/services/cropService";
import { useSelector } from "react-redux";

const S = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600&display=swap');
.ac-page{font-family:'DM Sans',sans-serif;min-height:100vh;background:linear-gradient(145deg,#f0fdf4 0%,#fafff7 50%,#ecfdf5 100%);display:flex;align-items:flex-start;justify-content:center;padding:2rem 1rem;}
.ac-wrap{width:100%;max-width:520px;animation:acUp .5s cubic-bezier(.22,1,.36,1) both;}
@keyframes acUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.ac-brand{display:flex;align-items:center;gap:10px;margin-bottom:1.75rem;}
.ac-brand-icon{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#16a34a,#15803d);display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 4px 12px rgba(22,163,74,.25);}
.ac-brand-name{font-family:'Playfair Display',serif;font-size:1rem;color:#166534;}
.ac-header{margin-bottom:1.75rem;}
.ac-title{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:600;color:#14532d;margin:0 0 6px;line-height:1.2;}
.ac-desc{font-size:.875rem;color:#6b7280;margin:0;line-height:1.6;}
.ac-success{display:flex;align-items:center;gap:10px;background:#dcfce7;border:1px solid #86efac;border-radius:12px;padding:.875rem 1rem;margin-bottom:1.25rem;font-size:.875rem;color:#166534;animation:acUp .4s ease both;}
.ac-card{background:#fff;border:1px solid #e5e7eb;border-radius:20px;overflow:hidden;box-shadow:0 4px 32px rgba(22,163,74,.07);}
.ac-card-top{height:4px;background:linear-gradient(90deg,#14532d,#16a34a,#4ade80,#bbf7d0);}
.ac-card-inner{padding:1.75rem;}
.ac-preview-bar{display:flex;gap:.625rem;margin-bottom:1.5rem;padding:.75rem;background:#f0fdf4;border-radius:12px;border:1px solid #dcfce7;}
.ac-preview-item{flex:1;text-align:center;}
.ac-preview-label{font-size:.62rem;color:#86efac;text-transform:uppercase;letter-spacing:.1em;margin-bottom:3px;}
.ac-preview-val{font-size:.875rem;font-weight:600;color:#166534;min-height:1.2em;}
.ac-fields{display:flex;flex-direction:column;gap:1rem;}
.ac-field{}
.ac-label{display:flex;align-items:center;justify-content:space-between;margin-bottom:.375rem;}
.ac-label-text{font-size:.72rem;font-weight:500;color:#6b7280;text-transform:uppercase;letter-spacing:.08em;}
.ac-input-wrap{position:relative;display:flex;align-items:center;}
.ac-icon{position:absolute;left:12px;color:#9ca3af;pointer-events:none;width:16px;height:16px;flex-shrink:0;}
.ac-input{height:44px;width:100%;border:1.5px solid #e5e7eb;border-radius:12px;padding:0 1rem 0 2.75rem;font-family:'DM Sans',sans-serif;font-size:.875rem;color:#111827;outline:none;transition:border-color .2s,box-shadow .2s;background:#fff;box-sizing:border-box;}
.ac-input::placeholder{color:#d1d5db;}
.ac-input:focus{border-color:#16a34a;box-shadow:0 0 0 3px rgba(22,163,74,.12);}
.ac-input.filled{border-color:#bbf7d0;background:#f0fdf4;}
.ac-submit{width:100%;height:46px;border:none;border-radius:12px;background:linear-gradient(135deg,#14532d,#16a34a);color:#fff;font-family:'DM Sans',sans-serif;font-size:.9rem;font-weight:500;cursor:pointer;transition:all .2s cubic-bezier(.22,1,.36,1);display:flex;align-items:center;justify-content:center;gap:8px;margin-top:.25rem;box-shadow:0 4px 16px rgba(22,163,74,.3);}
.ac-submit:hover:not(:disabled){background:linear-gradient(135deg,#166534,#15803d);box-shadow:0 6px 24px rgba(22,163,74,.4);transform:translateY(-1px);}
.ac-submit:active{transform:scale(.98);}
.ac-submit:disabled{opacity:.6;cursor:not-allowed;transform:none;}
.ac-spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;}
@keyframes spin{to{transform:rotate(360deg)}}
.ac-tip{text-align:center;font-size:.75rem;color:#9ca3af;margin-top:1rem;line-height:1.6;}
.ac-tip strong{color:#16a34a;}
@media(max-width:480px){.ac-page{padding:1rem .75rem;align-items:flex-start;}.ac-preview-val{font-size:.78rem;}.ac-title{font-size:1.5rem;}}
`;

const FIELDS = [
  { key:"name", label:"Crop name", placeholder:"e.g. Tomatoes, Wheat, Rice", type:"text",
    icon:<svg viewBox="0 0 24 24" style={{width:16,height:16,stroke:"currentColor",fill:"none",strokeWidth:1.8}}><path d="M12 2C9 7 4 9 4 14a8 8 0 0016 0c0-5-5-7-8-12z"/></svg> },
  { key:"price", label:"Price per unit (₹)", placeholder:"e.g. 40", type:"number",
    icon:<svg viewBox="0 0 24 24" style={{width:16,height:16,stroke:"currentColor",fill:"none",strokeWidth:1.8}}><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg> },
  { key:"quantity", label:"Quantity available", placeholder:"e.g. 200 kg", type:"text",
    icon:<svg viewBox="0 0 24 24" style={{width:16,height:16,stroke:"currentColor",fill:"none",strokeWidth:1.8}}><path d="M21 16V8a2 2 0 00-1-1.73L13 2.27a2 2 0 00-2 0L4 6.27A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg> },
  { key:"location", label:"Location", placeholder:"e.g. Chennai, Tamil Nadu", type:"text",
    icon:<svg viewBox="0 0 24 24" style={{width:16,height:16,stroke:"currentColor",fill:"none",strokeWidth:1.8}}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg> },
];

export default function AddCrop() {
  const { token } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name:"", price:"", quantity:"", location:"" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createCrop(form, token);
      setForm({ name:"", price:"", quantity:"", location:"" });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
    } finally { setLoading(false); }
  };

  return (
    <div className="ac-page">
      <style>{S}</style>
      <div className="ac-wrap">
        <div className="ac-brand">
          <div className="ac-brand-icon">🌱</div>
          <span className="ac-brand-name">AgriHub</span>
        </div>

        <div className="ac-header">
          <h1 className="ac-title">List a new crop</h1>
          <p className="ac-desc">Add your produce to the marketplace and connect with buyers across the country.</p>
        </div>

        {success && (
          <div className="ac-success">
            <svg viewBox="0 0 24 24" style={{width:16,height:16,stroke:"#16a34a",fill:"none",strokeWidth:2.5,flexShrink:0}}><path d="M20 6L9 17l-5-5"/></svg>
            Crop listed successfully! Buyers can now discover your produce.
          </div>
        )}

        <div className="ac-card">
          <div className="ac-card-top" />
          <div className="ac-card-inner">
            {/* Live preview bar */}
            <div className="ac-preview-bar">
              {[["Crop", form.name||"—"],["Price", form.price?`₹${form.price}`:"—"],["Qty", form.quantity||"—"],["Location", form.location||"—"]].map(([l,v])=>(
                <div key={l} className="ac-preview-item">
                  <div className="ac-preview-label">{l}</div>
                  <div className="ac-preview-val">{v.length>10?v.slice(0,10)+"…":v}</div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="ac-fields">
                {FIELDS.map(({ key, label, placeholder, type, icon }) => (
                  <div key={key} className="ac-field">
                    <div className="ac-label">
                      <span className="ac-label-text">{label}</span>
                    </div>
                    <div className="ac-input-wrap">
                      <span className="ac-icon">{icon}</span>
                      <input
                        type={type}
                        placeholder={placeholder}
                        value={form[key]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        required
                        className={`ac-input ${form[key] ? "filled" : ""}`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button type="submit" disabled={loading} className="ac-submit" style={{ marginTop: "1.25rem" }}>
                {loading ? (
                  <><div className="ac-spinner"/> Listing your crop...</>
                ) : (
                  <><svg viewBox="0 0 24 24" style={{width:16,height:16,fill:"none",stroke:"#fff",strokeWidth:2}}><path d="M12 5v14M5 12l7 7 7-7"/></svg> Add to marketplace</>
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="ac-tip">
          🌾 Your crop will be <strong>instantly visible</strong> to all buyers on the marketplace after listing.
        </p>
      </div>
    </div>
  );
}