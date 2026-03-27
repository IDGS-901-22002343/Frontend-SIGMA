import { createContext, useContext } from "react";

const VehiculosContext = createContext(null);

export default VehiculosContext;

export const useVehiculos = () => {
  const ctx = useContext(VehiculosContext);
  if (!ctx) {
    throw new Error("useVehiculos debe usarse dentro de <VehiculosState>");
  }
  return ctx;
};