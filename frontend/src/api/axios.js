import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  withCredentials: true, // 🔥 Importante para que mande cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para CSRF
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
