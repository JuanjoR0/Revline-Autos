#Este archivo personaliza la interfaz de administración de Django, para que los modelos se vean con más orden y con opciones de manejo en el panel de administracion de Django.
from django.contrib import admin  #para usar el módulo principal del panel de administración de Django
from django.contrib.auth.admin import UserAdmin  #clase base de Django para personalizar el modelo de usuario
from .models import Usuario, Vehiculo, Pedido, DetallePedido #importamos los modelos que hemos definido en models.py


@admin.register(Usuario) #decorador que registra el modelo en el panel admin
class UsuarioAdmin(UserAdmin): #esta clase define cómo se verá y gestionará el modelo Usuario
    model = Usuario
    list_display = ('email', 'nombre', 'rol', 'telefono', 'is_staff', 'is_active') #columnas visibles en la lista de usuarios
    list_filter = ('rol', 'is_staff', 'is_active') #Crea filtros en el lateral derecho del admin (por rol, activo, o staff).

    fieldsets = ( #Agrupa los campos en secciones dentro del formulario de edición del usuario
        (None, {'fields': ('email', 'password')}),
        ('Información Personal', {'fields': ('nombre', 'telefono', 'imagen_perfil', 'rol')}),
        ('Permisos', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
        ('Fechas importantes', {'fields': ('last_login',)}), 
    )

    add_fieldsets = ( #Define qué campos se muestran al crear un nuevo usuario desde el panel admin
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'nombre', 'telefono', 'rol', 'password1', 'password2', 'is_staff', 'is_active'),
        }),
    )

    readonly_fields = ('fecha_creacion',)  # Solo lectura, para que no se pueda modificar manualmente
    #Permiten buscar usuarios y definir el orden por defecto en la lista (por email).
    search_fields = ('email', 'nombre', 'telefono')
    ordering = ('email',) 

@admin.register(Vehiculo) #Registra el modelo Vehiculo en el panel admin
class VehiculoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'marca', 'tipo', 'precio', 'stock', 'creado_en') #Muestra los datos de cada vehículo.
    list_filter = ('tipo', 'marca')  #Permite filtrar por tipo o marca
    search_fields = ('nombre', 'marca') #definde por qué campos funciona el buscador
    ordering = ('-creado_en',) #Ordena por fecha de creación (de más reciente a más antiguo).


class DetallePedidoInline(admin.TabularInline): #Permite mostrar los detalles de un pedido dentro del mismo formulario del pedido en el panel admin en formato de tabla
    model = DetallePedido
    extra = 0 #no añade filas vacías adicionales
    readonly_fields = ('vehiculo', 'precio_unitario', 'cantidad', 'subtotal')  # define que los campos sean solo lectura, no modificables.
    can_delete = False #evita eliminar detalles desde el admin


@admin.register(Pedido) #Registra el modelo Pedido con sus opciones personalizadas en el panel admin
class PedidoAdmin(admin.ModelAdmin):
    list_display = ('id', 'usuario', 'direccion', 'codigo_postal', 'provincia', 'estado', 'pagado', 'creado_en')
    list_filter = ('estado', 'pagado', 'provincia')
    ssearch_fields = ('usuario__email', 'usuario__nombre', 'direccion', 'provincia')
    ordering = ('-creado_en',)
    inlines = [DetallePedidoInline] #para que se muestren los detalles del pedido (vehículos) dentro del pedido
    fields = ('usuario', 'direccion', 'codigo_postal', 'provincia', 'estado', 'pagado', 'creado_en', 'actualizado_en')
    readonly_fields = ('creado_en', 'actualizado_en')

    #Esto permite entrar al pedido aunque no sea editable
    def has_change_permission(self, request, obj=None):
        if obj and not request.user.is_superuser:
            return True
        return super().has_change_permission(request, obj)
    