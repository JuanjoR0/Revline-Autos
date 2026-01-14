import { createContext, useContext, useState } from "react";
import "../styles/toast.css";

const NotificacionContext = createContext();

export function NotificacionProvider({ children }) {
  const [mensaje, setMensaje] = useState(null);
  const [tipo, setTipo] = useState("info");

  const mostrarMensaje = (texto, tipo = "info") => {
    setMensaje(texto);
    setTipo(tipo);
    setTimeout(() => setMensaje(null), 3000);
  };

  return (
    <NotificacionContext.Provider value={{ mostrarMensaje }}>
      {children}
      {mensaje && <div className={`toast ${tipo}`}>{mensaje}</div>}
    </NotificacionContext.Provider>
  );
}

export function useNotificacion() {
  return useContext(NotificacionContext);
}
