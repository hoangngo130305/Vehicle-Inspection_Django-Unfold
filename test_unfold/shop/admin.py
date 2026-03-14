from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.db import models
from .models import *

# ========================================
# EXTEND USER ADMIN
# ========================================

class CustomerInline(admin.StackedInline):
    model = Customer
    can_delete = False
    verbose_name_plural = 'Customer Profile'
    fk_name = 'user'


class StaffInline(admin.StackedInline):
    model = Staff
    can_delete = False
    verbose_name_plural = 'Staff Profile'
    fk_name = 'user'


class CustomUserAdmin(BaseUserAdmin):
    """Extend Django User Admin"""
    inlines = []
    
    def get_inline_instances(self, request, obj=None):
        if not obj:
            return []
        
        # Hiển thị inline phù hợp
        inlines = []
        if hasattr(obj, 'customer_profile'):
            inlines.append(CustomerInline(self.model, self.admin_site))
        if hasattr(obj, 'staff_profile'):
            inlines.append(StaffInline(self.model, self.admin_site))
        
        return inlines
    
    list_display = ['username', 'email', 'first_name', 'last_name', 'get_user_type', 'is_staff', 'is_superuser']
    list_filter = ['is_staff', 'is_superuser', 'is_active', 'groups']
    
    def get_user_type(self, obj):
        if obj.is_superuser:
            return '🔴 Admin'
        elif hasattr(obj, 'staff_profile'):
            return '🟡 Staff'
        elif hasattr(obj, 'customer_profile'):
            return '🟢 Customer'
        return '⚪ Unknown'
    get_user_type.short_description = 'User Type'


# Unregister default User admin và register custom
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)


# ========================================
# CUSTOMER
# ========================================

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['id', 'full_name', 'phone', 'user', 'phone_verified', 'total_orders', 'loyalty_points', 'created_at']
    list_filter = ['phone_verified', 'email_verified', 'membership_tier', 'created_at']
    search_fields = ['full_name', 'phone', 'user__username', 'user__email']
    readonly_fields = ['created_at', 'updated_at', 'total_orders', 'completed_orders', 'total_spent', 'loyalty_points']
    
    fieldsets = (
        ('User Account', {
            'fields': ('user',)
        }),
        ('Thông tin cá nhân', {
            'fields': ('full_name', 'phone', 'avatar_url', 'date_of_birth', 'gender')
        }),
        ('Địa chỉ', {
            'fields': ('address', 'city', 'district', 'ward')
        }),
        ('Social Login', {
            'fields': ('google_id', 'facebook_id', 'apple_id')
        }),
        ('Verification', {
            'fields': ('phone_verified', 'email_verified')
        }),
        ('Statistics', {
            'fields': ('total_orders', 'completed_orders', 'total_spent', 'loyalty_points', 'membership_tier')
        }),
        ('Settings', {
            'fields': ('preferred_language', 'timezone')
        }),
        ('System', {
            'fields': ('created_at', 'updated_at')
        }),
    )


# ========================================
# STAFF
# ========================================

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ['id', 'code', 'name', 'level', 'status']
    list_filter = ['status', 'level']
    search_fields = ['code', 'name']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Station)
class StationAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'station_code', 'station_name', 'phone', 
        'get_location', 'daily_capacity', 'working_hours', 'status'
    ]
    list_filter = ['status', 'created_at']
    search_fields = ['station_code', 'station_name', 'address', 'phone']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Thông tin cơ bản', {
            'fields': ('station_code', 'station_name', 'phone', 'email')
        }),
        ('Địa chỉ & Tọa độ', {
            'fields': ('address', 'latitude', 'longitude')
        }),
        ('Quản lý', {
            'fields': ('manager', 'working_hours', 'daily_capacity')
        }),
        ('Trạng thái', {
            'fields': ('status',)
        }),
        ('System', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def changelist_view(self, request, extra_context=None):
        """Custom changelist view with stations data"""
        # Get queryset
        queryset = self.get_queryset(request)
        
        # Calculate stats
        total_stations = queryset.count()
        active_stations = queryset.filter(status='active').count()
        inactive_stations = queryset.filter(status='inactive').count()
        
        # Add to context
        extra_context = extra_context or {}
        extra_context.update({
            'total_stations': total_stations,
            'active_stations': active_stations,
            'inactive_stations': inactive_stations,
            'stations_list': queryset.order_by('id'),
        })
        
        return super().changelist_view(request, extra_context=extra_context)
    
    def get_location(self, obj):
        """Hiển thị tọa độ GPS"""
        if obj.latitude and obj.longitude:
            return f"📍 {obj.latitude}, {obj.longitude}"
        return '❌ Chưa có'
    get_location.short_description = 'Tọa độ GPS'


@admin.register(TimeSlot)
class TimeSlotAdmin(admin.ModelAdmin):
    """
    Admin quản lý khung giờ làm việc cho các trạm
    """
    list_display = ['id', 'station', 'time_slot', 'day_of_week', 'max_capacity', 'is_active', 'display_order']
    list_filter = ['is_active', 'day_of_week', 'station', 'created_at']
    search_fields = ['station__station_name', 'station__station_code', 'notes']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['station', 'display_order', 'time_slot']
    
    fieldsets = (
        ('Trạm & Thời gian', {
            'fields': ('station', 'time_slot', 'day_of_week')
        }),
        ('Cấu hình', {
            'fields': ('max_capacity', 'is_active', 'display_order')
        }),
        ('Ghi chú', {
            'fields': ('notes',)
        }),
        ('System', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        """Sắp xếp theo station và time_slot"""
        qs = super().get_queryset(request)
        return qs.select_related('station')
    
    # Actions để bulk enable/disable slots
    actions = ['activate_slots', 'deactivate_slots']
    
    def activate_slots(self, request, queryset):
        """Kích hoạt các time slots"""
        count = queryset.update(is_active=True)
        self.message_user(request, f'Đã kích hoạt {count} time slot(s)')
    activate_slots.short_description = '✅ Kích hoạt time slots'
    
    def deactivate_slots(self, request, queryset):
        """Vô hiệu hóa các time slots"""
        count = queryset.update(is_active=False)
        self.message_user(request, f'Đã vô hiệu hóa {count} time slot(s)')
    deactivate_slots.short_description = '❌ Vô hiệu hóa time slots'


@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
    list_display = ['id', 'employee_code', 'full_name', 'user', 'role', 'rating_average', 'status']
    list_filter = ['status', 'role', 'created_at']
    search_fields = ['employee_code', 'full_name', 'phone', 'user__username']
    readonly_fields = ['created_at', 'updated_at', 'tasks_total', 'tasks_completed', 'rating_average']
    
    fieldsets = (
        ('User Account', {
            'fields': ('user',)
        }),
        ('Thông tin nhân viên', {
            'fields': ('employee_code', 'full_name', 'phone', 'avatar_url')
        }),
        ('Công việc', {
            'fields': ('role', 'position', 'hire_date')
        }),
        ('Thông tin cá nhân', {
            'fields': ('birth_date', 'gender', 'address')
        }),
        ('Performance', {
            'fields': ('tasks_total', 'tasks_completed', 'rating_average')
        }),
        ('Status', {
            'fields': ('status',)
        }),
        ('System', {
            'fields': ('created_at', 'updated_at')
        }),
    )


# ========================================
# VEHICLE
# ========================================

@admin.register(VehicleType)
class VehicleTypeAdmin(admin.ModelAdmin):
    list_display = ['id', 'type_code', 'type_name', 'base_price', 'status']
    list_filter = ['status']
    search_fields = ['type_code', 'type_name']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'license_plate', 'get_full_name', 'customer', 
        'vehicle_type', 'color', 'manufacture_year', 
        'get_inspection_status', 'status'
    ]
    list_filter = ['status', 'vehicle_type', 'manufacture_year', 'color']
    search_fields = ['license_plate', 'brand', 'model', 'chassis_number', 'engine_number', 'customer__full_name']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Khách hàng', {
            'fields': ('customer',)
        }),
        ('Thông tin xe', {
            'fields': ('license_plate', 'vehicle_type', 'brand', 'model', 'manufacture_year', 'color')
        }),
        ('Số khung & máy', {
            'fields': ('chassis_number', 'engine_number')
        }),
        ('Đăng kiểm', {
            'fields': ('inspection_expiry',)
        }),
        ('Trạng thái', {
            'fields': ('status',)
        }),
        ('System', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_full_name(self, obj):
        """Hiển thị tên đầy đủ xe"""
        return f"{obj.brand} {obj.model} {obj.manufacture_year}"
    get_full_name.short_description = 'Xe'
    
    def get_inspection_status(self, obj):
        """Hiển thị trạng thái đăng kiểm"""
        if obj.inspection_expiry:
            from datetime import date
            days_left = (obj.inspection_expiry - date.today()).days
            if days_left < 0:
                return f"❌ Hết hạn ({abs(days_left)} ngày)"
            elif days_left <= 30:
                return f"⚠️ Còn {days_left} ngày"
            else:
                return f"✅ Còn {days_left} ngày"
        return '⏳ Chưa có'
    get_inspection_status.short_description = 'Hạn đăng kiểm'


# ========================================
# PRICING
# ========================================

@admin.register(Pricing)
class PricingAdmin(admin.ModelAdmin):
    list_display = ['id', 'vehicle_type', 'inspection_fee', 'total_amount', 'effective_from', 'status']
    list_filter = ['status', 'vehicle_type']
    readonly_fields = ['total_amount', 'created_at', 'updated_at']


# ========================================
# ORDER
# ========================================

class OrderStatusHistoryInline(admin.TabularInline):
    model = OrderStatusHistory
    extra = 0
    readonly_fields = ['created_at']
    can_delete = False


class OrderChecklistInline(admin.TabularInline):
    model = OrderChecklist
    extra = 0
    readonly_fields = ['checked_at']


class VehicleReceiptLogInline(admin.StackedInline):
    """Inline biên bản nhận xe trong Order Admin"""
    model = VehicleReceiptLog
    extra = 0
    readonly_fields = ['received_at', 'created_at', 'updated_at']
    can_delete = False
    verbose_name = 'Biên bản nhận xe'
    verbose_name_plural = 'Biên bản nhận xe'
    
    fieldsets = (
        ('Thông tin cơ bản', {
            'fields': ('received_by', 'received_at', 'odometer_reading', 'fuel_level')
        }),
        ('Tình trạng ngoại thất (4 mặt xe)', {
            'fields': ('exterior_front', 'exterior_rear', 'exterior_left', 'exterior_right')
        }),
        ('Chi tiết ngoại thất', {
            'fields': ('windows_condition', 'lights_condition', 'mirrors_condition', 'wipers_condition', 'tires_condition')
        }),
        ('Nội thất', {
            'fields': ('interior_condition',)
        }),
        ('Vật dụng kèm theo', {
            'fields': ('has_spare_tire', 'has_tool_kit', 'has_jack', 'has_fire_extinguisher', 'has_warning_triangle', 'has_first_aid_kit')
        }),
        ('Giấy tờ xe', {
            'fields': ('has_registration', 'has_insurance', 'has_previous_inspection')
        }),
        ('Ảnh chụp xe', {
            'fields': ('photo_front_url', 'photo_rear_url', 'photo_left_url', 'photo_right_url', 'photo_dashboard_url', 'photo_interior_url'),
            'classes': ('collapse',)
        }),
        ('Ảnh giấy tờ xe', {
            'fields': ('vehicle_registration_url', 'vehicle_insurance_url'),
            'classes': ('collapse',)
        }),
        ('Ghi chú & Xác nhận', {
            'fields': ('additional_notes', 'special_requests', 'customer_confirmed', 'customer_signature', 'staff_signature'),
            'classes': ('collapse',)
        }),
        ('System', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'order_code', 'get_vehicle_plate', 'get_customer_name', 
        'station', 'get_staff_name', 'status', 'priority', 
        'total_amount_display', 'appointment_date', 'created_at'
    ]
    list_filter = ['status', 'priority', 'inspection_result', 'station', 'created_at']
    search_fields = [
        'order_code', 
        'customer__full_name', 
        'customer__phone',  # ✅ Tìm theo SĐT khách
        'vehicle__license_plate',  # ✅ Tìm theo biển số
        'assigned_staff__full_name',
        'assigned_staff__employee_code'
    ]
    readonly_fields = ['order_code', 'created_at', 'updated_at', 'confirmed_at', 'cancelled_at']
    inlines = [VehicleReceiptLogInline, OrderStatusHistoryInline, OrderChecklistInline]
    
    fieldsets = (
        ('Mã đơn & Trạng thái', {
            'fields': ('order_code', 'status', 'priority', 'inspection_result')
        }),
        ('Khách hàng & Xe', {
            'fields': ('customer', 'vehicle')
        }),
        ('Trạm & Nhân viên', {
            'fields': ('station', 'assigned_staff')
        }),
        ('Lịch hẹn', {
            'fields': ('appointment_date', 'appointment_time')
        }),
        ('Thanh toán', {
            'fields': ('estimated_amount', 'additional_amount')
        }),
        ('🚗 Driver Location Tracking (13/03/2026)', {
            'fields': (
                'pickup_address', 
                ('pickup_lat', 'pickup_lng'),
                ('driver_current_lat', 'driver_current_lng'),
                'driver_location_updated_at'
            ),
            'classes': ('collapse',),
            'description': 'Vị trí nhận xe từ khách & Vị trí tài xế real-time'
        }),
        ('Ghi chú', {
            'fields': ('customer_notes', 'staff_notes', 'cancel_reason'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'confirmed_at', 'started_at', 'completed_at', 'cancelled_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_vehicle_plate(self, obj):
        """Hiển thị biển số xe"""
        return obj.vehicle.license_plate if obj.vehicle else '-'
    get_vehicle_plate.short_description = 'Biển số'
    get_vehicle_plate.admin_order_field = 'vehicle__license_plate'
    
    def get_customer_name(self, obj):
        """Hiển thị tên khách hàng"""
        return obj.customer.full_name if obj.customer else '-'
    get_customer_name.short_description = 'Khách hàng'
    get_customer_name.admin_order_field = 'customer__full_name'
    
    def get_staff_name(self, obj):
        """Hiển thị tên nhân viên"""
        if obj.assigned_staff:
            return f"{obj.assigned_staff.full_name} ({obj.assigned_staff.employee_code})"
        return '⏳ Chưa phân công'
    get_staff_name.short_description = 'Nhân viên'
    
    def total_amount_display(self, obj):
        """Hiển thị tổng tiền"""
        total = obj.estimated_amount + obj.additional_amount
        return f"{total:,.0f}đ"
    total_amount_display.short_description = 'Tổng tiền'


@admin.register(OrderStatusHistory)
class OrderStatusHistoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'from_status', 'to_status', 'changed_by', 'created_at']
    list_filter = ['from_status', 'to_status', 'created_at']
    search_fields = ['order__order_code']
    readonly_fields = ['created_at']


@admin.register(VehicleReceiptLog)
class VehicleReceiptLogAdmin(admin.ModelAdmin):
    """Admin cho Biên bản nhận xe"""
    list_display = ['id', 'order', 'get_order_code', 'received_by', 'status', 'odometer_reading', 'fuel_level', 'received_at']
    list_filter = ['status', 'fuel_level', 'has_spare_tire', 'has_registration', 'received_at', 'created_at']
    search_fields = ['order__order_code', 'order__customer__full_name', 'received_by__full_name']
    readonly_fields = ['received_at', 'created_at', 'updated_at', 'completed_at']
    
    def get_order_code(self, obj):
        return obj.order.order_code
    get_order_code.short_description = 'Mã đơn hàng'
    get_order_code.admin_order_field = 'order__order_code'
    
    fieldsets = (
        ('Thông tin đơn hàng', {
            'fields': ('order', 'received_by', 'received_at')
        }),
        ('✅ Trạng thái biên bản (NEW - 09/03/2026)', {
            'fields': ('status', 'completed_at'),
            'description': 'Status flow: draft → vehicle_inspected → condition_checked → completed'
        }),
        ('Thông tin cơ bản', {
            'fields': ('odometer_reading', 'fuel_level')
        }),
        ('Tình trạng ngoại thất (4 mặt xe)', {
            'fields': ('exterior_front', 'exterior_rear', 'exterior_left', 'exterior_right')
        }),
        ('Chi tiết ngoại thất', {
            'fields': ('windows_condition', 'lights_condition', 'mirrors_condition', 'wipers_condition', 'tires_condition')
        }),
        ('Nội thất', {
            'fields': ('interior_condition',)
        }),
        ('Vật dụng kèm theo', {
            'fields': ('has_spare_tire', 'has_tool_kit', 'has_jack', 'has_fire_extinguisher', 'has_warning_triangle', 'has_first_aid_kit')
        }),
        ('Giấy tờ xe', {
            'fields': ('has_registration', 'has_insurance', 'has_previous_inspection')
        }),
        ('Ảnh chụp xe', {
            'fields': ('photo_front_url', 'photo_rear_url', 'photo_left_url', 'photo_right_url', 'photo_dashboard_url', 'photo_interior_url'),
            'classes': ('collapse',)
        }),
        ('Ảnh giấy tờ xe', {
            'fields': ('vehicle_registration_url', 'vehicle_insurance_url'),
            'classes': ('collapse',)
        }),
        ('Ghi chú & Xác nhận', {
            'fields': ('additional_notes', 'special_requests', 'customer_confirmed', 'customer_signature', 'staff_signature'),
            'classes': ('collapse',)
        }),
        ('System', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(VehicleReturnLog)
class VehicleReturnLogAdmin(admin.ModelAdmin):
    """Admin cho Biên bản TRẢ xe"""
    list_display = ['id', 'order', 'get_order_code', 'returned_by', 'status', 'customer_confirmed', 'returned_at']
    list_filter = ['status', 'customer_confirmed', 'returned_at', 'created_at']
    search_fields = ['order__order_code', 'order__customer__full_name', 'returned_by__full_name']
    readonly_fields = ['returned_at', 'created_at', 'updated_at']
    
    def get_order_code(self, obj):
        return obj.order.order_code
    get_order_code.short_description = 'Mã đơn hàng'
    get_order_code.admin_order_field = 'order__order_code'
    
    fieldsets = (
        ('Thông tin đơn hàng', {
            'fields': ('order', 'returned_by', 'returned_at')
        }),
        ('✅ Trạng thái biên bản', {
            'fields': ('status',),
            'description': 'Status flow: draft → vehicle_inspected → condition_checked → completed'
        }),
        ('📷 6 Ảnh xe', {
            'fields': ('photo_front_url', 'photo_rear_url', 'photo_left_url', 'photo_right_url', 'photo_interior_url', 'photo_dashboard_url'),
        }),
        ('✅ Checklist 8 items (Checkbox)', {
            'fields': ('exterior_ok', 'tires_ok', 'lights_ok', 'mirrors_ok', 'windows_ok', 'interior_ok', 'documents_complete_ok', 'stamp_attached_ok'),
        }),
        ('📷 Checklist 8 items (Ảnh minh chứng)', {
            'fields': ('exterior_check_photo', 'tires_check_photo', 'lights_check_photo', 'mirrors_check_photo', 'windows_check_photo', 'interior_check_photo', 'documents_complete_photo', 'stamp_attached_photo'),
            'classes': ('collapse',)
        }),
        ('📄 Giấy tờ kiểm định - Ảnh (5 ảnh)', {
            'fields': ('vehicle_registration_url', 'stamp_url', 'inspection_certificate_url', 'receipt_url', 'other_documents_urls'),
        }),
        ('📝 Giấy tờ kiểm định - Thông tin (6 fields)', {
            'fields': ('registration_number', 'stamp_number', 'stamp_expiry_date', 'receipt_number', 'certificate_number', 'certificate_expiry_date'),
        }),
        ('💬 Ghi chú & Chữ ký', {
            'fields': ('additional_notes', 'customer_signature', 'staff_signature', 'customer_confirmed'),
        }),
        ('📋 Biên bản bàn giao 9 hạng mục (JSON)', {
            'fields': ('handover_checklist',),
            'description': 'Bảng 9 hạng mục: scratches, tires, brakes, battery, carpet, inspection, insurance, smoke, lights. Format: {"scratches": {"notPassed": false, "passed": true, "quantity": "0", "note": "..."}}'
        }),
        ('System', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(VehicleReturnAdditionalCost)
class VehicleReturnAdditionalCostAdmin(admin.ModelAdmin):
    """Admin cho Chi phí phát sinh khi TRẢ xe"""
    list_display = ['id', 'get_order_code', 'cost_type', 'cost_name', 'amount', 'is_approved', 'created_by', 'created_at']
    list_filter = ['cost_type', 'is_approved', 'is_required', 'created_at']
    search_fields = ['order__order_code', 'cost_name', 'description', 'created_by__full_name']
    readonly_fields = ['created_at', 'updated_at', 'approved_at']
    list_editable = ['is_approved']  # Cho phép approve nhanh
    
    def get_order_code(self, obj):
        return obj.order.order_code
    get_order_code.short_description = 'Mã đơn hàng'
    get_order_code.admin_order_field = 'order__order_code'
    
    fieldsets = (
        ('Thông tin đơn hàng', {
            'fields': ('return_log', 'order')
        }),
        ('💰 Chi phí', {
            'fields': ('cost_type', 'cost_name', 'amount', 'description'),
        }),
        ('📷 Minh chứng', {
            'fields': ('photo_url', 'invoice_url'),
        }),
        ('✅ Phê duyệt', {
            'fields': ('is_required', 'is_approved', 'approved_at'),
        }),
        ('💬 Ghi chú', {
            'fields': ('notes',),
        }),
        ('👤 Người tạo', {
            'fields': ('created_by',),
        }),
        ('System', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


# ========================================
# CHECKLIST
# ========================================

@admin.register(ChecklistItem)
class ChecklistItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'item_key', 'item_label', 'category', 'display_order', 'require_photo', 'status']
    list_filter = ['category', 'require_photo', 'status']
    search_fields = ['item_key', 'item_label']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['display_order']
    change_list_template = 'admin/api/checklistitem/change_list.html'
    
    def changelist_view(self, request, extra_context=None):
        """Custom changelist view with statistics"""
        from django.db.models import Q
        from django.urls import path
        from django.http import JsonResponse
        
        # Handle AJAX requests
        if request.path.endswith('add-checklist-ajax/'):
            return self.add_checklist_ajax(request)
        elif request.path.endswith('update-checklist-ajax/'):
            return self.update_checklist_ajax(request)
        elif request.path.endswith('delete-checklist-ajax/'):
            return self.delete_checklist_ajax(request)
        
        # Get queryset
        queryset = self.get_queryset(request)
        
        # Calculate stats
        total_items = queryset.count()
        active_items = queryset.filter(status='active').count()
        inactive_items = queryset.filter(status='inactive').count()
        photo_required_items = queryset.filter(require_photo=True).count()
        
        # Add to context
        extra_context = extra_context or {}
        extra_context.update({
            'total_items': total_items,
            'active_items': active_items,
            'inactive_items': inactive_items,
            'photo_required_items': photo_required_items,
            'checklist_items': queryset.order_by('display_order'),
        })
        
        return super().changelist_view(request, extra_context=extra_context)
    
    def get_urls(self):
        """Add custom URLs for AJAX operations"""
        from django.urls import path
        urls = super().get_urls()
        custom_urls = [
            path('add-checklist-ajax/', self.admin_site.admin_view(self.add_checklist_ajax), name='checklist_add_ajax'),
            path('update-checklist-ajax/', self.admin_site.admin_view(self.update_checklist_ajax), name='checklist_update_ajax'),
            path('delete-checklist-ajax/', self.admin_site.admin_view(self.delete_checklist_ajax), name='checklist_delete_ajax'),
        ]
        return custom_urls + urls
    
    def add_checklist_ajax(self, request):
        """Handle AJAX add request"""
        from django.http import JsonResponse
        from django.views.decorators.http import require_POST
        
        if request.method == 'POST':
            try:
                item_key = request.POST.get('item_key')
                item_label = request.POST.get('item_label')
                category = request.POST.get('category', 'safety')
                require_photo = request.POST.get('require_photo') != 'false'
                status = request.POST.get('status', 'active')
                
                # Get max display_order
                max_order = ChecklistItem.objects.aggregate(models.Max('display_order'))['display_order__max'] or 0
                
                # Create item
                ChecklistItem.objects.create(
                    item_key=item_key,
                    item_label=item_label,
                    category=category,
                    require_photo=require_photo,
                    status=status,
                    display_order=max_order + 1
                )
                
                return JsonResponse({
                    'success': True,
                    'message': '✅ Thêm mục checklist thành công!'
                })
            except Exception as e:
                return JsonResponse({
                    'success': False,
                    'message': f'❌ Lỗi: {str(e)}'
                })
        
        return JsonResponse({'success': False, 'message': 'Invalid request'})
    
    def update_checklist_ajax(self, request):
        """Handle AJAX update request"""
        from django.http import JsonResponse
        
        if request.method == 'POST':
            try:
                item_id = request.POST.get('item_id')
                item = ChecklistItem.objects.get(id=item_id)
                
                item.item_key = request.POST.get('item_key')
                item.item_label = request.POST.get('item_label')
                item.category = request.POST.get('category', 'safety')
                item.require_photo = request.POST.get('require_photo') != 'false'
                item.status = request.POST.get('status', 'active')
                item.save()
                
                return JsonResponse({
                    'success': True,
                    'message': '✅ Cập nhật mục checklist thành công!'
                })
            except ChecklistItem.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': '❌ Không tìm thấy mục checklist!'
                })
            except Exception as e:
                return JsonResponse({
                    'success': False,
                    'message': f'❌ Lỗi: {str(e)}'
                })
        
        return JsonResponse({'success': False, 'message': 'Invalid request'})
    
    def delete_checklist_ajax(self, request):
        """Handle AJAX delete request"""
        from django.http import JsonResponse
        
        if request.method == 'POST':
            try:
                item_id = request.POST.get('item_id')
                item = ChecklistItem.objects.get(id=item_id)
                item.delete()
                
                return JsonResponse({
                    'success': True,
                    'message': '✅ Đã xóa mục checklist!'
                })
            except ChecklistItem.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': '❌ Không tìm thấy mục checklist!'
                })
            except Exception as e:
                return JsonResponse({
                    'success': False,
                    'message': f'❌ Lỗi: {str(e)}'
                })
        
        return JsonResponse({'success': False, 'message': 'Invalid request'})


@admin.register(OrderChecklist)
class OrderChecklistAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'checklist_item', 'result', 'measured_value', 'checked_at']
    list_filter = ['result', 'checked_at']
    search_fields = ['order__order_code', 'checklist_item__item_label']
    readonly_fields = ['checked_at']


# ========================================
# PAYMENT
# ========================================

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['id', 'transaction_code', 'order', 'amount', 'payment_method', 'status', 'paid_at']
    list_filter = ['status', 'payment_method', 'created_at']
    search_fields = ['transaction_code', 'order__order_code']
    readonly_fields = ['transaction_code', 'created_at', 'updated_at']


# ========================================
# RATING
# ========================================

@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'customer', 'staff', 'overall_rating', 'status', 'created_at']
    list_filter = ['status', 'overall_rating', 'service_rating', 'staff_rating', 'facility_rating', 'created_at']
    search_fields = ['order__order_code', 'customer__full_name', 'staff__full_name', 'comment']
    readonly_fields = ['created_at', 'updated_at']
    list_editable = ['status']  # ✅ Cho phép approve/reject nhanh
    fieldsets = (
        ('Thông tin cơ bản', {
            'fields': ('order', 'customer', 'staff')
        }),
        ('Đánh giá', {
            'fields': ('overall_rating', 'service_rating', 'staff_rating', 'facility_rating')
        }),
        ('Bình luận', {
            'fields': ('comment', 'pros', 'cons', 'photos_url')
        }),
        ('Kiểm duyệt', {
            'fields': ('status', 'admin_response', 'responded_by', 'responded_at')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )


# ========================================
# OTP
# ========================================

@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    list_display = ['id', 'phone', 'otp_code', 'purpose', 'is_verified', 'expires_at', 'created_at']
    list_filter = ['purpose', 'is_verified', 'created_at']
    search_fields = ['phone', 'otp_code']
    readonly_fields = ['created_at', 'verified_at']


# ========================================
# ẨN GROUPS KHỎI ADMIN SIDEBAR
# ========================================
from django.contrib.auth.models import Group

# Unregister Group (ẩn khỏi sidebar)
admin.site.unregister(Group)