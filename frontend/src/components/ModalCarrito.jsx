import "../styles/modal.css";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useCarrito } from "../context/CarritoContext";
import { useNotificacion } from "../context/NotificacionContext";

export default function ModalCarrito({ isOpen, onClose, producto }) {
  const { carrito, agregarProducto } = useCarrito();
  const { mostrarMensaje } = useNotificacion();

  // Bloquea el scroll del body mientras el modal está abierto
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  if (!isOpen) return null;

  const yaEnCarrito = carrito.some((p) => p.id === producto.id);

  const anadirAlCarrito = () => {
    agregarProducto(producto, 1);
    mostrarMensaje("Producto añadido al carrito correctamente", "exito");
    onClose();
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Añadir al carrito</h2>
        <p>{yaEnCarrito ? "Este producto ya se ha añadido al carrito. Controla desde ahí la cantidad." : `¿Deseas añadir un ${producto.nombre} al carrito?`}</p>
        <div className="modal-actions">
          <button className="btn-cancelar" onClick={onClose}>Cancelar</button>
          <button
            className="btn-confirmar"
            onClick={anadirAlCarrito}
            disabled={yaEnCarrito}
            style={yaEnCarrito ? { backgroundColor: "#444", cursor: "not-allowed", opacity: 0.7 } : {}}
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
