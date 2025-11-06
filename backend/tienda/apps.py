#Este archivo configura y define la aplicacion dentro del proyecto, es una especie de tarjeta de identidad de la app
from django.apps import AppConfig #Sirve para definir una configuración personalizada de la aplicación

class TiendaConfig(AppConfig): #Definimos la clase de configuracion de la app
    default_auto_field = 'django.db.models.BigAutoField' #Establece el tipo de campo automático que Django usará por defecto para las claves primarias (id) de los modelos.
    name = 'tienda' # Le dice a Django que nuestra aplicación se va a llamar tienda y este usa el valor para registrar la app en el proyecto

#Este archivo se usa a través de INSTALLED_APPS en settings.py.
