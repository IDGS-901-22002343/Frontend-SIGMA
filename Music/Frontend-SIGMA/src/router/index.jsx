// src/router/index.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminLayout from "../layout/AdminLayout";
import VehiculosList from "../pages/vehiculos/VehiculosList";
import VehiculoDetalle from "../pages/vehiculos/VehiculoDetalle";
import MantenimientosList from "../pages/mantenimientos/MantenimientosList";
import ProveedoresList from "../pages/proveedores/ProveedoresList";
import DashboardPage from "../pages/DashboardPage";
// 👇 IMPORTACIONES DE SINIESTROS
import SiniestrosList from "../pages/siniestros/SiniestrosList";
import SiniestroDetalle from "../pages/siniestros/SiniestroDetalle";
import SiniestroConductorView from "../pages/siniestros/SiniestroConductorView";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      // VEHÍCULOS
      {
        path: "vehiculos",
        element: <VehiculosList />,
      },
      {
        path: "vehiculos/:id",
        element: <VehiculoDetalle />,
      },
      // MANTENIMIENTOS
      {
        path: "mantenimientos",
        element: <MantenimientosList />,
      },
      {
        path: "mantenimientos/:id",
        element: <div style={{ padding: 32 }}>Detalle de mantenimiento (próximamente)</div>,
      },
      // PROVEEDORES
      {
        path: "proveedores",
        element: <ProveedoresList />,
      },
      {
        path: "proveedores/:id",
        element: <div style={{ padding: 32 }}>Detalle de proveedor (próximamente)</div>,
      },
      // 👇 SINIESTROS - VISTA ADMIN/EJEC
      {
        path: "siniestros",
        element: <SiniestrosList />,
      },
      {
        path: "siniestros/:id",
        element: <SiniestroDetalle />,
      },
      // 👇 SINIESTROS - VISTA CONDUCTOR (RUTA ESPECÍFICA PARA CONDUCTORES)
      {
        path: "mis-siniestros",
        element: (
          <ProtectedRoute>
            <SiniestroConductorView />
          </ProtectedRoute>
        ),
      },
      // USUARIOS
      {
        path: "usuarios",
        element: <div style={{ padding: 32 }}>Usuarios (próximamente)</div>,
      },
      {
        path: "usuarios/:id",
        element: <div style={{ padding: 32 }}>Detalle de usuario (próximamente)</div>,
      },
      // REPORTES
      {
        path: "reportes",
        element: <div style={{ padding: 32 }}>Reportes (próximamente)</div>,
      },
      // CONFIGURACIÓN
      {
        path: "configuracion",
        element: <div style={{ padding: 32 }}>Configuración (próximamente)</div>,
      },
    ],
  },
]);