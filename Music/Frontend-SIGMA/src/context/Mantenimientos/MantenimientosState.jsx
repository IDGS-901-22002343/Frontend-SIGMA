import { useCallback, useMemo, useReducer } from "react";
import MantenimientosContext from "./MantenimientosContext";
import { MantenimientosReducer } from "./MantenimientosReducer";
import {
  MANTENIMIENTOS_LOADING,
  MANTENIMIENTOS_ERROR,
  CLEAR_MANTENIMIENTOS_ERROR,
  GET_MANTENIMIENTOS_SUCCESS,
  GET_MANTENIMIENTO_SUCCESS,
  CREATE_MANTENIMIENTO_SUCCESS,
  UPDATE_MANTENIMIENTO_SUCCESS,
  DELETE_MANTENIMIENTO_SUCCESS,
  GET_TIPOS_SUCCESS,
  CREATE_TIPO_SUCCESS,
  UPDATE_TIPO_SUCCESS,
  DELETE_TIPO_SUCCESS,
  GET_PROVEEDORES_SUCCESS,
  CREATE_PROVEEDOR_SUCCESS,
  UPDATE_PROVEEDOR_SUCCESS,
  DELETE_PROVEEDOR_SUCCESS,
  SET_SELECTED_MANTENIMIENTO,
  SET_SELECTED_TIPO,
  SET_SELECTED_PROVEEDOR,
} from "./ActionsTypes";
import { MantenimientosAPI } from "../../services/mantenimientos.api";

const initialState = {
  mantenimientos: [],
  mantenimiento: null,
  tiposMantenimiento: [],
  proveedores: [],
  selectedMantenimiento: null,
  selectedTipo: null,
  selectedProveedor: null,
  loading: false,
  error: null,
};

