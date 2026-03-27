import { useEffect, useState } from "react";
import { useVehiculos } from "../context/Vehiculos/VehiculosContext";
import { useMantenimientos } from "../context/Mantenimientos/MantenimientosContext";

// Colores
const G = "#1e2b4f";
const LIGHT_GREEN = "#e8f0e8";
const SOFT_RED = "#fee9e9";
const SOFT_YELLOW = "#fef7e6";
const SOFT_BLUE = "#e6f0ff";

// Iconos
function CarIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="6" width="18" height="10" rx="1.5"/><circle cx="5.5" cy="16.5" r="2.5"/><circle cx="14.5" cy="16.5" r="2.5"/><line x1="9" y1="16" x2="11" y2="16"/><line x1="16" y1="8" x2="19" y2="8"/></svg>;
}
function WrenchIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
}
function AlertIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
}
function ClockIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}
function ShieldIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
}
function FileIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
}
function CheckIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
}

// Badge para días restantes
function DaysBadge({ days }) {
  let bg = SOFT_BLUE;
  let color = "#1e4f8a";
  let text = `${days} días`;
  
  if (days === 0 || days === "Hoy") {
    bg = SOFT_RED;
    color = "#b91c1c";
    text = "Hoy";
  } else if (days <= 3) {
    bg = SOFT_YELLOW;
    color = "#b45309";
    text = `${days} días`;
  }
  
  return (
    <span style={{ background: bg, color, padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
      {text}
    </span>
  );
}

export default function DashboardPage() {
  const { vehiculos, cargarVehiculos } = useVehiculos();
  const { mantenimientos, cargarMantenimientos } = useMantenimientos();
  const [stats, setStats] = useState({
    totalVehiculos: 0,
    activos: 0,
    enMantenimiento: 0,
    inactivos: 0,
    siniestrosActivos: 3, // 👈 ESTÁTICO MIENTRAS TANTO
    mantenimientosProximos: [],
    alertas: [
      { tipo: "vencido", titulo: "Mantenimiento Vencido", descripcion: "3 vehículos requieren atención inmediata", icon: <WrenchIcon /> },
      { tipo: "sinAsignar", titulo: "Siniestro sin asignar", descripcion: "1 reporte pendiente de revisión", icon: <AlertIcon /> },
      { tipo: "documentos", titulo: "Documentos por vencer", descripcion: "5 pólizas vencen en 30 días", icon: <FileIcon /> },
      { tipo: "verificacion", titulo: "Verificaciones pendientes", descripcion: "8 unidades requieren verificación", icon: <CheckIcon /> },
    ]
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        await cargarVehiculos();
        await cargarMantenimientos();
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };
    loadData();
  }, [cargarVehiculos, cargarMantenimientos]);

  useEffect(() => {
    if (vehiculos?.length) {
      const total = vehiculos.length;
      const activos = vehiculos.filter(v => v.estatus === "Activo").length;
      const enMantto = vehiculos.filter(v => v.estatus === "En mantenimiento").length;
      const inactivos = vehiculos.filter(v => v.estatus === "Inactivo").length;
      
      setStats(prev => ({
        ...prev,
        totalVehiculos: total,
        activos,
        enMantenimiento: enMantto,
        inactivos,
      }));
    }

    // Mantenimientos próximos (basado en fecha)
    if (mantenimientos?.length) {
      const hoy = new Date();
      const proximos = mantenimientos
        .filter(m => new Date(m.fecha) >= hoy)
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
        .slice(0, 4)
        .map(m => {
          const fechaM = new Date(m.fecha);
          const diffTime = fechaM - hoy;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return {
            id: m.idMantenimiento,
            vehiculo: m.vehiculoInfo || "Vehículo",
            eco: m.numeroEconomico || "ECO-???",
            tipo: m.tipoNombre || "Mantenimiento",
            dias: diffDays > 0 ? diffDays : "Hoy",
            fecha: m.fecha
          };
        });
      
      // Si no hay suficientes, agregar datos estáticos
      if (proximos.length < 4) {
        const estaticos = [
          { id: "eco-1023", vehiculo: "Ford Transit 2021", eco: "ECO-1023", tipo: "Preventivo", dias: 3 },
          { id: "eco-1045", vehiculo: "Chevrolet Express 2022", eco: "ECO-1045", tipo: "Preventivo", dias: 5 },
          { id: "eco-1067", vehiculo: "Mercedes Sprinter 2023", eco: "ECO-1067", tipo: "Correctivo", dias: "Hoy" },
          { id: "eco-1089", vehiculo: "RAM ProMaster 2021", eco: "ECO-1089", tipo: "Preventivo", dias: 7 },
        ];
        setStats(prev => ({ ...prev, mantenimientosProximos: estaticos }));
      } else {
        setStats(prev => ({ ...prev, mantenimientosProximos: proximos }));
      }
    } else {
      // Datos estáticos por defecto
      setStats(prev => ({
        ...prev,
        mantenimientosProximos: [
          { id: "eco-1023", vehiculo: "Ford Transit 2021", eco: "ECO-1023", tipo: "Preventivo", dias: 3 },
          { id: "eco-1045", vehiculo: "Chevrolet Express 2022", eco: "ECO-1045", tipo: "Preventivo", dias: 5 },
          { id: "eco-1067", vehiculo: "Mercedes Sprinter 2023", eco: "ECO-1067", tipo: "Correctivo", dias: "Hoy" },
          { id: "eco-1089", vehiculo: "RAM ProMaster 2021", eco: "ECO-1089", tipo: "Preventivo", dias: 7 },
        ]
      }));
    }
  }, [vehiculos, mantenimientos]);

  const Card = ({ title, value, subtitle, icon, bgColor = "#fff", color = "#111" }) => (
    <div style={{
      background: bgColor,
      borderRadius: 16,
      padding: 20,
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      border: "1px solid #f0f0f0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <div>
        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 32, fontWeight: 700, color }}>{value}</div>
        {subtitle && <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>{subtitle}</div>}
      </div>
      <div style={{ color: G, opacity: 0.7 }}>
        {icon}
      </div>
    </div>
  );

  return (
    <div style={{ padding: "32px 36px", fontFamily: "'Barlow', sans-serif", background: "#f8f9fa", minHeight: "100vh" }}>
      
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#111827" }}>Dashboard General</h1>
        <p style={{ margin: "5px 0 0", fontSize: 14, color: "#9ca3af" }}>
          Resumen de la operación en tiempo real
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 20,
        marginBottom: 32
      }}>
        <Card 
          title="TOTAL VEHÍCULOS"
          value={stats.totalVehiculos}
          subtitle="+ 8% vs mes anterior"
          icon={<CarIcon />}
          bgColor="#fff"
        />
        <Card 
          title="VEHÍCULOS ACTIVOS"
          value={stats.activos}
          subtitle={`${Math.round((stats.activos / (stats.totalVehiculos || 1)) * 100)}% de la flotilla`}
          icon={<CarIcon />}
          bgColor={LIGHT_GREEN}
          color="#166534"
        />
        <Card 
          title="EN MANTENIMIENTO"
          value={stats.enMantenimiento}
          subtitle={`${Math.round((stats.enMantenimiento / (stats.totalVehiculos || 1)) * 100)}% de la flotilla`}
          icon={<WrenchIcon />}
          bgColor={SOFT_YELLOW}
          color="#92400e"
        />
        <Card 
          title="SINIESTROS ACTIVOS"
          value={stats.siniestrosActivos}
          subtitle="En seguimiento"
          icon={<AlertIcon />}
          bgColor={SOFT_RED}
          color="#b91c1c"
        />
      </div>

      {/* Two columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        
        {/* Mantenimientos Próximos */}
        <div style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #f0f0f0",
          overflow: "hidden",
        }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #f5f5f5" }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "#111827", margin: 0 }}>Mantenimientos Próximos</h2>
          </div>
          
          <div style={{ padding: "16px 20px" }}>
            {stats.mantenimientosProximos.map((m, idx) => (
              <div key={m.id || idx} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 0",
                borderBottom: idx < stats.mantenimientosProximos.length - 1 ? "1px solid #f0f0f0" : "none"
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{m.eco}</div>
                  <div style={{ fontSize: 13, color: "#6b7280" }}>{m.vehiculo}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{m.tipo}</div>
                </div>
                <DaysBadge days={m.dias} />
              </div>
            ))}
          </div>
        </div>

        {/* Alertas */}
        <div style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #f0f0f0",
          overflow: "hidden",
        }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #f5f5f5" }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "#111827", margin: 0 }}>Alertas</h2>
          </div>
          
          <div style={{ padding: "16px 20px" }}>
            {stats.alertas.map((alerta, idx) => (
              <div key={idx} style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 0",
                borderBottom: idx < stats.alertas.length - 1 ? "1px solid #f0f0f0" : "none"
              }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: 
                    alerta.tipo === "vencido" ? SOFT_RED :
                    alerta.tipo === "sinAsignar" ? SOFT_YELLOW :
                    alerta.tipo === "documentos" ? SOFT_BLUE : LIGHT_GREEN,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: G
                }}>
                  {alerta.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{alerta.titulo}</div>
                  <div style={{ fontSize: 13, color: "#6b7280" }}>{alerta.descripcion}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}