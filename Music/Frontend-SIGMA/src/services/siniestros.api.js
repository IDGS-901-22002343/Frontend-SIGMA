const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5086/api";

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export const SiniestrosAPI = {
  // ============ SINIESTROS ============
  getAll: async (filtros = {}) => {
    const params = new URLSearchParams();
    if (filtros.vehiculoId) params.append('vehiculoId', filtros.vehiculoId);
    if (filtros.conductorId) params.append('conductorId', filtros.conductorId);
    if (filtros.estatusId) params.append('estatusId', filtros.estatusId);
    if (filtros.desde) params.append('desde', filtros.desde);
    if (filtros.hasta) params.append('hasta', filtros.hasta);
    
    const url = `${API_URL}/siniestros${params.toString() ? `?${params}` : ''}`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error('Error al obtener siniestros');
    return res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${API_URL}/siniestros/${id}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Error al obtener siniestro');
    return res.json();
  },

  getByVehiculo: async (vehiculoId) => {
    const res = await fetch(`${API_URL}/siniestros/vehiculo/${vehiculoId}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Error al obtener siniestros del vehículo');
    return res.json();
  },

  getByConductor: async (conductorId) => {
    const res = await fetch(`${API_URL}/siniestros/conductor/${conductorId}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Error al obtener siniestros del conductor');
    return res.json();
  },

  create: async (data) => {
    const res = await fetch(`${API_URL}/siniestros`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al crear siniestro');
    return res.json();
  },

  update: async (id, data) => {
    const res = await fetch(`${API_URL}/siniestros/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al actualizar siniestro');
    return res.json();
  },

  cambiarEstatus: async (id, idEstatus) => {
    const res = await fetch(`${API_URL}/siniestros/${id}/estatus`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ idEstatus })
    });
    if (!res.ok) throw new Error('Error al cambiar estatus');
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API_URL}/siniestros/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Error al eliminar siniestro');
    return res.json();
  },

  // ============ EVIDENCIAS ============
  getEvidencias: async (siniestroId) => {
    const res = await fetch(`${API_URL}/siniestros/${siniestroId}/evidencias`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Error al obtener evidencias');
    return res.json();
  },

  addEvidencia: async (siniestroId, data) => {
    const res = await fetch(`${API_URL}/siniestros/${siniestroId}/evidencias`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al agregar evidencia');
    return res.json();
  },

  deleteEvidencia: async (siniestroId, evidenciaId) => {
    const res = await fetch(`${API_URL}/siniestros/${siniestroId}/evidencias/${evidenciaId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Error al eliminar evidencia');
    return res.json();
  },

  // ============ ESTATUS ============
  getEstatus: async () => {
    const res = await fetch(`${API_URL}/siniestros/estatus`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Error al obtener estatus');
    return res.json();
  },

  // ============ ESTADÍSTICAS ============
  getEstadisticas: async () => {
    const res = await fetch(`${API_URL}/siniestros/estadisticas/general`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Error al obtener estadísticas');
    return res.json();
  }
};