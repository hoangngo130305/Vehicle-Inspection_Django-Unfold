from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *
import random
from datetime import timedelta
from django.utils import timezone


# ========================================
# 1. CUSTOMER SERIALIZERS
# ========================================

class CustomerSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = Customer
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at', 'total_orders', 
                           'completed_orders', 'total_spent', 'loyalty_points']


class CustomerRegisterSerializer(serializers.Serializer):
    """Đăng ký khách hàng mới qua OTP + Password"""
    phone = serializers.CharField(max_length=20)
    otp_code = serializers.CharField(max_length=6)
    full_name = serializers.CharField(max_length=200, required=False, allow_blank=True)
    email = serializers.EmailField(max_length=255, required=False, allow_blank=True)
    password = serializers.CharField(max_length=128, min_length=6, write_only=True)  # ✅ BẮT BUỘC PASSWORD
    
    def validate_phone(self, value):
        # Validate phone format (VN)
        if not value.startswith('0') or len(value) not in [10, 11]:
            raise serializers.ValidationError("Số điện thoại không hợp lệ")
        return value
    
    def validate_password(self, value):
        """Validate password strength"""
        if len(value) < 6:
            raise serializers.ValidationError("Mật khẩu phải có ít nhất 6 ký tự")
        return value
    
    def validate(self, data):
        # Verify OTP
        phone = data['phone']
        otp_code = data['otp_code']
        
        otp = OTP.objects.filter(
            phone=phone,
            otp_code=otp_code,
            purpose='register',
            is_verified=False,
            expires_at__gt=timezone.now()
        ).first()
        
        if not otp:
            raise serializers.ValidationError({"otp_code": "OTP không hợp lệ hoặc đã hết hạn"})
        
        data['otp'] = otp
        return data
    
    def create(self, validated_data):
        phone = validated_data['phone']
        full_name = validated_data.get('full_name', '')  # ✅ Optional, default ''
        email = validated_data.get('email', '')  # ✅ Optional, default ''
        password = validated_data['password']  # ✅ LẤY PASSWORD
        otp = validated_data['otp']
        
        # Kiểm tra phone đã tồn tại chưa
        existing_customer = Customer.objects.filter(phone=phone).first()
        if existing_customer:
            raise serializers.ValidationError({"phone": "Số điện thoại đã được đăng ký"})
        
        # ✅ TẠO USER VỚI PASSWORD
        username = phone  # Dùng phone làm username
        user = User.objects.create_user(
            username=username,
            password=password  # ✅ SET PASSWORD
        )
        if email:  # ✅ Chỉ set email nếu có
            user.email = email
        user.save()
        
        # Tạo Customer Profile
        customer = Customer.objects.create(
            user=user,
            full_name=full_name,  # ✅ Có thể là chuỗi rỗng
            phone=phone,
            phone_verified=True  # ✅ Đã verify qua OTP
        )
        
        # Mark OTP as verified
        otp.is_verified = True
        otp.verified_at = timezone.now()
        otp.save()
        
        return customer


class RequestOTPSerializer(serializers.Serializer):
    """Yêu cầu OTP"""
    phone = serializers.CharField(max_length=20)
    purpose = serializers.ChoiceField(choices=['register', 'login'], default='login')
    
    def validate_phone(self, value):
        if not value.startswith('0') or len(value) not in [10, 11]:
            raise serializers.ValidationError("Số điện thoại không hợp lệ")
        return value
    
    def create_otp(self):
        phone = self.validated_data['phone']
        purpose = self.validated_data['purpose']
        
        # ✅ Check if phone exists for LOGIN purpose
        if purpose == 'login':
            from .models import Customer
            customer_exists = Customer.objects.filter(phone=phone).exists()
            if not customer_exists:
                raise serializers.ValidationError({
                    'phone': 'Số điện thoại chưa được đăng ký. Vui lòng đăng ký tài khoản mới.'
                })
        
        # ✅ Check if phone already registered for REGISTER purpose
        if purpose == 'register':
            from .models import Customer
            customer_exists = Customer.objects.filter(phone=phone).exists()
            if customer_exists:
                raise serializers.ValidationError({
                    'phone': 'Số điện thoại đã được đăng ký. Vui lòng đăng nhập.'
                })
        
        # Generate 6-digit OTP
        otp_code = str(random.randint(100000, 999999))
        
        # Xóa các OTP cũ chưa verify
        OTP.objects.filter(phone=phone, purpose=purpose, is_verified=False).delete()
        
        # Tạo OTP mới
        otp = OTP.objects.create(
            phone=phone,
            otp_code=otp_code,
            purpose=purpose,
            expires_at=timezone.now() + timedelta(minutes=5)
        )
        
        # TODO: Gửi SMS thực tế
        print(f"[SMS] Gửi OTP {otp_code} đến {phone}")
        
        return otp


class VerifyOTPSerializer(serializers.Serializer):
    """Verify OTP và login"""
    phone = serializers.CharField(max_length=20)
    otp_code = serializers.CharField(max_length=6)
    
    def validate(self, data):
        phone = data['phone']
        otp_code = data['otp_code']
        
        # Verify OTP
        otp = OTP.objects.filter(
            phone=phone,
            otp_code=otp_code,
            purpose='login',
            is_verified=False,
            expires_at__gt=timezone.now()
        ).first()
        
        if not otp:
            raise serializers.ValidationError("OTP không hợp lệ hoặc đã hết hạn")
        
        # Tìm Customer
        customer = Customer.objects.filter(phone=phone).first()
        if not customer:
            raise serializers.ValidationError("Số điện thoại chưa được đăng ký")
        
        data['otp'] = otp
        data['customer'] = customer
        return data


# ========================================
# 2. STAFF SERIALIZERS
# ========================================

class StaffSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    role_name = serializers.CharField(source='role.name', read_only=True)
    
    class Meta:
        model = Staff
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at', 'tasks_total', 
                           'tasks_completed', 'rating_average']


class StaffLoginSerializer(serializers.Serializer):
    """Đăng nhập nhân viên bằng username/password"""
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        username = data['username']
        password = data['password']
        
        # Tìm User
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError("Tên đăng nhập hoặc mật khẩu không đúng")
        
        # Check password
        if not user.check_password(password):
            raise serializers.ValidationError("Tên đăng nhập hoặc mật khẩu không đúng")
        
        # Check có phải Staff không
        if not hasattr(user, 'staff_profile'):
            raise serializers.ValidationError("Tài khoản không có quyền truy cập")
        
        if user.staff_profile.status != 'active':
            raise serializers.ValidationError("Tài khoản đã bị khóa")
        
        data['user'] = user
        data['staff'] = user.staff_profile
        return data


