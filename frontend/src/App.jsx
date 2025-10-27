import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Inicio from "./pages/Inicio";
import Tienda from "./pages/Tienda";
import DetalleVehiculo from "./pages/DetalleVehiculo";
import Carrito from "./pages/Carrito";
import Pedidos from "./pages/Pedidos";
import Registro from "./pages/Registro";
import InicioSesion from "./pages/Login";
import Contacto from "./pages/Contacto";
import Blog from "./pages/Blog";


function Layout() {
  const location = useLocation();
  const isTienda = location.pathname === "/tienda";

  return (
    <>
      <Navbar />
      {isTienda ? (
        <Tienda />
      ) : (
        <main style={{ flex: 1 }}>
          <div className="container" >
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/vehiculo/:id" element={<DetalleVehiculo />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/pedidos" element={<Pedidos />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/login" element={<InicioSesion />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/blog" element={<Blog />} />
            </Routes>
          </div>
        </main>
      )}
      <Footer />
    </>
  );
}

export default function App() {
  return (
      <Routes>
        <Route path="/*" element={<Layout />} />
      </Routes>
  );
}
