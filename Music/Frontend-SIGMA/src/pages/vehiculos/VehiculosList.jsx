// src/pages/vehiculos/VehiculosList.jsx
import { useEffect, useMemo, useState } from "react";
import { useVehiculos } from "../../context/Vehiculos/VehiculosContext";
import { useNavigate } from "react-router-dom";
import VehiculoForm from "./VehiculoForm";
import { VehiculosAPI } from "../../services/vehiculos.api";

const G = "#1e2b4f"; // Color principal azul marino

const statusConfig = {
  "Activo":           { bg: "#dcfce7", color: "#15803d", border: "#bbf7d0", label: "ACTIVO" },
  "En mantenimiento": { bg: "#fef9c3", color: "#92400e", border: "#fde68a", label: "MANTENIMIENTO" },
  "Inactivo":         { bg: "#f3f4f6", color: "#6b7280", border: "#e5e7eb", label: "INACTIVO" },
};

function Badge({ estatus }) {
  const c = statusConfig[estatus] || statusConfig["Inactivo"];
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px",
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: "0.5px",
      whiteSpace: "nowrap",
    }}>{c.label}</span>
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

export default function VehiculosList() {
  const navigate = useNavigate();
  const { vehiculos, loading, error, cargarVehiculos, crearVehiculo, actualizarVehiculo, eliminarVehiculo, clearError } = useVehiculos();
  const [busqueda, setBusqueda]     = useState("");
  const [openForm, setOpenForm]     = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [saving, setSaving]         = useState(false);
  const [localErr, setLocalErr]     = useState("");
  
  // Estados para el modal de asignación
  const [showAsignarModal, setShowAsignarModal] = useState(false);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [conductores, setConductores] = useState([]);
  const [conductorSeleccionado, setConductorSeleccionado] = useState("");
  const [cargandoConductores, setCargandoConductores] = useState(false);

  useEffect(() => {
    (async () => { try { clearError(); await cargarVehiculos(); } catch (e) { console.error(e); } })();
  }, [cargarVehiculos, clearError]);

  // Cargar conductores cuando se abre el modal - CORREGIDO
  useEffect(() => {
    if (showAsignarModal) {
      const cargarConductores = async () => {
        try {
          setCargandoConductores(true);
          const token = localStorage.getItem('token');
          
          console.log('Token:', token); // Debug
          console.log('URL:', `${import.meta.env.VITE_API_URL}/usuarios/conductores`); // Debug
          
          const response = await fetch(`http://localhost:5086/api/usuarios/conductores`, {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          console.log('Status:', response.status); // Debug
          
          if (!response.ok) {
            const text = await response.text();
            console.log('Error response:', text);
            throw new Error('Error al cargar conductores');
          }
          
          const data = await response.json();
          console.log('Conductores:', data);
          
          // Asegurar que data sea un array
          setConductores(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error('Error completo:', err);
          setLocalErr('No se pudieron cargar los conductores');
        } finally {
          setCargandoConductores(false);
        }
      };
      cargarConductores();
    }
  }, [showAsignarModal]);

  const onNuevo  = () => { setEditTarget(null); setOpenForm(true); };
  const onEditar = (v) => { setEditTarget(v); setOpenForm(true); };
  const onCerrar = () => { setOpenForm(false); setEditTarget(null); };

  const abrirAsignarModal = (vehiculo) => {
    setVehiculoSeleccionado(vehiculo);
    setConductorSeleccionado("");
    setShowAsignarModal(true);
  };

  const asignarConductor = async () => {
    if (!conductorSeleccionado) {
      setLocalErr("Debes seleccionar un conductor");
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5086/api/asignaciones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          idVehiculo: vehiculoSeleccionado.idVehiculo,
          idUsuario: parseInt(conductorSeleccionado)
        })
      });

      if (!response.ok) throw new Error('Error al asignar conductor');
      
      setShowAsignarModal(false);
      await cargarVehiculos(); // Recargar para mostrar la asignación
    } catch (err) {
      console.error('Error:', err);
      setLocalErr(err.message);
    } finally {
      setSaving(false);
    }
  };

  const cambiarEstatus = async (id, nuevoEstatus) => {
    try {
      setSaving(true);
      await VehiculosAPI.cambiarEstatus(id, nuevoEstatus);
      await cargarVehiculos();
    } catch (err) {
      console.error("Error detallado:", err);
      setLocalErr(err.message);
    } finally {
      setSaving(false);
    }
  };

  const onSubmit = async (vals) => {
    try {
      setSaving(true); setLocalErr(""); clearError();
      editTarget?.idVehiculo
        ? await actualizarVehiculo(editTarget.idVehiculo, vals)
        : await crearVehiculo(vals);
      onCerrar();
    } catch (e) { setLocalErr(e.message || "Error al guardar"); }
    finally { setSaving(false); }
  };

  const filtrados = useMemo(() => {
    const t = busqueda.trim().toLowerCase();
    if (!t) return vehiculos || [];
    return (vehiculos || []).filter(v =>
      v.numeroEconomico?.toLowerCase().includes(t) ||
      v.marca?.toLowerCase().includes(t) ||
      v.modelo?.toLowerCase().includes(t) ||
      v.placas?.toLowerCase().includes(t) ||
      v.vin?.toLowerCase().includes(t) ||
      v.conductorAsignado?.toLowerCase().includes(t)
    );
  }, [busqueda, vehiculos]);

  const errMsg = localErr || error;

  const TH = ({ children, center }) => (
    <th style={{
      padding: "10px 20px", textAlign: center ? "center" : "left",
      fontSize: 11, fontWeight: 600, color: "#9ca3af",
      letterSpacing: "0.8px", textTransform: "uppercase",
      borderBottom: "1px solid #f0f0f0", whiteSpace: "nowrap",
    }}>{children}</th>
  );

  const TD = ({ children, center, bold }) => (
    <td style={{
      padding: "15px 20px", textAlign: center ? "center" : "left",
      fontSize: 13, color: bold ? "#111827" : "#374151",
      fontWeight: bold ? 700 : 400,
      borderBottom: "1px solid #f7f7f7", verticalAlign: "middle",
    }}>{children}</td>
  );

  return (
    <div style={{ padding: "32px 36px", fontFamily: "'Barlow', sans-serif", minHeight: "100%" }}>

      {/* Page title */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#111827", display: "flex", alignItems: "center", gap: 10 }}>
          Gestión de Flotilla
        </h1>
        <p style={{ margin: "5px 0 0", fontSize: 14, color: "#9ca3af" }}>
          Administra todos los vehículos de la empresa
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
          <span style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>Listado de Vehículos</span>

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#adb5bd" strokeWidth="2"
                style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Buscar por económico, placas, conductor..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                style={{
                  paddingLeft: 34, paddingRight: 14, paddingTop: 9, paddingBottom: 9,
                  border: "1.5px solid #e5e7eb", borderRadius: 8,
                  fontSize: 13, outline: "none", width: 280,
                  fontFamily: "inherit", color: "#374151", background: "#fafafa",
                }}
                onFocus={e => { e.target.style.borderColor = G; e.target.style.background = "#fff"; }}
                onBlur={e  => { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#fafafa"; }}
              />
            </div>

            {/* Add button */}
            <button
              onClick={onNuevo} disabled={loading}
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "9px 18px", background: G, color: "#fff",
                border: "none", borderRadius: 8,
                fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#2a3a66"}
              onMouseLeave={e => e.currentTarget.style.background = G}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>Agregar Vehículo
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
                <TH>Económico</TH>
                <TH>Vehículo</TH>
                <TH>Placas</TH>
                <TH>Conductor Asignado</TH>
                <TH>Kilometraje</TH>
                <TH>Estado</TH>
                <TH center>Acciones</TH>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ padding: "52px 0", textAlign: "center", color: "#9ca3af", fontSize: 14 }}>Cargando vehículos...</td></tr>
              ) : filtrados.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: "52px 0", textAlign: "center", color: "#9ca3af", fontSize: 14 }}>No hay vehículos registrados</td></tr>
              ) : filtrados.map(v => (
                <tr key={v.idVehiculo}
                  style={{ transition: "background 0.1s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <TD bold>{v.numeroEconomico || "—"}</TD>
                  <td style={{ padding: "15px 20px", borderBottom: "1px solid #f7f7f7" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
                      {[v.marca, v.modelo, v.anio].filter(Boolean).join(" ") || "—"}
                    </div>
                    {v.vin && (
                      <div style={{ fontSize: 11, color: "#9ca3af", fontFamily: "monospace", marginTop: 2 }}>
                        VIN: {v.vin}
                      </div>
                    )}
                  </td>
                  <TD>{v.placas || "—"}</TD>
                  
                  {/* Columna de Conductor Asignado */}
                  <td style={{ padding: "15px 20px", borderBottom: "1px solid #f7f7f7" }}>
                    {v.estaAsignado ? (
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>
                          {v.conductorAsignado || "Conductor asignado"}
                        </span>
                        <button
                          onClick={() => navigate(`/asignaciones/vehiculo/${v.idVehiculo}`)}
                          style={{
                            display: "block",
                            fontSize: 11,
                            color: G,
                            background: "none",
                            border: "none",
                            padding: "2px 0",
                            cursor: "pointer",
                            textDecoration: "underline",
                            marginTop: 2
                          }}
                        >
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => abrirAsignarModal(v)}
                        style={{
                          background: "#f3f4f6",
                          border: `1px dashed #9ca3af`,
                          borderRadius: 6,
                          padding: "6px 12px",
                          fontSize: 12,
                          color: "#4b5563",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          width: "100%",
                          justifyContent: "center"
                        }}
                        onMouseEnter={e => { 
                          e.currentTarget.style.background = "#e5e7eb"; 
                          e.currentTarget.style.borderColor = G; 
                        }}
                        onMouseLeave={e => { 
                          e.currentTarget.style.background = "#f3f4f6"; 
                          e.currentTarget.style.borderColor = "#9ca3af"; 
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Asignar conductor
                      </button>
                    )}
                  </td>

                  <TD>{v.kilometrajeActual ? `${v.kilometrajeActual.toLocaleString()} km` : "—"}</TD>
                  
                  {/* Columna de Estado con select */}
                  <td style={{ padding: "15px 20px", borderBottom: "1px solid #f7f7f7" }}>
                    <select
                      value={v.estatus || "Activo"}
                      onChange={(e) => cambiarEstatus(v.idVehiculo, e.target.value)}
                      disabled={saving}
                      style={{
                        background: v.estatus === "Activo" ? "#dcfce7" : v.estatus === "En mantenimiento" ? "#fef9c3" : "#f3f4f6",
                        color: v.estatus === "Activo" ? "#15803d" : v.estatus === "En mantenimiento" ? "#92400e" : "#6b7280",
                        border: `1px solid ${
                          v.estatus === "Activo" ? "#bbf7d0" : v.estatus === "En mantenimiento" ? "#fde68a" : "#e5e7eb"
                        }`,
                        borderRadius: 999,
                        padding: "4px 12px",
                        fontSize: 11,
                        fontWeight: 700,
                        outline: "none",
                        cursor: "pointer",
                        width: "100%",
                      }}
                    >
                      <option value="Activo">ACTIVO</option>
                      <option value="En mantenimiento">MANTENIMIENTO</option>
                      <option value="Inactivo">INACTIVO</option>
                    </select>
                  </td>

                  <td style={{ padding: "15px 20px", textAlign: "center", borderBottom: "1px solid #f7f7f7" }}>
                    <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                      <Btn onClick={() => onEditar(v)} label="Editar"
                        icon={<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>}
                      />
                      <Btn onClick={() => navigate(`/vehiculos/${v.idVehiculo}`)} label="Ver"
                        icon={<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        {filtrados.length > 0 && (
          <div style={{ padding: "13px 24px", borderTop: "1px solid #f5f5f5", fontSize: 12, color: "#9ca3af", textAlign: "center" }}>
            Mostrando {filtrados.length} de {vehiculos?.length || 0} vehículos
          </div>
        )}
      </div>

      {openForm && (
        <VehiculoForm
          open={openForm}
          onClose={onCerrar}
          onSubmit={onSubmit}
          initial={editTarget}
          saving={saving}
        />
      )}

      {/* Modal de Asignación Rápida */}
      {showAsignarModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
        }}>
          <div style={{
            background: "#fff", borderRadius: 12,
            width: "100%", maxWidth: 450,
            padding: 28,
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}>
            <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 600, color: G }}>
              Asignar conductor
            </h3>
            
            <p style={{ fontSize: 14, color: "#4b5563", marginBottom: 20 }}>
              Vehículo: <strong>{vehiculoSeleccionado?.marca} {vehiculoSeleccionado?.modelo}</strong>
              <br />
              Económico: <strong>{vehiculoSeleccionado?.numeroEconomico}</strong>
            </p>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                Seleccionar conductor
              </label>
              <select
                value={conductorSeleccionado}
                onChange={(e) => setConductorSeleccionado(e.target.value)}
                disabled={cargandoConductores || saving}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  fontSize: 14,
                  backgroundColor: "#fff",
                }}
              >
                <option value="">-- Selecciona un conductor --</option>
                {conductores.map(c => (
                  <option key={c.idUsuario} value={c.idUsuario}>
                    {c.nombre} {c.correo ? `- ${c.correo}` : ''}
                  </option>
                ))}
              </select>
              {cargandoConductores && (
                <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 6 }}>Cargando conductores...</p>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <button
                onClick={() => setShowAsignarModal(false)}
                disabled={saving}
                style={{
                  padding: "10px 20px",
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#f9f9f9"}
                onMouseLeave={e => e.currentTarget.style.background = "#fff"}
              >
                Cancelar
              </button>
              <button
                onClick={asignarConductor}
                disabled={!conductorSeleccionado || cargandoConductores || saving}
                style={{
                  padding: "10px 24px",
                  background: !conductorSeleccionado ? "#9ca3af" : G,
                  border: "none",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#fff",
                  cursor: !conductorSeleccionado ? "not-allowed" : "pointer",
                  opacity: saving ? 0.7 : 1,
                }}
                onMouseEnter={e => { if (conductorSeleccionado && !saving) e.currentTarget.style.background = "#2a3a66"; }}
                onMouseLeave={e => { if (conductorSeleccionado && !saving) e.currentTarget.style.background = G; }}
              >
                {saving ? "Asignando..." : "Asignar conductor"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}