# ========================================
# 3. OTHER SERIALIZERS
# ========================================

class VehicleTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleType
        fields = '__all__'


class VehicleSerializer(serializers.ModelSerializer):
    vehicle_type_name = serializers.CharField(source='vehicle_type.type_name', read_only=True)
    
    class Meta:
        model = Vehicle
        fields = '__all__'
        read_only_fields = ['customer', 'created_at', 'updated_at']


class StationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Station
        fields = '__all__'


class PricingSerializer(serializers.ModelSerializer):
    vehicle_type_name = serializers.CharField(source='vehicle_type.type_name', read_only=True)
    
    class Meta:
        model = Pricing
        fields = '__all__'
        read_only_fields = ['total_amount', 'created_at', 'updated_at']


# ========================================
# SERVICE SERIALIZERS
# ========================================

class ServiceSerializer(serializers.ModelSerializer):
    """Serializer cho danh mục dịch vụ đăng kiểm"""
    class Meta:
        model = Service
        fields = ['id', 'service_code', 'service_name', 'description', 
                  'category', 'base_price', 'is_required', 'status', 'display_order']
        read_only_fields = ['created_at', 'updated_at']


class OrderServiceSerializer(serializers.ModelSerializer):
    """Serializer cho dịch vụ trong đơn hàng"""
    service_code = serializers.CharField(source='service.service_code', read_only=True)
    category = serializers.CharField(source='service.category', read_only=True)
    
    class Meta:
        model = OrderService
        fields = ['id', 'service', 'service_code', 'service_name', 'category',
                  'quantity', 'unit_price', 'total_price', 'discount_amount', 'notes']
        read_only_fields = ['total_price', 'created_at', 'updated_at']


class OrderSerializer(serializers.ModelSerializer):
    # EXISTING computed fields
    customer_name = serializers.CharField(source='customer.full_name', read_only=True, default='')
    vehicle_plate = serializers.CharField(source='vehicle.license_plate', read_only=True)
    station_name = serializers.CharField(source='station.station_name', read_only=True)
    staff_name = serializers.CharField(source='assigned_staff.full_name', read_only=True)
    
    # ✅✅ NEW - Customer details (1 field)
    customer_phone = serializers.CharField(source='customer.phone', read_only=True)
    
    # ✅✅✅ NEW - Customer details for CONTRACT (5 fields) - 08/03/2026 - Cho quy trình nhận xe
    customer_date_of_birth = serializers.DateField(source='customer.date_of_birth', read_only=True)
    customer_address = serializers.CharField(source='customer.address', read_only=True)
    customer_id_number = serializers.CharField(source='customer.id_number', read_only=True)
    customer_id_issued_date = serializers.DateField(source='customer.id_issued_date', read_only=True)
    customer_id_issued_place = serializers.CharField(source='customer.id_issued_place', read_only=True)
    
    # ✅ EXISTING - Vehicle details
    vehicle_type = serializers.CharField(source='vehicle.vehicle_type.type_name', read_only=True)
    vehicle_manufacturer = serializers.CharField(source='vehicle.brand', read_only=True)
    vehicle_model = serializers.CharField(source='vehicle.model', read_only=True)
    vehicle_year = serializers.IntegerField(source='vehicle.manufacture_year', read_only=True)
    
    # ✅✅ NEW - Vehicle details (2 fields)
    vehicle_color = serializers.CharField(source='vehicle.color', read_only=True)
    vehicle_inspection_expiry = serializers.DateField(source='vehicle.inspection_expiry', read_only=True)
    
    # ✅✅ NEW - Vehicle details (2 fields - số khung, số máy) - 08/03/2026
    vehicle_chassis_number = serializers.CharField(source='vehicle.chassis_number', read_only=True)
    vehicle_engine_number = serializers.CharField(source='vehicle.engine_number', read_only=True)
    
    # ✅ EXISTING - Station details
    station_address = serializers.CharField(source='station.address', read_only=True)
    station_phone = serializers.CharField(source='station.phone', read_only=True)
    
    # ✅✅ NEW - Station details (4 fields) ⭐ QUAN TRỌNG cho Google Maps
    station_code = serializers.CharField(source='station.station_code', read_only=True)
    station_latitude = serializers.FloatField(source='station.latitude', read_only=True)
    station_longitude = serializers.FloatField(source='station.longitude', read_only=True)
    station_working_hours = serializers.CharField(source='station.working_hours', read_only=True)
    
    # ✅ EXISTING - Staff details
    staff_phone = serializers.CharField(source='assigned_staff.phone', read_only=True)
    staff_code = serializers.CharField(source='assigned_staff.employee_code', read_only=True)
    
    # ✅✅ NEW - Staff details (2 fields)
    staff_position = serializers.CharField(source='assigned_staff.position', read_only=True)
    staff_rating_average = serializers.FloatField(source='assigned_staff.rating_average', read_only=True)
    
    # ✅ EXISTING - Total amount
    total_amount = serializers.SerializerMethodField()
    
    # ✅✅✅✅ NEW - PRICING BREAKDOWN (20/03/2026) - 3 phí từ model Pricing
    pricing_inspection_fee = serializers.SerializerMethodField(help_text='Phí đăng kiểm')
    pricing_service_fee = serializers.SerializerMethodField(help_text='Phí dịch vụ')
    pricing_registration_fee = serializers.SerializerMethodField(help_text='Phí đường bộ')
    
    # ✅✅✅✅ NEW - SERVICES (17/03/2026) - Danh sách dịch vụ trong đơn hàng
    services = OrderServiceSerializer(many=True, read_only=True)
    
    # ✅✅✅ NEW - PICKUP LOCATION (3 fields) - 16/03/2026 - Cho driver tracking
    pickup_address = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    pickup_lat = serializers.DecimalField(max_digits=10, decimal_places=8, required=False, allow_null=True)
    pickup_lng = serializers.DecimalField(max_digits=11, decimal_places=8, required=False, allow_null=True)
    
    def get_total_amount(self, obj):
        total = obj.estimated_amount + obj.additional_amount
        return f"{total:.2f}"
    
    def get_pricing_inspection_fee(self, obj):
        """Lấy Phí đăng kiểm từ bảng Pricing"""
        try:
            pricing = obj.vehicle.vehicle_type.pricings.filter(
                effective_from__lte=obj.created_at,
                status='active'
            ).last()
            return str(pricing.inspection_fee) if pricing else '0.00'
        except:
            return '0.00'
    
    def get_pricing_service_fee(self, obj):
        """Lấy Phí dịch vụ từ bảng Pricing"""
        try:
            pricing = obj.vehicle.vehicle_type.pricings.filter(
                effective_from__lte=obj.created_at,
                status='active'
            ).last()
            return str(pricing.service_fee) if pricing else '0.00'
        except:
            return '0.00'
    
    def get_pricing_registration_fee(self, obj):
        """Lấy Phí đường bộ từ bảng Pricing"""
        try:
            pricing = obj.vehicle.vehicle_type.pricings.filter(
                effective_from__lte=obj.created_at,
                status='active'
            ).last()
            return str(pricing.registration_fee) if pricing else '0.00'
        except:
            return '0.00'
    
    # ✅✅ NEW - Status Name (24/03/2026) - Lấy tên trạng thái từ OrderStatus
    status_name = serializers.SerializerMethodField()
    
    def get_status_name(self, obj):
        """
        Lấy tên trạng thái từ OrderStatus model
        Trả về: 'Chờ xử lý', 'Đã xác nhận', v.v.
        """
        return obj.status_name if obj.status else 'Không xác định'
    
    customer = serializers.PrimaryKeyRelatedField(
        queryset=Customer.objects.all(),
        required=False  # ✅ KHÔNG BẮT BUỘC - sẽ tự động lấy từ token
    )
    
    class Meta:
        model = Order
        fields = [
            # IDs
            'id', 'customer', 'vehicle', 'station', 'assigned_staff',
            
            # Order info
            'order_code', 'appointment_date', 'appointment_time',
            'estimated_amount', 'additional_amount', 'total_amount',
            'status', 'status_name', 'priority', 'inspection_result',
            
            # Notes
            'customer_notes', 'staff_notes', 'cancel_reason',
            
            # Timestamps
            'started_at', 'completed_at', 'created_at', 'updated_at',
            'confirmed_at', 'cancelled_at',
            
            # ===== COMPUTED FIELDS (26 fields) =====
            
            # Customer (6 fields)
            'customer_name', 'customer_phone',
            'customer_date_of_birth', 'customer_address',
            'customer_id_number', 'customer_id_issued_date',
            'customer_id_issued_place',
            
            # Vehicle (9 fields) ← ✅ UPDATED: 7 → 9 fields (thêm chassis_number, engine_number)
            'vehicle_plate', 'vehicle_type', 'vehicle_manufacturer', 
            'vehicle_model', 'vehicle_year',
            'vehicle_color', 'vehicle_inspection_expiry',
            'vehicle_chassis_number', 'vehicle_engine_number',
            
            # Station (7 fields)
            'station_name', 'station_code', 'station_address', 'station_phone',
            'station_latitude', 'station_longitude', 'station_working_hours',
            
            # Staff (5 fields - nullable)
            'staff_name', 'staff_code', 'staff_phone',
            'staff_position', 'staff_rating_average',
            
            # ✅✅✅ NEW - Pickup location (3 fields) - 16/03/2026
            'pickup_address', 'pickup_lat', 'pickup_lng',
            
            # ✅✅✅✅ NEW - Pricing breakdown (20/03/2026)
            'pricing_inspection_fee', 'pricing_service_fee', 'pricing_registration_fee',
            
            # ✅✅✅✅ NEW - Services (17/03/2026)
            'services',
        ]
        read_only_fields = ['order_code', 'created_at', 'updated_at']


class ChecklistItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChecklistItem
        fields = '__all__'


class OrderChecklistSerializer(serializers.ModelSerializer):
    item_label = serializers.CharField(source='checklist_item.item_label', read_only=True)
    
    class Meta:
        model = OrderChecklist
        fields = '__all__'
        read_only_fields = ['checked_at']


class VehicleReceiptLogSerializer(serializers.ModelSerializer):
    """Serializer cho biên bản nhận xe"""
    order_code = serializers.CharField(source='order.order_code', read_only=True)
    staff_name = serializers.CharField(source='received_by.full_name', read_only=True)
    staff_code = serializers.CharField(source='received_by.employee_code', read_only=True)
    
    class Meta:
        model = VehicleReceiptLog
        fields = '__all__'
        read_only_fields = ['received_at', 'created_at', 'updated_at']


class VehicleReturnLogSerializer(serializers.ModelSerializer):
    """
    Serializer cho biên bản TRẢ XE
    
    UPDATED 10/03/2026: 
    - Thêm additional_costs để hiển thị chi phí phát sinh
    - Thêm customer_info để hiển thị đầy đủ thông tin khách hàng
    - Thêm staff_phone để hiển thị SĐT nhân viên
    - Thêm handover_checklist để lưu bảng 9 hạng mục
    - Thêm vehicle_info để hiển thị thông tin xe (biển số, số khung, số máy, nhãn hiệu)
    """
    order_code = serializers.CharField(source='order.order_code', read_only=True)
    staff_name = serializers.CharField(source='returned_by.full_name', read_only=True)
    staff_code = serializers.CharField(source='returned_by.employee_code', read_only=True)
    
    # ⭐ NEW: Thêm SĐT nhân viên (10/03/2026)
    staff_phone = serializers.CharField(source='returned_by.phone', read_only=True)
    
    # ⭐ NEW: Thêm thông tin khách hàng đầy đủ (10/03/2026)
    customer_info = serializers.SerializerMethodField()
    
    # ⭐ NEW: Thêm thông tin xe (10/03/2026)
    vehicle_info = serializers.SerializerMethodField()
    
    # ⭐ Existing: Include chi phí phát sinh (nested)
    additional_costs = serializers.SerializerMethodField()
    
    class Meta:
        model = VehicleReturnLog
        fields = '__all__'
        read_only_fields = ['returned_at', 'created_at', 'updated_at']
    
    def get_customer_info(self, obj):
        """
        Lấy thông tin đầy đủ của khách hàng từ Order
        Dùng cho việc hiển thị biên bản bàn giao
        """
        customer = obj.order.customer
        return {
            'id': customer.id,
            'full_name': customer.full_name,
            'phone': customer.phone,
            'date_of_birth': customer.date_of_birth.strftime('%Y-%m-%d') if customer.date_of_birth else None,
            'id_number': customer.id_number,
            'id_issued_date': customer.id_issued_date.strftime('%Y-%m-%d') if customer.id_issued_date else None,
            'id_issued_place': customer.id_issued_place,
            'address': customer.address,
            'city': customer.city,
            'district': customer.district,
            'ward': customer.ward,
        }
    
    def get_vehicle_info(self, obj):
        """
        Lấy thông tin xe đầy đủ từ Order
        Dùng cho việc hiển thị biên bản bàn giao
        
        Bao gồm:
        - Biển số (license_plate)
        - Nhãn hiệu (brand)
        - Số khung (chassis_number)
        - Số máy (engine_number)
        """
        vehicle = obj.order.vehicle
        return {
            'id': vehicle.id,
            'license_plate': vehicle.license_plate,           # Biển số
            'brand': vehicle.brand,                           # Nhãn hiệu
            'model': vehicle.model,                           # Model
            'color': vehicle.color,                           # Màu xe
            'manufacture_year': vehicle.manufacture_year,     # Năm sản xuất
            'chassis_number': vehicle.chassis_number,         # Số khung
            'engine_number': vehicle.engine_number,           # Số máy
            'vehicle_type': vehicle.vehicle_type.type_name if vehicle.vehicle_type else None,  # Loại xe (FIX: type_name not name)
        }
    
    def get_additional_costs(self, obj):
        """
        Lấy tất cả chi phí phát sinh của biên bản này
        """
        from .models import VehicleReturnAdditionalCost
        
        costs = VehicleReturnAdditionalCost.objects.filter(return_log=obj)
        
        return [{
            'id': cost.id,
            'cost_type': cost.cost_type,
            'cost_name': cost.cost_name,
            'description': cost.description,
            'amount': str(cost.amount),
            'photo_url': cost.photo_url,
            'payment_status': cost.payment_status,
            'payment_method': cost.payment_method,
            'qr_code_url': cost.qr_code_url,
            'transaction_id': cost.transaction_id,
            'paid_at': cost.paid_at.strftime('%d/%m/%Y %H:%M:%S') if cost.paid_at else None,
            'payment_note': cost.payment_note,
            'created_at': cost.created_at.strftime('%d/%m/%Y %H:%M:%S'),
        } for cost in costs]


