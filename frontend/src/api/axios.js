//este archivo es una configuración centralizada del cliente HTTP que tu frontend usa para comunicarse con el backend Django.
//Axios es una librería que sirve para hacer peticiones HTTP y permite definir una configuracion global de URLbase, manejar interceptores y controlar errores ,autenticacion y cookies.
import axios from "axios"; //Importamos la librería Axios, que se usa para hacer llamadas al servidor (API)

export const api = axios.create({
  baseURL: "https://revline-autos.onrender.com/api/",  //Definidmos la dirección base del backend Django
  withCredentials: true, // Importante para que mande cookies cn cada peticion a la API, aquí ira el tooken de autenticacion
  headers: { //Define los encabezados que van en cada petición. Aquí se especifica que el cuerpo de las peticiones será JSON
    "Content-Type": "application/json",
  },
});

// Interceptores para CSRF. Los interceptores son funciones que se ejecutan antes de enviar cada petición HTTP

// Es una función auxiliar que busca la cookie "csrftoken" en el navegador y devuelve su valor.
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") { //document.cookie devuelve todas las cookies del sitio en formato texto
    const cookies = document.cookie.split(";");    //Se separan por ;
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + "=")) {         //Se recorre una por una hasta encontrar la que empiece con el nombre pedido (csrftoken=)
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1)); //Si la encuentra, devuelve su valor decodificado
        break;
      }
    }
  }
  return cookieValue;
}

api.interceptors.request.use((config) => {
  const csrftoken = getCookie("csrftoken"); //Llama a getCookie("csrftoken") para obtener el token CSRF del navegador
  if (csrftoken) { //Si existe, lo añade al header de la petición
    config.headers["X-CSRFToken"] = csrftoken;
  }
  return config; //Devuelve la configuración modificada (config), y Axios sigue con la petición
});
