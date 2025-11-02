import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
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