class VehicleReturnAdditionalCostSerializer(serializers.ModelSerializer):
    """
    Serializer cho chi phí phát sinh khi TRẢ XE
    
    UPDATED 10/03/2026: order & return_log là OPTIONAL khi dùng nested route
    """
    order_code = serializers.CharField(source='order.order_code', read_only=True)
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True, allow_null=True)
    
    class Meta:
        model = VehicleReturnAdditionalCost
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
        # ⭐ order & return_log sẽ được gán tự động khi dùng nested route
        extra_kwargs = {
            'order': {'required': False},
            'return_log': {'required': False}
        }


class VehicleReceiptLogCreateSerializer(serializers.Serializer):
    """
    ✅✅ NEW - Serializer rút gọn cho quy trình nhận xe 3 bước (08/03/2026)
    Được tối ưu cho mobile app - chỉ cần các field cần thiết
    """
    # Bước 1: Thông tin khách hàng (CẬP NHẬT vào Customer)
    customer_info = serializers.DictField(required=False, help_text='Thông tin khách hàng cho hợp đồng')
    customer_signature = serializers.CharField(required=False, help_text='Chữ ký khách hàng (base64)')
    
    # Bước 2: Thanh toán
    payment_method = serializers.ChoiceField(
        choices=['qr', 'cash'], 
        required=False,
        help_text='Phương thức thanh toán'
    )
    payment_completed = serializers.BooleanField(default=False)
    
    # ===== Bước 3: BIÊN BẢN NHẬN XE =====
    
    # 1. Ảnh xe chung (6 ảnh)
    photo_front_url = serializers.URLField(required=False, allow_blank=True, help_text='Ảnh phía trước xe')
    photo_rear_url = serializers.URLField(required=False, allow_blank=True, help_text='Ảnh phía sau xe')
    photo_left_url = serializers.URLField(required=False, allow_blank=True, help_text='Ảnh bên trái xe')
    photo_right_url = serializers.URLField(required=False, allow_blank=True, help_text='Ảnh bên phải xe')
    photo_dashboard_url = serializers.URLField(required=False, allow_blank=True, help_text='Ảnh đồng hồ táp-lô')
    photo_interior_url = serializers.URLField(required=False, allow_blank=True, help_text='Ảnh nội thất xe')
    
    # 2. Checklist kiểm tra (8 checkbox)
    exterior_ok = serializers.BooleanField(required=False, help_text='✓ Ngoại thất không trầy xước')
    tires_ok = serializers.BooleanField(required=False, help_text='✓ Lốp xe còn tốt')
    lights_ok = serializers.BooleanField(required=False, help_text='✓ Đèn chiếu sáng hoạt động')
    mirrors_ok = serializers.BooleanField(required=False, help_text='✓ Gương chiếu hậu đầy đủ')
    windows_ok = serializers.BooleanField(required=False, help_text='✓ Kính chắn gió nguyên vẹn')
    interior_ok = serializers.BooleanField(required=False, help_text='✓ Nội thất sạch sẽ')
    engine_ok = serializers.BooleanField(required=False, help_text='✓ Động cơ hoạt động bình thường')
    fuel_ok = serializers.BooleanField(required=False, help_text='✓ Xác nhận mức nhiên liệu')
    
    # 3. Ảnh checklist (8 ảnh - mỗi checkbox có ảnh riêng)
    exterior_check_photo = serializers.URLField(required=False, allow_blank=True, help_text='Ảnh ngoại thất (checklist)')
    tires_check_photo = serializers.URLField(required=False, allow_blank=True, help_text='Ảnh lốp xe (checklist)')
    lights_check_photo = serializers.URLField(required=False, allow_blank=True, help_text='Ảnh đèn (checklist)')
    mirrors_check_photo = serializers.URLField(required=False, allow_blank=True, help_text='Ảnh gương (checklist)')
    windows_check_photo = serializers.URLField(required=False, allow_blank=True, help_text='Ảnh kính (checklist)')
    interior_check_photo = serializers.URLField(required=False, allow_blank=True, help_text='Ảnh nội thất (checklist)')
    engine_check_photo = serializers.URLField(required=False, allow_blank=True, help_text='Ảnh động cơ (checklist)')
    fuel_check_photo = serializers.URLField(required=False, allow_blank=True, help_text='Ảnh mức nhiên liệu (checklist)')
    
    # 4. Giấy tờ xe (2 ảnh)
    vehicle_registration_url = serializers.URLField(required=False, allow_blank=True, help_text='Ảnh giấy đăng ký xe')
    vehicle_insurance_url = serializers.URLField(required=False, allow_blank=True, help_text='Ảnh bảo hiểm xe')
    
    # 5. Ghi chú
    additional_notes = serializers.CharField(required=False, allow_blank=True, help_text='Ghi chú chung')
    
    def validate_customer_info(self, value):
        """Validate customer_info nếu có"""
        if value:
            required_keys = ['full_name', 'phone', 'address', 'id_number']
            for key in required_keys:
                if key not in value:
                    raise serializers.ValidationError(f'Thiếu trường {key} trong customer_info')
        return value


