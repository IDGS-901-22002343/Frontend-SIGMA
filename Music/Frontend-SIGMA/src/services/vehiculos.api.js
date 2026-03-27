const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5086/api";

export const VehiculosAPI = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/vehiculos`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Error al obtener vehículos");
    return res.json();
  },

  cambiarEstatus: async (id, estatus) => {
    const res = await fetch(`${API_URL}/vehiculos/${id}/estatus`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ estatus }),
    });
    if (!res.ok) throw new Error("Error al cambiar estatus");
    return res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${API_URL}/vehiculos/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Error al obtener vehículo");
    return res.json();
  },

  create: async (data) => {
    const res = await fetch(`${API_URL}/vehiculos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al crear vehículo");
    return res.json();
  },

  update: async (id, data) => {
    const res = await fetch(`${API_URL}/vehiculos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al actualizar vehículo");
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API_URL}/vehiculos/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Error al eliminar vehículo");
    return res.json();
  },
};