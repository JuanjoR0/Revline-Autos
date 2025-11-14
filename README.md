RevLine Autos – Proyecto Final de Máster
Autor: Juan José Rodríguez Ortega  
Año: 2025  
Backend: Django 
Frontend: React + Vite  
Despliegue: Render (Django + React + PostgreSQL)
URL: https://revline-autos.onrender.com/
Repositorio GitHub: https://github.com/JuanjoR0/Revline-Autos

ESTRUCTURA PRINCIPAL:

/backend
 ├── manage.py
 ├── api/
     ├── models.py
     ├── serializers.py
     ├── views.py
     ├── urls.py
     ├── admin.py
     └── tokens.py
 ├── back/
     ├── settings.py
     └── urls.py
 ├── __init__.py
 └── media/
/frontend
 ├── src/
     ├── api/axios.js
     ├── assets
     ├── componentes/ .jsx
     ├── context/ .jsx
     ├── pages/ .jsx
     ├── styles/ 
     ├── App.jsx
     └── main.jsx
 ├── index.html
 ├── package.json
 └── vite.config.js


INSTALACION Y EJECUCION EN LOCAL

Backend (Django)
1. Clonar el repositorio:
   git clone https://github.com/JuanjoR0/Revline-Autos
2. Entrar a la carpeta backend:
   cd backend
3. Crear entorno virtual e instalar dependencias:
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
4. Aplicar migraciones y crear superusuario:
   python manage.py migrate
   python manage.py crear_admin
5. Ejecutar el servidor:
   python manage.py runserver

Frontend (React + Vite)
1. cd frontend
2. npm install
3. npm run dev

Para las variables de entorno:
El proyecto incluye archivos `.env.example` tanto en el backend como en el frontend.
Para ejecutarlo en local, copia esos archivos y renómbralos a `.env`.


USUARIOS DE PRUEBA:

Administrador:
- Email: admin@revlineautos.com
- Contraseña: 12345678
Cliente:
- Email: juanjo@revlineautos.com
- Contraseña: Cliente123


INSTRUCCIONES DE USO;

Los usuarios cliente pueden acceder libremente a la web de RevLine Autos para navegar por las secciones de inicio,
tienda y contacto, visualizar vehículos y consultar sus detalles sin necesidad de identificarse.
No obstante, para poder añadir productos al carrito o realizar pedidos deben registrarse o iniciar sesión. 
El registro se realiza desde el menú superior, proporcionando nombre, correo y contraseña, y una vez iniciada 
la sesión, el usuario verá su nombre y avatar en la parte superior. Desde ese momento puede añadir vehículos 
al carrito, controlar las cantidades, revisar sus pedidos desde la sección “Mis pedidos” y cerrar sesión cuando 
lo desee. Si no se ha identificado, el sistema le avisará cuando intente realizar una acción que requiere autenticación.

Los administradores, tras iniciar sesión con sus credenciales, verán habilitado un enlace adicional en el 
menú superior que les da acceso al panel de Administración, donde pueden gestionar todo el contenido del sitio. 
Desde este panel pueden añadir, editar o eliminar vehículos, modificar precios y stock, revisar y actualizar el 
estado de los pedidos, así como consultar y administrar los usuarios registrados. Solo las cuentas con rol de 
administrador pueden acceder a este panel, y se recomienda cerrar sesión tras cada uso para garantizar la seguridad 
del sistema.

EXPLICACIÓN TÉCNICA;
El index.html forma el esqueleto de toda la app , este va a contener main.jsx, que es el motor de arranque de la app.
A su vez main.jsx va a contener App.jsx, que es el componente raiz que renderiza todas las páginas y componentes de la web, 
estos contienen los contextos globales que gestionan la información compartida en toda la app.
Se configura axios.js para conectar con la API, que se encarga de intercambiar datos en JSON entre frontend y backend,
urls.py la dirige a la vista correspondiente en views.py, La vista usa los serializadores para transformar los datos
y los modelos para leer o escribir en la base de datos.
Finalmente, Django devuelve una respuesta JSON que viaja de vuelta al frontend para actualizar la interfaz.

