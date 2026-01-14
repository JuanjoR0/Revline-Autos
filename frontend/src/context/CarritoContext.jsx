// Contexto global del carrito persistido por usuario
import { createContext, useContext, useState, useEffect } from "react";
import { useNotificacion } from "./NotificacionContext";
import { useAuth } from "../context/AuthContext";

const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const { usuario } = useAuth();
  const { mostrarMensaje } = useNotificacion();

  const [carrito, setCarrito] = useState([]);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    if (usuario && usuario.email) {
      try {
        const clave = `carrito_${usuario.email}`;
        const guardado = localStorage.getItem(clave);
        setCarrito(guardado ? JSON.parse(guardado) : []);
      } catch (error) {
        console.error("Error leyendo carrito:", error);
        setCarrito([]);
      }
    } else {
      setCarrito([]);
    }
    setCargado(true);
  }, [usuario]);

  useEffect(() => {
    if (!cargado) return;
    if (usuario && usuario.email) {
      try {
        const clave = `carrito_${usuario.email}`;
        localStorage.setItem(clave, JSON.stringify(carrito));
      } catch (error) {
        console.error("Error guardando carrito:", error);
      }
    }
  }, [carrito, usuario, cargado]);

  const agregarProducto = (producto) => {
    setCarrito((prev) => [...prev, { ...producto, cantidad: 1 }]);
  };

  const cambiarCantidad = (id, cambio) => {
    setCarrito((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nuevaCantidad = p.cantidad + cambio;
          if (nuevaCantidad < 1) return { ...p, cantidad: 1 };
          if (nuevaCantidad > p.stock) {
            mostrarMensaje?.(`Solo quedan ${p.stock} unidades disponibles`, "error");
            return { ...p, cantidad: p.stock };
          }
          return { ...p, cantidad: nuevaCantidad };
        }
        return p;
      })
    );
  };

  const eliminarProducto = (id) => {
    setCarrito((prev) => prev.filter((p) => p.id !== id));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    if (usuario && usuario.email) {
      localStorage.removeItem(`carrito_${usuario.email}`);
    }
  };

  return (
    <CarritoContext.Provider value={{ carrito, agregarProducto, cambiarCantidad, eliminarProducto, vaciarCarrito }}>
      {children}
    </CarritoContext.Provider>
  );
}

export const useCarrito = () => useContext(CarritoContext);
