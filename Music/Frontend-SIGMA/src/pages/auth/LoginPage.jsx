// src/pages/auth/LoginPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const GRID_BG = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
  backgroundSize: "40px 40px",
};

export default function LoginPage() {
  const { login, loading, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [form, setForm] = useState({ correo: "", password: "" });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.correo || !form.password) { setError("Completa todos los campos"); return; }
    const result = await login(form.correo, form.password);
    if (!result.success) setError(result.error);
  };

  const onFocus = (e) => {
    e.target.style.borderColor = "#1e4d33";
    e.target.style.background = "#fff";
    e.target.style.boxShadow = "0 0 0 3px rgba(30,77,51,0.1)";
  };
  const onBlur = (e) => {
    e.target.style.borderColor = "#e5e7eb";
    e.target.style.background = "#f4f6f5";
    e.target.style.boxShadow = "none";
  };

  const inputStyle = {
    width: "100%", padding: "14px 16px",
    border: "1.5px solid #e5e7eb", borderRadius: 12,
    fontSize: 15, fontFamily: "'Barlow', sans-serif",
    color: "#111827", background: "#f4f6f5",
    outline: "none", display: "block", boxSizing: "border-box",
  };

  /* ─────────────── MOBILE ─────────────── */
  if (isMobile) {
    return (
      <>
        <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700&family=Barlow+Condensed:wght@800&display=swap" rel="stylesheet"/>
        <div style={{ position: "fixed", inset: 0, background: "#fff", fontFamily: "'Barlow', sans-serif", overflowY: "auto" }}>
          <div style={{
            background: "#1a3a2a", ...GRID_BG,
            borderRadius: "0 0 32px 32px",
            padding: "56px 24px 48px",
            textAlign: "center",
          }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 50, fontWeight: 800, letterSpacing: 6, color: "white", lineHeight: 1 }}>SIGMA</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", letterSpacing: "3px", textTransform: "uppercase", fontWeight: 600, marginTop: 7 }}>Gestión de Flotilla</div>
          </div>
          <div style={{ padding: "44px 28px 40px" }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Bienvenido</div>
            <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 28 }}>Ingresa tus credenciales</div>
            {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 16 }}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 12 }}>
                <input type="email" placeholder="Usuario o correo electrónico" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} onFocus={onFocus} onBlur={onBlur} required style={inputStyle}/>
              </div>
              <div style={{ marginBottom: 20 }}>
                <input type="password" placeholder="Contraseña" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} onFocus={onFocus} onBlur={onBlur} required style={inputStyle}/>
              </div>
              <button type="submit" disabled={loading} style={{ width: "100%", padding: "15px", background: "#1e4d33", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, fontFamily: "'Barlow', sans-serif", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}>
                {loading ? "Cargando..." : "Iniciar Sesión"}
              </button>
            </form>
            <a href="#" style={{ display: "block", textAlign: "center", marginTop: 20, fontSize: 14, fontWeight: 600, color: "#1e4d33", textDecoration: "none" }}>¿Olvidaste tu contraseña?</a>
          </div>
        </div>
      </>
    );
  }

  /* ─────────────── DESKTOP ─────────────── */
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700&family=Barlow+Condensed:wght@800&display=swap" rel="stylesheet"/>
      <div style={{ position: "fixed", inset: 0, display: "flex", fontFamily: "'Barlow', sans-serif" }}>

        {/* ── LEFT: 50% green panel ── */}
        <div style={{
          width: "50%", background: "#1a3a2a", ...GRID_BG,
          position: "relative", overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {/* big decorative circle */}
          <div style={{
            position: "absolute", width: 500, height: 500, borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.07)",
            bottom: -180, right: -160, pointerEvents: "none",
          }}/>
          <div style={{
            position: "absolute", width: 300, height: 300, borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.07)",
            top: -80, left: -80, pointerEvents: "none",
          }}/>

          {/* center content */}
          <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 48px" }}>
            {/* icon */}
            <div style={{
              width: 72, height: 72,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 20,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 32px",
            }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                <rect x="3" y="3" width="8" height="5" rx="1.5"/>
                <rect x="13" y="3" width="8" height="5" rx="1.5"/>
                <rect x="3" y="11" width="8" height="10" rx="1.5"/>
                <rect x="13" y="11" width="8" height="10" rx="1.5"/>
              </svg>
            </div>

            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 72, fontWeight: 800, letterSpacing: 8,
              color: "white", lineHeight: 1, marginBottom: 12,
            }}>SIGMA</div>

            <div style={{
              fontSize: 11, color: "rgba(255,255,255,0.5)",
              letterSpacing: "4px", textTransform: "uppercase", fontWeight: 600,
              marginBottom: 48,
            }}>Gestión de Flotillas | GRUPO SOLDER</div>

            {/* divider */}
            <div style={{ width: 40, height: 1, background: "rgba(255,255,255,0.2)", margin: "0 auto 40px" }}/>

            {/* stats row */}
            <div style={{ display: "flex", gap: 40, justifyContent: "center" }}>
            </div>
          </div>
        </div>

        {/* ── RIGHT: 50% white, form centered ── */}
        <div style={{ width: "50%", background: "#fff", position: "relative" }}>
          <div style={{
            position: "absolute",
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%", maxWidth: 400,
            padding: "0 48px", boxSizing: "border-box",
          }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#111827", marginBottom: 6, fontFamily: "'Barlow', sans-serif" }}>Bienvenido</div>
            <div style={{ fontSize: 15, color: "#6b7280", marginBottom: 36 }}>Ingresa tus credenciales</div>

            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 16 }}>{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 14 }}>
                <input type="email" placeholder="Correo electrónico" value={form.correo}
                  onChange={(e) => setForm({ ...form, correo: e.target.value })}
                  onFocus={onFocus} onBlur={onBlur} required style={inputStyle}/>
              </div>
              <div style={{ marginBottom: 24 }}>
                <input type="password" placeholder="Contraseña" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  onFocus={onFocus} onBlur={onBlur} required style={inputStyle}/>
              </div>
              <button type="submit" disabled={loading}
                style={{ width: "100%", padding: "15px", background: "#1e4d33", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, fontFamily: "'Barlow', sans-serif", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1, letterSpacing: "0.3px" }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#163d28"; }}
                onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "#1e4d33"; }}
              >
                {loading ? "Cargando..." : "Iniciar Sesión"}
              </button>
            </form>

            <a href="#" style={{ display: "block", textAlign: "center", marginTop: 22, fontSize: 14, fontWeight: 600, color: "#1e4d33", textDecoration: "none" }}>
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </div>

      </div>
    </>
  );
}