from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager


class UsuarioManager(BaseUserManager):
    def create_user(self, email, password=None, nombre=None, **extra_fields):
        if not email:
            raise ValueError("El usuario debe tener un correo electronico.")
        email = self.normalize_email(email)
        user = self.model(email=email, nombre=nombre, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, nombre="Administrador", **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("rol", "administrador")

        if extra_fields.get("is_staff") is not True:
            raise ValueError("El superusuario debe tener is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("El superusuario debe tener is_superuser=True.")

        return self.create_user(email, password, nombre, **extra_fields)


class Usuario(AbstractBaseUser, PermissionsMixin):
    ROLES = [
        ('cliente', 'Cliente'),
        ('administrador', 'Administrador'),
        ('empleado', 'Empleado'),
    ]

    email = models.EmailField(unique=True)
    nombre = models.CharField(max_length=100)
    telefono = models.CharField(max_length=20, blank=True, null=True, unique=True)
    imagen_perfil = models.ImageField(upload_to="usuarios/", blank=True, null=True)
    rol = models.CharField(max_length=20, choices=ROLES, default='cliente')
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UsuarioManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["nombre"]

    def __str__(self):
        return f"{self.email} ({self.rol})"


class Vehiculo(models.Model):
    TIPO_CHOICES = [
        ('coche', 'Coche'),
        ('moto', 'Moto'),
        ('especial', 'Especial'),
    ]

    nombre = models.CharField(max_length=120)
    marca = models.CharField(max_length=120)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    velocidad = models.DecimalField(max_digits=5, decimal_places=2)
    frenado = models.DecimalField(max_digits=5, decimal_places=2)
    aceleracion = models.DecimalField(max_digits=5, decimal_places=2)
    traccion = models.DecimalField(max_digits=5, decimal_places=2)
    imagen = models.ImageField(upload_to="vehiculos/", blank=True, null=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.marca} {self.nombre}"

    class Meta:
        ordering = ['-creado_en']


class Pedido(models.Model):
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('enviado', 'Enviado'),
        ('entregado', 'Entregado'),
    ]

    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='pedidos')
    direccion = models.CharField(max_length=255)
    codigo_postal = models.CharField(max_length=20)
    provincia = models.CharField(max_length=120)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')
    pagado = models.BooleanField(default=False)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Pedido #{self.id} - {self.usuario.email}"

    @property
    def total(self):
        detalles = self.detalles.all()
        return sum(item.subtotal for item in detalles) if detalles.exists() else 0


class DetallePedido(models.Model):
    pedido = models.ForeignKey(Pedido, related_name='detalles', on_delete=models.CASCADE)
    vehiculo = models.ForeignKey(Vehiculo, on_delete=models.PROTECT)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2, editable=False)
    cantidad = models.PositiveIntegerField(default=1)

    def save(self, *args, **kwargs):
        if not self.precio_unitario:
            self.precio_unitario = self.vehiculo.precio
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.vehiculo.nombre} x{self.cantidad}"

    @property
    def subtotal(self):
        if self.precio_unitario is None:
            return 0
        return self.precio_unitario * self.cantidad
