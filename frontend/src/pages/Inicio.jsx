import heroImg from "../assets/hero2.png";
import turismo from "../assets/turismo.png";
import moto from "../assets/moto.png";
import especial from "../assets/especial.png";
import aereo from "../assets/aereo.png";
import sobreNosotrosImg from "../assets/hero1.png";
import bmw from "../assets/marca1.png";
import audi from "../assets/marca2.png";
import mercedes from "../assets/marca3.png";
import lamborghini from "../assets/marca4.png";
import "../styles/inicio.css";
import { Link } from "react-router-dom";

export default function Inicio() {
  return (
    <section>
      <section className="hero" style={{ backgroundImage: `url(${heroImg})` }}>
        <div className="hero-overlay" />
        <div className="hero-container">
          <div className="hero-content">
            <h1>Bienvenido a <span>Revline Autos.</span></h1>
            <p>Tu tienda especializada en colección de vehiculos del mundo de Grand Theft Auto.</p>
            <p> Ofrecemos productos de la más alta calidad, pensados para profesionales y entusiastas del coleccionismo.
              Presentando una amplia gama de vehículos de todo tipo.</p>
            <div className="hero-buttons">
              <Link to="/tienda" className="btn-ver">Ver Vehículos</Link>
              <Link to="/contacto" className="btn-contacto">Contáctanos</Link>
            </div>

            <div className="hero-stats">
              <div><h3>+150</h3><p>Modelos de Autos</p></div>
              <div><h3>+50</h3><p>Accesorios Premium</p></div>
              <div><h3>24/7</h3><p>Soporte y Asistencia</p></div>
            </div>
          </div>

          <div className="advertencia">
            <h3>Advertencia</h3>
            <p>Esta es una web ficticia creada con fines educativos y de demostración. 
              No introduzcas datos reales como contraseñas, correos ni información personal.</p>
          </div>
        </div>
      </section>
      
      <section className="vehiculos">
        <h2>Nuestros Vehículos</h2>
        <div className="vehiculos-grid">
          <div className="vehiculo-card">
            <img src={turismo} alt="Turismos" />
            <h3>Turismos</h3>
          </div>
          <div className="vehiculo-card">
            <img src={moto} alt="Motos" />
            <h3>Motos</h3>
          </div>
          <div className="vehiculo-card">
            <img src={especial} alt="Especiales" />
            <h3>Especiales</h3>
          </div>
          <div className="vehiculo-card">
            <img src={aereo} alt="Especiales" />
            <h3>Aereos</h3>
          </div>
        </div>
      </section>

      
      <section className="sobre-nosotros">
        <div className="sobre-contenido">
          <div className="sobre-imagen">
            <img src={sobreNosotrosImg} alt="Sobre nosotros" />
          </div>

          <div className="sobre-derecha">
            <div className="barra-neon"></div>
            <div className="sobre-texto">
              <h2>Sobre Nosotros</h2>
              <p>En Revline Autos llevamos años ofreciendo vehículos de alto rendimiento a clientes exigentes.
                Nuestra pasión por la velocidad, la ingeniería y el diseño nos impulsa a seleccionar solo los
                mejores modelos del mercado.</p>
              <p> Nos enorgullece combinar tecnología avanzada con atención personalizada,
                brindando una experiencia única desde la elección del coche hasta su entrega.</p>

              <Link to="/tienda" className="btn-ver ver-catalogo">Ver catálogo de vehículos</Link>
              </div>
          </div>
        </div>
      </section>

      <section className="vehiculos">
        <h2>Marcas Destacadas</h2>
        <div className="vehiculos-grid">
          <div className="marca">
            <img src={bmw} alt="BMW" />
            <h3>Grotti</h3>
          </div>
          <div className="marca">
            <img src={audi} alt="Audi" />
            <h3>Übermacht</h3>
          </div>
          <div className="marca">
            <img src={mercedes} alt="Mercedes-Benz" />
            <h3>Pegassi</h3>
          </div>
          <div className="marca">
            <img src={lamborghini} alt="Lamborghini" />
            <h3>Pfister</h3>
          </div>
        </div>
      </section>
    
    </section>
    
  );
}
