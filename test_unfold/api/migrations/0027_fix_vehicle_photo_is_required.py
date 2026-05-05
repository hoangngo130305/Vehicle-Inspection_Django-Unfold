from django.db import migrations


def fix_vehicle_photo_required(apps, schema_editor):
    """
    Sửa is_required = True cho ảnh nội thất và táp-lô ở cả 2 giai đoạn RECEIVE và RETURN.
    UI hiển thị 6 ảnh xe là bắt buộc nhưng seed ban đầu để False cho INTERIOR và DASHBOARD.
    """
    InspectionImageRequirement = apps.get_model('api', 'InspectionImageRequirement')

    targets = [
        # RETURN
        {'name': 'Ảnh nội thất khi trả', 'stage': 'RETURN', 'category': 'VEHICLE', 'position': 'INTERIOR'},
        {'name': 'Ảnh táp-lô khi trả',   'stage': 'RETURN', 'category': 'VEHICLE', 'position': 'DASHBOARD'},
        # RECEIVE
        {'name': 'Ảnh nội thất', 'stage': 'RECEIVE', 'category': 'VEHICLE', 'position': 'INTERIOR'},
        {'name': 'Ảnh táp-lô',   'stage': 'RECEIVE', 'category': 'VEHICLE', 'position': 'DASHBOARD'},
    ]

    for t in targets:
        InspectionImageRequirement.objects.filter(
            name=t['name'],
            stage=t['stage'],
            category=t['category'],
            position=t['position'],
        ).update(is_required=True)


def reverse_fix(apps, schema_editor):
    InspectionImageRequirement = apps.get_model('api', 'InspectionImageRequirement')

    targets = [
        {'name': 'Ảnh nội thất khi trả', 'stage': 'RETURN', 'category': 'VEHICLE', 'position': 'INTERIOR'},
        {'name': 'Ảnh táp-lô khi trả',   'stage': 'RETURN', 'category': 'VEHICLE', 'position': 'DASHBOARD'},
        {'name': 'Ảnh nội thất', 'stage': 'RECEIVE', 'category': 'VEHICLE', 'position': 'INTERIOR'},
        {'name': 'Ảnh táp-lô',   'stage': 'RECEIVE', 'category': 'VEHICLE', 'position': 'DASHBOARD'},
    ]

    for t in targets:
        InspectionImageRequirement.objects.filter(
            name=t['name'],
            stage=t['stage'],
            category=t['category'],
            position=t['position'],
        ).update(is_required=False)


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0026_normalize_additional_cost_payment_status'),
    ]

    operations = [
        migrations.RunPython(fix_vehicle_photo_required, reverse_fix),
    ]
