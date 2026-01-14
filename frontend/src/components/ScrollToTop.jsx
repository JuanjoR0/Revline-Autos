import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Resetea el scroll al cambiar de ruta
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}
