import "../styles/footer.css";
import { FaInstagram, FaFacebookF, FaXTwitter, FaWhatsapp } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import Logo from "../assets/Logo.png";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-overlay">
          <div className="footer-content container">

            <div className="footer-section logo-area">
              <img src={Logo} alt="RevLine Autos Logo" className="footer-logo" />
            </div>

            <div className="footer-section enlaces">
              <ul>
                <li><NavLink to="/">Inicio</NavLink></li>
                <li><NavLink to="/tienda">Tienda</NavLink></li>
                <li><NavLink to="/contacto">Contacto</NavLink></li>
                <li><NavLink to="/privacidad">Politica de privacidad</NavLink></li>
              </ul>
            </div>

            <div className="footer-section redes">
              <div className="social-icons">
                <a href="#"><FaInstagram /></a>
                <a href="#"><FaXTwitter /></a>
                <a href="#"><FaWhatsapp /></a>
                <a href="#"><FaFacebookF /></a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 RevLine Autos — Desarrollado por Juan José Rodríguez Ortega</p>
      </div>
    </footer>
  );
}

//LIMPIO