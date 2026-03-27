import { useEffect, useMemo, useState } from "react";
import { useSiniestros } from "../../context/Siniestros/SiniestrosContext";
import { useNavigate } from "react-router-dom";
import SiniestroForm from "./SiniestroForm";
import { exportarSiniestroPDF } from "../../services/utils/pdfExport";

const G = "#1e2b4f";

const statusColors = {
  "Reportado": { bg: "#fee2e2", color: "#b91c1c", label: "REPORTADO" },
  "En proceso": { bg: "#fef3c7", color: "#b45309", label: "EN PROCESO" },
  "Resuelto": { bg: "#d1fae5", color: "#065f46", label: "RESUELTO" },
  "Cerrado": { bg: "#e5e7eb", color: "#4b5563", label: "CERRADO" },
};

function StatusBadge({ estatus }) {
  const colors = statusColors[estatus] || { bg: "#e5e7eb", color: "#6b7280", label: estatus };
  return (
    <span style={{
      background: colors.bg,
      color: colors.color,
      padding: "4px 12px",
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 600,
    }}>
      {colors.label}
    </span>
  );
}

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

export default function SiniestrosList() {
  const navigate = useNavigate();
  const {
    siniestros,
    loading,
    error,
    cargarSiniestros,
    eliminarSiniestro,
    clearError,
    estatusSiniestros,
    cargarEstatus
  } = useSiniestros();

  const [busqueda, setBusqueda] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [localErr, setLocalErr] = useState("");
  const [filtroEstatus, setFiltroEstatus] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");

  useEffect(() => {
    (async () => {
      try {
        clearError();
        await Promise.all([cargarSiniestros(), cargarEstatus()]);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [cargarSiniestros, cargarEstatus, clearError]);

  const onNuevo = () => {
    setEditTarget(null);
    setOpenForm(true);
  };

  const onEditar = (s) => {
    setEditTarget(s);
    setOpenForm(true);
  };

  const onCerrar = () => {
    setOpenForm(false);
    setEditTarget(null);
  };

  const onEliminar = async (id) => {
    if (!confirm("¿Eliminar este siniestro?")) return;
    try {
      setSaving(true);
      await eliminarSiniestro(id);
    } catch (err) {
      setLocalErr(err.message);
    } finally {
      setSaving(false);
    }
  };

  const onExportarPDF = async (siniestro) => {
    try {
      await exportarSiniestroPDF(siniestro);
    } catch (err) {
      setLocalErr("Error al exportar PDF");
    }
  };

  const filtrados = useMemo(() => {
    const t = busqueda.trim().toLowerCase();
    return (siniestros || []).filter(s => {
      const matchBusqueda = !t ||
        s.vehiculoInfo?.toLowerCase().includes(t) ||
        s.numeroEconomico?.toLowerCase().includes(t) ||
        s.conductorNombre?.toLowerCase().includes(t) ||
        s.descripcion?.toLowerCase().includes(t) ||
        `sin-${s.idSiniestro}`.includes(t);
      
      const matchEstatus = !filtroEstatus || s.estatusNombre === filtroEstatus;
      
      return matchBusqueda && matchEstatus;
    });
  }, [busqueda, filtroEstatus, siniestros]);

  const errMsg = localErr || error;

  const TH = ({ children, center }) => (
    <th style={{
      padding: "10px 20px", textAlign: center ? "center" : "left",
      fontSize: 11, fontWeight: 600, color: "#9ca3af",
      letterSpacing: "0.8px", textTransform: "uppercase",
      borderBottom: "1px solid #f0f0f0", whiteSpace: "nowrap",
    }}>{children}</th>
  );

  const TD = ({ children, center }) => (
    <td style={{
      padding: "15px 20px", textAlign: center ? "center" : "left",
      fontSize: 13, color: "#374151",
      borderBottom: "1px solid #f7f7f7", verticalAlign: "middle",
    }}>{children}</td>
  );

  return (
    <div style={{ padding: "32px 36px", fontFamily: "'Barlow', sans-serif", minHeight: "100%" }}>
      
      {/* Page title */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#111827" }}>
          Gestión de Siniestros
        </h1>
        <p style={{ margin: "5px 0 0", fontSize: 14, color: "#9ca3af" }}>
          Administra y da seguimiento a incidentes
        </p>
      </div>

      {/* Card */}
      <div style={{
        background: "#fff", borderRadius: 14,
        border: "1px solid #e9ecef",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}>

        {/* Toolbar */}
        <div style={{
          padding: "18px 24px",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 14,
          borderBottom: "1px solid #f5f5f5",
          flexWrap: "wrap",
        }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>Siniestros Activos</span>

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#adb5bd" strokeWidth="2"
                style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por ID, vehículo, conductor..."
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

            {/* Filtro estatus */}
            <select
              value={filtroEstatus}
              onChange={e => setFiltroEstatus(e.target.value)}
              style={{
                padding: "8px 12px",
                border: "1.5px solid #e5e7eb",
                borderRadius: 8,
                fontSize: 13,
                outline: "none",
                background: "#fafafa",
              }}
            >
              <option value="">Todos los estados</option>
              {estatusSiniestros?.map(e => (
                <option key={e.idEstatus} value={e.nombre}>{e.nombre}</option>
              ))}
            </select>

            {/* Add button */}
            <button
              onClick={onNuevo} disabled={loading}
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
              </svg>Nuevo Siniestro
            </button>
          </div>
        </div>

        {/* Error banner */}
        {errMsg && (
          <div style={{ margin: "12px 24px 0", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", borderRadius: 8, padding: "10px 14px", fontSize: 13 }}>
            {errMsg}
          </div>
        )}

        {/* Table */}
        <div style={{ overflowX: "auto", width: "100%" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "auto" }}>
            <thead>
              <tr>
                <TH>ID</TH>
                <TH>Vehículo</TH>
                <TH>Tipo de Incidente</TH>
                <TH>Reportado por</TH>
                <TH>Fecha</TH>
                <TH>Responsable</TH>
                <TH>Estado</TH>
                <TH center>Acciones</TH>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ padding: "52px 0", textAlign: "center", color: "#9ca3af" }}>Cargando siniestros...</td></tr>
              ) : filtrados.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: "52px 0", textAlign: "center", color: "#9ca3af" }}>No hay siniestros registrados</td></tr>
              ) : filtrados.map(s => (
                <tr key={s.idSiniestro}
                  style={{ transition: "background 0.1s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <TD><span style={{ fontWeight: 600, color: G }}>SIN-{s.idSiniestro}</span></TD>
                  <td style={{ padding: "15px 20px", borderBottom: "1px solid #f7f7f7" }}>
                    <div style={{ fontWeight: 600, color: "#111827" }}>{s.vehiculoInfo}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>{s.numeroEconomico}</div>
                  </td>
                  <TD>{s.descripcion?.substring(0, 30)}...</TD>
                  <TD>{s.conductorNombre}</TD>
                  <TD>{new Date(s.fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}</TD>
                  <TD>{s.atendidoPorNombre || <span style={{ color: "#9ca3af" }}>Asignar...</span>}</TD>
                  <TD><StatusBadge estatus={s.estatusNombre} /></TD>
                  <td style={{ padding: "15px 20px", textAlign: "center", borderBottom: "1px solid #f7f7f7" }}>
                    <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                      <Btn onClick={() => navigate(`/siniestros/${s.idSiniestro}`)} label="Ver"
                        icon={<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2s10 4.48 10 10z"/></svg>}
                      />
                      <Btn onClick={() => onExportarPDF(s)} label="PDF"
                        icon={<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>}
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
        <SiniestroForm
          open={openForm}
          onClose={onCerrar}
          onSubmit={async (vals) => {
            try {
              setSaving(true);
              setLocalErr("");
              clearError();
              if (editTarget?.idSiniestro) {
                await actualizarSiniestro(editTarget.idSiniestro, vals);
              } else {
                await crearSiniestro(vals);
              }
              onCerrar();
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