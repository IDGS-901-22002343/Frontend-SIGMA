import { useEffect, useMemo, useState } from "react";
import { useMantenimientos } from "../../context/Mantenimientos/MantenimientosContext";
import ProveedorForm from "./ProveedorForm";

const G = "#1e2b4f";

function Btn({ onClick, icon, label, style = {} }) {
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "5px 11px", background: "#fff",
      border: "1px solid #e5e7eb", borderRadius: 6,
      cursor: "pointer", fontSize: 12, color: "#374151",
      fontFamily: "inherit", ...style
    }}
      onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"}
      onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
    >{icon}{label}</button>
  );
}

export default function ProveedoresList() {
  const {
    proveedores,
    crearProveedor,
    actualizarProveedor,
    loading,
    error,
    cargarProveedores,
    eliminarProveedor,
    clearError
  } = useMantenimientos();

  const [busqueda, setBusqueda] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [localErr, setLocalErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        clearError();
        await cargarProveedores();
      } catch (e) {
        console.error(e);
      }
    })();
  }, [cargarProveedores, clearError]);

  const onNuevo = () => {
    setEditTarget(null);
    setOpenForm(true);
  };

  const onEditar = (p) => {
    setEditTarget(p);
    setOpenForm(true);
  };

  const onEliminar = async (id) => {
    if (!confirm("¿Eliminar este proveedor?")) return;
    try {
      setSaving(true);
      await eliminarProveedor(id);
    } catch (err) {
      setLocalErr(err.message);
    } finally {
      setSaving(false);
    }
  };

  const filtrados = useMemo(() => {
    const t = busqueda.trim().toLowerCase();
    if (!t) return proveedores || [];
    return (proveedores || []).filter(p =>
      p.nombre?.toLowerCase().includes(t) ||
      p.telefono?.toLowerCase().includes(t) ||
      p.correo?.toLowerCase().includes(t)
    );
  }, [busqueda, proveedores]);

  const errMsg = localErr || error;

  const TH = ({ children }) => (
    <th style={{
      padding: "10px 20px", textAlign: "left",
      fontSize: 11, fontWeight: 600, color: "#9ca3af",
      letterSpacing: "0.8px", textTransform: "uppercase",
      borderBottom: "1px solid #f0f0f0", whiteSpace: "nowrap",
    }}>{children}</th>
  );

  const TD = ({ children }) => (
    <td style={{
      padding: "15px 20px", fontSize: 13, color: "#374151",
      borderBottom: "1px solid #f7f7f7", verticalAlign: "middle",
    }}>{children}</td>
  );

  return (
    <div style={{ padding: "32px 36px", fontFamily: "'Barlow', sans-serif" }}>
      
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#111827" }}>
          Proveedores y Talleres
        </h1>
        <p style={{ margin: "5px 0 0", fontSize: 14, color: "#9ca3af" }}>
          Catálogo de talleres y proveedores de servicios
        </p>
      </div>

      <div style={{
        background: "#fff", borderRadius: 14,
        border: "1px solid #e9ecef", boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}>
        
        <div style={{
          padding: "18px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: "1px solid #f5f5f5", flexWrap: "wrap", gap: 14
        }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>Listado de Proveedores</span>

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ position: "relative" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#adb5bd" strokeWidth="2"
                style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Buscar proveedor..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                style={{
                  paddingLeft: 34, paddingRight: 14, paddingTop: 9, paddingBottom: 9,
                  border: "1.5px solid #e5e7eb", borderRadius: 8,
                  fontSize: 13, outline: "none", width: 250,
                  fontFamily: "inherit", color: "#374151", background: "#fafafa",
                }}
                onFocus={e => { e.target.style.borderColor = G; e.target.style.background = "#fff"; }}
                onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#fafafa"; }}
              />
            </div>

            <button
              onClick={onNuevo}
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "9px 18px", background: G, color: "#fff",
                border: "none", borderRadius: 8,
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#2a3a66"}
              onMouseLeave={e => e.currentTarget.style.background = G}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>Nuevo Proveedor
            </button>
          </div>
        </div>

        {errMsg && (
          <div style={{ margin: "12px 24px 0", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", borderRadius: 8, padding: "10px 14px", fontSize: 13 }}>
            {errMsg}
          </div>
        )}

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <TH>Nombre</TH>
                <TH>Teléfono</TH>
                <TH>Correo</TH>
                <TH>Mantenimientos</TH>
                <TH style={{ textAlign: "center" }}>Acciones</TH>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ padding: "52px 0", textAlign: "center", color: "#9ca3af" }}>Cargando proveedores...</td></tr>
              ) : filtrados.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: "52px 0", textAlign: "center", color: "#9ca3af" }}>No hay proveedores registrados</td></tr>
              ) : filtrados.map(p => (
                <tr key={p.idProveedor}
                  onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <TD><span style={{ fontWeight: 600, color: "#111827" }}>{p.nombre}</span></TD>
                  <TD>{p.telefono || "—"}</TD>
                  <TD>{p.correo || "—"}</TD>
                  <TD>{p.totalMantenimientos || 0}</TD>
                  <td style={{ padding: "15px 20px", textAlign: "center", borderBottom: "1px solid #f7f7f7" }}>
                    <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                      <Btn onClick={() => onEditar(p)} label="Editar"
                        icon={<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>}
                      />
                      <Btn onClick={() => onEliminar(p.idProveedor)} label="Eliminar"
                        icon={<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 4V2"/><path d="M16 4V2"/></svg>}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {openForm && (
        <ProveedorForm
          open={openForm}
          onClose={() => setOpenForm(false)}
          onSubmit={async (vals) => {
            try {
              setSaving(true);
              setLocalErr("");
              clearError();
              if (editTarget?.idProveedor) {
                await actualizarProveedor(editTarget.idProveedor, vals);
              } else {
                await crearProveedor(vals);
              }
              setOpenForm(false);
              setEditTarget(null);
            } catch (e) {
              setLocalErr(e.message || "Error al guardar");
            } finally {
              setSaving(false);
            }
          }}
          initial={editTarget}
          saving={saving}
        />
      )}
    </div>
  );
}