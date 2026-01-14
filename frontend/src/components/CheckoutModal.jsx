import "../styles/modal.css";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useNotificacion } from "../context/NotificacionContext";

export default function CheckoutModal({ isOpen, onClose }) {
  const { carrito, vaciarCarrito } = useCarrito();
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const { mostrarMensaje } = useNotificacion();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [entrega, setEntrega] = useState({
    dni: "",
    direccion: "",
    codigoPostal: "",
    provincia: "",
    adicionales: "",
  });

  const [pago, setPago] = useState({
    tarjeta: "",
    cvc: "",
    nombreTitular: "",
    caducidad: "",
    cupon: "",
  });

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

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

  const siguientePaso = () => {
    if (step === 1) {
      if (!validarEntrega()) return;
      setStep(2);
    } else {
      setStep(1);
    }
  };

  const crearPedido = async () => {
    if (!validarPago()) return;
    if (!usuario) {
      setError("Debes iniciar sesión para realizar la compra.");
      return;
    }
    setLoading(true);
    setError("");

    const Pedido = {
      email: usuario.email,
      direccion: entrega.direccion,
      codigo_postal: entrega.codigoPostal,
      provincia: entrega.provincia,
      pagado: true,
      detalles: carrito.map((p) => ({
        vehiculo_id: p.id,
        cantidad: p.cantidad,
        precio_unitario: p.precio,
      })),
    };

    try {
      await api.post("pedidos/", Pedido);
      vaciarCarrito();
      mostrarMensaje(" Pedido realizado correctamente", "exito");
      onClose();
      navigate("/pedidos");
    } catch (err) {
      console.error("Error al crear pedido:", err);
      setError("No se pudo crear el pedido.");
      mostrarMensaje("Error al realizar el pedido", "error");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content checkout-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Realizar compra</h2>

        <div className="checkout-steps">
          <div className={`step ${step === 1 ? "active" : ""}`}>1. Entrega</div>
          <div className={`step ${step === 2 ? "active" : ""}`}>2. Pago</div>
        </div>

        {error && <p className="mensaje-error">{error}</p>}

        {step === 1 ? (
          <div className="checkout-form">
            <label>DNI <span style={{ color: "#e53935" }}>*</span></label>
            <input value={entrega.dni} onChange={(e) => setEntrega({ ...entrega, dni: e.target.value })} placeholder="12345678A" />
            <label>Dirección <span style={{ color: "#e53935" }}>*</span></label>
            <input value={entrega.direccion} onChange={(e) => setEntrega({ ...entrega, direccion: e.target.value })} placeholder="Calle, nº, piso..." />
            <label>Código Postal <span style={{ color: "#e53935" }}>*</span></label>
            <input value={entrega.codigoPostal} onChange={(e) => setEntrega({ ...entrega, codigoPostal: e.target.value })} placeholder="28013" />
            <label>Provincia <span style={{ color: "#e53935" }}>*</span></label>
            <input value={entrega.provincia} onChange={(e) => setEntrega({ ...entrega, provincia: e.target.value })} placeholder="Madrid" />
            <label>Datos adicionales</label>
            <textarea value={entrega.adicionales} onChange={(e) => setEntrega({ ...entrega, adicionales: e.target.value })} placeholder="Información adicional..." />
            <div className="checkout-actions">
              <button className="btn-auto" onClick={fakeEntrega}>Autocompletar información</button>
              <div className="right">
                <button className="btn-cancel" onClick={onClose}>Cancelar</button>
                <button className="btn-primary" onClick={siguientePaso}>Siguiente</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="checkout-form">
            <label>Nº Tarjeta <span style={{ color: "#e53935" }}>*</span></label>
            <input value={pago.tarjeta} onChange={(e) => setPago({ ...pago, tarjeta: e.target.value })} placeholder="4242 4242 4242 4242" />
            <div className="row">
              <div style={{ flex: 1 }}>
                <label>CVC <span style={{ color: "#e53935" }}>*</span></label>
                <input value={pago.cvc} onChange={(e) => setPago({ ...pago, cvc: e.target.value })} placeholder="123" />
              </div>
              <div style={{ flex: 2, marginLeft: 12 }}>
                <label>Nombre titular <span style={{ color: "#e53935" }}>*</span></label>
                <input value={pago.nombreTitular} onChange={(e) => setPago({ ...pago, nombreTitular: e.target.value })} placeholder="NOMBRE APELLIDOS" />
              </div>
            </div>
            <label>Fecha caducidad (MM/AA) <span style={{ color: "#e53935" }}>*</span></label>
            <input value={pago.caducidad} onChange={(e) => setPago({ ...pago, caducidad: e.target.value })} placeholder="12/29" />
            <label>Cupón descuento (opcional)</label>
            <input value={pago.cupon} onChange={(e) => setPago({ ...pago, cupon: e.target.value })} placeholder="CODIGO" />
            <div className="checkout-actions">
              <button className="btn-auto" onClick={fakePago}>Autocompletar pago</button>
              <div className="right">
                <button className="btn-cancel" onClick={() => setStep(1)}>Anterior</button>
                <button className="btn-primary" onClick={crearPedido} disabled={loading}>{loading ? "Procesando..." : "Finalizar Compra"}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
