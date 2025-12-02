# El archivo manage.py es el punto de entrada del backend Django.
# Sirve para ejecutar tareas administrativas desde la terminal, como arrancar el servidor o crear migraciones.
# Define qué configuración del proyecto debe usar y pasa los comandos que escribimos al sistema de gestión interno de Django. 
#!/usr/bin/env python   Le dice al sistema operativo que debe usar el intérprete de Python para ejecutar este archivo
"""Django's command-line utility for administrative tasks."""
import os  #permite interactuar con el sistema operativo , para leer variables de entorno por ejemplo
import sys #permite acceder a los argumentos del programa (sys.argv), rutas, etc

#Se define la función principal que controla qué hace el script.
def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')  #Aquí se indica a Django qué archivo de configuración usar
    try:  #Este bloque importa la función execute_from_command_line, que es la que realmente ejecuta los comandos de Django
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv) #ejecuta Django con los argumentos que el usuario haya pasado por consola

#Este bloque se ejecuta solo si se ejecuta (python manage.py). Llama a la función main() definida arriba.
if __name__ == '__main__':
    main()