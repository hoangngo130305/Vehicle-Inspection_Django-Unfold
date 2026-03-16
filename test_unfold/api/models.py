from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models.signals import post_save
from django.dispatch import receiver
import uuid




# ========================================
# 1. CUSTOMER PROFILE (Khách hàng)
# ========================================

class Customer(models.Model):
    """
    Profile cho Khách hàng - OneToOne với auth_user
    Bảng: customers
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='customer_profile')
    
    # Thông tin cá nhân
    full_name = models.CharField(max_length=200, blank=True, default='')  # ✅ Cho phép trống
    phone = models.CharField(max_length=20, unique=True)
    avatar_url = models.CharField(max_length=500, null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, null=True, blank=True)
    
    # ✅✅ NEW - Thông tin CMND/CCCD (08/03/2026 - Cho quy trình nhận xe)
    id_number = models.CharField(max_length=20, null=True, blank=True, help_text='Số CMND/CCCD')
    id_issued_date = models.DateField(null=True, blank=True, help_text='Ngày cấp CMND/CCCD')
    id_issued_place = models.CharField(max_length=200, null=True, blank=True, help_text='Nơi cấp CMND/CCCD')
    
    # Địa chỉ
    address = models.TextField(null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    district = models.CharField(max_length=100, null=True, blank=True)
    ward = models.CharField(max_length=100, null=True, blank=True)
    
    # Social Login IDs
    google_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    facebook_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    apple_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    
    # Verification
    phone_verified = models.BooleanField(default=False)
    email_verified = models.BooleanField(default=False)
    
    # Statistics
    total_orders = models.IntegerField(default=0)
    completed_orders = models.IntegerField(default=0)
    total_spent = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    loyalty_points = models.IntegerField(default=0)
    membership_tier = models.CharField(max_length=20, default='bronze')
    
    # Settings
    preferred_language = models.CharField(max_length=10, default='vi')
    timezone = models.CharField(max_length=50, default='Asia/Ho_Chi_Minh')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'customers'
        verbose_name = 'Customer'
        verbose_name_plural = 'Customers'

    def __str__(self):
        return f"{self.full_name} ({self.phone})"


# ========================================
# 2. STAFF PROFILE (Nhân viên)
# ========================================

class Role(models.Model):
    """Bảng: roles"""
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=50, unique=True)
    description = models.TextField(null=True, blank=True)
    level = models.IntegerField(default=0)
    color = models.CharField(max_length=20, default='blue')  # ✅ ADDED
    priority = models.IntegerField(default=0)  # ✅ ADDED
    status = models.CharField(max_length=20, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'roles'

    def __str__(self):
        return self.name


class Station(models.Model):
    """Bảng: stations"""
    station_code = models.CharField(max_length=20, unique=True)
    station_name = models.CharField(max_length=200)
    address = models.TextField()
    phone = models.CharField(max_length=20)
    email = models.EmailField(null=True, blank=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    capacity = models.IntegerField(default=10)  # ✅ ADDED - Tổng sức chứa
    daily_capacity = models.IntegerField(default=50)
    working_hours = models.CharField(max_length=50, null=True, blank=True)  # ✅ ADDED - VD: "08:00 - 17:00"
    open_time = models.TimeField(null=True, blank=True)
    close_time = models.TimeField(null=True, blank=True)
    status = models.CharField(max_length=20, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'stations'

    def __str__(self):
        return self.station_name


class Staff(models.Model):
    """
    Profile cho Nhân viên - OneToOne với auth_user
    Bảng: staff
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='staff_profile')
    
    # Thông tin nhân viên
    employee_code = models.CharField(max_length=20, unique=True)
    full_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20)
    avatar_url = models.CharField(max_length=500, null=True, blank=True)
    
    # Công việc
    role = models.ForeignKey(Role, on_delete=models.PROTECT, related_name='staff_members')
    position = models.CharField(max_length=100, null=True, blank=True)
    hire_date = models.DateField(null=True, blank=True)
    
    # Thông tin cá nhân
    birth_date = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    
    # Performance
    tasks_total = models.IntegerField(default=0)
    tasks_completed = models.IntegerField(default=0)
    rating_average = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    
    # Status
    status = models.CharField(max_length=20, default='active')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'staff'
        verbose_name = 'Staff'
        verbose_name_plural = 'Staff'

    def __str__(self):
        return f"{self.employee_code} - {self.full_name}"


# ========================================
# 3. VEHICLE
# ========================================

