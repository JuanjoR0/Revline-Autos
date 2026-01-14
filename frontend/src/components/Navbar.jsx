import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";
import carritoImg from "../assets/carrito-de-compras.png";
import cerrarSesionIcono from "../assets/cerrar-sesion.png";
import imgPerfil from "../assets/usuario.png";
import Modal from "./Modal";
import "../styles/modal.css";
import { useState, useEffect } from "react";
import { api } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext";
import "../styles/header.css";
import menuIcon from "../assets/menu.png";
import closeIcon from "../assets/cerrar.png";

export default function Navbar() {
  const { usuario, setUsuario, loginOpen, setLoginOpen, registroOpen, setRegistroOpen, cerrarSesion } = useAuth();
  const { carrito } = useCarrito();
  const [mensajeError, setMensajeError] = useState("");
  const [loginSubmitted, setLoginSubmitted] = useState(false);
  const [registroSubmitted, setRegistroSubmitted] = useState(false);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Evita que el body haga scroll mientras el menú móvil está abierto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const cerrarSesionClick = () => {
    cerrarSesion();
    navigate("/");
  };

  const iniciarSesion = async (e) => {
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
        if (res.data.access) {
          localStorage.setItem("token", res.data.access);
        }
        localStorage.setItem("usuario", JSON.stringify(res.data.usuario));
        setUsuario(res.data.usuario);
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

  const registrarse = async (e) => {
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
      const loginRes = await api.post("login/", { email, password });

      if (loginRes.data && loginRes.data.usuario) {
        localStorage.setItem("token", loginRes.data.access);
        localStorage.setItem("usuario", JSON.stringify(loginRes.data.usuario));
        setUsuario(loginRes.data.usuario);
      }
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
    <header className={`navbar ${menuOpen ? "menu-open" : ""}`}>
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="/"><img src={Logo} alt="Logo web" className="logo" /></a>
        <nav className="navbar-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? "activo" : "")}>Inicio</NavLink>
          <NavLink to="/tienda" className={({ isActive }) => (isActive ? "activo" : "")}>Tienda</NavLink>
          <NavLink to="/contacto" className={({ isActive }) => (isActive ? "activo" : "")}>Contacto</NavLink>
          {usuario?.rol === "cliente" && <NavLink to="/pedidos" className={({ isActive }) => (isActive ? "activo link-pedidos" : "link-pedidos")}>Mis pedidos</NavLink>}
          {usuario?.rol === "administrador" && (<a href={`${import.meta.env.VITE_API_URL}/admin/`} target="_blank" rel="noopener noreferrer" className="admin-link">Administración</a>)}
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
              <img src={imgPerfil} alt="Perfil" className="navbar-avatar" />
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

        <button className="navbar-toggle" aria-label="Abrir menú" aria-expanded={menuOpen} aria-controls="navbar-drawer" onClick={() => setMenuOpen((v) => !v)}>
          <img src={menuIcon} alt="Abrir menú" />
        </button>

        <div className={`navbar-overlay ${menuOpen ? "show" : ""}`} onClick={() => setMenuOpen(false)} />

        <aside id="navbar-drawer" className={`navbar-drawer ${menuOpen ? "open" : ""}`} role="dialog" aria-modal="true">
          <div className="drawer-header">
            <span>Usuario</span>
            <button className="drawer-close" onClick={() => setMenuOpen(false)}>
              <img src={closeIcon} alt="Cerrar" />
            </button>
          </div>

          <hr />

          <div className="drawer-login">
            {!usuario ? (
              <>
                <button className="login-link" onClick={() => { setLoginOpen(true); setMenuOpen(false); }}>
                  Inicio Sesión
                </button>
                <button className="login-link" onClick={() => { setRegistroOpen(true); setMenuOpen(false); }}>
                  Registro
                </button>
              </>
            ) : (
              <div className="navbar-user">
                <img src={imgPerfil} alt="Perfil" className="navbar-avatar" />
                <span className="usuario-nombre">{usuario.nombre || "Usuario"}</span>

                <NavLink to="/carrito" className="carrito-clicable" onClick={() => setMenuOpen(false)}>
                  <img src={carritoImg} alt="Carrito" className="icono-carrito" />
                  {carrito.length > 0 && (
                    <span className="carrito-count">
                      {carrito.reduce((total, p) => total + p.cantidad, 0)}
                    </span>
                  )}
                </NavLink>

                <button className="btn-logout" onClick={() => { cerrarSesionClick(); setMenuOpen(false); }}>
                  <img src={cerrarSesionIcono} alt="Cerrar sesión" className="icono-logout" />
                </button>
              </div>
            )}
          </div>
        </aside>

      </div>

      {/* Modales de login y registro */}
      <Modal isOpen={loginOpen} onClose={() => setLoginOpen(false)}>
        <h2>Iniciar Sesión</h2>
        {loginSubmitted && mensajeError && <p className="mensaje-error">{mensajeError}</p>}
        <form className="form-auth" onSubmit={iniciarSesion} autoComplete="off" noValidate>
          <input type="email" name="email" placeholder="Correo electrónico" autoComplete="off" />
          <input type="password" name="password" placeholder="Contraseña" autoComplete="new-password" />
          <button type="submit">Entrar</button>
        </form>
        <p className="modal-switch-text">¿No tienes cuenta aún?{" "}
          <button type="button" className="modal-switch-link" onClick={() => { setLoginOpen(false); setRegistroOpen(true); }}>Regístrate aquí</button>
        </p>
      </Modal>

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
          <button type="button" className="modal-switch-link" onClick={() => { setRegistroOpen(false); setLoginOpen(true); }}>Inicia sesión aquí</button>
        </p>
      </Modal>
    </header>
  );
}
