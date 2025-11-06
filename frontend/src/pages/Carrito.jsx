import "../styles/carrito.css";
import { useCarrito } from "../context/CarritoContext";
import CheckoutModal from "../components/CheckoutModal";
import { useState } from "react"; //esto permite guardar y controlar el estado de un componente para que este se actualice dinamicamente cuando hay algun cambio

export default function Carrito() {
  const [checkoutOpen, setCheckoutOpen] = useState(false); //controla si el checkout está abierto o cerrado, se inicializa en cerrado
  const { carrito, cambiarCantidad, eliminarProducto } = useCarrito();
  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <div className="carrito-contenedor">
      <h1>Mi carrito &gt;</h1>

      {carrito.length === 0 ? (
        <p className="carrito-vacio">¡Tu carrito está vacío. Añade productos desde la tienda!</p>
      ) : (
        <>
          <div className="carrito-lista">
            {carrito.map((p) => ( //recorre el array carrito y generamos un componente por cada elemento que tiene
              <div className="carrito-item" key={p.id}>
                <img src={p.imagen} alt={p.nombre} className="carrito-img" />
                <div className="carrito-detalles">
                  <h3>{p.marca} {p.nombre}</h3>
                  <p className="precio-unitario">${p.precio.toLocaleString()}</p>
                </div>

                <div className="carrito-cantidad">
                  <button onClick={() => cambiarCantidad(p.id, -1)}>−</button>
                  <span>{p.cantidad}</span>
                  <button onClick={() => cambiarCantidad(p.id, 1)} disabled={p.cantidad >= p.stock}>+</button>
                </div>

                <div className="carrito-subtotal">
                  ${(p.precio * p.cantidad).toLocaleString()}
                </div>

                <button className="btn-eliminar" onClick={() => eliminarProducto(p.id)}>✕</button>
              </div>
            ))}
          </div>

          <div className="carrito-resumen">
            <p className="total">Total: $<strong>{total.toLocaleString()}</strong></p>
            <button className="btn-comprar" onClick={() => setCheckoutOpen(true)} disabled={carrito.length===0}>Realizar compra</button>
          </div>
          <CheckoutModal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} /> {/* Modal para realizar un pedido */}
        </>
      )}
    </div>
  );
}