class VehicleType(models.Model):
    """Bảng: vehicle_types"""
    type_code = models.CharField(max_length=50, unique=True)  # ✅ CHANGED from 20 to 50
    type_name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    icon_url = models.CharField(max_length=500, null=True, blank=True)  # ✅ ADDED
    display_order = models.IntegerField(default=0)  # ✅ ADDED
    base_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    status = models.CharField(max_length=20, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'vehicle_types'

    def __str__(self):
        return self.type_name


class Vehicle(models.Model):
    """Bảng: vehicles"""
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='vehicles')
    vehicle_type = models.ForeignKey(VehicleType, on_delete=models.PROTECT, related_name='vehicles')
    
    license_plate = models.CharField(max_length=20, unique=True)
    brand = models.CharField(max_length=100, null=True, blank=True)
    model = models.CharField(max_length=100, null=True, blank=True)
    color = models.CharField(max_length=50, null=True, blank=True)
    manufacture_year = models.IntegerField(null=True, blank=True)
    chassis_number = models.CharField(max_length=100, null=True, blank=True)
    engine_number = models.CharField(max_length=100, null=True, blank=True)
    
    registration_date = models.DateField(null=True, blank=True)
    last_inspection_date = models.DateField(null=True, blank=True)
    next_inspection_date = models.DateField(null=True, blank=True)
    
    status = models.CharField(max_length=20, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'vehicles'

    def __str__(self):
        return f"{self.license_plate} - {self.brand} {self.model}"


# ========================================
# 4. PRICING
# ========================================

class Pricing(models.Model):
    """Bảng: pricings"""
    vehicle_type = models.ForeignKey(VehicleType, on_delete=models.CASCADE, related_name='pricings')
    inspection_fee = models.DecimalField(max_digits=10, decimal_places=2)
    emission_test_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # ✅ ADDED
    sticker_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # ✅ ADDED
    vat_percent = models.DecimalField(max_digits=5, decimal_places=2, default=10.00)  # ✅ ADDED
    document_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    stamp_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    effective_from = models.DateField()
    effective_to = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'pricings'

    def save(self, *args, **kwargs):
        # Calculate total with VAT
        base = self.inspection_fee + self.emission_test_fee + self.sticker_fee + self.document_fee + self.stamp_fee
        self.total_amount = base * (1 + self.vat_percent / 100)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.vehicle_type.type_name} - {self.total_amount:,.0f}đ"


# ========================================
# 5. ORDER
# ========================================

class Order(models.Model):
    """Bảng: orders"""
    STATUS_CHOICES = (
        ('pending', 'Chờ xử lý'),
        ('confirmed', 'Đã xác nhận'),
        ('assigned', 'Đã phân công'),
        ('in_progress', 'Đang thực hiện'),
        ('completed', 'Hoàn thành'),
        ('cancelled', 'Đã hủy'),
    )
    
    PRIORITY_CHOICES = (
        ('low', 'Thấp'),
        ('normal', 'Bình thường'),
        ('high', 'Cao'),
        ('urgent', 'Khẩn cấp'),
    )
    
    RESULT_CHOICES = (
        ('not_started', 'Chưa kiểm tra'),
        ('pass', 'Đạt'),
        ('fail', 'Không đạt'),
    )
    
    order_code = models.CharField(max_length=30, unique=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='orders')
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='orders')
    station = models.ForeignKey(Station, on_delete=models.PROTECT, related_name='orders')
    assigned_staff = models.ForeignKey(Staff, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_orders')
    
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    estimated_amount = models.DecimalField(max_digits=10, decimal_places=2)
    additional_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='normal')
    inspection_result = models.CharField(max_length=20, choices=RESULT_CHOICES, default='not_started')
    
    customer_notes = models.TextField(null=True, blank=True)
    staff_notes = models.TextField(null=True, blank=True)
    cancel_reason = models.TextField(null=True, blank=True)
    
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # ✅ NEW - Timestamps cho các trạng thái
    confirmed_at = models.DateTimeField(null=True, blank=True, help_text="Thời gian xác nhận đơn hàng")
    cancelled_at = models.DateTimeField(null=True, blank=True, help_text="Thời gian hủy đơn hàng")
    
    # ✅✅ NEW - DRIVER LOCATION TRACKING (13/03/2026)
    # Vị trí nhận xe từ khách (do khách cung cấp khi đặt đơn)
    pickup_address = models.TextField(null=True, blank=True, help_text='Địa chỉ nhận xe từ khách')
    pickup_lat = models.DecimalField(max_digits=10, decimal_places=8, null=True, blank=True, help_text='Vĩ độ điểm nhận xe')
    pickup_lng = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True, help_text='Kinh độ điểm nhận xe')
    
    # Vị trí tài xế real-time (cập nhật liên tục trong quá trình di chuyển)
    driver_current_lat = models.DecimalField(max_digits=10, decimal_places=8, null=True, blank=True, help_text='Vĩ độ tài xế (real-time)')
    driver_current_lng = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True, help_text='Kinh độ tài xế (real-time)')
    driver_location_updated_at = models.DateTimeField(null=True, blank=True, help_text='Thời gian cập nhật vị trí cuối cùng')

    class Meta:
        db_table = 'orders'
        ordering = ['-created_at']
        

    def save(self, *args, **kwargs):
        if not self.order_code:
            self.order_code = f"DK{timezone.now().strftime('%Y%m%d')}{uuid.uuid4().hex[:6].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.order_code} - {self.customer.full_name}"


class OrderStatusHistory(models.Model):
    """Bảng: order_status_history"""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='status_history')
    from_status = models.CharField(max_length=20)
    to_status = models.CharField(max_length=20)
    changed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'order_status_history'
        ordering = ['created_at']

    def __str__(self):
        return f"{self.order.order_code}: {self.from_status} → {self.to_status}"


# ========================================
# 5A. VEHICLE RECEIPT LOG (Biên bản NHẬN XE)
# ========================================