index.html  →  main.jsx  →  App.jsx  →  componentes/páginas  →  contextos globales  →  axios.js  →  API Django  → 
urls.py  →  views.py  →  serializers.py  →  models.py  →  Base de datos

CONTROL DE ERRORES;
- Mediante uso de (try/except) o (try/catch)
- Mediante manejo de códigos HTTP en la API que lanza respuestas con los tipos de error (404, 400, 500), que el frontend React interpreta para mostrar mensajes informativos al usuario.
- Mediante registro persistente de errores usando el sistema de logging de Django, que escribe en los logs del sistema, esto permite revisarlo mas tarde.

AUTENTICACIÓN;
- Login/Registro, React envía credenciales a Django por HTTPS.
- Tokens/Sesión, Django REST Framework SimpleJWT genera un access token y un refresh token.
- React guarda el token en localStorage y envia el token en el header (Authorization: Bearer)
- Logout, limpieza de token/estado en cliente y cierre de sesión en servido

SEGURIDAD;
- Hash de contraseñas: gestionado por Django, al crear usuarios nunca guardamos contraseñas en claro ni se muestran en el panel de administracion.
- Rutas protegidas: el frontend usa guards (React Router) para ocultar rutas de cliente autenticado y las de admin.
- Validación de entrada: serializadores y validaciones de DRF (tipos, longitudes, required, formatos como email).
- Códigos HTTP claros: 400/401/403/404/409/422/500
- Consultas seguras: ORM de Django evita inyección SQL; serialización controlada evita exponer campos sensibles.

MEJORAS UX/UI:
- En un campo Email solo se puede introducir un texto en formato email.
- En un campo Contraseña solo se puede meter texto sin espacios.
- Si el usuario intenta iniciar sesion sin estar registrado se le dice que primero se registre.
- Si la contraseña introducida para un email registrado es incorrecta se indica.
- Si el usuario se intenta registrar con un email ya registrado se le indica que inicie sesion.
- Si el usuario intenta añadir al carrito sin tener iniciada sesion se le lleva al modal inicio sesion.
- Si el usuario hace un pedido , a los vehiculos de ese pedido se les baja el stock.
- Si el stock es 0 se desactiva el boton añadir al carrito.
- Desde el carrito se puede subir el numero de cantidad en el maximo del stock.
- Si el usuario inicia sesion se cambia en el header el contenedor de Inicio|Registro por el de usuario (foto perfil, nombre, carrito y cerrar sesion).
- Si el usuario inicia sesion aparece en el menu del header Mis pedidos.
- Si el usuario cierra sesion la web se refresca y lleva al inicio.
- Si el usuario realiza un pedido el carrito se vacia.
- El cliente puede cambiar el estado de su pedido .
- Los campos del proceso de pago solo aceptan formatos correctos.
- Hay un boton de autocompletar los campos con informacion aleatoria para amenizar el proceso de compra falsa.
- El footer y header aparecen siempre, solo cambia el contenido que se muestra en el main.
- Si el usuario se registra como administrador le aparece en el menu la seccion Administracion.
- Tras registrarse correctamente, el usuario inicia sesión automáticamente sin necesidad de hacerlo manualmente.
- Al recargar la página, el sistema mantiene la sesión activa (usuario cargado desde localStorage).
- Si el usuario añade un producto al carrito, se muestra un toast 'Producto añadido al carrito'
- Si se elimina un producto o se vacía el carrito, se actualiza automáticamente tanto en la vista como en localStorage.
- Si el usuario completa un pedido , se muestra un toast 'Pedido realizado correctamente'.
- Validación visual (borde rojo/verde) en campos de formularios.
- Si el usuario tiene un producto ya añadido al carrito no puede volver a añadirlo, el texto del modal lo indica.
- Cada usuario tiene su propio carrito independiente, guardado en localStorage.
- Si el usuario cierra sesión y luego vuelve a iniciar, recupera su carrito anterior.



Fuentes para la informacion; 
- python.org
- es.react.dev
- Chat GPT
- GitHub Copilot (extension VS)
- developer.mozilla.org (para los metodos HTTP Request)
