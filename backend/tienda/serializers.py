# los serializers sirven para convertir objetos de Django (modelos) en formatos que se puedan enviar por la red (como JSON),
# y también para validar y crear objetos nuevos a partir de datos que llegan desde el frontend. Mediante la API que actua como puente
from rest_framework import serializers
from .models import Vehiculo, Pedido, DetallePedido
from django.contrib.auth import get_user_model #obtiene el modelo de usuario personalizado que estamos usando (Usuario).

#Serializer de Usuario
class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model() # Convierte el modelo Usuario en formato JSON
        fields = ['id', 'nombre', 'email', 'telefono', 'rol', 'imagen_perfil', 'fecha_creacion']
        read_only_fields = ['fecha_creacion'] # se marca como solo lectura ese campo

#Este define un serializer específico para el registro (creación de usuario)
class RegistroUsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True) # se puede enviar pero nunca se devuelve (por seguridad).

    class Meta: # Define los campos que el usuario debe enviar para registrarse + los que nosotros le asignamos
        model = get_user_model()
        fields = ['id', 'nombre', 'email', 'telefono', 'rol', 'imagen_perfil', 'password']

    def create(self, validated_data): #Cuando se recibe una petición POST con datos de registro, este método crea el usuario correctamente, cifrando la contraseña.
        usuario = get_user_model().objects.create_user( #Usa el método create_user de nuestro UsuarioManager definido en models.py
            email=validated_data['email'],
            password=validated_data['password'],
            nombre=validated_data.get('nombre', ''),
            telefono=validated_data.get('telefono', ''),
            rol=validated_data.get('rol', 'cliente')
        )
        return usuario

#Serializer que convierte todos los campos del modelo Vehiculo a JSON
class VehiculoSerializer(serializers.ModelSerializer): #Este serializer se usa para listar, crear o mostrar detalles de vehículos.
    class Meta:
        model = Vehiculo
        fields = '__all__' #indica que se incluyen todos los campos del modelo.

#Este convierte los detalles de cada producto dentro de un pedido
class DetallePedidoSerializer(serializers.ModelSerializer):
    #Con esta combinación al recibir datos solo enviamos vehiculo_id. Al devolver datos vemos el objeto completo del vehiculo.
    vehiculo = VehiculoSerializer(read_only=True) # usa el VehiculoSerializer para mostrar información completa del vehículo (solo lectura).
    vehiculo_id = serializers.PrimaryKeyRelatedField( # se usa al crear un pedido, cuando solo necesitamos enviar el ID del vehículo
        queryset=Vehiculo.objects.all(), source='vehiculo', write_only=True
    )

    class Meta: #Incluye todos los datos de cada línea de pedido
        model = DetallePedido
        fields = ['id', 'vehiculo', 'vehiculo_id', 'precio_unitario', 'cantidad', 'subtotal']
        read_only_fields = ['subtotal']

#Este serializer convierte el modelo Pedido completo en formato JSON
class PedidoSerializer(serializers.ModelSerializer): 
    usuario = UsuarioSerializer(read_only=True) # incluye el usuario que lo hizo
    detalles = DetallePedidoSerializer(many=True, read_only=True) # e incluye los productos dentro de él, ambos son solo lectura

    class Meta: #Devuelve todos los campos del pedido
        model = Pedido
        fields = [
            'id', 'usuario', 'direccion', 'codigo_postal', 'provincia',
            'estado', 'pagado', 'creado_en', 'actualizado_en', 'total', 'detalles'
        ]
        read_only_fields = ['creado_en', 'actualizado_en', 'total'] #no se pueden modificar

    def create(self, validated_data): #Sobrescribe la forma en que Django crea un pedido desde la API
        detalles_data = validated_data.pop('detalles', []) #Recoge los datos de los detalle que llegan en JSON
        pedido = Pedido.objects.create(**validated_data) #Crea el pedido
        for detalle_data in detalles_data: #Luego recorre los detalles para crear uno a uno los productos dentro del pedido
            detalle_data['precio_unitario'] = float(detalle_data.get('precio_unitario', 0)) #Asegura que cada línea tenga su precio_unitario
            DetallePedido.objects.create(pedido=pedido, **detalle_data)
        return pedido

