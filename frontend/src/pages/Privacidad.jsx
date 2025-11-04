import "../styles/privacidad.css";
import { motion } from "framer-motion";

export default function PoliticaPrivacidad() {
  return (
    <section className="politica-container">
      <motion.div 
        className="politica-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="politica-titulo">Política de Privacidad</h1>
        <p className="politica-intro">
          En <strong>RevLine Autos</strong>, nos tomamos muy en serio la protección de tus datos personales.
          Este documento explica cómo recopilamos, utilizamos y protegemos tu información.
        </p>

        <h2>1. Información que recopilamos</h2>
        <p>
          Recopilamos los datos necesarios para ofrecerte el mejor servicio posible:
          nombre, correo electrónico, dirección, número de teléfono y datos de pago (en su caso).
        </p>

        <h2>2. Uso de la información</h2>
        <p>
          Tus datos se utilizan exclusivamente para la gestión de pedidos, atención al cliente y envío de comunicaciones relacionadas con nuestras ofertas y productos.
        </p>

        <h2>3. Protección de datos</h2>
        <p>
          Utilizamos protocolos seguros (HTTPS) y encriptación para garantizar que tu información
          se mantenga protegida frente a accesos no autorizados.
        </p>

        <h2>4. Derechos del usuario</h2>
        <p>
          Puedes solicitar en cualquier momento el acceso, rectificación o eliminación de tus datos personales escribiéndonos a{" "}
          <a href="mailto:soporte@revlineautos.com">soporte@revlineautos.com</a>.
        </p>

        <h2>5. Cookies</h2>
        <p>
          Empleamos cookies únicamente para mejorar tu experiencia de navegación y personalizar el contenido mostrado.
          Puedes desactivarlas en la configuración de tu navegador.
        </p>

        <h2>6. Cambios en esta política</h2>
        <p>
          Nos reservamos el derecho de actualizar esta política cuando sea necesario.
          La fecha de la última modificación se mostrará siempre al final de este documento.
        </p>

        <p className="politica-fecha">Última actualización: 2 de noviembre de 2025</p>
      </motion.div>
    </section>
  );
}

//LIMPIO