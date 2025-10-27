import heroImg from "../assets/hero2.png";
import "../styles/Inicio.css";

export default function Inicio() {
  return (
    <section className="hero" style={{ backgroundImage: `url(${heroImg})` }}>
      <div className="hero-container">
        <div className="hero-content">
          <h1>Bienvenido a Revline Autos</h1>
          <p>
            Calidad, confianza y potencia en cada vehículo. Explora nuestra selección y
            encuentra el coche perfecto para ti.
          </p>
          <button>Ver vehículos</button>
        </div>
      </div>
    </section>
  );
}
