from rest_framework import viewsets, status, filters
from rest_framework.decorators import api_view, action, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import ValidationError, PermissionDenied
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth import login, logout
from django.contrib.auth.models import User
from django.utils import timezone
from .models import *
from .serializers import *


# ========================================
# UNIFIED LOGIN - API ĐĂNG NHẬP THỐNG NHẤT
# ========================================

@api_view(['POST'])
@permission_classes([AllowAny])
def unified_login(request):
    """
    API đăng nhập thống nhất cho Customer, Staff và Admin
    POST /api/login/
    
    CUSTOMER (Phone + Password):
    Body: {"phone": "0912345678", "password": "password123"}
    
    CUSTOMER (Phone + OTP):
    Body: {"phone": "0912345678", "otp_code": "123456"}
    
    CUSTOMER (Social Login):
    Body: {"provider": "google", "token": "google_access_token"}
    Body: {"provider": "facebook", "token": "facebook_access_token"}
    Body: {"provider": "apple", "token": "apple_id_token"}
    
    STAFF (Phone + Password):
    Body: {"phone": "0912345678", "password": "password123"}
    
    ADMIN (Username + Password):
    Body: {"username": "admin", "password": "admin123"}
    
    Response:
    {
        "success": true,
        "message": "Đăng nhập thành công",
        "token": "abc123...",
        "user_type": "customer" | "staff" | "admin",
        "user_data": {...}
    }
    """
    
    phone = request.data.get('phone')
    password = request.data.get('password')
    username = request.data.get('username')
    otp_code = request.data.get('otp_code')
    provider = request.data.get('provider')  # google, facebook, apple
    social_token = request.data.get('token')
    
    # ========================================
    # 1. ADMIN LOGIN (Username + Password)
    # ========================================
    if username and password:
        return handle_admin_login(request, username, password)
    
    # ========================================
    # 2. SOCIAL LOGIN (Customer only)
    # ========================================
    elif provider and social_token:
        return handle_social_login(request, provider, social_token)
    
    # ========================================
    # 3. PHONE + PASSWORD (Customer or Staff)
    # ========================================
    elif phone and password:
        return handle_phone_password_login(request, phone, password)
    
    # ========================================
    # 4. PHONE + OTP (Customer only)
    # ========================================
    elif phone and otp_code:
        return handle_otp_login(request, phone, otp_code)
    
    # ========================================
    # Invalid request
    # ========================================
    else:
        return Response({
            'non_field_errors': ['Vui lòng nhập đầy đủ thông tin đăng nhập']
        }, status=status.HTTP_400_BAD_REQUEST)


# ========================================
# HELPER FUNCTIONS
# ========================================

