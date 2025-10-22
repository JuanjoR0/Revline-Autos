from rest_framework import viewsets, generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import Usuario, Vehiculo, Pedido
from .serializers import ( RegistroUsuarioSerializer,VehiculoSerializer, PedidoSerializer)


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


class PedidoViewSet(viewsets.ModelViewSet):
    serializer_class = PedidoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.rol == 'administrador':
            return Pedido.objects.all().order_by('-creado_en')
        return Pedido.objects.filter(usuario=user).order_by('-creado_en')

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({'error': 'Faltan credenciales'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = Usuario.objects.get(email=email)
    except Usuario.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    if not user.check_password(password):
        return Response({'error': 'Contraseña incorrecta'}, status=status.HTTP_401_UNAUTHORIZED)

    nombre_usuario = user.first_name if user.first_name else user.username
    imagen_url = ""
    if user.imagen_perfil:
        imagen_url = request.build_absolute_uri(user.imagen_perfil.url)

    return Response({
        'usuario': {
            'nombre': nombre_usuario,
            'email': user.email,
            'imagen': imagen_url
        }
    }, status=status.HTTP_200_OK)

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
