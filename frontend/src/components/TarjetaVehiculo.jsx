import "../styles/tienda.css";
import carritoIcono from "../assets/carrito-de-compras.png";
import ModalCarrito from "./ModalCarrito";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function TarjetaVehiculo({ vehiculo }) {
  const { usuario, setLoginOpen } = useAuth();
  const [modalAbierto, setModalAbierto] = useState(false);

  const atributos = [
    { label: "Velocidad", valor: vehiculo.velocidad },
    { label: "Frenado", valor: vehiculo.frenado },
    { label: "Aceleración", valor: vehiculo.aceleracion },
  ];

  const handleAddToCart = () => {
    if (!usuario) {
      setLoginOpen(true); // 🔓 abre el modal de login del header
      return;
    }
    setModalAbierto(true);
  };

  return (
    <div className="tarjeta-vehiculo">
      {/* HEADER */}
      <div className="tarjeta-header">
        <p className="vehiculo-stock">
          Stock: <span>{vehiculo.stock}</span>
        </p>
        <img
          src={vehiculo.imagen || "/placeholder.jpg"}
          alt={vehiculo.nombre}
          className="vehiculo-imagen"
        />
        <div className="vehiculo-info">
          <h3 className="vehiculo-nombre">
            {vehiculo.marca} {vehiculo.nombre}
          </h3>
        </div>
      </div>

      {/* STATS */}
      <div className="vehiculo-stats">
        {atributos.map((a, index) => (
          <div key={index} className="stat-item">
            <span className="stat-label">{a.label}</span>
            <div className="barra">
              <div className="barra-valor" style={{ width: `${a.valor}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="tarjeta-footer">
        <p className="precio">
          DESDE: <strong>${vehiculo.precio}</strong>
        </p>
        <button className="btn-cart" onClick={handleAddToCart}>
          <img src={carritoIcono} alt="Carrito" />
        </button>
      </div>

      {/* MODAL CARRITO */}
      <ModalCarrito
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        producto={vehiculo}
      />
    </div>
  );
}
