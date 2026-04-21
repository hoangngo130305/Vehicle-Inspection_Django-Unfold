from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0019_add_transaction_table'),
    ]

    operations = [
        migrations.DeleteModel(
            name='WalletBalance',
        ),
        migrations.DeleteModel(
            name='WalletHistory',
        ),
    ]
