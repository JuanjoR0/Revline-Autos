import { createContext, useContext, useState, useEffect } from "react";
import { useNotificacion } from "./NotificacionContext";


const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const { mostrarMensaje } = useNotificacion();

  // 🧠 Cargar el carrito desde localStorage al iniciar
  const [carrito, setCarrito] = useState(() => {
    try {
      const guardado = localStorage.getItem("carrito");
      return guardado ? JSON.parse(guardado) : [];
    } catch (error) {
      console.error("Error leyendo carrito del localStorage:", error);
      return [];
    }
  });

  // 💾 Guardar automáticamente en localStorage al cambiar
  useEffect(() => {
    try {
      localStorage.setItem("carrito", JSON.stringify(carrito));
    } catch (error) {
      console.error("Error guardando carrito:", error);
    }
  }, [carrito]);

  // 🛒 Añadir producto
  const agregarProducto = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((p) => p.id === producto.id);
      if (existe) {
        return prev.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        );
      } else {
        return [...prev, { ...producto, cantidad: 1 }];
      }
    });
  };

  // Cambiar cantidad (limitado al stock)
  const cambiarCantidad = (id, cambio) => {
    setCarrito((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nuevaCantidad = p.cantidad + cambio;

          // 🔸 No permitir menos de 1 ni más que el stock disponible
          if (nuevaCantidad < 1) return { ...p, cantidad: 1 };
          if (nuevaCantidad > p.stock) {
            // Mostrar notificación si se intenta pasar el stock
            mostrarMensaje?.(`Solo quedan ${p.stock} unidades disponibles`, "error");
            return { ...p, cantidad: p.stock };
          }

          return { ...p, cantidad: nuevaCantidad };
        }
        return p;
      })
    );
  };


  // ❌ Eliminar producto
  const eliminarProducto = (id) => {
    setCarrito((prev) => prev.filter((p) => p.id !== id));
  };

  // 🧹 Vaciar carrito completo
  const vaciarCarrito = () => {
    setCarrito([]);
    localStorage.removeItem("carrito");
  };

  return (
    <CarritoContext.Provider
      value={{ carrito, agregarProducto, cambiarCantidad, eliminarProducto, vaciarCarrito }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export const useCarrito = () => useContext(CarritoContext);
