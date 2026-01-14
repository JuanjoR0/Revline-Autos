import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Inicio from "./pages/Inicio";
import Tienda from "./pages/Tienda";
import Carrito from "./pages/Carrito";
import Pedidos from "./pages/Pedidos";
import Contacto from "./pages/Contacto";
import PoliticaPrivacidad from "./pages/Privacidad";
import ScrollToTop from "./components/ScrollToTop";

function Layout() {
  const location = useLocation();
  const isTienda = location.pathname === "/tienda";

  return (
    <>
      <ScrollToTop />
      <Navbar />
      {isTienda ? (
        <Tienda />
      ) : (
        <main>
          <div className="container">
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/pedidos" element={<Pedidos />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/privacidad" element={<PoliticaPrivacidad />} />
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