class VehicleReceiptLog(models.Model):
    """
    Bảng: vehicle_receipt_logs
    Biên bản NHẬN XE từ khách hàng khi bắt đầu quy trình đăng kiểm
    """
    # Core fields
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='receipt_log')
    received_by = models.ForeignKey(Staff, on_delete=models.SET_NULL, null=True, blank=True, related_name='receipts')
    received_at = models.DateTimeField(auto_now_add=True, help_text='Thời gian nhận xe')
    
    # ✅ Status field (NEW - 09/03/2026)
    status = models.CharField(
        max_length=20,
        choices=[
            ('draft', 'Nháp'),
            ('vehicle_inspected', 'Đã kiểm tra xe'),
            ('condition_checked', 'Đã check tình trạng'),
            ('completed', 'Hoàn tất')
        ],
        default='draft',
        help_text='Trạng thái biên bản nhận xe'
    )
    completed_at = models.DateTimeField(null=True, blank=True, help_text='Thời gian hoàn tất biên bản')
    
    # Basic info
    odometer_reading = models.IntegerField(null=True, blank=True, help_text='Số km đã chạy')
    fuel_level = models.CharField(
        max_length=20,
        choices=[('full', 'Đầy'), ('3/4', '3/4'), ('1/2', '1/2'), ('1/4', '1/4'), ('empty', 'Cạn')],
        default='full'
    )
    
    # Exterior condition (4 sides)
    exterior_front = models.TextField(null=True, blank=True, help_text='Tình trạng phía trước')
    exterior_rear = models.TextField(null=True, blank=True, help_text='Tình trạng phía sau')
    exterior_left = models.TextField(null=True, blank=True, help_text='Tình trạng bên trái')
    exterior_right = models.TextField(null=True, blank=True, help_text='Tình trạng bên phải')
    
    # Detailed exterior
    windows_condition = models.TextField(null=True, blank=True, help_text='Tình trạng kính xe')
    lights_condition = models.TextField(null=True, blank=True, help_text='Tình trạng đèn')
    mirrors_condition = models.TextField(null=True, blank=True, help_text='Tình trạng gương')
    wipers_condition = models.TextField(null=True, blank=True, help_text='Tình trạng gạt nước')
    tires_condition = models.TextField(null=True, blank=True, help_text='Tình trạng lốp xe')
    
    # Interior
    interior_condition = models.TextField(null=True, blank=True, help_text='Tình trạng nội thất')
    
    # Accessories
    has_spare_tire = models.BooleanField(default=False)
    has_tool_kit = models.BooleanField(default=False)
    has_jack = models.BooleanField(default=False)
    has_fire_extinguisher = models.BooleanField(default=False)
    has_warning_triangle = models.BooleanField(default=False)
    has_first_aid_kit = models.BooleanField(default=False)
    
    # Documents
    has_registration = models.BooleanField(default=False, help_text='Có giấy đăng ký xe')
    has_insurance = models.BooleanField(default=False, help_text='Có bảo hiểm')
    has_previous_inspection = models.BooleanField(default=False, help_text='Có giấy đăng kiểm cũ')
    
    # Photos (6 photos)
    photo_front_url = models.CharField(max_length=500, null=True, blank=True)
    photo_rear_url = models.CharField(max_length=500, null=True, blank=True)
    photo_left_url = models.CharField(max_length=500, null=True, blank=True)
    photo_right_url = models.CharField(max_length=500, null=True, blank=True)
    photo_dashboard_url = models.CharField(max_length=500, null=True, blank=True)
    photo_interior_url = models.CharField(max_length=500, null=True, blank=True)
    
    # ✅ Document photos (NEW - 09/03/2026)
    vehicle_registration_url = models.CharField(max_length=500, null=True, blank=True, help_text='Ảnh giấy đăng ký xe')
    vehicle_insurance_url = models.CharField(max_length=500, null=True, blank=True, help_text='Ảnh bảo hiểm xe')
    
    # ✅ 8 Checkbox fields (NEW - 09/03/2026)
    exterior_ok = models.BooleanField(default=False, help_text='✓ Ngoại thất không trầy xước')
    tires_ok = models.BooleanField(default=False, help_text='✓ Lốp xe còn tốt')
    lights_ok = models.BooleanField(default=False, help_text='✓ Đèn chiếu sáng hoạt động')
    mirrors_ok = models.BooleanField(default=False, help_text='✓ Gương chiếu hậu nguyên vẹn')
    windows_ok = models.BooleanField(default=False, help_text='✓ Kính chắn gió không vỡ/nứt')
    interior_ok = models.BooleanField(default=False, help_text='✓ Nội thất sạch sẽ')
    engine_ok = models.BooleanField(default=False, help_text='✓ Động cơ hoạt động tốt')
    fuel_ok = models.BooleanField(default=False, help_text='✓ Nhiên liệu đầy đủ')
    
    # ✅ 8 Check photo fields (NEW - 09/03/2026)
    exterior_check_photo = models.CharField(max_length=500, null=True, blank=True, help_text='Ảnh check ngoại thất')
    tires_check_photo = models.CharField(max_length=500, null=True, blank=True, help_text='Ảnh check lốp xe')
    lights_check_photo = models.CharField(max_length=500, null=True, blank=True, help_text='Ảnh check đèn')
    mirrors_check_photo = models.CharField(max_length=500, null=True, blank=True, help_text='Ảnh check gương')
    windows_check_photo = models.CharField(max_length=500, null=True, blank=True, help_text='Ảnh check kính')
    interior_check_photo = models.CharField(max_length=500, null=True, blank=True, help_text='Ảnh check nội thất')
    engine_check_photo = models.CharField(max_length=500, null=True, blank=True, help_text='Ảnh check động cơ')
    fuel_check_photo = models.CharField(max_length=500, null=True, blank=True, help_text='Ảnh check nhiên liệu')
    
    # Notes & Signatures
    additional_notes = models.TextField(null=True, blank=True, help_text='Ghi chú thêm')
    special_requests = models.TextField(null=True, blank=True, help_text='Yêu cầu đặc biệt')
    customer_confirmed = models.BooleanField(default=False, help_text='Khách đã xác nhận')
    customer_signature = models.TextField(null=True, blank=True, help_text='Chữ ký khách hàng (base64)')
    staff_signature = models.TextField(null=True, blank=True, help_text='Chữ ký nhân viên (base64)')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'vehicle_receipt_logs'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Receipt: {self.order.order_code} - {self.status}"


