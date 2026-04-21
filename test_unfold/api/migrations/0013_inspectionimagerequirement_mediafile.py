from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_add_contract_document_pdf'),
    ]

    operations = [
        migrations.CreateModel(
            name='InspectionImageRequirement',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('category', models.CharField(choices=[('VEHICLE', 'Ảnh xe'), ('DOCUMENT', 'Ảnh giấy tờ'), ('CHECKLIST', 'Ảnh checklist'), ('RECEIPT', 'Ảnh biên nhận/biên lai')], max_length=20)),
                ('position', models.CharField(choices=[('FRONT', 'Phía trước'), ('BACK', 'Phía sau'), ('LEFT', 'Bên trái'), ('RIGHT', 'Bên phải'), ('INTERIOR', 'Nội thất'), ('DASHBOARD', 'Táp-lô'), ('OTHER', 'Khác')], max_length=20)),
                ('stage', models.CharField(choices=[('RECEIVE', 'Nhận xe'), ('RETURN', 'Trả xe')], max_length=20)),
                ('is_required', models.BooleanField(default=True)),
                ('sort_order', models.IntegerField(default=0)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('vehicle_type', models.ForeignKey(blank=True, help_text='Null = áp dụng cho tất cả loại xe', null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='image_requirements', to='api.vehicletype')),
            ],
            options={
                'db_table': 'inspection_image_requirements',
                'ordering': ['stage', 'sort_order', 'id'],
            },
        ),
        migrations.CreateModel(
            name='MediaFile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('stage', models.CharField(choices=[('RECEIVE', 'Nhận xe'), ('RETURN', 'Trả xe')], max_length=20)),
                ('category', models.CharField(choices=[('VEHICLE', 'Ảnh xe'), ('DOCUMENT', 'Ảnh giấy tờ'), ('CHECKLIST', 'Ảnh checklist'), ('RECEIPT', 'Ảnh biên nhận/biên lai')], max_length=20)),
                ('position', models.CharField(choices=[('FRONT', 'Phía trước'), ('BACK', 'Phía sau'), ('LEFT', 'Bên trái'), ('RIGHT', 'Bên phải'), ('INTERIOR', 'Nội thất'), ('DASHBOARD', 'Táp-lô'), ('OTHER', 'Khác')], max_length=20)),
                ('file', models.FileField(upload_to='media_files/%Y/%m/%d/')),
                ('url', models.CharField(max_length=1000)),
                ('thumbnail_url', models.CharField(blank=True, max_length=1000, null=True)),
                ('file_type', models.CharField(max_length=100)),
                ('file_size', models.BigIntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='uploaded_media_files', to='api.staff')),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='media_files', to='api.order')),
                ('requirement', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='media_files', to='api.inspectionimagerequirement')),
            ],
            options={
                'db_table': 'media_files',
                'ordering': ['-created_at'],
            },
        ),
        migrations.AddIndex(
            model_name='inspectionimagerequirement',
            index=models.Index(fields=['stage', 'is_active'], name='iir_stage_active_idx'),
        ),
        migrations.AddIndex(
            model_name='inspectionimagerequirement',
            index=models.Index(fields=['category'], name='iir_category_idx'),
        ),
        migrations.AddIndex(
            model_name='mediafile',
            index=models.Index(fields=['order', 'stage'], name='media_order_stage_idx'),
        ),
        migrations.AddIndex(
            model_name='mediafile',
            index=models.Index(fields=['requirement'], name='media_requirement_idx'),
        ),
    ]
