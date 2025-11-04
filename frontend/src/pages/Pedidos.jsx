import { useEffect, useState } from "react";
import "../styles/pedidos.css";

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState([]); //Guarda los pedidos del usuario que vienen del backend
  const [filtro, setFiltro] = useState("todos"); //Guarda el tipo de filtro actual seleccionado
  const [loading, setLoading] = useState(true); //Guarda si la página está cargando datos o no

  const marcarComoRecibido = async (pedidoId) => {
    try {
      const token = localStorage.getItem("token"); //obtenemos el token de autenticacion (codigo que identifica al usuario que ha iniciado sesion) directamente del localStorage
      const res = await fetch(  //Llamamos a la API para marcar el pedido con ese ID como recibido, usando el token del usuario para verificar que tiene permiso
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
      console.error("Error al marcar recibido:", err);
    }
  };

//Ejecuta la función fetchPedidos() una sola vez, justo cuando el componente se monta (se carga por primera vez en pantalla)
 useEffect(() => {
  const fetchPedidos = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/pedidos/mis_pedidos/`, { //hacemos una petición HTTP GET a la API para que nos devuelva los pedidos que pertenecen a ese usuario autenticado.
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // aquí se pasa el JWT
        },
      });

      if (!res.ok) {
        console.error("Error al cargar pedidos:", res.status);
        setPedidos([]); //Si da error se deja la lista vacia
        return;
      }

      const data = await res.json(); //Convierte la respuesta JSON del servidor en un objeto JavaScript
      setPedidos(data); //Luego guardamos esa información en el estado local pedidos para que se vuelva a renderizar con lo actualizado
    } catch (error) {
      console.error(" Error al obtener pedidos:", error);
    } finally {
      setLoading(false); //Cuando el proceso termina se quita el mensaje "Cargando Pedidos..."
    }
  };

  fetchPedidos();
}, []);

  // Filtrado por estado de pedido
  const pedidosFiltrados = pedidos.filter((p) => {
    if (filtro === "todos") return true;
    return p.estado.toLowerCase() === filtro;
  });

  return (
    <div className="pedidos-container">
      <div className="pedidos-filtros">
        <button onClick={() => setFiltro("todos")} className={filtro === "todos" ? "activo" : ""}>Todos</button>
        <button onClick={() => setFiltro("pendiente")} className={filtro === "pendiente" ? "activo" : ""}> Pendientes</button>
        <button onClick={() => setFiltro("entregado")}className={filtro === "entregado" ? "activo" : ""}>Entregados</button>
      </div>

      {loading ? ( //se muestra un mensaje temporal mientras se cargan los datos
        <p>Cargando pedidos...</p>
      ) : pedidosFiltrados.length === 0 ? (
        <p>No tienes pedidos {filtro === "todos" ? "" : filtro}.</p>
      ) : (
        <ul className="lista-pedidos">
          {pedidosFiltrados.map((p) => (  //Cogemos el array y creamos un componente visual por cada pedido (p) que contenga.
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
                <div className="pedido-detalles">
                  {p.detalles.map((d) => ( //pintamos un contenedor con la info de cada detallePedido del array
                    <div key={d.id} className="detalle-item">
                      <img src={`${import.meta.env.VITE_API_URL}${d.vehiculo.imagen}`} alt={d.vehiculo.marca} className="detalle-img" />
                      <div className="detalle-info">
                        <p className="detalle-nombre">{d.vehiculo.marca} {d.vehiculo.modelo}</p>
                        <p className="detalle-cantidad">{d.cantidad} × {d.precio_unitario}€</p>
                      </div>
                    </div>
                  ))}
                </div>

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


//LIMPIO