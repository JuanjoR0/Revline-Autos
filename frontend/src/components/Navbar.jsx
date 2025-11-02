import { NavLink, useNavigate  } from "react-router-dom";
import Logo from "../assets/Logo.png";
import carritoImg from "../assets/carrito-de-compras.png";
import cerrarSesion from "../assets/cerrar-sesion.png";
import imgPerfil from "../assets/usuario.png";
import Modal from "./Modal";
import "../styles/modal.css";
import { useState, useEffect } from "react";
import { api } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext";



export default function Navbar() {
  const { usuario, setUsuario, loginOpen, setLoginOpen, registroOpen, setRegistroOpen, handleLogout  } = useAuth();
  const { carrito } = useCarrito();
  const [mensajeError, setMensajeError] = useState("");
  const [loginSubmitted, setLoginSubmitted] = useState(false);
  const [registroSubmitted, setRegistroSubmitted] = useState(false);
  const navigate = useNavigate();
  


  const handleLogoutClick = () => {
    handleLogout();   // limpia usuario + localStorage
    navigate("/");    // redirige al inicio
  };

 const handleLogin = async (e) => {
  e.preventDefault();
  setLoginSubmitted(true);
  setMensajeError("");

  const email = e.target.email.value.trim();
  const password = e.target.password.value;

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk || !password) {
    setMensajeError("Introduce un correo válido y la contraseña.");
    return;
  }

  try {
    const res = await api.post("login/", { email, password });

    if (res.data && res.data.usuario) {
      // ✅ Guarda el token JWT devuelto por el backend
      if (res.data.access) {
        localStorage.setItem("token", res.data.access);
      }

      // ✅ Guarda el usuario completo (incluye rol, email, etc.)
      localStorage.setItem("usuario", JSON.stringify(res.data.usuario));

      // ✅ Actualiza el contexto o estado global
      setUsuario(res.data.usuario);

      // ✅ Cierra el modal y limpia estado
      setLoginOpen(false);
      setLoginSubmitted(false);
      setMensajeError("");
    } else {
      setMensajeError("Credenciales incorrectas.");
    }
  } catch (err) {
    if (err.response?.status === 404) {
      setMensajeError("Este usuario no existe. Regístrate antes de iniciar sesión.");
    } else if (err.response?.status === 401) {
      setMensajeError("Contraseña incorrecta.");
    } else {
      setMensajeError("Error al iniciar sesión. Inténtalo de nuevo.");
    }
  }
};



  // 📝 REGISTRO
  const handleRegistro = async (e) => {
    e.preventDefault();
    setRegistroSubmitted(true);
    setMensajeError("");

    const nombre = e.target[0].value.trim();
    const email = e.target[1].value.trim();
    const password = e.target[2].value;

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!nombre || !emailOk || !password) {
      setMensajeError("Completa todos los campos con datos válidos.");
      return;
    }

    try {
      const res = await api.post("registro/", { nombre, email, password });

      // 🔹 Una vez registrado, iniciar sesión automáticamente
      const loginRes = await api.post("login/", { email, password });

      if (loginRes.data && loginRes.data.usuario) {
        localStorage.setItem("token", loginRes.data.access);
        localStorage.setItem("usuario", JSON.stringify(loginRes.data.usuario));
        setUsuario(loginRes.data.usuario);
      }

      // 🔹 Cierra el modal de registro
      setRegistroOpen(false);
      setRegistroSubmitted(false);
      setMensajeError("");
      } catch (err) {
        if (err.response?.status === 409) {
          setMensajeError("Este correo ya está registrado. Inicia sesión en su lugar.");
        } else {
          setMensajeError("Error al registrar usuario. Inténtalo de nuevo.");
        }
      }

  };

  // 🧹 Limpiar mensajes y estados al cerrar modales
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
        <img src={Logo} alt="Logo web" className="logo" />
        <nav className="navbar-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? "activo" : "")}>Inicio</NavLink>
          <NavLink to="/tienda" className={({ isActive }) => (isActive ? "activo" : "")}>Tienda</NavLink>
          <NavLink to="/contacto" className={({ isActive }) => (isActive ? "activo" : "")}>Contacto</NavLink>
          {usuario?.rol === "cliente" && <NavLink to="/pedidos" className={({ isActive }) => (isActive ? "activo link-pedidos" : "link-pedidos")}>Mis pedidos</NavLink>}
          {usuario?.rol === "administrador" && (<a href="http://127.0.0.1:8000/admin/" target="_blank" rel="noopener noreferrer" className="admin-link">Administración</a>)}
        </nav>

        <div className="navbar-login">
          {!usuario ? (
            <>
              <button className="login-link" onClick={() => setLoginOpen(true)}>Inicio Sesión</button>
              <span className="separator">|</span>
              <button className="login-link" onClick={() => setRegistroOpen(true)}>Registro</button>
            </>
          ) : (
            <div className="navbar-user">
              <img src={imgPerfil} alt="Perfil" className="navbar-avatar"/>
              <span className="usuario-nombre">{usuario.nombre || "Usuario"}</span>
              <NavLink to="/carrito" className="carrito-wrapper">
                <img src={carritoImg} alt="Carrito" className="icono-carrito" />
                {carrito.length > 0 && (
                  <span className="carrito-count">
                    {carrito.reduce((total, p) => total + p.cantidad, 0)}
                  </span>
                )}
              </NavLink>


              <button className="btn-logout" onClick={handleLogoutClick}>
                <img src={cerrarSesion} alt="Cerrar sesión" className="icono-logout" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODAL LOGIN */}
      <Modal isOpen={loginOpen} onClose={() => setLoginOpen(false)}>
        <h2>Iniciar Sesión</h2>
        {loginSubmitted && mensajeError && <p className="mensaje-error">{mensajeError}</p>}
        <form className="form-auth" onSubmit={handleLogin} autoComplete="off" noValidate>
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
        <form className="form-auth" onSubmit={handleRegistro} autoComplete="off" noValidate>
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
