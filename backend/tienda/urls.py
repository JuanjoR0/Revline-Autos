from django.urls import path, include
from rest_framework import routers
from .views import VehiculoViewSet, PedidoViewSet, RegistroUsuarioView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

router = routers.DefaultRouter()
router.register(r"vehiculos", VehiculoViewSet, basename="vehiculos")
router.register(r"pedidos", PedidoViewSet, basename="pedidos")

urlpatterns = [
    path("", include(router.urls)),

    # Rutas de autenticación JWT
    path("auth/register/", RegistroUsuarioView.as_view(), name="registro"),
    path("auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path('login/', views.login, name='login'),
    path('registro/', views.registro, name='registro'),
]