class PaymentSerializer(serializers.ModelSerializer):
    order_code = serializers.CharField(source='order.order_code', read_only=True)
    
    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ['transaction_code', 'created_at', 'updated_at']


class TimeSlotSerializer(serializers.ModelSerializer):
    """
    Serializer cho TimeSlot (Khung giờ làm việc)
    """
    station_name = serializers.CharField(source='station.station_name', read_only=True)
    station_code = serializers.CharField(source='station.station_code', read_only=True)
    day_display = serializers.SerializerMethodField()
    time_display = serializers.SerializerMethodField()
    available_capacity = serializers.SerializerMethodField()
    
    class Meta:
        model = TimeSlot
        fields = [
            'id', 'station', 'station_name', 'station_code',
            'time_slot', 'time_display',
            'day_of_week', 'day_display',
            'max_capacity', 'available_capacity',
            'is_active', 'display_order', 'notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def get_day_display(self, obj):
        """Lấy tên ngày hiển thị tiếng Việt"""
        return dict(TimeSlot.DAY_OF_WEEK_CHOICES).get(obj.day_of_week, obj.day_of_week)
    
    def get_time_display(self, obj):
        """Format thời gian HH:MM"""
        return obj.time_slot.strftime('%H:%M')
    
    def get_available_capacity(self, obj):
        """
        Tính số slot còn trống
        Nếu có 'date' trong context, tính cho ngày đó
        Nếu không, trả về max_capacity
        """
        request = self.context.get('request')
        if request and request.query_params.get('date'):
            from datetime import datetime
            try:
                date_str = request.query_params.get('date')
                date = datetime.strptime(date_str, '%Y-%m-%d').date()
                return obj.get_available_capacity(date)
            except (ValueError, TypeError):
                pass
        
        return obj.max_capacity  # Mặc định trả về max nếu không có date


class RatingSerializer(serializers.ModelSerializer):
    order_code = serializers.CharField(source='order.order_code', read_only=True)
    
    # ✅ NEW - Computed fields
    customer_name = serializers.CharField(source='customer.full_name', read_only=True, default='')
    staff_name = serializers.CharField(source='staff.full_name', read_only=True)
    vehicle_plate = serializers.CharField(source='order.vehicle.license_plate', read_only=True)
    
    class Meta:
        model = Rating
        fields = [
            # IDs & Relations
            'id', 'order', 'customer', 'staff',
            
            # Ratings
            'overall_rating', 'service_rating', 'staff_rating', 'facility_rating',
            
            # Comments
            'comment', 'pros', 'cons', 'photos_url',
            
            # Moderation
            'status', 'admin_response', 'responded_by', 'responded_at',
            
            # Timestamps
            'created_at', 'updated_at',
            
            # ✅ Computed fields
            'order_code', 'customer_name', 'staff_name', 'vehicle_plate',
        ]
        read_only_fields = ['created_at', 'updated_at']


# ========================================
# ✅✅ NEW - VEHICLE RECEIPT MULTI-STEP SERIALIZERS (09/03/2026)
# ========================================

class VehicleReceiptInitializeSerializer(serializers.Serializer):
    """
    ✅ UPDATED 18/03/2026 - API #1: Initialize - Khởi tạo biên bản nhận xe
    POST /api/orders/{id}/vehicle-receipt/initialize/
    
    Request: { customer_info + customer_signature + payment_confirmed }
    Response: { receipt_id, status: 'initialized' }
    """
    # ===== THÔNG TIN KHÁCH HÀNG (NEW) =====
    customer_info = serializers.DictField(
        required=False,
        allow_null=True,
        help_text='Thông tin khách hàng (7 fields: full_name, birth_date, id_number, id_issue_date, id_issue_place, phone, address)'
    )
    
    # ===== CHỮ KÝ KHÁCH HÀNG (NEW - BẮT BUỘC) =====
    customer_signature = serializers.CharField(
        required=True,  # BẮT BUỘC
        allow_blank=False,
        help_text='Chữ ký khách hàng (base64 hoặc data:image/png;base64,...)'
    )
    
    # ===== XÁC NHẬN THANH TOÁN (NEW) =====
    payment_confirmed = serializers.BooleanField(
        required=False,
        default=True,
        help_text='Staff xác nhận khách đã thanh toán'
    )
    
    payment_note = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
        max_length=500,
        help_text='Ghi chú về thanh toán (VD: "Đã thanh toán qua QR khi đặt lịch")'
    )


