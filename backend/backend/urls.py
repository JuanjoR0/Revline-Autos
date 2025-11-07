# Este arhivo define todas las rutas principales del backend, incluyendo las de la API, el panel de administración y los archivos estáticos.
# Es el punto de entrada de todas las rutas del servidor Django. Django busca en este archivo para decidir qué vista o aplicación debe responder
from django.contrib import admin
from django.urls import path, include, re_path # Herramientas para definir las rutas
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from rest_framework_simplejwt.views import TokenRefreshView
from tienda.token_views import CustomTokenObtainPairView #Nuestra vista personalizada de login que genera tokens con más datos del usuario

urlpatterns = [ #Esto crea las rutas principales del backend
    path('admin/', admin.site.urls), # Abre el panel de administración de Django
    path('api/', include('tienda.urls')), # Incluye todas las rutas de la app tienda (vehículos, pedidos, registro, login, etc.)
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'), #Permite al usuario obtener un token JWT
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), #Refresca el token JWT cuando expira
]

# Servir archivos MEDIA (imágenes subidas)
# Django no sirve archivos media automáticamente en producción, por eso lo activamos también fuera de DEBUG
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Servir archivos estáticos generados por Vite (JS, CSS, assets)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static('/assets/', document_root=settings.BASE_DIR / 'frontend_dist/assets')

# Esta línea es clave para que el frontend React funcione con Django
# Si la ruta no empieza con /api/, /admin/, /media/, /static/ o /assets/, sirve el index.html del frontend
urlpatterns += [
    re_path(
        r'^(?!api/|admin/|media/|static/|assets/).*$', 
        TemplateView.as_view(template_name='index.html')
    ),
]
