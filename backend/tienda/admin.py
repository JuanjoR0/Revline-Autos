from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Vehiculo, Pedido, DetallePedido


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    model = Usuario
    list_display = ('email', 'nombre', 'rol', 'telefono', 'is_staff', 'is_active')
    list_filter = ('rol', 'is_staff', 'is_active')

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Informacion Personal', {'fields': ('nombre', 'telefono', 'imagen_perfil', 'rol')}),
        ('Permisos', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
        ('Fechas importantes', {'fields': ('last_login',)}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'nombre', 'telefono', 'rol', 'password1', 'password2', 'is_staff', 'is_active'),
        }),
    )

    readonly_fields = ('fecha_creacion',)
    search_fields = ('email', 'nombre', 'telefono')
    ordering = ('email',)


@admin.register(Vehiculo)
class VehiculoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'marca', 'tipo', 'precio', 'stock', 'creado_en')
    list_filter = ('tipo', 'marca')
    search_fields = ('nombre', 'marca')
    ordering = ('-creado_en',)


class DetallePedidoInline(admin.TabularInline):
    model = DetallePedido
    extra = 0
    readonly_fields = ('vehiculo', 'precio_unitario', 'cantidad', 'subtotal')
    can_delete = False


@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = ('id', 'usuario', 'direccion', 'codigo_postal', 'provincia', 'estado', 'pagado', 'creado_en')
    list_filter = ('estado', 'pagado', 'provincia')
    search_fields = ('usuario__email', 'usuario__nombre', 'direccion', 'provincia')
    ordering = ('-creado_en',)
    inlines = [DetallePedidoInline]
    fields = ('usuario', 'direccion', 'codigo_postal', 'provincia', 'estado', 'pagado', 'creado_en', 'actualizado_en')
    readonly_fields = ('creado_en', 'actualizado_en')

    def has_change_permission(self, request, obj=None):
        if obj and not request.user.is_superuser:
            return True
        return super().has_change_permission(request, obj)
