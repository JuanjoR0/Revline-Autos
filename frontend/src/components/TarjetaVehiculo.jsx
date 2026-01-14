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

  const anadirAlCarrito = () => {
    if (!usuario) {
      setLoginOpen(true);
      return;
    }
    setModalAbierto(true);
  };

  return (
    <div className="tarjeta-vehiculo">
      <div className="tarjeta-header">
        <p className={`vehiculo-stock ${vehiculo.stock <= 0 ? "no-stock" : ""}`}>
          Stock: <span>{vehiculo.stock}</span>
        </p>
        <img src={vehiculo.imagen || "/placeholder.jpg"} alt={vehiculo.nombre} className="vehiculo-imagen" />
        <div className="vehiculo-info">
          <h3 className="vehiculo-nombre">
            {vehiculo.marca} {vehiculo.nombre}
          </h3>
        </div>
      </div>

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

      <div className="tarjeta-footer">
        <p className="precio">
          DESDE: <strong>${vehiculo.precio}</strong>
        </p>
        <button className="btn-cart" onClick={anadirAlCarrito} disabled={vehiculo.stock <= 0}>
          <img src={carritoIcono} alt="Carrito" />
        </button>
      </div>

      <ModalCarrito isOpen={modalAbierto} onClose={() => setModalAbierto(false)} producto={vehiculo} />
    </div>
  );
}
