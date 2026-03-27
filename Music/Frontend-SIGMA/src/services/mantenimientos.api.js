const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5086/api";

export const MantenimientosAPI = {
  // ============ MANTENIMIENTOS ============
  getAll: async (vehiculoId = null) => {
    const url = vehiculoId 
      ? `${API_URL}/mantenimientos?vehiculoId=${vehiculoId}`
      : `${API_URL}/mantenimientos`;
    
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Error al obtener mantenimientos");
    return res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${API_URL}/mantenimientos/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Error al obtener mantenimiento");
    return res.json();
  },

  getByVehiculo: async (vehiculoId) => {
    const res = await fetch(`${API_URL}/mantenimientos/vehiculo/${vehiculoId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Error al obtener mantenimientos del vehículo");
    return res.json();
  },

  create: async (data) => {
    const res = await fetch(`${API_URL}/mantenimientos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al crear mantenimiento");
    return res.json();
  },

  update: async (id, data) => {
    const res = await fetch(`${API_URL}/mantenimientos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al actualizar mantenimiento");
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API_URL}/mantenimientos/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Error al eliminar mantenimiento");
    return res.json();
  },

  // ============ TIPOS DE MANTENIMIENTO ============
  getTipos: async () => {
    const res = await fetch(`${API_URL}/mantenimientos/tipos`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Error al obtener tipos de mantenimiento");
    return res.json();
  },

  getTipoById: async (id) => {
    const res = await fetch(`${API_URL}/mantenimientos/tipos/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Error al obtener tipo de mantenimiento");
    return res.json();
  },

  createTipo: async (data) => {
    const res = await fetch(`${API_URL}/mantenimientos/tipos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al crear tipo de mantenimiento");
    return res.json();
  },

  updateTipo: async (id, data) => {
    const res = await fetch(`${API_URL}/mantenimientos/tipos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al actualizar tipo de mantenimiento");
    return res.json();
  },

  deleteTipo: async (id) => {
    const res = await fetch(`${API_URL}/mantenimientos/tipos/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Error al eliminar tipo de mantenimiento");
    return res.json();
  },

  // ============ PROVEEDORES ============
  getProveedores: async () => {
    const res = await fetch(`${API_URL}/mantenimientos/proveedores`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Error al obtener proveedores");
    return res.json();
  },

  getProveedorById: async (id) => {
    const res = await fetch(`${API_URL}/mantenimientos/proveedores/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Error al obtener proveedor");
    return res.json();
  },

  createProveedor: async (data) => {
    const res = await fetch(`${API_URL}/mantenimientos/proveedores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al crear proveedor");
    return res.json();
  },

  updateProveedor: async (id, data) => {
    const res = await fetch(`${API_URL}/mantenimientos/proveedores/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al actualizar proveedor");
    return res.json();
  },

  deleteProveedor: async (id) => {
    const res = await fetch(`${API_URL}/mantenimientos/proveedores/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Error al eliminar proveedor");
    return res.json();
  },
};