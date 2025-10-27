from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from rest_framework_simplejwt.views import TokenRefreshView
from tienda.token_views import CustomTokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('tienda.urls')), 
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# 👉 Primero, servir los archivos MEDIA en modo DEBUG
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# 👉 Luego, la ruta “catch-all” de la SPA
urlpatterns += [
    re_path(r'^(?!api/|admin/|media/).*$', TemplateView.as_view(template_name='index.html')),
]

# ESTE es 