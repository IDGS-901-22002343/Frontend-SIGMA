// src/layouts/AdminLayout.jsx
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SIGMA_GREEN = "#1a3a2a";

const NAV_ITEMS = [
  { label: "Dashboard",      to: "/dashboard" },
  { label: "Vehículos",      to: "/vehiculos" },
  { label: "Mantenimientos", to: "/mantenimientos" },
  { label: "Proveedores",    to: "/proveedores" },
  { label: "Siniestros",     to: "/siniestros" },
  { label: "Reportes",       to: "/reportes" },
  { label: "Configuración",  to: "/configuracion" },
];

const SIDEBAR_ITEMS = [
  { label: "Dashboard",      to: "/dashboard",     icon: <DashIcon /> },
  { label: "Flotilla",       to: "/vehiculos",     icon: <TruckIcon /> },
  { label: "Mantenimientos", to: "/mantenimientos", icon: <WrenchIcon /> },
  { label: "Proveedores",    to: "/proveedores",   icon: <ProviderIcon /> },
  { label: "Siniestros",     to: "/siniestros",    icon: <AlertIcon /> },
  { label: "Usuarios",       to: "/usuarios",      icon: <UserIcon /> },
  { label: "Reportes",       to: "/reportes",      icon: <ChartIcon /> },
  { label: "Configuración",  to: "/configuracion", icon: <GearIcon /> },
];

export default function AdminLayout() {
  const { user, logout: authLogout } = useAuth();
  const navigate = useNavigate();

  const logout = () => {
    authLogout();
    navigate("/login", { replace: true });
  };

  const initials = user
    ? `${user.nombre?.[0] || ""}${user.apellidoP?.[0] || ""}`.toUpperCase() || "AS"
    : "AS";
  const fullName = user?.nombre
    ? `${user.nombre}${user.apellidoP ? " " + user.apellidoP : ""}`
    : "Admin SIGMA";
  const role = user?.tipoUsuario || "Administrador";

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: "100vh", overflow: "hidden",
      fontFamily: "'Barlow', sans-serif", background: "#f8f9fa",
    }}>

      {/* TOP NAVBAR */}
      <header style={{
        flexShrink: 0,
        position: "sticky", top: 0, zIndex: 100,
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        display: "flex", alignItems: "center",
        padding: "0 24px", height: 56,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 32 }}>
          <div style={{
            width: 28, height: 28, background: SIGMA_GREEN, borderRadius: 6,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <rect x="3" y="3" width="8" height="5" rx="1.5"/>
              <rect x="13" y="3" width="8" height="5" rx="1.5"/>
              <rect x="3" y="11" width="8" height="10" rx="1.5"/>
              <rect x="13" y="11" width="8" height="10" rx="1.5"/>
            </svg>
          </div>
          <span style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 20, fontWeight: 800, letterSpacing: 3, color: SIGMA_GREEN,
          }}>SIGMA</span>
        </div>

        {/* Nav links */}
        <nav style={{ display: "flex", alignItems: "center", gap: 2, flex: 1, flexWrap: "wrap" }}>
          {NAV_ITEMS.map(({ label, to }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({
              padding: "6px 12px",
              fontSize: 13, fontWeight: isActive ? 600 : 400,
              color: isActive ? SIGMA_GREEN : "#6b7280",
              textDecoration: "none",
              borderRadius: 6,
              borderBottom: isActive ? `2px solid ${SIGMA_GREEN}` : "2px solid transparent",
              transition: "color 0.15s",
              whiteSpace: "nowrap",
            })}>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User pill */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>{fullName}</div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>{role}</div>
          </div>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: SIGMA_GREEN, color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, flexShrink: 0,
          }}>
            {initials}
          </div>
        </div>
      </header>

      {/* BODY: sidebar + content */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* SIDEBAR */}
        <aside style={{
          width: 175, minWidth: 175, flexShrink: 0,
          background: SIGMA_GREEN,
          display: "flex", flexDirection: "column",
          height: "100%",
          overflowY: "auto",
          paddingTop: 16,
        }}>
          {SIDEBAR_ITEMS.map(({ label, to, icon }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 18px",
              fontSize: 13, fontWeight: isActive ? 600 : 400,
              color: isActive ? "#fff" : "rgba(255,255,255,0.65)",
              textDecoration: "none",
              background: isActive ? "rgba(255,255,255,0.12)" : "transparent",
              borderLeft: isActive ? "3px solid #fff" : "3px solid transparent",
              transition: "all 0.15s",
              boxSizing: "border-box",
            })}
              onMouseEnter={e => { if (!e.currentTarget.getAttribute("aria-current")) e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
              onMouseLeave={e => { if (!e.currentTarget.getAttribute("aria-current")) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ opacity: 0.85, flexShrink: 0 }}>{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}

          {/* Logout */}
          <div style={{ marginTop: "auto", padding: "16px 18px 20px" }}>
            <button onClick={logout} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "9px 10px", background: "rgba(239,68,68,0.15)",
              border: "1px solid rgba(239,68,68,0.25)", borderRadius: 8,
              color: "#fca5a5", fontSize: 13, fontWeight: 500,
              cursor: "pointer", fontFamily: "'Barlow', sans-serif",
            }}>
              <PowerIcon />
              Cerrar sesión
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main style={{
          flex: 1,
          overflowY: "auto",
          background: "#f8f9fa",
          height: "100%",
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/* ── Icons ── */
function DashIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
}
function TruckIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
}
function WrenchIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
}
function ProviderIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M5 20v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2"/><path d="M3 20h18"/></svg>;
}
function AlertIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
}
function UserIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}
function ChartIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
}
function GearIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
}
function PowerIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>;
}