class VehicleReceiptVehicleInspectionSerializer(serializers.Serializer):
    """
    ✅ UPDATED 18/03/2026 - API #2: Vehicle Inspection - Lưu 6 ảnh xe + 2 giấy tờ
    POST /api/orders/{id}/vehicle-receipt/vehicle-inspection/
    PUT  /api/orders/{id}/vehicle-receipt/vehicle-inspection/
    
    Request: { 6 ảnh xe + 2 giấy tờ }
    """
    # 6 ảnh xe
    photo_front_url = serializers.URLField(required=False, allow_blank=True, allow_null=True, help_text='Ảnh phía trước xe')
    photo_rear_url = serializers.URLField(required=False, allow_blank=True, allow_null=True, help_text='Ảnh phía sau xe')
    photo_left_url = serializers.URLField(required=False, allow_blank=True, allow_null=True, help_text='Ảnh bên trái xe')
    photo_right_url = serializers.URLField(required=False, allow_blank=True, allow_null=True, help_text='Ảnh bên phải xe')
    photo_dashboard_url = serializers.URLField(required=False, allow_blank=True, allow_null=True, help_text='Ảnh táp-lô (đồng hồ)')
    photo_interior_url = serializers.URLField(required=False, allow_blank=True, allow_null=True, help_text='Ảnh nội thất')
    
    # ===== 2 GIẤY TỜ (NEW) =====
    vehicle_registration_url = serializers.URLField(
        required=False,
        allow_blank=True,
        allow_null=True,
        help_text='Ảnh giấy đăng ký xe'
    )
    vehicle_insurance_url = serializers.URLField(
        required=False,
        allow_blank=True,
        allow_null=True,
        help_text='Ảnh giấy bảo hiểm xe'
    )


class VehicleReceiptConditionCheckSerializer(serializers.Serializer):
    """
    ✅ UPDATED 18/03/2026 - API #3: Condition Check - Kiểm tra tình trạng xe KHI NHẬN
    POST /api/orders/{id}/vehicle-receipt-condition-check/
    
    UPDATED: 16/03/2026 - Tách riêng checklist cho NHẬN XE (8 items khác TRẢ XE)
    UPDATED: 18/03/2026 - Thêm field 'notes' cho ghi chú chung
    
    NHẬN XE - 8 hạng mục kiểm tra XE TRƯỚC KHI NHẬN:
    1. Ngoại thất không trầy xước
    2. Lốp xe còn tốt
    3. Đèn chiếu sáng hoạt động
    4. Gương chiếu hậu đầy đủ
    5. Kính chắn gió nguyên vẹn
    6. Nội thất sạch sẽ
    7. Động cơ hoạt động bình thường ← RIÊNG NHẬN XE
    8. Xác nhận mức nhiên liệu ← RIÊNG NHẬN XE
    
    Request: { 8 checkbox + 8 ảnh + notes }
    """
    # ✅✅ 8 CHECKBOX FIELDS (Boolean) - NHẬN XE
    exterior_ok = serializers.BooleanField(required=False, default=False, help_text='✓ Ngoại thất không trầy xước')
    tires_ok = serializers.BooleanField(required=False, default=False, help_text='✓ Lốp xe còn tốt')
    lights_ok = serializers.BooleanField(required=False, default=False, help_text='✓ Đèn chiếu sáng hoạt động')
    mirrors_ok = serializers.BooleanField(required=False, default=False, help_text='✓ Gương chiếu hậu đầy đủ')
    windows_ok = serializers.BooleanField(required=False, default=False, help_text='✓ Kính chắn gió nguyên vẹn')
    interior_ok = serializers.BooleanField(required=False, default=False, help_text='✓ Nội thất sạch sẽ')
    engine_ok = serializers.BooleanField(required=False, default=False, help_text='✓ Động cơ hoạt động bình thường')
    fuel_ok = serializers.BooleanField(required=False, default=False, help_text='✓ Xác nhận mức nhiên liệu')
    
    # ✅✅ 8 ẢNH MINH CHỨNG (URL) - NHẬN XE
    exterior_check_photo = serializers.URLField(required=False, allow_blank=True, allow_null=True, help_text='Ảnh minh chứng ngoại thất')
    tires_check_photo = serializers.URLField(required=False, allow_blank=True, allow_null=True, help_text='Ảnh minh chứng lốp xe')
    lights_check_photo = serializers.URLField(required=False, allow_blank=True, allow_null=True, help_text='Ảnh minh chứng đèn')
    mirrors_check_photo = serializers.URLField(required=False, allow_blank=True, allow_null=True, help_text='Ảnh minh chứng gương')
    windows_check_photo = serializers.URLField(required=False, allow_blank=True, allow_null=True, help_text='Ảnh minh chứng kính')
    interior_check_photo = serializers.URLField(required=False, allow_blank=True, allow_null=True, help_text='Ảnh minh chứng nội thất')
    engine_check_photo = serializers.URLField(required=False, allow_blank=True, allow_null=True, help_text='Ảnh minh chứng động cơ')
    fuel_check_photo = serializers.URLField(required=False, allow_blank=True, allow_null=True, help_text='Ảnh minh chứng nhiên liệu')
    
    # ===== GHI CHÚ CHUNG (NEW) =====
    additional_notes = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
        max_length=2000,
        help_text='Ghi chú chung về tình trạng xe (tùy chọn)'
    )


# ========================================
# 8A. VEHICLE RETURN CONDITION CHECK SERIALIZER (TRẢ XE) - NEW 16/03/2026
# ========================================

