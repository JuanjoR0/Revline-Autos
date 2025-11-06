//Este archivo controla todo lo relacionado con el usuario que ha iniciado sesión (login, registro y cierre de sesión).
//Sirve para que cualquier parte de la app pueda saber si hay un usuario conectado, quién es, y cerrar sesión sin tener que pasar datos entre componentes.
//Un contexto es una especie de almacén global de informacion, en este caso del usuario.
import { createContext, useContext, useState, useEffect } from "react";
const AuthContext = createContext();  //creamos el contexto de informacion del usuario con la funcion de React

export function AuthProvider({ children }) {  //Este componente envuelve toda la aplicación y provee acceso al contexto a todos los componentes hijos
  const [usuario, setUsuario] = useState(null);  //lo vamos a usar para saber si hay sesión activa
  const [loginOpen, setLoginOpen] = useState(false); //Controla si el modal de login está abierto
  const [registroOpen, setRegistroOpen] = useState(false);  //Controla si el modal de registro está abierto

  //Cargamos el usuario desde localStorage al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem("usuario");
    if (savedUser) {
      setUsuario(JSON.parse(savedUser));  // parse convierte el string del JSON en un objeto usuario de JavaScript
    }
  }, []);

  // Guardamos el usuario cada vez que cambia o lo borramos de localStorage si se cierra la sesion
  useEffect(() => { //Esto permite mantener la sesión aunque recarguemos la página.
    if (usuario) {
      localStorage.setItem("usuario", JSON.stringify(usuario));  // stringify convierte el objeto usuario en un string con formato JSON
    } else {
      localStorage.removeItem("usuario");
    }
  }, [usuario]);

  //Borra al usuario del estado y del almacenamiento local, cerrando completamente la sesión.
  const cerrarSesion = () => {  
    setUsuario(null);
    localStorage.removeItem("usuario"); 
    localStorage.removeItem("token");
  };

  return (
    //Entregamos todos los datos y funciones del archivo a los componentes hijos de AuthProvider, que podrán acceder a ellos usando nuestra funcion useAuth().
    <AuthContext.Provider value={{ usuario, setUsuario, loginOpen, setLoginOpen,
     cerrarSesion, registroOpen, setRegistroOpen }}>
      {children}
    </AuthContext.Provider>
  );
}

//exportamos la funcion con la que cualquier componente va a poder obtener los datos del usuario 
export function useAuth() {
  return useContext(AuthContext);
}

