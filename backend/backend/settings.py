# Este archivo define la configuración del proyecto Django, controla cómo se comporta el backend.
from datetime import timedelta
import dj_database_url, os
from pathlib import Path

# Define la carpeta raíz del proyecto para construir las demás a partir de ella
BASE_DIR = Path(__file__).resolve().parent.parent


#clave secreta que Django usa para cifrar sesiones y contraseñas. EN ENTORNO DE PRODUCCION REAL DEBERÍA ETSAR OCULTA
SECRET_KEY = 'django-insecure-4(e6z4tcwxqt+9jfwgpjaqj#!t896d5*$+ton*41id$*v=ie$_'

#Django muestra los errores en pantalla. EN ENTORNO DE PRODUCCION REAL DEBERÍA ETSAR EN FALSE
DEBUG = True

#lista de dominios que pueden acceder al servidor. Al ser un proyecto de estudio se deja vacío pero en producción real se pondrían dominios reales.
ALLOWED_HOSTS = []

#Estas son las apps que Django carga automáticamente cuando arranca el proyecto
INSTALLED_APPS = [
    'django.contrib.admin',             #activa el panel de administración.
    'django.contrib.auth',              #maneja usuarios y permisos.
    'django.contrib.contenttypes',      #gestiona el tipo de modelos
    'django.contrib.sessions',          #permite sesiones entre usuario y servidor
    'django.contrib.messages',          #permite mostrar mensajes (como “has iniciado sesión”).
    'django.contrib.staticfiles',       #sirve los archivos estáticos (CSS, imágenes...).
    'rest_framework',                   #activa Django REST Framework para crear la API
    'corsheaders',                      #permite conexión entre el backend y el frontend (CORS).
    'tienda',                           #la API del proyecto.
]

# Los middlewares son filtros que procesan cada petición antes de llegar a las vistas.
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',                        #permite peticiones desde React (frontend).
    'django.middleware.security.SecurityMiddleware',                #añade cabeceras de seguridad.
    'whitenoise.middleware.WhiteNoiseMiddleware',                   #sirve archivos estáticos sin usar servidor externo.
    'django.contrib.sessions.middleware.SessionMiddleware',         #activa el sistema de sesiones.
    'django.middleware.common.CommonMiddleware',                    #gestiona cabeceras HTTP comunes.
    'django.middleware.csrf.CsrfViewMiddleware',                    #protege de ataques CSRF en formularios.
    'django.contrib.auth.middleware.AuthenticationMiddleware',      #asocia peticiones con usuarios autenticados.
    'django.contrib.messages.middleware.MessageMiddleware',         #gestiona los mensajes internos del sistema.
    'django.middleware.clickjacking.XFrameOptionsMiddleware',       #evita que la web se cargue en iframes externos (seguridad).
]

ROOT_URLCONF = 'backend.urls'  # Indica a Django cuál es el archivo de rutas principal del proyecto.

# Define cómo Django debe buscar las plantillas HTML.
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',  # usa el motor de plantillas de Django.
        'DIRS': [],     #se usa para añadir carpetas con HTML (aquí se reemplaza más abajo por el build del frontend).
        'APP_DIRS': True,           #le dice a Django que también busque plantillas dentro de cada app.
        'OPTIONS': {
            'context_processors': [ # añade variables útiles a las plantillas (como el usuario actual).
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'  # Indica el punto de entrada del servidor web

# Define la base de datos del proyecto.
DATABASES = {
    'default': dj_database_url.config(default='sqlite:///db.sqlite3') #usa un archivo local
}


AUTH_PASSWORD_VALIDATORS = [ # Son reglas que verifican que las contraseñas de los usuarios sean seguras.
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator', },
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',},
]

LANGUAGE_CODE = 'en-us' #idioma del proyecto

TIME_ZONE = 'UTC'   #zona horaria (UTC → hora universal).

USE_I18N = True  #activa traducciones automáticas si hay soporte multilenguaje.

USE_TZ = True    #almacena las fechas en UTC internamente.


STATIC_URL = '/static/'   #ruta donde se sirven archivos CSS, JS, imágenes estáticas.
STATIC_ROOT = BASE_DIR / 'staticfiles' 

MEDIA_URL = '/media/'  #ruta para archivos subidos por usuarios.
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')  #carpeta donde se almacenan esos archivos.

# Carpeta donde Django servirá el build del frontend (Vite), así Django puede servir el frontend y el backend desde el mismo servidor.
TEMPLATES[0]['DIRS'] = [ BASE_DIR / 'frontend_dist' ]

# Define que los IDs automáticos de los modelos sean tipo BigInteger (más capacidad que el normal).
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = { #Configura Django REST Framework
    'DEFAULT_AUTHENTICATION_CLASSES': ( # Usa autenticación con JWT tokens.
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': ( # Permite acceso público por defecto (AllowAny), aunque se puede cambiar por vista.
        'rest_framework.permissions.AllowAny',
    ),
}

# Permitir cookies y credenciales entre frontend y backend para que se puedan comunicar
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [ #lista de dominios permitidos.
    "http://localhost:5173",
]
CSRF_TRUSTED_ORIGINS = [ #dominios confiables para evitar errores CSRF.
    "http://localhost:5173",
]

#Indicamos a Django que el modelo de usuario personalizado es este
AUTH_USER_MODEL = 'tienda.Usuario'



SIMPLE_JWT = { #Define cómo funcionan los tokens JWT de inicio de sesión
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=12),  #duración del token principal (12 horas)
    "REFRESH_TOKEN_LIFETIME": timedelta(days=30),  #tiempo para poder renovarlo (30 días)
    "ROTATE_REFRESH_TOKENS": True,        #crea uno nuevo cada vez que se renueva.         
    "BLACKLIST_AFTER_ROTATION": True,     #invalida el token viejo al renovarlo.         
    "AUTH_HEADER_TYPES": ("Bearer",),      #formato del encabezado
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",), #tipo de token utilizado.
}

