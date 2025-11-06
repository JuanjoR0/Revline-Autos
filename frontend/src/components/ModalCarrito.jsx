//este es el contenido del modal para añadir al carrito
import "../styles/modal.css";
import { useEffect } from "react";
import { createPortal } from "react-dom";  //sirve para renderizar un componente fuera del DOM.
import { useCarrito } from "../context/CarritoContext";
import { useNotificacion } from "../context/NotificacionContext";

export default function ModalCarrito({ isOpen, onClose, producto }) {
  const { carrito,agregarProducto } = useCarrito();
  const { mostrarMensaje } = useNotificacion();


  // Bloquear scroll del body mientras el modal está abierto
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  if (!isOpen) return null;

  // Verificar si el producto ya está en el carrito
  const yaEnCarrito = carrito.some((p) => p.id === producto.id);

  //se ejecuta cuando se hace clic en “Añadir al carrito”
  const añadirAlCarrito = () => {
    agregarProducto(producto, 1); // Añade el producto siempre en 1 unidad
    mostrarMensaje("Producto añadido al carrito correctamente", "exito"); //muestra un mensaje de confirmación
    onClose(); //y cierra la ventana del producto
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>Añadir al carrito</h2>
        <p>{yaEnCarrito? "Este producto ya se ha añadido al carrito. Controla desde ahí la cantidad." : `¿Deseas añadir un ${producto.nombre} al carrito?`}</p>
        <div className="modal-actions"><button className="btn-cancelar" onClick={onClose}>Cancelar</button>
          <button className="btn-confirmar" onClick={añadirAlCarrito} disabled={yaEnCarrito} style={yaEnCarrito ? { backgroundColor: "#444", cursor: "not-allowed", opacity: 0.7 } : {}}>Añadir al carrito</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

