//Este archivo maneja el contenido del modal para realizar el pedido
import "../styles/modal.css";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useNotificacion } from "../context/NotificacionContext";


export default function CheckoutModal({ isOpen, onClose }) {
  const { carrito, vaciarCarrito } = useCarrito();  //Obtiene del contexto del carrito
  const { usuario } = useAuth();  //Obtiene del AuthContext los datos del usuario logueado
  const navigate = useNavigate();  //sirve para redirigir al usuario a otra página desde el código JavaScript.
  const { mostrarMensaje } = useNotificacion();  //función que muestra mensajes tipo toast
  const [step, setStep] = useState(1); //guarda el paso, si estamos en paso 1: entrega, 2: pago
  const [loading, setLoading] = useState(false);  //Controla si el sistema está procesando la compra (enviando los datos al backend).
  const [error, setError] = useState("");  //Guarda el texto de un mensaje de error si ocurre algo

  const [entrega, setEntrega] = useState({   //guarda los datos de envío del pedido
    dni: "",
    direccion: "",
    codigoPostal: "",
    provincia: "",
    adicionales: "",
  });

  const [pago, setPago] = useState({         //guarda los datos del pago del usuario
    tarjeta: "",
    cvc: "",
    nombreTitular: "",
    caducidad: "",
    cupon: "",
  });

  //Bloqueamos el scroll cuando el modal está abierto
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  //Reiniciamos el formulario cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  //Generamos informacion falsa aleatoria para rellenar los campos rapidamente
  const fakeEntrega = () =>
    setEntrega({
      dni: "12345678A",
      direccion: "Calle Falsa 123",
      codigoPostal: "28013",
      provincia: "Madrid",
      adicionales: "Dejar en portería",
    });

  const fakePago = () =>
    setPago({
      tarjeta: "4242424242424242",
      cvc: "123",
      nombreTitular: usuario?.nombre || "Juan Pérez",
      caducidad: "12/29",
      cupon: "",
    });

  //Verifican que los campos obligatorios estén completos. Si falta algo, muestran un error y no permiten avanzar
  const validarEntrega = () => {
    if (!entrega.dni.trim() || !entrega.direccion.trim() || !entrega.codigoPostal.trim() || !entrega.provincia.trim()) {
      setError("Completa todos los campos de entrega obligatorios.");
      return false;
    }
    setError("");
    return true;
  };
  const validarPago = () => {
    if (!pago.tarjeta.trim() || !pago.cvc.trim() || !pago.nombreTitular.trim() || !pago.caducidad.trim()) {
      setError("Completa todos los campos de pago obligatorios.");
      return false;
    }
    setError("");
    return true;
  };

  //Sirve para navegar entre pasos
  const siguientePaso = () => {
    if (step === 1) {
      if (!validarEntrega()) return;
      setStep(2);  //Si está en el paso 1 y todo está bien, avanza al 2
    } else {
      setStep(1);  //Si está en el paso 2, vuelve al 1
    }
  };

  //Envia el pedido al backend a través de la petición HTTP POST para crear el pedido, vacía el carrito y redirige al usuario a la página de pedidos.
  const crearPedido = async () => {
    if (!validarPago()) return; //se para y muestra error arriba del formulario.
    if (!usuario) {             //si no hay usuario, no te deja comprar.
      setError("Debes iniciar sesión para realizar la compra.");
      return;
    }
    setLoading(true);
    setError("");

    //Crea el objeto completo de Pedido
    const Pedido = {
        email: usuario.email,
        direccion: entrega.direccion,
        codigo_postal: entrega.codigoPostal,
        provincia: entrega.provincia,
        pagado: true,
        detalles: carrito.map(p => ({
          vehiculo_id: p.id,
          cantidad: p.cantidad,
          precio_unitario: p.precio,
        })),
    };

        try {
          await api.post("pedidos/", Pedido);  //hace una petición HTTP tipo POST a la api para crear un pedido nuevo enviando el contenido del Pedido
          vaciarCarrito();                     //await espera la respuesta del servidor antes de seguir.
          mostrarMensaje(" Pedido realizado correctamente", "exito");
          onClose();
          navigate("/pedidos");  //Si todo sale bien, borra el carrito, muestra un mensaje y lleva al usuario a ver su pedido
        } catch (err) {
          console.error("Error al crear pedido:", err);
          setError("No se pudo crear el pedido.");
          mostrarMensaje("Error al realizar el pedido", "error");
        }                        //Si algo falla, aviso en consola, muestro error al usuario y dejo el modal abierto.

  };

  //permite que el modal se renderice directamente sobre el body, por encima de todo el contenido.
  return createPortal(
    //onClick={onClose} cierra el modal si haces clic fuera , onClick={(e) => e.stopPropagation()} evita que se cierre al clicar dentro.
     <div className="modal-overlay" onClick={onClose}> 
      <div className="modal-content checkout-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>Realizar compra</h2>

        <div className="checkout-steps">
          <div className={`step ${step===1?"active":""}`}>1. Entrega</div>
          <div className={`step ${step===2?"active":""}`}>2. Pago</div>
        </div>

        {error && <p className="mensaje-error">{error}</p>}

        {step === 1 ? (
          <div className="checkout-form">
            <label>DNI <span style={{ color: "#e53935" }}>*</span></label>
            <input value={entrega.dni} onChange={(e)=>setEntrega({...entrega,dni:e.target.value})} placeholder="12345678A" />
            <label>Dirección <span style={{ color: "#e53935" }}>*</span></label>
            <input value={entrega.direccion} onChange={(e)=>setEntrega({...entrega,direccion:e.target.value})} placeholder="Calle, nº, piso..." />
            <label>Código Postal <span style={{ color: "#e53935" }}>*</span></label>
            <input value={entrega.codigoPostal} onChange={(e)=>setEntrega({...entrega,codigoPostal:e.target.value})} placeholder="28013" />
            <label>Provincia <span style={{ color: "#e53935" }}>*</span></label>
            <input value={entrega.provincia} onChange={(e)=>setEntrega({...entrega,provincia:e.target.value})} placeholder="Madrid" />
            <label>Datos adicionales</label>
            <textarea value={entrega.adicionales} onChange={(e)=>setEntrega({...entrega,adicionales:e.target.value})} placeholder="Información adicional..." />
            <div className="checkout-actions">
              <button className="btn-auto" onClick={fakeEntrega}>Autocompletar informacion</button>
              <div className="right">
                <button className="btn-cancel" onClick={onClose}>Cancelar</button>
                <button className="btn-primary" onClick={siguientePaso}>Siguiente</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="checkout-form">
            <label>Nº Tarjeta <span style={{ color: "#e53935" }}>*</span></label>
            <input value={pago.tarjeta} onChange={(e)=>setPago({...pago,tarjeta:e.target.value})} placeholder="4242 4242 4242 4242" />
            <div className="row">
              <div style={{flex:1}}>
                <label>CVC <span style={{ color: "#e53935" }}>*</span></label>
                <input value={pago.cvc} onChange={(e)=>setPago({...pago,cvc:e.target.value})} placeholder="123" />
              </div>
              <div style={{flex:2, marginLeft:12}}>
                <label>Nombre titular <span style={{ color: "#e53935" }}>*</span></label>
                <input value={pago.nombreTitular} onChange={(e)=>setPago({...pago,nombreTitular:e.target.value})} placeholder="NOMBRE APELLIDOS" />
              </div>
            </div>
            <label>Fecha caducidad (MM/AA) <span style={{ color: "#e53935" }}>*</span></label>
            <input value={pago.caducidad} onChange={(e)=>setPago({...pago,caducidad:e.target.value})} placeholder="12/29" />
            <label>Cupón descuento (opcional)</label>
            <input value={pago.cupon} onChange={(e)=>setPago({...pago,cupon:e.target.value})} placeholder="CODIGO" />
            <div className="checkout-actions">
              <button className="btn-auto" onClick={fakePago}>Autocompletar pago</button>
              <div className="right">
                <button className="btn-cancel" onClick={()=>setStep(1)}>Anterior</button>
                <button className="btn-primary" onClick={crearPedido} disabled={loading}>{loading? "Procesando..." : "Finalizar Compra"}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

