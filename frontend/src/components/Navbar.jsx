//Este archivo crea el header de la web, manejando la navegacion, el inicio de sesion y registro.
import { NavLink, useNavigate  } from "react-router-dom";  //crea enlaces con estilos activos al cambiar de página y permite al usuario redirigir
import Logo from "../assets/Logo.png";
import carritoImg from "../assets/carrito-de-compras.png";
import cerrarSesionIcono from "../assets/cerrar-sesion.png";
import imgPerfil from "../assets/usuario.png";
import Modal from "./Modal";
import "../styles/modal.css";
import { useState, useEffect } from "react";
import { api } from "../api/axios";  //conexión configurada de Axios para comunicarte con el backend
import { useAuth } from "../context/AuthContext"; //para usar el contexto que gestiona el usuario y el estado de login
import { useCarrito } from "../context/CarritoContext";  //para usar el contexto global del carrito
import "../styles/header.css";


export default function Navbar() {
  const { usuario, setUsuario, loginOpen, setLoginOpen, registroOpen, setRegistroOpen, cerrarSesion  } = useAuth();  //almacenamos el contexto del usuario logueado
  const { carrito } = useCarrito();  //almacenamos el contexto del carrito actual
  const [mensajeError, setMensajeError] = useState("");
  const [loginSubmitted, setLoginSubmitted] = useState(false);
  const [registroSubmitted, setRegistroSubmitted] = useState(false); //Indican ambos si se ha enviado el formulario (para mostrar errores).
  const navigate = useNavigate(); //Permite redirigir a otra págin, por ejemplo al cerrar sesion
  
  //Cierra sesion al hacer click en el icono de cerrar sesion
  const cerrarSesionClick = () => {
    cerrarSesion();   // Limpia el usuario y el token del localStorage
    navigate("/");    // redirige al inicio
  };

  //inicia sesion al hacer click en el boton "entrar" del modal de inicio de sesion
  const iniciarSesion = async (e) => {
    e.preventDefault();
    setLoginSubmitted(true);
    setMensajeError("");

    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk || !password) {  //Valida que el email y la contraseña sean válidos.
      setMensajeError("Introduce un correo válido y la contraseña.");
      return;
    }

    try {
      const res = await api.post("login/", { email, password });  //Envía la petición POST /login/ al backend y almacena la respuesta del servidor

      if (res.data && res.data.usuario) {
        //Si todo va bien, guarda el token JWT y el usuario en localStorage
        if (res.data.access) {
          localStorage.setItem("token", res.data.access);
        }
        localStorage.setItem("usuario", JSON.stringify(res.data.usuario));

        // Actualiza el contexto
        setUsuario(res.data.usuario);

        // Cierra el modal y limpia el estado
        setLoginOpen(false);
        setLoginSubmitted(false);
        setMensajeError("");
      } else {
        setMensajeError("Credenciales incorrectas.");
      }
    } catch (err) {  //Si hay error, muestra el mensaje correspondiente.
      if (err.response?.status === 404) {
        setMensajeError("Este usuario no existe. Regístrate antes de iniciar sesión.");
      } else if (err.response?.status === 401) {
        setMensajeError("Contraseña incorrecta.");
      } else {
        setMensajeError("Error al iniciar sesión. Inténtalo de nuevo.");
      }
    }
  };

  //registra al usuario e inicia la sesion automaticamente al hacer click en el boton "Registrar" del modal de registro
  const registrarse = async (e) => {
    e.preventDefault();
    setRegistroSubmitted(true);
    setMensajeError("");

    const nombre = e.target[0].value.trim();
    const email = e.target[1].value.trim();
    const password = e.target[2].value;

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!nombre || !emailOk || !password) {  //Valida campos de nombre, correo y contraseña.
      setMensajeError("Completa todos los campos con datos válidos.");
      return;
    }

    try {
      await api.post("registro/", { nombre, email, password });  //Envía el registro al backend (POST /registro/)
      const loginRes = await api.post("login/", { email, password }); //Si es correcto, inicia sesión automáticamente.

      if (loginRes.data && loginRes.data.usuario) { //Guarda usuario y token
        localStorage.setItem("token", loginRes.data.access);
        localStorage.setItem("usuario", JSON.stringify(loginRes.data.usuario));
        setUsuario(loginRes.data.usuario); //actualiza el contexto
      }
      setRegistroOpen(false);       // Cierra el modal de registro
      setRegistroSubmitted(false);
      setMensajeError("");
      } catch (err) { //Muestra errores si algo falla.
        if (err.response?.status === 409) {
          setMensajeError("Este correo ya está registrado. Inicia sesión en su lugar.");
        } else {
          setMensajeError("Error al registrar usuario. Inténtalo de nuevo.");
        }
      }

  };

  // Limpia los mensajes y estados al cerrar ambos modales
  useEffect(() => {
    if (!loginOpen) {
      setLoginSubmitted(false);
      setMensajeError("");
    }
  }, [loginOpen]);

  useEffect(() => {
    if (!registroOpen) {
      setRegistroSubmitted(false);
      setMensajeError("");
    }
  }, [registroOpen]);

  return (
    <header>
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="/"><img src={Logo} alt="Logo web" className="logo" /></a>
        <nav className="navbar-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? "activo" : "")}>Inicio</NavLink>
          <NavLink to="/tienda" className={({ isActive }) => (isActive ? "activo" : "")}>Tienda</NavLink>
          <NavLink to="/contacto" className={({ isActive }) => (isActive ? "activo" : "")}>Contacto</NavLink>
          {usuario?.rol === "cliente" && <NavLink to="/pedidos" className={({ isActive }) => (isActive ? "activo link-pedidos" : "link-pedidos")}>Mis pedidos</NavLink>}
          {usuario?.rol === "administrador" && (<a href="https://revline-autos.onrender.com/admin/" target="_blank" rel="noopener noreferrer" className="admin-link">Administración</a>)}
        </nav> {/*  Los enlaces de “Mis pedidos” o “Administración” solo se muestran si el usuario tiene el rol correcto.  */}

        <div className="navbar-login">
          {!usuario ? ( //Si el usuario no ha iniciado sesión, muestra los botones de login y registro.
            <>
              <button className="login-link" onClick={() => setLoginOpen(true)}>Inicio Sesión</button>
              <span className="separator">|</span>
              <button className="login-link" onClick={() => setRegistroOpen(true)}>Registro</button>
            </>
          ) : ( //En caso de que si, muestra su foto de perfil, su nombre, su carrito y cerrar sesion
            <div className="navbar-user">
              <img src={imgPerfil} alt="Perfil" className="navbar-avatar"/>
              <span className="usuario-nombre">{usuario.nombre || "Usuario"}</span>
              <NavLink to="/carrito" className="carrito-clicable">
                <img src={carritoImg} alt="Carrito" className="icono-carrito" />
                {carrito.length > 0 && (
                  <span className="carrito-count">
                    {carrito.reduce((total, p) => total + p.cantidad, 0)}
                  </span>
                )}
              </NavLink>
              <button className="btn-logout" onClick={cerrarSesionClick}>
                <img src={cerrarSesionIcono} alt="Cerrar sesión" className="icono-logout" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* se renderizan ambos modales reutilizando el mismo componente <Modal>. Cada uno tiene su formulario y errores asociados (mensajeError). */}

      {/* MODAL LOGIN */}
      <Modal isOpen={loginOpen} onClose={() => setLoginOpen(false)}>
        <h2>Iniciar Sesión</h2>
        {loginSubmitted && mensajeError && <p className="mensaje-error">{mensajeError}</p>}
        <form className="form-auth" onSubmit={iniciarSesion} autoComplete="off" noValidate>
          <input type="email" name="email" placeholder="Correo electrónico" autoComplete="off" />
          <input type="password" name="password" placeholder="Contraseña" autoComplete="new-password" />
          <button type="submit">Entrar</button>
        </form>
         <p className="modal-switch-text"> ¿No tienes cuenta aún?{" "}
          <button type="button" className="modal-switch-link" onClick={() => {setLoginOpen(false); setRegistroOpen(true);}}>Regístrate aquí</button>
         </p>
      </Modal>

      {/* MODAL REGISTRO */}
      <Modal isOpen={registroOpen} onClose={() => setRegistroOpen(false)}>
        <h2>Registro</h2>
        {registroSubmitted && mensajeError && <p className="mensaje-error">{mensajeError}</p>}
        <form className="form-auth" onSubmit={registrarse} autoComplete="off" noValidate>
          <input type="text" placeholder="Nombre" autoComplete="off" />
          <input type="email" placeholder="Correo electrónico" autoComplete="off" />
          <input type="password" placeholder="Contraseña" autoComplete="new-password" />
          <button type="submit">Registrar</button>
        </form>
        <p className="modal-switch-text">¿Ya tienes una cuenta?{" "}
          <button type="button"className="modal-switch-link"onClick={() => {setRegistroOpen(false);setLoginOpen(true);}}>Inicia sesión aquí</button>
        </p>
      </Modal>
    </header>
  );
}

