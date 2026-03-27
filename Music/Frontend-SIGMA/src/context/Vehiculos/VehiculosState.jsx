import { useCallback, useMemo, useReducer } from "react";
import VehiculosContext from "./VehiculosContext";
import { VehiculosReducer } from "./VehiculosReducer";
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
import { VehiculosAPI } from "../../services/vehiculos.api.js";

const initialState = {
  vehiculos: [],
  vehiculo: null,
  selectedVehiculo: null,
  loading: false,
  error: null,
};

const VehiculosState = ({ children }) => {
  const [state, dispatch] = useReducer(VehiculosReducer, initialState);

  const setLoading = useCallback(
    () => dispatch({ type: VEHICULOS_LOADING }),
    []
  );

  const setError = useCallback(
    (message) => dispatch({ type: VEHICULOS_ERROR, payload: message }),
    []
  );

  const clearError = useCallback(
    () => dispatch({ type: CLEAR_VEHICULOS_ERROR }),
    []
  );

  const cargarVehiculos = useCallback(async () => {
    try {
      setLoading();
      const data = await VehiculosAPI.getAll();
      dispatch({ type: GET_VEHICULOS_SUCCESS, payload: data });
    } catch (err) {
      setError(err.message || "Error al cargar vehículos");
    }
  }, [setLoading, setError]);

  const cargarVehiculo = useCallback(
    async (id) => {
      try {
        setLoading();
        const data = await VehiculosAPI.getById(id);
        dispatch({ type: GET_VEHICULO_SUCCESS, payload: data });
        return data;
      } catch (err) {
        setError(err.message || "Error al cargar vehículo");
      }
    },
    [setLoading, setError]
  );

  const seleccionarVehiculo = useCallback(
    (vehiculo) => dispatch({ type: SET_SELECTED_VEHICULO, payload: vehiculo }),
    []
  );

  const crearVehiculo = useCallback(
    async (payload) => {
      try {
        setLoading();
        const res = await VehiculosAPI.create(payload);
        const fullVehiculo = await VehiculosAPI.getById(res.id);
        dispatch({ type: CREATE_VEHICULO_SUCCESS, payload: fullVehiculo });
        return fullVehiculo;
      } catch (err) {
        setError(err.message || "Error al crear vehículo");
        throw err;
      }
    },
    [setLoading, setError]
  );

  const actualizarVehiculo = useCallback(
    async (id, payload) => {
      try {
        setLoading();
        await VehiculosAPI.update(id, payload);
        const fullVehiculo = await VehiculosAPI.getById(id);
        dispatch({ type: UPDATE_VEHICULO_SUCCESS, payload: fullVehiculo });
        return fullVehiculo;
      } catch (err) {
        setError(err.message || "Error al actualizar vehículo");
        throw err;
      }
    },
    [setLoading, setError]
  );

  const eliminarVehiculo = useCallback(
    async (id) => {
      try {
        setLoading();
        await VehiculosAPI.delete(id);
        dispatch({ type: DELETE_VEHICULO_SUCCESS, payload: id });
      } catch (err) {
        setError(err.message || "Error al eliminar vehículo");
        throw err;
      }
    },
    [setLoading, setError]
  );

  const value = useMemo(
    () => ({
      vehiculos: state.vehiculos,
      vehiculo: state.vehiculo,
      selectedVehiculo: state.selectedVehiculo,
      loading: state.loading,
      error: state.error,
      cargarVehiculos,
      cargarVehiculo,
      seleccionarVehiculo,
      crearVehiculo,
      actualizarVehiculo,
      eliminarVehiculo,
      clearError,
    }),
    [
      state.vehiculos,
      state.vehiculo,
      state.selectedVehiculo,
      state.loading,
      state.error,
    ]
  );

  return (
    <VehiculosContext.Provider value={value}>
      {children}
    </VehiculosContext.Provider>
  );
};

export default VehiculosState;