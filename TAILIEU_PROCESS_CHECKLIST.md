# 📘 HƯỚNG DẪN TẠO CUSTOM ADMIN INTERFACE CHO CHECKLIST ITEMS

**Mục tiêu:** Tạo giao diện quản trị tùy chỉnh cho model `ChecklistItem` giống 100% với AdminChecklistScreen.tsx sử dụng Django Unfold theme.

**Thời gian tổng:** ~4-6 giờ (cho developer có kinh nghiệm Django + Unfold)

**Yêu cầu:**

- Django 5.x đã cài đặt
- Django Unfold theme đã setup
- Có kinh nghiệm với Django Admin và Template System
- Hiểu cơ bản về HTML/CSS/JavaScript

---

## 📋 MỤC LỤC

1. [Chuẩn bị](#bước-1-chuẩn-bị-15-30-phút)
2. [Tạo cấu trúc thư mục](#bước-2-tạo-cấu-trúc-thư-mục-10-15-phút)
3. [Tạo ModelAdmin class](#bước-3-tạo-modeladmin-class-30-45-phút)
4. [Tạo template changelist](#bước-4-tạo-template-changelist-60-90-phút)
5. [Tạo template add/change](#bước-5-tạo-template-addchange-45-60-phút)
6. [Tạo inline templates](#bước-6-tạo-inline-templates-30-45-phút)
7. [Tạo custom actions](#bước-7-tạo-custom-actions-30-40-phút)
8. [Styling & JavaScript](#bước-8-styling--javascript-45-60-phút)
9. [Testing & Debug](#bước-9-testing--debug-30-45-phút)

**Total:** ~4-6 giờ

---

## BƯỚC 1: Chuẩn bị (15-30 phút)

### 1.1. Phân tích model (10 phút)

Đọc model `ChecklistItem` và ghi nhận:

```python
# dangkiem/models.py
class ChecklistItem(models.Model):
    category = models.CharField(max_length=100)
    check_point_name = models.CharField(max_length=255)
    vehicle_type = models.ForeignKey(VehicleType)
    is_required = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

**Ghi chú:**

- 8 fields
- 1 ForeignKey (vehicle_type)
- 3 boolean fields (is_required, is_active, default flags)
- 1 ordering field (display_order)
- Timestamps (created_at, updated_at)

### 1.2. Phân tích giao diện mục tiêu (10 phút)

Mở file `AdminChecklistScreen.tsx` và ghi nhận:

**Features cần có:**

- ✅ List view với filters (category, vehicle_type, is_active)
- ✅ Search (check_point_name)
- ✅ Bulk actions (activate/deactivate, change category)
- ✅ Inline editing (display_order)
- ✅ Color-coded categories
- ✅ Modal create/edit form
- ✅ Drag & drop reordering (optional - nâng cao)

### 1.3. Cài đặt dependencies (5 phút)

```bash
# Kiểm tra đã cài Unfold theme
pip list | grep django-unfold

# Nếu chưa:
pip install django-unfold

# Kiểm tra settings.py
# INSTALLED_APPS phải có 'unfold' trước 'django.contrib.admin'
```

### 1.4. Backup code hiện tại (5 phút)

```bash
cd /dangkiem/dangkiem/

# Backup admin.py hiện tại
cp admin.py admin.py.backup

# Tạo git commit (nếu dùng git)
git add .
git commit -m "Backup before creating ChecklistItem custom admin"
```

---

## BƯỚC 2: Tạo cấu trúc thư mục (10-15 phút)

### 2.1. Tạo thư mục templates (5 phút)

```bash
cd /dangkiem/

# Tạo cấu trúc thư mục
mkdir -p dangkiem/templates/admin/dangkiem/checklistitem/
mkdir -p dangkiem/templates/admin/dangkiem/checklistitem/includes/

# Kiểm tra cấu trúc
tree dangkiem/templates/
```

**Kết quả mong đợi:**

```
dangkiem/templates/
└── admin/
    └── dangkiem/
        └── checklistitem/
            ├── change_form.html
            ├── change_list.html
            └── includes/
                ├── checklist_actions.html
                ├── checklist_filters.html
                ├── checklist_form.html
                └── checklist_row.html
```

### 2.2. Tạo thư mục static (nếu cần) (5 phút)

```bash
mkdir -p dangkiem/static/admin/css/
mkdir -p dangkiem/static/admin/js/

# Tạo file rỗng
touch dangkiem/static/admin/css/checklist_admin.css
touch dangkiem/static/admin/js/checklist_admin.js
```

### 2.3. Cập nhật settings.py (5 phút)

```python
# dangkiem/settings.py

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            BASE_DIR / 'dangkiem' / 'templates',  # ← Thêm dòng này
        ],
        'APP_DIRS': True,
        ...
    },
]

STATICFILES_DIRS = [
    BASE_DIR / 'dangkiem' / 'static',  # ← Thêm dòng này
]
```

**Test:**

```bash
python manage.py check
# Không có lỗi → OK
```

---

## BƯỚC 3: Tạo ModelAdmin class (30-45 phút)

### 3.1. Tạo class cơ bản (10 phút)

File: `/dangkiem/dangkiem/admin.py`

```python
from django.contrib import admin
from unfold.admin import ModelAdmin as UnfoldModelAdmin
from .models import ChecklistItem

@admin.register(ChecklistItem)
class ChecklistItemAdmin(UnfoldModelAdmin):
    """Custom admin cho ChecklistItem với giao diện giống AdminChecklistScreen.tsx"""

    # 1. Hiển thị columns
    list_display = [
        'display_order',
        'check_point_name',
        'category',
        'vehicle_type',
        'is_required',
        'is_active',
        'updated_at',
    ]

    # 2. Filters sidebar
    list_filter = [
        'category',
        'vehicle_type',
        'is_required',
        'is_active',
        'created_at',
    ]

    # 3. Search
    search_fields = [
        'check_point_name',
        'category',
    ]

    # 4. Ordering
    ordering = ['display_order', 'category']

    # 5. Fields hiển thị trong form
    fields = [
        'category',
        'check_point_name',
        'vehicle_type',
        'is_required',
        'display_order',
        'is_active',
    ]

    # 6. Readonly fields
    readonly_fields = ['created_at', 'updated_at']
```

**Test:**

```bash
python manage.py runserver
# Truy cập: http://localhost:8000/admin/dangkiem/checklistitem/
# Xem giao diện cơ bản đã hoạt động chưa
```

### 3.2. Thêm custom display methods (10 phút)

```python
@admin.register(ChecklistItem)
class ChecklistItemAdmin(UnfoldModelAdmin):
    # ... code cũ ...

    list_display = [
        'display_order_badge',  # ← Custom
        'check_point_name_colored',  # ← Custom
        'category_badge',  # ← Custom
        'vehicle_type',
        'is_required_icon',  # ← Custom
        'is_active_icon',  # ← Custom
        'updated_at',
    ]

    # Custom display methods
    @admin.display(description='#', ordering='display_order')
    def display_order_badge(self, obj):
        return f'<span class="badge badge-primary">{obj.display_order}</span>'
    display_order_badge.allow_tags = True

    @admin.display(description='Tên điểm kiểm tra', ordering='check_point_name')
    def check_point_name_colored(self, obj):
        return f'<strong>{obj.check_point_name}</strong>'
    check_point_name_colored.allow_tags = True

    @admin.display(description='Danh mục', ordering='category')
    def category_badge(self, obj):
        color_map = {
            'Hệ thống phanh': 'danger',
            'Hệ thống lái': 'warning',
            'Hệ thống chiếu sáng': 'info',
            'Khung xe': 'success',
            'Động cơ': 'primary',
        }
        color = color_map.get(obj.category, 'secondary')
        return f'<span class="badge badge-{color}">{obj.category}</span>'
    category_badge.allow_tags = True

    @admin.display(description='Bắt buộc', boolean=True)
    def is_required_icon(self, obj):
        return obj.is_required

    @admin.display(description='Kích hoạt', boolean=True)
    def is_active_icon(self, obj):
        return obj.is_active
```

### 3.3. Thêm custom actions (10 phút)

```python
@admin.register(ChecklistItem)
class ChecklistItemAdmin(UnfoldModelAdmin):
    # ... code cũ ...

    actions = [
        'activate_items',
        'deactivate_items',
        'mark_as_required',
        'mark_as_optional',
    ]

    @admin.action(description='✅ Kích hoạt các mục đã chọn')
    def activate_items(self, request, queryset):
        count = queryset.update(is_active=True)
        self.message_user(request, f'Đã kích hoạt {count} mục.')

    @admin.action(description='❌ Vô hiệu hóa các mục đã chọn')
    def deactivate_items(self, request, queryset):
        count = queryset.update(is_active=False)
        self.message_user(request, f'Đã vô hiệu hóa {count} mục.')

    @admin.action(description='⭐ Đánh dấu bắt buộc')
    def mark_as_required(self, request, queryset):
        count = queryset.update(is_required=True)
        self.message_user(request, f'Đã đánh dấu {count} mục là bắt buộc.')

    @admin.action(description='⚪ Đánh dấu tùy chọn')
    def mark_as_optional(self, request, queryset):
        count = queryset.update(is_required=False)
        self.message_user(request, f'Đã đánh dấu {count} mục là tùy chọn.')
```

### 3.4. Override get_queryset (5 phút)

```python
@admin.register(ChecklistItem)
class ChecklistItemAdmin(UnfoldModelAdmin):
    # ... code cũ ...

    def get_queryset(self, request):
        """Optimize queries với select_related"""
        qs = super().get_queryset(request)
        return qs.select_related('vehicle_type')
```

**Test lại:**

```bash
# Restart server
python manage.py runserver

# Truy cập admin
# - Kiểm tra custom display methods
# - Kiểm tra actions hoạt động
# - Kiểm tra filters
```

---

## BƯỚC 4: Tạo template changelist (60-90 phút)

### 4.1. Tạo base template (20 phút)

File: `/dangkiem/dangkiem/templates/admin/dangkiem/checklistitem/change_list.html`

```html
{% extends "admin/change_list.html" %} {% load static %} {% load i18n admin_urls
%} {% block extrastyle %} {{ block.super }}
<link rel="stylesheet" href="{% static 'admin/css/checklist_admin.css' %}" />
{% endblock %} {% block extrahead %} {{ block.super }}
<script src="{% static 'admin/js/checklist_admin.js' %}" defer></script>
{% endblock %} {% block content_title %}
<div class="flex items-center justify-between mb-6">
  <div>
    <h1 class="text-3xl font-bold text-gray-900">Quản lý Danh mục Kiểm tra</h1>
    <p class="text-gray-600 mt-2">
      Tổng cộng: <strong>{{ cl.result_count }}</strong> mục kiểm tra
    </p>
  </div>
  <div>
    <a
      href="{% url 'admin:dangkiem_checklistitem_add' %}"
      class="btn btn-primary"
    >
      <svg
        class="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 4v16m8-8H4"
        />
      </svg>
      Thêm mục mới
    </a>
  </div>
</div>
{% endblock %} {% block result_list %} {% include
"admin/dangkiem/checklistitem/includes/checklist_filters.html" %} {% include
"admin/dangkiem/checklistitem/includes/checklist_table.html" %} {% endblock %}
```

### 4.2. Tạo filters include (15 phút)

File: `/dangkiem/dangkiem/templates/admin/dangkiem/checklistitem/includes/checklist_filters.html`

```html
<div class="bg-white rounded-lg shadow-sm p-4 mb-4">
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
    <!-- Search -->
    <div class="col-span-1 md:col-span-2">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Tìm kiếm
      </label>
      <input
        type="text"
        id="searchInput"
        placeholder="Nhập tên điểm kiểm tra..."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>

    <!-- Category filter -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Danh mục
      </label>
      <select
        id="categoryFilter"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Tất cả</option>
        <option value="Hệ thống phanh">Hệ thống phanh</option>
        <option value="Hệ thống lái">Hệ thống lái</option>
        <option value="Hệ thống chiếu sáng">Hệ thống chiếu sáng</option>
        <option value="Khung xe">Khung xe</option>
        <option value="Động cơ">Động cơ</option>
      </select>
    </div>

    <!-- Status filter -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Trạng thái
      </label>
      <select
        id="statusFilter"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Tất cả</option>
        <option value="active">Kích hoạt</option>
        <option value="inactive">Vô hiệu hóa</option>
      </select>
    </div>
  </div>
</div>
```

### 4.3. Tạo table include (25 phút)

File: `/dangkiem/dangkiem/templates/admin/dangkiem/checklistitem/includes/checklist_table.html`

```html
<div class="bg-white rounded-lg shadow-sm overflow-hidden">
  <!-- Table header -->
  <table class="min-w-full divide-y divide-gray-200">
    <thead class="bg-gray-50">
      <tr>
        <!-- Checkbox -->
        <th class="px-6 py-3 text-left">
          <input
            type="checkbox"
            id="selectAll"
            class="rounded border-gray-300"
          />
        </th>

        <!-- STT -->
        <th
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          STT
        </th>

        <!-- Tên điểm kiểm tra -->
        <th
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Tên điểm kiểm tra
        </th>

        <!-- Danh mục -->
        <th
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Danh mục
        </th>

        <!-- Loại xe -->
        <th
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Loại xe
        </th>

        <!-- Bắt buộc -->
        <th
          class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Bắt buộc
        </th>

        <!-- Trạng thái -->
        <th
          class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Trạng thái
        </th>

        <!-- Actions -->
        <th
          class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Thao tác
        </th>
      </tr>
    </thead>

    <tbody class="bg-white divide-y divide-gray-200">
      {% for item in cl.result_list %} {% include
      "admin/dangkiem/checklistitem/includes/checklist_row.html" with item=item
      %} {% empty %}
      <tr>
        <td colspan="8" class="px-6 py-8 text-center text-gray-500">
          Không có dữ liệu
        </td>
      </tr>
      {% endfor %}
    </tbody>
  </table>

  <!-- Pagination -->
  {% if cl.result_list %}
  <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
    <div class="flex items-center justify-between">
      <div class="text-sm text-gray-700">
        Hiển thị <strong>{{ cl.result_count }}</strong> kết quả
      </div>
      <div class="flex gap-2">
        {% if cl.can_show_all %}
        <a href="?show_all=1" class="btn btn-sm btn-secondary">Xem tất cả</a>
        {% endif %}
      </div>
    </div>
  </div>
  {% endif %}
</div>
```

### 4.4. Tạo row include (20 phút)

File: `/dangkiem/dangkiem/templates/admin/dangkiem/checklistitem/includes/checklist_row.html`

```html
<tr
  class="hover:bg-gray-50 transition-colors checklist-row"
  data-id="{{ item.id }}"
  data-category="{{ item.category }}"
  data-active="{{ item.is_active|yesno:'true,false' }}"
>
  <!-- Checkbox -->
  <td class="px-6 py-4">
    <input
      type="checkbox"
      name="selected_items"
      value="{{ item.id }}"
      class="rounded border-gray-300 item-checkbox"
    />
  </td>

  <!-- STT -->
  <td class="px-6 py-4 whitespace-nowrap">
    <span
      class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 text-sm font-medium"
    >
      {{ item.display_order }}
    </span>
  </td>

  <!-- Tên điểm kiểm tra -->
  <td class="px-6 py-4">
    <div class="text-sm font-medium text-gray-900">
      {{ item.check_point_name }}
    </div>
  </td>

  <!-- Danh mục -->
  <td class="px-6 py-4 whitespace-nowrap">
    {% if item.category == "Hệ thống phanh" %}
    <span
      class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"
    >
      {{ item.category }}
    </span>
    {% elif item.category == "Hệ thống lái" %}
    <span
      class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800"
    >
      {{ item.category }}
    </span>
    {% elif item.category == "Hệ thống chiếu sáng" %}
    <span
      class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800"
    >
      {{ item.category }}
    </span>
    {% elif item.category == "Khung xe" %}
    <span
      class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
    >
      {{ item.category }}
    </span>
    {% elif item.category == "Động cơ" %}
    <span
      class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800"
    >
      {{ item.category }}
    </span>
    {% else %}
    <span
      class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800"
    >
      {{ item.category }}
    </span>
    {% endif %}
  </td>

  <!-- Loại xe -->
  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
    {{ item.vehicle_type.vehicle_type_name }}
  </td>

  <!-- Bắt buộc -->
  <td class="px-6 py-4 whitespace-nowrap text-center">
    {% if item.is_required %}
    <span class="text-green-600">
      <svg class="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clip-rule="evenodd"
        />
      </svg>
    </span>
    {% else %}
    <span class="text-gray-400">
      <svg class="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clip-rule="evenodd"
        />
      </svg>
    </span>
    {% endif %}
  </td>

  <!-- Trạng thái -->
  <td class="px-6 py-4 whitespace-nowrap text-center">
    <button
      type="button"
      class="toggle-status relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 {% if item.is_active %}bg-blue-600{% else %}bg-gray-200{% endif %}"
      data-id="{{ item.id }}"
      data-status="{{ item.is_active|yesno:'true,false' }}"
    >
      <span
        class="translate-x-{% if item.is_active %}6{% else %}1{% endif %} inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
      ></span>
    </button>
  </td>

  <!-- Actions -->
  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
    <div class="flex justify-end gap-2">
      <a
        href="{% url 'admin:dangkiem_checklistitem_change' item.id %}"
        class="text-blue-600 hover:text-blue-900"
        title="Sửa"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </a>
      <a
        href="{% url 'admin:dangkiem_checklistitem_delete' item.id %}"
        class="text-red-600 hover:text-red-900"
        title="Xóa"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </a>
    </div>
  </td>
</tr>
```

---

## BƯỚC 5: Tạo template add/change (45-60 phút)

### 5.1. Tạo change_form.html (30 phút)

File: `/dangkiem/dangkiem/templates/admin/dangkiem/checklistitem/change_form.html`

```html
{% extends "admin/change_form.html" %} {% load static %} {% block extrastyle %}
{{ block.super }}
<link rel="stylesheet" href="{% static 'admin/css/checklist_admin.css' %}" />
{% endblock %} {% block field_sets %}
<div class="bg-white rounded-lg shadow-sm p-6">
  <h2 class="text-2xl font-bold text-gray-900 mb-6">
    {% if original %} Chỉnh sửa: {{ original.check_point_name }} {% else %} Thêm
    mục kiểm tra mới {% endif %}
  </h2>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Category -->
    <div class="col-span-2">
      <label
        for="{{ form.category.id_for_label }}"
        class="block text-sm font-medium text-gray-700 mb-2"
      >
        Danh mục <span class="text-red-500">*</span>
      </label>
      {{ form.category }} {% if form.category.errors %}
      <p class="mt-1 text-sm text-red-600">{{ form.category.errors|first }}</p>
      {% endif %}
    </div>

    <!-- Check point name -->
    <div class="col-span-2">
      <label
        for="{{ form.check_point_name.id_for_label }}"
        class="block text-sm font-medium text-gray-700 mb-2"
      >
        Tên điểm kiểm tra <span class="text-red-500">*</span>
      </label>
      {{ form.check_point_name }} {% if form.check_point_name.errors %}
      <p class="mt-1 text-sm text-red-600">
        {{ form.check_point_name.errors|first }}
      </p>
      {% endif %}
    </div>

    <!-- Vehicle type -->
    <div>
      <label
        for="{{ form.vehicle_type.id_for_label }}"
        class="block text-sm font-medium text-gray-700 mb-2"
      >
        Loại xe <span class="text-red-500">*</span>
      </label>
      {{ form.vehicle_type }} {% if form.vehicle_type.errors %}
      <p class="mt-1 text-sm text-red-600">
        {{ form.vehicle_type.errors|first }}
      </p>
      {% endif %}
    </div>

    <!-- Display order -->
    <div>
      <label
        for="{{ form.display_order.id_for_label }}"
        class="block text-sm font-medium text-gray-700 mb-2"
      >
        Thứ tự hiển thị
      </label>
      {{ form.display_order }} {% if form.display_order.errors %}
      <p class="mt-1 text-sm text-red-600">
        {{ form.display_order.errors|first }}
      </p>
      {% endif %}
      <p class="mt-1 text-sm text-gray-500">Số nhỏ hơn sẽ hiển thị trước</p>
    </div>

    <!-- Is required -->
    <div class="flex items-center">
      <div class="flex items-center h-5">{{ form.is_required }}</div>
      <div class="ml-3 text-sm">
        <label
          for="{{ form.is_required.id_for_label }}"
          class="font-medium text-gray-700"
        >
          Bắt buộc kiểm tra
        </label>
        <p class="text-gray-500">Điểm kiểm tra này bắt buộc phải thực hiện</p>
      </div>
    </div>

    <!-- Is active -->
    <div class="flex items-center">
      <div class="flex items-center h-5">{{ form.is_active }}</div>
      <div class="ml-3 text-sm">
        <label
          for="{{ form.is_active.id_for_label }}"
          class="font-medium text-gray-700"
        >
          Kích hoạt
        </label>
        <p class="text-gray-500">Chỉ những mục được kích hoạt mới hiển thị</p>
      </div>
    </div>
  </div>

  <!-- Timestamps (readonly) -->
  {% if original %}
  <div class="mt-6 pt-6 border-t border-gray-200">
    <dl class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
      <div>
        <dt class="font-medium text-gray-500">Ngày tạo</dt>
        <dd class="mt-1 text-gray-900">
          {{ original.created_at|date:"d/m/Y H:i" }}
        </dd>
      </div>
      <div>
        <dt class="font-medium text-gray-500">Cập nhật lần cuối</dt>
        <dd class="mt-1 text-gray-900">
          {{ original.updated_at|date:"d/m/Y H:i" }}
        </dd>
      </div>
    </dl>
  </div>
  {% endif %}
</div>
{% endblock %} {% block submit_buttons_bottom %}
<div class="flex items-center justify-between mt-6">
  <a
    href="{% url 'admin:dangkiem_checklistitem_changelist' %}"
    class="btn btn-secondary"
  >
    ← Quay lại
  </a>
  <div class="flex gap-2">
    <button type="submit" name="_continue" class="btn btn-secondary">
      Lưu và tiếp tục chỉnh sửa
    </button>
    <button type="submit" name="_addanother" class="btn btn-secondary">
      Lưu và thêm mới
    </button>
    <button type="submit" name="_save" class="btn btn-primary">Lưu</button>
  </div>
</div>
{% endblock %}
```

### 5.2. Tạo form widget customization (15 phút)

Update `admin.py`:

```python
from django import forms

class ChecklistItemAdminForm(forms.ModelForm):
    """Custom form với widgets tùy chỉnh"""

    class Meta:
        model = ChecklistItem
        fields = '__all__'
        widgets = {
            'category': forms.Select(
                attrs={
                    'class': 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500',
                }
            ),
            'check_point_name': forms.TextInput(
                attrs={
                    'class': 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500',
                    'placeholder': 'Ví dụ: Kiểm tra mức dầu phanh',
                }
            ),
            'vehicle_type': forms.Select(
                attrs={
                    'class': 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500',
                }
            ),
            'display_order': forms.NumberInput(
                attrs={
                    'class': 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500',
                    'min': 0,
                }
            ),
            'is_required': forms.CheckboxInput(
                attrs={
                    'class': 'w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500',
                }
            ),
            'is_active': forms.CheckboxInput(
                attrs={
                    'class': 'w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500',
                }
            ),
        }

@admin.register(ChecklistItem)
class ChecklistItemAdmin(UnfoldModelAdmin):
    form = ChecklistItemAdminForm  # ← Thêm dòng này
    # ... rest of code ...
```

---

## BƯỚC 6: Tạo inline templates (30-45 phút)

### 6.1. Tạo actions include (15 phút)

File: `/dangkiem/dangkiem/templates/admin/dangkiem/checklistitem/includes/checklist_actions.html`

```html
<div class="bg-white rounded-lg shadow-sm p-4 mb-4">
  <div class="flex items-center justify-between">
    <div class="text-sm text-gray-700">
      <span id="selectedCount">0</span> mục đã chọn
    </div>

    <div class="flex gap-2" id="bulkActions" style="display: none;">
      <button
        type="button"
        class="btn btn-sm btn-success bulk-action"
        data-action="activate"
      >
        ✅ Kích hoạt
      </button>

      <button
        type="button"
        class="btn btn-sm btn-danger bulk-action"
        data-action="deactivate"
      >
        ❌ Vô hiệu hóa
      </button>

      <button
        type="button"
        class="btn btn-sm btn-primary bulk-action"
        data-action="mark_required"
      >
        ⭐ Đánh dấu bắt buộc
      </button>

      <button
        type="button"
        class="btn btn-sm btn-secondary bulk-action"
        data-action="mark_optional"
      >
        ⚪ Đánh dấu tùy chọn
      </button>

      <div class="relative">
        <button
          type="button"
          class="btn btn-sm btn-warning"
          id="changeCategoryBtn"
        >
          📁 Đổi danh mục
        </button>
        <div
          id="categoryDropdown"
          class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 hidden z-10"
        >
          <div class="py-1">
            <button
              class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              data-category="Hệ thống phanh"
            >
              Hệ thống phanh
            </button>
            <button
              class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              data-category="Hệ thống lái"
            >
              Hệ thống lái
            </button>
            <button
              class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              data-category="Hệ thống chiếu sáng"
            >
              Hệ thống chiếu sáng
            </button>
            <button
              class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              data-category="Khung xe"
            >
              Khung xe
            </button>
            <button
              class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              data-category="Động cơ"
            >
              Động cơ
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

### 6.2. Include actions vào change_list (5 phút)

Update `/dangkiem/dangkiem/templates/admin/dangkiem/checklistitem/change_list.html`:

```html
{% block result_list %} {% include
"admin/dangkiem/checklistitem/includes/checklist_filters.html" %} {% include
"admin/dangkiem/checklistitem/includes/checklist_actions.html" %} {# ← Thêm dòng
này #} {% include "admin/dangkiem/checklistitem/includes/checklist_table.html"
%} {% endblock %}
```

---

## BƯỚC 7: Tạo custom actions (30-40 phút)

### 7.1. Thêm AJAX endpoints vào admin.py (20 phút)

```python
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@admin.register(ChecklistItem)
class ChecklistItemAdmin(UnfoldModelAdmin):
    # ... code cũ ...

    def get_urls(self):
        """Thêm custom URLs cho AJAX actions"""
        from django.urls import path
        urls = super().get_urls()
        custom_urls = [
            path(
                'bulk-update/',
                self.admin_site.admin_view(self.bulk_update_view),
                name='checklistitem_bulk_update',
            ),
            path(
                '<int:pk>/toggle-status/',
                self.admin_site.admin_view(self.toggle_status_view),
                name='checklistitem_toggle_status',
            ),
        ]
        return custom_urls + urls

    def bulk_update_view(self, request):
        """AJAX endpoint cho bulk actions"""
        if request.method != 'POST':
            return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)

        import json
        data = json.loads(request.body)
        action = data.get('action')
        item_ids = data.get('ids', [])

        if not item_ids:
            return JsonResponse({'success': False, 'message': 'No items selected'}, status=400)

        queryset = ChecklistItem.objects.filter(id__in=item_ids)
        count = queryset.count()

        if action == 'activate':
            queryset.update(is_active=True)
            message = f'Đã kích hoạt {count} mục'
        elif action == 'deactivate':
            queryset.update(is_active=False)
            message = f'Đã vô hiệu hóa {count} mục'
        elif action == 'mark_required':
            queryset.update(is_required=True)
            message = f'Đã đánh dấu {count} mục là bắt buộc'
        elif action == 'mark_optional':
            queryset.update(is_required=False)
            message = f'Đã đánh dấu {count} mục là tùy chọn'
        elif action == 'change_category':
            category = data.get('category')
            queryset.update(category=category)
            message = f'Đã đổi danh mục {count} mục thành "{category}"'
        else:
            return JsonResponse({'success': False, 'message': 'Invalid action'}, status=400)

        return JsonResponse({
            'success': True,
            'message': message,
            'count': count,
        })

    def toggle_status_view(self, request, pk):
        """AJAX endpoint để toggle is_active"""
        if request.method != 'POST':
            return JsonResponse({'success': False}, status=405)

        try:
            item = ChecklistItem.objects.get(pk=pk)
            item.is_active = not item.is_active
            item.save()

            return JsonResponse({
                'success': True,
                'is_active': item.is_active,
            })
        except ChecklistItem.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Item not found'}, status=404)
```

---

## BƯỚC 8: Styling & JavaScript (45-60 phút)

### 8.1. Tạo CSS file (15 phút)

File: `/dangkiem/dangkiem/static/admin/css/checklist_admin.css`

```css
/* Checklist Admin Custom Styles */

/* Table improvements */
.checklist-row {
  transition: all 0.2s ease;
}

.checklist-row:hover {
  background-color: #f9fafb;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Badge styles */
.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
}

.badge-primary {
  background-color: #dbeafe;
  color: #1e40af;
}

.badge-danger {
  background-color: #fee2e2;
  color: #991b1b;
}

.badge-warning {
  background-color: #fef3c7;
  color: #92400e;
}

.badge-success {
  background-color: #d1fae5;
  color: #065f46;
}

.badge-info {
  background-color: #dbeafe;
  color: #1e40af;
}

.badge-secondary {
  background-color: #f3f4f6;
  color: #374151;
}

/* Toggle switch */
.toggle-status {
  cursor: pointer;
}

.toggle-status:focus {
  outline: none;
  ring: 2px;
  ring-color: #3b82f6;
  ring-offset: 2px;
}

/* Button styles */
.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background-color: #4b5563;
}

.btn-success {
  background-color: #10b981;
  color: white;
}

.btn-success:hover {
  background-color: #059669;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
}

.btn-danger:hover {
  background-color: #dc2626;
}

.btn-warning {
  background-color: #f59e0b;
  color: white;
}

.btn-warning:hover {
  background-color: #d97706;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

/* Dropdown */
#categoryDropdown {
  transition:
    opacity 0.2s,
    visibility 0.2s;
}

#categoryDropdown.hidden {
  opacity: 0;
  visibility: hidden;
}

/* Form inputs */
input[type="text"],
input[type="number"],
select {
  transition: all 0.2s;
}

input[type="text"]:focus,
input[type="number"]:focus,
select:focus {
  outline: none;
  border-color: #3b82f6;
  ring: 2px;
  ring-color: #3b82f6;
}

/* Loading state */
.loading {
  opacity: 0.6;
  pointer-events: none;
}

.loading::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 2px solid #3b82f6;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .grid-cols-4 {
    grid-template-columns: 1fr;
  }

  .checklist-row td {
    padding: 0.75rem;
  }
}
```

### 8.2. Tạo JavaScript file (30 phút)

File: `/dangkiem/dangkiem/static/admin/js/checklist_admin.js`

```javascript
// Checklist Admin JavaScript

(function () {
  "use strict";

  // DOM Ready
  document.addEventListener("DOMContentLoaded", function () {
    // ===== SELECT ALL CHECKBOX =====
    const selectAllCheckbox = document.getElementById("selectAll");
    const itemCheckboxes = document.querySelectorAll(".item-checkbox");
    const selectedCountEl = document.getElementById("selectedCount");
    const bulkActionsEl = document.getElementById("bulkActions");

    if (selectAllCheckbox) {
      selectAllCheckbox.addEventListener("change", function () {
        itemCheckboxes.forEach((cb) => {
          cb.checked = this.checked;
        });
        updateSelectedCount();
      });
    }

    itemCheckboxes.forEach((cb) => {
      cb.addEventListener("change", updateSelectedCount);
    });

    function updateSelectedCount() {
      const count = document.querySelectorAll(".item-checkbox:checked").length;
      if (selectedCountEl) {
        selectedCountEl.textContent = count;
      }
      if (bulkActionsEl) {
        bulkActionsEl.style.display = count > 0 ? "flex" : "none";
      }

      // Update select all checkbox state
      if (selectAllCheckbox) {
        const allChecked = count === itemCheckboxes.length && count > 0;
        selectAllCheckbox.checked = allChecked;
      }
    }

    // ===== SEARCH FILTER =====
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.addEventListener("input", debounce(filterTable, 300));
    }

    // ===== CATEGORY FILTER =====
    const categoryFilter = document.getElementById("categoryFilter");
    if (categoryFilter) {
      categoryFilter.addEventListener("change", filterTable);
    }

    // ===== STATUS FILTER =====
    const statusFilter = document.getElementById("statusFilter");
    if (statusFilter) {
      statusFilter.addEventListener("change", filterTable);
    }

    function filterTable() {
      const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
      const categoryValue = categoryFilter ? categoryFilter.value : "";
      const statusValue = statusFilter ? statusFilter.value : "";

      const rows = document.querySelectorAll(".checklist-row");
      let visibleCount = 0;

      rows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        const category = row.dataset.category || "";
        const isActive = row.dataset.active === "true";

        let show = true;

        // Search filter
        if (searchTerm && !text.includes(searchTerm)) {
          show = false;
        }

        // Category filter
        if (categoryValue && category !== categoryValue) {
          show = false;
        }

        // Status filter
        if (statusValue === "active" && !isActive) {
          show = false;
        } else if (statusValue === "inactive" && isActive) {
          show = false;
        }

        row.style.display = show ? "" : "none";
        if (show) visibleCount++;
      });

      console.log(`Filtered: ${visibleCount} / ${rows.length} rows visible`);
    }

    // ===== BULK ACTIONS =====
    const bulkActionButtons = document.querySelectorAll(".bulk-action");

    bulkActionButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        const action = this.dataset.action;
        handleBulkAction(action);
      });
    });

    function handleBulkAction(action) {
      const selectedIds = Array.from(
        document.querySelectorAll(".item-checkbox:checked"),
      ).map((cb) => cb.value);

      if (selectedIds.length === 0) {
        alert("Vui lòng chọn ít nhất 1 mục");
        return;
      }

      if (
        !confirm(
          `Bạn có chắc muốn thực hiện hành động này với ${selectedIds.length} mục?`,
        )
      ) {
        return;
      }

      // Get CSRF token
      const csrfToken = document.querySelector(
        "[name=csrfmiddlewaretoken]",
      ).value;

      // Send AJAX request
      fetch("/admin/dangkiem/checklistitem/bulk-update/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({
          action: action,
          ids: selectedIds,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert(data.message);
            location.reload();
          } else {
            alert("Lỗi: " + data.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Đã xảy ra lỗi khi thực hiện hành động");
        });
    }

    // ===== CHANGE CATEGORY DROPDOWN =====
    const changeCategoryBtn = document.getElementById("changeCategoryBtn");
    const categoryDropdown = document.getElementById("categoryDropdown");

    if (changeCategoryBtn && categoryDropdown) {
      changeCategoryBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        categoryDropdown.classList.toggle("hidden");
      });

      // Close on click outside
      document.addEventListener("click", function () {
        categoryDropdown.classList.add("hidden");
      });

      categoryDropdown.addEventListener("click", function (e) {
        e.stopPropagation();
      });

      // Handle category selection
      categoryDropdown.querySelectorAll("button").forEach((btn) => {
        btn.addEventListener("click", function () {
          const category = this.dataset.category;
          handleBulkAction("change_category", { category });
          categoryDropdown.classList.add("hidden");
        });
      });
    }

    // ===== TOGGLE STATUS =====
    const toggleStatusButtons = document.querySelectorAll(".toggle-status");

    toggleStatusButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        const itemId = this.dataset.id;
        toggleStatus(itemId, this);
      });
    });

    function toggleStatus(itemId, button) {
      const csrfToken = document.querySelector(
        "[name=csrfmiddlewaretoken]",
      ).value;

      button.classList.add("loading");

      fetch(`/admin/dangkiem/checklistitem/${itemId}/toggle-status/`, {
        method: "POST",
        headers: {
          "X-CSRFToken": csrfToken,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            const isActive = data.is_active;
            button.classList.toggle("bg-blue-600", isActive);
            button.classList.toggle("bg-gray-200", !isActive);

            const toggle = button.querySelector("span");
            toggle.classList.toggle("translate-x-6", isActive);
            toggle.classList.toggle("translate-x-1", !isActive);

            button.dataset.status = isActive ? "true" : "false";

            // Update row data attribute
            const row = button.closest(".checklist-row");
            if (row) {
              row.dataset.active = isActive ? "true" : "false";
            }
          } else {
            alert("Không thể cập nhật trạng thái");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Đã xảy ra lỗi");
        })
        .finally(() => {
          button.classList.remove("loading");
        });
    }

    // ===== UTILITY FUNCTIONS =====
    function debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }
  });
})();
```

---

## BƯỚC 9: Testing & Debug (30-45 phút)

### 9.1. Kiểm tra cơ bản (10 phút)

```bash
# 1. Collect static files
python manage.py collectstatic --noinput

# 2. Check migrations
python manage.py makemigrations
python manage.py migrate

# 3. Restart server
python manage.py runserver
```

**Checklist:**

- [ ] Server khởi động không lỗi
- [ ] Truy cập `/admin/` thành công
- [ ] Truy cập `/admin/dangkiem/checklistitem/` thành công

### 9.2. Test changelist features (10 phút)

**Manual testing:**

1. **Test filters:**
   - [ ] Category filter hoạt động
   - [ ] Status filter hoạt động
   - [ ] Search hoạt động

2. **Test bulk actions:**
   - [ ] Select all checkbox hoạt động
   - [ ] Selected count hiển thị đúng
   - [ ] Bulk actions xuất hiện khi có item selected
   - [ ] Activate/Deactivate hoạt động
   - [ ] Mark required/optional hoạt động
   - [ ] Change category hoạt động

3. **Test toggle status:**
   - [ ] Click toggle button thay đổi trạng thái
   - [ ] Animation hoạt động mượt mà
   - [ ] Background color thay đổi

### 9.3. Test form features (10 phút)

1. **Test create:**
   - [ ] Click "Thêm mục mới" mở form
   - [ ] Tất cả fields hiển thị đúng
   - [ ] Validation hoạt động (required fields)
   - [ ] Save thành công
   - [ ] "Save and add another" hoạt động
   - [ ] "Save and continue editing" hoạt động

2. **Test edit:**
   - [ ] Click "Sửa" mở form với data đúng
   - [ ] Timestamps hiển thị đúng
   - [ ] Update thành công

3. **Test delete:**
   - [ ] Click "Xóa" hiển thị confirmation
   - [ ] Delete thành công

### 9.4. Debug common issues (10 phút)

#### Issue 1: CSS không load

```bash
# Check static files
python manage.py findstatic admin/css/checklist_admin.css

# Re-collect
python manage.py collectstatic --clear --noinput
```

#### Issue 2: AJAX requests fail

```python
# Check CSRF token in template
# Thêm vào base template nếu chưa có:

{% block extrahead %}
  {{ block.super }}
  <script>
    // Get CSRF token
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
  </script>
{% endblock %}
```

#### Issue 3: Templates không được tìm thấy

```bash
# Kiểm tra settings.py
python manage.py check

# Test template path
python manage.py shell
>>> from django.template.loader import get_template
>>> template = get_template('admin/dangkiem/checklistitem/change_list.html')
>>> print(template.origin.name)
```

---

## 📊 TỔNG KẾT

### ✅ Checklist hoàn thành

- [ ] **Bước 1:** Chuẩn bị (15-30 phút)
- [ ] **Bước 2:** Tạo cấu trúc thư mục (10-15 phút)
- [ ] **Bước 3:** Tạo ModelAdmin class (30-45 phút)
- [ ] **Bước 4:** Tạo template changelist (60-90 phút)
- [ ] **Bước 5:** Tạo template add/change (45-60 phút)
- [ ] **Bước 6:** Tạo inline templates (30-45 phút)
- [ ] **Bước 7:** Tạo custom actions (30-40 phút)
- [ ] **Bước 8:** Styling & JavaScript (45-60 phút)
- [ ] **Bước 9:** Testing & Debug (30-45 phút)

**Tổng thời gian:** ~4-6 giờ
