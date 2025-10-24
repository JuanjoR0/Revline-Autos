from rest_framework import viewsets, generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import Usuario, Vehiculo
from .serializers import ( RegistroUsuarioSerializer,VehiculoSerializer)
from django.middleware.csrf import get_token
from rest_framework.permissions import AllowAny
from django.db import connection
from django.contrib.auth import authenticate, login as django_login
from .serializers import UsuarioSerializer

class RegistroUsuarioView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = RegistroUsuarioSerializer
    permission_classes = [permissions.AllowAny]


class VehiculoViewSet(viewsets.ModelViewSet):
    queryset = Vehiculo.objects.all().order_by('-creado_en')
    serializer_class = VehiculoSerializer

    def get_permissions(self):
        # Solo administradores pueden modificar o borrar
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]


class PedidoViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]  # 👈 cualquiera puede crear pedidos (sin autenticación)

    def create(self, request):
        data = request.data

        # 🧠 Datos recibidos desde el frontend
        direccion = data.get("direccion")
        codigo_postal = data.get("codigo_postal")
        provincia = data.get("provincia")
        detalles = data.get("detalles", [])
        usuario_email = data.get("email")  # lo mandamos desde el frontend

        if not (direccion and codigo_postal and provincia and usuario_email):
            return Response({"error": "Faltan datos obligatorios."}, status=400)

        # Buscar usuario
        user = Usuario.objects.filter(email=usuario_email).first()
        if not user:
            return Response({"error": "Usuario no encontrado."}, status=404)

        try:
            # Crear el pedido principal
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO tienda_pedido (
                        usuario_id, direccion, codigo_postal, provincia, estado, pagado, creado_en, actualizado_en
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                    RETURNING id;
                """, [user.id, direccion, codigo_postal, provincia, "pendiente", True])
                pedido_id = cursor.fetchone()[0]

            # Insertar los detalles
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

            return Response({"mensaje": "Pedido creado correctamente", "pedido_id": pedido_id}, status=201)

        except Exception as e:
            print("❌ ERROR al crear pedido:", str(e))
            return Response({"error": "Error interno al crear el pedido", "detalles": str(e)}, status=500)
        

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):

    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({'error': 'Faltan credenciales'}, status=400)

    user = authenticate(request, username=email, password=password)
    if user is None:
        return Response({'error': 'Credenciales incorrectas'}, status=401)

    django_login(request, user)
    request.session.save()
    csrf_token = get_token(request)

      # ✅ Usa el serializer para enviar todos los campos del usuario
    user_data = UsuarioSerializer(user).data

    return Response({
        "mensaje": "Inicio de sesión exitoso",
        "usuario": user_data,
        "csrfToken": csrf_token,
        "session_key": request.session.session_key
    }, status=200)

@api_view(['POST'])
def registro(request):
    nombre = request.data.get('nombre')
    email = request.data.get('email')
    password = request.data.get('password')

    if not nombre or not email or not password:
        return Response({'error': 'Campos incompletos'}, status=status.HTTP_400_BAD_REQUEST)

    # Verificar si ya existe usuario
    if Usuario.objects.filter(email=email).exists():
        return Response({'error': 'Usuario ya existe'}, status=status.HTTP_409_CONFLICT)

    user = Usuario.objects.create_user(
        nombre=nombre,
        email=email,
        password=password
    )

    return Response({'mensaje': 'Usuario creado correctamente'}, status=status.HTTP_201_CREATED)

# ESTA ES 