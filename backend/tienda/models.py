#Es el archivo donde definimos los modelos de datos de Django
from django.db import models
#clases base para crear usuarios personalizados, añadir permisos y definir un gestor personalizado para crear usuarios y superusuarios
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class UsuarioManager(BaseUserManager): #Es un gestor personalizado que define cómo se crean los usuarios normales y los superusuarios
    def create_user(self, email, password=None, nombre=None, **extra_fields): #Crea un usuario normal.
        if not email:
            raise ValueError("El usuario debe tener un correo electrónico.")
        email = self.normalize_email(email)
        user = self.model(email=email, nombre=nombre, **extra_fields) #Crea el usuario con los campos recibidos
        user.set_password(password)
        user.save(using=self._db) #Lo guarda en la base de datos
        return user

    def create_superuser(self, email, password=None, nombre="Administrador", **extra_fields): #Crea un administrador
        #damos los permisos adecuados
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("rol", "administrador")

        if extra_fields.get("is_staff") is not True:
            raise ValueError("El superusuario debe tener is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("El superusuario debe tener is_superuser=True.")

        return self.create_user(email, password, nombre, **extra_fields) #Llama internamente a create_user para crear el usuario

#Este modelo reemplaza al modelo de usuario por defecto de Django para permitir login con email y para añadir campos personalizados como teléfono o rol.
class Usuario(AbstractBaseUser, PermissionsMixin):
    ROLES = [
        ('cliente', 'Cliente'),
        ('administrador', 'Administrador'),
        ('empleado', 'Empleado'),
    ]

    email = models.EmailField(unique=True) #campo único de identificación
    nombre = models.CharField(max_length=100)
    telefono = models.CharField(max_length=20, blank=True, null=True, unique=True) #opcional, también único
    imagen_perfil = models.ImageField(upload_to="usuarios/", blank=True, null=True)
    rol = models.CharField(max_length=20, choices=ROLES, default='cliente') #restringido a los valores definidos en ROLES
    fecha_creacion = models.DateTimeField(auto_now_add=True) #se genera automáticamente al crear el usuario
    #campos internos para el panel admin
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UsuarioManager() #Asignamos el gestor personalizado creado antes para manejar usuarios

    USERNAME_FIELD = "email"         # Indica que Django usará el email como identificador de login
    REQUIRED_FIELDS = ["nombre"]     # Solo se pide nombre ademas, si se quiere crear un superuser

    def __str__(self): #Devuelve cómo se verá el usuario cuando se imprima
        return f"{self.email} ({self.rol})"

class Vehiculo(models.Model):  #Esta clase representa los vehiculos de la tienda y sus campos
    TIPO_CHOICES = [ #definimos las categorías posibles del vehículo
        ('coche', 'Coche'),
        ('moto', 'Moto'),
        ('especial', 'Especial'),
    ]
    #Cada campo corresponde a una columna en la tabla
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

    def __str__(self): #Devuelve una representación legible del vehículo
        return f"{self.marca} {self.nombre}"

    class Meta: #Ordena los vehículos por fecha de creación descendente
        ordering = ['-creado_en']

class Pedido(models.Model): #Esta clase representa el objeto pedido
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('enviado', 'Enviado'),
        ('entregado', 'Entregado'),
    ]
    #Si el usuario se borra, se borran sus pedidos
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='pedidos') #Le asignamos un objeto usuario, el cual podrá acceder a ellos.
    direccion = models.CharField(max_length=255)
    codigo_postal = models.CharField(max_length=20)
    provincia = models.CharField(max_length=120)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')
    pagado = models.BooleanField(default=False)
    #fechas automáticas de creación/modificación
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    def __str__(self): #Muestra el número del pedido y el email del cliente
        return f"Pedido #{self.id} - {self.usuario.email}"


    @property
    def total(self): #Propiedad calculada que devuelve el precio total del pedido 
        detalles = self.detalles.all()
        return sum(item.subtotal for item in detalles) if detalles.exists() else 0 #hace una suma de precios recorriendo todos los vehiculos del pedido


class DetallePedido(models.Model): #Esta clase representa los productos individuales dentro de un pedido
    pedido = models.ForeignKey(Pedido, related_name='detalles', on_delete=models.CASCADE) #Le asignamos un objeto pedido, al cual va a pertenecer.
    vehiculo = models.ForeignKey(Vehiculo, on_delete=models.PROTECT) #Le asignamos el vehículo asociado
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2, editable=False)
    cantidad = models.PositiveIntegerField(default=1)

    def save(self, *args, **kwargs):
        if not self.precio_unitario: #Antes de guardar, comprueba si precio_unitario está vacío
            self.precio_unitario = self.vehiculo.precio #Si lo está, toma el precio actual del vehículo y lo guarda
        super().save(*args, **kwargs) #Luego llama al save() original para guardar en la base de datos

    def __str__(self): #Muestra el nombre del vehículo y la cantidad comprada
        return f"{self.vehiculo.nombre} x{self.cantidad}"

    @property
    def subtotal(self): #Propiedad que calcula el subtotal de esa línea de pedido: precio × cantidad.
        if self.precio_unitario is None:
            return 0
        return self.precio_unitario * self.cantidad

