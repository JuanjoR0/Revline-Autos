//este es el cuerpo general de todos los modals
export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null; // si no está abierto, no se muestra

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // evita cerrar al hacer click dentro
      >
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}

//LIMPIO