//Este archivo se encarga de mostrar los toast informativos temporales en eventos
import { createContext, useContext, useState } from "react";  //para usar el contexto global
import "../styles/toast.css";

const NotificacionContext = createContext();  //creamos el contexto

export function NotificacionProvider({ children }) {  //Este componente envuelve toda la app, para que cualquier componente hijo pueda mostrar las notificaciones
  const [mensaje, setMensaje] = useState(null);       //Guarda el texto del aviso
  const [tipo, setTipo] = useState("info");           //guarda el tipo de mensaje, lo que hace que se elija el color del toast (si es info o es error).

  const mostrarMensaje = (texto, tipo = "info") => {
    setMensaje(texto);
    setTipo(tipo);
    setTimeout(() => setMensaje(null), 3000);         // 3 segundos visible
  };

  return (
    //se comparte la funcion para toda la app
    <NotificacionContext.Provider value={{ mostrarMensaje }}>
      {children}
      {mensaje && <div className={`toast ${tipo}`}>{mensaje}</div>}
    </NotificacionContext.Provider>
  );
}

//para usar el contexto de forma facil en toda la app exportamos esta funcion 
export function useNotificacion() {
  return useContext(NotificacionContext);
}
