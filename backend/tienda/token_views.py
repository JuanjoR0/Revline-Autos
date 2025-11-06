#Este archivo se encarga de gestionar la autenticación mediante JWT (JSON Web Tokens)
from rest_framework_simplejwt.views import TokenObtainPairView #vista base que entrega el access token y el refresh token.
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer #serializer base que gestiona la validación de credenciales
from django.contrib.auth import authenticate #función de Django para comprobar usuario y contraseña
from rest_framework import serializers #lo usamos para lanzar errores personalizados si las credenciales no son válidas

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer): #Creamos un serializer personalizado basado en el de SimpleJWT
    username_field = "email" #Cambia el campo que se usa para identificar al usuario, de username a email para que la API acepte las credenciales correo contraseña.

    def validate(self, attrs): #Recupera el email y contraseña enviados en la petición
        email = attrs.get("email")
        password = attrs.get("password")

        #Usamos la función authenticate() de Django para verificar si existe un usuario con ese email y contraseña
        user = authenticate(username=email, password=password)
        if not user: #Si no lo encuentra o la contraseña es incorrecta, lanza un error
            raise serializers.ValidationError("Credenciales incorrectas.") #Esto evita que se devuelva un token si el usuario no existe o las credenciales son erróneas

        # Llamar al comportamiento base de SimpleJWT que es el que realmente crea y devuelve los tokens JWT
        #access: token de acceso (válido durante minutos) , refresh: token de renovación (válido más tiempo)
        data = super().validate(attrs)
        data["usuario"] = { #Añade un bloque adicional con la información del usuario logueado, de forma que el frontend pueda guardar sus datos fácilmente.
            "id": self.user.id,
            "username": self.user.username,
            "email": self.user.email,
            "rol": getattr(self.user, "rol", None),
        }
        return data

#Creamos una vista que usa el serializer personalizado que acabamos de definir.
#Django REST Framework la usará cuando alguien haga una petición POST /api/login/ con email y contraseña.
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

