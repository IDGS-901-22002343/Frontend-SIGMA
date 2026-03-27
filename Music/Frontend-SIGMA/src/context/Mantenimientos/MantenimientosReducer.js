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

export const MantenimientosReducer = (state, action) => {
  switch (action.type) {
    case MANTENIMIENTOS_LOADING:
      return { ...state, loading: true };

    case MANTENIMIENTOS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload || "Error en mantenimientos",
      };

    case CLEAR_MANTENIMIENTOS_ERROR:
      return { ...state, error: null };

    // Mantenimientos
    case GET_MANTENIMIENTOS_SUCCESS:
      return {
        ...state,
        loading: false,
        mantenimientos: action.payload || [],
      };

    case GET_MANTENIMIENTO_SUCCESS:
      return {
        ...state,
        loading: false,
        mantenimiento: action.payload,
      };

    case CREATE_MANTENIMIENTO_SUCCESS:
      return {
        ...state,
        loading: false,
        mantenimientos: [...state.mantenimientos, action.payload],
      };

    case UPDATE_MANTENIMIENTO_SUCCESS:
      return {
        ...state,
        loading: false,
        mantenimientos: state.mantenimientos.map((m) =>
          m.idMantenimiento === action.payload.idMantenimiento ? action.payload : m
        ),
      };

    case DELETE_MANTENIMIENTO_SUCCESS:
      return {
        ...state,
        loading: false,
        mantenimientos: state.mantenimientos.filter(
          (m) => m.idMantenimiento !== action.payload
        ),
      };

    case SET_SELECTED_MANTENIMIENTO:
      return {
        ...state,
        selectedMantenimiento: action.payload,
      };

    // Tipos de mantenimiento
    case GET_TIPOS_SUCCESS:
      return {
        ...state,
        loading: false,
        tiposMantenimiento: action.payload || [],
      };

    case CREATE_TIPO_SUCCESS:
      return {
        ...state,
        loading: false,
        tiposMantenimiento: [...state.tiposMantenimiento, action.payload],
      };

    case UPDATE_TIPO_SUCCESS:
      return {
        ...state,
        loading: false,
        tiposMantenimiento: state.tiposMantenimiento.map((t) =>
          t.idTipo === action.payload.idTipo ? action.payload : t
        ),
      };

    case DELETE_TIPO_SUCCESS:
      return {
        ...state,
        loading: false,
        tiposMantenimiento: state.tiposMantenimiento.filter(
          (t) => t.idTipo !== action.payload
        ),
      };

    case SET_SELECTED_TIPO:
      return {
        ...state,
        selectedTipo: action.payload,
      };

    // Proveedores
    case GET_PROVEEDORES_SUCCESS:
      return {
        ...state,
        loading: false,
        proveedores: action.payload || [],
      };

    case CREATE_PROVEEDOR_SUCCESS:
      return {
        ...state,
        loading: false,
        proveedores: [...state.proveedores, action.payload],
      };

    case UPDATE_PROVEEDOR_SUCCESS:
      return {
        ...state,
        loading: false,
        proveedores: state.proveedores.map((p) =>
          p.idProveedor === action.payload.idProveedor ? action.payload : p
        ),
      };

    case DELETE_PROVEEDOR_SUCCESS:
      return {
        ...state,
        loading: false,
        proveedores: state.proveedores.filter(
          (p) => p.idProveedor !== action.payload
        ),
      };

    case SET_SELECTED_PROVEEDOR:
      return {
        ...state,
        selectedProveedor: action.payload,
      };

    default:
      return state;
  }
};