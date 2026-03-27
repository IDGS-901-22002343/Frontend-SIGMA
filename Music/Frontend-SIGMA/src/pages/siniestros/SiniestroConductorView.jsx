import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSiniestros } from "../../context/Siniestros/SiniestrosContext";
import { useAuth } from "../../context/AuthContext";
import SiniestroForm from "./SiniestroForm";

const G = "#1e2b4f";

export default function SiniestroConductorView() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    siniestros,
    loading,
    cargarSiniestros,
    crearSiniestro
  } = useSiniestros();

  const [showForm, setShowForm] = useState(false);
  const [gpsActivo, setGpsActivo] = useState(false);
  const [ubicacion, setUbicacion] = useState("");
  const [obteniendoUbicacion, setObteniendoUbicacion] = useState(false);

  useEffect(() => {
    cargarSiniestros({ conductorId: user?.id });
  }, [cargarSiniestros, user]);

  const obtenerUbicacion = () => {
    setObteniendoUbicacion(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Aquí podrías usar una API de geocodificación inversa
            // Por ahora simulamos con coordenadas
            const { latitude, longitude } = position.coords;
            setUbicacion(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            
            // Opcional: Obtener dirección usando Nominatim/Google Maps
            // const response = await fetch(
            //   `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            // );
            // const data = await response.json();
            // setUbicacion(data.display_name);
          } catch (err) {
            console.error(err);
          } finally {
            setObteniendoUbicacion(false);
          }
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error);
          setUbicacion("No se pudo obtener la ubicación");
          setObteniendoUbicacion(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setUbicacion("GPS no disponible");
      setObteniendoUbicacion(false);
    }
  };

  const handleCrearSiniestro = async (data) => {
    await crearSiniestro({
      ...data,
      ubicacion: ubicacion || data.ubicacion,
      idConductor: user?.id,
      idEstatus: 1 // Reportado
    });
    setShowForm(false);
    setGpsActivo(false);
    setUbicacion("");
  };

  return (
    <div style={{
      padding: "16px",
      fontFamily: "'Barlow', sans-serif",
      background: "#f8f9fa",
      minHeight: "100vh",
    }}>
      
      {/* Header móvil */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
      }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>
          Siniestros
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: G,
            border: "none",
            color: "#fff",
            fontSize: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          {showForm ? "×" : "+"}
        </button>
      </div>

      {/* Formulario rápido (se expande al hacer clic en +) */}
      {showForm && (
        <div style={{
          background: "#fff",
          borderRadius: 16,
          padding: 20,
          marginBottom: 20,
          border: "1px solid #e9ecef",
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: G, margin: "0 0 16px 0" }}>
            Nuevo Siniestro
          </h2>

          {/* GPS Activo */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#f0f9ff",
            padding: "12px 16px",
            borderRadius: 12,
            marginBottom: 20,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="3" fill={G}/>
              </svg>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>GPS Activo</div>
                {ubicacion && (
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                    {ubicacion}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={obtenerUbicacion}
              disabled={obteniendoUbicacion}
              style={{
                padding: "6px 12px",
                background: G,
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 12,
                cursor: obteniendoUbicacion ? "not-allowed" : "pointer",
                opacity: obteniendoUbicacion ? 0.5 : 1,
              }}
            >
              {obteniendoUbicacion ? "Obteniendo..." : "Obtener ubicación"}
            </button>
          </div>

          {/* Campos del formulario */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              Tipo de Incidente
            </label>
            <select
              id="tipoIncidente"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                fontSize: 14,
                marginBottom: 16,
              }}
            >
              <option value="">Seleccionar tipo...</option>
              <option value="accidente">Accidente menor</option>
              <option value="choque">Choque</option>
              <option value="daño">Daño a terceros</option>
              <option value="mecanica">Falla mecánica</option>
              <option value="vandalismo">Vandalismo</option>
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              Descripción del Incidente
            </label>
            <textarea
              placeholder="Describe lo que ocurrió con el mayor detalle posible..."
              rows={4}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                fontSize: 14,
                fontFamily: "inherit",
                resize: "vertical",
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              Ubicación
            </label>
            <input
              type="text"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              placeholder="Ubicación del incidente"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                fontSize: 14,
              }}
            />
          </div>

          <button
            onClick={() => handleCrearSiniestro({/* datos del form */})}
            style={{
              width: "100%",
              padding: "14px",
              background: G,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Enviar Reporte
          </button>
        </div>
      )}

      {/* Lista de siniestros del conductor */}
      <div style={{
        background: "#fff",
        borderRadius: 16,
        border: "1px solid #e9ecef",
        overflow: "hidden",
      }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0" }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "#111827", margin: 0 }}>
            Mis Reportes
          </h2>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>
            Cargando...
          </div>
        ) : siniestros?.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>
            No has reportado ningún siniestro
          </div>
        ) : (
          <div style={{ padding: "16px" }}>
            {siniestros?.map(s => (
              <div
                key={s.idSiniestro}
                onClick={() => navigate(`/siniestros/${s.idSiniestro}`)}
                style={{
                  padding: "16px",
                  borderBottom: "1px solid #f0f0f0",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontWeight: 600, color: G }}>SIN-{s.idSiniestro}</span>
                  <StatusBadge estatus={s.estatusNombre} />
                </div>
                <div style={{ fontSize: 14, color: "#111827", marginBottom: 4 }}>
                  {s.vehiculoInfo}
                </div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>
                  {new Date(s.fecha).toLocaleString('es-MX')}
                </div>
                <div style={{ fontSize: 13, color: "#374151", marginTop: 8 }}>
                  {s.descripcion?.substring(0, 60)}...
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ estatus }) {
  const colors = {
    "Reportado": { bg: "#fee2e2", color: "#b91c1c" },
    "En proceso": { bg: "#fef3c7", color: "#b45309" },
    "Resuelto": { bg: "#d1fae5", color: "#065f46" },
    "Cerrado": { bg: "#e5e7eb", color: "#4b5563" },
  };
  const c = colors[estatus] || { bg: "#e5e7eb", color: "#6b7280" };
  return (
    <span style={{
      background: c.bg,
      color: c.color,
      padding: "2px 8px",
      borderRadius: 999,
      fontSize: 10,
      fontWeight: 600,
    }}>
      {estatus}
    </span>
  );
}