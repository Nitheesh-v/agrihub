import { useState } from "react";
import API from "@/services/api";
import { useSelector } from "react-redux";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600&display=swap');

  .verify-page {
    font-family: 'DM Sans', sans-serif;
    max-width: 560px;
    animation: fadeUp 0.5s ease both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .verify-header { margin-bottom: 2rem; }

  .verify-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.7rem;
    font-weight: 600;
    color: #16a34a;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 0.5rem;
  }

  .verify-eyebrow::before {
    content: '';
    width: 16px;
    height: 1.5px;
    background: #16a34a;
    border-radius: 2px;
  }

  .verify-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.75rem;
    font-weight: 600;
    color: #1c1917;
    margin: 0 0 6px;
    line-height: 1.2;
  }

  .verify-desc {
    font-size: 0.875rem;
    color: #78716c;
    line-height: 1.6;
    margin: 0;
  }

  .verify-card {
    background: #fff;
    border: 1px solid #e7e5e4;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 24px rgba(0,0,0,0.05);
  }

  .verify-card-header {
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #f5f5f4;
    background: #fafaf9;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .verify-card-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, #16a34a, #15803d);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(22,163,74,0.2);
  }

  .verify-card-title {
    font-size: 0.9rem;
    font-weight: 500;
    color: #1c1917;
    margin: 0 0 2px;
  }

  .verify-card-subtitle {
    font-size: 0.75rem;
    color: #a8a29e;
    margin: 0;
  }

  .verify-card-body { padding: 1.5rem; }

  .verify-field { margin-bottom: 1.25rem; }

  .verify-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.375rem;
  }

  .verify-label-text {
    font-size: 0.75rem;
    font-weight: 500;
    color: #57534e;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .verify-label-hint {
    font-size: 0.7rem;
    color: #a8a29e;
  }

  .verify-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .verify-input-icon {
    position: absolute;
    left: 12px;
    color: #a8a29e;
    pointer-events: none;
  }

  .verify-input {
    width: 100%;
    height: 42px;
    border: 1.5px solid #e7e5e4;
    border-radius: 10px;
    padding: 0 1rem 0 2.5rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem;
    color: #1c1917;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    background: #fff;
    box-sizing: border-box;
  }

  .verify-input::placeholder { color: #d4d0cb; }

  .verify-input:focus {
    border-color: #16a34a;
    box-shadow: 0 0 0 3px rgba(22,163,74,0.1);
  }

  .verify-input.has-value { border-color: #bbf7d0; background: #f0fdf4; }

  .verify-divider {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 1.25rem 0;
  }

  .verify-divider-line { flex: 1; height: 1px; background: #f5f5f4; }
  .verify-divider-text { font-size: 0.72rem; color: #c4c0bb; }

  .verify-drop-zone {
    border: 2px dashed #e7e5e4;
    border-radius: 12px;
    padding: 1.75rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    background: #fafaf9;
  }

  .verify-drop-zone:hover {
    border-color: #16a34a;
    background: #f0fdf4;
  }

  .verify-drop-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #dcfce7;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 0.75rem;
    color: #16a34a;
    transition: transform 0.2s;
  }

  .verify-drop-zone:hover .verify-drop-icon { transform: scale(1.1); }

  .verify-drop-title {
    font-size: 0.875rem;
    font-weight: 500;
    color: #44403c;
    margin-bottom: 3px;
  }

  .verify-drop-desc { font-size: 0.75rem; color: #a8a29e; }

  .verify-doc-types {
    display: flex;
    gap: 0.5rem;
    margin-top: 1.25rem;
  }

  .verify-doc-type {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0.4rem 0.75rem;
    background: #fff;
    border: 1px solid #e7e5e4;
    border-radius: 8px;
    font-size: 0.75rem;
    color: #78716c;
    transition: all 0.2s;
    cursor: pointer;
  }

  .verify-doc-type:hover {
    border-color: #16a34a;
    color: #15803d;
    background: #f0fdf4;
  }

  .verify-doc-type.selected {
    border-color: #16a34a;
    color: #15803d;
    background: #dcfce7;
    font-weight: 500;
  }

  .verify-info-box {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 10px;
    padding: 0.875rem 1rem;
    display: flex;
    gap: 10px;
    align-items: flex-start;
    margin-top: 1.25rem;
  }

  .verify-info-icon { color: #16a34a; flex-shrink: 0; margin-top: 1px; }

  .verify-info-text {
    font-size: 0.8rem;
    color: #15803d;
    line-height: 1.6;
  }

  .verify-card-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid #f5f5f4;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .verify-cancel-btn {
    padding: 0 1rem;
    height: 40px;
    border: 1.5px solid #e7e5e4;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    color: #78716c;
    background: transparent;
    cursor: pointer;
    transition: all 0.2s;
  }

  .verify-cancel-btn:hover {
    background: #fafaf9;
    border-color: #d4d0cb;
    color: #1c1917;
  }

  .verify-submit-btn {
    flex: 1;
    height: 40px;
    border: none;
    border-radius: 10px;
    background: linear-gradient(135deg, #16a34a, #15803d);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    color: #fff;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    box-shadow: 0 4px 12px rgba(22,163,74,0.25);
  }

  .verify-submit-btn:hover {
    background: linear-gradient(135deg, #15803d, #166534);
    box-shadow: 0 6px 20px rgba(22,163,74,0.35);
    transform: translateY(-1px);
  }

  .verify-submit-btn:active { transform: scale(0.98) translateY(0); }

  .verify-submit-btn:disabled {
    background: #d4d0cb;
    box-shadow: none;
    cursor: not-allowed;
    transform: none;
  }

  .verify-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .verify-success-banner {
    background: linear-gradient(135deg, #dcfce7, #bbf7d0);
    border: 1px solid #86efac;
    border-radius: 12px;
    padding: 1.25rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 1rem;
    animation: fadeUp 0.4s ease both;
  }

  .verify-success-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #16a34a;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    flex-shrink: 0;
  }

  .verify-success-title { font-size: 0.875rem; font-weight: 600; color: #166534; }
  .verify-success-desc { font-size: 0.78rem; color: #15803d; }
`;

const DOC_TYPES = ["Aadhaar", "PAN Card", "License", "GST Cert"];

export default function VerifyUser() {
  const [documentUrl, setDocumentUrl] = useState("");
  const [selectedDoc, setSelectedDoc] = useState("Aadhaar");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { token } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!documentUrl.trim()) return;
    setSubmitting(true);
    try {
      await API.post(
        "/api/auth/verify",
        { documentUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubmitted(true);
      setDocumentUrl("");
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Error submitting ❌");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="verify-page">
      <style>{styles}</style>

      <div className="verify-header">
        <div className="verify-eyebrow">Identity Verification</div>
        <h1 className="verify-title">Verify Your Account</h1>
        <p className="verify-desc">
          Submit your official document to unlock full platform access. Verification is reviewed within 24 hours.
        </p>
      </div>

      <div className="verify-card">
        <div className="verify-card-header">
          <div className="verify-card-icon">🪪</div>
          <div>
            <p className="verify-card-title">Document Submission</p>
            <p className="verify-card-subtitle">Accepted: Aadhaar, PAN, Driving License, GST Certificate</p>
          </div>
        </div>

        <div className="verify-card-body">
          {submitted && (
            <div className="verify-success-banner" style={{ marginBottom: "1.25rem" }}>
              <div className="verify-success-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13.854 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L6.5 10.293l6.646-6.647a.5.5 0 01.708 0z"/>
                </svg>
              </div>
              <div>
                <div className="verify-success-title">Verification submitted!</div>
                <div className="verify-success-desc">Our team will review your documents shortly.</div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <div className="verify-label">
                <span className="verify-label-text">Document Type</span>
              </div>
              <div className="verify-doc-types">
                {DOC_TYPES.map(doc => (
                  <button
                    type="button"
                    key={doc}
                    className={`verify-doc-type ${selectedDoc === doc ? "selected" : ""}`}
                    onClick={() => setSelectedDoc(doc)}
                  >
                    {doc}
                  </button>
                ))}
              </div>
            </div>

            <div className="verify-field">
              <div className="verify-label">
                <span className="verify-label-text">Document URL / Link</span>
                <span className="verify-label-hint">Paste a secure link</span>
              </div>
              <div className="verify-input-wrapper">
                <svg className="verify-input-icon" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M4.715 6.542L3.343 7.914a3 3 0 104.243 4.243l1.828-1.829A3 3 0 008.586 5.5L8 6.086a1.001 1.001 0 00-.154.199 2 2 0 01.861 3.337L6.88 11.45a2 2 0 11-2.83-2.83l.793-.792a4.018 4.018 0 01-.128-1.287z"/>
                  <path d="M6.586 4.672A3 3 0 007.414 9.5l.775-.776a2 2 0 01-.896-3.346L9.12 3.55a2 2 0 112.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 10-4.243-4.243L6.586 4.672z"/>
                </svg>
                <input
                  type="url"
                  className={`verify-input ${documentUrl ? "has-value" : ""}`}
                  placeholder={`https://drive.google.com/your-${selectedDoc.toLowerCase().replace(" ", "-")}`}
                  value={documentUrl}
                  onChange={(e) => setDocumentUrl(e.target.value)}
                />
              </div>
            </div>

            <div className="verify-divider">
              <div className="verify-divider-line" />
              <span className="verify-divider-text">or</span>
              <div className="verify-divider-line" />
            </div>

            <div className="verify-drop-zone">
              <div className="verify-drop-icon">
                <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M.5 9.9a.5.5 0 01.5.5v2.5a1 1 0 001 1h12a1 1 0 001-1v-2.5a.5.5 0 011 0v2.5a2 2 0 01-2 2H2a2 2 0 01-2-2v-2.5a.5.5 0 01.5-.5z"/>
                  <path d="M7.646 1.146a.5.5 0 01.708 0l3 3a.5.5 0 01-.708.708L8.5 2.707V11.5a.5.5 0 01-1 0V2.707L5.354 4.854a.5.5 0 11-.708-.708l3-3z"/>
                </svg>
              </div>
              <div className="verify-drop-title">Drag & drop your document</div>
              <div className="verify-drop-desc">PDF, JPG or PNG up to 5MB</div>
            </div>

            <div className="verify-info-box">
              <svg className="verify-info-icon" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 15A7 7 0 118 1a7 7 0 010 14zm0 1A8 8 0 108 0a8 8 0 000 16z"/>
                <path d="M8.93 6.588l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 11-2 0 1 1 0 012 0z"/>
              </svg>
              <span className="verify-info-text">
                Your document is encrypted and stored securely. It is only used for identity verification and is never shared with third parties.
              </span>
            </div>

            <div className="verify-card-footer">
              <button type="button" className="verify-cancel-btn" onClick={() => setDocumentUrl("")}>
                Clear
              </button>
              <button type="submit" className="verify-submit-btn" disabled={!documentUrl.trim() || submitting}>
                {submitting ? (
                  <><div className="verify-spinner" /> Submitting...</>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M12.736 3.97a.733.733 0 011.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 01-1.065.02L3.217 8.384a.757.757 0 010-1.06.733.733 0 011.047 0l3.052 3.093 5.4-6.425a.247.247 0 01.02-.022z"/>
                    </svg>
                    Submit for Verification
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}