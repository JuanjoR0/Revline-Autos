# Datos de demo para la base de datos

import os
from decimal import Decimal

import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from tienda.models import Usuario, Vehiculo, Pedido, DetallePedido


def crear_usuarios_demo():
    usuarios = [
        {
            "email": "juanjo@revlineautos.com",
            "password": "Cliente123",
            "nombre": "Juanjo",
        },
        {
            "email": "cliente1@revlineautos.com",
            "password": "Cliente123",
            "nombre": "Cliente 1",
        },
    ]

    for data in usuarios:
        email = data["email"]
        if Usuario.objects.filter(email=email).exists():
            print(f"[seed] Usuario '{email}' ya existe, no se crea de nuevo.")
            continue

        user = Usuario.objects.create_user(
            email=email,
            password=data["password"],
            nombre=data["nombre"],
        )
        print(f"[seed] Usuario '{email}' creado correctamente ({user.id}).")


def crear_vehiculos_demo():
    if Vehiculo.objects.exists():
        print("[seed] Ya existen vehiculos en la BD, no se insertan de nuevo.")
        return

    vehiculos = [
        {
            "nombre": "Elegy Retro",
            "marca": "Annis",
            "tipo": "coche",
            "precio": Decimal("1200.00"),
            "stock": 5,
            "velocidad": Decimal("20"),
            "frenado": Decimal("80"),
            "aceleracion": Decimal("50"),
            "traccion": Decimal("90"),
        },
        {
            "nombre": "Sultan RS",
            "marca": "Karin",
            "tipo": "coche",
            "precio": Decimal("795.00"),
            "stock": 6,
            "velocidad": Decimal("80"),
            "frenado": Decimal("90"),
            "aceleracion": Decimal("30"),
            "traccion": Decimal("70"),
        },
        {
            "nombre": "Kuruma (Blindado)",
            "marca": "Karin",
            "tipo": "coche",
            "precio": Decimal("525.00"),
            "stock": 8,
            "velocidad": Decimal("20"),
            "frenado": Decimal("50"),
            "aceleracion": Decimal("10"),
            "traccion": Decimal("40"),
        },
        {
            "nombre": "Zentorno",
            "marca": "Pegassi",
            "tipo": "coche",
            "precio": Decimal("725.00"),
            "stock": 4,
            "velocidad": Decimal("95"),
            "frenado": Decimal("82"),
            "aceleracion": Decimal("91"),
            "traccion": Decimal("90"),
        },
        {
            "nombre": "Pariah",
            "marca": "Ocelot",
            "tipo": "coche",
            "precio": Decimal("1420.00"),
            "stock": 3,
            "velocidad": Decimal("98"),
            "frenado": Decimal("80"),
            "aceleracion": Decimal("20"),
            "traccion": Decimal("90"),
        },
        {
            "nombre": "Comet SR",
            "marca": "Pfister",
            "tipo": "coche",
            "precio": Decimal("1131.00"),
            "stock": 5,
            "velocidad": Decimal("90"),
            "frenado": Decimal("00"),
            "aceleracion": Decimal("70"),
            "traccion": Decimal("60"),
        },
        {
            "nombre": "Jester RR",
            "marca": "Dinka",
            "tipo": "coche",
            "precio": Decimal("1970.00"),
            "stock": 4,
            "velocidad": Decimal("10"),
            "frenado": Decimal("10"),
            "aceleracion": Decimal("90"),
            "traccion": Decimal("80"),
        },
        {
            "nombre": "Buffalo STX",
            "marca": "Bravado",
            "tipo": "coche",
            "precio": Decimal("2048.00"),
            "stock": 4,
            "velocidad": Decimal("90"),
            "frenado": Decimal("80"),
            "aceleracion": Decimal("60"),
            "traccion": Decimal("70"),
        },
        {
            "nombre": "Bati 801",
            "marca": "Pegassi",
            "tipo": "moto",
            "precio": Decimal("1500.00"),
            "stock": 10,
            "velocidad": Decimal("80"),
            "frenado": Decimal("50"),
            "aceleracion": Decimal("90"),
            "traccion": Decimal("40"),
        },
        {
            "nombre": "Hakuchou Drag",
            "marca": "Shitzu",
            "tipo": "moto",
            "precio": Decimal("9760.00"),
            "stock": 6,
            "velocidad": Decimal("20"),
            "frenado": Decimal("80"),
            "aceleracion": Decimal("10"),
            "traccion": Decimal("60"),
        },
        {
            "nombre": "Akuma",
            "marca": "Dinka",
            "tipo": "moto",
            "precio": Decimal("9000.00"),
            "stock": 12,
            "velocidad": Decimal("40"),
            "frenado": Decimal("40"),
            "aceleracion": Decimal("50"),
            "traccion": Decimal("82"),
        },
        {
            "nombre": "Shotaro",
            "marca": "Nagasaki",
            "tipo": "moto",
            "precio": Decimal("2225.00"),
            "stock": 3,
            "velocidad": Decimal("96"),
            "frenado": Decimal("82"),
            "aceleracion": Decimal("94"),
            "traccion": Decimal("90"),
        },
        {
            "nombre": "Sanchez",
            "marca": "Maibatsu",
            "tipo": "moto",
            "precio": Decimal("8000.00"),
            "stock": 15,
            "velocidad": Decimal("78"),
            "frenado": Decimal("70"),
            "aceleracion": Decimal("80"),
            "traccion": Decimal("85"),
        },
        {
            "nombre": "Manchez Scout",
            "marca": "Maibatsu",
            "tipo": "moto",
            "precio": Decimal("2250.00"),
            "stock": 8,
            "velocidad": Decimal("82"),
            "frenado": Decimal("72"),
            "aceleracion": Decimal("83"),
            "traccion": Decimal("80"),
        },
        {
            "nombre": "Oppressor Mk II",
            "marca": "Pegassi",
            "tipo": "especial",
            "precio": Decimal("38000.00"),
            "stock": 2,
            "velocidad": Decimal("90"),
            "frenado": Decimal("70"),
            "aceleracion": Decimal("93"),
            "traccion": Decimal("95"),
        },
        {
            "nombre": "Deluxo",
            "marca": "Imponte",
            "tipo": "especial",
            "precio": Decimal("47210.00"),
            "stock": 2,
            "velocidad": Decimal("90"),
            "frenado": Decimal("75"),
            "aceleracion": Decimal("89"),
            "traccion": Decimal("92"),
        },
        {
            "nombre": "Insurgent Pick-Up Custom",
            "marca": "HVY",
            "tipo": "especial",
            "precio": Decimal("13500.00"),
            "stock": 3,
            "velocidad": Decimal("80"),
            "frenado": Decimal("70"),
            "aceleracion": Decimal("81"),
            "traccion": Decimal("90"),
        },
        {
            "nombre": "Phantom Wedge",
            "marca": "Jobuilt",
            "tipo": "especial",
            "precio": Decimal("25600.00"),
            "stock": 1,
            "velocidad": Decimal("80"),
            "frenado": Decimal("60"),
            "aceleracion": Decimal("40"),
            "traccion": Decimal("90"),
        },
    ]

    for data in vehiculos:
        v = Vehiculo.objects.create(**data)
        print(f"[seed] Vehiculo creado: {v.marca} {v.nombre}")

    print(f"[seed] Insertados {len(vehiculos)} vehiculos de demo.")


