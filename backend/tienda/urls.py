# este archivo define todas las rutas (endpoints) que tu API del backend Django ofrece al frontend React. Es básicamente el mapa que conecta las URL con las vistas correspondientes
from django.urls import path, include #funciones de Django para definir rutas
from rest_framework import routers #sistema automático de Django REST Framework que genera rutas para los ViewSets (como vehiculos y pedidos).
from .views import VehiculoViewSet, PedidoViewSet, RegistroUsuarioView # nuestras vistas principales
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView #vistas del paquete SimpleJWT para emitir y renovar tokens JWT.
from . import views #importamos el archivo de vistas completo (para usar funciones como login o registro).

router = routers.DefaultRouter() #Crea un enrutador automático (DefaultRouter) de Django REST Framework
#definimos la url base que tendrá el router, la vista que manejará y el nombre base, tanto para vehiculos como para pedidos.
#Gracias a esto, se crean automáticamente las rutas RESTful, GET, POST, PUT/PATCH, DELETE. partiendo del basename.
router.register(r"vehiculos", VehiculoViewSet, basename="vehiculos") 
router.register(r"pedidos", PedidoViewSet, basename="pedidos")

urlpatterns = [
    path("", include(router.urls)), #esto incluye todas las rutas que el router generó automáticamente

    # Rutas de autenticación JWT
    path("auth/register/", RegistroUsuarioView.as_view(), name="registro"), #esta crea un nuevo usuario llamando a RegistroUsuarioView
    path("auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"), #este es el endpoint estándar de SimpleJWT que devuelve el par de tokens (access y refresh) tras iniciar sesión
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"), #Permite renovar el token de acceso cuando caduca
    path('login/', views.login, name='login'), #maneja el inicio de sesión personalizado, devuelve el token y los datos del usuario (usando token_views.py).
    path('registro/', views.registro, name='registro'), #crea un nuevo usuario desde el formulario del frontend
    #Estos endpoints son equivalentes a los definidos arriba, pero personalizados a nuestro flujo de autenticación (email y contraseña)
]