# ========================================
# 5B. VEHICLE RETURN LOG (Biên bản TRẢ XE)
# ========================================

class VehicleReturnLog(models.Model):
    """
    Bảng: vehicle_return_logs
    Lưu chi tiết biên bản TRẢ XE khi Staff giao xe cho khách sau khi đăng kiểm xong
    """
    FUEL_LEVEL_CHOICES = (
        ('empty', 'Hết'),
        ('quarter', '1/4 bình'),
        ('half', '1/2 bình'),
        ('three_quarters', '3/4 bình'),
        ('full', 'Đầy'),
    )
    
    STATUS_CHOICES = (
        ('draft', 'Khởi tạo - Draft'),
        ('vehicle_inspected', 'Đã kiểm tra xe'),
        ('condition_checked', 'Đã kiểm tra tình trạng'),
        ('completed', 'Hoàn tất'),
    )
    
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='return_log')
    returned_by = models.ForeignKey(Staff, on_delete=models.PROTECT, related_name='returned_vehicles')
    returned_at = models.DateTimeField(auto_now_add=True)
    
    # ===== STATUS TRACKING =====
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='draft', help_text='Trạng thái biên bản')
    completed_at = models.DateTimeField(null=True, blank=True, help_text='Thời điểm hoàn tất')
    
    # ===== THÔNG TIN CƠ BẢN =====
    odometer_reading = models.IntegerField(null=True, blank=True, help_text='Số km khi trả xe')
    fuel_level = models.CharField(max_length=20, choices=FUEL_LEVEL_CHOICES, default='half')
    
    # ===== TÌNH TRẠNG NGOẠI THẤT (4 MẶT XE) =====
    exterior_front = models.TextField(null=True, blank=True, help_text='Tình trạng phía trước (đầu xe)')
    exterior_rear = models.TextField(null=True, blank=True, help_text='Tình trạng phía sau (đuôi xe)')
    exterior_left = models.TextField(null=True, blank=True, help_text='Tình trạng bên trái')
    exterior_right = models.TextField(null=True, blank=True, help_text='Tình trạng bên phải')
    
    # ===== CHI TIẾT NGOẠI THẤT =====
    windows_condition = models.TextField(null=True, blank=True, help_text='Tình trạng kính (trước, sau, cửa)')
    lights_condition = models.TextField(null=True, blank=True, help_text='Tình trạng đèn (pha, hậu, xi-nhan, phanh)')
    mirrors_condition = models.TextField(null=True, blank=True, help_text='Tình trạng gương (chiếu hậu)')
    wipers_condition = models.TextField(null=True, blank=True, help_text='Tình trạng cần gạt nước')
    tires_condition = models.TextField(null=True, blank=True, help_text='Tình trạng lốp (4 bánh + dự phòng)')
    
    # ===== TÌNH TRẠNG NỘI THẤT =====
    interior_condition = models.TextField(null=True, blank=True, help_text='Tình trạng nội thất (ghế, táp-lô, vô-lăng)')
    
    # ===== VẬT DỤNG KÈM THEO =====
    has_spare_tire = models.BooleanField(default=False, help_text='Có lốp dự phòng')
    has_tool_kit = models.BooleanField(default=False, help_text='Có bộ dụng cụ')
    has_jack = models.BooleanField(default=False, help_text='Có kích nâng')
    has_fire_extinguisher = models.BooleanField(default=False, help_text='Có bình cứu hỏa')
    has_warning_triangle = models.BooleanField(default=False, help_text='Có biển cảnh báo')
    has_first_aid_kit = models.BooleanField(default=False, help_text='Có hộp sơ cứu')
    
    # ===== GIẤY TỜ XE =====
    has_registration = models.BooleanField(default=False, help_text='Có đăng ký xe')
    has_insurance = models.BooleanField(default=False, help_text='Có bảo hiểm')
    has_previous_inspection = models.BooleanField(default=False, help_text='Có giấy đăng kiểm cũ')
    
    # ===== ẢNH CHỤP XE (6 MẶT) - KHI TRẢ =====
    photo_front_url = models.URLField(null=True, blank=True, help_text='Ảnh phía trước')
    photo_rear_url = models.URLField(null=True, blank=True, help_text='Ảnh phía sau')
    photo_left_url = models.URLField(null=True, blank=True, help_text='Ảnh bên trái')
    photo_right_url = models.URLField(null=True, blank=True, help_text='Ảnh bên phải')
    photo_dashboard_url = models.URLField(null=True, blank=True, help_text='Ảnh táp-lô (đồng hồ km)')
    photo_interior_url = models.URLField(null=True, blank=True, help_text='Ảnh nội thất')
    
    # ===== ẢNH GIẤY TỜ XE =====
    vehicle_registration_url = models.URLField(null=True, blank=True, help_text='Ảnh giấy đăng ký xe')
    vehicle_insurance_url = models.URLField(null=True, blank=True, help_text='Ảnh bảo hiểm xe')
    
    # ===== CHECKLIST KIỂM TRA (8 CHECKBOX + 8 ẢNH) =====
    # Checkbox
    exterior_ok = models.BooleanField(default=False, help_text='✓ Ngoại thất không trầy xước')
    tires_ok = models.BooleanField(default=False, help_text='✓ Lốp xe còn tốt')
    lights_ok = models.BooleanField(default=False, help_text='✓ Đèn chiếu sáng hoạt động')
    mirrors_ok = models.BooleanField(default=False, help_text='✓ Gương chiếu hậu đầy đủ')
    windows_ok = models.BooleanField(default=False, help_text='✓ Kính chắn gió nguyên vẹn')
    interior_ok = models.BooleanField(default=False, help_text='✓ Nội thất sạch sẽ')
    engine_ok = models.BooleanField(default=False, help_text='✓ Động cơ hoạt động bình thường')
    fuel_ok = models.BooleanField(default=False, help_text='✓ Xác nhận mức nhiên liệu')
    
    # Ảnh checklist (mỗi checkbox có ảnh riêng)
    exterior_check_photo = models.URLField(null=True, blank=True, help_text='Ảnh ngoại thất (checklist)')
    tires_check_photo = models.URLField(null=True, blank=True, help_text='Ảnh lốp xe (checklist)')
    lights_check_photo = models.URLField(null=True, blank=True, help_text='Ảnh đèn (checklist)')
    mirrors_check_photo = models.URLField(null=True, blank=True, help_text='Ảnh gương (checklist)')
    windows_check_photo = models.URLField(null=True, blank=True, help_text='Ảnh kính (checklist)')
    interior_check_photo = models.URLField(null=True, blank=True, help_text='Ảnh nội thất (checklist)')
    engine_check_photo = models.URLField(null=True, blank=True, help_text='Ảnh động cơ (checklist)')
    fuel_check_photo = models.URLField(null=True, blank=True, help_text='Ảnh mức nhiên liệu (checklist)')
    
    # ===== GIẤY TỜ TRẢ KÈM (QUAN TRỌNG) =====
    inspection_certificate_url = models.URLField(null=True, blank=True, help_text='Ảnh/Link giấy chứng nhận đăng kiểm')
    stamp_url = models.URLField(null=True, blank=True, help_text='Ảnh tem đăng kiểm đã dán')
    
    # ===== ✅✅ NEW - CHECKLIST BỔ SUNG (10/03/2026) =====
    # 2 checkbox còn thiếu theo giao diện bien-ban-tra-xe.md
    documents_complete_ok = models.BooleanField(default=False, help_text='✓ Giấy tờ xe đầy đủ (Checklist #7)')
    documents_complete_photo = models.URLField(null=True, blank=True, help_text='Ảnh giấy tờ xe đầy đủ')
    stamp_attached_ok = models.BooleanField(default=False, help_text='✓ Tem đăng kiểm đã dán (Checklist #8)')
    stamp_attached_photo = models.URLField(null=True, blank=True, help_text='Ảnh tem đăng kiểm đã dán')
    
    # ===== ✅✅ NEW - THÔNG TIN CHI TIẾT GIẤY TỜ (10/03/2026) =====
    registration_number = models.CharField(max_length=50, null=True, blank=True, help_text='Số giấy đăng ký xe')
    stamp_number = models.CharField(max_length=50, null=True, blank=True, help_text='Số tem đăng kiểm')
    stamp_expiry_date = models.DateField(null=True, blank=True, help_text='Hạn sử dụng tem đăng kiểm')
    other_documents_urls = models.TextField(null=True, blank=True, help_text='Các giấy tờ khác (JSON array)')
    receipt_url = models.URLField(null=True, blank=True, help_text='Ảnh biên lai thanh toán')
    receipt_number = models.CharField(max_length=50, null=True, blank=True, help_text='Số biên lai')
    certificate_number = models.CharField(max_length=50, null=True, blank=True, help_text='Số giấy chứng nhận kiểm định')
    certificate_expiry_date = models.DateField(null=True, blank=True, help_text='Hạn sử dụng giấy chứng nhận')
    
    # ===== GHI CHÚ =====
    additional_notes = models.TextField(null=True, blank=True, help_text='Ghi chú thêm khi trả xe')
    special_requests = models.TextField(null=True, blank=True, help_text='Yêu cầu đặc biệt từ khách')
    
    # ===== XÁC NHẬN =====
    customer_confirmed = models.BooleanField(default=False, help_text='Khách hàng đã xác nhận nhận xe')
    customer_signature = models.TextField(null=True, blank=True, help_text='Chữ ký điện tử khách (base64)')
    staff_signature = models.TextField(null=True, blank=True, help_text='Chữ ký điện tử nhân viên (base64)')
    
    # ===== ✅✅ NEW - BIÊN BẢN BÀN GIAO 9 HẠNG MỤC (10/03/2026) =====
    handover_checklist = models.JSONField(
        null=True,
        blank=True,
        default=dict,
        help_text='Bảng 9 hạng mục kiểm tra bàn giao xe: scratches(trầy xước), tires(lốp), brakes(phanh), battery(bình), carpet(thảm), inspection(đăng kiểm), insurance(bảo hiểm), smoke(khói), lights(đèn). Format: {"scratches": {"notPassed": false, "passed": true, "quantity": "0", "note": "..."}}'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'vehicle_return_logs'
        ordering = ['-created_at']

    def __str__(self):
        return f"Biên bản trả xe - {self.order.order_code}"


# ========================================
# 5C. VEHICLE RETURN ADDITIONAL COSTS (Chi phí phát sinh khi TRẢ XE)
# ========================================

class VehicleReturnAdditionalCost(models.Model):
    """
    Bảng: vehicle_return_additional_costs
    Lưu CHI TIẾT các chi phí phát sinh khi trả xe (sửa chữa, vệ sinh, phạt, ...)
    """
    # ===== ⚠️ BỎ CHOICES - CHO PHÉP NHẬP TỰ DO (10/03/2026) =====
    # COST_TYPE_CHOICES = (
    #     ('repair', 'Sửa chữa'),
    #     ('cleaning', 'Vệ sinh'),
    #     ('extra_service', 'Dịch vụ thêm'),
    #     ('penalty', 'Phạt'),
    #     ('other', 'Khác'),
    # )
    
    return_log = models.ForeignKey(VehicleReturnLog, on_delete=models.CASCADE, related_name='additional_costs')
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='return_additional_costs')
    
    # ===== THÔNG TIN CHI PHÍ =====
    cost_type = models.CharField(max_length=100, help_text='Loại chi phí (nhập tự do: damage, repair, cleaning, penalty, ...)')
    cost_name = models.CharField(max_length=200, help_text='Tên chi phí (VD: Sửa đèn hư, Vệ sinh nội thất)')
    description = models.TextField(null=True, blank=True, help_text='Mô tả chi tiết')
    amount = models.DecimalField(max_digits=10, decimal_places=2, help_text='Số tiền')
    
    # ===== MINH CHỨNG =====
    photo_url = models.URLField(null=True, blank=True, help_text='Ảnh minh chứng (trước/sau sửa chữa)')
    invoice_url = models.URLField(null=True, blank=True, help_text='Ảnh hóa đơn/biên lai')
    
    # ===== PHÂN LOẠI =====
    is_required = models.BooleanField(default=False, help_text='Chi phí bắt buộc hay tùy chọn')
    is_approved = models.BooleanField(default=False, help_text='Đã được khách hàng đồng ý chưa')
    
    # ===== GHI CHÚ =====
    notes = models.TextField(null=True, blank=True, help_text='Ghi chú thêm')
    
    # ===== NGƯỜI TẠO =====
    created_by = models.ForeignKey(Staff, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_additional_costs')
    approved_at = models.DateTimeField(null=True, blank=True, help_text='Thời điểm khách đồng ý')
    
    # ===== ✅✅ NEW - PAYMENT FIELDS (10/03/2026) =====
    payment_method = models.CharField(
        max_length=20,
        choices=[
            ('qr', 'VietQR'),
            ('cash', 'Tiền mặt'),
            ('bank_transfer', 'Chuyển khoản'),
            ('card', 'Thẻ tín dụng'),
        ],
        null=True,
        blank=True,
        help_text='Phương thức thanh toán chi phí phát sinh'
    )
    
    payment_status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Chờ thanh toán'),
            ('processing', 'Đang xử lý'),
            ('paid', 'Đã thanh toán'),
            ('failed', 'Thất bại'),
            ('cancelled', 'Đã hủy'),
        ],
        default='pending',
        help_text='Trạng thái thanh toán'
    )
    
    qr_code_url = models.URLField(null=True, blank=True, help_text='Link QR code cho khách quét (VietQR)')
    qr_content = models.TextField(null=True, blank=True, help_text='Nội dung QR code (JSON)')
    paid_at = models.DateTimeField(null=True, blank=True, help_text='Thời gian thanh toán thành công')
    payment_proof_url = models.URLField(null=True, blank=True, help_text='Ảnh chứng từ thanh toán')
    transaction_id = models.CharField(max_length=100, null=True, blank=True, help_text='Mã giao dịch từ gateway')
    payment_note = models.TextField(null=True, blank=True, help_text='Ghi chú thanh toán')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'vehicle_return_additional_costs'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.cost_name} - {self.amount:,.0f}đ"


