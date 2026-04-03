from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_alter_vehiclereturnlog_customer_signature_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='contract_document_pdf',
            field=models.FileField(
                upload_to='contracts/',
                null=True,
                blank=True,
                help_text='File hợp đồng ủy quyền (PDF)'
            ),
        ),
    ]
