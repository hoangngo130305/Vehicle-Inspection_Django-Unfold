from django.db import migrations, models


def normalize_payment_statuses(apps, schema_editor):
    Payment = apps.get_model('api', 'Payment')

    for payment in Payment.objects.all().only('id', 'status'):
        current = (payment.status or '').strip().lower()
        if current in ['paid', 'success']:
            payment.status = 'SUCCESS'
        elif current in ['failed', 'cancelled', 'canceled', 'refunded']:
            payment.status = 'FAILED'
        else:
            payment.status = 'PENDING'
        payment.save(update_fields=['status'])


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0020_remove_wallet_tables'),
    ]

    operations = [
        migrations.RunPython(normalize_payment_statuses, migrations.RunPython.noop),
        migrations.AlterField(
            model_name='payment',
            name='status',
            field=models.CharField(
                choices=[
                    ('PENDING', 'Chờ thanh toán'),
                    ('SUCCESS', 'Đã thanh toán'),
                    ('FAILED', 'Thất bại'),
                ],
                default='PENDING',
                max_length=20,
            ),
        ),
        migrations.DeleteModel(
            name='Refund',
        ),
    ]
