import "../styles/modal.css";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useCarrito } from "../context/CarritoContext";

export default function ModalCarrito({ isOpen, onClose, producto }) {
  const { agregarProducto } = useCarrito();

  // Bloquear scroll del body mientras el modal está abierto
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddToCart = () => {
    agregarProducto(producto, 1); // siempre añade 1 unidad
    onClose();
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>Añadir al carrito</h2>
        <p>{producto ? `¿Deseas añadir "${producto.nombre}" al carrito?` : "¿Deseas añadir este producto al carrito?"}</p>
        <div className="modal-actions"><button className="btn-cancelar" onClick={onClose}>Cancelar</button><button className="btn-confirmar" onClick={handleAddToCart}>Añadir al carrito</button></div>
      </div>
    </div>,
    document.body
  );
}