def crear_pedidos_demo():
    usuarios = Usuario.objects.filter(
        email__in=["juanjo@revlineautos.com", "cliente1@revlineautos.com"]
    )

    if not Vehiculo.objects.exists():
        print("[seed] No hay vehiculos, no se pueden crear pedidos.")
        return

    vehiculos = list(Vehiculo.objects.all())

    for user in usuarios:
        if Pedido.objects.filter(usuario=user).exists():
            print(f"[seed] El usuario {user.email} ya tiene pedidos, no se crean de nuevo.")
            continue

        pedido1 = Pedido.objects.create(
            usuario=user,
            direccion="Calle Demo 1",
            codigo_postal="28001",
            provincia="Los Santos",
            estado="pendiente",
            pagado=True,
        )

        DetallePedido.objects.create(
            pedido=pedido1,
            vehiculo=vehiculos[0],
            cantidad=1,
            precio_unitario=vehiculos[0].precio,
        )

        DetallePedido.objects.create(
            pedido=pedido1,
            vehiculo=vehiculos[1],
            cantidad=2,
            precio_unitario=vehiculos[1].precio,
        )

        pedido2 = Pedido.objects.create(
            usuario=user,
            direccion="Avenida Eclipse 99",
            codigo_postal="28002",
            provincia="Los Santos",
            estado="enviado",
            pagado=True,
        )

        DetallePedido.objects.create(
            pedido=pedido2,
            vehiculo=vehiculos[2],
            cantidad=1,
            precio_unitario=vehiculos[2].precio,
        )

        DetallePedido.objects.create(
            pedido=pedido2,
            vehiculo=vehiculos[3],
            cantidad=1,
            precio_unitario=vehiculos[3].precio,
        )

        print(f"[seed] Creados 2 pedidos demo para el usuario {user.email}.")


def main():
    print("Insertando los datos en la bd")
    crear_usuarios_demo()
    crear_vehiculos_demo()
    crear_pedidos_demo()
    print("Datos introducidos")


if __name__ == "__main__":
    main()
