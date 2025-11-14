from django.core.management.base import BaseCommand
from tienda.models import Usuario

class Command(BaseCommand):
    help = "Crea un superusuario si no existe"

    def handle(self, *args, **kwargs):
        if not Usuario.objects.filter(email="admin@revlineautos.com").exists():
            Usuario.objects.create_superuser(
                email="admin@revlineautos.com",
                password="12345678",
                nombre="Admin",
            )
            self.stdout.write(self.style.SUCCESS("Superusuario creado correctamente."))
        else:
            self.stdout.write(self.style.WARNING("El superusuario ya existe."))
