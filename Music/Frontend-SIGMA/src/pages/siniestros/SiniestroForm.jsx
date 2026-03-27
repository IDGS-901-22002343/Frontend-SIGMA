import { useEffect, useState } from "react";
import { useSiniestros } from "../../context/Siniestros/SiniestrosContext";
import { useVehiculos } from "../../context/Vehiculos/VehiculosContext";
import { useAuth } from "../../context/AuthContext";

const inputStyle = (hasError) => ({
  width: "100%",
  padding: "10px 12px",
  border: `1.5px solid ${hasError ? "#fca5a5" : "#e5e7eb"}`,
  borderRadius: 8,
  fontSize: 14,
  fontFamily: "'Barlow', sans-serif",
  color: "#111827",
  background: hasError ? "#fff5f5" : "#fff",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.15s, box-shadow 0.15s",
});

const labelStyle = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: "#374151",
  marginBottom: 5,
};

const errorStyle = {
  fontSize: 11,
  color: "#dc2626",
  marginTop: 4,
};

function Field({ label, error, children }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
}

export default function SiniestroForm({ open, onClose, onSubmit, initial, saving = false }) {
  const { user } = useAuth();
  const { vehiculos, cargarVehiculos } = useVehiculos();
  const { estatusSiniestros, cargarEstatus } = useSiniestros();
  
  const [form, setForm] = useState({
    idVehiculo: "",
    idConductor: user?.id || "",
    descripcion: "",
    ubicacion: "",
    idEstatus: 1, // Reportado por defecto
    atendidoPor: null,
    fecha: new Date().toISOString().split('T')[0]
  });
  
  const [errors, setErrors] = useState({});
  const [gpsActivo, setGpsActivo] = useState(false);
  const [obteniendoUbicacion, setObteniendoUbicacion] = useState(false);

  useEffect(() => {
    if (open) {
      cargarVehiculos();
      cargarEstatus();
    }
  }, [open, cargarVehiculos, cargarEstatus]);

  useEffect(() => {
    if (initial) {
      setForm({
        idVehiculo: initial.idVehiculo || "",
        idConductor: initial.idConductor || user?.id || "",
        descripcion: initial.descripcion || "",
        ubicacion: initial.ubicacion || "",
        idEstatus: initial.idEstatus || 1,
        atendidoPor: initial.atendidoPor || null,
        fecha: initial.fecha ? initial.fecha.split('T')[0] : new Date().toISOString().split('T')[0]
      });
    } else {
      setForm({
        idVehiculo: "",
        idConductor: user?.id || "",
        descripcion: "",
        ubicacion: "",
        idEstatus: 1,
        atendidoPor: null,
        fecha: new Date().toISOString().split('T')[0]
      });
    }
    setErrors({});
  }, [initial, open, user]);

  const obtenerUbicacionGPS = () => {
    setObteniendoUbicacion(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            // Intentar obtener dirección con geocodificación inversa
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
            );
            const data = await response.json();
            setForm(prev => ({
              ...prev,
              ubicacion: data.display_name || `${latitude}, ${longitude}`
            }));
          } catch (err) {
            // Si falla la geocodificación, solo mostrar coordenadas
            const { latitude, longitude } = position.coords;
            setForm(prev => ({
              ...prev,
              ubicacion: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
            }));
          } finally {
            setObteniendoUbicacion(false);
            setGpsActivo(true);
          }
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error);
          let mensaje = "No se pudo obtener la ubicación";
          if (error.code === 1) mensaje = "Permiso de ubicación denegado";
          if (error.code === 2) mensaje = "Ubicación no disponible";
          if (error.code === 3) mensaje = "Tiempo de espera agotado";
          
          setForm(prev => ({ ...prev, ubicacion: mensaje }));
          setObteniendoUbicacion(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setForm(prev => ({ ...prev, ubicacion: "GPS no disponible en este dispositivo" }));
      setObteniendoUbicacion(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validar = () => {
    const errs = {};
    if (!form.idVehiculo) errs.idVehiculo = "Selecciona un vehículo";
    if (!form.descripcion?.trim()) errs.descripcion = "La descripción es obligatoria";
    if (!form.ubicacion?.trim()) errs.ubicacion = "La ubicación es obligatoria";
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    const payload = {
      idVehiculo: parseInt(form.idVehiculo),
      idConductor: parseInt(form.idConductor),
      descripcion: form.descripcion,
      ubicacion: form.ubicacion,
      idEstatus: parseInt(form.idEstatus),
      atendidoPor: form.atendidoPor ? parseInt(form.atendidoPor) : null,
      fecha: form.fecha
    };

    console.log("Payload enviado:", payload);
    await onSubmit(payload);
  };

  const onFocusInput = (e) => {
    e.target.style.borderColor = "#1e2b4f";
    e.target.style.boxShadow = "0 0 0 3px rgba(30,43,79,0.08)";
  };
  
  const onBlurInput = (e) => {
    e.target.style.borderColor = "#e5e7eb";
    e.target.style.boxShadow = "none";
  };

  if (!open) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
      fontFamily: "'Barlow', sans-serif",
      padding: "16px",
    }}>
      <div style={{
        background: "#fff", borderRadius: 16,
        width: "100%", maxWidth: 700,
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
      }}>
        
        {/* Header */}
        <div style={{ padding: "20px 28px 16px", borderBottom: "1px solid #f0f0f0" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>
                {initial ? "Editar Siniestro" : "Nuevo Siniestro"}
              </h2>
              <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 3 }}>
                Registra un incidente o accidente
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={saving}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 22, lineHeight: 1, padding: 4 }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#374151"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#9ca3af"}
            >×</button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "24px 28px" }}>
          
          {/* GPS Section */}
          <div style={{
            background: "#f0f9ff",
            border: "1px solid #bae6fd",
            borderRadius: 12,
            padding: "16px 20px",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1e2b4f" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="3" fill="#1e2b4f"/>
              </svg>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#1e2b4f" }}>GPS Activo</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                  {form.ubicacion || "Obtén tu ubicación actual"}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={obtenerUbicacionGPS}
              disabled={obteniendoUbicacion}
              style={{
                padding: "8px 16px",
                background: "#1e2b4f",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                cursor: obteniendoUbicacion ? "not-allowed" : "pointer",
                opacity: obteniendoUbicacion ? 0.5 : 1,
              }}
            >
              {obteniendoUbicacion ? "Obteniendo..." : "Obtener ubicación"}
            </button>
          </div>

          {/* Grid de 2 columnas */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            
            <Field label="Vehículo *" error={errors.idVehiculo}>
              <select
                name="idVehiculo"
                value={form.idVehiculo}
                onChange={handleChange}
                disabled={saving}
                style={{ ...inputStyle(!!errors.idVehiculo), background: "#fff" }}
                onFocus={onFocusInput}
                onBlur={onBlurInput}
              >
                <option value="">Seleccionar vehículo...</option>
                {vehiculos?.map(v => (
                  <option key={v.idVehiculo} value={v.idVehiculo}>
                    {v.numeroEconomico} - {v.marca} {v.modelo} ({v.placas})
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Fecha del incidente">
              <input
                type="date"
                name="fecha"
                value={form.fecha}
                onChange={handleChange}
                disabled={saving}
                style={inputStyle(false)}
                onFocus={onFocusInput}
                onBlur={onBlurInput}
              />
            </Field>

            <Field label="Tipo de incidente">
              <select
                name="idEstatus"
                value={form.idEstatus}
                onChange={handleChange}
                disabled={saving}
                style={{ ...inputStyle(false), background: "#fff" }}
                onFocus={onFocusInput}
                onBlur={onBlurInput}
              >
                {estatusSiniestros?.map(e => (
                  <option key={e.idEstatus} value={e.idEstatus}>{e.nombre}</option>
                ))}
              </select>
            </Field>

            <Field label="Responsable (opcional)">
              <select
                name="atendidoPor"
                value={form.atendidoPor || ""}
                onChange={handleChange}
                disabled={saving}
                style={{ ...inputStyle(false), background: "#fff" }}
                onFocus={onFocusInput}
                onBlur={onBlurInput}
              >
                <option value="">Sin asignar</option>
                <option value="1">Admin</option>
                <option value="2">Ejecutivo</option>
              </select>
            </Field>
          </div>

          {/* Campo de ubicación */}
          <div style={{ marginTop: 16 }}>
            <Field label="Ubicación *" error={errors.ubicacion}>
              <input
                type="text"
                name="ubicacion"
                value={form.ubicacion}
                onChange={handleChange}
                placeholder="Dirección o coordenadas del incidente"
                disabled={saving}
                style={inputStyle(!!errors.ubicacion)}
                onFocus={onFocusInput}
                onBlur={onBlurInput}
              />
            </Field>
          </div>

          {/* Descripción */}
          <div style={{ marginTop: 16 }}>
            <Field label="Descripción del incidente *" error={errors.descripcion}>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Describe lo que ocurrió con el mayor detalle posible..."
                disabled={saving}
                rows={5}
                style={{ ...inputStyle(!!errors.descripcion), resize: "vertical", fontFamily: "'Barlow', sans-serif" }}
                onFocus={onFocusInput}
                onBlur={onBlurInput}
              />
            </Field>
          </div>

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              style={{
                padding: "10px 20px", background: "#fff",
                border: "1.5px solid #e5e7eb", borderRadius: 8,
                fontSize: 13, fontWeight: 600, color: "#374151",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#f9f9f9"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "10px 24px", background: "#1e2b4f",
                border: "none", borderRadius: 8,
                fontSize: 13, fontWeight: 700, color: "#fff",
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.7 : 1,
              }}
              onMouseEnter={(e) => { if (!saving) e.currentTarget.style.background = "#2a3a66"; }}
              onMouseLeave={(e) => { if (!saving) e.currentTarget.style.background = "#1e2b4f"; }}
            >
              {saving ? "Guardando..." : initial ? "Actualizar Siniestro" : "Enviar Reporte"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}