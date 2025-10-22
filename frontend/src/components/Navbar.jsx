import { NavLink, useNavigate  } from "react-router-dom";
import Logo from "../assets/Logo.png";
import carrito from "../assets/carrito-de-compras.png";
import cerrarSesion from "../assets/cerrar-sesion.png";
import Modal from "./Modal";
import "../styles/modal.css";
import { useState, useEffect } from "react";
import { api } from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { usuario, setUsuario, loginOpen, setLoginOpen, registroOpen, setRegistroOpen, handleLogout  } = useAuth();
  const [mensajeError, setMensajeError] = useState("");
  const [loginSubmitted, setLoginSubmitted] = useState(false);
  const [registroSubmitted, setRegistroSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    handleLogout();   // limpia usuario + localStorage
    navigate("/");    // redirige al inicio
  };

  // 🧠 LOGIN
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
        setUsuario(res.data.usuario);
        setLoginOpen(false);
        setLoginSubmitted(false);
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
      await api.post("registro/", { nombre, email, password });
      alert("Registro completado. Ahora puedes iniciar sesión.");
      setRegistroOpen(false);
      setRegistroSubmitted(false);
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
          <NavLink to="/blog" className={({ isActive }) => (isActive ? "activo" : "")}>Blog</NavLink>
          {usuario && <NavLink to="/pedidos" className={({ isActive }) => (isActive ? "activo link-pedidos" : "link-pedidos")}>Mis pedidos</NavLink>}
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
              <img src={usuario.imagen && usuario.imagen !== "" ? usuario.imagen : "/usuario.png"} alt="Perfil" className="navbar-avatar"/>
              <span className="usuario-nombre">{usuario.nombre || "Usuario"}</span>
              <NavLink to="/carrito">
                <img src={carrito} alt="Carrito" className="icono-carrito" />
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
      </Modal>
    </header>
  );
}
