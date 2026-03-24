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
        ('Vận hành', {
            'fields': ('working_hours', 'daily_capacity')
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
    change_list_template = 'admin/api/timeslot/change_list.html'
    change_form_template = 'admin/api/timeslot/change_form.html'
    
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
    
    def changelist_view(self, request, extra_context=None):
        """Custom changelist view để truyền data cho template"""
        from django.db.models import Avg, Count
        
        extra_context = extra_context or {}
        timeslots = TimeSlot.objects.select_related('station').all()
        
        extra_context['timeslots'] = timeslots
        extra_context['total_slots'] = timeslots.count()
        extra_context['active_slots'] = timeslots.filter(is_active=True).count()
        
        avg_cap = timeslots.aggregate(Avg('max_capacity'))['max_capacity__avg']
        extra_context['avg_capacity'] = avg_cap if avg_cap else 0
        
        extra_context['stations_count'] = timeslots.values('station').distinct().count()
        extra_context['stations'] = Station.objects.all()
        
        return super().changelist_view(request, extra_context=extra_context)
    
    def get_urls(self):
        from django.urls import path
        urls = super().get_urls()
        custom_urls = [
            path('add-timeslot-ajax/', self.admin_site.admin_view(self.add_timeslot_ajax), name='add_timeslot_ajax'),
            path('update-timeslot-ajax/', self.admin_site.admin_view(self.update_timeslot_ajax), name='update_timeslot_ajax'),
            path('delete-timeslot-ajax/', self.admin_site.admin_view(self.delete_timeslot_ajax), name='delete_timeslot_ajax'),
        ]
        return custom_urls + urls
    
    def add_timeslot_ajax(self, request):
        from django.http import JsonResponse
        from datetime import time
        if request.method == 'POST':
            try:
                station_id = request.POST.get('station')
                time_slot_str = request.POST.get('time_slot')
                day_of_week = request.POST.get('day_of_week')
                max_capacity = request.POST.get('max_capacity')
                is_active = request.POST.get('is_active') == 'on'
                display_order = request.POST.get('display_order', 0)
                notes = request.POST.get('notes', '')
                
                station = Station.objects.get(id=station_id)
                
                # Convert time string to time object
                hour, minute = time_slot_str.split(':')
                time_obj = time(int(hour), int(minute))
                
                timeslot = TimeSlot.objects.create(
                    station=station,
                    time_slot=time_obj,
                    day_of_week=day_of_week,
                    max_capacity=max_capacity,
                    is_active=is_active,
                    display_order=display_order,
                    notes=notes
                )
                
                return JsonResponse({'success': True, 'message': f'Đã thêm khung giờ {time_slot_str} cho {station.station_name}!'})
            except Exception as e:
                import traceback
                print(f"Error: {traceback.format_exc()}")
                return JsonResponse({'success': False, 'message': f'Lỗi: {str(e)}'})
        return JsonResponse({'success': False, 'message': 'Invalid request'})
    
    def update_timeslot_ajax(self, request):
        from django.http import JsonResponse
        from datetime import time
        if request.method == 'POST':
            try:
                timeslot_id = request.POST.get('timeslot_id')
                timeslot = TimeSlot.objects.get(id=timeslot_id)
                
                # Convert time string to time object
                time_slot_str = request.POST.get('time_slot')
                hour, minute = time_slot_str.split(':')
                time_obj = time(int(hour), int(minute))
                
                timeslot.station_id = request.POST.get('station')
                timeslot.time_slot = time_obj
                timeslot.day_of_week = request.POST.get('day_of_week')
                timeslot.max_capacity = request.POST.get('max_capacity')
                timeslot.is_active = request.POST.get('is_active') == 'on'
                timeslot.display_order = request.POST.get('display_order', 0)
                timeslot.notes = request.POST.get('notes', '')
                timeslot.save()
                
                return JsonResponse({'success': True, 'message': 'Cập nhật khung giờ thành công!'})
            except Exception as e:
                import traceback
                print(f"Error: {traceback.format_exc()}")
                return JsonResponse({'success': False, 'message': f'Lỗi: {str(e)}'})
        return JsonResponse({'success': False, 'message': 'Invalid request'})
    
    def delete_timeslot_ajax(self, request):
        from django.http import JsonResponse
        if request.method == 'POST':
            try:
                timeslot_id = request.POST.get('timeslot_id')
                timeslot = TimeSlot.objects.get(id=timeslot_id)
                timeslot_info = f"{timeslot.time_slot} - {timeslot.station.station_name}"
                timeslot.delete()
                
                return JsonResponse({'success': True, 'message': f'Đã xóa khung giờ {timeslot_info}!'})
            except Exception as e:
                return JsonResponse({'success': False, 'message': f'Lỗi: {str(e)}'})
        return JsonResponse({'success': False, 'message': 'Invalid request'})
    
    def add_view(self, request, form_url='', extra_context=None):
        """Custom add view để truyền stations và xử lý form submission"""
        extra_context = extra_context or {}
        extra_context['stations'] = Station.objects.filter(status='active').order_by('station_name')
        
        # Xử lý POST request
        if request.method == 'POST':
            # Xử lý checkbox is_active
            post_data = request.POST.copy()
            if 'is_active' not in post_data:
                post_data['is_active'] = False
            else:
                post_data['is_active'] = True
            
            # Tạo object mới
            try:
                obj = TimeSlot(
                    station_id=post_data.get('station'),
                    time_slot=post_data.get('time_slot'),
                    day_of_week=post_data.get('day_of_week'),
                    max_capacity=post_data.get('max_capacity'),
                    display_order=post_data.get('display_order', 0),
                    is_active=post_data['is_active'],
                    notes=post_data.get('notes', '')
                )
                obj.save()
                
                # Kiểm tra nếu là popup
                if '_popup' in request.GET or '_popup' in request.POST:
                    from django.http import HttpResponse
                    return HttpResponse(
                        f'<script type="text/javascript">'
                        f'opener.dismissAddRelatedObjectPopup(window, "{obj.pk}", "{obj}");'
                        f'</script>'
                    )
                
                # Nếu không phải popup, redirect về changelist
                from django.shortcuts import redirect
                from django.contrib import messages
                messages.success(request, f'Đã thêm khung giờ "{obj}" thành công!')
                
                if '_continue' in request.POST:
                    return redirect(f'/admin/api/timeslot/{obj.pk}/change/')
                else:
                    return redirect('/admin/api/timeslot/')
                    
            except Exception as e:
                from django.contrib import messages
                messages.error(request, f'Lỗi: {str(e)}')
        
        return super().add_view(request, form_url, extra_context)
    
    def change_view(self, request, object_id, form_url='', extra_context=None):
        """Custom change view để truyền stations và xử lý form submission"""
        extra_context = extra_context or {}
        extra_context['stations'] = Station.objects.filter(status='active').order_by('station_name')
        
        # Xử lý POST request
        if request.method == 'POST':
            # Xử lý checkbox is_active
            post_data = request.POST.copy()
            if 'is_active' not in post_data:
                post_data['is_active'] = False
            else:
                post_data['is_active'] = True
            
            # Update object
            try:
                obj = TimeSlot.objects.get(pk=object_id)
                obj.station_id = post_data.get('station')
                obj.time_slot = post_data.get('time_slot')
                obj.day_of_week = post_data.get('day_of_week')
                obj.max_capacity = post_data.get('max_capacity')
                obj.display_order = post_data.get('display_order', 0)
                obj.is_active = post_data['is_active']
                obj.notes = post_data.get('notes', '')
                obj.save()
                
                # Nếu không phải popup, redirect về changelist
                from django.shortcuts import redirect
                from django.contrib import messages
                messages.success(request, f'Đã cập nhật khung giờ "{obj}" thành công!')
                
                if '_continue' in request.POST:
                    return redirect(f'/admin/api/timeslot/{obj.pk}/change/')
                else:
                    return redirect('/admin/api/timeslot/')
                    
            except Exception as e:
                from django.contrib import messages
                messages.error(request, f'Lỗi: {str(e)}')
        
        return super().change_view(request, object_id, form_url, extra_context)
    
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
    list_display = ['id', 'type_code', 'type_name', 'get_base_price', 'get_status_badge', 'get_action_buttons']
    list_filter = ['status']
    search_fields = ['type_code', 'type_name']
    readonly_fields = ['created_at', 'updated_at']
    
    # ✅ Custom templates
    change_list_template = 'admin/api/vehicletype/change_list.html'
    change_form_template = 'admin/api/vehicletype/change_form.html'
    
    def get_base_price(self, obj):
        """Hiển thị giá cơ bản"""
        from django.utils.html import format_html
        if obj.base_price:
            # Format số trước, rồi mới truyền vào format_html
            price_formatted = "{:,.0f}".format(obj.base_price)
            return format_html('<span class="price-display">{}đ</span>', price_formatted)
        return '-'
    get_base_price.short_description = 'Giá cơ bản'
    get_base_price.admin_order_field = 'base_price'
    
    def get_status_badge(self, obj):
        """Hiển thị trạng thái với badge"""
        from django.utils.html import mark_safe
        if obj.status == 'active':
            return mark_safe('<span class="status-badge active">✅ Hoạt động</span>')
        else:
            return mark_safe('<span class="status-badge inactive">⏸️ Ngừng hoạt động</span>')
    get_status_badge.short_description = 'Trạng thái'
    get_status_badge.admin_order_field = 'status'
    
    def get_action_buttons(self, obj):
        """Hiển thị action buttons (Sửa/Xóa)"""
        from django.utils.html import format_html, mark_safe
        # Dùng mark_safe cho SVG để tránh conflict với format_html
        edit_svg = '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 14px; height: 14px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>'
        delete_svg = '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 14px; height: 14px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>'
        
        return format_html(
            '''
            <div class="action-buttons">
                <button type="button" class="btn-edit" 
                        data-action="edit-vehicle-type"
                        data-id="{0}"
                        data-code="{1}"
                        data-name="{2}"
                        data-price="{3}"
                        data-status="{4}">
                    {5}
                    Sửa
                </button>
                <button type="button" class="btn-delete" 
                        data-action="delete-vehicle-type"
                        data-id="{6}"
                        data-name="{7}">
                    {8}
                    Xóa
                </button>
            </div>
            ''',
            obj.id,
            obj.type_code,
            obj.type_name,
            obj.base_price or '',
            obj.status,
            mark_safe(edit_svg),
            obj.id,
            obj.type_name,
            mark_safe(delete_svg)
        )
    get_action_buttons.short_description = 'Thao tác'
    get_action_buttons.allow_tags = True
    
    def changelist_view(self, request, extra_context=None):
        """Custom changelist view with statistics"""
        # Get queryset
        queryset = self.get_queryset(request)
        
        # Calculate stats
        total_vehicle_types = queryset.count()
        active_vehicle_types = queryset.filter(status='active').count()
        inactive_vehicle_types = queryset.filter(status='inactive').count()
        
        # Add to context
        extra_context = extra_context or {}
        extra_context.update({
            'total_vehicle_types': total_vehicle_types,
            'active_vehicle_types': active_vehicle_types,
            'inactive_vehicle_types': inactive_vehicle_types,
            'object_list': queryset.order_by('id'),  # ✅ ADD: Pass queryset for template
        })
        
        return super().changelist_view(request, extra_context=extra_context)
    
    def change_view(self, request, object_id, form_url='', extra_context=None):
        """Custom change view to pass additional context"""
        # No additional data needed for VehicleType edit form
        # Template will use the object data directly
        extra_context = extra_context or {}
        
        return super().change_view(request, object_id, form_url, extra_context)
    
    def get_urls(self):
        """Add custom URLs for AJAX operations"""
        from django.urls import path
        urls = super().get_urls()
        custom_urls = [
            path('add-ajax/', self.admin_site.admin_view(self.add_ajax), name='vehicletype_add_ajax'),
            path('edit-ajax/', self.admin_site.admin_view(self.edit_ajax), name='vehicletype_edit_ajax'),
            path('delete-ajax/', self.admin_site.admin_view(self.delete_ajax), name='vehicletype_delete_ajax'),
        ]
        return custom_urls + urls
    
    def add_ajax(self, request):
        """Handle AJAX add request"""
        from django.http import JsonResponse
        
        if request.method == 'POST':
            try:
                type_code = request.POST.get('type_code')
                type_name = request.POST.get('type_name')
                base_price = request.POST.get('base_price') or 0
                status = request.POST.get('status', 'active')
                
                # Check if type_code already exists
                if VehicleType.objects.filter(type_code=type_code).exists():
                    return JsonResponse({
                        'success': False,
                        'message': f'❌ Mã loại xe "{type_code}" đã tồn tại!'
                    })
                
                # Create vehicle type
                VehicleType.objects.create(
                    type_code=type_code,
                    type_name=type_name,
                    base_price=base_price,
                    status=status
                )
                
                return JsonResponse({
                    'success': True,
                    'message': f'✅ Đã thêm loại xe "{type_name}" thành công!'
                })
            except Exception as e:
                return JsonResponse({
                    'success': False,
                    'message': f'❌ Lỗi: {str(e)}'
                })
        
        return JsonResponse({'success': False, 'message': 'Invalid request'})
    
    def edit_ajax(self, request):
        """Handle AJAX edit request"""
        from django.http import JsonResponse
        
        if request.method == 'POST':
            try:
                vehicle_type_id = request.POST.get('id')
                type_code = request.POST.get('type_code')
                type_name = request.POST.get('type_name')
                base_price = request.POST.get('base_price') or 0
                status = request.POST.get('status', 'active')
                
                # Get vehicle type
                vehicle_type = VehicleType.objects.get(id=vehicle_type_id)
                
                # Check if type_code changed and already exists
                if vehicle_type.type_code != type_code:
                    if VehicleType.objects.filter(type_code=type_code).exists():
                        return JsonResponse({
                            'success': False,
                            'message': f'❌ Mã loại xe "{type_code}" đã tồn tại!'
                        })
                
                # Update vehicle type
                vehicle_type.type_code = type_code
                vehicle_type.type_name = type_name
                vehicle_type.base_price = base_price
                vehicle_type.status = status
                vehicle_type.save()
                
                return JsonResponse({
                    'success': True,
                    'message': f'✅ Đã cập nhật loại xe "{type_name}" thành công!'
                })
            except VehicleType.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': '❌ Không tìm thấy loại xe!'
                })
            except Exception as e:
                return JsonResponse({
                    'success': False,
                    'message': f'❌ Lỗi: {str(e)}'
                })
        
        return JsonResponse({'success': False, 'message': 'Invalid request'})
    
    def delete_ajax(self, request):
        """Handle AJAX delete request"""
        from django.http import JsonResponse
        
        if request.method == 'POST':
            try:
                vehicle_type_id = request.POST.get('id')
                vehicle_type = VehicleType.objects.get(id=vehicle_type_id)
                
                # Check if vehicle type is being used
                if Vehicle.objects.filter(vehicle_type=vehicle_type).exists():
                    return JsonResponse({
                        'success': False,
                        'message': f'❌ Không thể xóa loại xe "{vehicle_type.type_name}" vì đang được sử dụng bởi các phương tiện!'
                    })
                
                type_name = vehicle_type.type_name
                vehicle_type.delete()
                
                return JsonResponse({
                    'success': True,
                    'message': f'✅ Đã xóa loại xe "{type_name}" thành công!'
                })
            except VehicleType.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': '❌ Không tìm thấy loại xe!'
                })
            except Exception as e:
                return JsonResponse({
                    'success': False,
                    'message': f'❌ Lỗi: {str(e)}'
                })
        
        return JsonResponse({'success': False, 'message': 'Invalid request'})


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'license_plate', 'get_full_name', 'customer', 
        'vehicle_type', 'color', 'manufacture_year', 
        'get_inspection_status', 'status', 'get_action_buttons'
    ]
    list_filter = ['status', 'vehicle_type', 'manufacture_year', 'color']
    search_fields = ['license_plate', 'brand', 'model', 'chassis_number', 'engine_number', 'customer__full_name']
    readonly_fields = ['created_at', 'updated_at']
    
    # ✅ Custom list template only (using Tailwind modal instead of change_form)
    change_list_template = 'admin/api/vehicle/change_list.html'
    
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
            'fields': ('registration_date', 'last_inspection_date', 'next_inspection_date')  # ✅ SỬA: Dùng đúng 3 fields có trong model
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
        """Custom changelist view with statistics and filtering"""
        from datetime import date, timedelta
        
        # Get base queryset
        queryset = self.get_queryset(request)
        
        # Apply quick filter if present
        filter_type = request.GET.get('filter', 'all')
        
        if filter_type == 'valid':
            # Còn hạn đăng kiểm (> 30 ngày)
            queryset = queryset.filter(next_inspection_date__gt=date.today() + timedelta(days=30))
        elif filter_type == 'expiring':
            # Sắp hết hạn (0-30 ngày)
            queryset = queryset.filter(
                next_inspection_date__gte=date.today(),
                next_inspection_date__lte=date.today() + timedelta(days=30)
            )
        elif filter_type == 'expired':
            # Đã hết hạn
            queryset = queryset.filter(next_inspection_date__lt=date.today())
        elif filter_type == 'no-inspection':
            # Chưa có thông tin đăng kiểm
            queryset = queryset.filter(next_inspection_date__isnull=True)
        
        # Calculate statistics (on full queryset, not filtered)
        all_vehicles = self.get_queryset(request)
        total_vehicles = all_vehicles.count()
        
        # Valid: > 30 days
        valid_inspection = all_vehicles.filter(
            next_inspection_date__gt=date.today() + timedelta(days=30)
        ).count()
        
        # Expiring soon: 0-30 days
        expiring_soon = all_vehicles.filter(
            next_inspection_date__gte=date.today(),
            next_inspection_date__lte=date.today() + timedelta(days=30)
        ).count()
        
        # Expired: < today
        expired_inspection = all_vehicles.filter(
            next_inspection_date__lt=date.today()
        ).count()
        
        # Get data for modal dropdowns
        from api.models import Customer
        all_customers = Customer.objects.all().order_by('full_name')  # Customer không có status field
        all_vehicle_types = VehicleType.objects.filter(status='active').order_by('type_name')
        
        # Add to context
        extra_context = extra_context or {}
        extra_context.update({
            'total_vehicles': total_vehicles,
            'valid_inspection': valid_inspection,
            'expiring_soon': expiring_soon,
            'expired_inspection': expired_inspection,
            'all_customers': all_customers,
            'all_vehicle_types': all_vehicle_types,
            'object_list': all_vehicles.order_by('-id'),  # ✅ ADD: Pass queryset for template (all vehicles, sorted by latest)
        })
        
        return super().changelist_view(request, extra_context=extra_context)
    
    def change_view(self, request, object_id, form_url='', extra_context=None):
        """Custom change view to pass additional context"""
        from api.models import Customer
        
        # Get data for form dropdowns
        all_customers = Customer.objects.all().order_by('full_name')
        all_vehicle_types = VehicleType.objects.filter(status='active').order_by('type_name')
        
        # Add to context
        extra_context = extra_context or {}
        extra_context.update({
            'all_customers': all_customers,
            'all_vehicle_types': all_vehicle_types,
        })
        
        return super().change_view(request, object_id, form_url, extra_context)
    
    def get_queryset(self, request):
        """Override to handle filtering"""
        qs = super().get_queryset(request)
        
        # If we have a custom queryset set in changelist_view, use it
        if hasattr(self, 'queryset') and self.queryset is not None:
            filtered_qs = self.queryset
            self.queryset = None  # Reset for next request
            return filtered_qs
        
        return qs
    
    def get_full_name(self, obj):
        """Hiển thị tên đầy đủ xe"""
        return f"{obj.brand} {obj.model} {obj.manufacture_year}"
    get_full_name.short_description = 'Xe'
    
    def get_inspection_status(self, obj):
        """Hiển thị trạng thái đăng kiểm với HTML badge"""
        from django.utils.html import format_html, mark_safe
        
        if obj.next_inspection_date:
            from datetime import date
            days_left = (obj.next_inspection_date - date.today()).days
            
            if days_left < 0:
                # Expired
                return format_html(
                    '<span class="inspection-status expired">❌ Hết hạn ({0} ngày)</span>',
                    abs(days_left)
                )
            elif days_left <= 30:
                # Expiring soon
                return format_html(
                    '<span class="inspection-status expiring-soon">⚠️ Còn {0} ngày</span>',
                    days_left
                )
            else:
                # Valid
                return format_html(
                    '<span class="inspection-status valid">✅ Còn {0} ngày</span>',
                    days_left
                )
        
        return mark_safe('<span class="inspection-status no-data">⏳ Chưa có</span>')
    
    get_inspection_status.short_description = 'Hạn đăng kiểm'
    get_inspection_status.allow_tags = True
    
    def get_action_buttons(self, obj):
        """Hiển thị action buttons (Sửa/Xóa)"""
        from django.utils.html import format_html, mark_safe
        edit_svg = '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 14px; height: 14px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>'
        delete_svg = '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 14px; height: 14px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>'
        
        return format_html(
            '''
            <div class="action-buttons">
                <button type="button" class="btn-edit" 
                        data-action="edit-vehicle"
                        data-id="{0}"
                        data-license-plate="{1}"
                        data-customer="{2}"
                        data-vehicle-type="{3}"
                        data-brand="{4}"
                        data-model="{5}"
                        data-year="{6}"
                        data-color="{7}"
                        data-chassis="{8}"
                        data-engine="{9}"
                        data-status="{10}">
                    {11}
                    Sửa
                </button>
                <button type="button" class="btn-delete" 
                        data-action="delete-vehicle"
                        data-id="{12}"
                        data-license-plate="{13}">
                    {14}
                    Xóa
                </button>
            </div>
            ''',
            obj.id,
            obj.license_plate,
            obj.customer.id if obj.customer else '',
            obj.vehicle_type.id if obj.vehicle_type else '',
            obj.brand or '',
            obj.model or '',
            obj.manufacture_year or '',
            obj.color or '',
            obj.chassis_number or '',
            obj.engine_number or '',
            obj.status,
            mark_safe(edit_svg),
            obj.id,
            obj.license_plate,
            mark_safe(delete_svg)
        )
    get_action_buttons.short_description = 'Thao tác'
    get_action_buttons.allow_tags = True
    
    def get_urls(self):
        """Add custom URLs for AJAX operations"""
        from django.urls import path
        urls = super().get_urls()
        custom_urls = [
            path('add-ajax/', self.admin_site.admin_view(self.add_ajax), name='vehicle_add_ajax'),
            path('edit-ajax/', self.admin_site.admin_view(self.edit_ajax), name='vehicle_edit_ajax'),
            path('delete-ajax/', self.admin_site.admin_view(self.delete_ajax), name='vehicle_delete_ajax'),
        ]
        return custom_urls + urls
    
    def add_ajax(self, request):
        """Handle AJAX add request"""
        from django.http import JsonResponse
        
        if request.method == 'POST':
            try:
                # Get form data
                license_plate = request.POST.get('license_plate')
                customer_id = request.POST.get('customer_id')
                vehicle_type_id = request.POST.get('vehicle_type_id')
                brand = request.POST.get('brand')
                model = request.POST.get('model')
                manufacture_year = request.POST.get('manufacture_year')
                color = request.POST.get('color')
                chassis_number = request.POST.get('chassis_number')
                engine_number = request.POST.get('engine_number')
                status = request.POST.get('status', 'active')
                
                # Validate required fields
                if not license_plate:
                    return JsonResponse({
                        'success': False,
                        'message': '❌ Vui lòng nhập biển số xe!'
                    })
                
                # Check duplicate license plate
                if Vehicle.objects.filter(license_plate=license_plate).exists():
                    return JsonResponse({
                        'success': False,
                        'message': f'❌ Biển số xe "{license_plate}" đã tồn tại!'
                    })
                
                # Create vehicle
                vehicle_data = {
                    'license_plate': license_plate,
                    'brand': brand,
                    'model': model,
                    'manufacture_year': manufacture_year if manufacture_year else None,
                    'color': color,
                    'chassis_number': chassis_number,
                    'engine_number': engine_number,
                    'status': status,
                }
                
                if customer_id:
                    from api.models import Customer
                    vehicle_data['customer'] = Customer.objects.get(id=customer_id)
                
                if vehicle_type_id:
                    vehicle_data['vehicle_type'] = VehicleType.objects.get(id=vehicle_type_id)
                
                vehicle = Vehicle.objects.create(**vehicle_data)
                
                return JsonResponse({
                    'success': True,
                    'message': f'✅ Đã thêm xe "{license_plate}" thành công!'
                })
            except Exception as e:
                return JsonResponse({
                    'success': False,
                    'message': f'❌ Lỗi: {str(e)}'
                })
        
        return JsonResponse({'success': False, 'message': 'Invalid request'})
    
    def edit_ajax(self, request):
        """Handle AJAX edit request"""
        from django.http import JsonResponse
        
        if request.method == 'POST':
            try:
                vehicle_id = request.POST.get('id')
                vehicle = Vehicle.objects.get(id=vehicle_id)
                
                # Update fields
                vehicle.license_plate = request.POST.get('license_plate', vehicle.license_plate)
                vehicle.brand = request.POST.get('brand', vehicle.brand)
                vehicle.model = request.POST.get('model', vehicle.model)
                vehicle.manufacture_year = request.POST.get('manufacture_year') or None
                vehicle.color = request.POST.get('color', vehicle.color)
                vehicle.chassis_number = request.POST.get('chassis_number', vehicle.chassis_number)
                vehicle.engine_number = request.POST.get('engine_number', vehicle.engine_number)
                vehicle.status = request.POST.get('status', vehicle.status)
                
                customer_id = request.POST.get('customer_id')
                if customer_id:
                    from api.models import Customer
                    vehicle.customer = Customer.objects.get(id=customer_id)
                
                vehicle_type_id = request.POST.get('vehicle_type_id')
                if vehicle_type_id:
                    vehicle.vehicle_type = VehicleType.objects.get(id=vehicle_type_id)
                
                vehicle.save()
                
                return JsonResponse({
                    'success': True,
                    'message': f'✅ Đã cập nhật xe "{vehicle.license_plate}" thành công!'
                })
            except Vehicle.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': '❌ Không tìm thấy xe!'
                })
            except Exception as e:
                return JsonResponse({
                    'success': False,
                    'message': f'❌ Lỗi: {str(e)}'
                })
        
        return JsonResponse({'success': False, 'message': 'Invalid request'})
    
    def delete_ajax(self, request):
        """Handle AJAX delete request"""
        from django.http import JsonResponse
        
        if request.method == 'POST':
            try:
                vehicle_id = request.POST.get('id')
                vehicle = Vehicle.objects.get(id=vehicle_id)
                
                # Check if vehicle is being used in orders
                from api.models import Order
                if Order.objects.filter(vehicle=vehicle).exists():
                    return JsonResponse({
                        'success': False,
                        'message': f'❌ Không thể xóa xe "{vehicle.license_plate}" vì đang có đơn hàng liên quan!'
                    })
                
                license_plate = vehicle.license_plate
                vehicle.delete()
                
                return JsonResponse({
                    'success': True,
                    'message': f'✅ Đã xóa xe "{license_plate}" thành công!'
                })
            except Vehicle.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': '❌ Không tìm thấy xe!'
                })
            except Exception as e:
                return JsonResponse({
                    'success': False,
                    'message': f'❌ Lỗi: {str(e)}'
                })
        
        return JsonResponse({'success': False, 'message': 'Invalid request'})


