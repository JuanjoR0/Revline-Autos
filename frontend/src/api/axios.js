import axios from "axios";

// Cliente HTTP base apuntando al backend
export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Adjunta el token CSRF si existe en las cookies
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

api.interceptors.request.use((config) => {
  const csrftoken = getCookie("csrftoken");
  if (csrftoken) {
    config.headers["X-CSRFToken"] = csrftoken;
  }
  return config;
});
