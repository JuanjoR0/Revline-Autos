//Este archivo es es el componente raíz de la app, la interfaz, y dentro de él se renderizan todas las páginas y componentes que forman la web.
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

//Es un componente interno dentro de App() que diseña la estructura navbar arriba, footer abajo y en el medio el main (según la URL actual)
function Layout() {
  const location = useLocation();
  const isTienda = location.pathname === "/tienda";

  return (
    <>
       <ScrollToTop />  {/*Para que al cambiar de pagina se haga scroll automatico a el principio */}
        <Navbar />      {/*Muestra el header arriba siempre */}
        {isTienda ? (   
           <Tienda />    //Muestra solo el contenido de la tienda si está en esa ruta, si no, muestra el resto de las rutas dentro del <main>
        ) : (
          <main>
            <div className="container" >
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
      <Footer />  {/*Muestra el footer al final siempre */}
    </>
  );
}

//Es el componente raíz exportado para que lo importe main.jsx y lo renderice
export default function App() { 
  return (
      <Routes>
        <Route path="/*" element={<Layout />} />
      </Routes>
  );
}

// LIMPIO