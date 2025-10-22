from rest_framework import serializers
from .models import Usuario, Vehiculo, Pedido, DetallePedido
from django.contrib.auth import get_user_model


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'email', 'telefono', 'rol', 'imagen_perfil', 'fecha_creacion']
        read_only_fields = ['fecha_creacion']


class RegistroUsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'email', 'telefono', 'rol', 'imagen_perfil', 'password']

    def create(self, validated_data):
        usuario = get_user_model().objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            telefono=validated_data.get('telefono'),
            rol=validated_data.get('rol', 'cliente'),
            password=validated_data['password']
        )
        return usuario


class VehiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehiculo
        fields = '__all__'


class DetallePedidoSerializer(serializers.ModelSerializer):
    vehiculo = VehiculoSerializer(read_only=True)
    vehiculo_id = serializers.PrimaryKeyRelatedField(
        queryset=Vehiculo.objects.all(), source='vehiculo', write_only=True
    )

    class Meta:
        model = DetallePedido
        fields = ['id', 'vehiculo', 'vehiculo_id', 'precio_unitario', 'cantidad', 'subtotal']
        read_only_fields = ['subtotal']


class PedidoSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    detalles = DetallePedidoSerializer(many=True)

    class Meta:
        model = Pedido
        fields = [
            'id', 'usuario', 'direccion', 'codigo_postal', 'provincia',
            'estado', 'pagado', 'creado_en', 'actualizado_en', 'total', 'detalles'
        ]
        read_only_fields = ['creado_en', 'actualizado_en', 'total']

    def create(self, validated_data):
        detalles_data = validated_data.pop('detalles')
        pedido = Pedido.objects.create(**validated_data)
        for detalle_data in detalles_data:
            DetallePedido.objects.create(pedido=pedido, **detalle_data)
        return pedido
