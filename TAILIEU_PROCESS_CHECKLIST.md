# 📘 HƯỚNG DẪN TẠO CUSTOM ADMIN INTERFACE CHO CHECKLIST ITEMS

**Mục tiêu:** Tạo giao diện quản trị tùy chỉnh cho model `ChecklistItem` giống 100% với AdminChecklistScreen.tsx sử dụng Django Unfold theme.

**Thời gian tổng:** ~2-2.5 giờ (cho developer có kinh nghiệm Django + Unfold)

**Yêu cầu:**

- Django 5.x đã cài đặt
- Django Unfold theme đã setup
- Có kinh nghiệm với Django Admin và Template System
- Hiểu cơ bản về HTML/CSS/JavaScript inline

---

## 📋 MỤC LỤC

1. [Chuẩn bị](#bước-1-chuẩn-bị-10-phút)
2. [Tạo cấu trúc thư mục](#bước-2-tạo-cấu-trúc-thư-mục-5-phút)
3. [Tạo ModelAdmin class](#bước-3-tạo-modeladmin-class-30-phút)
4. [Tạo template change_list.html](#bước-4-tạo-template-change_listhtml-60-phút)
5. [Testing & Debug](#bước-5-testing--debug-15-phút)

**Total:** ~2 giờ

---

## BƯỚC 1: Chuẩn bị (10 phút)

### 1.1. Phân tích model ChecklistItem (5 phút)

Đọc model trong `/dangkiem/api/models.py`:

```python
class ChecklistItem(models.Model):
    """Bảng: checklist_items"""
    item_key = models.CharField(max_length=100, unique=True)
    item_label = models.CharField(max_length=255)
    category = models.CharField(max_length=50)  # safety, emission, both
    display_order = models.IntegerField(default=0)
    require_photo = models.BooleanField(default=True)
    status = models.CharField(max_length=20, default='active')  # active, inactive
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

**Ghi chú:**

- 8 fields
- 3 categories: safety, emission, both
- 2 statuses: active, inactive
- Display order để sắp xếp
- Require photo: có yêu cầu chụp ảnh không

### 1.2. Phân tích giao diện mục tiêu (5 phút)

**Features cần có:**

- ✅ Stats cards (Tổng số mục, Hoạt động, Yêu cầu ảnh, Không hoạt động)
- ✅ Search box
- ✅ Table với columns: STT, Key, Mô tả, Danh mục, Yêu cầu ảnh, Trạng thái, Thao tác
- ✅ Modal Thêm mới
- ✅ Modal Chỉnh sửa
- ✅ AJAX Add/Update/Delete
- ✅ JavaScript inline trong template (KHÔNG cần file .js riêng)
- ✅ Tailwind CSS qua CDN (KHÔNG cần file .css riêng)

---

## BƯỚC 2: Tạo cấu trúc thư mục (5 phút)

```bash
cd /test_unfold/

# Tạo cấu trúc template trong api/
mkdir -p api/templates/admin/api/checklistitem/

# Kết quả:
# test_unfold/
# └── api/
#     └── templates/
#         └── admin/
#             └── api/
#                 └── checklistitem/
#                     └── change_list.html  ← CHỈ 1 FILE DUY NHẤT!
```

**Cập nhật settings.py:**

```python
# config/settings.py

INSTALLED_APPS = [
    # ...
    'api',  # ← Đảm bảo có dòng này
]

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],  # ← Để trống, Django sẽ tự tìm trong api/templates/
        'APP_DIRS': True,  # ← QUAN TRỌNG: Phải là True
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
```

**Test:**

```bash
python manage.py check
# Không có lỗi → OK
```

---

## BƯỚC 3: Tạo ModelAdmin class (30 phút)

**Cấu trúc tóm tắt:**

```python
from django.contrib import admin
from django.http import JsonResponse
from django.db import models  # ← QUAN TRỌNG: Import để dùng models.Max
from .models import ChecklistItem

@admin.register(ChecklistItem)
class ChecklistItemAdmin(admin.ModelAdmin):
    """Custom admin cho ChecklistItem với giao diện giống AdminChecklistScreen.tsx"""

    # 1. BASIC CONFIG
    list_display = ['id', 'item_key', 'item_label', 'category', 'display_order', 'require_photo', 'status']
    list_filter = ['category', 'require_photo', 'status']
    search_fields = ['item_key', 'item_label']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['display_order']

    # ✅ QUAN TRỌNG: Chỉ định custom template
    change_list_template = 'admin/api/checklistitem/change_list.html'

    # 2. CHANGELIST VIEW
    def changelist_view(self, request, extra_context=None):
        """
        Override changelist view để:
        1. Xử lý AJAX requests (add/update/delete)
        2. Truyền statistics vào template
        """

        # Xử lý AJAX requests
        if request.path.endswith('add-checklist-ajax/'):
            return self.add_checklist_ajax(request)
        elif request.path.endswith('update-checklist-ajax/'):
            return self.update_checklist_ajax(request)
        elif request.path.endswith('delete-checklist-ajax/'):
            return self.delete_checklist_ajax(request)

        # Tính statistics
        queryset = self.get_queryset(request)
        total_items = queryset.count()
        active_items = queryset.filter(status='active').count()
        inactive_items = queryset.filter(status='inactive').count()
        photo_required_items = queryset.filter(require_photo=True).count()

        # Truyền vào template
        extra_context = extra_context or {}
        extra_context.update({
            'total_items': total_items,
            'active_items': active_items,
            'inactive_items': inactive_items,
            'photo_required_items': photo_required_items,
            'checklist_items': queryset.order_by('display_order'),
        })

        return super().changelist_view(request, extra_context=extra_context)

    # 3. CUSTOM URLS
    def get_urls(self):
        """Thêm custom URLs cho AJAX operations"""
        from django.urls import path
        urls = super().get_urls()
        custom_urls = [
            path('add-checklist-ajax/',
                 self.admin_site.admin_view(self.add_checklist_ajax),
                 name='checklist_add_ajax'),
            path('update-checklist-ajax/',
                 self.admin_site.admin_view(self.update_checklist_ajax),
                 name='checklist_update_ajax'),
            path('delete-checklist-ajax/',
                 self.admin_site.admin_view(self.delete_checklist_ajax),
                 name='checklist_delete_ajax'),
        ]
        return custom_urls + urls

    # 4. AJAX METHODS
    def add_checklist_ajax(self, request):
        """AJAX endpoint để thêm checklist item mới"""
        if request.method != 'POST':
            return JsonResponse({'success': False, 'message': 'Invalid method'}, status=405)

        try:
            item_key = request.POST.get('item_key')
            item_label = request.POST.get('item_label')
            category = request.POST.get('category', 'safety')
            require_photo = request.POST.get('require_photo') != 'false'
            status = request.POST.get('status', 'active')

            # Validate
            if not item_key or not item_label:
                return JsonResponse({'success': False, 'message': 'Thiếu thông tin bắt buộc'}, status=400)

            # Check duplicate key
            if ChecklistItem.objects.filter(item_key=item_key).exists():
                return JsonResponse({'success': False, 'message': f'Key "{item_key}" đã tồn tại'}, status=400)

            # Get max display_order
            max_order = ChecklistItem.objects.aggregate(models.Max('display_order'))['display_order__max'] or 0

            # Create
            item = ChecklistItem.objects.create(
                item_key=item_key,
                item_label=item_label,
                category=category,
                require_photo=require_photo,
                status=status,
                display_order=max_order + 1
            )

            return JsonResponse({
                'success': True,
                'message': f'✅ Thêm mục "{item.item_label}" thành công!',
                'item_id': item.id
            })

        except Exception as e:
            return JsonResponse({'success': False, 'message': f'❌ Lỗi: {str(e)}'}, status=500)

    def update_checklist_ajax(self, request):
        """AJAX endpoint để cập nhật checklist item"""
        if request.method != 'POST':
            return JsonResponse({'success': False, 'message': 'Invalid method'}, status=405)

        try:
            item_id = request.POST.get('item_id')
            item = ChecklistItem.objects.get(id=item_id)

            # Update fields
            item.item_key = request.POST.get('item_key', item.item_key)
            item.item_label = request.POST.get('item_label', item.item_label)
            item.category = request.POST.get('category', item.category)
            item.require_photo = request.POST.get('require_photo') != 'false'
            item.status = request.POST.get('status', item.status)

            item.save()

            return JsonResponse({
                'success': True,
                'message': f'✅ Cập nhật mục "{item.item_label}" thành công!'
            })

        except ChecklistItem.DoesNotExist:
            return JsonResponse({'success': False, 'message': '❌ Không tìm thấy mục checklist'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'❌ Lỗi: {str(e)}'}, status=500)

    def delete_checklist_ajax(self, request):
        """AJAX endpoint để xóa checklist item"""
        if request.method != 'POST':
            return JsonResponse({'success': False, 'message': 'Invalid method'}, status=405)

        try:
            item_id = request.POST.get('item_id')
            item = ChecklistItem.objects.get(id=item_id)
            item_label = item.item_label
            item.delete()

            return JsonResponse({
                'success': True,
                'message': f'✅ Đã xóa mục "{item_label}" thành công!'
            })

        except ChecklistItem.DoesNotExist:
            return JsonResponse({'success': False, 'message': '❌ Không tìm thấy mục checklist'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'❌ Lỗi: {str(e)}'}, status=500)
```

**Điểm quan trọng:**

- ✅ Import `from django.db import models` để dùng `models.Max`
- ✅ Template path: `admin/api/checklistitem/change_list.html`
- ✅ 3 AJAX methods: add, update, delete
- ✅ Statistics được tính trong `changelist_view()`

**Test:**

```bash
python manage.py runserver
# Truy cập: http://localhost:8000/admin/api/checklistitem/
# Hiện tại sẽ báo lỗi template not found → OK, sẽ tạo ở bước sau
```

---

## BƯỚC 4: Tạo template change_list.html (60 phút)

File: `/test_unfold/api/templates/admin/api/checklistitem/change_list.html`

**Cấu trúc template (514 dòng):**

```html
{% extends "unfold/layouts/base.html" %} {% load static %} {% block extrahead %}
{{ block.super }}
<script src="https://cdn.tailwindcss.com"></script>
{% endblock %} {% block content %}
<!-- 1. PAGE HEADER với Search box (42 dòng) -->
<!-- 2. STATS CARDS (4 cards - 102 dòng) -->
<!-- 3. TABLE với data từ checklist_items (95 dòng) -->
<!-- 4. ADD MODAL (84 dòng) -->
<!-- 5. EDIT MODAL (84 dòng) -->
<!-- 6. JAVASCRIPT INLINE (147 dòng) -->
{% endblock %}
```

**Các phần chính:**

### 4.1. Page Header (dòng 10-42)

- Tiêu đề "Quản lý Checklist"
- Nút "Thêm mục mới"
- Search box

### 4.2. Stats Cards (dòng 44-102)

- Card 1: Tổng số mục (`{{ total_items }}`)
- Card 2: Đang hoạt động (`{{ active_items }}`)
- Card 3: Yêu cầu ảnh (`{{ photo_required_items }}`)
- Card 4: Không hoạt động (`{{ inactive_items }}`)

### 4.3. Table (dòng 104-198)

- 7 columns: STT, Key, Mô tả, Danh mục, Yêu cầu ảnh, Trạng thái, Thao tác
- Loop: `{% for item in checklist_items %}`
- Edit button: `data-item-id="{{ item.id }}"` với dataset
- Delete button: `data-item-id="{{ item.id }}"`

### 4.4. Add Modal (dòng 201-283)

- Form với `{% csrf_token %}`
- Fields: item_key, item_label, category, require_photo, status
- Submit → AJAX call → `add-checklist-ajax/`

### 4.5. Edit Modal (dòng 285-365)

- Form với `{% csrf_token %}`
- Hidden field: `item_id`
- Submit → AJAX call → `update-checklist-ajax/`

### 4.6. JavaScript (dòng 367-513)

- Modal open/close
- Edit button → populate modal
- Delete button → confirm → AJAX
- Add form submit → AJAX
- Edit form submit → AJAX
- Search functionality

**KHÔNG CẦN:**

- ❌ File CSS riêng (dùng Tailwind CDN)
- ❌ File JS riêng (JavaScript inline)
- ❌ Partials/includes

---

## BƯỚC 5: Testing & Debug (15 phút)

### 5.1. Kiểm tra cơ bản (5 phút)

```bash
# 1. Check migrations
python manage.py makemigrations
python manage.py migrate

# 2. Restart server
python manage.py runserver
```

### 5.2. Test giao diện (10 phút)

Truy cập: `http://localhost:8000/admin/api/checklistitem/`

**Checklist:**

- [ ] Stats cards hiển thị đúng số liệu
- [ ] Search box hoạt động
- [ ] Table hiển thị dữ liệu
- [ ] Click "Thêm mục mới" → Modal hiện ra
- [ ] Submit form Add → Reload trang → Dữ liệu mới xuất hiện
- [ ] Click "Edit" → Modal hiện ra với data đúng
- [ ] Submit form Edit → Reload trang → Dữ liệu được cập nhật
- [ ] Click "Delete" → Confirm → Xóa thành công

### 5.3. Debug common issues

#### Issue 1: Template not found

```bash
# Check settings.py
INSTALLED_APPS phải có 'api'
TEMPLATES[0]['APP_DIRS'] = True

# Restart server
python manage.py runserver
```

#### Issue 2: Stats không hiển thị

```python
# Check admin.py
def changelist_view(self, request, extra_context=None):
    # Đảm bảo có return statistics vào extra_context
    extra_context.update({
        'total_items': ...,
        'active_items': ...,
    })
```

#### Issue 3: AJAX không hoạt động

```html
<!-- Check template có {% csrf_token %} trong form -->
<form id="addForm">{% csrf_token %} ...</form>
```

#### Issue 4: Import error models.Max

```python
# Đảm bảo có import trong admin.py
from django.db import models
```

---

## 📊 TỔNG KẾT

### ✅ Checklist hoàn thành

- [ ] **Bước 1:** Chuẩn bị (10 phút)
- [ ] **Bước 2:** Tạo cấu trúc thư mục (5 phút)
- [ ] **Bước 3:** Tạo ModelAdmin class (30 phút)
- [ ] **Bước 4:** Tạo template change_list.html (60 phút)
- [ ] **Bước 5:** Testing & Debug (15 phút)

**Tổng thời gian:** ~2 giờ

### 📁 Files đã tạo/sửa

```
/test_unfold/
├── api/
│   ├── admin.py                          (✅ SỬA: Thêm ChecklistItemAdmin)
│   ├── models.py                         (Đã có sẵn)
│   └── templates/                        (✅ TẠO MỚI thư mục)
│       └── admin/
│           └── api/
│               └── checklistitem/
│                   └── change_list.html  (✅ TẠO MỚI - 514 dòng)
└── config/
    └── settings.py                       (✅ CHECK: APP_DIRS=True)
```

---

**Last Updated:** 14/03/2026
