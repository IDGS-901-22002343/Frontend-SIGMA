import { useEffect, useState } from "react";
import { useMantenimientos } from "../../context/Mantenimientos/MantenimientosContext";
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

export default function MantenimientoForm({ open, onClose, onSubmit, initial, saving = false }) {
  const { tiposMantenimiento, proveedores, cargarTipos, cargarProveedores } = useMantenimientos();
  const { vehiculos, cargarVehiculos } = useVehiculos();
  const { user } = useAuth();
  
  const [form, setForm] = useState({
    idVehiculo: "",
    idTipo: "",
    fecha: new Date().toISOString().split('T')[0],
    kilometraje: "",
    costo: "",
    idProveedor: "",
    observaciones: "",
    registradoPor: user?.id || 1
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      cargarTipos();
      cargarProveedores();
      cargarVehiculos();
    }
  }, [open, cargarTipos, cargarProveedores, cargarVehiculos]);

  useEffect(() => {
    if (initial) {
      setForm({
        idVehiculo: initial.idVehiculo || "",
        idTipo: initial.idTipo || "",
        fecha: initial.fecha ? initial.fecha.split('T')[0] : new Date().toISOString().split('T')[0],
        kilometraje: initial.kilometraje || "",
        costo: initial.costo || "",
        idProveedor: initial.idProveedor || "",
        observaciones: initial.observaciones || "",
        registradoPor: user?.id || 1
      });
    } else {
      setForm({
        idVehiculo: "",
        idTipo: "",
        fecha: new Date().toISOString().split('T')[0],
        kilometraje: "",
        costo: "",
        idProveedor: "",
        observaciones: "",
        registradoPor: user?.id || 1
      });
    }
    setErrors({});
  }, [initial, open, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: (name === "kilometraje" || name === "costo") ? value.replace(/\D/g, "") : value,
    }));
  };

  const validar = () => {
    const errs = {};
    if (!form.idVehiculo) errs.idVehiculo = "Selecciona un vehículo";
    if (!form.idTipo) errs.idTipo = "Selecciona un tipo de mantenimiento";
    if (!form.fecha) errs.fecha = "La fecha es obligatoria";
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    const payload = {
      idVehiculo: parseInt(form.idVehiculo),
      idTipo: parseInt(form.idTipo),
      fecha: form.fecha,
      kilometraje: form.kilometraje ? parseInt(form.kilometraje) : null,
      costo: form.costo ? parseFloat(form.costo) : null,
      idProveedor: form.idProveedor ? parseInt(form.idProveedor) : null,
      observaciones: form.observaciones,
      registradoPor: parseInt(form.registradoPor) // 👈 ASEGURA QUE SEA NÚMERO
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
        width: "100%", maxWidth: 600,
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
      }}>
        
        {/* Header */}
        <div style={{ padding: "20px 28px 16px", borderBottom: "1px solid #f0f0f0" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>
                {initial ? "Editar Mantenimiento" : "Nuevo Mantenimiento"}
              </h2>
              <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 3 }}>Registra el servicio realizado</p>
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
                    {v.numeroEconomico} - {v.marca} {v.modelo}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Fecha *" error={errors.fecha}>
              <input
                type="date"
                name="fecha"
                value={form.fecha}
                onChange={handleChange}
                disabled={saving}
                style={inputStyle(!!errors.fecha)}
                onFocus={onFocusInput}
                onBlur={onBlurInput}
              />
            </Field>

            <Field label="Tipo de Mantenimiento *" error={errors.idTipo}>
              <select
                name="idTipo"
                value={form.idTipo}
                onChange={handleChange}
                disabled={saving}
                style={{ ...inputStyle(!!errors.idTipo), background: "#fff" }}
                onFocus={onFocusInput}
                onBlur={onBlurInput}
              >
                <option value="">Seleccionar tipo...</option>
                {tiposMantenimiento?.map(t => (
                  <option key={t.idTipo} value={t.idTipo}>{t.nombre}</option>
                ))}
              </select>
            </Field>

            <Field label="Kilometraje">
              <input
                type="text"
                name="kilometraje"
                value={form.kilometraje}
                onChange={handleChange}
                placeholder="Ej: 15000"
                disabled={saving}
                style={inputStyle(false)}
                onFocus={onFocusInput}
                onBlur={onBlurInput}
              />
            </Field>

            <Field label="Costo ($)">
              <input
                type="text"
                name="costo"
                value={form.costo}
                onChange={handleChange}
                placeholder="Ej: 1250.50"
                disabled={saving}
                style={inputStyle(false)}
                onFocus={onFocusInput}
                onBlur={onBlurInput}
              />
            </Field>

            <Field label="Taller/Proveedor">
              <select
                name="idProveedor"
                value={form.idProveedor}
                onChange={handleChange}
                disabled={saving}
                style={{ ...inputStyle(false), background: "#fff" }}
                onFocus={onFocusInput}
                onBlur={onBlurInput}
              >
                <option value="">Sin proveedor</option>
                {proveedores?.map(p => (
                  <option key={p.idProveedor} value={p.idProveedor}>{p.nombre}</option>
                ))}
              </select>
            </Field>
          </div>

          <div style={{ marginTop: 16 }}>
            <Field label="Observaciones">
              <textarea
                name="observaciones"
                value={form.observaciones}
                onChange={handleChange}
                placeholder="Detalles adicionales del mantenimiento..."
                disabled={saving}
                rows={3}
                style={{ ...inputStyle(false), resize: "vertical", fontFamily: "'Barlow', sans-serif" }}
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
              {saving ? "Guardando..." : initial ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}