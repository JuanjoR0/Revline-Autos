import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"; // tu contexto donde guardas el token del login
import "../styles/pedidos.css";

export default function MisPedidos() {
  const { token } = useAuth(); // asegúrate de tener token del usuario autenticado
  const [pedidos, setPedidos] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [loading, setLoading] = useState(true);

  const marcarComoRecibido = async (pedidoId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/pedidos/${pedidoId}/marcar_recibido/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Error al actualizar el pedido");
      }

      // Actualiza el estado local (para reflejar el cambio sin recargar)
      setPedidos((prev) =>
        prev.map((pedido) =>
          pedido.id === pedidoId ? { ...pedido, estado: "entregado" } : pedido
        )
      );

    } catch (err) {
      console.error("❌ Error al marcar recibido:", err);
    }
  };

 useEffect(() => {
  const fetchPedidos = async () => {
    try {
      const token = localStorage.getItem("token"); // 👈 obtiene el token guardado tras login

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/pedidos/mis_pedidos/`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // 👈 aquí se pasa el JWT
        },
      });

      if (!res.ok) {
        console.error("Error al cargar pedidos:", res.status);
        setPedidos([]);
        return;
      }

      const data = await res.json();
      console.log("Pedidos obtenidos:", data); // 👈 para verificar en consola
      setPedidos(data);
    } catch (error) {
      console.error("❌ Error al obtener pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchPedidos();
}, []);

  // Filtrado por estado
  const pedidosFiltrados = pedidos.filter((p) => {
    if (filtro === "todos") return true;
    return p.estado.toLowerCase() === filtro;
  });

  return (
    <div className="pedidos-container">

      <div className="pedidos-filtros">
        <button
          onClick={() => setFiltro("todos")}
          className={filtro === "todos" ? "activo" : ""}
        >
          Todos
        </button>
        <button
          onClick={() => setFiltro("pendiente")}
          className={filtro === "pendiente" ? "activo" : ""}
        >
          Pendientes
        </button>
        <button
          onClick={() => setFiltro("entregado")}
          className={filtro === "entregado" ? "activo" : ""}
        >
          Entregados
        </button>
      </div>

      {loading ? (
        <p>Cargando pedidos...</p>
      ) : pedidosFiltrados.length === 0 ? (
        <p>No tienes pedidos {filtro === "todos" ? "" : filtro}.</p>
      ) : (
        <ul className="lista-pedidos">
          {pedidosFiltrados.map((p) => (
            <li key={p.id} className="pedido-card">
              <div className="pedido-header">
                <div class="alinear">
                    <h3>Pedido {p.id}</h3>
                     <span className={`estado-badge ${p.estado.toLowerCase()}`}>{p.estado}</span>
                  </div>
                

                <span className="fecha">{new Date(p.creado_en).toLocaleDateString()}</span>

                {p.estado === "pendiente" && (
                  <button className="btn-recibir-header"  onClick={() => marcarComoRecibido(p.id)}>Marcar como recibido</button>
                )}
              </div>

              <div className="pedido-contenido">
                {/* 🏎️ Productos */}
                <div className="pedido-detalles">
                  {p.detalles.map((d) => (
                    <div key={d.id} className="detalle-item">
                      <img
                        src={`${import.meta.env.VITE_API_URL}${d.vehiculo.imagen}`}
                        alt={d.vehiculo.marca}
                        className="detalle-img"
                      />
                      <div className="detalle-info">
                        <p className="detalle-nombre">
                          {d.vehiculo.marca} {d.vehiculo.modelo}
                        </p>
                        <p className="detalle-cantidad">
                          {d.cantidad} × {d.precio_unitario}€
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 📦 Información del pedido */}
                <div className="pedido-info">
                  <p><strong>Dirección:</strong> {p.direccion}</p>
                  <p><strong>Provincia:</strong> {p.provincia}</p>
                  <p><strong>Código postal:</strong> {p.codigo_postal}</p>
                  <p><strong>Total:</strong> {p.total}€</p>
                </div>
              </div>
            </li>
          ))}
        </ul>


      )}
    </div>
  );
}
