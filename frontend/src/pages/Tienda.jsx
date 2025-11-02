import { useEffect, useState } from "react";
import { api } from "../api/axios";
import TarjetaVehiculo from "../components/TarjetaVehiculo";
import "../styles/tienda.css";
import { motion, AnimatePresence } from "framer-motion";

export default function Tienda() {
  const [vehiculos, setVehiculos] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

  // 🧠 Cargar los vehículos desde el backend
  useEffect(() => {
    api
      .get("vehiculos/")
      .then((res) => setVehiculos(res.data))
      .catch((err) => console.error("Error al cargar vehículos:", err));
  }, []);

  // 🧩 Mapeo entre texto del botón y valor real del tipo
  const mapaCategorias = {
    todos: "todos",
    turismos: "coche",
    motos: "moto",
    especiales: "especial",
  };

  // 🔎 Filtrado avanzado (categoría + búsqueda) con mapeo correcto
  const vehiculosFiltrados = vehiculos.filter((v) => {
    const normalize = (str) =>
      (str || "")
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

    // Mapa entre el botón del submenú y el valor que llega en v.tipo desde Django
    const mapaCategorias = {
      todos: null,        
      turismos: "coche",
      motos: "moto",
      especiales: "especial",
    };

    const tipoSeleccionado = mapaCategorias[filtroCategoria];

    // Coincidencia de categoría (si hay tipo seleccionado)
    const coincideCategoria =
      !tipoSeleccionado || normalize(v.tipo) === normalize(tipoSeleccionado);

    // Coincidencia de búsqueda (nombre, marca o tipo)
    const q = normalize(busqueda);
    const coincideBusqueda =
      !q ||
      normalize(v.nombre).includes(q) ||
      normalize(v.marca).includes(q) ||
      normalize(v.tipo).includes(q);

    return coincideCategoria && coincideBusqueda;
  });


  return (
    <div className="tienda-fondo">
      <div className="tienda-overlay">
        <div className="tienda-contenedor">

          {/* 🔻 SUBMENÚ Y BUSCADOR (DISEÑO ORIGINAL) */}
          <div className="submenu-tienda">
            <div className="categorias">
              {["todos", "turismos", "motos", "especiales"].map(
                (categoria) => (
                  <button
                    key={categoria}
                    className={`categoria-btn ${
                      filtroCategoria === categoria ? "activo" : ""
                    }`}
                    onClick={() => setFiltroCategoria(categoria)}
                  >
                    {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                  </button>
                )
              )}
            </div>

            <div className="buscador">
              <input
                type="text"
                placeholder="Buscar vehículo..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>

          {/* 🔻 GRID DE VEHÍCULOS CON ANIMACIÓN */}
          <div className="tienda-grid">
            <AnimatePresence mode="wait">
              {vehiculosFiltrados.length > 0 ? (
                vehiculosFiltrados.map((vehiculo) => (
                  <motion.div
                    key={vehiculo.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                   <TarjetaVehiculo vehiculo={vehiculo} />
                  </motion.div>
                ))
              ) : (
                <motion.p
                  key="no-results"
                  className="sin-resultados"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  No se encontraron resultados.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
