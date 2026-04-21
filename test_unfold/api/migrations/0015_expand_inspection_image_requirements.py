from django.db import migrations


def seed_additional_requirements(apps, schema_editor):
    InspectionImageRequirement = apps.get_model('api', 'InspectionImageRequirement')

    defaults = [
        {'name': 'Ảnh checklist ngoại thất khi nhận', 'category': 'CHECKLIST', 'position': 'OTHER', 'stage': 'RECEIVE', 'is_required': True, 'sort_order': 9},
        {'name': 'Ảnh checklist lốp xe khi nhận', 'category': 'CHECKLIST', 'position': 'OTHER', 'stage': 'RECEIVE', 'is_required': True, 'sort_order': 10},
        {'name': 'Ảnh checklist đèn khi nhận', 'category': 'CHECKLIST', 'position': 'OTHER', 'stage': 'RECEIVE', 'is_required': True, 'sort_order': 11},
        {'name': 'Ảnh checklist gương khi nhận', 'category': 'CHECKLIST', 'position': 'OTHER', 'stage': 'RECEIVE', 'is_required': True, 'sort_order': 12},
        {'name': 'Ảnh checklist kính khi nhận', 'category': 'CHECKLIST', 'position': 'OTHER', 'stage': 'RECEIVE', 'is_required': True, 'sort_order': 13},
        {'name': 'Ảnh checklist nội thất khi nhận', 'category': 'CHECKLIST', 'position': 'OTHER', 'stage': 'RECEIVE', 'is_required': True, 'sort_order': 14},
        {'name': 'Ảnh checklist động cơ khi nhận', 'category': 'CHECKLIST', 'position': 'OTHER', 'stage': 'RECEIVE', 'is_required': True, 'sort_order': 15},
        {'name': 'Ảnh checklist nhiên liệu khi nhận', 'category': 'CHECKLIST', 'position': 'OTHER', 'stage': 'RECEIVE', 'is_required': True, 'sort_order': 16},
        {'name': 'Ảnh checklist ngoại thất khi trả', 'category': 'CHECKLIST', 'position': 'OTHER', 'stage': 'RETURN', 'is_required': True, 'sort_order': 7},
        {'name': 'Ảnh checklist lốp xe khi trả', 'category': 'CHECKLIST', 'position': 'OTHER', 'stage': 'RETURN', 'is_required': True, 'sort_order': 8},
        {'name': 'Ảnh checklist đèn khi trả', 'category': 'CHECKLIST', 'position': 'OTHER', 'stage': 'RETURN', 'is_required': True, 'sort_order': 9},
        {'name': 'Ảnh checklist gương khi trả', 'category': 'CHECKLIST', 'position': 'OTHER', 'stage': 'RETURN', 'is_required': True, 'sort_order': 10},
        {'name': 'Ảnh checklist kính khi trả', 'category': 'CHECKLIST', 'position': 'OTHER', 'stage': 'RETURN', 'is_required': True, 'sort_order': 11},
        {'name': 'Ảnh checklist nội thất khi trả', 'category': 'CHECKLIST', 'position': 'OTHER', 'stage': 'RETURN', 'is_required': True, 'sort_order': 12},
        {'name': 'Ảnh checklist giấy tờ khi trả', 'category': 'CHECKLIST', 'position': 'OTHER', 'stage': 'RETURN', 'is_required': True, 'sort_order': 13},
        {'name': 'Ảnh checklist tem đăng kiểm khi trả', 'category': 'CHECKLIST', 'position': 'OTHER', 'stage': 'RETURN', 'is_required': True, 'sort_order': 14},
        {'name': 'Ảnh giấy đăng ký khi trả', 'category': 'DOCUMENT', 'position': 'OTHER', 'stage': 'RETURN', 'is_required': True, 'sort_order': 15},
        {'name': 'Ảnh tem đăng kiểm khi trả', 'category': 'DOCUMENT', 'position': 'OTHER', 'stage': 'RETURN', 'is_required': True, 'sort_order': 16},
        {'name': 'Ảnh giấy chứng nhận kiểm định khi trả', 'category': 'DOCUMENT', 'position': 'OTHER', 'stage': 'RETURN', 'is_required': True, 'sort_order': 17},
        {'name': 'Ảnh biên lai khi trả', 'category': 'RECEIPT', 'position': 'OTHER', 'stage': 'RETURN', 'is_required': False, 'sort_order': 18},
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


def unseed_additional_requirements(apps, schema_editor):
    InspectionImageRequirement = apps.get_model('api', 'InspectionImageRequirement')
    names = [
        'Ảnh checklist ngoại thất khi nhận',
        'Ảnh checklist lốp xe khi nhận',
        'Ảnh checklist đèn khi nhận',
        'Ảnh checklist gương khi nhận',
        'Ảnh checklist kính khi nhận',
        'Ảnh checklist nội thất khi nhận',
        'Ảnh checklist động cơ khi nhận',
        'Ảnh checklist nhiên liệu khi nhận',
        'Ảnh checklist ngoại thất khi trả',
        'Ảnh checklist lốp xe khi trả',
        'Ảnh checklist đèn khi trả',
        'Ảnh checklist gương khi trả',
        'Ảnh checklist kính khi trả',
        'Ảnh checklist nội thất khi trả',
        'Ảnh checklist giấy tờ khi trả',
        'Ảnh checklist tem đăng kiểm khi trả',
        'Ảnh giấy đăng ký khi trả',
        'Ảnh tem đăng kiểm khi trả',
        'Ảnh giấy chứng nhận kiểm định khi trả',
        'Ảnh biên lai khi trả',
    ]
    InspectionImageRequirement.objects.filter(name__in=names).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_seed_inspection_image_requirements'),
    ]

    operations = [
        migrations.RunPython(seed_additional_requirements, unseed_additional_requirements),
    ]