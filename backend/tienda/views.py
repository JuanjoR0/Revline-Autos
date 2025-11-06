# Este archivo es el núcleo del backend, aqui definimos cómo va a responder la API a las peticiones que llegan desde el frontend React
# las vistas (views) son las funciones o clases que reciben las peticiones HTTP (GET, POST, PATCH, etc.) y devuelven una respuesta JSON.
from rest_framework import viewsets, generics, permissions, status #clases base de Django REST Framework que simplifican la creación de API REST
from rest_framework.response import Response  #estructura de respuesta en formato JSON
from rest_framework.decorators import api_view, permission_classes
from .models import Usuario, Vehiculo
from .serializers import ( RegistroUsuarioSerializer,VehiculoSerializer)
from rest_framework.permissions import AllowAny
from django.db import connection  # permite ejecutar consultas SQL manuales.
from django.contrib.auth import authenticate
from .serializers import UsuarioSerializer
from rest_framework.decorators import action
from .models import Pedido
from .serializers import PedidoSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken #crea los tokens JWT.

#Crea un endpoint /auth/register/ que permite registrar usuarios.
class RegistroUsuarioView(generics.CreateAPIView):
    queryset = Usuario.objects.all() 
    serializer_class = RegistroUsuarioSerializer #Usa el RegistroUsuarioSerializer que valida y crea el usuario con contraseña cifrada
    permission_classes = [permissions.AllowAny] #no hay que estar autenticado para acceder ya que aun no hay cuenta

#Crea un conjunto de rutas REST (/vehiculos/) para listar, crear, editar o borrar vehículos
class VehiculoViewSet(viewsets.ModelViewSet):
    queryset = Vehiculo.objects.all().order_by('-creado_en') 
    serializer_class = VehiculoSerializer # Usa el VehiculoSerializer para convertir los objetos a JSON

    def get_permissions(self):
        # Solo administradores pueden modificar,crear o borrar
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()] #Cualquier usuario (incluso no logueado) puede ver la lista de vehículos

#Define las rutas para crear y gestionar pedidos (/pedidos/).
class PedidoViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny] 

    def create(self, request): #Obtiene los datos enviados desde el frontend
        data = request.data

        direccion = data.get("direccion")
        codigo_postal = data.get("codigo_postal")
        provincia = data.get("provincia")
        detalles = data.get("detalles", [])
        usuario_email = data.get("email") 

        #Comprueba que se hayan enviado todos los datos necesarios.
        if not (direccion and codigo_postal and provincia and usuario_email):
            return Response({"error": "Faltan datos obligatorios."}, status=400)

        #Busca al usuario en la base de datos para asociarlo al pedido.
        user = Usuario.objects.filter(email=usuario_email).first()
        if not user:
            return Response({"error": "Usuario no encontrado."}, status=404)

        try:
           # Usa SQL manual para insertar el pedido directamente en la tabla tienda_pedido. Devuelve el id del pedido recién creado.
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO tienda_pedido (
                        usuario_id, direccion, codigo_postal, provincia, estado, pagado, creado_en, actualizado_en
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                    RETURNING id;
                """, [user.id, direccion, codigo_postal, provincia, "pendiente", True])
                pedido_id = cursor.fetchone()[0]

            # Insertar los detalles(los vehiculos) en el pedido en la tabla tienda_detallepedido
            for det in detalles:
                vehiculo_id = det.get("vehiculo_id")
                cantidad = det.get("cantidad")
                precio_unitario = det.get("precio_unitario")

                if not (vehiculo_id and cantidad and precio_unitario):
                    continue

                with connection.cursor() as cursor:
                    cursor.execute("""
                        INSERT INTO tienda_detallepedido (pedido_id, vehiculo_id, cantidad, precio_unitario)
                        VALUES (%s, %s, %s, %s);
                    """, [pedido_id, vehiculo_id, cantidad, precio_unitario])

                # Actualiza el stock del vehículo después de realizar la compra (Lanzar la SQL).
                vehiculo = Vehiculo.objects.filter(id=vehiculo_id).first()
                if vehiculo:
                    vehiculo.stock = max(0, vehiculo.stock - cantidad)
                    vehiculo.save()

            #Devuelve un mensaje confirmando la creación del pedido
            return Response({"mensaje": "Pedido creado correctamente", "pedido_id": pedido_id}, status=201)

        #Captura errores inesperados y los muestra en la consola y respuesta JSON
        except Exception as e:
            print("ERROR al crear pedido:", str(e))
            return Response({"error": "Error interno al crear el pedido", "detalles": str(e)}, status=500)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def mis_pedidos(self, request): # Devuelve todos los pedidos del usuario autenticado
        usuario = request.user
        pedidos = Pedido.objects.filter(usuario=usuario).order_by('-creado_en')
        serializer = PedidoSerializer(pedidos, many=True) #Usa el PedidoSerializer para transformar los pedidos en JSON
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated])
    def marcar_recibido(self, request, pk=None): #Permite al usuario cambiar el estado de su pedido a “entregado”
        try:
            pedido = Pedido.objects.get(pk=pk, usuario=request.user) #Solo puede modificar sus propios pedidos (no los de otros usuarios).
            pedido.estado = "entregado"
            pedido.save()
            return Response({"mensaje": "Pedido marcado como entregado"}, status=200)
        except Pedido.DoesNotExist:
            return Response({"error": "Pedido no encontrado o no pertenece al usuario"}, status=404)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request): #Define una función de vista que permite iniciar sesión con email y contraseña
    #Obtiene las credenciales enviadas desde el frontend
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({'error': 'Faltan credenciales'}, status=400)

    # Comprueba que el email exista en la bd antes de autenticar (Que ya este registrado)
    from .models import Usuario
    user_exists = Usuario.objects.filter(email=email).first()

    if not user_exists:
        return Response(
            {'error': 'Este usuario no está registrado. Regístrate antes de iniciar sesión.'},
            status=404
        )

    # Usamos esta función para verificar la contraseña del usuario
    user = authenticate(request, username=email, password=password)
    if user is None:
        return Response({'error': 'Contraseña incorrecta.'}, status=401)

    # Si todo está correcto, crea los tokens JWT (access y refresh) y debajo serializa los datos del usuario para enviarlos al frontend.
    refresh = RefreshToken.for_user(user)
    user_data = UsuarioSerializer(user).data

    return Response({
        "mensaje": "Inicio de sesión exitoso",
        "usuario": user_data,
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }, status=200)

@api_view(['POST'])
def registro(request): #Crea un nuevo usuario con los datos enviados desde el formulario React.
    nombre = request.data.get('nombre')
    email = request.data.get('email')
    password = request.data.get('password')

    if not nombre or not email or not password: 
        return Response({'error': 'Campos incompletos'}, status=status.HTTP_400_BAD_REQUEST)

    # Verificar si ya existe usuario
    if Usuario.objects.filter(email=email).exists(): #comprueba que ese email aun no exista en la bd
        return Response({'error': 'Usuario ya existe'}, status=status.HTTP_409_CONFLICT)

    # Ejecutamos create_user() definido previamente en nuestro modelo UsuarioManager para crear el usuario.
    Usuario.objects.create_user( 
        nombre=nombre,
        email=email,
        password=password
    )

    return Response({'mensaje': 'Usuario creado correctamente'}, status=status.HTTP_201_CREATED)
