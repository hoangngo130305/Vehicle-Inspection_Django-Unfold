from django.db import migrations


def seed_requirements(apps, schema_editor):
    InspectionImageRequirement = apps.get_model('api', 'InspectionImageRequirement')

    defaults = [
        # RECEIVE - VEHICLE
        {'name': 'Ảnh mặt trước', 'category': 'VEHICLE', 'position': 'FRONT', 'stage': 'RECEIVE', 'is_required': True, 'sort_order': 1},
        {'name': 'Ảnh mặt sau', 'category': 'VEHICLE', 'position': 'BACK', 'stage': 'RECEIVE', 'is_required': True, 'sort_order': 2},
        {'name': 'Ảnh bên trái', 'category': 'VEHICLE', 'position': 'LEFT', 'stage': 'RECEIVE', 'is_required': True, 'sort_order': 3},
        {'name': 'Ảnh bên phải', 'category': 'VEHICLE', 'position': 'RIGHT', 'stage': 'RECEIVE', 'is_required': True, 'sort_order': 4},
        {'name': 'Ảnh nội thất', 'category': 'VEHICLE', 'position': 'INTERIOR', 'stage': 'RECEIVE', 'is_required': False, 'sort_order': 5},
        {'name': 'Ảnh táp-lô', 'category': 'VEHICLE', 'position': 'DASHBOARD', 'stage': 'RECEIVE', 'is_required': False, 'sort_order': 6},
        # RECEIVE - DOCUMENT
        {'name': 'Ảnh giấy đăng ký', 'category': 'DOCUMENT', 'position': 'OTHER', 'stage': 'RECEIVE', 'is_required': True, 'sort_order': 7},
        {'name': 'Ảnh bảo hiểm', 'category': 'DOCUMENT', 'position': 'OTHER', 'stage': 'RECEIVE', 'is_required': False, 'sort_order': 8},

        # RETURN - VEHICLE
        {'name': 'Ảnh mặt trước khi trả', 'category': 'VEHICLE', 'position': 'FRONT', 'stage': 'RETURN', 'is_required': True, 'sort_order': 1},
        {'name': 'Ảnh mặt sau khi trả', 'category': 'VEHICLE', 'position': 'BACK', 'stage': 'RETURN', 'is_required': True, 'sort_order': 2},
        {'name': 'Ảnh bên trái khi trả', 'category': 'VEHICLE', 'position': 'LEFT', 'stage': 'RETURN', 'is_required': True, 'sort_order': 3},
        {'name': 'Ảnh bên phải khi trả', 'category': 'VEHICLE', 'position': 'RIGHT', 'stage': 'RETURN', 'is_required': True, 'sort_order': 4},
        {'name': 'Ảnh nội thất khi trả', 'category': 'VEHICLE', 'position': 'INTERIOR', 'stage': 'RETURN', 'is_required': False, 'sort_order': 5},
        {'name': 'Ảnh táp-lô khi trả', 'category': 'VEHICLE', 'position': 'DASHBOARD', 'stage': 'RETURN', 'is_required': False, 'sort_order': 6},
    ]

    for item in defaults:
        InspectionImageRequirement.objects.get_or_create(
            name=item['name'],
            stage=item['stage'],
            category=item['category'],
            position=item['position'],
            defaults={
                'is_required': item['is_required'],
                'sort_order': item['sort_order'],
                'is_active': True,
            },
        )


def unseed_requirements(apps, schema_editor):
    InspectionImageRequirement = apps.get_model('api', 'InspectionImageRequirement')
    names = [
        'Ảnh mặt trước',
        'Ảnh mặt sau',
        'Ảnh bên trái',
        'Ảnh bên phải',
        'Ảnh nội thất',
        'Ảnh táp-lô',
        'Ảnh giấy đăng ký',
        'Ảnh bảo hiểm',
        'Ảnh mặt trước khi trả',
        'Ảnh mặt sau khi trả',
        'Ảnh bên trái khi trả',
        'Ảnh bên phải khi trả',
        'Ảnh nội thất khi trả',
        'Ảnh táp-lô khi trả',
    ]
    InspectionImageRequirement.objects.filter(name__in=names).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_inspectionimagerequirement_mediafile'),
    ]

    operations = [
        migrations.RunPython(seed_requirements, unseed_requirements),
    ]
