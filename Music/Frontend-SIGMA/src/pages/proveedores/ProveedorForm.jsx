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

function Field({ label, error, children }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>{label}</label>
      {children}
      {error && <p style={{ fontSize: 11, color: "#dc2626", marginTop: 4 }}>{error}</p>}
    </div>
  );
}

export default function ProveedorForm({ open, onClose, onSubmit, initial, saving = false }) {
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    correo: "",
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) {
      setForm({
        nombre: initial.nombre || "",
        telefono: initial.telefono || "",
        correo: initial.correo || "",
      });
    } else {
      setForm({ nombre: "", telefono: "", correo: "" });
    }
    setErrors({});
  }, [initial, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validar = () => {
    const errs = {};
    if (!form.nombre.trim()) errs.nombre = "El nombre es obligatorio";
    if (form.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) {
      errs.correo = "Correo inválido";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;
    await onSubmit(form);
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
      padding: "16px",
    }}>
      <div style={{
        background: "#fff", borderRadius: 16,
        width: "100%", maxWidth: 500,
        boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
      }}>
        
        <div style={{ padding: "20px 28px 16px", borderBottom: "1px solid #f0f0f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>
              {initial ? "Editar Proveedor" : "Nuevo Proveedor"}
            </h2>
            <button onClick={onClose} disabled={saving} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#9ca3af" }}>×</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "24px 28px" }}>
          <Field label="Nombre *" error={errors.nombre}>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: Taller El Águila"
              disabled={saving}
              style={inputStyle(!!errors.nombre)}
              onFocus={onFocusInput}
              onBlur={onBlurInput}
            />
          </Field>

          <Field label="Teléfono" error={errors.telefono}>
            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="Ej: 555-123-4567"
              disabled={saving}
              style={inputStyle(!!errors.telefono)}
              onFocus={onFocusInput}
              onBlur={onBlurInput}
            />
          </Field>

          <Field label="Correo electrónico" error={errors.correo}>
            <input
              name="correo"
              type="email"
              value={form.correo}
              onChange={handleChange}
              placeholder="Ej: contacto@taller.com"
              disabled={saving}
              style={inputStyle(!!errors.correo)}
              onFocus={onFocusInput}
              onBlur={onBlurInput}
            />
          </Field>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
            <button type="button" onClick={onClose} disabled={saving} style={{
              padding: "10px 20px", background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 8,
              fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer"
            }}>Cancelar</button>
            <button type="submit" disabled={saving} style={{
              padding: "10px 24px", background: "#1e2b4f", border: "none", borderRadius: 8,
              fontSize: 13, fontWeight: 700, color: "#fff", cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.7 : 1
            }}>{saving ? "Guardando..." : initial ? "Actualizar" : "Guardar"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}