const MantenimientosState = ({ children }) => {
  const [state, dispatch] = useReducer(MantenimientosReducer, initialState);

  const setLoading = useCallback(
    () => dispatch({ type: MANTENIMIENTOS_LOADING }),
    []
  );

  const setError = useCallback(
    (message) => dispatch({ type: MANTENIMIENTOS_ERROR, payload: message }),
    []
  );

  const clearError = useCallback(
    () => dispatch({ type: CLEAR_MANTENIMIENTOS_ERROR }),
    []
  );

  // ============ MANTENIMIENTOS ============

  const cargarMantenimientos = useCallback(
    async (vehiculoId = null) => {
      try {
        setLoading();
        const data = await MantenimientosAPI.getAll(vehiculoId);
        dispatch({ type: GET_MANTENIMIENTOS_SUCCESS, payload: data });
      } catch (err) {
        setError(err.message || "Error al cargar mantenimientos");
      }
    },
    [setLoading, setError]
  );

  const cargarMantenimiento = useCallback(
    async (id) => {
      try {
        setLoading();
        const data = await MantenimientosAPI.getById(id);
        dispatch({ type: GET_MANTENIMIENTO_SUCCESS, payload: data });
        return data;
      } catch (err) {
        setError(err.message || "Error al cargar mantenimiento");
      }
    },
    [setLoading, setError]
  );

  const crearMantenimiento = useCallback(
    async (payload) => {
      try {
        setLoading();
        const res = await MantenimientosAPI.create(payload);
        const fullData = await MantenimientosAPI.getById(res.id);
        dispatch({ type: CREATE_MANTENIMIENTO_SUCCESS, payload: fullData });
        return fullData;
      } catch (err) {
        setError(err.message || "Error al crear mantenimiento");
        throw err;
      }
    },
    [setLoading, setError]
  );

  const actualizarMantenimiento = useCallback(
    async (id, payload) => {
      try {
        setLoading();
        await MantenimientosAPI.update(id, payload);
        const fullData = await MantenimientosAPI.getById(id);
        dispatch({ type: UPDATE_MANTENIMIENTO_SUCCESS, payload: fullData });
        return fullData;
      } catch (err) {
        setError(err.message || "Error al actualizar mantenimiento");
        throw err;
      }
    },
    [setLoading, setError]
  );

  const eliminarMantenimiento = useCallback(
    async (id) => {
      try {
        setLoading();
        await MantenimientosAPI.delete(id);
        dispatch({ type: DELETE_MANTENIMIENTO_SUCCESS, payload: id });
      } catch (err) {
        setError(err.message || "Error al eliminar mantenimiento");
        throw err;
      }
    },
    [setLoading, setError]
  );

  const seleccionarMantenimiento = useCallback(
    (mantenimiento) =>
      dispatch({ type: SET_SELECTED_MANTENIMIENTO, payload: mantenimiento }),
    []
  );

  // ============ TIPOS DE MANTENIMIENTO ============

  const cargarTipos = useCallback(async () => {
    try {
      setLoading();
      const data = await MantenimientosAPI.getTipos();
      dispatch({ type: GET_TIPOS_SUCCESS, payload: data });
    } catch (err) {
      setError(err.message || "Error al cargar tipos de mantenimiento");
    }
  }, [setLoading, setError]);

  const crearTipo = useCallback(
    async (payload) => {
      try {
        setLoading();
        const res = await MantenimientosAPI.createTipo(payload);
        const fullData = await MantenimientosAPI.getTipoById(res.id);
        dispatch({ type: CREATE_TIPO_SUCCESS, payload: fullData });
        return fullData;
      } catch (err) {
        setError(err.message || "Error al crear tipo de mantenimiento");
        throw err;
      }
    },
    [setLoading, setError]
  );

  const actualizarTipo = useCallback(
    async (id, payload) => {
      try {
        setLoading();
        await MantenimientosAPI.updateTipo(id, payload);
        const fullData = await MantenimientosAPI.getTipoById(id);
        dispatch({ type: UPDATE_TIPO_SUCCESS, payload: fullData });
        return fullData;
      } catch (err) {
        setError(err.message || "Error al actualizar tipo de mantenimiento");
        throw err;
      }
    },
    [setLoading, setError]
  );

  const eliminarTipo = useCallback(
    async (id) => {
      try {
        setLoading();
        await MantenimientosAPI.deleteTipo(id);
        dispatch({ type: DELETE_TIPO_SUCCESS, payload: id });
      } catch (err) {
        setError(err.message || "Error al eliminar tipo de mantenimiento");
        throw err;
      }
    },
    [setLoading, setError]
  );

  const seleccionarTipo = useCallback(
    (tipo) => dispatch({ type: SET_SELECTED_TIPO, payload: tipo }),
    []
  );

  // ============ PROVEEDORES ============

  const cargarProveedores = useCallback(async () => {
    try {
      setLoading();
      const data = await MantenimientosAPI.getProveedores();
      dispatch({ type: GET_PROVEEDORES_SUCCESS, payload: data });
    } catch (err) {
      setError(err.message || "Error al cargar proveedores");
    }
  }, [setLoading, setError]);

  const crearProveedor = useCallback(
    async (payload) => {
      try {
        setLoading();
        const res = await MantenimientosAPI.createProveedor(payload);
        const fullData = await MantenimientosAPI.getProveedorById(res.id);
        dispatch({ type: CREATE_PROVEEDOR_SUCCESS, payload: fullData });
        return fullData;
      } catch (err) {
        setError(err.message || "Error al crear proveedor");
        throw err;
      }
    },
    [setLoading, setError]
  );

  const actualizarProveedor = useCallback(
    async (id, payload) => {
      try {
        setLoading();
        await MantenimientosAPI.updateProveedor(id, payload);
        const fullData = await MantenimientosAPI.getProveedorById(id);
        dispatch({ type: UPDATE_PROVEEDOR_SUCCESS, payload: fullData });
        return fullData;
      } catch (err) {
        setError(err.message || "Error al actualizar proveedor");
        throw err;
      }
    },
    [setLoading, setError]
  );

  const eliminarProveedor = useCallback(
    async (id) => {
      try {
        setLoading();
        await MantenimientosAPI.deleteProveedor(id);
        dispatch({ type: DELETE_PROVEEDOR_SUCCESS, payload: id });
      } catch (err) {
        setError(err.message || "Error al eliminar proveedor");
        throw err;
      }
    },
    [setLoading, setError]
  );

  const seleccionarProveedor = useCallback(
    (proveedor) =>
      dispatch({ type: SET_SELECTED_PROVEEDOR, payload: proveedor }),
    []
  );

  const value = useMemo(
    () => ({
      // Mantenimientos
      mantenimientos: state.mantenimientos,
      mantenimiento: state.mantenimiento,
      selectedMantenimiento: state.selectedMantenimiento,
      cargarMantenimientos,
      cargarMantenimiento,
      crearMantenimiento,
      actualizarMantenimiento,
      eliminarMantenimiento,
      seleccionarMantenimiento,

      // Tipos
      tiposMantenimiento: state.tiposMantenimiento,
      selectedTipo: state.selectedTipo,
      cargarTipos,
      crearTipo,
      actualizarTipo,
      eliminarTipo,
      seleccionarTipo,

      // Proveedores
      proveedores: state.proveedores,
      selectedProveedor: state.selectedProveedor,
      cargarProveedores,
      crearProveedor,
      actualizarProveedor,
      eliminarProveedor,
      seleccionarProveedor,

      loading: state.loading,
      error: state.error,
      clearError,
    }),
    [state, cargarMantenimientos, cargarMantenimiento, crearMantenimiento, actualizarMantenimiento, eliminarMantenimiento, seleccionarMantenimiento, cargarTipos, crearTipo, actualizarTipo, eliminarTipo, seleccionarTipo, cargarProveedores, crearProveedor, actualizarProveedor, eliminarProveedor, seleccionarProveedor, clearError]
  );

  return (
    <MantenimientosContext.Provider value={value}>
      {children}
    </MantenimientosContext.Provider>
  );
};

export default MantenimientosState;