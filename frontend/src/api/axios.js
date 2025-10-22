// Configuración base de Axios para conectar con el backend Django
import axios from "axios";

export const api = axios.create({
   baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: añade automáticamente el token JWT si el usuario está logueado
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
