import { createContext, useContext } from "react";

const SiniestrosContext = createContext(null);

export default SiniestrosContext;

export const useSiniestros = () => {
  const ctx = useContext(SiniestrosContext);
  if (!ctx) {
    throw new Error("useSiniestros debe usarse dentro de <SiniestrosState>");
  }
  return ctx;
};