# ========================================
# 6. CHECKLIST
# ========================================

class ChecklistItem(models.Model):
    """Bảng: checklist_items"""
    CATEGORY_CHOICES = (
        ('safety', 'An toàn'),
        ('emission', 'Khí thải'),
        ('both', 'Cả hai'),
    )
    
    item_key = models.CharField(max_length=100, unique=True)
    item_label = models.CharField(max_length=200)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    display_order = models.IntegerField(default=0)
    require_photo = models.BooleanField(default=False)
    status = models.CharField(max_length=20, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'checklist_items'
        ordering = ['display_order']

    def __str__(self):
        return self.item_label


class OrderChecklist(models.Model):
    """Bảng: order_checklist"""
    RESULT_CHOICES = (
        ('pass', 'Đạt'),
        ('fail', 'Không đạt'),
        ('not_applicable', 'Không áp dụng'),
    )
    
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='checklists')
    checklist_item = models.ForeignKey(ChecklistItem, on_delete=models.PROTECT, related_name='order_checklists')
    check_type = models.CharField(max_length=20, null=True, blank=True)  # ✅ ADDED - 'safety', 'emission', etc.
    is_checked = models.BooleanField(default=False)  # ✅ ADDED
    checked_by = models.ForeignKey(Staff, on_delete=models.SET_NULL, null=True, blank=True, related_name='checked_items')  # ✅ ADDED
    result = models.CharField(max_length=20, choices=RESULT_CHOICES, null=True, blank=True)
    measured_value = models.CharField(max_length=100, null=True, blank=True)
    photo_url = models.CharField(max_length=500, null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    checked_at = models.DateTimeField(null=True, blank=True)  # Changed from auto_now_add

    class Meta:
        db_table = 'order_checklist'

    def __str__(self):
        return f"{self.order.order_code} - {self.checklist_item.item_label}"


# ========================================
# 7. PAYMENT
# ========================================

class Payment(models.Model):
    """Bảng: payments"""
    PAYMENT_METHOD_CHOICES = (
        ('cash', 'Tiền mặt'),
        ('bank_transfer', 'Chuyển khoản'),
        ('vietqr', 'VietQR'),
        ('momo', 'Momo'),
        ('zalopay', 'ZaloPay'),
        ('vnpay', 'VNPay'),
    )
    
    STATUS_CHOICES = (
        ('pending', 'Chờ thanh toán'),
        ('paid', 'Đã thanh toán'),
        ('failed', 'Thất bại'),
        ('refunded', 'Đã hoàn tiền'),
    )
    
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment')
    transaction_code = models.CharField(max_length=100, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=30, choices=PAYMENT_METHOD_CHOICES)
    payment_type = models.CharField(max_length=20, null=True, blank=True)  # ✅ ADDED - 'full', 'partial', etc.
    transaction_id = models.CharField(max_length=100, null=True, blank=True)  # ✅ ADDED - Gateway transaction ID
    vietqr_code_url = models.CharField(max_length=500, null=True, blank=True)  # ✅ ADDED
    qr_content = models.TextField(null=True, blank=True)  # ✅ ADDED
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_proof_url = models.CharField(max_length=500, null=True, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'payments'

    def save(self, *args, **kwargs):
        if not self.transaction_code:
            self.transaction_code = f"PAY{timezone.now().strftime('%Y%m%d%H%M%S')}{uuid.uuid4().hex[:6].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.transaction_code} - {self.amount:,.0f}đ"


# ========================================
# 8. TIME SLOTS (Khung giờ làm việc)
# ========================================

class TimeSlot(models.Model):
    """
    Bảng: time_slots
    Quản lý khung giờ làm việc cho mỗi trạm đăng kiểm
    Admin có thể tạo/sửa/xóa các khung giờ
    """
    DAY_OF_WEEK_CHOICES = (
        ('all', 'Tất cả các ngày'),
        ('monday', 'Thứ Hai'),
        ('tuesday', 'Thứ Ba'),
        ('wednesday', 'Thứ Tư'),
        ('thursday', 'Thứ Năm'),
        ('friday', 'Thứ Sáu'),
        ('saturday', 'Thứ Bảy'),
        ('sunday', 'Chủ Nhật'),
    )
    
    station = models.ForeignKey(Station, on_delete=models.CASCADE, related_name='time_slots')
    time_slot = models.TimeField(help_text='Thời gian (VD: 08:00, 09:00, 10:00)')
    day_of_week = models.CharField(
        max_length=20, 
        choices=DAY_OF_WEEK_CHOICES, 
        default='all',
        help_text='Áp dụng cho ngày nào trong tuần'
    )
    max_capacity = models.IntegerField(
        default=5,
        help_text='Số lượng đơn tối đa cho khung giờ này'
    )
    is_active = models.BooleanField(
        default=True,
        help_text='Khung giờ có hoạt động không'
    )
    display_order = models.IntegerField(
        default=0,
        help_text='Thứ tự hiển thị (càng nhỏ càng lên đầu)'
    )
    notes = models.TextField(
        null=True, 
        blank=True,
        help_text='Ghi chú (VD: Giờ cao điểm, Ưu tiên khách VIP)'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'time_slots'
        ordering = ['station', 'display_order', 'time_slot']
        unique_together = [['station', 'time_slot', 'day_of_week']]  # Không trùng slot cùng ngày
        indexes = [
            models.Index(fields=['station', 'is_active']),
            models.Index(fields=['day_of_week']),
        ]

    def __str__(self):
        day_display = dict(self.DAY_OF_WEEK_CHOICES)[self.day_of_week]
        return f"{self.station.station_code} - {self.time_slot.strftime('%H:%M')} ({day_display})"
    
    def get_available_capacity(self, date):
        """
        Tính số lượng slot còn trống cho ngày cụ thể
        """
        from datetime import datetime
        
        # Đếm số đơn đã đặt cho khung giờ này trong ngày
        booked_count = Order.objects.filter(
            station=self.station,
            appointment_date=date,
            appointment_time=self.time_slot,
            status__in=['pending', 'confirmed', 'assigned', 'in_progress']
        ).count()
        
        return max(0, self.max_capacity - booked_count)
    
    def is_available(self, date):
        """
        Kiểm tra khung giờ có còn chỗ trống không
        """
        return self.is_active and self.get_available_capacity(date) > 0


# ========================================
# 8. RATING
# ========================================

class Rating(models.Model):
    """Bảng: ratings"""
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='rating')
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='given_ratings')
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE, related_name='received_ratings')
    overall_rating = models.IntegerField()  # 1-5
    service_rating = models.IntegerField(null=True, blank=True)  # 1-5
    staff_rating = models.IntegerField(null=True, blank=True)  # 1-5
    facility_rating = models.IntegerField(null=True, blank=True)  # 1-5
    comment = models.TextField(null=True, blank=True)
    pros = models.TextField(null=True, blank=True)  # ✅ ADDED - Điểm tốt
    cons = models.TextField(null=True, blank=True)  # ✅ ADDED - Điểm chưa tốt
    photos_url = models.TextField(null=True, blank=True)  # JSON array
    status = models.CharField(max_length=20, default='pending')  #  ADDED - pending, approved, rejected
    admin_response = models.TextField(null=True, blank=True)  # ✅ ADDED
    responded_by = models.ForeignKey(Staff, on_delete=models.SET_NULL, null=True, blank=True, related_name='rating_responses')  # ✅ ADDED
    responded_at = models.DateTimeField(null=True, blank=True)  # ✅ ADDED
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)  # ✅ ADDED

    class Meta:
        db_table = 'ratings'

    def __str__(self):
        return f"{self.order.order_code} - {self.overall_rating}⭐"


