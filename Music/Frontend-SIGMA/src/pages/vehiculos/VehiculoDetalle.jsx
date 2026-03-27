// src/pages/vehiculos/VehiculoDetalle.jsx
import { useEffect, useState } from "react";
import { useVehiculos } from "../../context/Vehiculos/VehiculosContext";
import { useParams, useNavigate } from "react-router-dom";

export default function VehiculoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cargarVehiculo, loading, error, clearError } = useVehiculos();
  const [vehiculo, setVehiculo] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        clearError();
        const data = await cargarVehiculo(id);
        setVehiculo(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, [id, cargarVehiculo, clearError]);

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Cargando...</div>;
  if (error) return <div style={{ padding: 40, textAlign: "center", color: "red" }}>{error}</div>;
  if (!vehiculo) return <div style={{ padding: 40, textAlign: "center" }}>Vehículo no encontrado</div>;

  return (
    <div style={{ padding: "32px 36px", fontFamily: "'Barlow', sans-serif" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 20, padding: "8px 16px", background: "#f5f5f5", border: "1px solid #ddd", borderRadius: 6, cursor: "pointer" }}>
        ← Volver
      </button>

      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e9ecef", padding: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1e2b4f", marginBottom: 24 }}>Detalle del Vehículo</h1>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
          <InfoRow label="Número Económico" value={vehiculo.numeroEconomico} />
          <InfoRow label="Marca" value={vehiculo.marca} />
          <InfoRow label="Modelo" value={vehiculo.modelo} />
          <InfoRow label="Año" value={vehiculo.anio} />
          <InfoRow label="Placas" value={vehiculo.placas} />
          <InfoRow label="VIN" value={vehiculo.vin} />
          <InfoRow label="Kilometraje" value={vehiculo.kilometrajeActual ? `${vehiculo.kilometrajeActual} km` : "—"} />
          <InfoRow label="Estatus" value={vehiculo.estatus} />
          <InfoRow label="Fecha Alta" value={vehiculo.fechaAlta ? new Date(vehiculo.fechaAlta).toLocaleDateString() : "—"} />
          <InfoRow label="Asignado" value={vehiculo.estaAsignado ? "Sí" : "No"} />
          <InfoRow label="Total Mantenimientos" value={vehiculo.totalMantenimientos || 0} />
          <InfoRow label="Total Siniestros" value={vehiculo.totalSiniestros || 0} />
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
      <span style={{ fontSize: 12, color: "#9ca3af", display: "block" }}>{label}</span>
      <span style={{ fontSize: 16, fontWeight: 500, color: "#111827" }}>{value || "—"}</span>
    </div>
  );
}