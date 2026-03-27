// src/pages/vehiculos/VehiculoForm.jsx
import { useEffect, useState } from "react";

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

const hintStyle = {
  fontSize: 11,
  color: "#9ca3af",
  marginTop: 4,
};

const errorStyle = {
  fontSize: 11,
  color: "#dc2626",
  marginTop: 4,
};

function Field({ label, hint, error, children }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
      {hint && !error && <p style={hintStyle}>{hint}</p>}
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
}

export default function VehiculoForm({ open, onClose, onSubmit, initial, saving = false }) {
  const [form, setForm] = useState({
    numeroEconomico: "",
    marca: "",
    modelo: "",
    anio: "",
    placas: "",
    vin: "",
    kilometrajeActual: "",
    estatus: "Activo",
    fechaAlta: "",
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) {
      setForm({
        numeroEconomico: initial.numeroEconomico || "",
        marca: initial.marca || "",
        modelo: initial.modelo || "",
        anio: initial.anio || "",
        placas: initial.placas || "",
        vin: initial.vin || "",
        kilometrajeActual: initial.kilometrajeActual || "",
        estatus: initial.estatus || "Activo",
        fechaAlta: initial.fechaAlta ? initial.fechaAlta.split('T')[0] : "",
      });
    } else {
      setForm({
        numeroEconomico: "",
        marca: "",
        modelo: "",
        anio: "",
        placas: "",
        vin: "",
        kilometrajeActual: "",
        estatus: "Activo",
        fechaAlta: new Date().toISOString().split('T')[0], // Fecha actual por defecto
      });
    }
    setErrors({});
  }, [initial, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: (name === "anio" || name === "kilometrajeActual") ? value.replace(/\D/g, "") : value,
    }));
  };

  const validar = () => {
    const errs = {};
    if (!form.numeroEconomico?.trim()) errs.numeroEconomico = "El número económico es obligatorio";
    if (!form.marca?.trim()) errs.marca = "La marca es obligatoria";
    if (!form.modelo?.trim()) errs.modelo = "El modelo es obligatorio";
    if (!form.placas?.trim()) errs.placas = "Las placas son obligatorias";
    if (form.anio && (form.anio.length !== 4 || form.anio < 1900 || form.anio > 2100))
      errs.anio = "Año inválido (1900–2100)";
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;
    
    const payload = {
      numeroEconomico: form.numeroEconomico,
      marca: form.marca,
      modelo: form.modelo,
      anio: form.anio ? parseInt(form.anio) : null,
      placas: form.placas,
      vin: form.vin || null,
      kilometrajeActual: form.kilometrajeActual ? parseInt(form.kilometrajeActual) : null,
      estatus: form.estatus,
      fechaAlta: form.fechaAlta || null,
    };
    
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

  const sectionTitle = (title) => (
    <div style={{ marginBottom: 18, paddingBottom: 10, borderBottom: "1px solid #f0f0f0" }}>
      <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{title}</span>
    </div>
  );

  const grid2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 };

  const marcasComunes = ["Toyota", "Nissan", "Ford", "Chevrolet", "Volkswagen", "Mercedes-Benz", "RAM", "Kenworth", "Volvo"];

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
        width: "100%", maxWidth: 650,
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
      }}>

        {/* Header */}
        <div style={{ padding: "20px 28px 16px", borderBottom: "1px solid #f0f0f0" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>
                {initial ? "Editar Vehículo" : "Agregar Nuevo Vehículo"}
              </h2>
              <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 3 }}>Completa los datos del vehículo</p>
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
          <div style={{ background: "#fafafa", border: "1px solid #f0f0f0", borderRadius: 10, padding: "20px", marginBottom: 20 }}>
            {sectionTitle("Información del Vehículo")}
            <div style={grid2}>

              <Field label="Número Económico *" hint="Identificador único del vehículo" error={errors.numeroEconomico}>
                <input name="numeroEconomico" value={form.numeroEconomico} onChange={handleChange}
                  placeholder="Ej: ECO-001" disabled={saving}
                  style={inputStyle(!!errors.numeroEconomico)}
                  onFocus={onFocusInput} onBlur={onBlurInput} />
              </Field>

              <Field label="Marca *" error={errors.marca}>
                <select name="marca" value={form.marca} onChange={handleChange} disabled={saving}
                  style={{ ...inputStyle(!!errors.marca), background: "#fff" }}
                  onFocus={onFocusInput} onBlur={onBlurInput}>
                  <option value="">Seleccionar marca...</option>
                  {marcasComunes.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </Field>

              <Field label="Modelo *" error={errors.modelo}>
                <input name="modelo" value={form.modelo} onChange={handleChange}
                  placeholder="Ej: Hilux" disabled={saving}
                  style={inputStyle(!!errors.modelo)}
                  onFocus={onFocusInput} onBlur={onBlurInput} />
              </Field>

              <Field label="Año" error={errors.anio}>
                <input name="anio" value={form.anio} onChange={handleChange}
                  placeholder="2024" maxLength="4" disabled={saving}
                  style={inputStyle(!!errors.anio)}
                  onFocus={onFocusInput} onBlur={onBlurInput} />
              </Field>

              <Field label="Placas *" error={errors.placas}>
                <input name="placas" value={form.placas} onChange={handleChange}
                  placeholder="ABC-123" disabled={saving}
                  style={inputStyle(!!errors.placas)}
                  onFocus={onFocusInput} onBlur={onBlurInput} />
              </Field>

              <Field label="VIN" hint="Número de identificación vehicular">
                <input name="vin" value={form.vin} onChange={handleChange}
                  placeholder="1HGBH41JXMN109186" disabled={saving}
                  style={inputStyle(false)}
                  onFocus={onFocusInput} onBlur={onBlurInput} />
              </Field>

              <Field label="Kilometraje Actual">
                <input name="kilometrajeActual" value={form.kilometrajeActual} onChange={handleChange}
                  placeholder="15000" disabled={saving}
                  style={inputStyle(false)}
                  onFocus={onFocusInput} onBlur={onBlurInput} />
              </Field>

              <Field label="Estatus">
                <select name="estatus" value={form.estatus} onChange={handleChange} disabled={saving}
                  style={{ ...inputStyle(false), background: "#fff" }}
                  onFocus={onFocusInput} onBlur={onBlurInput}>
                  <option value="Activo">Activo</option>
                  <option value="En mantenimiento">En mantenimiento</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </Field>

              <Field label="Fecha de Alta">
                <input name="fechaAlta" type="date" value={form.fechaAlta} onChange={handleChange}
                  disabled={saving} style={inputStyle(false)}
                  onFocus={onFocusInput} onBlur={onBlurInput} />
              </Field>

            </div>
          </div>

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button type="button" onClick={onClose} disabled={saving}
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
            <button type="submit" disabled={saving}
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
              {saving ? "Guardando..." : initial ? "Actualizar Vehículo" : "Guardar Vehículo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}