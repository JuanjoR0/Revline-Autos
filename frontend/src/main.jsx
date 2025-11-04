//Aqui se monta la App con Vite y React

import { StrictMode } from 'react'  //Para detectar errores en la aplicacion anivel global
import { createRoot } from 'react-dom/client'  //Para conectar la aplicación React con el div principal del HTML
import { BrowserRouter } from "react-router-dom"; //Permite navegar entre páginas sin recargar el sitio, controlando la URL con la History API del navegador
import "./styles/global.css";
import App from './App.jsx'
import { AuthProvider } from "./context/AuthContext.jsx";
import { CarritoProvider } from "./context/CarritoContext.jsx";
import { NotificacionProvider } from "./context/NotificacionContext";

createRoot(document.getElementById('root')).render(
   <StrictMode>
      <BrowserRouter>
         <AuthProvider>
            <NotificacionProvider>
               <CarritoProvider>
                  <App />
               </CarritoProvider>
            </NotificacionProvider>
         </AuthProvider>
      </BrowserRouter>
  </StrictMode>
)


//LIMPIO