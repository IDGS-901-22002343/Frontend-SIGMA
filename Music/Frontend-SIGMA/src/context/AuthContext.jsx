import React, { createContext, useState, useContext, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5086/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};

// Decodifica el payload del JWT sin librería externa
function decodeJWT(token) {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    // Verifica que el token no haya expirado
    if (decoded.exp && decoded.exp * 1000 < Date.now()) return null;
    
    // 🔥 EXTRAE EL ID CORRECTAMENTE (nameidentifier es el claim del ID)
    const nameIdentifier = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    
    return {
      ...decoded,
      id: nameIdentifier, // 👈 MAPEA EL CLAIM AL ID
      idUsuario: nameIdentifier // 👈 TAMBIÉN POR SI ACASO
    };
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded) {
        // Reconstruye el usuario desde el payload del JWT
        setUser({
          id:       decoded.id,  // 👈 AHORA VIENE DEL DECODIFICADOR
          nombre:   decoded.nombre    || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "",
          apellidoP:decoded.apellidoP || "",
          correo:   decoded.correo    || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || "",
          rol:      decoded.rol       || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "",
          idRol:    decoded.IdRol,
          tipoUsuario: decoded.tipoUsuario || "Administrador",
        });
      } else {
        // Token expirado o inválido
        localStorage.removeItem("token");
        setToken(null);
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (correo, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, password })
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || "Error al iniciar sesión" };
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      
      // Decodifica el token para obtener el ID real
      const decoded = decodeJWT(data.token);
      
      setUser({
        id: data.idUsuario || decoded?.id,  // 👈 USA EL ID DEL TOKEN
        nombre: data.nombre,
        apellidoP: data.apellidoP || "",
        correo: data.correo,
        rol: data.rol,
        idRol: data.idRol,
        tipoUsuario: data.tipoUsuario || data.rol || "Administrador",
      });

      return { success: true };
    } catch (error) {
      console.error("Error en login:", error);
      return { success: false, error: "Error de conexión" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const hasRole = (roles) => {
    if (!user) return false;
    return roles.includes(user.rol) || roles.includes(user.idRol);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, hasRole, token }}>
      {children}
    </AuthContext.Provider>
  );
};