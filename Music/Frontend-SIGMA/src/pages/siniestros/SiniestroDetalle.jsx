import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSiniestros } from "../../context/Siniestros/SiniestrosContext";
import { useAuth } from "../../context/AuthContext";
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
      fontSize: 12,
      fontWeight: 600,
    }}>
      {colors.label}
    </span>
  );
}

function Btn({ onClick, children, variant = "primary", disabled = false }) {
  const styles = {
    primary: {
      background: G,
      color: "#fff",
      border: "none",
    },
    secondary: {
      background: "#fff",
      color: "#374151",
      border: "1px solid #e5e7eb",
    },
    danger: {
      background: "#fee2e2",
      color: "#b91c1c",
      border: "1px solid #fecaca",
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "8px 16px",
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 500,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        fontFamily: "'Barlow', sans-serif",
        ...styles[variant]
      }}
    >
      {children}
    </button>
  );
}

export default function SiniestroDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    siniestro,
    loading,
    error,
    cargarSiniestro,
    cambiarEstatusSiniestro,
    cargarEstatus,
    estatusSiniestros,
    agregarEvidencia,
    eliminarEvidencia
  } = useSiniestros();

  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [asignando, setAsignando] = useState(false);
  const [responsableId, setResponsableId] = useState("");

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        cargarSiniestro(id),
        cargarEstatus()
      ]);
    };
    loadData();
  }, [id, cargarSiniestro, cargarEstatus]);

  const handleCambiarEstatus = async (nuevoEstatusId) => {
    try {
      await cambiarEstatusSiniestro(id, nuevoEstatusId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAsignarResponsable = async () => {
    if (!responsableId) return;
    try {
      setAsignando(true);
      // Aquí iría la llamada al endpoint de asignar responsable
      // await asignarResponsable(id, responsableId);
    } finally {
      setAsignando(false);
    }
  };

  const handleSubirFoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result.split(',')[1];
        await agregarEvidencia(id, {
          tipo: "FOTO",
          archivoBase64: base64,
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleExportarPDF = async () => {
    await exportarSiniestroPDF(siniestro);
  };

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Cargando...</div>;
  if (error) return <div style={{ padding: 40, textAlign: "center", color: "#dc2626" }}>{error}</div>;
  if (!siniestro) return <div style={{ padding: 40, textAlign: "center" }}>Siniestro no encontrado</div>;

  const isAdminOrEjec = user?.rol === "Administrador" || user?.rol === "Ejecutivo";

  return (
    <div style={{ padding: "32px 36px", fontFamily: "'Barlow', sans-serif", background: "#f8f9fa", minHeight: "100vh" }}>
      
      {/* Header con navegación */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 14,
            color: G,
            display: "flex",
            alignItems: "center",
            gap: 4
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5"/><path d="M12 5l-7 7 7 7"/>
          </svg>
          Volver
        </button>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#111827" }}>
          Detalle de Siniestro: <span style={{ color: G }}>SIN-{siniestro.idSiniestro}</span>
        </h1>
      </div>

      {/* Grid de 2 columnas */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        
        {/* Columna izquierda - Detalle principal */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          
          {/* Descripción */}
          <div style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #e9ecef",
            padding: 24,
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: "#111827", margin: "0 0 12px 0" }}>Descripción</h2>
            <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: 0 }}>
              {siniestro.descripcion}
            </p>
          </div>

          {/* Ubicación */}
          <div style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #e9ecef",
            padding: 24,
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: "#111827", margin: "0 0 12px 0" }}>Ubicación del Incidente</h2>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <div>
                <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 4 }}>Ubicación detectada</div>
                <div style={{ fontSize: 14, color: "#111827", fontWeight: 500 }}>{siniestro.ubicacion}</div>
              </div>
            </div>
          </div>

          {/* Evidencias Fotográficas */}
          <div style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #e9ecef",
            padding: 24,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: "#111827", margin: 0 }}>Evidencias Fotográficas</h2>
              {isAdminOrEjec && (
                <div>
                  <input
                    type="file"
                    id="foto-upload"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleSubirFoto}
                    disabled={uploading}
                  />
                  <label
                    htmlFor="foto-upload"
                    style={{
                      padding: "6px 12px",
                      background: G,
                      color: "#fff",
                      borderRadius: 6,
                      fontSize: 12,
                      cursor: uploading ? "not-allowed" : "pointer",
                      opacity: uploading ? 0.5 : 1,
                    }}
                  >
                    {uploading ? "Subiendo..." : "+ Agregar foto"}
                  </label>
                </div>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 16 }}>
              {siniestro.evidencias?.map(ev => (
                <div key={ev.idEvidencia} style={{ position: "relative" }}>
                  <img
                    src={`data:${ev.mimeType};base64,${ev.archivoBase64}`}
                    alt="Evidencia"
                    style={{
                      width: "100%",
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 8,
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setSelectedImage(ev);
                      setShowImageModal(true);
                    }}
                  />
                  {isAdminOrEjec && (
                    <button
                      onClick={() => eliminarEvidencia(siniestro.idSiniestro, ev.idEvidencia)}
                      style={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        background: "#fee2e2",
                        border: "none",
                        borderRadius: "50%",
                        width: 24,
                        height: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "#b91c1c",
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              {siniestro.evidencias?.length === 0 && (
                <div style={{ fontSize: 13, color: "#9ca3af", padding: "20px 0" }}>
                  No hay evidencias registradas
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Columna derecha - Información y acciones */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          
          {/* Información del Siniestro */}
          <div style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #e9ecef",
            padding: 24,
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: "#111827", margin: "0 0 16px 0" }}>Información del Siniestro</h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <InfoRow label="Vehículo" value={`${siniestro.vehiculoInfo} (${siniestro.numeroEconomico})`} />
              <InfoRow label="Placas" value={siniestro.placas} />
              <InfoRow label="Reportado por" value={siniestro.conductorNombre} />
              <InfoRow label="Fecha del incidente" value={new Date(siniestro.fecha).toLocaleString('es-MX')} />
              <InfoRow label="Estado" value={<StatusBadge estatus={siniestro.estatusNombre} />} />
              {siniestro.atendidoPorNombre && (
                <InfoRow label="Responsable" value={siniestro.atendidoPorNombre} />
              )}
            </div>
          </div>

          {/* Acciones */}
          {isAdminOrEjec && (
            <div style={{
              background: "#fff",
              borderRadius: 14,
              border: "1px solid #e9ecef",
              padding: 24,
            }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: "#111827", margin: "0 0 16px 0" }}>Acciones</h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                
                {/* Asignar responsable */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 4, display: "block" }}>
                    Asignar responsable
                  </label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <select
                      value={responsableId}
                      onChange={e => setResponsableId(e.target.value)}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        border: "1px solid #e5e7eb",
                        borderRadius: 8,
                        fontSize: 13,
                      }}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="2">Admin</option>
                      <option value="3">Ejecutivo</option>
                    </select>
                    <Btn onClick={handleAsignarResponsable} disabled={!responsableId || asignando}>
                      {asignando ? "Asignando..." : "Asignar"}
                    </Btn>
                  </div>
                </div>

                {/* Cambiar estado */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 4, display: "block" }}>
                    Actualizar estado
                  </label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <select
                      onChange={e => handleCambiarEstatus(e.target.value)}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        border: "1px solid #e5e7eb",
                        borderRadius: 8,
                        fontSize: 13,
                      }}
                    >
                      <option value="">Cambiar a...</option>
                      {estatusSiniestros?.map(e => (
                        <option key={e.idEstatus} value={e.idEstatus}>{e.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Botones de acción */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                  <Btn variant="secondary" onClick={() => navigate(`/siniestros/editar/${siniestro.idSiniestro}`)}>
                    Editar
                  </Btn>
                  <Btn variant="primary" onClick={handleExportarPDF}>
                    Exportar Reporte
                  </Btn>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal para ver imagen grande */}
      {showImageModal && selectedImage && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          background: "rgba(0,0,0,0.9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
          onClick={() => setShowImageModal(false)}
        >
          <img
            src={`data:${selectedImage.mimeType};base64,${selectedImage.archivoBase64}`}
            alt="Evidencia ampliada"
            style={{ maxWidth: "90%", maxHeight: "90%", objectFit: "contain" }}
          />
          <button
            onClick={() => setShowImageModal(false)}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              background: "rgba(255,255,255,0.2)",
              border: "none",
              borderRadius: "50%",
              width: 40,
              height: 40,
              color: "#fff",
              fontSize: 24,
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 14, color: "#111827", fontWeight: 500 }}>{value}</div>
    </div>
  );
}