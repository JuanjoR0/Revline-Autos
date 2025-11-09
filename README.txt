INSTRUCCIONES DE USO;
Los usuarios cliente pueden acceder libremente a la web de RedLine Autos para navegar por las secciones de inicio,
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

Validaciones y funcionalidades:
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
- Si el usuario inicia sesion aparece en el menu del header Mis pediddos.
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


EN LOCAL (Desarrollo);
Para ejecutar el backend(Django) (python manage.py runserver)
Para ejecutar el frontend(Vite + React) (npm run dev)
Para generar un archivo de migracion (python manage.py makemigrations)
Para ejecutar esa migracion (python manage.py migrate)