# ========================================
# 9. OTP VERIFICATION
# ========================================

class OTP(models.Model):
    """Bảng: otp_verification"""
    phone = models.CharField(max_length=20)
    otp_code = models.CharField(max_length=6)
    purpose = models.CharField(max_length=50)  # 'login', 'register', 'reset_password'
    is_verified = models.BooleanField(default=False)
    expires_at = models.DateTimeField()
    verified_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'otp_verification'

    def is_valid(self):
        return not self.is_verified and self.expires_at > timezone.now()

    def __str__(self):
        return f"{self.phone} - {self.otp_code}"


# ========================================
# 10. PERMISSION & AUTHORIZATION
# ========================================

class Permission(models.Model):
    """Bảng: permissions"""
    permission_code = models.CharField(max_length=100, unique=True)
    permission_name = models.CharField(max_length=150)
    module = models.CharField(max_length=50)
    description = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'permissions'

    def __str__(self):
        return self.permission_name


class RolePermission(models.Model):
    """Bảng: role_permissions"""
    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name='role_permissions')
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE, related_name='permission_roles')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'role_permissions'
        unique_together = ('role', 'permission')

    def __str__(self):
        return f"{self.role.name} - {self.permission.permission_name}"


# ========================================
# 11. NOTIFICATION
# ========================================

