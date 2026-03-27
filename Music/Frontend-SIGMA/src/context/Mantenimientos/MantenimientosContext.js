import { createContext, useContext } from "react";

const MantenimientosContext = createContext(null);

export default MantenimientosContext;

export const useMantenimientos = () => {
  const ctx = useContext(MantenimientosContext);
  if (!ctx) {
    throw new Error("useMantenimientos debe usarse dentro de <MantenimientosState>");
  }
  return ctx;
};