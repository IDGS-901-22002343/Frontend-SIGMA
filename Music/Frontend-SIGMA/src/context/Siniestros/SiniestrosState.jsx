import { useCallback, useMemo, useReducer } from "react";
import SiniestrosContext from "./SiniestrosContext";
import { SiniestrosReducer } from "./SiniestrosReducer";
import {
  SINIESTROS_LOADING,
  SINIESTROS_ERROR,
  CLEAR_SINIESTROS_ERROR,
  GET_SINIESTROS_SUCCESS,
  GET_SINIESTRO_SUCCESS,
  CREATE_SINIESTRO_SUCCESS,
  UPDATE_SINIESTRO_SUCCESS,
  DELETE_SINIESTRO_SUCCESS,
  CAMBIAR_ESTATUS_SINIESTRO_SUCCESS,
  GET_EVIDENCIAS_SUCCESS,
  ADD_EVIDENCIA_SUCCESS,
  DELETE_EVIDENCIA_SUCCESS,
  GET_ESTATUS_SUCCESS,
  GET_ESTADISTICAS_SUCCESS,
  SET_SELECTED_SINIESTRO,
  SET_SELECTED_ESTATUS,
} from "./ActionsTypes";
import { SiniestrosAPI } from "../../services/siniestros.api";

const initialState = {
  siniestros: [],
  siniestro: null,
  evidencias: [],
  estatusSiniestros: [],
  estadisticas: {},
  selectedSiniestro: null,
  selectedEstatus: null,
  loading: false,
  error: null,
};

