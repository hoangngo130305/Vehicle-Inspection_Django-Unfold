from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0024_rename_staff_notif_staff_i_27820f_idx_staff_notif_staff_i_73eb18_idx'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='handover_document',
            field=models.FileField(
                upload_to='contracts/',
                null=True,
                blank=True,
                help_text='File biên bản bàn giao trả xe (DOCX)'
            ),
        ),
        migrations.AddField(
            model_name='order',
            name='handover_document_pdf',
            field=models.FileField(
                upload_to='contracts/',
                null=True,
                blank=True,
                help_text='File biên bản bàn giao trả xe (PDF)'
            ),
        ),
        migrations.AddField(
            model_name='order',
            name='handover_document_created_at',
            field=models.DateTimeField(
                null=True,
                blank=True,
                help_text='Thời gian tạo biên bản bàn giao trả xe'
            ),
        ),
    ]