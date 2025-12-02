# Creamos automaticamente datos predeterminados en la bd

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
    # Si ya hay vehículos, no tocamos nada
    if Vehiculo.objects.exists():
        print("[seed] Ya existen vehículos en la BD, no se insertan de nuevo.")
        return

    vehiculos = [
        # 8 TURISMOS (coche)
        {
            "nombre": "Elegy Retro Custom",
            "marca": "Annis",
            "tipo": "coche",
            "precio": Decimal("1200000.00"),
            "stock": 5,
            "velocidad": Decimal("9.20"),
            "frenado": Decimal("8.10"),
            "aceleracion": Decimal("8.50"),
            "traccion": Decimal("9.00"),
        },
        {
            "nombre": "Sultan RS",
            "marca": "Karin",
            "tipo": "coche",
            "precio": Decimal("795000.00"),
            "stock": 6,
            "velocidad": Decimal("8.80"),
            "frenado": Decimal("7.90"),
            "aceleracion": Decimal("8.30"),
            "traccion": Decimal("8.70"),
        },
        {
            "nombre": "Kuruma (Blindado)",
            "marca": "Karin",
            "tipo": "coche",
            "precio": Decimal("525000.00"),
            "stock": 8,
            "velocidad": Decimal("8.20"),
            "frenado": Decimal("7.50"),
            "aceleracion": Decimal("8.10"),
            "traccion": Decimal("8.40"),
        },
        {
            "nombre": "Zentorno",
            "marca": "Pegassi",
            "tipo": "coche",
            "precio": Decimal("725000.00"),
            "stock": 4,
            "velocidad": Decimal("9.50"),
            "frenado": Decimal("8.20"),
            "aceleracion": Decimal("9.10"),
            "traccion": Decimal("9.00"),
        },
        {
            "nombre": "Pariah",
            "marca": "Ocelot",
            "tipo": "coche",
            "precio": Decimal("1420000.00"),
            "stock": 3,
            "velocidad": Decimal("9.80"),
            "frenado": Decimal("8.00"),
            "aceleracion": Decimal("9.20"),
            "traccion": Decimal("8.90"),
        },
        {
            "nombre": "Comet SR",
            "marca": "Pfister",
            "tipo": "coche",
            "precio": Decimal("1131000.00"),
            "stock": 5,
            "velocidad": Decimal("9.00"),
            "frenado": Decimal("8.00"),
            "aceleracion": Decimal("8.70"),
            "traccion": Decimal("8.60"),
        },
        {
            "nombre": "Jester RR",
            "marca": "Dinka",
            "tipo": "coche",
            "precio": Decimal("1970000.00"),
            "stock": 4,
            "velocidad": Decimal("9.10"),
            "frenado": Decimal("8.10"),
            "aceleracion": Decimal("8.90"),
            "traccion": Decimal("8.80"),
        },
        {
            "nombre": "Buffalo STX",
            "marca": "Bravado",
            "tipo": "coche",
            "precio": Decimal("2048000.00"),
            "stock": 4,
            "velocidad": Decimal("8.90"),
            "frenado": Decimal("7.80"),
            "aceleracion": Decimal("8.60"),
            "traccion": Decimal("8.70"),
        },

        # 6 MOTOS (moto)
        {
            "nombre": "Bati 801",
            "marca": "Pegassi",
            "tipo": "moto",
            "precio": Decimal("15000.00"),
            "stock": 10,
            "velocidad": Decimal("8.80"),
            "frenado": Decimal("7.50"),
            "aceleracion": Decimal("8.90"),
            "traccion": Decimal("8.40"),
        },
        {
            "nombre": "Hakuchou Drag",
            "marca": "Shitzu",
            "tipo": "moto",
            "precio": Decimal("976000.00"),
            "stock": 6,
            "velocidad": Decimal("9.20"),
            "frenado": Decimal("7.80"),
            "aceleracion": Decimal("9.10"),
            "traccion": Decimal("8.60"),
        },
        {
            "nombre": "Akuma",
            "marca": "Dinka",
            "tipo": "moto",
            "precio": Decimal("9000.00"),
            "stock": 12,
            "velocidad": Decimal("8.40"),
            "frenado": Decimal("7.40"),
            "aceleracion": Decimal("8.50"),
            "traccion": Decimal("8.20"),
        },
        {
            "nombre": "Shotaro",
            "marca": "Nagasaki",
            "tipo": "moto",
            "precio": Decimal("2225000.00"),
            "stock": 3,
            "velocidad": Decimal("9.60"),
            "frenado": Decimal("8.20"),
            "aceleracion": Decimal("9.40"),
            "traccion": Decimal("9.00"),
        },
        {
            "nombre": "Sanchez",
            "marca": "Maibatsu",
            "tipo": "moto",
            "precio": Decimal("8000.00"),
            "stock": 15,
            "velocidad": Decimal("7.80"),
            "frenado": Decimal("7.00"),
            "aceleracion": Decimal("8.00"),
            "traccion": Decimal("8.50"),
        },
        {
            "nombre": "Manchez Scout",
            "marca": "Maibatsu",
            "tipo": "moto",
            "precio": Decimal("225000.00"),
            "stock": 8,
            "velocidad": Decimal("8.20"),
            "frenado": Decimal("7.20"),
            "aceleracion": Decimal("8.30"),
            "traccion": Decimal("8.80"),
        },

        # 4 ESPECIALES (especial)
        {
            "nombre": "Oppressor Mk II",
            "marca": "Pegassi",
            "tipo": "especial",
            "precio": Decimal("3800000.00"),
            "stock": 2,
            "velocidad": Decimal("9.50"),
            "frenado": Decimal("7.00"),
            "aceleracion": Decimal("9.30"),
            "traccion": Decimal("9.50"),
        },
        {
            "nombre": "Deluxo",
            "marca": "Imponte",
            "tipo": "especial",
            "precio": Decimal("4721000.00"),
            "stock": 2,
            "velocidad": Decimal("9.00"),
            "frenado": Decimal("7.50"),
            "aceleracion": Decimal("8.90"),
            "traccion": Decimal("9.20"),
        },
        {
            "nombre": "Insurgent Pick-Up Custom",
            "marca": "HVY",
            "tipo": "especial",
            "precio": Decimal("1350000.00"),
            "stock": 3,
            "velocidad": Decimal("8.00"),
            "frenado": Decimal("7.00"),
            "aceleracion": Decimal("8.10"),
            "traccion": Decimal("9.30"),
        },
        {
            "nombre": "Phantom Wedge",
            "marca": "Jobuilt",
            "tipo": "especial",
            "precio": Decimal("2560000.00"),
            "stock": 1,
            "velocidad": Decimal("7.80"),
            "frenado": Decimal("6.50"),
            "aceleracion": Decimal("8.00"),
            "traccion": Decimal("8.90"),
        },
    ]

    for data in vehiculos:
        v = Vehiculo.objects.create(**data)
        print(f"[seed] Vehículo creado: {v.marca} {v.nombre}")

    print(f"[seed] Insertados {len(vehiculos)} vehículos de demo.")


def crear_pedidos_demo():
    # Recuperamos los usuarios
    usuarios = Usuario.objects.filter(
        email__in=["juanjo@revlineautos.com", "cliente1@revlineautos.com"]
    )

    if not Vehiculo.objects.exists():
        print("[seed] No hay vehículos, no se pueden crear pedidos.")
        return

    vehiculos = list(Vehiculo.objects.all())

    for user in usuarios:
        # Si ya tiene pedidos, no creamos más
        if Pedido.objects.filter(usuario=user).exists():
            print(f"[seed] El usuario {user.email} ya tiene pedidos, no se crean de nuevo.")
            continue

        # Pedido 1
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

        # Pedido 2
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