class Notification(models.Model):
    """Bảng: notifications"""
    recipient_type = models.CharField(max_length=20)  # 'customer', 'staff', 'all'
    recipient_user = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE, related_name='notifications_as_user')
    recipient_customer = models.ForeignKey(Customer, null=True, blank=True, on_delete=models.CASCADE, related_name='notifications')
    recipient_staff = models.ForeignKey(Staff, null=True, blank=True, on_delete=models.CASCADE, related_name='staff_notifications')
    
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=30)  # 'order_update', 'payment', 'rating', etc.
    
    # Related object
    related_object_type = models.CharField(max_length=50, null=True, blank=True)  # 'Order', 'Payment', etc.
    related_object_id = models.BigIntegerField(null=True, blank=True)
    action_url = models.CharField(max_length=500, null=True, blank=True)
    
    # Status
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    priority = models.CharField(max_length=20, default='normal')  # low, normal, high, urgent
    
    # Scheduling
    scheduled_for = models.DateTimeField(null=True, blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.recipient_type}"


# ========================================
# 12. SYSTEM SETTINGS
# ========================================

class SystemSetting(models.Model):
    """Bảng: system_settings"""
    setting_key = models.CharField(max_length=100, unique=True)
    setting_group = models.CharField(max_length=50)  # 'general', 'payment', 'notification', etc.
    setting_name = models.CharField(max_length=200)
    setting_value = models.TextField(null=True, blank=True)
    default_value = models.TextField(null=True, blank=True)
    value_type = models.CharField(max_length=20, default='string')  # string, number, boolean, json
    description = models.TextField(null=True, blank=True)
    
    # Permissions
    is_public = models.BooleanField(default=False)  # Can be accessed by public API
    is_editable = models.BooleanField(default=True)  # Can be edited
    
    # Validation
    validation_rule = models.TextField(null=True, blank=True)  # JSON validation rules
    allowed_values = models.TextField(null=True, blank=True)  # JSON array of allowed values
    
    display_order = models.IntegerField(default=0)
    updated_by = models.ForeignKey(Staff, null=True, blank=True, on_delete=models.SET_NULL, related_name='updated_settings')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'system_settings'
        ordering = ['setting_group', 'display_order']

    def __str__(self):
        return f"{self.setting_group}.{self.setting_key}"


