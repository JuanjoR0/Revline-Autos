import "../styles/contacto.css";
import { FaWhatsapp, FaMapMarkerAlt } from "react-icons/fa";

export default function Contacto() {
  return (
    <div className="contacto-page">
      <section className="contacto-hero">
        <div className="contacto-overlay">
          <h1>Contáctanos</h1>
        </div>
      </section>

      <div className="contacto-contenido container">
        <div className="contacto-correo">
          <div className="correo-texto">
            <h2>Envíanos un correo</h2>
            <p>¿Tienes alguna consulta o necesitas asistencia personalizada?  Completa el formulario y te responderemos lo antes posible.</p>
          </div>

          <form className="correo-form">
            <input type="text" placeholder="Tu nombre" required />
            <input type="email" placeholder="Tu correo electrónico" required />
            <textarea placeholder="Tu mensaje..." rows="5" required></textarea>
            <button type="submit">Enviar mensaje</button>
          </form>
        </div>

        <div className="contacto-mapa-seccion">
          <div className="info-contacto">
            <h2>Información de contacto</h2>
            <div className="info-item">
              <FaMapMarkerAlt className="info-icono mapa" />
              <p><strong>Dirección:</strong> Calle Falsa 123, Almuñécar (Granada)</p>
            </div>
            <div className="info-item">
              <FaWhatsapp className="info-icono whatsapp" />
              <p><strong>WhatsApp:</strong> +34 661 30 73 27</p>
            </div>
            <p className="info-texto-final">Puedes visitarnos en nuestro taller o escribirnos directamente a través de WhatsApp.</p>
          </div>

          <div className="mapa-container">
            <iframe title="Mapa Almuñécar"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3195.6064644569817!2d-3.690285!3d36.734038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd718a6ab94b38c1%3A0xf02e2cb8b5a94b34!2sAlmu%C3%B1%C3%A9car%2C%20Granada!5e0!3m2!1ses!2ses!4v1730210000000!5m2!1ses!2ses"
              width="100%" height="350" style={{ border: 0, borderRadius: "12px" }} allowFullScreen="" loading="lazy"></iframe>
          </div>

        </div>

      </div>
    </div>
  );
}

// LIMPIO