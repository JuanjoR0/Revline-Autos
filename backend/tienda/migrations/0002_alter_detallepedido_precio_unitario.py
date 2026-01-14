from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tienda', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='detallepedido',
            name='precio_unitario',
            field=models.DecimalField(decimal_places=2, editable=False, max_digits=10),
        ),
    ]
