import os
import django

# Configurar entorno Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from tienda.models import Usuario

# Crear superusuario si no existe
if not Usuario.objects.filter(email="admin@revlineautos.com").exists():
    Usuario.objects.create_superuser(
        email="admin@revlineautos.com",
        password="12345678", 
        nombre="Admin",
    )
    print("Superusuario creado correctamente.")
else:
    print("El superusuario ya existe.")