class VehicleReturnConditionCheckSerializer(serializers.Serializer):
    """
    ✅ API #3: Condition Check - Kiểm tra tình trạng xe KHI TRẢ
    POST /api/orders/{id}/vehicle-return-condition-check/
    
    CREATED: 16/03/2026 - Tách riêng checklist cho TRẢ XE (8 items khác NHẬN XE)
    
    TRẢ XE - 8 hạng mục kiểm tra SAU KHI ĐĂNG KIỂM XONG:
    1. Ngoại thất không trầy xước
    2. Lốp xe đầy đủ, không rò
    3. Hệ thống đèn hoạt động tốt
    4. Gương chiếu hậu nguyên vẹn
    5. Kính chắn gió không vỡ/nứt
    6. Nội thất sạch sẽ
    7. Giấy tờ xe đầy đủ ← RIÊNG TRẢ XE
    8. Tem đăng kiểm đã dán ← RIÊNG TRẢ XE
    
    Request: { 8 checkbox + 8 ảnh }
    """
    # ✅✅ 8 CHECKBOX FIELDS (Boolean) - TRẢ XE
    exterior_ok = serializers.BooleanField(required=False, default=False, help_text='✓ Ngoại thất không trầy xước')
    tires_ok = serializers.BooleanField(required=False, default=False, help_text='✓ Lốp xe đầy đủ, không rò')
    lights_ok = serializers.BooleanField(required=False, default=False, help_text='✓ Hệ thống đèn hoạt động tốt')
    mirrors_ok = serializers.BooleanField(required=False, default=False, help_text='✓ Gương chiếu hậu nguyên vẹn')
    windows_ok = serializers.BooleanField(required=False, default=False, help_text='✓ Kính chắn gió không vỡ/nứt')
    interior_ok = serializers.BooleanField(required=False, default=False, help_text='✓ Nội thất sạch sẽ')
    documents_complete_ok = serializers.BooleanField(required=False, default=False, help_text='✓ Giấy tờ xe đầy đủ')
    stamp_attached_ok = serializers.BooleanField(required=False, default=False, help_text='✓ Tem đăng kiểm đã dán')
    
    # ✅✅ 8 ẢNH MINH CHỨNG (URL) - TRẢ XE
    exterior_check_photo = serializers.URLField(required=False, allow_blank=True, allow_null=True, help_text='Ảnh minh chứng ngoại thất')
    tires_check_photo = serializers.URLField(required=False, allow_blank=True, allow_null=True, help_text='Ảnh minh chứng lốp xe')
    lights_check_photo = serializers.URLField(required=False, allow_blank=True, allow_null=True, help_text='Ảnh minh chứng đèn')
    mirrors_check_photo = serializers.URLField(required=False, allow_blank=True, allow_null=True, help_text='Ảnh minh chứng gương')
    windows_check_photo = serializers.URLField(required=False, allow_blank=True, allow_null=True, help_text='Ảnh minh chứng kính')
    interior_check_photo = serializers.URLField(required=False, allow_blank=True, allow_null=True, help_text='Ảnh minh chứng nội thất')
    documents_complete_photo = serializers.URLField(required=False, allow_blank=True, allow_null=True, help_text='Ảnh giấy tờ xe đầy đủ')
    stamp_attached_photo = serializers.URLField(required=False, allow_blank=True, allow_null=True, help_text='Ảnh tem đăng kiểm đã dán')


# ========================================
# 8A.5. VEHICLE RETURN UPDATE INSPECTION EXPIRY SERIALIZER (TRẢ XE) - NEW 18/03/2026
# ========================================

class VehicleReturnUpdateInspectionExpirySerializer(serializers.Serializer):
    """
    ✨ NEW 18/03/2026 - API 6.8: Update Inspection Expiry - Cập nhật ngày hết hạn đăng kiểm
    POST /api/orders/{id}/vehicle-return-update-inspection-expiry/
    
    Request: { inspection_expiry_date }
    
    API này được gọi TRƯỚC API Finalize trong quy trình TRẢ XE Step 5
    """
    inspection_expiry_date = serializers.DateField(
        required=True,
        help_text='Ngày hết hạn đăng kiểm mới (YYYY-MM-DD)',
        error_messages={
            'required': 'Ngày hết hạn đăng kiểm là bắt buộc',
            'invalid': 'Định dạng ngày không hợp lệ (phải là YYYY-MM-DD)',
        }
    )
    
    def validate_inspection_expiry_date(self, value):
        """Validate ngày hết hạn phải trong tương lai"""
        from datetime import date, timedelta
        
        today = date.today()
        max_date = today + timedelta(days=730)  # Tối đa 2 năm
        
        if value < today:
            raise serializers.ValidationError(
                "Ngày hết hạn đăng kiểm không thể trong quá khứ"
            )
        
        if value > max_date:
            raise serializers.ValidationError(
                "Ngày hết hạn đăng kiểm không thể quá 2 năm kể từ hôm nay"
            )
        
        return value


# ========================================
# 8B. VEHICLE RECEIPT FINALIZE SERIALIZER (NHẬN XE) - NEW 16/03/2026
# ========================================

class VehicleReceiptFinalizeSerializer(serializers.Serializer):
    """
    ✅ UPDATED 18/03/2026 - API #4: Finalize - Hoàn tất biên bản NHẬN XE
    POST /api/orders/{id}/vehicle-receipt-finalize/
    
    CREATED: 16/03/2026 - Tách riêng serializer cho NHẬN XE (khác với TRẢ XE)
    UPDATED: 18/03/2026 - Chỉ cần staff_signature (customer_signature đã có ở API 1, giấy tờ đã có ở API 2)
    
    Request: { staff_signature }
    """
    # ===== CHỮ KÝ NHÂN VIÊN (BẮT BUỘC) =====
    staff_signature = serializers.CharField(
        required=True,  # BẮT BUỘC
        allow_blank=False,
        help_text='Chữ ký nhân viên (base64 hoặc data:image/png;base64,...)'
    )
    
    # ❌ BỎ TẤT CẢ FIELDS KHÁC:
    # - vehicle_registration_url (đã có ở API 2)
    # - vehicle_insurance_url (đã có ở API 2)
    # - customer_signature (đã có ở API 1)
    # - additional_notes (có thể thêm vào API 3 nếu cần)


# ========================================
# 8C. VEHICLE RETURN FINALIZE SERIALIZER (TRẢ XE) - RENAMED 16/03/2026
# ========================================

