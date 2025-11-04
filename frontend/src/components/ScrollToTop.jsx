//Este archivo hace que la página vuelva automáticamente al principio (scroll arriba del todo), mejorando la experiencia de navegación en la web.
//Cuando cambias de una página a otra en la web, React no recarga toda la página, solo cambia el contenido, 
//quedandose el scroll en la posicion en la que estabas antes.
//Encontrado en la documentación de React Router de la web oficial
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}

//LIMPIO