from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0021_remove_refund_and_legacy_payment_status'),
    ]

    operations = [
        migrations.CreateModel(
            name='StaffNotificationSetting',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('setting_key', models.CharField(max_length=100)),
                ('enabled', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('staff', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notification_settings', to='api.staff')),
            ],
            options={
                'db_table': 'staff_notification_settings',
                'unique_together': {('staff', 'setting_key')},
            },
        ),
        migrations.AddIndex(
            model_name='staffnotificationsetting',
            index=models.Index(fields=['staff', 'setting_key'], name='staff_notif_staff_i_27820f_idx'),
        ),
    ]
