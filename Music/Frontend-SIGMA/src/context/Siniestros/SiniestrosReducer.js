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

export const SiniestrosReducer = (state, action) => {
  switch (action.type) {
    case SINIESTROS_LOADING:
      return { ...state, loading: true };

    case SINIESTROS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload || "Error en siniestros",
      };

    case CLEAR_SINIESTROS_ERROR:
      return { ...state, error: null };

    // Siniestros
    case GET_SINIESTROS_SUCCESS:
      return {
        ...state,
        loading: false,
        siniestros: action.payload || [],
      };

    case GET_SINIESTRO_SUCCESS:
      return {
        ...state,
        loading: false,
        siniestro: action.payload,
        evidencias: action.payload?.evidencias || [],
      };

    case CREATE_SINIESTRO_SUCCESS:
      return {
        ...state,
        loading: false,
        siniestros: [action.payload, ...state.siniestros],
      };

    case UPDATE_SINIESTRO_SUCCESS:
      return {
        ...state,
        loading: false,
        siniestros: state.siniestros.map(s =>
          s.idSiniestro === action.payload.idSiniestro ? action.payload : s
        ),
        siniestro: action.payload,
      };

    case CAMBIAR_ESTATUS_SINIESTRO_SUCCESS:
      return {
        ...state,
        loading: false,
        siniestros: state.siniestros.map(s =>
          s.idSiniestro === action.payload.id
            ? { ...s, idEstatus: action.payload.idEstatus, estatusNombre: action.payload.estatusNombre }
            : s
        ),
        siniestro: state.siniestro?.idSiniestro === action.payload.id
          ? { ...state.siniestro, idEstatus: action.payload.idEstatus, estatusNombre: action.payload.estatusNombre }
          : state.siniestro
      };

    case DELETE_SINIESTRO_SUCCESS:
      return {
        ...state,
        loading: false,
        siniestros: state.siniestros.filter(s => s.idSiniestro !== action.payload),
      };

    // Evidencias
    case GET_EVIDENCIAS_SUCCESS:
      return {
        ...state,
        loading: false,
        evidencias: action.payload || [],
      };

    case ADD_EVIDENCIA_SUCCESS:
      return {
        ...state,
        loading: false,
        evidencias: [action.payload, ...state.evidencias],
        siniestro: state.siniestro
          ? {
              ...state.siniestro,
              evidencias: [action.payload, ...(state.siniestro.evidencias || [])]
            }
          : state.siniestro
      };

    case DELETE_EVIDENCIA_SUCCESS:
      return {
        ...state,
        loading: false,
        evidencias: state.evidencias.filter(e => e.idEvidencia !== action.payload),
        siniestro: state.siniestro
          ? {
              ...state.siniestro,
              evidencias: (state.siniestro.evidencias || []).filter(e => e.idEvidencia !== action.payload)
            }
          : state.siniestro
      };

    // Estatus
    case GET_ESTATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        estatusSiniestros: action.payload || [],
      };

    // Estadísticas
    case GET_ESTADISTICAS_SUCCESS:
      return {
        ...state,
        loading: false,
        estadisticas: action.payload || {},
      };

    // Selected
    case SET_SELECTED_SINIESTRO:
      return {
        ...state,
        selectedSiniestro: action.payload,
      };

    case SET_SELECTED_ESTATUS:
      return {
        ...state,
        selectedEstatus: action.payload,
      };

    default:
      return state;
  }
};