# ========================================
# PRICING
# ========================================

@admin.register(Pricing)
class PricingAdmin(admin.ModelAdmin):
    change_list_template = 'admin/api/pricing/change_list.html'
    change_form_template = 'admin/api/pricing/change_form.html'
    
    list_display = ['id', 'vehicle_type', 'inspection_fee', 'service_fee', 'registration_fee', 'total_amount', 'effective_from', 'status']
    list_filter = ['status', 'vehicle_type']
    search_fields = ['vehicle_type__type_name']
    readonly_fields = ['total_amount', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Thông tin cơ bản', {
            'fields': ('vehicle_type', 'status')
        }),
        ('Chi tiết phí (3 loại)', {
            'fields': ('inspection_fee', 'service_fee', 'registration_fee', 'total_amount'),
            'description': 'Tổng tiền = Phí đăng kiểm + Phí dịch vụ + Phí đường bộ (KHÔNG có VAT)'
        }),
        ('Thời gian hiệu lực', {
            'fields': ('effective_from', 'effective_to')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def changelist_view(self, request, extra_context=None):
        from django.db.models import Count, Avg
        
        extra_context = extra_context or {}
        pricings = Pricing.objects.select_related('vehicle_type').all()
        
        extra_context['pricings'] = pricings
        extra_context['total_pricings'] = pricings.count()
        extra_context['active_pricings'] = pricings.filter(status='active').count()
        extra_context['vehicle_types_count'] = pricings.values('vehicle_type').distinct().count()
        
        avg_price = pricings.aggregate(Avg('total_amount'))['total_amount__avg']
        extra_context['average_price'] = (avg_price / 1000) if avg_price else 0
        
        extra_context['vehicle_types'] = VehicleType.objects.all()
        
        return super().changelist_view(request, extra_context=extra_context)
    
    def change_view(self, request, object_id, form_url='', extra_context=None):
        extra_context = extra_context or {}
        extra_context['vehicle_types'] = VehicleType.objects.all()
        return super().change_view(request, object_id, form_url, extra_context=extra_context)
    
    def get_urls(self):
        from django.urls import path
        urls = super().get_urls()
        custom_urls = [
            path('add-pricing-ajax/', self.admin_site.admin_view(self.add_pricing_ajax), name='add_pricing_ajax'),
            path('update-pricing-ajax/', self.admin_site.admin_view(self.update_pricing_ajax), name='update_pricing_ajax'),
            path('delete-pricing-ajax/', self.admin_site.admin_view(self.delete_pricing_ajax), name='delete_pricing_ajax'),
        ]
        return custom_urls + urls
    
    def add_pricing_ajax(self, request):
        from django.http import JsonResponse
        from decimal import Decimal
        if request.method == 'POST':
            try:
                # Debug logging
                print(f"DEBUG - POST data: {dict(request.POST)}")
                
                vehicle_type_id = request.POST.get('vehicle_type')
                inspection_fee = request.POST.get('inspection_fee', '').strip()
                service_fee = request.POST.get('service_fee', '').strip()
                registration_fee = request.POST.get('registration_fee', '').strip()
                effective_from = request.POST.get('effective_from')
                effective_to = request.POST.get('effective_to', '').strip()
                status = request.POST.get('status', 'active')
                
                # Convert to Decimal, default 0
                inspection_fee = Decimal(inspection_fee) if inspection_fee else Decimal('0')
                service_fee = Decimal(service_fee) if service_fee else Decimal('0')
                registration_fee = Decimal(registration_fee) if registration_fee else Decimal('0')
                
                # Debug individual values
                print(f"DEBUG - inspection_fee: {inspection_fee}")
                print(f"DEBUG - service_fee: {service_fee}")
                print(f"DEBUG - registration_fee: {registration_fee}")
                
                vehicle_type = VehicleType.objects.get(id=vehicle_type_id)
                
                # Create pricing object (total_amount will be auto-calculated in save())
                pricing_data = {
                    'vehicle_type': vehicle_type,
                    'inspection_fee': inspection_fee,
                    'service_fee': service_fee,
                    'registration_fee': registration_fee,
                    'effective_from': effective_from,
                    'status': status
                }
                
                # Only add effective_to if not empty
                if effective_to:
                    pricing_data['effective_to'] = effective_to
                
                pricing = Pricing.objects.create(**pricing_data)
                
                print(f"DEBUG - Created pricing with total: {pricing.total_amount}")
                
                return JsonResponse({'success': True, 'message': f'Đã thêm bảng giá cho {vehicle_type.type_name}!'})
            except Exception as e:
                import traceback
                print(f"DEBUG - Exception: {traceback.format_exc()}")
                return JsonResponse({'success': False, 'message': f'Lỗi: {str(e)}'})
        return JsonResponse({'success': False, 'message': 'Invalid request'})
    
    def update_pricing_ajax(self, request):
        from django.http import JsonResponse
        from decimal import Decimal
        if request.method == 'POST':
            try:
                pricing_id = request.POST.get('pricing_id')
                pricing = Pricing.objects.get(id=pricing_id)
                
                inspection_fee = request.POST.get('inspection_fee', '').strip()
                service_fee = request.POST.get('service_fee', '').strip()
                registration_fee = request.POST.get('registration_fee', '').strip()
                effective_to = request.POST.get('effective_to', '').strip()
                
                # Convert to Decimal, default 0
                inspection_fee = Decimal(inspection_fee) if inspection_fee else Decimal('0')
                service_fee = Decimal(service_fee) if service_fee else Decimal('0')
                registration_fee = Decimal(registration_fee) if registration_fee else Decimal('0')
                
                pricing.vehicle_type_id = request.POST.get('vehicle_type')
                pricing.inspection_fee = inspection_fee
                pricing.service_fee = service_fee
                pricing.registration_fee = registration_fee
                pricing.effective_from = request.POST.get('effective_from')
                pricing.effective_to = effective_to if effective_to else None
                pricing.status = request.POST.get('status', 'active')
                pricing.save()  # Auto-calculates total_amount
                
                return JsonResponse({'success': True, 'message': 'Cập nhật bảng giá thành công!'})
            except Exception as e:
                import traceback
                print(f"DEBUG UPDATE - Exception: {traceback.format_exc()}")
                return JsonResponse({'success': False, 'message': f'Lỗi: {str(e)}'})
        return JsonResponse({'success': False, 'message': 'Invalid request'})
    
    def delete_pricing_ajax(self, request):
        from django.http import JsonResponse
        if request.method == 'POST':
            try:
                pricing_id = request.POST.get('pricing_id')
                pricing = Pricing.objects.get(id=pricing_id)
                pricing.delete()
                return JsonResponse({'success': True, 'message': 'Xóa bảng giá thành công!'})
            except Exception as e:
                return JsonResponse({'success': False, 'message': f'Lỗi: {str(e)}'})
        return JsonResponse({'success': False, 'message': 'Invalid request'})


# ========================================
# SERVICES
# ========================================

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['id', 'service_code', 'service_name', 'category', 'base_price', 'is_required', 'status', 'display_order']
    list_filter = ['category', 'is_required', 'status']
    search_fields = ['service_code', 'service_name', 'description']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['display_order', 'service_name']
    
    fieldsets = (
        ('Thông tin dịch vụ', {
            'fields': ('service_code', 'service_name', 'description', 'category')
        }),
        ('Giá & Cấu hình', {
            'fields': ('base_price', 'is_required', 'status', 'display_order')
        }),
        ('System', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


class OrderServiceInline(admin.TabularInline):
    """Inline để hiển thị services trong Order Admin"""
    model = OrderService
    extra = 1
    readonly_fields = ['total_price']
    fields = ['service', 'service_name', 'quantity', 'unit_price', 'total_price', 'discount_amount', 'notes']


@admin.register(OrderService)
class OrderServiceAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'service', 'service_name', 'quantity', 'unit_price', 'total_price', 'created_at']
    list_filter = ['created_at', 'service']
    search_fields = ['order__order_code', 'service__service_name', 'service_name']
    readonly_fields = ['total_price', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Đơn hàng', {
            'fields': ('order',)
        }),
        ('Dịch vụ', {
            'fields': ('service', 'service_name')
        }),
        ('Giá & Số lượng', {
            'fields': ('quantity', 'unit_price', 'discount_amount', 'total_price')
        }),
        ('Ghi chú', {
            'fields': ('notes',),
            'classes': ('collapse',)
        }),
        ('System', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


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
        'station', 'get_staff_assignment', 'status', 'priority', 
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
    inlines = [VehicleReceiptLogInline, OrderStatusHistoryInline, OrderChecklistInline, OrderServiceInline]
    
    # ✅ THÊM: Actions để bulk assign staff
    actions = ['assign_staff_action']
    
    # ✅ THÊM: Custom template với inline CSS/JS
    change_list_template = 'admin/api/order/change_list.html'
    
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
    
    def get_staff_assignment(self, obj):
        """✅ Hiển thị button phân công nhân viên theo design AdminOrdersScreen.tsx"""
        from django.utils.html import format_html
        
        if obj.assigned_staff:
            # Nếu đã có nhân viên được assign
            return format_html(
                '<span class="staff-assigned-text">{} ({})</span>',
                obj.assigned_staff.full_name,
                obj.assigned_staff.employee_code
            )
        else:
            # Chưa assign, hiển thị button phân công
            return format_html(
                '''
                <div class="staff-assignment-cell">
                    <button type="button" data-action="assign-staff" data-order-id="{}" data-order-code="{}">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        Phân công
                    </button>
                </div>
                ''',
                obj.id,
                obj.order_code
            )
    get_staff_assignment.short_description = '👤 Nhân viên'
    get_staff_assignment.allow_tags = True
    
    def get_staff_name(self, obj):
        """Hiển thị tên nhân viên (dùng ở detail view)"""
        if obj.assigned_staff:
            return f"{obj.assigned_staff.full_name} ({obj.assigned_staff.employee_code})"
        return '⏳ Chưa phân công'
    get_staff_name.short_description = 'Nhân viên'
    
    def total_amount_display(self, obj):
        """Hiển thị tổng tiền"""
        total = obj.estimated_amount + obj.additional_amount
        return f"{total:,.0f}đ"
    total_amount_display.short_description = 'Tổng tiền'
    
    # ✅ THÊM: Bulk action để assign staff
    def assign_staff_action(self, request, queryset):
        """Bulk action để assign staff cho nhiều orders"""
        from django.contrib import messages
        from django.shortcuts import render
        
        # Nếu đã submit form
        if 'apply' in request.POST:
            staff_id = request.POST.get('staff')
            if staff_id:
                staff = Staff.objects.get(id=staff_id)
                count = queryset.update(assigned_staff=staff)
                self.message_user(request, f'Đã phân công {staff.full_name} cho {count} đơn hàng')
                return
        
        # Hiển thị form chọn staff
        staff_list = Staff.objects.filter(status='active')
        return render(request, 'admin/assign_staff_form.html', {
            'orders': queryset,
            'staff_list': staff_list,
            'title': 'Phân công nhân viên cho các đơn đã chọn'
        })
    assign_staff_action.short_description = '👥 Phân công nhân viên'
    
    # ✅ THÊM: Custom URLs cho AJAX
    def get_urls(self):
        from django.urls import path
        urls = super().get_urls()
        custom_urls = [
            # ✅ IMPORTANT: Specific paths MUST come BEFORE dynamic paths
            # Otherwise <path:object_id>/assign-staff/ will match "random-assign-staff/"
            
            # ✅ NEW: Endpoint để load staff list cho modal
            path('get-staff-list/', 
                 self.admin_site.admin_view(self.get_staff_list_ajax),
                 name='api_order_get_staff_list_ajax'),  # ✅ FIX: Đổi từ shop_ sang api_
            
            path('random-assign-staff/', 
                 self.admin_site.admin_view(self.random_assign_staff_ajax),
                 name='api_order_random_assign_staff_ajax'),  # ✅ FIX: Đổi từ shop_ sang api_
            path('<path:object_id>/assign-staff/', 
                 self.admin_site.admin_view(self.assign_staff_ajax),
                 name='api_order_assign_staff_ajax'),  # ✅ FIX: Đổi từ shop_ sang api_
        ]
        # ✅ Custom URLs must come FIRST to take precedence
        return custom_urls + urls
    
    def get_staff_list_ajax(self, request):
        """✅ AJAX endpoint để load danh sách staff cho modal - Django Admin only"""
        from django.http import JsonResponse
        
        try:
            # Get all staff (có thể filter theo status nếu cần)
            staff_list = Staff.objects.select_related('user', 'role').order_by('full_name')
            
            # Format response giống DRF pagination để tương thích với frontend
            data = {
                'count': staff_list.count(),
                'results': [
                    {
                        'id': staff.id,
                        'full_name': staff.full_name,
                        'employee_code': staff.employee_code,
                        'phone_number': staff.phone,  # ✅ FIX: Model field là 'phone'
                        'status': staff.status,  # 'active', 'inactive', 'on_leave'
                        'role_name': staff.role.name if staff.role else 'Nhân viên đăng kiểm',  # ✅ FIX: Get role from FK
                    }
                    for staff in staff_list
                ]
            }
            
            return JsonResponse(data, safe=False)
            
        except Exception as e:
            # ✅ Return detailed error for debugging
            import traceback
            return JsonResponse({
                'error': str(e),
                'traceback': traceback.format_exc(),
                'count': 0,
                'results': []
            }, status=500)
    
    def assign_staff_ajax(self, request):
        """✅ AJAX endpoint để assign staff"""
        from django.http import JsonResponse
        
        if request.method == 'POST':
            try:
                order_id = request.POST.get('order_id')
                staff_id = request.POST.get('staff_id')
                
                order = Order.objects.get(id=order_id)
                staff = Staff.objects.get(id=staff_id)
                
                order.assigned_staff = staff
                order.status = 'assigned'  # Update status
                order.save()
                
                return JsonResponse({
                    'success': True,
                    'message': f'Đã phân công {staff.full_name} cho đơn {order.order_code}',
                    'staff_name': staff.full_name,
                    'staff_id': staff.id
                })
                    
            except Exception as e:
                return JsonResponse({
                    'success': False,
                    'error': str(e)
                }, status=400)
        
        return JsonResponse({'success': False, 'error': 'Invalid request'}, status=400)
    
    def random_assign_staff_ajax(self, request):
        """✅ AJAX endpoint để phân công ngẫu nhiên"""
        from django.http import JsonResponse
        import random
        
        if request.method == 'POST':
            try:
                order_id = request.POST.get('order_id')
                order = Order.objects.get(id=order_id)
                
                # Lấy danh sách staff active
                active_staff = list(Staff.objects.filter(status='active'))
                
                if not active_staff:
                    return JsonResponse({
                        'success': False,
                        'error': 'Không có nhân viên rảnh'
                    }, status=400)
                
                # Random chọn 1 staff
                random_staff = random.choice(active_staff)
                
                order.assigned_staff = random_staff
                order.status = 'assigned'
                order.save()
                
                return JsonResponse({
                    'success': True,
                    'message': f'Đã phân công ngẫu nhiên cho {random_staff.full_name}',
                    'staff_name': random_staff.full_name,
                    'staff_id': random_staff.id
                })
                    
            except Exception as e:
                return JsonResponse({
                    'success': False,
                    'error': str(e)
                }, status=400)
        
        return JsonResponse({'success': False, 'error': 'Invalid request'}, status=400)
    
    def staff_assignment_modal(self, request):
        """✅ View để hiển thị modal phân công staff"""
        from django.shortcuts import render
        
        order_id = request.GET.get('order_id')
        order_code = request.GET.get('order_code', '')
        
        return render(request, 'admin/staff_assignment_modal.html', {
            'order_id': order_id,
            'order_code': order_code,
        })


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
            'description': 'Status flow: draft → vehicle_inspected → condition_checked → inspection_expiry_updated → completed'  # ✨ UPDATED 18/03/2026
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
    change_form_template = 'admin/api/checklistitem/change_form.html'  # ✅ ADD: Enable detail page
    
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