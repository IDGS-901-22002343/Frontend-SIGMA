import {
  VEHICULOS_LOADING,
  VEHICULOS_ERROR,
  CLEAR_VEHICULOS_ERROR,
  GET_VEHICULOS_SUCCESS,
  GET_VEHICULO_SUCCESS,
  SET_SELECTED_VEHICULO,
  CREATE_VEHICULO_SUCCESS,
  UPDATE_VEHICULO_SUCCESS,
  DELETE_VEHICULO_SUCCESS,
} from "./ActionsTypes";

export const VehiculosReducer = (state, action) => {
  switch (action.type) {
    case VEHICULOS_LOADING:
      return { ...state, loading: true };

    case VEHICULOS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload || "Error en vehículos",
      };

    case CLEAR_VEHICULOS_ERROR:
      return { ...state, error: null };

    case GET_VEHICULOS_SUCCESS:
      return {
        ...state,
        loading: false,
        vehiculos: action.payload || [],
      };

    case GET_VEHICULO_SUCCESS:
      return {
        ...state,
        loading: false,
        vehiculo: action.payload,
      };

    case SET_SELECTED_VEHICULO:
      return {
        ...state,
        selectedVehiculo: action.payload,
      };

    case CREATE_VEHICULO_SUCCESS:
      return {
        ...state,
        loading: false,
        vehiculos: [...state.vehiculos, action.payload],
      };

    case UPDATE_VEHICULO_SUCCESS:
      return {
        ...state,
        loading: false,
        vehiculos: state.vehiculos.map((v) =>
          v.idVehiculo === action.payload.idVehiculo ? action.payload : v
        ),
      };

    case DELETE_VEHICULO_SUCCESS:
      return {
        ...state,
        loading: false,
        vehiculos: state.vehiculos.filter(
          (v) => v.idVehiculo !== action.payload
        ),
      };

    default:
      return state;
  }
};