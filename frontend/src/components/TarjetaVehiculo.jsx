//Este archivo compone el formato que se le da a cada vehiculo recibido del backend y maneja su contenido.
import "../styles/tienda.css";
import carritoIcono from "../assets/carrito-de-compras.png";
import ModalCarrito from "./ModalCarrito"; //modal para añadir producto al carrito
import { useState } from "react";  //lo vamos a usar para controlar si el modal está abierto
import { useAuth } from "../context/AuthContext"; 


export default function TarjetaVehiculo({ vehiculo }) {
  const { usuario, setLoginOpen } = useAuth(); //Contexto global para saber si hay usuario logueado
  const [modalAbierto, setModalAbierto] = useState(false); //controla si el modal del carrito está visible.
 
  const atributos = [ //Se usa para pintar las barras que representan las estadísticas del vehiculo.
    { label: "Velocidad", valor: vehiculo.velocidad },
    { label: "Frenado", valor: vehiculo.frenado },
    { label: "Aceleración", valor: vehiculo.aceleracion },
  ];

  const añadirAlCarrito = () => {
    if (!usuario) {
      setLoginOpen(true); // abre el modal de login del header si el usuario no esta logueado
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
        <img src={vehiculo.imagen || "/placeholder.jpg"} alt={vehiculo.nombre} className="vehiculo-imagen"/>
        <div className="vehiculo-info">
          <h3 className="vehiculo-nombre">
            {vehiculo.marca} {vehiculo.nombre}
          </h3>
        </div>
      </div>

      <div className="vehiculo-stats">
        {atributos.map((a, index) => ( //generamos un div por cada estadistica del vehiculo
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
        <button className="btn-cart" onClick={añadirAlCarrito} disabled={vehiculo.stock <= 0}>
          <img src={carritoIcono} alt="Carrito" />
        </button>
      </div>

      <ModalCarrito isOpen={modalAbierto} onClose={() => setModalAbierto(false)} producto={vehiculo}/>
    </div>
  );
}

//LIMPIO