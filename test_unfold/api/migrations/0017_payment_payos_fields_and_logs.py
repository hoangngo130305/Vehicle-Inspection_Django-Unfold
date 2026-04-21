from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0016_merge_0015_branches'),
    ]

    operations = [
        migrations.AlterField(
            model_name='payment',
            name='order',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='payment', to='api.order'),
        ),
        migrations.AlterField(
            model_name='payment',
            name='transaction_code',
            field=models.CharField(blank=True, max_length=100, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='payment',
            name='status',
            field=models.CharField(choices=[('pending', 'Chờ thanh toán'), ('paid', 'Đã thanh toán'), ('failed', 'Thất bại'), ('refunded', 'Đã hoàn tiền'), ('cancelled', 'Đã hủy')], default='pending', max_length=20),
        ),
        migrations.AddField(
            model_name='payment',
            name='currency',
            field=models.CharField(default='VND', max_length=10),
        ),
        migrations.AddField(
            model_name='payment',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='payment',
            name='method',
            field=models.CharField(choices=[('QR', 'QR'), ('VNPAY', 'VNPay'), ('CASH', 'Tiền mặt')], default='QR', max_length=20),
        ),
        migrations.AddField(
            model_name='payment',
            name='order_code',
            field=models.BigIntegerField(blank=True, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='payment',
            name='payment_url',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
        migrations.AddField(
            model_name='payment',
            name='qr_code',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='payment',
            name='user_id',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.CreateModel(
            name='PaymentLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order_code', models.BigIntegerField(blank=True, null=True)),
                ('type', models.CharField(choices=[('WEBHOOK', 'Webhook'), ('MANUAL', 'Manual'), ('SYSTEM', 'System')], default='WEBHOOK', max_length=20)),
                ('raw_data', models.TextField()),
                ('status_code', models.CharField(blank=True, max_length=20, null=True)),
                ('ip_address', models.CharField(blank=True, max_length=64, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('payment', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='logs', to='api.payment')),
            ],
            options={
                'db_table': 'payment_logs',
                'verbose_name': 'Log thanh toán',
                'verbose_name_plural': 'Log thanh toán',
            },
        ),
    ]
