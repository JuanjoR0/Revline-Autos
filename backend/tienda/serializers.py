from rest_framework import serializers
from .models import Usuario, Vehiculo, Pedido, DetallePedido
from django.contrib.auth import get_user_model


# ===============================
# USUARIO
# ===============================
class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'nombre', 'email', 'telefono', 'rol', 'imagen_perfil', 'fecha_creacion']
        read_only_fields = ['fecha_creacion']


class RegistroUsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = get_user_model()
        fields = ['id', 'nombre', 'email', 'telefono', 'rol', 'imagen_perfil', 'password']

    def create(self, validated_data):
        usuario = get_user_model().objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            nombre=validated_data.get('nombre', ''),
            telefono=validated_data.get('telefono', ''),
            rol=validated_data.get('rol', 'cliente')
        )
        return usuario


# ===============================
# VEHÍCULOS
# ===============================
class VehiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehiculo
        fields = '__all__'


# ===============================
# DETALLES DE PEDIDO
# ===============================
class DetallePedidoSerializer(serializers.ModelSerializer):
    vehiculo = VehiculoSerializer(read_only=True)
    vehiculo_id = serializers.PrimaryKeyRelatedField(
        queryset=Vehiculo.objects.all(), source='vehiculo', write_only=True
    )

    class Meta:
        model = DetallePedido
        fields = ['id', 'vehiculo', 'vehiculo_id', 'precio_unitario', 'cantidad', 'subtotal']
        read_only_fields = ['subtotal']


# ===============================
# PEDIDOS
# ===============================
class PedidoSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    detalles = DetallePedidoSerializer(many=True, read_only=True)

    class Meta:
        model = Pedido
        fields = [
            'id', 'usuario', 'direccion', 'codigo_postal', 'provincia',
            'estado', 'pagado', 'creado_en', 'actualizado_en', 'total', 'detalles'
        ]
        read_only_fields = ['creado_en', 'actualizado_en', 'total']

    def create(self, validated_data):
        detalles_data = validated_data.pop('detalles', [])
        pedido = Pedido.objects.create(**validated_data)
        for detalle_data in detalles_data:
            detalle_data['precio_unitario'] = float(detalle_data.get('precio_unitario', 0))
            DetallePedido.objects.create(pedido=pedido, **detalle_data)
        return pedido