def handle_admin_login(request, username, password):
    """
    Xử lý đăng nhập Admin
    """
    try:
        user = User.objects.get(username=username)
        
        # Verify password
        if not user.check_password(password):
            return Response({
                'non_field_errors': ['Tên đăng nhập hoặc mật khẩu không đúng']
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Kiểm tra quyền admin
        if not user.is_superuser and not user.is_staff:
            return Response({
                'non_field_errors': ['Bạn không có quyền truy cập Admin']
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Login
        login(request, user, backend='django.contrib.auth.backends.ModelBackend')
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'success': True,
            'message': 'Đăng nhập Admin thành công',
            'token': token.key,
            'user_type': 'admin',
            'redirect_url': 'http://127.0.0.1:8000/admin/',  # ✅ ADDED: Admin redirect URL
            'user_data': {
                'id': user.id,
                'username': user.username,
                'email': user.email or '',
                'is_superuser': user.is_superuser,
                'is_staff': user.is_staff
            }
        }, status=status.HTTP_200_OK)
        
    except User.DoesNotExist:
        return Response({
            'non_field_errors': ['Tên đăng nhập hoặc mật khẩu không đúng']
        }, status=status.HTTP_400_BAD_REQUEST)


def handle_phone_password_login(request, phone, password):
    """
    Xử lý đăng nhập bằng SĐT + Password
    Tự động phát hiện Customer hoặc Staff
    """
    # Tìm Customer
    try:
        customer = Customer.objects.get(phone=phone)
        user = customer.user
        
        # Verify password
        if not user.check_password(password):
            return Response({
                'non_field_errors': ['Số điện thoại hoặc mật khẩu không đúng']
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Login
        login(request, user, backend='django.contrib.auth.backends.ModelBackend')
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'success': True,
            'message': 'Đăng nhập thành công',
            'token': token.key,
            'user_type': 'customer',
            'user_data': CustomerSerializer(customer).data
        }, status=status.HTTP_200_OK)
        
    except Customer.DoesNotExist:
        pass
    
    # Tìm Staff
    try:
        staff = Staff.objects.get(phone=phone)
        user = staff.user
        
        # Verify password
        if not user.check_password(password):
            return Response({
                'non_field_errors': ['Số điện thoại hoặc mật khẩu không đúng']
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Login
        login(request, user, backend='django.contrib.auth.backends.ModelBackend')
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'success': True,
            'message': 'Đăng nhập thành công',
            'token': token.key,
            'user_type': 'staff',
            'user_data': StaffSerializer(staff).data
        }, status=status.HTTP_200_OK)
        
    except Staff.DoesNotExist:
        pass
    
    # Không tìm thấy
    return Response({
        'non_field_errors': ['Số điện thoại hoặc mật khẩu không đúng']
    }, status=status.HTTP_400_BAD_REQUEST)


def handle_otp_login(request, phone, otp_code):
    """
    Xử lý đăng nhập bằng OTP (chỉ dành cho Customer)
    """
    serializer = VerifyOTPSerializer(data={'phone': phone, 'otp_code': otp_code})
    if serializer.is_valid():
        customer = serializer.validated_data['customer']
        otp = serializer.validated_data['otp']
        
        # Mark OTP as verified
        otp.is_verified = True
        otp.verified_at = timezone.now()
        otp.save()
        
        # Login
        user = customer.user
        login(request, user, backend='django.contrib.auth.backends.ModelBackend')
        
        # Create/get token
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'success': True,
            'message': 'Đăng nhập thành công',
            'token': token.key,
            'user_type': 'customer',
            'user_data': CustomerSerializer(customer).data
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def handle_social_login(request, provider, social_token):
    """
    Xử lý đăng nhập Social (Google, Facebook, Apple)
    Chỉ dành cho Customer
    """
    # Validate provider
    if provider not in ['google', 'facebook', 'apple']:
        return Response({
            'non_field_errors': ['Provider không hợp lệ']
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # TODO: Verify social token with provider API
    # For now, we'll implement a basic version
    # In production, you need to verify token with Google/Facebook/Apple API
    
    try:
        # Get user info from social provider
        social_user_info = verify_social_token(provider, social_token)
        
        if not social_user_info:
            return Response({
                'non_field_errors': ['Token không hợp lệ hoặc đã hết hạn']
            }, status=status.HTTP_400_BAD_REQUEST)
        
        social_id = social_user_info['id']
        email = social_user_info.get('email')
        name = social_user_info.get('name', '')
        avatar = social_user_info.get('avatar')
        
        # Find or create customer by social ID
        customer = None
        user = None
        
        if provider == 'google':
            customer = Customer.objects.filter(google_id=social_id).first()
        elif provider == 'facebook':
            customer = Customer.objects.filter(facebook_id=social_id).first()
        elif provider == 'apple':
            customer = Customer.objects.filter(apple_id=social_id).first()
        
        # Customer exists - login
        if customer:
            user = customer.user
        
        # Create new customer
        else:
            # Create User
            username = f"{provider}_{social_id}"
            user = User.objects.create_user(
                username=username,
                email=email or f"{username}@social.login",
                password=None  # No password for social login
            )
            
            # Create Customer
            customer = Customer.objects.create(
                user=user,
                full_name=name,
                phone='',  # Will be updated later if needed
                avatar_url=avatar,
                phone_verified=False,
                email_verified=True if email else False
            )
            
            # Set social ID
            if provider == 'google':
                customer.google_id = social_id
            elif provider == 'facebook':
                customer.facebook_id = social_id
            elif provider == 'apple':
                customer.apple_id = social_id
            customer.save()
        
        # Login
        login(request, user, backend='django.contrib.auth.backends.ModelBackend')
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'success': True,
            'message': 'Đăng nhập thành công',
            'token': token.key,
            'user_type': 'customer',
            'user_data': CustomerSerializer(customer).data,
            'is_new_user': not customer.phone  # Cần cập nhật SĐT
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'non_field_errors': [f'Đăng nhập social thất bại: {str(e)}']
        }, status=status.HTTP_400_BAD_REQUEST)


def verify_social_token(provider, token):
    """
    Verify social token with provider API
    Returns user info or None
    
    TODO: Implement real verification in production
    """
    # DEVELOPMENT ONLY - Skip verification
    # In production, you must verify token with:
    # - Google: https://www.googleapis.com/oauth2/v3/tokeninfo?access_token={token}
    # - Facebook: https://graph.facebook.com/me?access_token={token}
    # - Apple: Verify JWT token
    
    # For development, return mock data
    if token == 'DEVELOPMENT_TOKEN':
        return {
            'id': f'dev_{provider}_123456',
            'email': f'user@{provider}.com',
            'name': f'Test User ({provider})',
            'avatar': None
        }
    
    # In production, implement real verification here
    return None


# ========================================
# OTP MANAGEMENT
# ========================================

@api_view(['POST'])
@permission_classes([AllowAny])
def customer_request_otp(request):
    """
    Yêu cầu OTP để đăng nhập
    POST /api/auth/request-otp/
    Body: {"phone": "0912345678", "purpose": "register" | "login"}
    """
    serializer = RequestOTPSerializer(data=request.data)
    if serializer.is_valid():
        otp = serializer.create_otp()
        return Response({
            'success': True,
            'message': f'OTP đã được gửi đến {otp.phone}',
            'expires_at': otp.expires_at,
            'debug_otp': otp.otp_code  # TODO: Xóa trong production
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    """
    Verify OTP without consuming it.
    Kiểm tra OTP có hợp lệ không (KHÔNG mark as verified).
    
    POST /api/auth/verify-otp/
    
    Request Body:
        - phone (str): Số điện thoại
        - otp_code (str): Mã OTP 6 số
        - purpose (str): 'register' hoặc 'login'
    
    Response:
        - success (bool): True/False
        - valid (bool): OTP có hợp lệ không
        - message (str): Thông báo
        - error_code (str): Mã lỗi (nếu có)
    """
    
    # 1. Get data from request
    phone = request.data.get('phone', '').strip()
    otp_code = request.data.get('otp_code', '').strip()
    purpose = request.data.get('purpose', 'register').strip()
    
    # 2. Validate required fields
    if not phone:
        return Response({
            'success': False,
            'valid': False,
            'message': 'Số điện thoại là bắt buộc',
            'error_code': 'MISSING_PHONE'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if not otp_code:
        return Response({
            'success': False,
            'valid': False,
            'message': 'Mã OTP là bắt buộc',
            'error_code': 'MISSING_OTP'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # 3. Validate purpose
    if purpose not in ['register', 'login']:
        return Response({
            'success': False,
            'valid': False,
            'message': "Purpose phải là 'register' hoặc 'login'",
            'error_code': 'INVALID_PURPOSE'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # 4. Find OTP record
    try:
        otp = OTP.objects.filter(
            phone=phone,
            purpose=purpose,
            is_verified=False  # Chưa được sử dụng
        ).order_by('-created_at').first()
        
        # 5. Check OTP exists
        if not otp:
            return Response({
                'success': False,
                'valid': False,
                'message': 'Không tìm thấy OTP. Vui lòng yêu cầu mã mới',
                'error_code': 'NOT_FOUND'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # 6. Check OTP code
        if otp.otp_code != otp_code:
            return Response({
                'success': False,
                'valid': False,
                'message': 'Mã OTP không chính xác',
                'error_code': 'WRONG_CODE'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # 7. Check expiry (5 minutes)
        if timezone.now() > otp.expires_at:
            return Response({
                'success': False,
                'valid': False,
                'message': 'OTP đã hết hạn. Vui lòng yêu cầu mã mới',
                'error_code': 'EXPIRED'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # 8. OTP is valid
        # IMPORTANT: KHÔNG mark as verified ở đây
        # Để API /api/register/ hoặc /api/login/ mark sau
        return Response({
            'success': True,
            'valid': True,
            'message': 'OTP hợp lệ'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        # Log error (optional)
        print(f"Error verifying OTP: {str(e)}")
        
        return Response({
            'success': False,
            'valid': False,
            'message': 'Lỗi hệ thống. Vui lòng thử lại',
            'error_code': 'SYSTEM_ERROR'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ========================================
# CUSTOMER REGISTRATION
# ========================================

@api_view(['POST'])
@permission_classes([AllowAny])
def customer_register(request):
    """
    Đăng ký tài khoản Customer mới QUA OTP
    POST /api/register/
    
    ✅ FLOW ĐĂNG KÝ:
    1. Gửi OTP: POST /api/auth/request-otp/ {"phone": "0912345678", "purpose": "register"}
    2. Đăng ký: POST /api/register/ {"phone": "0912345678", "otp_code": "123456", "full_name": "Nguyễn Văn A", "password": "password123"}
    
    Body: {
        "phone": "0912345678",
        "otp_code": "123456",           # ✅ YÊU CẦU OTP
        "full_name": "Nguyễn Văn A",    # ✅ YÊU CẦU HỌ TÊN
        "password": "password123"        # ✅ YÊU CẦU MẬT KHẨU (min 6 ký tự)
    }
    
    Response:
    {
        "success": true,
        "message": "Đăng ký thành công",
        "token": "abc123...",
        "user_type": "customer",
        "user_data": {...}
    }
    """
    serializer = CustomerRegisterSerializer(data=request.data)
    if serializer.is_valid():
        customer = serializer.save()
        
        # Auto login
        user = customer.user
        login(request, user, backend='django.contrib.auth.backends.ModelBackend')
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'success': True,
            'message': 'Đăng ký thành công',
            'token': token.key,
            'user_type': 'customer',
            'user_data': CustomerSerializer(customer).data
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ========================================
# AUTHENTICATION UTILITIES
# ========================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_logout(request):
    """
    Đăng xuất (cho cả Customer và Staff)
    POST /api/auth/logout/
    Headers: Authorization: Token abc123...
    """
    # Xóa token
    try:
        request.user.auth_token.delete()
    except:
        pass
    
    # Logout session
    logout(request)
    
    return Response({
        'success': True,
        'message': 'Đăng xuất thành công'
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    """
    Lấy thông tin user hiện tại
    GET /api/auth/me/
    Headers: Authorization: Token abc123...
    """
    user = request.user
    
    # Xác định user type
    if user.is_superuser:
        user_type = 'admin'
        profile_data = {
            'username': user.username,
            'email': user.email,
            'is_superuser': True
        }
    elif hasattr(user, 'staff_profile'):
        user_type = 'staff'
        profile_data = StaffSerializer(user.staff_profile).data
    elif hasattr(user, 'customer_profile'):
        user_type = 'customer'
        profile_data = CustomerSerializer(user.customer_profile).data
    else:
        user_type = 'unknown'
        profile_data = {}
    
    return Response({
        'user_type': user_type,
        'profile': profile_data
    })


# ========================================
# CUSTOMER VIEWSET
# ========================================

class CustomerViewSet(viewsets.ModelViewSet):
    """
    ViewSet cho Customer
    GET /api/customers/          - List customers
    GET /api/customers/{id}/     - Get customer detail
    PUT /api/customers/{id}/     - Update customer
    """
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        # Admin: xem tất cả
        if user.is_superuser or user.is_staff:
            return Customer.objects.all()
        
        # Customer: chỉ xem chính mình
        if hasattr(user, 'customer_profile'):
            return Customer.objects.filter(id=user.customer_profile.id)
        
        return Customer.objects.none()
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """GET /api/customers/me/ - Lấy thông tin customer hiện tại"""
        if not hasattr(request.user, 'customer_profile'):
            return Response({'error': 'Không phải customer'}, status=403)
        
        serializer = self.get_serializer(request.user.customer_profile)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put'])
    def update_profile(self, request):
        """PUT /api/customers/update-profile/ - Cập nhật thông tin"""
        if not hasattr(request.user, 'customer_profile'):
            return Response({'error': 'Không phải customer'}, status=403)
        
        customer = request.user.customer_profile
        serializer = self.get_serializer(customer, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


# ========================================
# STAFF VIEWSET
# ========================================

class StaffViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet cho Staff (Read-only cho API)
    Tạo/sửa Staff qua Django Admin
    """
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """GET /api/staff/me/ - Lấy thông tin staff hiện tại"""
        if not hasattr(request.user, 'staff_profile'):
            return Response({'error': 'Không phải staff'}, status=403)
        
        serializer = self.get_serializer(request.user.staff_profile)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_schedule(self, request):
        """
        GET /api/staff/my-schedule/
        Staff xem lịch làm việc theo ngày/tuần/tháng
        
        Query params:
        - view: day | week | month (default: day)
        - date: YYYY-MM-DD (default: hôm nay)
        
        Examples:
        - GET /api/staff/my-schedule/?view=day&date=2026-03-10
        - GET /api/staff/my-schedule/?view=week&date=2026-03-10
        - GET /api/staff/my-schedule/?view=month&date=2026-03-01
        """
        if not hasattr(request.user, 'staff_profile'):
            return Response({
                'error': 'Chỉ Staff mới có quyền xem lịch'
            }, status=403)
        
        from datetime import datetime, timedelta
        
        staff = request.user.staff_profile
        view_type = request.query_params.get('view', 'day')  # day, week, month
        date_str = request.query_params.get('date', None)
        
        # Parse date
        if date_str:
            try:
                target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            except ValueError:
                return Response({
                    'error': 'Định dạng ngày không hợp lệ. Sử dụng YYYY-MM-DD'
                }, status=400)
        else:
            target_date = timezone.now().date()
        
        # Calculate date range based on view type
        if view_type == 'day':
            date_from = target_date
            date_to = target_date
        elif view_type == 'week':
            # Tuần bắt đầu từ Thứ 2
            weekday = target_date.weekday()  # 0 = Monday
            date_from = target_date - timedelta(days=weekday)
            date_to = date_from + timedelta(days=6)
        elif view_type == 'month':
            # Tháng
            date_from = target_date.replace(day=1)
            if target_date.month == 12:
                date_to = target_date.replace(year=target_date.year + 1, month=1, day=1) - timedelta(days=1)
            else:
                date_to = target_date.replace(month=target_date.month + 1, day=1) - timedelta(days=1)
        else:
            return Response({
                'error': 'view phải là day, week hoặc month'
            }, status=400)
        
        # Query orders
        orders = Order.objects.filter(
            assigned_staff=staff,
            appointment_date__gte=date_from,
            appointment_date__lte=date_to
        ).order_by('appointment_date', 'appointment_time')
        
        # Group by status
        orders_by_status = {
            'pending': orders.filter(status='pending').count(),
            'confirmed': orders.filter(status='confirmed').count(),
            'in_progress': orders.filter(status='in_progress').count(),
            'completed': orders.filter(status='completed').count(),
            'cancelled': orders.filter(status='cancelled').count(),
        }
        
        # Serialize
        serializer = OrderSerializer(orders, many=True)
        
        return Response({
            'staff': {
                'id': staff.id,
                'full_name': staff.full_name,
                'phone': staff.phone,
                'employee_code': staff.employee_code,
                'role': staff.role.name if staff.role else None
            },
            'view': view_type,
            'date_range': {
                'from': date_from.strftime('%Y-%m-%d'),
                'to': date_to.strftime('%Y-%m-%d')
            },
            'summary': {
                'total': orders.count(),
                'by_status': orders_by_status
            },
            'orders': serializer.data
        })


# ========================================
# VEHICLE VIEWSET
# ========================================

class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        # Admin/Staff: xem tất cả
        if user.is_superuser or hasattr(user, 'staff_profile'):
            return Vehicle.objects.all()
        
        # Customer: chỉ xem xe của mình
        if hasattr(user, 'customer_profile'):
            return Vehicle.objects.filter(customer=user.customer_profile)
        
        return Vehicle.objects.none()
    
    def perform_create(self, serializer):
        # Tự động set customer
        if hasattr(self.request.user, 'customer_profile'):
            serializer.save(customer=self.request.user.customer_profile)
        else:
            serializer.save()


# ========================================
# OTHER VIEWSETS
# ========================================

class VehicleTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = VehicleType.objects.filter(status='active')
    serializer_class = VehicleTypeSerializer
    permission_classes = [AllowAny]


class StationViewSet(viewsets.ModelViewSet):
    queryset = Station.objects.all()
    serializer_class = StationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Lọc theo status nếu có
        queryset = Station.objects.all()
        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(status=status)
        return queryset


class PricingViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Pricing.objects.filter(status='active')
    serializer_class = PricingSerializer
    permission_classes = [AllowAny]


# ========================================
# SERVICE VIEWSETS (17/03/2026)
# ========================================

class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet cho danh mục dịch vụ đăng kiểm
    GET /api/services/ - Danh sách dịch vụ
    GET /api/services/{id}/ - Chi tiết dịch vụ
    """
    queryset = Service.objects.filter(status='active').order_by('display_order', 'service_name')
    serializer_class = ServiceSerializer
    permission_classes = [AllowAny]  # Public API


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    
    # ✅ UPDATED - Enhanced Filter & Search support
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['customer', 'status', 'station', 'assigned_staff', 'priority', 'inspection_result']
    search_fields = [
        'order_code',  # Tìm theo mã đơn
        'vehicle__license_plate',  # Tìm theo biển số xe
        'customer__phone',  # ✅ NEW - Tìm theo SĐT khách hàng
        'customer__full_name',  # ✅ NEW - Tìm theo tên khách
        'assigned_staff__full_name',  # ✅ NEW - Tìm theo tên nhân viên
        'assigned_staff__employee_code',  # ✅ NEW - Tìm theo mã nhân viên
    ]
    ordering_fields = ['appointment_date', 'created_at', 'updated_at', 'status', 'priority']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """
        Optimize query với select_related để giảm số lượng queries
        Trả về đầy đủ thông tin customer, vehicle, station, staff
        """
        user = self.request.user
        
        # ✅ OPTIMIZATION - Tải trước tất cả relations
        queryset = Order.objects.select_related(
            'customer',           # Tải customer info
            'vehicle',            # Tải vehicle info
            'vehicle__vehicle_type',  # Tải vehicle type (cho vehicle_type field)
            'station',            # Tải station info
            'assigned_staff',     # Tải staff info
        )
        
        # Admin/Staff: xem tất cả
        if user.is_superuser or hasattr(user, 'staff_profile'):
            return queryset
        
        # Customer: chỉ xem đơn của mình
        if hasattr(user, 'customer_profile'):
            return queryset.filter(customer=user.customer_profile)
        
        return Order.objects.none()
    
    def perform_create(self, serializer):
        """
        Tạo Order với logic phân quyền rõ ràng:
        
        - CUSTOMER: Tự động lấy customer từ token, BỎ QUA customer_id nếu có
        - STAFF/ADMIN: BẮT BUỘC truyền customer_id
        """
        user = self.request.user
        
        # CASE 1: Customer tự tạo order
        if hasattr(user, 'customer_profile'):
            customer_profile = user.customer_profile
            if customer_profile:
                # ✅ BỎ QUA customer_id trong request, bắt buộc dùng customer từ token
                # ✅ BẢO MẬT: Customer không thể tạo order cho người khác
                serializer.save(customer=customer_profile)
            else:
                raise ValidationError({
                    "error": "Customer profile chưa được tạo. Vui lòng liên hệ admin."
                })
        
        # CASE 2: Staff/Admin tạo order cho khách
        elif hasattr(user, 'staff_profile') or user.is_superuser:
            # ✅ BẮT BUỘC phải truyền customer_id
            if 'customer' not in serializer.validated_data:
                raise ValidationError({
                    "customer": "Staff/Admin phải chỉ định customer_id khi tạo order"
                })
            serializer.save()
        
        # CASE 3: User không có profile (lỗi hệ thống)
        else:
            raise ValidationError({
                "error": "User không có quyền tạo order. Vui lòng liên hệ admin."
            })
    
    # ========================================
    # ADMIN APIs - PHÂN CÔNG NHÂN VIÊN
    # ========================================
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def assign_staff(self, request, pk=None):
        """
        POST /api/orders/{id}/assign_staff/
        Admin/Staff phân công nhân viên cho order
        
        Body: {"staff_id": 1}
        """
        # Chỉ Admin hoặc Staff mới được phân công
        if not (request.user.is_superuser or hasattr(request.user, 'staff_profile')):
            return Response({
                'error': 'Chỉ Admin/Staff mới có quyền phân công nhân viên'
            }, status=403)
        
        order = self.get_object()
        staff_id = request.data.get('staff_id')
        
        if not staff_id:
            return Response({
                'error': 'Thiếu staff_id'
            }, status=400)
        
        try:
            staff = Staff.objects.get(id=staff_id, status='active')
        except Staff.DoesNotExist:
            return Response({
                'error': f'Staff với ID {staff_id} không tồn tại hoặc đã bị khóa'
            }, status=404)
        
        # ✅ BỎ VALIDATION - Cho phép cross-station assignment
        # Staff có thể hỗ trợ nhiều trạm, phù hợp với GPS-based search
        
        # Phân công
        order.assigned_staff = staff
        order.status = 'confirmed'  # Tự động chuyển sang confirmed khi có staff
        order.save()
        
        serializer = self.get_serializer(order)
        return Response({
            'success': True,
            'message': f'Đã phân công {staff.full_name} cho order {order.order_code}',
            'order': serializer.data
        })
    
    @action(detail=True, methods=['put'], permission_classes=[IsAuthenticated])
    def reassign_staff(self, request, pk=None):
        """
        PUT /api/orders/{id}/reassign-staff/
        Admin chuyển order sang nhân viên khác
        
        Body: {"staff_id": 2, "reason": "Staff cũ bận"}
        """
        if not (request.user.is_superuser or hasattr(request.user, 'staff_profile')):
            return Response({
                'error': 'Chỉ Admin/Staff mới có quyền chuyển nhân viên'
            }, status=403)
        
        order = self.get_object()
        new_staff_id = request.data.get('staff_id')
        reason = request.data.get('reason', '')
        
        if not new_staff_id:
            return Response({
                'error': 'Thiếu staff_id'
            }, status=400)
        
        try:
            new_staff = Staff.objects.get(id=new_staff_id, status='active')
        except Staff.DoesNotExist:
            return Response({
                'error': f'Staff với ID {new_staff_id} không tồn tại hoặc đã bị khóa'
            }, status=404)
        
        old_staff = order.assigned_staff
        order.assigned_staff = new_staff
        order.staff_notes = f"[Chuyển từ {old_staff.full_name if old_staff else 'chưa phân'} sang {new_staff.full_name}] {reason}\n{order.staff_notes or ''}"
        order.save()
        
        serializer = self.get_serializer(order)
        return Response({
            'success': True,
            'message': f'Đã chuyển order từ {old_staff.full_name if old_staff else "chưa phân"} sang {new_staff.full_name}',
            'order': serializer.data
        })
    
    @action(detail=True, methods=['delete'], permission_classes=[IsAuthenticated])
    def unassign_staff(self, request, pk=None):
        """
        DELETE /api/orders/{id}/unassign-staff/
        Admin gỡ nhân viên khỏi order
        """
        if not request.user.is_superuser:
            return Response({
                'error': 'Chỉ Admin mới có quyền gỡ nhân viên'
            }, status=403)
        
        order = self.get_object()
        old_staff = order.assigned_staff
        
        order.assigned_staff = None
        order.status = 'pending'  # Trở về pending khi chưa có staff
        order.save()
        
        serializer = self.get_serializer(order)
        return Response({
            'success': True,
            'message': f'Đã gỡ {old_staff.full_name if old_staff else "nhân viên"} khỏi order',
            'order': serializer.data
        })
    
    # ========================================
    # STAFF APIs - XEM LỊCH VÀ CẬP NHẬT
    # ========================================
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_tasks(self, request):
        """
        GET /api/orders/my-tasks/
        Staff xem danh sách order được phân công cho mình
        
        Query params:
        - status: pending, confirmed, in_progress, completed, cancelled
        - date: YYYY-MM-DD (lọc theo appointment_date)
        - date_from: YYYY-MM-DD
        - date_to: YYYY-MM-DD
        """
        if not hasattr(request.user, 'staff_profile'):
            return Response({
                'error': 'Chỉ Staff mới có quyền xem lịch làm việc'
            }, status=403)
        
        staff = request.user.staff_profile
        queryset = Order.objects.filter(assigned_staff=staff).order_by('appointment_date', 'appointment_time')
        
        # Lọc theo status
        status = request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        
        # Lọc theo ngày cụ thể
        date = request.query_params.get('date')
        if date:
            queryset = queryset.filter(appointment_date=date)
        
        # Lọc theo khoảng thời gian
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')
        if date_from:
            queryset = queryset.filter(appointment_date__gte=date_from)
        if date_to:
            queryset = queryset.filter(appointment_date__lte=date_to)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'count': queryset.count(),
            'staff': {
                'id': staff.id,
                'full_name': staff.full_name,
                'employee_code': staff.employee_code,
                'role': staff.role.name if staff.role else None
            },
            'tasks': serializer.data
        })
    
    @action(detail=True, methods=['put'], permission_classes=[IsAuthenticated])
    def update_status(self, request, pk=None):
        """
        PUT /api/orders/{id}/update-status/
        Staff cập nhật trạng thái order
        
        Body: {
            "status": "in_progress",
            "staff_notes": "Đang kiểm tra động cơ"
        }
        
        Allowed transitions:
        - confirmed → in_progress
        - in_progress → completed
        - * → cancelled (chỉ Admin)
        """
        order = self.get_object()
        user = request.user
        
        # Kiểm tra quyền
        if hasattr(user, 'staff_profile'):
            # Staff chỉ được update order của mình
            if order.assigned_staff != user.staff_profile:
                return Response({
                    'error': 'Bạn chỉ được cập nhật order được phân công cho mình'
                }, status=403)
        elif not user.is_superuser:
            return Response({
                'error': 'Chỉ Admin/Staff mới có quyền cập nhật trạng thái'
            }, status=403)
        
        new_status = request.data.get('status')
        staff_notes = request.data.get('staff_notes', '')
        
        if not new_status:
            return Response({
                'error': 'Thiếu field status'
            }, status=400)
        
        # Validate status transition
        allowed_statuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']
        if new_status not in allowed_statuses:
            return Response({
                'error': f'Status không hợp lệ. Cho phép: {", ".join(allowed_statuses)}'
            }, status=400)
        
        # Business rules
        if new_status == 'cancelled' and not user.is_superuser:
            return Response({
                'error': 'Chỉ Admin mới có quyền hủy order'
            }, status=403)
        
        # Update
        order.status = new_status
        if staff_notes:
            order.staff_notes = f"{staff_notes}\n{order.staff_notes or ''}"
        order.save()
        
        serializer = self.get_serializer(order)
        return Response({
            'success': True,
            'message': f'Đã cập nhật trạng thái thành {new_status}',
            'order': serializer.data
        })
    
    # ========================================
    # ✅ QUẢN LÝ TRẠNG THÁI ĐƠN HÀNG (16/03/2026)
    # ========================================
    
    @action(detail=True, methods=['post'], url_path='start-processing', permission_classes=[IsAuthenticated])
    def start_processing(self, request, pk=None):
        """
        API: Staff bắt đầu xử lý đơn hàng
        POST /api/staff/orders/{order_id}/start-processing/
        
        Chuyển trạng thái: pending → in_progress
        
        Response: {
            "success": true,
            "message": "Đã bắt đầu xử lý đơn hàng",
            "order": {...}
        }
        
        AUTHENTICATION: Token (Staff only)
        VALIDATION:
        - Chỉ staff được phân công mới được thực hiện
        - Đơn hàng phải ở trạng thái "pending"
        """
        order = self.get_object()
        
        # ===== 1. CHECK PERMISSION =====
        if not hasattr(request.user, 'staff_profile'):
            return Response({
                'success': False,
                'error': 'Chỉ nhân viên mới có quyền thực hiện'
            }, status=403)
        
        staff = request.user.staff_profile
        
        # Check staff có phải người được phân công không
        if order.assigned_staff != staff:
            return Response({
                'success': False,
                'error': 'Bạn không được phân công cho đơn hàng này'
            }, status=403)
        
        # ===== 2. VALIDATE STATUS =====
        if order.status != 'pending':
            return Response({
                'success': False,
                'error': f'Không thể bắt đầu xử lý. Trạng thái hiện tại: {order.get_status_display()}',
                'current_status': order.status
            }, status=400)
        
        # ===== 3. UPDATE STATUS =====
        previous_status = order.status
        order.status = 'in_progress'
        order.save()
        
        # ===== 4. LOG HISTORY =====
        OrderStatusHistory.objects.create(
            order=order,
            from_status=previous_status,
            to_status='in_progress',
            changed_by=request.user,
            notes='Staff bắt đầu xử lý đơn hàng'
        )
        
        # ===== 5. RESPONSE =====
        serializer = self.get_serializer(order)
        return Response({
            'success': True,
            'message': 'Đã bắt đầu xử lý đơn hàng',
            'order': serializer.data,
            'previous_status': previous_status
        }, status=200)
    
    @action(detail=True, methods=['post'], url_path='cancel-start', permission_classes=[IsAuthenticated])
    def cancel_start(self, request, pk=None):
        """
        API: Staff hủy bắt đầu xử lý và quay lại trạng thái chờ xử lý
        POST /api/staff/orders/{order_id}/cancel-start/
        
        Chuyển trạng thái: in_progress → pending
        
        Body: {
            "reason": "Cần kiểm tra thêm thông tin" // Optional
        }
        
        Response: {
            "success": true,
            "message": "Đã hủy và quay lại trạng thái chờ xử lý",
            "order": {...}
        }
        
        AUTHENTICATION: Token (Staff only)
        VALIDATION:
        - Chỉ staff được phân công mới được thực hiện
        - Đơn hàng phải ở trạng thái "in_progress"
        """
        order = self.get_object()
        
        # ===== 1. CHECK PERMISSION =====
        if not hasattr(request.user, 'staff_profile'):
            return Response({
                'success': False,
                'error': 'Chỉ nhân viên mới có quyền thực hiện'
            }, status=403)
        
        staff = request.user.staff_profile
        
        # Check staff có phải người được phân công không
        if order.assigned_staff != staff:
            return Response({
                'success': False,
                'error': 'Bạn không được phân công cho đơn hàng này'
            }, status=403)
        
        # ===== 2. VALIDATE STATUS =====
        if order.status != 'in_progress':
            return Response({
                'success': False,
                'error': f'Không thể hủy. Trạng thái hiện tại: {order.get_status_display()}',
                'current_status': order.status
            }, status=400)
        
        # ===== 3. GET REASON (Optional) =====
        reason = request.data.get('reason', '')
        
        # ===== 4. UPDATE STATUS =====
        previous_status = order.status
        order.status = 'pending'
        order.save()
        
        # ===== 5. LOG HISTORY =====
        notes = f'Staff hủy bắt đầu xử lý. Lý do: {reason}' if reason else 'Staff hủy bắt đầu xử lý'
        OrderStatusHistory.objects.create(
            order=order,
            from_status=previous_status,
            to_status='pending',
            changed_by=request.user,
            notes=notes
        )
        
        # ===== 6. RESPONSE =====
        serializer = self.get_serializer(order)
        return Response({
            'success': True,
            'message': 'Đã hủy và quay lại trạng thái chờ xử lý',
            'order': serializer.data,
            'previous_status': previous_status,
            'reason': reason
        }, status=200)
    
    # ========================================
    # ✅ QUY TRÌNH NHẬN XE 3 BƯỚC (08/03/2026)
    # ========================================
    
    @action(detail=True, methods=['post', 'put', 'get'], permission_classes=[IsAuthenticated])
    def vehicle_receipt(self, request, pk=None):
        """
        API tối ưu cho quy trình nhận xe 3 bước (Mobile-friendly)
        
        POST /api/orders/{id}/vehicle-receipt/ - Tạo biên bản nhận xe
        PUT /api/orders/{id}/vehicle-receipt/ - Cập nhật biên bản (partial update)
        GET /api/orders/{id}/vehicle-receipt/ - Xem biên bản
        """
        # 1. Kiểm tra quyền - Chỉ staff được nhận xe
        user = request.user
        if not hasattr(user, 'staff_profile'):
            return Response({'error': 'Chỉ nhân viên mới có quyền nhận xe'}, status=403)
        
        staff = user.staff_profile
        order = self.get_object()
        
        # GET - Xem biên bản
        if request.method == 'GET':
            try:
                receipt_log = VehicleReceiptLog.objects.get(order=order)
                serializer = VehicleReceiptLogSerializer(receipt_log)
                return Response({'success': True, 'receipt_log': serializer.data})
            except VehicleReceiptLog.DoesNotExist:
                return Response({
                    'success': False,
                    'error': 'Chưa có biên bản nhận xe'
                }, status=404)
        
        # POST/PUT - Tạo hoặc cập nhật
        data = request.data
        serializer = VehicleReceiptLogCreateSerializer(data=data)
        
        if not serializer.is_valid():
            return Response({'success': False, 'errors': serializer.errors}, status=400)
        
        validated_data = serializer.validated_data
        
        # 2. Cập nhật Customer info
        customer_info = validated_data.get('customer_info')
        if customer_info:
            customer = order.customer
            customer.full_name = customer_info.get('full_name', customer.full_name)
            # ❌ KHÔNG UPDATE PHONE - Phone là unique identifier, không được thay đổi
            # customer.phone = customer_info.get('phone', customer.phone)
            customer.address = customer_info.get('address', customer.address)
            customer.date_of_birth = customer_info.get('date_of_birth', customer.date_of_birth)
            customer.id_number = customer_info.get('id_number', customer.id_number)
            customer.id_issued_date = customer_info.get('id_issued_date', customer.id_issued_date)
            customer.id_issued_place = customer_info.get('id_issued_place', customer.id_issued_place)
            customer.save()
        
        # 3. Tạo/Cập nhật VehicleReceiptLog
        # Chỉ update các field có trong request (tránh ghi đè dữ liệu cũ)
        defaults = {
            'received_by': staff,
            # Giá trị mặc định cho lần tạo mới
            'odometer_reading': 0,
            'fuel_level': 'half',
            'exterior_front': 'Đã kiểm tra',
            'exterior_rear': 'Đã kiểm tra',
            'exterior_left': 'Đã kiểm tra',
            'exterior_right': 'Đã kiểm tra',
            'windows_condition': 'Tốt',
            'lights_condition': 'Tốt',
            'mirrors_condition': 'Tốt',
            'wipers_condition': 'Tốt',
            'tires_condition': 'Tốt',
            'interior_condition': 'Sạch sẽ',
        }
        
        # Chỉ update các field nếu chúng có trong request
        optional_fields = [
            # 1. Ảnh xe chung (6 fields)
            'photo_front_url', 'photo_rear_url', 'photo_left_url', 
            'photo_right_url', 'photo_dashboard_url', 'photo_interior_url',
            # 2. Checklist checkbox (8 fields)
            'exterior_ok', 'tires_ok', 'lights_ok', 'mirrors_ok',
            'windows_ok', 'interior_ok', 'engine_ok', 'fuel_ok',
            # 3. Ảnh checklist (8 fields)
            'exterior_check_photo', 'tires_check_photo', 'lights_check_photo',
            'mirrors_check_photo', 'windows_check_photo', 'interior_check_photo',
            'engine_check_photo', 'fuel_check_photo',
            # 4. Giấy tờ (2 fields)
            'vehicle_registration_url', 'vehicle_insurance_url',
            # 5. Ghi chú & chữ ký (2 fields)
            'additional_notes', 'customer_signature'
        ]
        
        for field in optional_fields:
            if field in validated_data:
                defaults[field] = validated_data[field]
        
        receipt_log, created = VehicleReceiptLog.objects.update_or_create(
            order=order,
            defaults=defaults
        )
        
        # 4. Xử lý thanh toán
        payment_method = validated_data.get('payment_method')
        payment_completed = validated_data.get('payment_completed', False)
        
        payment = None
        if payment_method and payment_completed:
            # Map payment method correctly
            payment_method_map = {
                'cash': 'cash',
                'qr': 'vietqr',
                'bank_transfer': 'bank_transfer',
                'momo': 'momo',
                'zalopay': 'zalopay',
                'vnpay': 'vnpay'
            }
            mapped_payment_method = payment_method_map.get(payment_method, 'vietqr')
            
            payment, payment_created = Payment.objects.update_or_create(
                order=order,
                defaults={
                    'amount': order.estimated_amount + order.additional_amount,
                    'payment_method': mapped_payment_method,
                    'status': 'paid',
                    'paid_at': timezone.now()
                }
            )
        
        # 5. Cập nhật Order status
        if order.status in ['confirmed', 'assigned'] and not order.started_at:
            order.status = 'in_progress'
            order.started_at = timezone.now()
            order.save()
        
        # 6. Response
        receipt_serializer = VehicleReceiptLogSerializer(receipt_log)
        order_serializer = OrderSerializer(order)
        
        response_data = {
            'success': True,
            'message': 'Đã lưu biên bản nhận xe' if created else 'Đã cập nhật biên bản nhận xe',
            'receipt_log': receipt_serializer.data,
            'order': order_serializer.data
        }
        
        # Thêm payment vào response nếu có
        if payment:
            payment_serializer = PaymentSerializer(payment)
            response_data['payment'] = payment_serializer.data
            response_data['message'] += ' và thanh toán'
        
        return Response(response_data, status=201 if created else 200)
    
    # ========================================
    # ✅✅ NEW - VEHICLE RECEIPT MULTI-STEP APIs (09/03/2026)
    # ========================================
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def vehicle_receipt_initialize(self, request, pk=None):
        """
        ✅ UPDATED 18/03/2026 - API #1: Initialize - Khởi tạo biên bản nhận xe
        POST /api/orders/{id}/vehicle-receipt-initialize/
        Request: { customer_info + customer_signature + payment_confirmed }
        """
        # 1. Kiểm tra quyền - Chỉ staff được nhận xe
        user = request.user
        if not hasattr(user, 'staff_profile'):
            return Response({'error': 'Chỉ nhân viên mới có quyền nhận xe'}, status=403)
        
        staff = user.staff_profile
        order = self.get_object()
        
        # 2. Kiểm tra đã có biên bản chưa
        if hasattr(order, 'receipt_log'):
            receipt = order.receipt_log
            return Response({
                'success': False,
                'message': 'Đã có biên bản nhận xe cho order này',
                'receipt': {
                    'id': receipt.id,
                    'status': receipt.status,
                    'created_at': receipt.created_at
                }
            }, status=400)
        
        # 3. Validate serializer
        serializer = VehicleReceiptInitializeSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'success': False, 'errors': serializer.errors}, status=400)
        
        data = serializer.validated_data
        
        # 4. CẬP NHẬT CUSTOMER INFO (NEW)
        customer_info = data.get('customer_info', {})
        if customer_info:
            customer = order.customer
            
            if 'full_name' in customer_info:
                customer.full_name = customer_info['full_name']
            if 'birth_date' in customer_info:
                customer.date_of_birth = customer_info['birth_date']
            if 'id_number' in customer_info:
                customer.id_number = customer_info['id_number']
            if 'id_issue_date' in customer_info:
                customer.id_issued_date = customer_info['id_issue_date']
            if 'id_issue_place' in customer_info:
                customer.id_issued_place = customer_info['id_issue_place']
            if 'phone' in customer_info:
                customer.phone = customer_info['phone']
            if 'address' in customer_info:
                customer.address = customer_info['address']
            
            customer.save()
        
        # 5. KIỂM TRA THANH TOÁN (NEW)
        payment_confirmed = data.get('payment_confirmed', True)
        if payment_confirmed:
            if order.payment_status != 'paid':
                return Response({
                    'success': False,
                    'error': 'Đơn hàng chưa được thanh toán',
                    'payment_required': True,
                    'amount': float(order.estimated_amount)
                }, status=400)
        
        # 6. TẠO BIÊN BẢN với customer_signature
        receipt = VehicleReceiptLog.objects.create(
            order=order,
            received_by=staff,
            customer_signature=data['customer_signature'],
            status='initialized',
            odometer_reading=0,
            fuel_level='half',
            exterior_front='',
            exterior_rear='',
            exterior_left='',
            exterior_right='',
            windows_condition='',
            lights_condition='',
            mirrors_condition='',
            wipers_condition='',
            tires_condition='',
            interior_condition=''
        )
        
        return Response({
            'success': True,
            'message': 'Đã khởi tạo biên bản nhận xe và cập nhật thông tin khách hàng',
            'receipt': {
                'id': receipt.id,
                'order_id': order.id,
                'order_code': order.order_code,
                'status': receipt.status,
                'received_by': staff.id,
                'staff_name': staff.full_name,
                'staff_code': staff.employee_code,
                'created_at': receipt.created_at
            },
            'customer': {
                'id': order.customer.id,
                'full_name': order.customer.full_name,
                'phone': order.customer.phone,
                'id_number': order.customer.id_number
            },
            'order': {
                'id': order.id,
                'payment_status': order.payment_status,
                'estimated_amount': float(order.estimated_amount)
            }
        }, status=201)
    
    @action(detail=True, methods=['post', 'put'], permission_classes=[IsAuthenticated])
    def vehicle_receipt_vehicle_inspection(self, request, pk=None):
        """
        API #2: Vehicle Inspection - Lưu 6 ảnh xe
        POST/PUT /api/orders/{id}/vehicle-receipt-vehicle-inspection/
        """
        # 1. Kiểm tra quyền
        user = request.user
        if not hasattr(user, 'staff_profile'):
            return Response({'error': 'Chỉ nhân viên mới có quyền nhận xe'}, status=403)
        
        staff = user.staff_profile
        order = self.get_object()
        
        # 2. Validate serializer
        serializer = VehicleReceiptVehicleInspectionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'success': False, 'errors': serializer.errors}, status=400)
        
        # 3. Lấy hoặc tạo receipt
        receipt, created = VehicleReceiptLog.objects.get_or_create(
            order=order,
            defaults={
                'received_by': staff,
                'status': 'draft',
                'odometer_reading': 0,
                'fuel_level': 'half',
                'exterior_front': '',
                'exterior_rear': '',
                'exterior_left': '',
                'exterior_right': '',
                'windows_condition': '',
                'lights_condition': '',
                'mirrors_condition': '',
                'wipers_condition': '',
                'tires_condition': '',
                'interior_condition': ''
            }
        )
        
        # 4. Update 6 ảnh xe
        for field in ['photo_front_url', 'photo_rear_url', 'photo_left_url', 
                      'photo_right_url', 'photo_dashboard_url', 'photo_interior_url']:
            if field in serializer.validated_data:
                setattr(receipt, field, serializer.validated_data[field])
        
        # ===== THÊM MỚI: Update 2 giấy tờ =====
        if 'vehicle_registration_url' in serializer.validated_data:
            receipt.vehicle_registration_url = serializer.validated_data['vehicle_registration_url']
        if 'vehicle_insurance_url' in serializer.validated_data:
            receipt.vehicle_insurance_url = serializer.validated_data['vehicle_insurance_url']
        
        # 5. Update status
        receipt.status = 'vehicle_inspected'
        receipt.save()
        
        # 6. Return response
        return Response({
            'success': True,
            'message': 'Đã lưu ảnh xe',
            'receipt': VehicleReceiptLogSerializer(receipt).data
        }, status=200)
    
    @action(detail=True, methods=['post', 'put'], permission_classes=[IsAuthenticated])
    def vehicle_receipt_condition_check(self, request, pk=None):
        """
        API #3: Condition Check - Lưu 8 checkbox + 8 ảnh checklist
        POST/PUT /api/orders/{id}/vehicle-receipt-condition-check/
        """
        # 1. Kiểm tra quyền
        user = request.user
        if not hasattr(user, 'staff_profile'):
            return Response({'error': 'Chỉ nhân viên mới có quyền nhận xe'}, status=403)
        
        staff = user.staff_profile
        order = self.get_object()
        
        # 2. Validate serializer
        serializer = VehicleReceiptConditionCheckSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'success': False, 'errors': serializer.errors}, status=400)
        
        # 3. Lấy hoặc tạo receipt
        receipt, created = VehicleReceiptLog.objects.get_or_create(
            order=order,
            defaults={
                'received_by': staff,
                'status': 'draft',
                'odometer_reading': 0,
                'fuel_level': 'half',
                'exterior_front': '',
                'exterior_rear': '',
                'exterior_left': '',
                'exterior_right': '',
                'windows_condition': '',
                'lights_condition': '',
                'mirrors_condition': '',
                'wipers_condition': '',
                'tires_condition': '',
                'interior_condition': ''
            }
        )
        
        # 4. Update 8 checkbox
        for field in ['exterior_ok', 'tires_ok', 'lights_ok', 'mirrors_ok', 
                      'windows_ok', 'interior_ok', 'engine_ok', 'fuel_ok']:
            if field in serializer.validated_data:
                setattr(receipt, field, serializer.validated_data[field])
        
        # 4.1. Update 2 checkbox bổ sung (giấy tờ & tem)
        for field in ['documents_complete_ok', 'stamp_attached_ok']:
            if field in serializer.validated_data:
                setattr(receipt, field, serializer.validated_data[field])
        
        # 5. Update 8 ảnh checklist
        for field in ['exterior_check_photo', 'tires_check_photo', 'lights_check_photo', 
                      'mirrors_check_photo', 'windows_check_photo', 'interior_check_photo', 
                      'engine_check_photo', 'fuel_check_photo']:
            if field in serializer.validated_data:
                setattr(receipt, field, serializer.validated_data[field])
        
        # 5.1. Update 2 ảnh bổ sung (giấy tờ & tem)
        for field in ['documents_complete_photo', 'stamp_attached_photo']:
            if field in serializer.validated_data:
                setattr(receipt, field, serializer.validated_data[field])
        
        # 5.2. Update additional_notes
        if 'additional_notes' in serializer.validated_data:
            receipt.additional_notes = serializer.validated_data['additional_notes']
        
        # NOTE: Các fields mô tả text (exterior_front, windows_condition, etc.) 
        # KHÔNG được update vì giao diện chỉ có checkbox + ảnh, không có input text
        
        # 6. Update status
        receipt.status = 'condition_checked'
        receipt.save()
        
        # 7. Return response
        return Response({
            'success': True,
            'message': 'Đã lưu kết quả kiểm tra',
            'receipt': VehicleReceiptLogSerializer(receipt).data
        }, status=200)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def vehicle_receipt_finalize(self, request, pk=None):
        """
        ✅ UPDATED 18/03/2026 - API #4: Finalize - Hoàn tất biên bản NHẬN XE
        POST /api/orders/{id}/vehicle-receipt-finalize/
        Request: { staff_signature }
        CHỈ CẦN staff_signature - customer_signature đã có ở API 1, giấy tờ đã có ở API 2
        """
        # 1. Kiểm tra quyền
        user = request.user
        if not hasattr(user, 'staff_profile'):
            return Response({'error': 'Chỉ nhân viên mới có quyền nhận xe'}, status=403)
        
        staff = user.staff_profile
        order = self.get_object()
        
        # 2. Kiểm tra Order status (phải in_progress)
        if order.status != 'in_progress':
            return Response({
                'success': False,
                'error': f'Order phải ở trạng thái in_progress. Hiện tại: {order.status}'
            }, status=400)
        
        # 3. Validate serializer
        serializer = VehicleReceiptFinalizeSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'success': False, 'errors': serializer.errors}, status=400)
        
        # 4. Lấy receipt (PHẢI đã tồn tại từ API 1)
        if not hasattr(order, 'receipt_log'):
            return Response({
                'success': False,
                'error': 'Chưa khởi tạo biên bản nhận xe. Vui lòng gọi API Initialize trước.',
                'message': 'Biên bản chưa tồn tại'
            }, status=400)
        
        receipt = order.receipt_log
        
        # 5. Update staff_signature
        receipt.staff_signature = serializer.validated_data['staff_signature']
        
        # 6. Update status → completed
        receipt.status = 'completed'
        receipt.completed_at = timezone.now()
        receipt.save()
        
        # 7. Update Order status → vehicle_received
        order.status = 'vehicle_received'
        if not order.started_at:
            order.started_at = timezone.now()
        order.save()
        
        # 8. Return response
        return Response({
            'success': True,
            'message': 'Đã hoàn tất biên bản nhận xe',
            'receipt': VehicleReceiptLogSerializer(receipt).data,
            'order': {
                'id': order.id,
                'order_code': order.order_code,
                'status': order.status,
                'started_at': order.started_at
            }
        }, status=200)
    
    @action(detail=True, methods=['post'], url_path='complete-vehicle-received', permission_classes=[IsAuthenticated])
    def complete_vehicle_received(self, request, pk=None):
        """
        🎯 NEW - API: Hoàn tất đơn hàng sau khi nhận xe
        POST /api/orders/{id}/complete-vehicle-received/
        
        Chuyển trạng thái: VEHICLE_RECEIVED → COMPLETED
        Dùng sau khi hoàn tất quá trình nhận xe
        """
        # 1. Kiểm tra quyền
        user = request.user
        if not hasattr(user, 'staff_profile'):
            return Response({
                'success': False,
                'error': 'Chỉ nhân viên mới có quyền thực hiện'
            }, status=403)
        
        order = self.get_object()
        
        # 2. Kiểm tra Order status (phải vehicle_received)
        if order.status != 'vehicle_received':
            return Response({
                'success': False,
                'error': f'Order phải ở trạng thái vehicle_received. Hiện tại: {order.status}'
            }, status=400)
        
        # 3. Kiểm tra biên bản nhận xe tồn tại
        if not hasattr(order, 'receipt_log'):
            return Response({
                'success': False,
                'error': 'Chưa có biên bản nhận xe'
            }, status=404)
        
        # 4. Update Order status → completed
        order.status = 'completed'
        order.completed_at = timezone.now()
        order.save()
        
        # 5. Return response
        return Response({
            'success': True,
            'message': 'Đã hoàn tất đơn hàng (nhận xe)',
            'order': {
                'id': order.id,
                'order_code': order.order_code,
                'status': order.status,
                'completed_at': order.completed_at
            }
        }, status=200)
    
    # ========================================
    # ✅✅ NEW - VEHICLE RETURN APIs (10/03/2026)
    # ========================================
    
    @action(detail=True, methods=['post', 'put', 'get'], url_path='vehicle-return', permission_classes=[IsAuthenticated])
    def vehicle_return(self, request, pk=None):
        """
        ✅✅ API TỔNG HỢP - Tạo/Cập nhật/Xem biên bản TRẢ XE (Full)
        
        POST /api/orders/{id}/vehicle-return/ - Tạo biên bản trả xe
        PUT /api/orders/{id}/vehicle-return/ - Cập nhật biên bản (partial update)
        GET /api/orders/{id}/vehicle-return/ - Xem biên bản
        """
        # 1. Kiểm tra quyền - Chỉ staff được trả xe
        user = request.user
        if not hasattr(user, 'staff_profile'):
            return Response({'error': 'Chỉ nhân viên mới có quyền trả xe'}, status=403)
        
        staff = user.staff_profile
        order = self.get_object()
        
        # === GET: Xem biên bản ===
        if request.method == 'GET':
            try:
                return_log = VehicleReturnLog.objects.get(order=order)
                serializer = VehicleReturnLogSerializer(return_log)
                return Response({
                    'success': True,
                    'return_log': serializer.data
                })
            except VehicleReturnLog.DoesNotExist:
                return Response({'error': 'Chưa có biên bản trả xe'}, status=404)
        
        # === POST: Tạo mới ===
        if request.method == 'POST':
            # Kiểm tra đã có biên bản chưa
            if hasattr(order, 'return_log'):
                return Response({'error': 'Biên bản trả xe đã tồn tại'}, status=400)
            
            # Tạo biên bản mới
            return_log = VehicleReturnLog.objects.create(
                order=order,
                returned_by=staff,
                status='draft'
            )
            
            # Cập nhật các field (nếu có)
            for field, value in request.data.items():
                if hasattr(return_log, field) and field not in ['order', 'returned_by', 'returned_at', 'created_at', 'updated_at']:
                    setattr(return_log, field, value)
            
            return_log.save()
            
            serializer = VehicleReturnLogSerializer(return_log)
            return Response({
                'success': True,
                'message': 'Đã tạo biên bản trả xe',
                'return_log': serializer.data
            }, status=201)
        
        # === PUT: Cập nhật (partial) ===
        if request.method == 'PUT':
            try:
                return_log = order.return_log
            except VehicleReturnLog.DoesNotExist:
                return Response({'error': 'Chưa có biên bản trả xe. Vui lòng tạo mới bằng POST'}, status=404)
            
            # Cập nhật các field
            for field, value in request.data.items():
                if hasattr(return_log, field) and field not in ['order', 'returned_by', 'returned_at', 'created_at', 'updated_at']:
                    setattr(return_log, field, value)
            
            return_log.save()
            
            serializer = VehicleReturnLogSerializer(return_log)
            return Response({
                'success': True,
                'message': 'Đã cập nhật biên bản trả xe',
                'return_log': serializer.data
            })
    
    @action(detail=True, methods=['post'], url_path='vehicle-return-initialize', permission_classes=[IsAuthenticated])
    def vehicle_return_initialize(self, request, pk=None):
        """
        API #1: Initialize - Khởi tạo biên bản TRẢ XE
        POST /api/orders/{id}/vehicle-return-initialize/
        """
        # 1. Kiểm tra quyền - Chỉ staff được trả xe
        user = request.user
        if not hasattr(user, 'staff_profile'):
            return Response({'error': 'Chỉ nhân viên mới có quyền trả xe'}, status=403)
        
        staff = user.staff_profile
        order = self.get_object()
        
        # 2. Kiểm tra Order status (phải in_progress - chỉ được trả xe sau khi bắt đầu)
        if order.status != 'in_progress':
            return Response({
                'error': f'Order phải ở trạng thái in_progress. Hiện tại: {order.status}'
            }, status=400)
        
        # 3. Kiểm tra đã có biên bản chưa
        if hasattr(order, 'return_log'):
            return Response({
                'error': 'Biên bản trả xe đã tồn tại',
                'return_log_id': order.return_log.id,
                'status': order.return_log.status
            }, status=400)
        
        # 4. Tạo biên bản trả xe (status = draft)
        return_log = VehicleReturnLog.objects.create(
            order=order,
            returned_by=staff,
            status='draft'
        )
        
        # 5. Cập nhật Order status → vehicle_returned
        order.status = 'vehicle_returned'
        order.save()
        
        # 6. Return response
        return Response({
            'success': True,
            'message': 'Đã khởi tạo biên bản trả xe',
            'return_log': {
                'id': return_log.id,
                'order_id': order.id,
                'order_code': order.order_code,
                'status': return_log.status,
                'returned_by': staff.full_name,
                'returned_at': return_log.returned_at
            },
            'order': {
                'id': order.id,
                'status': order.status,
                'status_display': order.get_status_display()
            }
        }, status=201)
    
    @action(detail=True, methods=['post', 'put'], url_path='vehicle-return-vehicle-inspection', permission_classes=[IsAuthenticated])
    def vehicle_return_vehicle_inspection(self, request, pk=None):
        """
        API #2: Vehicle Inspection - Chụp 6 ảnh xe KHI TRẢ
        POST /api/orders/{id}/vehicle-return-vehicle-inspection/
        PUT  /api/orders/{id}/vehicle-return-vehicle-inspection/
        """
        # 1. Kiểm tra quyền
        user = request.user
        if not hasattr(user, 'staff_profile'):
            return Response({'error': 'Chỉ nhân viên mới có quyền trả xe'}, status=403)
        
        order = self.get_object()
        
        # 2. Kiểm tra biên bản đã tồn tại chưa
        try:
            return_log = order.return_log
        except VehicleReturnLog.DoesNotExist:
            return Response({
                'error': 'Chưa có biên bản trả xe. Vui lòng gọi initialize trước'
            }, status=404)
        
        # 3. Validate data
        serializer = VehicleReceiptVehicleInspectionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        
        # 4. Cập nhật 6 ảnh xe
        photo_fields = ['photo_front_url', 'photo_rear_url', 'photo_left_url', 
                       'photo_right_url', 'photo_dashboard_url', 'photo_interior_url']
        
        for field in photo_fields:
            value = serializer.validated_data.get(field)
            if value:  # Chỉ cập nhật nếu có giá trị
                setattr(return_log, field, value)
        
        # 5. Update status → vehicle_inspected
        return_log.status = 'vehicle_inspected'
        return_log.save()
        
        # 6. Return response
        return Response({
            'success': True,
            'message': 'Đã lưu ảnh xe khi trả',
            'return_log': {
                'id': return_log.id,
                'status': return_log.status,
                'photo_front_url': return_log.photo_front_url,
                'photo_rear_url': return_log.photo_rear_url,
                'photo_left_url': return_log.photo_left_url,
                'photo_right_url': return_log.photo_right_url,
                'photo_dashboard_url': return_log.photo_dashboard_url,
                'photo_interior_url': return_log.photo_interior_url,
            }
        }, status=200)
    
    @action(detail=True, methods=['post', 'put'], url_path='vehicle-return-condition-check', permission_classes=[IsAuthenticated])
    def vehicle_return_condition_check(self, request, pk=None):
        """
        API #3: Condition Check - Kiểm tra tình trạng xe khi trả
        POST /api/orders/{id}/vehicle-return-condition-check/
        PUT  /api/orders/{id}/vehicle-return-condition-check/
        """
        # 1. Kiểm tra quyền
        user = request.user
        if not hasattr(user, 'staff_profile'):
            return Response({'error': 'Chỉ nhân viên mới có quyền trả xe'}, status=403)
        
        order = self.get_object()
        
        # 2. Kiểm tra biên bản
        try:
            return_log = order.return_log
        except VehicleReturnLog.DoesNotExist:
            return Response({
                'error': 'Chưa có biên bản trả xe. Vui lòng gọi initialize trước'
            }, status=404)
        
        # 3. Validate data
        serializer = VehicleReturnConditionCheckSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        
        # 4. Cập nhật 8 checkbox + 8 ảnh cho TRẢ XE (UPDATED 16/03/2026 - Tách riêng từ NHẬN XE)
        checkbox_fields = ['exterior_ok', 'tires_ok', 'lights_ok', 'mirrors_ok',
                          'windows_ok', 'interior_ok', 'documents_complete_ok', 'stamp_attached_ok']
        photo_fields = ['exterior_check_photo', 'tires_check_photo', 'lights_check_photo',
                       'mirrors_check_photo', 'windows_check_photo', 'interior_check_photo',
                       'documents_complete_photo', 'stamp_attached_photo']
        
        for field in checkbox_fields + photo_fields:
            value = serializer.validated_data.get(field)
            if value is not None:  # Cho phép False
                setattr(return_log, field, value)
        
        # 5. Update status → condition_checked
        return_log.status = 'condition_checked'
        return_log.save()
        
        # 6. Return response (UPDATED 10/03/2026 - Thêm 10 ảnh + 2 checkbox bổ sung)
        return Response({
            'success': True,
            'message': 'Đã lưu tình trạng xe khi trả',
            'return_log': {
                'id': return_log.id,
                'status': return_log.status,
                'checklist': {
                    # 8 checkbox TRẢ XE (UPDATED 16/03/2026)
                    'exterior_ok': return_log.exterior_ok,
                    'tires_ok': return_log.tires_ok,
                    'lights_ok': return_log.lights_ok,
                    'mirrors_ok': return_log.mirrors_ok,
                    'windows_ok': return_log.windows_ok,
                    'interior_ok': return_log.interior_ok,
                    'documents_complete_ok': return_log.documents_complete_ok,
                    'stamp_attached_ok': return_log.stamp_attached_ok,
                    
                    # 8 ảnh checklist TRẢ XE
                    'exterior_check_photo': return_log.exterior_check_photo,
                    'tires_check_photo': return_log.tires_check_photo,
                    'lights_check_photo': return_log.lights_check_photo,
                    'mirrors_check_photo': return_log.mirrors_check_photo,
                    'windows_check_photo': return_log.windows_check_photo,
                    'interior_check_photo': return_log.interior_check_photo,
                    'documents_complete_photo': return_log.documents_complete_photo,
                    'stamp_attached_photo': return_log.stamp_attached_photo,
                }
            }
        }, status=200)
    
    @action(detail=True, methods=['post'], url_path='vehicle-return-update-inspection-expiry', permission_classes=[IsAuthenticated])
    def vehicle_return_update_inspection_expiry(self, request, pk=None):
        """
        ✨ NEW 18/03/2026 - API 6.8: Update Inspection Expiry
        POST /api/orders/{id}/vehicle-return-update-inspection-expiry/
        
        Request: { inspection_expiry_date }
        Cập nhật ngày hết hạn đăng kiểm TRƯỚC khi hoàn tất biên bản
        """
        # 1. Kiểm tra quyền
        user = request.user
        if not hasattr(user, 'staff_profile'):
            return Response({
                'success': False,
                'error': 'Chỉ nhân viên mới có quyền cập nhật'
            }, status=403)
        
        staff = user.staff_profile
        order = self.get_object()
        
        # 2. Validate serializer
        serializer = VehicleReturnUpdateInspectionExpirySerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=400)
        
        inspection_expiry_date = serializer.validated_data['inspection_expiry_date']
        
        # 3. Kiểm tra biên bản trả xe đã tồn tại chưa
        if not hasattr(order, 'return_log'):
            return Response({
                'success': False,
                'error': 'Chưa khởi tạo biên bản trả xe. Vui lòng gọi API Initialize trước.',
                'message': 'Biên bản trả xe chưa tồn tại'
            }, status=400)
        
        return_log = order.return_log
        
        # 4. Cập nhật Vehicle.next_inspection_date (field có sẵn trong DB)
        vehicle = order.vehicle
        old_expiry = vehicle.next_inspection_date
        vehicle.next_inspection_date = inspection_expiry_date
        vehicle.save()
        
        # 5. Lưu snapshot vào VehicleReturnLog.certificate_expiry_date (field có sẵn trong DB)
        return_log.certificate_expiry_date = inspection_expiry_date
        return_log.status = 'inspection_expiry_updated'
        return_log.save()
        
        # 6. Return response
        return Response({
            'success': True,
            'message': 'Đã cập nhật ngày hết hạn đăng kiểm',
            'vehicle': {
                'id': vehicle.id,
                'license_plate': vehicle.license_plate,
                'next_inspection_date': str(vehicle.next_inspection_date),
                'old_inspection_date': str(old_expiry) if old_expiry else None,
                'updated_at': vehicle.updated_at
            },
            'return_log': {
                'id': return_log.id,
                'status': return_log.status,
                'certificate_expiry_date': str(return_log.certificate_expiry_date) if return_log.certificate_expiry_date else None
            }
        }, status=200)
    
    @action(detail=True, methods=['post'], url_path='vehicle-return-finalize', permission_classes=[IsAuthenticated])
    def vehicle_return_finalize(self, request, pk=None):
        """
        API #4: Finalize - Hoàn tất biên bản TRẢ XE
        POST /api/orders/{id}/vehicle-return-finalize/
        """
        # 1. Kiểm tra quyền
        user = request.user
        if not hasattr(user, 'staff_profile'):
            return Response({'error': 'Chỉ nhân viên mới có quyền trả xe'}, status=403)
        
        staff = user.staff_profile
        order = self.get_object()
        
        # 2. Kiểm tra biên bản
        try:
            return_log = order.return_log
        except VehicleReturnLog.DoesNotExist:
            return Response({
                'error': 'Chưa có biên bản trả xe. Vui lòng gọi initialize trước'
            }, status=404)
        
        # 3. Kiểm tra Order status (phải vehicle_returned)
        if order.status != 'vehicle_returned':
            return Response({
                'error': f'Order phải ở trạng thái vehicle_returned. Hiện tại: {order.status}'
            }, status=400)
        
        # 4. Kiểm tra status của biên bản (phải đã qua condition_checked)
        if return_log.status not in ['condition_checked', 'completed']:
            return Response({
                'error': f'Biên bản phải ở trạng thái condition_checked. Hiện tại: {return_log.status}'
            }, status=400)
        
        # 5. Validate data
        serializer = VehicleReturnFinalizeSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        
        # 6. Cập nhật 11 giấy tờ + ghi chú + chữ ký (UPDATED 10/03/2026)
        data = serializer.validated_data
        
        # NHÓM A: Giấy đăng ký xe (2 fields)
        if data.get('vehicle_registration_url'):
            return_log.vehicle_registration_url = data['vehicle_registration_url']
        if data.get('registration_number'):
            return_log.registration_number = data['registration_number']
        
        # NHÓM B: Tem đăng kiểm (3 fields)
        if data.get('stamp_url'):
            return_log.stamp_url = data['stamp_url']
        if data.get('stamp_number'):
            return_log.stamp_number = data['stamp_number']
        if data.get('stamp_expiry_date'):
            return_log.stamp_expiry_date = data['stamp_expiry_date']
        
        # NHÓM C: Các giấy tờ khác (1 field - JSON array)
        if data.get('other_documents_urls'):
            return_log.other_documents_urls = data['other_documents_urls']
        
        # NHÓM D: Biên lai (2 fields)
        if data.get('receipt_url'):
            return_log.receipt_url = data['receipt_url']
        if data.get('receipt_number'):
            return_log.receipt_number = data['receipt_number']
        
        # NHÓM E: Giấy chứng nhận kiểm định (3 fields)
        if data.get('inspection_certificate_url'):
            return_log.inspection_certificate_url = data['inspection_certificate_url']
        if data.get('certificate_number'):
            return_log.certificate_number = data['certificate_number']
        if data.get('certificate_expiry_date'):
            return_log.certificate_expiry_date = data['certificate_expiry_date']
        
        # NHÓM F: Ghi chú (1 field)
        if data.get('additional_notes'):
            return_log.additional_notes = data['additional_notes']
        
        # NHÓM G: Chữ ký khách hàng (1 field)
        if data.get('customer_signature'):
            return_log.customer_signature = data['customer_signature']
            return_log.customer_confirmed = True
        
        # ⭐⭐ NEW (10/03/2026): NHÓM H - Bảng 9 hạng mục checklist
        handover_checklist = request.data.get('handover_checklist')
        if handover_checklist:
            if not isinstance(handover_checklist, dict):
                return Response({
                    'error': 'handover_checklist phải là object (dictionary)'
                }, status=400)
            
            # Validate structure (optional - có thể bỏ nếu muốn linh hoạt)
            expected_keys = ['scratches', 'tires', 'brakes', 'battery', 'carpet', 
                             'inspection', 'insurance', 'smoke', 'lights']
            
            for key in expected_keys:
                if key in handover_checklist:
                    item = handover_checklist[key]
                    if not isinstance(item, dict):
                        return Response({
                            'error': f'handover_checklist.{key} phải là object'
                        }, status=400)
                    
                    # Validate fields (optional)
                    required_item_fields = ['notPassed', 'passed', 'quantity', 'note']
                    for item_field in required_item_fields:
                        if item_field not in item:
                            return Response({
                                'error': f'handover_checklist.{key} thiếu field: {item_field}'
                            }, status=400)
            
            # Lưu vào DB
            return_log.handover_checklist = handover_checklist
        
        # 8. Update status → completed
        return_log.status = 'completed'
        return_log.completed_at = timezone.now()
        return_log.save()
        
        # 9. Update Order status → completed (QUAN TRỌNG)
        order.status = 'completed'
        order.completed_at = timezone.now()
        order.save()
        
        # 10. Return response
        response_data = {
            'success': True,
            'message': 'Đã hoàn tất biên bản trả xe',
            'return_log': VehicleReturnLogSerializer(return_log).data,
            'order': {
                'id': order.id,
                'order_code': order.order_code,
                'status': order.status,
                'completed_at': order.completed_at
            }
        }
        
        return Response(response_data, status=200)
    
    # ===== ✅✅ NEW - NESTED ACTION FOR ADDITIONAL COSTS (10/03/2026) =====
    
    @action(detail=True, methods=['post'], url_path='vehicle-return-additional-costs', permission_classes=[IsAuthenticated])
    def create_vehicle_return_cost(self, request, pk=None):
        """
        ⭐ API #5 NESTED: Tạo chi phí phát sinh cho đơn hàng
        POST /api/orders/{order_id}/vehicle-return-additional-costs/
        
        Tự động gán order từ URL path, KHÔNG CẦN truyền order trong body
        
        Request body:
        {
            "cost_type": "repair",
            "cost_name": "Sửa đèn pha",
            "description": "Thay bóng đèn bị vỡ",
            "amount": 150000,
            "photo_url": "https://...",  // optional
            "notes": "Khách đồng ý"  // optional
        }
        
        Response: VehicleReturnAdditionalCost object
        """
        # 1. Kiểm tra quyền - Chỉ staff
        user = request.user
        if not hasattr(user, 'staff_profile'):
            return Response({'error': 'Chỉ nhân viên mới có quyền tạo chi phí phát sinh'}, status=403)
        
        # 2. Lấy Order
        order = self.get_object()
        
        # 3. Kiểm tra xem có biên bản trả xe chưa
        try:
            return_log = order.return_log
        except VehicleReturnLog.DoesNotExist:
            return Response({
                'error': 'Chưa có biên bản trả xe. Vui lòng khởi tạo biên bản trước (API #1 Initialize)'
            }, status=404)
        
        # 4. Validate data
        serializer = VehicleReturnAdditionalCostSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        
        # 5. Tạo chi phí - TỰ ĐỘNG GÁN order & return_log từ URL
        cost = serializer.save(
            order=order,
            return_log=return_log
        )
        
        # 6. Response
        return Response({
            'success': True,
            'message': f'Đã tạo chi phí phát sinh: {cost.cost_name}',
            'cost': VehicleReturnAdditionalCostSerializer(cost).data
        }, status=201)
    
    # ========================================
    # 🚗 DRIVER LOCATION TRACKING APIs (13/03/2026)
    # ========================================
    
    @action(detail=True, methods=['post'], url_path='update-driver-location', permission_classes=[IsAuthenticated])
    def update_driver_location(self, request, pk=None):
        """
        API: Tài xế cập nhật vị trí real-time
        POST /api/staff/orders/{order_id}/update-driver-location/
        
        Body: {
            "latitude": 13.776489,
            "longitude": 109.223688,
            "accuracy": 5.2  # optional
        }
        
        Response: {
            "success": true,
            "message": "Đã cập nhật vị trí",
            "driver_location": {...},
            "distance_to_pickup_km": 2.5,
            "estimated_arrival_minutes": 8
        }
        
        AUTHENTICATION: Token (Driver only)
        ROLE: DRIVER
        """
        from .utils import calculate_distance, calculate_eta
        from django.core.cache import cache
        
        # ===== 1. AUTHENTICATION & AUTHORIZATION =====
        
        # Check user is staff
        if not hasattr(request.user, 'staff_profile'):
            return Response({
                'success': False,
                'error': 'Chỉ nhân viên mới được truy cập API này'
            }, status=403)
        
        staff = request.user.staff_profile
        
        # Check staff role is DRIVER
        if staff.role.code != 'DRIVER':
            return Response({
                'success': False,
                'error': 'Chỉ tài xế mới được cập nhật vị trí'
            }, status=403)
        
        # ===== 2. GET ORDER & VALIDATE =====
        
        try:
            order = self.get_object()
        except Order.DoesNotExist:
            return Response({
                'success': False,
                'error': 'Đơn hàng không tồn tại'
            }, status=404)
        
        # Check staff ownership (phải là tài xế của đơn này)
        if order.assigned_staff != staff:
            return Response({
                'success': False,
                'error': 'Bạn không phải tài xế của đơn này'
            }, status=403)
        
        # Check order status (chỉ tracking khi assigned/in_progress)
        TRACKABLE_STATUSES = ['assigned', 'in_progress']
        if order.status not in TRACKABLE_STATUSES:
            return Response({
                'success': False,
                'error': f'Không thể tracking đơn hàng ở trạng thái "{order.status}"',
                'allowed_statuses': TRACKABLE_STATUSES
            }, status=400)
        
        # ===== 3. RATE LIMITING (tránh spam) =====
        
        # Cho phép tối đa 1 update / 3 giây
        cache_key = f"driver_location_update_{staff.id}_{order.id}"
        last_update = cache.get(cache_key)
        
        if last_update:
            from datetime import datetime
            time_since_last = (timezone.now() - last_update).total_seconds()
            if time_since_last < 3:
                return Response({
                    'success': False,
                    'error': f'Vui lòng đợi {int(3 - time_since_last)} giây trước khi cập nhật lại',
                    'rate_limit': '1 request / 3 seconds'
                }, status=429)
        
        # ===== 4. VALIDATE REQUEST DATA =====
        
        serializer = UpdateDriverLocationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=400)
        
        data = serializer.validated_data
        latitude = data['latitude']
        longitude = data['longitude']
        accuracy = data.get('accuracy')
        accuracy_warning = data.get('_accuracy_warning')
        
        # ===== 5. UPDATE DATABASE =====
        
        # Sử dụng update() thay vì save() để tối ưu performance
        Order.objects.filter(id=order.id).update(
            driver_current_lat=latitude,
            driver_current_lng=longitude,
            driver_location_updated_at=timezone.now()
        )
        
        # Refresh object để lấy giá trị mới
        order.refresh_from_db()
        
        # Set cache để rate limit
        cache.set(cache_key, timezone.now(), 60)  # Cache 1 phút
        
        # ===== 6. CALCULATE DISTANCE & ETA =====
        
        distance_km = None
        eta_minutes = None
        
        if order.pickup_lat and order.pickup_lng:
            # Tính khoảng cách đến điểm nhận xe
            distance_km = calculate_distance(
                float(latitude),
                float(longitude),
                float(order.pickup_lat),
                float(order.pickup_lng)
            )
            
            if distance_km:
                # Tính ETA (tốc độ trung bình 30 km/h trong thành phố)
                eta_minutes = calculate_eta(distance_km, average_speed_kmh=30)
        
        # ===== 7. BUILD RESPONSE =====
        
        response_data = {
            'success': True,
            'message': 'Đã cập nhật vị trí',
            'order_code': order.order_code,
            'driver_location': {
                'latitude': float(latitude),
                'longitude': float(longitude),
                'accuracy': accuracy,
                'updated_at': order.driver_location_updated_at.isoformat() if order.driver_location_updated_at else None
            }
        }
        
        # Thêm pickup location nếu có
        if order.pickup_lat and order.pickup_lng:
            response_data['pickup_location'] = {
                'address': order.pickup_address,
                'latitude': float(order.pickup_lat),
                'longitude': float(order.pickup_lng)
            }
        
        # Thêm tracking info nếu tính được
        if distance_km is not None:
            response_data['tracking_info'] = {
                'distance_to_pickup_km': round(distance_km, 2),
                'estimated_arrival_minutes': eta_minutes
            }
        
        # Thêm warning nếu có (GPS signal yếu)
        if accuracy_warning:
            response_data['warning'] = accuracy_warning
        
        return Response(response_data, status=200)
    
    @action(detail=True, methods=['get'], url_path='driver-location', permission_classes=[IsAuthenticated])
    def get_driver_location(self, request, pk=None):
        """
        API: Customer/Staff xem vị trí tài xế
        GET /api/customers/orders/{order_id}/driver-location/
        GET /api/staff/orders/{order_id}/driver-location/
        
        Response: {
            "success": true,
            "data": {
                "order_code": "DK20260313XYZ456",
                "driver": {...},
                "driver_location": {...},
                "pickup_location": {...},
                "station_location": {...},
                "tracking_info": {...}
            }
        }
        
        AUTHENTICATION: Token (Customer/Staff)
        PERMISSIONS:
            - Customer: chỉ xem đơn của mình
            - Staff: xem tất cả đơn
        """
        from .utils import calculate_distance, calculate_eta
        from django.core.cache import cache
        
        # ===== 1. GET ORDER =====
        
        try:
            order = self.get_object()
        except Order.DoesNotExist:
            return Response({
                'success': False,
                'error': 'Đơn hàng không tồn tại'
            }, status=404)
        
        # ===== 2. PERMISSION CHECK =====
        
        # Customer: chỉ được xem đơn của mình
        if hasattr(request.user, 'customer_profile'):
            if order.customer != request.user.customer_profile:
                return Response({
                    'success': False,
                    'error': 'Bạn không có quyền xem đơn này'
                }, status=403)
        
        # Staff: xem tất cả (không cần check)
        # Admin: xem tất cả (không cần check)
        
        # ===== 3. CHECK DRIVER LOCATION EXISTS =====
        
        if not order.driver_current_lat or not order.driver_current_lng:
            # Chưa có vị trí tài xế → Trả về thông tin cơ bản
            return Response({
                'success': True,
                'data': {
                    'order_code': order.order_code,
                    'driver_location': None,
                    'message': 'Tài xế chưa bắt đầu di chuyển',
                    'station_location': {
                        'name': order.station.station_name,
                        'address': order.station.address,
                        'latitude': float(order.station.latitude) if order.station.latitude else None,
                        'longitude': float(order.station.longitude) if order.station.longitude else None
                    }
                }
            }, status=200)
        
        # ===== 4. BUILD RESPONSE WITH FULL DATA =====
        
        # Check cache first (10 seconds)
        cache_key = f"driver_location_view_{order.id}"
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response({
                'success': True,
                'data': cached_data,
                '_cached': True
            }, status=200)
        
        # ===== Build response data =====
        
        response_data = {
            'order_code': order.order_code,
            'order_status': order.status
        }
        
        # Driver info
        if order.assigned_staff:
            response_data['driver'] = {
                'id': order.assigned_staff.id,
                'name': order.assigned_staff.full_name,
                'phone': order.assigned_staff.phone,
                'employee_code': order.assigned_staff.employee_code,
                'avatar_url': order.assigned_staff.avatar_url
            }
        else:
            response_data['driver'] = None
        
        # Driver location (with last update time)
        seconds_ago = None
        if order.driver_location_updated_at:
            seconds_ago = int((timezone.now() - order.driver_location_updated_at).total_seconds())
        
        response_data['driver_location'] = {
            'latitude': float(order.driver_current_lat),
            'longitude': float(order.driver_current_lng),
            'updated_at': order.driver_location_updated_at.isoformat() if order.driver_location_updated_at else None,
            'last_update_seconds_ago': seconds_ago
        }
        
        # Pickup location (nơi lấy xe)
        if order.pickup_lat and order.pickup_lng:
            response_data['pickup_location'] = {
                'address': order.pickup_address,
                'latitude': float(order.pickup_lat),
                'longitude': float(order.pickup_lng)
            }
        else:
            response_data['pickup_location'] = None
        
        # Station location (trạm đăng kiểm)
        response_data['station_location'] = {
            'name': order.station.station_name,
            'code': order.station.station_code,
            'address': order.station.address,
            'phone': order.station.phone,
            'latitude': float(order.station.latitude) if order.station.latitude else None,
            'longitude': float(order.station.longitude) if order.station.longitude else None
        }
        
        # Tracking info (distance & ETA)
        if order.pickup_lat and order.pickup_lng:
            distance_km = calculate_distance(
                float(order.driver_current_lat),
                float(order.driver_current_lng),
                float(order.pickup_lat),
                float(order.pickup_lng)
            )
            
            if distance_km:
                eta_minutes = calculate_eta(distance_km, average_speed_kmh=30)
                response_data['tracking_info'] = {
                    'distance_to_pickup_km': round(distance_km, 2),
                    'estimated_arrival_minutes': eta_minutes,
                    'status': 'on_the_way' if distance_km > 0.1 else 'arrived'
                }
            else:
                response_data['tracking_info'] = None
        else:
            response_data['tracking_info'] = None
        
        # Cache 10 seconds
        cache.set(cache_key, response_data, 10)
        
        return Response({
            'success': True,
            'data': response_data
        }, status=200)

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def pricing(self, request, pk=None):
        """
        GET /api/orders/{order_id}/pricing/
        Lấy thông tin bảng giá áp dụng cho đơn hàng này

        Logic:
        - Lấy vehicle_type từ order.vehicle.vehicle_type
        - Tìm pricing active cho vehicle_type đó
        - Trả về pricing info hoặc null nếu không tìm thấy

        Response:
        {
            "order_code": "DK20260320ABC123",
            "vehicle_type": {
                "id": 2,
                "type_name": "Xe du lịch"
            },
            "pricing": {
                "id": 1,
                "inspection_fee": "200000.00",
                "service_fee": "100000.00",
                "registration_fee": "50000.00",
                "total_amount": "350000.00",
                "effective_from": "2026-03-01",
                "effective_to": null,
                "status": "active"
            } | null
        }
        """
        order = self.get_object()

        # Lấy vehicle_type từ order
        vehicle_type = order.vehicle.vehicle_type

        # Tìm pricing active cho vehicle_type này
        try:
            pricing = Pricing.objects.filter(
                vehicle_type=vehicle_type,
                status='active'
            ).first()

            pricing_data = None
            if pricing:
                pricing_data = {
                    'id': pricing.id,
                    'inspection_fee': str(pricing.inspection_fee),
                    'service_fee': str(pricing.service_fee),
                    'registration_fee': str(pricing.registration_fee),
                    'total_amount': str(pricing.total_amount),
                    'effective_from': pricing.effective_from.isoformat() if pricing.effective_from else None,
                    'effective_to': pricing.effective_to.isoformat() if pricing.effective_to else None,
                    'status': pricing.status
                }

            return Response({
                'order_code': order.order_code,
                'vehicle_type': {
                    'id': vehicle_type.id,
                    'type_name': vehicle_type.type_name
                },
                'pricing': pricing_data
            })

        except Exception as e:
            return Response({
                'error': f'Lỗi khi lấy pricing: {str(e)}'
            }, status=500)


class ChecklistItemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ChecklistItem.objects.filter(status='active')
    serializer_class = ChecklistItemSerializer
    permission_classes = [AllowAny]


class OrderChecklistViewSet(viewsets.ModelViewSet):
    queryset = OrderChecklist.objects.all()
    serializer_class = OrderChecklistSerializer
    permission_classes = [IsAuthenticated]


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        # Admin/Staff: xem tất cả
        if user.is_superuser or hasattr(user, 'staff_profile'):
            return Payment.objects.all()
        
        # Customer: chỉ xem payment của mình
        if hasattr(user, 'customer_profile'):
            return Payment.objects.filter(order__customer=user.customer_profile)
        
        return Payment.objects.none()


class TimeSlotViewSet(viewsets.ModelViewSet):
    """
    ViewSet cho TimeSlot (Khung giờ làm việc)
    
    APIs:
    - GET /api/time-slots/                    - Lấy tất cả khung giờ
    - GET /api/time-slots/?station=1          - Lấy khung giờ của trạm
    - GET /api/time-slots/?date=2026-03-15    - Lấy khung giờ cho ngày cụ thể (có available_capacity)
    - GET /api/time-slots/available/          - Lấy khung giờ còn trống
    - POST /api/time-slots/                   - Tạo khung giờ mới (Admin only)
    - PUT /api/time-slots/{id}/               - Cập nhật khung giờ (Admin only)
    - DELETE /api/time-slots/{id}/            - Xóa khung giờ (Admin only)
    """
    queryset = TimeSlot.objects.all()
    serializer_class = TimeSlotSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Filter time slots theo query params
        """
        queryset = TimeSlot.objects.all()
        
        # Filter theo station
        station_id = self.request.query_params.get('station')
        if station_id:
            queryset = queryset.filter(station_id=station_id)
        
        # Filter theo is_active
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        # Filter theo day_of_week
        day_of_week = self.request.query_params.get('day_of_week')
        if day_of_week:
            queryset = queryset.filter(day_of_week__in=['all', day_of_week])
        
        return queryset
    
    def get_permissions(self):
        """
        Admin mới được create/update/delete
        Customer/Staff chỉ được xem (GET)
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticated()]
    
    @action(detail=False, methods=['get'])
    def available(self, request):
        """
        GET /api/time-slots/available/?station=1&date=2026-03-15
        
        Lấy danh sách khung giờ còn trống cho ngày cụ thể
        """
        from datetime import datetime, date
        
        station_id = request.query_params.get('station')
        date_str = request.query_params.get('date')
        
        if not station_id:
            return Response({
                'error': 'Thiếu param station'
            }, status=400)
        
        if not date_str:
            return Response({
                'error': 'Thiếu param date (YYYY-MM-DD)'
            }, status=400)
        
        # Parse date
        try:
            target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response({
                'error': 'Format date không hợp lệ. Sử dụng: YYYY-MM-DD'
            }, status=400)
        
        # Validate date không quá khứ
        if target_date < date.today():
            return Response({
                'error': 'Không thể đặt lịch cho ngày trong quá khứ'
            }, status=400)
        
        # Lấy day_of_week
        weekday_map = {
            0: 'monday',
            1: 'tuesday',
            2: 'wednesday',
            3: 'thursday',
            4: 'friday',
            5: 'saturday',
            6: 'sunday'
        }
        day_of_week = weekday_map[target_date.weekday()]
        
        # Query time slots
        time_slots = TimeSlot.objects.filter(
            station_id=station_id,
            is_active=True,
            day_of_week__in=['all', day_of_week]
        ).order_by('display_order', 'time_slot')
        
        # Filter chỉ lấy slots còn chỗ
        available_slots = [
            slot for slot in time_slots 
            if slot.get_available_capacity(target_date) > 0
        ]
        
        serializer = self.get_serializer(available_slots, many=True)
        
        return Response({
            'station_id': int(station_id),
            'date': date_str,
            'day_of_week': day_of_week,
            'total_slots': len(available_slots),
            'time_slots': serializer.data
        })
    
    @action(detail=False, methods=['post'], permission_classes=[IsAdminUser])
    def bulk_create(self, request):
        """
        POST /api/time-slots/bulk-create/
        
        Tạo nhiều time slots cùng lúc cho 1 trạm
        
        Body: {
            "station": 1,
            "time_slots": ["08:00", "09:00", "10:00", "11:00"],
            "day_of_week": "all",
            "max_capacity": 5
        }
        """
        station_id = request.data.get('station')
        time_slots_list = request.data.get('time_slots', [])
        day_of_week = request.data.get('day_of_week', 'all')
        max_capacity = request.data.get('max_capacity', 5)
        
        if not station_id or not time_slots_list:
            return Response({
                'error': 'Thiếu station hoặc time_slots'
            }, status=400)
        
        # Validate station exists
        try:
            station = Station.objects.get(id=station_id)
        except Station.DoesNotExist:
            return Response({
                'error': f'Station ID {station_id} không tồn tại'
            }, status=404)
        
        created_slots = []
        errors = []
        
        for idx, time_str in enumerate(time_slots_list):
            try:
                from datetime import datetime
                time_obj = datetime.strptime(time_str, '%H:%M').time()
                
                # Tạo hoặc update
                slot, created = TimeSlot.objects.get_or_create(
                    station=station,
                    time_slot=time_obj,
                    day_of_week=day_of_week,
                    defaults={
                        'max_capacity': max_capacity,
                        'display_order': idx,
                        'is_active': True
                    }
                )
                
                if not created:
                    # Nếu đã tồn tại, update
                    slot.max_capacity = max_capacity
                    slot.display_order = idx
                    slot.is_active = True
                    slot.save()
                
                created_slots.append(slot)
                
            except ValueError as e:
                errors.append(f'{time_str}: Format không hợp lệ (HH:MM)')
            except Exception as e:
                errors.append(f'{time_str}: {str(e)}')
        
        serializer = self.get_serializer(created_slots, many=True)
        
        return Response({
            'success': True,
            'created_count': len(created_slots),
            'time_slots': serializer.data,
            'errors': errors if errors else None
        })


class RatingViewSet(viewsets.ModelViewSet):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticated]
    
    # ✅ NEW - Filter & Search support
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['customer', 'staff', 'order', 'status', 'overall_rating']
    ordering_fields = ['created_at', 'overall_rating', 'updated_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Filter ratings based on user role"""
        user = self.request.user
        
        # Admin: xem tất cả
        if user.is_superuser:
            return Rating.objects.all()
        
        # Staff: xem ratings của mình
        if hasattr(user, 'staff_profile'):
            return Rating.objects.filter(staff=user.staff_profile)
        
        # Customer: xem ratings của mình
        if hasattr(user, 'customer_profile'):
            return Rating.objects.filter(customer=user.customer_profile)
        
        return Rating.objects.none()
    
    def perform_create(self, serializer):
        # Tự động set customer
        if hasattr(self.request.user, 'customer_profile'):
            serializer.save(customer=self.request.user.customer_profile)
        else:
            serializer.save()
    
    # ✅ NEW - Custom action: Ratings của nhân viên
    @action(methods=['get'], detail=False, url_path='by-staff/(?P<staff_id>[^/.]+)')
    def by_staff(self, request, staff_id=None):
        """
        GET /api/ratings/by-staff/2/
        Lấy tất cả ratings của 1 nhân viên
        """
        from django.db.models import Avg
        
        ratings = Rating.objects.filter(staff_id=staff_id, status='approved')
        serializer = self.get_serializer(ratings, many=True)
        
        # Tính trung bình
        avg_overall = ratings.aggregate(Avg('overall_rating'))['overall_rating__avg'] or 0
        avg_service = ratings.aggregate(Avg('service_rating'))['service_rating__avg'] or 0
        avg_staff = ratings.aggregate(Avg('staff_rating'))['staff_rating__avg'] or 0
        
        return Response({
            'staff_id': staff_id,
            'count': ratings.count(),
            'average_overall': round(avg_overall, 2),
            'average_service': round(avg_service, 2),
            'average_staff': round(avg_staff, 2),
            'ratings': serializer.data
        })
    
    # ✅ NEW - Custom action: Ratings của customer hiện tại
    @action(methods=['get'], detail=False, url_path='my-ratings')
    def my_ratings(self, request):
        """
        GET /api/ratings/my-ratings/
        Lấy tất cả ratings của customer hiện tại
        """
        if not hasattr(request.user, 'customer_profile'):
            return Response({'error': 'User không phải customer'}, status=403)
        
        customer = request.user.customer_profile
        ratings = Rating.objects.filter(customer=customer)
        serializer = self.get_serializer(ratings, many=True)
        
        return Response({
            'count': ratings.count(),
            'ratings': serializer.data
        })


# ========================================
# ✅✅ NEW API - UPLOAD ẢNH (08/03/2026)
# ========================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_image(request):
    """
    Upload ảnh cho quy trình nhận xe
    
    POST /api/upload-image/
    Content-Type: multipart/form-data
    
    Body (form-data):
    - image: file (required)
    - category: 'vehicle' | 'document' | 'signature' (optional)
    
    Response: {
        "success": true,
        "url": "https://example.com/image123.jpg",
        "filename": "image123.jpg",
        "size": 12345
    }
    
    NOTE: Hiện tại đang dùng mock URL. Trong production, cần tích hợp:
    - AWS S3, Azure Blob Storage, Google Cloud Storage
    - Hoặc lưu local trong MEDIA_ROOT
    """
    if 'image' not in request.FILES:
        return Response({
            'success': False,
            'error': 'Thiếu file ảnh. Vui lòng upload file với key "image"'
        }, status=400)
    
    uploaded_file = request.FILES['image']
    category = request.data.get('category', 'vehicle')
    
    # Validate file type
    allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if uploaded_file.content_type not in allowed_types:
        return Response({
            'success': False,
            'error': f'File type không hợp lệ. Cho phép: {", ".join(allowed_types)}'
        }, status=400)
    
    # Validate file size (max 5MB)
    max_size = 5 * 1024 * 1024  # 5MB
    if uploaded_file.size > max_size:
        return Response({
            'success': False,
            'error': 'File quá lớn. Kích thước tối đa 5MB'
        }, status=400)
    
    # TODO: PRODUCTION - Upload to S3/Cloud Storage
    # Example with boto3:
    # s3_client = boto3.client('s3')
    # file_key = f"{category}/{uuid.uuid4()}.{extension}"
    # s3_client.upload_fileobj(uploaded_file, BUCKET_NAME, file_key)
    # file_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{file_key}"
    
    # MOCK: Generate mock URL for development
    import uuid
    extension = uploaded_file.name.split('.')[-1]
    mock_filename = f"{category}_{uuid.uuid4().hex[:8]}.{extension}"
    mock_url = f"https://storage.dangkiem.vn/uploads/{category}/{mock_filename}"
    
    return Response({
        'success': True,
        'url': mock_url,
        'filename': mock_filename,
        'original_filename': uploaded_file.name,
        'size': uploaded_file.size,
        'content_type': uploaded_file.content_type,
        'category': category,
        'message': '⚠️ MOCK URL - Cần tích hợp cloud storage trong production'
    }, status=200)


# ========================================
# ✅✅ NEW API - VEHICLE RETURN ADDITIONAL COSTS (10/03/2026)
# ========================================

class VehicleReturnAdditionalCostViewSet(viewsets.ModelViewSet):
    """
    API CRUD cho Chi phí phát sinh khi TRẢ XE
    
    Endpoints:
    - GET    /api/vehicle-return-additional-costs/                  → List all
    - GET    /api/vehicle-return-additional-costs/?return_log=1     → Filter by return_log
    - GET    /api/vehicle-return-additional-costs/?order=123        → Filter by order
    - POST   /api/vehicle-return-additional-costs/                  → Create new
    - GET    /api/vehicle-return-additional-costs/{id}/             → Retrieve
    - PUT    /api/vehicle-return-additional-costs/{id}/             → Update
    - PATCH  /api/vehicle-return-additional-costs/{id}/             → Partial update
    - DELETE /api/vehicle-return-additional-costs/{id}/             → Delete
    """
    queryset = VehicleReturnAdditionalCost.objects.all()
    serializer_class = VehicleReturnAdditionalCostSerializer
    permission_classes = [IsAuthenticated]
    
    # Filter & Search support
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['return_log', 'order', 'cost_type', 'is_approved', 'is_required', 'created_by']
    search_fields = ['cost_name', 'description', 'order__order_code']
    ordering_fields = ['created_at', 'amount', 'is_approved']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Filter costs based on user role"""
        user = self.request.user
        
        # Admin: xem tất cả
        if user.is_superuser:
            return VehicleReturnAdditionalCost.objects.all()
        
        # ✅ Staff: XEM TẤT CẢ (để xử lý payment cho khách hàng)
        # Staff cần xem được mọi cost để xử lý thanh toán khi trả xe
        if hasattr(user, 'staff_profile'):
            return VehicleReturnAdditionalCost.objects.all()
        
        # Customer: chỉ xem costs của orders họ tạo
        if hasattr(user, 'customer_profile'):
            customer = user.customer_profile
            return VehicleReturnAdditionalCost.objects.filter(order__customer=customer)
        
        return VehicleReturnAdditionalCost.objects.none()
    
    def perform_create(self, serializer):
        """Tự động set created_by khi tạo mới"""
        if hasattr(self.request.user, 'staff_profile'):
            serializer.save(created_by=self.request.user.staff_profile)
        else:
            serializer.save()
    
    @action(methods=['post'], detail=True, url_path='approve')
    def approve(self, request, pk=None):
        """
        POST /api/vehicle-return-additional-costs/{id}/approve/
        Approve chi phí phát sinh
        """
        cost = self.get_object()
        cost.is_approved = True
        cost.approved_at = timezone.now()
        cost.save()
        
        serializer = self.get_serializer(cost)
        return Response({
            'success': True,
            'message': 'Đã phê duyệt chi phí',
            'cost': serializer.data
        })
    
    @action(methods=['get'], detail=False, url_path='by-return-log/(?P<return_log_id>[^/.]+)')
    def by_return_log(self, request, return_log_id=None):
        """
        GET /api/vehicle-return-additional-costs/by-return-log/1/
        Lấy tất cả chi phí của 1 biên bản trả xe + tổng tiền
        """
        from django.db.models import Sum
        
        costs = self.get_queryset().filter(return_log_id=return_log_id)
        serializer = self.get_serializer(costs, many=True)
        
        # Tính tổng tiền (chỉ tính đã approved)
        total_approved = costs.filter(is_approved=True).aggregate(
            total=Sum('amount')
        )['total'] or 0
        
        total_all = costs.aggregate(total=Sum('amount'))['total'] or 0
        
        return Response({
            'return_log_id': return_log_id,
            'count': costs.count(),
            'total_amount': float(total_all),
            'total_approved_amount': float(total_approved),
            'costs': serializer.data
        })
    
    # ===== ✅✅ NEW - PAYMENT APIS (10/03/2026) =====
    
    @action(methods=['post'], detail=True, url_path='request-payment-qr')
    def request_payment_qr(self, request, pk=None):
        """
        POST /api/vehicle-return-additional-costs/{id}/request-payment-qr/
        
        Tạo mã QR VietQR cho khách quét thanh toán chi phí phát sinh
        
        Request body: {} (không cần)
        
        Response:
        {
            "success": true,
            "qr_code_url": "https://...",
            "qr_content": {...},
            "amount": 150000.00,
            "message": "Đã tạo mã QR thanh toán"
        }
        """
        cost = self.get_object()
        
        # Validate
        if cost.payment_status == 'paid':
            return Response({
                'success': False,
                'error': 'Chi phí này đã được thanh toán'
            }, status=400)
        
        # ✅ Generate QR code (Mock for now - TODO: integrate real VietQR API)
        import uuid
        import json
        
        # Generate QR content
        qr_content = {
            'bank_id': '970422',  # VCB
            'account_no': '1234567890',
            'account_name': 'TRAM DANG KIEM',
            'amount': float(cost.amount),
            'description': f'Thanh toan chi phi {cost.cost_name} - Don {cost.order.order_code}',
            'transaction_id': f'VPPS{uuid.uuid4().hex[:8].upper()}'
        }
        
        # Mock QR URL (VietQR format)
        mock_qr_url = f'https://img.vietqr.io/image/970422-1234567890-compact2.jpg?amount={int(cost.amount)}&addInfo={qr_content["description"]}'
        
        # Update cost
        cost.payment_method = 'qr'
        cost.payment_status = 'processing'
        cost.qr_code_url = mock_qr_url
        cost.qr_content = json.dumps(qr_content)
        cost.transaction_id = qr_content['transaction_id']
        cost.save()
        
        # ✅ TODO: Send notification to customer
        # - Create Notification record
        # - Send push notification via Firebase
        # - Send SMS if needed
        
        serializer = self.get_serializer(cost)
        
        return Response({
            'success': True,
            'qr_code_url': mock_qr_url,
            'qr_content': qr_content,
            'amount': float(cost.amount),
            'cost': serializer.data,
            'message': '✅ Đã tạo mã QR thanh toán. Khách hàng có thể quét mã để thanh toán.'
        })
    
    @action(methods=['post'], detail=True, url_path='confirm-cash-payment')
    def confirm_cash_payment(self, request, pk=None):
        """
        POST /api/vehicle-return-additional-costs/{id}/confirm-cash-payment/
        
        Xác nhận đã thu tiền mặt từ khách hàng
        
        Request body:
        {
            "payment_note": "Đã thu tiền mặt từ khách" (optional)
        }
        
        Response:
        {
            "success": true,
            "message": "Đã xác nhận thu tiền mặt",
            "cost": {...}
        }
        """
        cost = self.get_object()
        
        # Validate
        if cost.payment_status == 'paid':
            return Response({
                'success': False,
                'error': 'Chi phí này đã được thanh toán'
            }, status=400)
        
        # Update
        cost.payment_method = 'cash'
        cost.payment_status = 'paid'
        cost.paid_at = timezone.now()
        cost.payment_note = request.data.get('payment_note', 'Thanh toán tiền mặt')
        cost.save()
        
        serializer = self.get_serializer(cost)
        
        return Response({
            'success': True,
            'message': '✅ Đã xác nhận thu tiền mặt thành công',
            'cost': serializer.data
        })
    
    @action(methods=['get'], detail=True, url_path='payment-status')
    def payment_status(self, request, pk=None):
        """
        GET /api/vehicle-return-additional-costs/{id}/payment-status/
        
        Kiểm tra trạng thái thanh toán (dùng cho polling)
        
        Response:
        {
            "payment_status": "paid",
            "payment_method": "qr",
            "paid_at": "2026-03-10T14:30:00Z",
            "amount": 150000.00,
            "is_paid": true
        }
        """
        cost = self.get_object()
        
        return Response({
            'payment_status': cost.payment_status,
            'payment_method': cost.payment_method,
            'paid_at': cost.paid_at,
            'amount': float(cost.amount),
            'is_paid': cost.payment_status == 'paid',
            'transaction_id': cost.transaction_id
        })
    
    @action(methods=['post'], detail=False, url_path='batch-payment')
    def batch_payment(self, request):
        """
        POST /api/vehicle-return-additional-costs/batch-payment/
        
        Thanh toán hàng loạt nhiều chi phí cùng lúc
        
        Request body:
        {
            "cost_ids": [1, 2, 3],
            "payment_method": "qr" | "cash",
            "payment_note": "..." (optional)
        }
        
        Response:
        {
            "success": true,
            "total_amount": 450000.00,
            "qr_code_url": "...",  // nếu payment_method = 'qr'
            "costs": [...]
        }
        """
        from django.db.models import Sum
        import uuid
        import json
        
        cost_ids = request.data.get('cost_ids', [])
        payment_method = request.data.get('payment_method', 'cash')
        payment_note = request.data.get('payment_note', '')
        
        if not cost_ids:
            return Response({
                'success': False,
                'error': 'Vui lòng chọn ít nhất 1 chi phí'
            }, status=400)
        
        # Get costs
        costs = self.get_queryset().filter(id__in=cost_ids, payment_status='pending')
        
        if not costs.exists():
            return Response({
                'success': False,
                'error': 'Không tìm thấy chi phí hợp lệ chưa thanh toán'
            }, status=404)
        
        # Calculate total
        total_amount = costs.aggregate(total=Sum('amount'))['total'] or 0
        
        if payment_method == 'qr':
            # Generate QR for total amount
            qr_content = {
                'bank_id': '970422',
                'account_no': '1234567890',
                'account_name': 'TRAM DANG KIEM',
                'amount': float(total_amount),
                'description': f'Thanh toan {len(costs)} chi phi phat sinh',
                'transaction_id': f'BATCH{uuid.uuid4().hex[:8].upper()}'
            }
            
            mock_qr_url = f'https://img.vietqr.io/image/970422-1234567890-compact2.jpg?amount={int(total_amount)}&addInfo={qr_content["description"]}'
            
            # Update all costs
            for cost in costs:
                cost.payment_method = 'qr'
                cost.payment_status = 'processing'
                cost.qr_code_url = mock_qr_url
                cost.qr_content = json.dumps(qr_content)
                cost.transaction_id = qr_content['transaction_id']
                cost.save()
            
            serializer = self.get_serializer(costs, many=True)
            
            return Response({
                'success': True,
                'total_amount': float(total_amount),
                'qr_code_url': mock_qr_url,
                'qr_content': qr_content,
                'costs': serializer.data,
                'message': f'✅ Đã tạo mã QR thanh toán cho {len(costs)} chi phí'
            })
        
        else:  # cash
            # Update all costs as paid
            for cost in costs:
                cost.payment_method = 'cash'
                cost.payment_status = 'paid'
                cost.paid_at = timezone.now()
                cost.payment_note = payment_note or 'Thanh toán tiền mặt (hàng loạt)'
                cost.save()
            
            serializer = self.get_serializer(costs, many=True)
            
            return Response({
                'success': True,
                'total_amount': float(total_amount),
                'costs': serializer.data,
                'message': f'✅ Đã xác nhận thu tiền mặt {len(costs)} chi phí'
            })


# ========================================
# ✅✅ STAFF ASSIGNMENT AJAX ENDPOINTS (WRAPPER FUNCTIONS)
# ========================================

def get_staff_list_ajax(request):
    """
    Wrapper function cho Staff Assignment API
    GET /api/get-staff-list/
    """
    from django.http import JsonResponse
    
    try:
        # Lấy tất cả staff với role info
        staff_list = []
        for staff in Staff.objects.select_related('role').all():
            staff_list.append({
                'id': staff.id,
                'full_name': staff.full_name,
                'employee_code': staff.employee_code,
                'role_name': staff.role.name if staff.role else 'Nhân viên',
                'status': staff.status,
            })
        
        return JsonResponse({
            'success': True,
            'staff_list': staff_list
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


def assign_staff_ajax(request):
    """
    Wrapper function cho Staff Assignment API
    POST /api/assign-staff/
    Body: {order_id: int, staff_id: int}
    """
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


def random_assign_staff_ajax(request):
    """
    Wrapper function cho Random Staff Assignment API
    POST /api/random-assign-staff/
    Body: {order_id: int}
    """
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