# ========================================
# 13. CHAT MESSAGE
# ========================================

class ChatMessage(models.Model):
    """Bảng: chat_messages"""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='chat_messages')
    
    # Sender
    sender_type = models.CharField(max_length=20)  # 'customer', 'staff', 'system'
    sender_user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='sent_chats_as_user')
    sender_customer = models.ForeignKey(Customer, null=True, blank=True, on_delete=models.SET_NULL, related_name='sent_messages')
    sender_staff = models.ForeignKey(Staff, null=True, blank=True, on_delete=models.SET_NULL, related_name='sent_staff_messages')
    
    # Message content
    message_type = models.CharField(max_length=20, default='text')  # text, image, file, location
    message_text = models.TextField(null=True, blank=True)
    media_url = models.CharField(max_length=500, null=True, blank=True)
    file_name = models.CharField(max_length=255, null=True, blank=True)
    file_size = models.IntegerField(null=True, blank=True)  # in bytes
    
    # Status
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'chat_messages'
        ordering = ['created_at']

    def __str__(self):
        return f"Message on {self.order.order_code} from {self.sender_type}"


# ========================================
# 14. SIGNALS - Tự động tạo Group khi tạo Customer/Staff
# ========================================

@receiver(post_save, sender=Customer)
def add_customer_to_group(sender, instance, created, **kwargs):
    """Tự động thêm user vào group Customer"""
    if created:
        from django.contrib.auth.models import Group
        group, _ = Group.objects.get_or_create(name='Customer')
        instance.user.groups.add(group)


@receiver(post_save, sender=Staff)
def add_staff_to_group(sender, instance, created, **kwargs):
    """Tự động thêm user vào group Staff"""
    if created:
        from django.contrib.auth.models import Group
        group, _ = Group.objects.get_or_create(name='Staff')
        instance.user.groups.add(group)
        instance.user.is_staff = True
        instance.user.save()