class VehicleReturnFinalizeSerializer(serializers.Serializer):
    """
    ✅ API #4: Finalize - Hoàn tất biên bản TRẢ XE
    POST /api/orders/{id}/vehicle-return-finalize/
    
    UPDATED: 10/03/2026 - Thêm đầy đủ 11 fields giấy tờ kiểm định
    RENAMED: 16/03/2026 - Đổi từ VehicleReceiptFinalizeSerializer thành VehicleReturnFinalizeSerializer
    
    Request: { 11 giấy tờ + ghi chú + chữ ký }
    """
    # === NHÓM A: GIẤY ĐĂNG KÝ XE ===
    vehicle_registration_url = serializers.URLField(
        required=True,  # BẮT BUỘC
        allow_blank=False,
        help_text='Ảnh giấy đăng ký xe (BẮT BUỘC)'
    )
    registration_number = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
        max_length=50,
        help_text='Số giấy đăng ký xe'
    )
    
    # === NHÓM B: TEM ĐĂNG KIỂM ===
    stamp_url = serializers.URLField(
        required=True,  # BẮT BUỘC
        allow_blank=False,
        help_text='Ảnh tem đăng kiểm đã dán (BẮT BUỘC)'
    )
    stamp_number = serializers.CharField(
        required=True,  # BẮT BUỘC
        allow_blank=False,
        max_length=50,
        help_text='Số tem đăng kiểm (BẮT BUỘC)'
    )
    stamp_expiry_date = serializers.DateField(
        required=True,  # BẮT BUỘC
        help_text='Hạn sử dụng tem (YYYY-MM-DD) (BẮT BUỘC)'
    )
    
    # === NHÓM C: CÁC GIẤY TỜ KHÁC ===
    other_documents_urls = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
        help_text='Array URLs các giấy tờ khác (JSON string format: ["url1.jpg", "url2.pdf"])'
    )
    
    # === NHÓM D: BIÊN LAI ===
    receipt_url = serializers.URLField(
        required=False,
        allow_blank=True,
        allow_null=True,
        help_text='Ảnh biên lai'
    )
    receipt_number = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
        max_length=50,
        help_text='Số biên lai'
    )
    
    # === NHÓM E: GIẤY CHỨNG NHẬT KIỂM ĐỊNH ===
    inspection_certificate_url = serializers.URLField(
        required=True,  # BẮT BUỘC
        allow_blank=False,
        help_text='Ảnh giấy chứng nhận đăng kiểm (BẮT BUỘC)'
    )
    certificate_number = serializers.CharField(
        required=True,  # BẮT BUỘC
        allow_blank=False,
        max_length=50,
        help_text='Số giấy chứng nhận (BẮT BUỘC)'
    )
    certificate_expiry_date = serializers.DateField(
        required=True,  # BẮT BUỘC
        help_text='Hạn sử dụng giấy chứng nhận (YYYY-MM-DD) (BẮT BUỘC)'
    )
    
    # === NHÓM F: GHI CHÚ ===
    additional_notes = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
        max_length=2000,
        help_text='Ghi chú thêm'
    )
    
    # === NHÓM G: CHỮ KÝ KHÁCH HÀNG ===
    customer_signature = serializers.CharField(
        required=True,  # BẮT BUỘC
        allow_blank=False,
        help_text='Chữ ký khách hàng (base64 hoặc data:image/png;base64,...) (BẮT BUỘC)'
    )
    
    # REMOVED: vehicle_insurance_url (không dùng nữa)
    # REMOVED: customer_info, payment_method, payment_completed (đã tách riêng APIs)
    # REMOVED: staff_signature (không có trong giao diện)
    
    def validate_other_documents_urls(self, value):
        """Validate JSON array string format"""
        if value:
            import json
            try:
                urls = json.loads(value)
                if not isinstance(urls, list):
                    raise serializers.ValidationError("other_documents_urls phải là JSON array string")
                # Validate each URL
                for url in urls:
                    if not isinstance(url, str) or not url.startswith('http'):
                        raise serializers.ValidationError(f"URL không hợp lệ: {url}")
            except json.JSONDecodeError:
                raise serializers.ValidationError("other_documents_urls phải là JSON string hợp lệ. VD: '[\\\"url1.jpg\\\", \\\"url2.pdf\\\"]'")
        return value


# ========================================
# 10. DRIVER LOCATION TRACKING SERIALIZERS (13/03/2026)
# ========================================

class UpdateDriverLocationSerializer(serializers.Serializer):
    """
    Serializer cho API cập nhật vị trí tài xế (real-time tracking)
    POST /api/staff/orders/{order_id}/update-driver-location/
    """
    latitude = serializers.DecimalField(
        max_digits=10,
        decimal_places=8,
        required=True,
        help_text='Vĩ độ (-90 đến 90)',
        error_messages={
            'required': 'Vĩ độ (latitude) là bắt buộc',
            'invalid': 'Vĩ độ không hợp lệ',
        }
    )
    longitude = serializers.DecimalField(
        max_digits=11,
        decimal_places=8,
        required=True,
        help_text='Kinh độ (-180 đến 180)',
        error_messages={
            'required': 'Kinh độ (longitude) là bắt buộc',
            'invalid': 'Kinh độ không hợp lệ',
        }
    )
    accuracy = serializers.FloatField(
        required=False,
        allow_null=True,
        help_text='Độ chính xác GPS (meters)',
    )
    
    def validate_latitude(self, value):
        """Validate latitude range"""
        if not (-90 <= float(value) <= 90):
            raise serializers.ValidationError("Vĩ độ phải trong khoảng -90 đến 90")
        
        # Check không phải (0,0) - thường là lỗi GPS
        if float(value) == 0:
            raise serializers.ValidationError("Tọa độ không hợp lệ (latitude = 0)")
        
        return value
    
    def validate_longitude(self, value):
        """Validate longitude range"""
        if not (-180 <= float(value) <= 180):
            raise serializers.ValidationError("Kinh độ phải trong khoảng -180 đến 180")
        
        # Check không phải (0,0)
        if float(value) == 0:
            raise serializers.ValidationError("Tọa độ không hợp lệ (longitude = 0)")
        
        return value
    
    def validate(self, data):
        """Cross-field validation - Kiểm tra tọa độ trong Việt Nam"""
        lat = float(data['latitude'])
        lng = float(data['longitude'])
        
        # Kiểm tra trong phạm vi Việt Nam (optional - có thể bật nếu cần strict)
        # Việt Nam: lat 8-24, lng 102-110
        # if not (8 <= lat <= 24 and 102 <= lng <= 110):
        #     raise serializers.ValidationError("Vị trí ngoài phạm vi Việt Nam")
        
        # Kiểm tra accuracy (nếu có) - cảnh báo nếu độ chính xác kém
        accuracy = data.get('accuracy')
        if accuracy and accuracy > 100:
            # Không raise error, chỉ cảnh báo trong response
            data['_accuracy_warning'] = f"Tín hiệu GPS yếu (độ chính xác: {accuracy}m)"
        
        return data


class DriverLocationResponseSerializer(serializers.Serializer):
    """
    Serializer cho response GET driver location
    GET /api/customers/orders/{order_id}/driver-location/
    """
    order_code = serializers.CharField()
    driver = serializers.DictField(required=False, allow_null=True)
    driver_location = serializers.DictField(required=False, allow_null=True)
    pickup_location = serializers.DictField(required=False, allow_null=True)
    station_location = serializers.DictField(required=False, allow_null=True)
    tracking_info = serializers.DictField(required=False, allow_null=True)
    message = serializers.CharField(required=False, allow_null=True)