const SiniestrosState = ({ children }) => {
  const [state, dispatch] = useReducer(SiniestrosReducer, initialState);

  const setLoading = useCallback(() => dispatch({ type: SINIESTROS_LOADING }), []);
  const setError = useCallback((message) => dispatch({ type: SINIESTROS_ERROR, payload: message }), []);
  const clearError = useCallback(() => dispatch({ type: CLEAR_SINIESTROS_ERROR }), []);

  // ============ SINIESTROS ============
  const cargarSiniestros = useCallback(async (filtros = {}) => {
    try {
      setLoading();
      const data = await SiniestrosAPI.getAll(filtros);
      dispatch({ type: GET_SINIESTROS_SUCCESS, payload: data });
    } catch (err) {
      setError(err.message || "Error al cargar siniestros");
    }
  }, [setLoading, setError]);

  const cargarSiniestro = useCallback(async (id) => {
    try {
      setLoading();
      const data = await SiniestrosAPI.getById(id);
      dispatch({ type: GET_SINIESTRO_SUCCESS, payload: data });
      return data;
    } catch (err) {
      setError(err.message || "Error al cargar siniestro");
    }
  }, [setLoading, setError]);

  const crearSiniestro = useCallback(async (payload) => {
    try {
      setLoading();
      const res = await SiniestrosAPI.create(payload);
      const fullData = await SiniestrosAPI.getById(res.id);
      dispatch({ type: CREATE_SINIESTRO_SUCCESS, payload: fullData });
      return fullData;
    } catch (err) {
      setError(err.message || "Error al crear siniestro");
      throw err;
    }
  }, [setLoading, setError]);

  const actualizarSiniestro = useCallback(async (id, payload) => {
    try {
      setLoading();
      await SiniestrosAPI.update(id, payload);
      const fullData = await SiniestrosAPI.getById(id);
      dispatch({ type: UPDATE_SINIESTRO_SUCCESS, payload: fullData });
      return fullData;
    } catch (err) {
      setError(err.message || "Error al actualizar siniestro");
      throw err;
    }
  }, [setLoading, setError]);

  const cambiarEstatusSiniestro = useCallback(async (id, idEstatus) => {
    try {
      setLoading();
      const res = await SiniestrosAPI.cambiarEstatus(id, idEstatus);
      dispatch({
        type: CAMBIAR_ESTATUS_SINIESTRO_SUCCESS,
        payload: { id, idEstatus, estatusNombre: res.estatusNombre }
      });
      return res;
    } catch (err) {
      setError(err.message || "Error al cambiar estatus");
      throw err;
    }
  }, [setLoading, setError]);

  const eliminarSiniestro = useCallback(async (id) => {
    try {
      setLoading();
      await SiniestrosAPI.delete(id);
      dispatch({ type: DELETE_SINIESTRO_SUCCESS, payload: id });
    } catch (err) {
      setError(err.message || "Error al eliminar siniestro");
      throw err;
    }
  }, [setLoading, setError]);

  // ============ EVIDENCIAS ============
  const cargarEvidencias = useCallback(async (siniestroId) => {
    try {
      setLoading();
      const data = await SiniestrosAPI.getEvidencias(siniestroId);
      dispatch({ type: GET_EVIDENCIAS_SUCCESS, payload: data });
    } catch (err) {
      setError(err.message || "Error al cargar evidencias");
    }
  }, [setLoading, setError]);

  const agregarEvidencia = useCallback(async (siniestroId, payload) => {
    try {
      setLoading();
      const res = await SiniestrosAPI.addEvidencia(siniestroId, payload);
      dispatch({ type: ADD_EVIDENCIA_SUCCESS, payload: { ...payload, idEvidencia: res.id } });
      return res;
    } catch (err) {
      setError(err.message || "Error al agregar evidencia");
      throw err;
    }
  }, [setLoading, setError]);

  const eliminarEvidencia = useCallback(async (siniestroId, evidenciaId) => {
    try {
      setLoading();
      await SiniestrosAPI.deleteEvidencia(siniestroId, evidenciaId);
      dispatch({ type: DELETE_EVIDENCIA_SUCCESS, payload: evidenciaId });
    } catch (err) {
      setError(err.message || "Error al eliminar evidencia");
      throw err;
    }
  }, [setLoading, setError]);

  // ============ ESTATUS ============
  const cargarEstatus = useCallback(async () => {
    try {
      setLoading();
      const data = await SiniestrosAPI.getEstatus();
      dispatch({ type: GET_ESTATUS_SUCCESS, payload: data });
    } catch (err) {
      setError(err.message || "Error al cargar estatus");
    }
  }, [setLoading, setError]);

  // ============ ESTADÍSTICAS ============
  const cargarEstadisticas = useCallback(async () => {
    try {
      setLoading();
      const data = await SiniestrosAPI.getEstadisticas();
      dispatch({ type: GET_ESTADISTICAS_SUCCESS, payload: data });
    } catch (err) {
      setError(err.message || "Error al cargar estadísticas");
    }
  }, [setLoading, setError]);

  // ============ SELECTED ============
  const seleccionarSiniestro = useCallback((siniestro) =>
    dispatch({ type: SET_SELECTED_SINIESTRO, payload: siniestro }), []);

  const seleccionarEstatus = useCallback((estatus) =>
    dispatch({ type: SET_SELECTED_ESTATUS, payload: estatus }), []);

  const value = useMemo(() => ({
    // Siniestros
    siniestros: state.siniestros,
    siniestro: state.siniestro,
    selectedSiniestro: state.selectedSiniestro,
    cargarSiniestros,
    cargarSiniestro,
    crearSiniestro,
    actualizarSiniestro,
    cambiarEstatusSiniestro,
    eliminarSiniestro,
    seleccionarSiniestro,

    // Evidencias
    evidencias: state.evidencias,
    cargarEvidencias,
    agregarEvidencia,
    eliminarEvidencia,

    // Estatus
    estatusSiniestros: state.estatusSiniestros,
    selectedEstatus: state.selectedEstatus,
    cargarEstatus,
    seleccionarEstatus,

    // Estadísticas
    estadisticas: state.estadisticas,
    cargarEstadisticas,

    loading: state.loading,
    error: state.error,
    clearError,
  }), [state, cargarSiniestros, cargarSiniestro, crearSiniestro, actualizarSiniestro,
      cambiarEstatusSiniestro, eliminarSiniestro, seleccionarSiniestro,
      cargarEvidencias, agregarEvidencia, eliminarEvidencia,
      cargarEstatus, seleccionarEstatus, cargarEstadisticas, clearError]);

  return (
    <SiniestrosContext.Provider value={value}>
      {children}
    </SiniestrosContext.Provider>
  );
};

export default SiniestrosState;