// Este archivo se encarga de manejar todo lo relacionado con el carrito para ofrecerlo a toda la aplicación y guardarlo en el localStorage.
import { createContext, useContext, useState, useEffect } from "react"; //sirven para para crear y usar el contexto global
import { useNotificacion } from "./NotificacionContext"; //para que salgan los toast informativos
import { useAuth } from "../context/AuthContext"; //importamos el contexto del usuario para crear un carrito solo para el

const CarritoContext = createContext(); //creamos el contexto global para almacenar la info del carrito

export function CarritoProvider({ children }) { //Este componente envuelve toda la aplicación y provee acceso al contexto a todos los componentes hijos
  const { usuario } = useAuth(); //  Usuario actual logueado
  const { mostrarMensaje } = useNotificacion();

  const [carrito, setCarrito] = useState([]); // Cargamos el carrito desde localStorage al iniciar
  const [cargado, setCargado] = useState(false); // para evitar guardar antes de tener el usuario


  //Vamos a separarlos en dos useEffect(), cargar primero y guardar después

  // Carga el carrito cuando cambia usuario (login/logout).
  useEffect(() => {
    if (usuario && usuario.email) { //Si hay usuario lee localStorage en la clave carrito_email y lo mete en estado.
      try {
        const clave = `carrito_${usuario.email}`;
        const guardado = localStorage.getItem(clave);
        setCarrito(guardado ? JSON.parse(guardado) : []);
      } catch (error) {
        console.error("Error leyendo carrito:", error);
        setCarrito([]);
      }
    } else { // Si no hay usuario, limpia el carrito y no muestra nada
      setCarrito([]);
    }
    setCargado(true); //para indicar que la carga inicial ya se hizo
  }, [usuario]);

 //una vez finalice la carga inicial guarda el carrito
  useEffect(() => {
    if (!cargado) return; // evita guardar antes de tiempo
    if (usuario && usuario.email) { //Si hay usuario, persiste su carrito en su clave (carrito_email)
      try {
        const clave = `carrito_${usuario.email}`;
        localStorage.setItem(clave, JSON.stringify(carrito));
      } catch (error) {
        console.error("Error guardando carrito:", error);
      }
    }
  }, [carrito, usuario, cargado]);

  // Añadir producto al carrito
  const agregarProducto = (producto) => { // se copian los elementos existentes del carrito antes del cambio y añade lo nuevo
    setCarrito((prev) => [...prev, { ...producto, cantidad: 1 }]); //siempre se asigna cantidad 1
  };

  // Cambiar cantidad (limitando al stock)
  const cambiarCantidad = (id, cambio) => {
    setCarrito((prev) =>
      prev.map((p) => { //Recorremos el carrito
        if (p.id === id) { // si coincice el id del producto recorrido con el del que se quiere modificar la cantidad
          const nuevaCantidad = p.cantidad + cambio;
          if (nuevaCantidad < 1) return { ...p, cantidad: 1 }; //Limitamos mínimo a 1
          if (nuevaCantidad > p.stock) { 
            mostrarMensaje?.(`Solo quedan ${p.stock} unidades disponibles`, "error"); //muestra toast si se intenta superar el maximo al stock
            return { ...p, cantidad: p.stock }; //Si intenta superar la cantidad del stock se queda en ese maximo
          }
          return { ...p, cantidad: nuevaCantidad }; //Devuelve una copia del producto con la nueva cantidad
        }
        return p; //Para los demás productos recorridos, devuelve el producto sin tocarlo
      })
    );
  };

  // Eliminar producto por id
  const eliminarProducto = (id) => {
    setCarrito((prev) => prev.filter((p) => p.id !== id)); //filter crea un nuevo array sin el producto con ese id.
  };

  // Vaciar carrito (tras realizar pedido)
  const vaciarCarrito = () => {
    setCarrito([]);
    if (usuario && usuario.email) {
      localStorage.removeItem(`carrito_${usuario.email}`); //Limpia el estado y elimina el carrito persistido solo del usuario actual.
    }
  };

  return (
    //Cualquier componente dentro del provider puede consumir el carrito y sus funciones usando el useCarrito() de abajo
    <CarritoContext.Provider value={{ carrito,agregarProducto,cambiarCantidad,eliminarProducto,vaciarCarrito,}}>
      {children}
    </CarritoContext.Provider>
  );
}

//exportamos el contexto del carrito globalmente para poder acceder en toda la app a él.
export const useCarrito = () => useContext(CarritoContext);
