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
from django.http import HttpResponse
from django.urls import reverse
from django.conf import settings
from django.db.models import Q
from django.core.files.base import ContentFile
import os
import uuid
import json
import hmac
import hashlib
from io import BytesIO
from urllib.parse import quote
from PIL import Image
from payos import PayOS
from payos.types import CreatePaymentLinkRequest, ItemData
from .models import *
from .serializers import *
from .utils import render_contract_docx, convert_docx_bytes_to_pdf


def base64_to_file(base64_str, filename_prefix='signature'):
    """
    Convert base64 string to Django ContentFile for ImageField
    
    Args:
        base64_str: Base64 string (with or without data URI prefix)
        filename_prefix: Prefix for generated filename
    
    Returns:
        ContentFile object ready for ImageField
    """
    if not base64_str:
        return None
    
    # Remove data URI scheme if provided: data:image/png;base64,...
    if ',' in base64_str:
        base64_str = base64_str.split(',', 1)[1]
    
    # Remove whitespace/newlines
    base64_str = ''.join(base64_str.split())
    
    # Fix padding
    padding = len(base64_str) % 4
    if padding:
        base64_str += '=' * (4 - padding)
    
    # Decode from base64
    try:
        import base64
        image_bytes = base64.b64decode(base64_str)
    except Exception as e:
        raise ValueError(f"Failed to decode base64: {type(e).__name__}: {str(e)}")
    
    # Validate image data (basic check)
    if len(image_bytes) < 4:
        raise ValueError("Invalid image data")
    
    # Validate image bytes using Pillow and allow WEBP
    try:
        with Image.open(BytesIO(image_bytes)) as img:
            if img.format not in ('PNG', 'JPEG', 'WEBP'):
                raise ValueError(f"Unsupported image format: {img.format} (only PNG, JPEG, WEBP are accepted)")
            if img.format == 'WEBP':
                ext = 'webp'
            else:
                ext = 'jpg' if img.format == 'JPEG' else 'png'
    except Exception as e:
        raise ValueError(f"Invalid signature image data: {e}")

    # Generate unique filename
    filename = f"{filename_prefix}_{uuid.uuid4().hex[:8]}.{ext}"
    
    # Create ContentFile
    return ContentFile(image_bytes, name=filename)


def get_default_staff_signature_path():
    """Return the configured default staff signature image path if available."""
    configured_path = getattr(settings, 'DEFAULT_STAFF_SIGNATURE_PATH', None)
    if not configured_path:
        return None

    signature_path = os.fspath(configured_path)
    if os.path.exists(signature_path):
        return signature_path
    return None


ORDER_STATUS_LABELS = {
    'pending': 'Chờ xử lý',
    'confirmed': 'Đã xác nhận',
    'assigned': 'Đã phân công',
    'in_progress': 'Đang thực hiện',
    'vehicle_received': 'Đã nhận xe',
    'vehicle_returned': 'Đã trả xe',
    'completed': 'Hoàn thành',
    'cancelled': 'Đã hủy',
}

STAFF_NOTIFICATION_SETTING_DEFINITIONS = [
    {
        'id': 'admin-status-change',
        'title': 'Admin thay đổi trạng thái',
        'description': 'Nhận thông báo khi admin thay đổi trạng thái đơn hàng',
        'default_enabled': True,
    },
    {
        'id': 'new-order',
        'title': 'Đơn hàng mới',
        'description': 'Nhận thông báo khi có đơn hàng mới được phân công',
        'default_enabled': True,
    },
    {
        'id': 'order-update',
        'title': 'Cập nhật đơn hàng',
        'description': 'Nhận thông báo khi khách hàng thay đổi thông tin',
        'default_enabled': True,
    },
    {
        'id': 'customer-message',
        'title': 'Tin nhắn khách hàng',
        'description': 'Nhận thông báo khi có tin nhắn mới từ khách hàng',
        'default_enabled': True,
    },
    {
        'id': 'payment-received',
        'title': 'Thanh toán thành công',
        'description': 'Nhận thông báo khi khách hàng thanh toán',
        'default_enabled': True,
    },
    {
        'id': 'schedule-reminder',
        'title': 'Nhắc lịch hẹn',
        'description': 'Nhắc nhở trước 30 phút khi có lịch hẹn',
        'default_enabled': True,
    },
    {
        'id': 'rating-received',
        'title': 'Đánh giá mới',
        'description': 'Nhận thông báo khi khách hàng đánh giá dịch vụ',
        'default_enabled': True,
    },
]

STAFF_NOTIFICATION_SETTING_ID_SET = {
    item['id'] for item in STAFF_NOTIFICATION_SETTING_DEFINITIONS
}


def get_order_status_code(order):
    if order.status_id and getattr(order.status, 'status_code', None):
        return order.status.status_code
    return order.status_legacy


def get_order_status_label(order):
    if order.status_id and getattr(order.status, 'status_name', None):
        return order.status.status_name

    status_code = get_order_status_code(order)
    return ORDER_STATUS_LABELS.get(status_code, status_code or 'Không xác định')


def set_order_status(order, status_code):
    try:
        order.status = OrderStatus.objects.get(status_code=status_code)
    except OrderStatus.DoesNotExist:
        order.status = None
    order.status_legacy = status_code


def filter_orders_by_status(queryset, status_code):
    return queryset.filter(
        Q(status__status_code=status_code) |
        Q(status__isnull=True, status_legacy=status_code)
    )


def get_missing_required_images(order, stage):
    """
    Trả về danh sách requirement bắt buộc còn thiếu ảnh theo order + stage.
    Áp dụng cả requirement chung (vehicle_type null) và theo loại xe cụ thể.
    """
    vehicle_type = order.vehicle.vehicle_type if order.vehicle_id else None
    requirements_qs = InspectionImageRequirement.objects.filter(
        stage=stage,
        is_required=True,
        is_active=True,
    )

    if vehicle_type:
        requirements_qs = requirements_qs.filter(
            Q(vehicle_type__isnull=True) | Q(vehicle_type=vehicle_type)
        )
    else:
        requirements_qs = requirements_qs.filter(vehicle_type__isnull=True)

    required_items = list(requirements_qs)
    if not required_items:
        return []

    uploaded_requirement_ids = set(
        MediaFile.objects.filter(
            order=order,
            stage=stage,
            requirement__isnull=False,
        ).values_list('requirement_id', flat=True)
    )

    return [item for item in required_items if item.id not in uploaded_requirement_ids]


def get_latest_media_by_requirement(order, stage):
    """Return the latest uploaded media keyed by requirement name for an order/stage."""
    media_items = MediaFile.objects.filter(
        order=order,
        stage=stage,
        requirement__isnull=False,
    ).select_related('requirement').order_by('created_at', 'id')

    media_map = {}
    for item in media_items:
        media_map[item.requirement.name] = item
    return media_map


def sync_receipt_media_fields(receipt):
    """Backfill legacy receipt URL fields from media_files so older consumers still see URLs."""
    media_map = get_latest_media_by_requirement(receipt.order, 'RECEIVE')
    field_mapping = {
        'Ảnh mặt trước': 'photo_front_url',
        'Ảnh mặt sau': 'photo_rear_url',
        'Ảnh bên trái': 'photo_left_url',
        'Ảnh bên phải': 'photo_right_url',
        'Ảnh nội thất': 'photo_interior_url',
        'Ảnh táp-lô': 'photo_dashboard_url',
        'Ảnh giấy đăng ký': 'vehicle_registration_url',
        'Ảnh bảo hiểm': 'vehicle_insurance_url',
        'Ảnh checklist ngoại thất khi nhận': 'exterior_check_photo',
        'Ảnh checklist lốp xe khi nhận': 'tires_check_photo',
        'Ảnh checklist đèn khi nhận': 'lights_check_photo',
        'Ảnh checklist gương khi nhận': 'mirrors_check_photo',
        'Ảnh checklist kính khi nhận': 'windows_check_photo',
        'Ảnh checklist nội thất khi nhận': 'interior_check_photo',
        'Ảnh checklist động cơ khi nhận': 'engine_check_photo',
        'Ảnh checklist nhiên liệu khi nhận': 'fuel_check_photo',
    }

    updated_fields = []
    for requirement_name, field_name in field_mapping.items():
        media_item = media_map.get(requirement_name)
        if media_item and getattr(receipt, field_name) != media_item.url:
            setattr(receipt, field_name, media_item.url)
            updated_fields.append(field_name)

    if updated_fields:
        receipt.save(update_fields=updated_fields)


def sync_return_media_fields(return_log):
    """Backfill legacy return URL fields from media_files so return flow uses one upload path."""
    media_map = get_latest_media_by_requirement(return_log.order, 'RETURN')
    field_mapping = {
        'Ảnh mặt trước khi trả': 'photo_front_url',
        'Ảnh mặt sau khi trả': 'photo_rear_url',
        'Ảnh bên trái khi trả': 'photo_left_url',
        'Ảnh bên phải khi trả': 'photo_right_url',
        'Ảnh nội thất khi trả': 'photo_interior_url',
        'Ảnh táp-lô khi trả': 'photo_dashboard_url',
        'Ảnh checklist ngoại thất khi trả': 'exterior_check_photo',
        'Ảnh checklist lốp xe khi trả': 'tires_check_photo',
        'Ảnh checklist đèn khi trả': 'lights_check_photo',
        'Ảnh checklist gương khi trả': 'mirrors_check_photo',
        'Ảnh checklist kính khi trả': 'windows_check_photo',
        'Ảnh checklist nội thất khi trả': 'interior_check_photo',
        'Ảnh checklist giấy tờ khi trả': 'documents_complete_photo',
        'Ảnh checklist tem đăng kiểm khi trả': 'stamp_attached_photo',
        'Ảnh giấy đăng ký khi trả': 'vehicle_registration_url',
        'Ảnh tem đăng kiểm khi trả': 'stamp_url',
        'Ảnh giấy chứng nhận kiểm định khi trả': 'inspection_certificate_url',
        'Ảnh biên lai khi trả': 'receipt_url',
    }

    updated_fields = []
    for requirement_name, field_name in field_mapping.items():
        media_item = media_map.get(requirement_name)
        if media_item and getattr(return_log, field_name) != media_item.url:
            setattr(return_log, field_name, media_item.url)
            updated_fields.append(field_name)

    if updated_fields:
        return_log.save(update_fields=updated_fields)


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

    @action(detail=False, methods=['put'])
    def update_profile(self, request):
        """
        PUT /api/staff/update_profile/
        Cập nhật thông tin cá nhân của staff hiện tại.

        Hỗ trợ các field:
        - full_name, phone, avatar_url, position
        - birth_date, gender, address
        - email (trong bảng auth_user)
        """
        if not hasattr(request.user, 'staff_profile'):
            return Response({'error': 'Không phải staff'}, status=403)

        staff = request.user.staff_profile

        # Nếu cập nhật phone, kiểm tra trùng với staff khác để tránh nhầm role lúc đăng nhập
        new_phone = request.data.get('phone')
        if new_phone and Staff.objects.filter(phone=new_phone).exclude(id=staff.id).exists():
            return Response({
                'error': 'Số điện thoại đã được sử dụng bởi nhân viên khác'
            }, status=400)

        allowed_staff_fields = [
            'full_name', 'phone', 'avatar_url', 'position',
            'birth_date', 'gender', 'address'
        ]
        for field in allowed_staff_fields:
            if field in request.data:
                setattr(staff, field, request.data.get(field))

        if 'email' in request.data:
            request.user.email = request.data.get('email') or ''
            request.user.save(update_fields=['email'])

        staff.save()
        serializer = self.get_serializer(staff)
        return Response({
            'success': True,
            'message': 'Cập nhật thông tin cá nhân thành công',
            'data': serializer.data
        }, status=200)
    
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
            'pending': filter_orders_by_status(orders, 'pending').count(),
            'confirmed': filter_orders_by_status(orders, 'confirmed').count(),
            'in_progress': filter_orders_by_status(orders, 'in_progress').count(),
            'completed': filter_orders_by_status(orders, 'completed').count(),
            'cancelled': filter_orders_by_status(orders, 'cancelled').count(),
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

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated], url_path='change-password')
    def change_password(self, request):
        """
        POST /api/staff/change-password/
        Đổi mật khẩu cho staff đang đăng nhập.

        Body:
        {
            "old_password": "old123",
            "new_password": "new123456",
            "confirm_password": "new123456"
        }
        """
        if not hasattr(request.user, 'staff_profile'):
            return Response({'error': 'Không phải staff'}, status=403)

        old_password = request.data.get('old_password', '')
        new_password = request.data.get('new_password', '')
        confirm_password = request.data.get('confirm_password', '')

        if not old_password or not new_password:
            return Response({
                'error': 'Vui lòng nhập old_password và new_password'
            }, status=400)

        if not request.user.check_password(old_password):
            return Response({
                'error': 'Mật khẩu hiện tại không đúng'
            }, status=400)

        if len(new_password) < 6:
            return Response({
                'error': 'Mật khẩu mới phải có ít nhất 6 ký tự'
            }, status=400)

        if confirm_password and new_password != confirm_password:
            return Response({
                'error': 'Xác nhận mật khẩu không khớp'
            }, status=400)

        request.user.set_password(new_password)
        request.user.save(update_fields=['password'])

        return Response({
            'success': True,
            'message': 'Đổi mật khẩu thành công'
        }, status=200)

    @action(detail=False, methods=['get', 'put'], permission_classes=[IsAuthenticated], url_path='notification-settings')
    def notification_settings(self, request):
        """
        GET /api/staff/notification-settings/
        PUT /api/staff/notification-settings/

        GET: Trả về danh sách setting thông báo cho staff hiện tại.
        PUT: Cập nhật bật/tắt theo 1 setting hoặc cập nhật batch.

        PUT body (single): {"id": "new-order", "enabled": false}
        PUT body (batch): {"settings": [{"id": "new-order", "enabled": false}]}
        """
        if not hasattr(request.user, 'staff_profile'):
            return Response({'error': 'Không phải staff'}, status=403)

        staff = request.user.staff_profile

        if request.method == 'GET':
            existing = StaffNotificationSetting.objects.filter(staff=staff)
            existing_map = {item.setting_key: item.enabled for item in existing}

            settings = []
            for item in STAFF_NOTIFICATION_SETTING_DEFINITIONS:
                settings.append({
                    'id': item['id'],
                    'title': item['title'],
                    'description': item['description'],
                    'enabled': existing_map.get(item['id'], item['default_enabled'])
                })

            return Response({
                'success': True,
                'settings': settings
            }, status=200)

        updates = request.data.get('settings')
        if updates is None:
            if 'id' not in request.data or 'enabled' not in request.data:
                return Response({
                    'error': 'Body phải chứa "id" + "enabled" hoặc mảng "settings"'
                }, status=400)
            updates = [{
                'id': request.data.get('id'),
                'enabled': request.data.get('enabled')
            }]

        if not isinstance(updates, list) or not updates:
            return Response({
                'error': 'settings phải là mảng không rỗng'
            }, status=400)

        updated_count = 0
        for item in updates:
            setting_id = item.get('id')
            enabled_value = item.get('enabled')

            if setting_id not in STAFF_NOTIFICATION_SETTING_ID_SET:
                return Response({
                    'error': f'Setting id không hợp lệ: {setting_id}'
                }, status=400)

            if not isinstance(enabled_value, bool):
                return Response({
                    'error': f'Giá trị enabled của {setting_id} phải là boolean'
                }, status=400)

            StaffNotificationSetting.objects.update_or_create(
                staff=staff,
                setting_key=setting_id,
                defaults={'enabled': enabled_value}
            )
            updated_count += 1

        return Response({
            'success': True,
            'message': f'Đã cập nhật {updated_count} cài đặt thông báo'
        }, status=200)


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
        set_order_status(order, 'confirmed')
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
        set_order_status(order, 'pending')
        order.save()
        
        serializer = self.get_serializer(order)
        return Response({
            'success': True,
            'message': f'Đã gỡ {old_staff.full_name if old_staff else "nhân viên"} khỏi order',
            'order': serializer.data
        })
    
    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated], url_path='generate-contract-docx')
    def generate_contract_docx(self, request, pk=None):
        """
        GET /api/orders/{id}/generate-contract-docx/
        Tạo file hợp đồng Word (.docx) + lưu vào media/contracts/
        Hỗ trợ ?format=pdf để trả về PDF từ file DOCX đã tạo.
        
        Response:
        {
            "success": true,
            "message": "Đã tạo hợp đồng",
            "contract_url": "http://127.0.0.1:8000/media/contracts/order_123_abc12345.docx",
            "file_download": <binary>
        }
        """
        order = self.get_object()
        try:
            receipt = order.receipt_log
        except VehicleReceiptLog.DoesNotExist:
            return Response({'error': 'Chưa có biên bản nhận xe'}, status=400)

        # Ánh xạ fields từ model
        data = {
            'today_date': timezone.now().strftime('%d/%m/%Y'),
            'order_code': order.order_code,
            'customer_name': order.customer.full_name,
            'customer_phone': order.customer.phone,
            'customer_address': order.customer.address or '',
            'customer_date_of_birth': str(order.customer.date_of_birth) if order.customer.date_of_birth else '',
            'customer_id_number': order.customer.id_number or '',
            'customer_id_issued_date': str(order.customer.id_issued_date) if order.customer.id_issued_date else '',
            'customer_id_issued_place': order.customer.id_issued_place or '',
            'vehicle_brand': order.vehicle.brand or '',
            'vehicle_plate': order.vehicle.license_plate,
            'vehicle_chassis_number': order.vehicle.chassis_number or '',
            'vehicle_engine_number': order.vehicle.engine_number or '',
            'vehicle_model': order.vehicle.model or '',
            'vehicle_year': order.vehicle.manufacture_year or '',
            'station_name': order.station.station_name,
            'station_address': order.station.address,
            'staff_name': order.assigned_staff.full_name if order.assigned_staff else '',
            'staff_code': order.assigned_staff.employee_code if order.assigned_staff else '',
            'staff_phone': order.assigned_staff.phone if order.assigned_staff else '',
            'odometer_reading': receipt.odometer_reading or '',
            'fuel_level': receipt.fuel_level or '',
            'receipt_status': receipt.status,
            'received_at': receipt.received_at.strftime('%d/%m/%Y %H:%M') if receipt.received_at else '',
            'additional_notes': receipt.additional_notes or '',
        }

        template_path = os.path.join(settings.BASE_DIR, 'templates', 'contract_template.docx')
        if not os.path.exists(template_path):
            return Response({'error': 'Template contract_template.docx không tồn tại'}, status=500)

        docx_bytes = render_contract_docx(
            template_path,
            data,
            customer_sig_path=getattr(receipt.customer_signature, 'path', None),
            staff_sig_path=getattr(receipt.staff_signature, 'path', None) or get_default_staff_signature_path()
        )

        output_format = request.query_params.get('format', 'docx').lower()
        if output_format not in ('docx', 'pdf'):
            return Response({'error': 'Invalid format. Sử dụng ?format=docx hoặc ?format=pdf'}, status=400)

        try:
            pdf_bytes = convert_docx_bytes_to_pdf(docx_bytes)
        except Exception as e:
            return Response({'error': f'Chuyển DOCX sang PDF thất bại: {str(e)}'}, status=500)

        # ✅ Lưu file DOCX vào media/contracts/
        docx_filename = f"order_{order.id}_{uuid.uuid4().hex[:8]}.docx"
        docx_content = ContentFile(docx_bytes.getvalue(), name=docx_filename)
        order.contract_document = docx_content

        # ✅ Lưu file PDF vào media/contracts/
        pdf_filename = f"order_{order.id}_{uuid.uuid4().hex[:8]}.pdf"
        pdf_content = ContentFile(pdf_bytes.getvalue(), name=pdf_filename)
        order.contract_document_pdf = pdf_content

        order.contract_document_created_at = timezone.now()
        order.save()

        contract_pdf_download_url = request.build_absolute_uri(reverse('order-download-contract-pdf', args=[order.id]))

        if output_format == 'pdf':
            response = HttpResponse(
                pdf_bytes.getvalue(),
                content_type='application/pdf'
            )
            response['Content-Disposition'] = f'attachment; filename=hopdong_{order.order_code}.pdf'
            response['X-Contract-PDF-URL'] = contract_pdf_download_url
            return response

        response = HttpResponse(
            docx_bytes.getvalue(),
            content_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
        response['Content-Disposition'] = f'attachment; filename=hopdong_{order.order_code}.docx'
        response['X-Contract-PDF-URL'] = contract_pdf_download_url
        return response

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated], url_path='download-contract-pdf')
    def download_contract_pdf(self, request, pk=None):
        """Download the saved PDF contract for this order."""
        order = self.get_object()
        if not order.contract_document_pdf:
            return Response({'error': 'Chưa có file PDF hợp đồng'}, status=404)

        try:
            order.contract_document_pdf.open('rb')
            pdf_data = order.contract_document_pdf.read()
        finally:
            order.contract_document_pdf.close()

        response = HttpResponse(pdf_data, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename=hopdong_{order.order_code}.pdf'
        return response

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
            queryset = filter_orders_by_status(queryset, status)
        
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
        set_order_status(order, new_status)
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
        current_status_code = get_order_status_code(order)
        if current_status_code != 'pending':
            return Response({
                'success': False,
                'error': f'Không thể bắt đầu xử lý. Trạng thái hiện tại: {get_order_status_label(order)}',
                'current_status': current_status_code
            }, status=400)
        
        # ===== 3. UPDATE STATUS =====
        previous_status = current_status_code
        set_order_status(order, 'in_progress')
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
        current_status_code = get_order_status_code(order)
        if current_status_code != 'in_progress':
            return Response({
                'success': False,
                'error': f'Không thể hủy. Trạng thái hiện tại: {get_order_status_label(order)}',
                'current_status': current_status_code
            }, status=400)
        
        # ===== 3. GET REASON (Optional) =====
        reason = request.data.get('reason', '')
        
        # ===== 4. UPDATE STATUS =====
        previous_status = current_status_code
        set_order_status(order, 'pending')
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
            'additional_notes', 'customer_signature', 'staff_signature'
        ]

        for field in optional_fields:
            if field in validated_data:
                if field in ['customer_signature', 'staff_signature'] and validated_data[field]:
                    try:
                        defaults[field] = base64_to_file(validated_data[field], f"{field}")
                    except Exception as e:
                        return Response({
                            'success': False,
                            'error': f'Lỗi xử lý {field}: {str(e)}'
                        }, status=400)
                else:
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
        current_status_code = get_order_status_code(order)
        if current_status_code in ['confirmed', 'assigned'] and not order.started_at:
            set_order_status(order, 'in_progress')
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
        ✅ UPDATED 10/04/2026 - API #1: Initialize - Chỉ khởi tạo biên bản nhận xe
        POST /api/orders/{id}/vehicle-receipt-initialize/
        Chỉ tạo biên bản nhận xe, không nhập thông tin khách hàng,
        không lưu ghi chú, không tạo hợp đồng, không nhận chữ ký.
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

        # 3. TẠO BIÊN BẢN
        receipt = VehicleReceiptLog.objects.create(
            order=order,
            received_by=staff,
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
            interior_condition='',
            additional_notes=''
        )

        return Response({
            'success': True,
            'message': 'Đã khởi tạo biên bản nhận xe',
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
            },
            'request_mode': 'multipart' if request.FILES else 'json'
        }, status=201)
    
    @action(detail=True, methods=['post', 'put'], permission_classes=[IsAuthenticated])
    def vehicle_receipt_vehicle_inspection(self, request, pk=None):
        """
        API #2: Vehicle Inspection - Xác nhận bước ảnh xe
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
        
        # 4. Đồng bộ ảnh đã upload riêng qua media/upload vào biên bản cũ
        sync_receipt_media_fields(receipt)
        
        # 5. Update status
        receipt.status = 'vehicle_inspected'
        receipt.save()
        
        # 6. Return response
        return Response({
            'success': True,
            'message': 'Đã xác nhận bước ảnh xe. Ảnh được lấy từ media_files.',
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
        
        # 5. Đồng bộ ảnh checklist đã upload riêng qua media/upload
        sync_receipt_media_fields(receipt)

        # 5.1. Update additional_notes
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
        Không yêu cầu body. Không cần chữ ký nhân viên.
        """
        # 1. Kiểm tra quyền
        user = request.user
        if not hasattr(user, 'staff_profile'):
            return Response({'error': 'Chỉ nhân viên mới có quyền nhận xe'}, status=403)
        
        order = self.get_object()
        
        # 2. Kiểm tra Order status (phải in_progress)
        current_status_code = order.status.status_code if order.status else order.status_legacy
        if current_status_code != 'in_progress':
            return Response({
                'success': False,
                'error': f'Order phải ở trạng thái in_progress. Hiện tại: {current_status_code}'
            }, status=400)
        
        # 3. Lấy receipt (PHẢI đã tồn tại từ API 1)
        if not hasattr(order, 'receipt_log'):
            return Response({
                'success': False,
                'error': 'Chưa khởi tạo biên bản nhận xe. Vui lòng gọi API Initialize trước.',
                'message': 'Biên bản chưa tồn tại'
            }, status=400)
        
        receipt = order.receipt_log
        sync_receipt_media_fields(receipt)

        # 4. Validate required images (stage RECEIVE)
        missing_requirements = get_missing_required_images(order, stage='RECEIVE')
        if missing_requirements:
            return Response({
                'success': False,
                'error': 'Thiếu ảnh bắt buộc theo cấu hình trước khi hoàn tất biên bản nhận xe',
                'missing_requirements': [
                    {
                        'id': item.id,
                        'name': item.name,
                        'category': item.category,
                        'position': item.position,
                        'stage': item.stage,
                    }
                    for item in missing_requirements
                ]
            }, status=400)

        # 5. Update status → completed
        receipt.status = 'completed'
        receipt.completed_at = timezone.now()
        receipt.save()
        
        # 6. Update Order status → vehicle_received
        try:
            vehicle_received_status = OrderStatus.objects.get(status_code='vehicle_received')
            order.status = vehicle_received_status
            order.status_legacy = 'vehicle_received'
        except OrderStatus.DoesNotExist:
            order.status_legacy = 'vehicle_received'
        if not order.started_at:
            order.started_at = timezone.now()
        order.save()
        
        # 7. Return response
        return Response({
            'success': True,
            'message': 'Đã hoàn tất biên bản nhận xe',
            'receipt': VehicleReceiptLogSerializer(receipt).data,
            'order': {
                'id': order.id,
                'order_code': order.order_code,
                'status': order.status.status_code if order.status else order.status_legacy,
                'started_at': order.started_at
            }
        }, status=200)
    
    @action(detail=True, methods=['post'], url_path='complete-vehicle-received', permission_classes=[IsAuthenticated])
    def complete_vehicle_received(self, request, pk=None):
        """
        🎯 UPDATED 10/04/2026 - API: Nhập thông tin hợp đồng + chữ ký khách hàng để tạo hợp đồng
        POST /api/orders/{id}/complete-vehicle-received/
        Nhận multipart/form-data với thông tin khách hàng và customer_signature (file).
        Không cần staff_signature. Không hoàn tất biên bản ở bước này.
        """
        # 1. Kiểm tra quyền
        user = request.user
        if not hasattr(user, 'staff_profile'):
            return Response({
                'success': False,
                'error': 'Chỉ nhân viên mới có quyền thực hiện'
            }, status=403)
        
        order = self.get_object()
        
        # 2. Kiểm tra biên bản nhận xe tồn tại
        if not hasattr(order, 'receipt_log'):
            return Response({
                'success': False,
                'error': 'Chưa có biên bản nhận xe'
            }, status=404)
        
        receipt = order.receipt_log

        raw_customer_info = request.data.get('customer_info', {})
        if isinstance(raw_customer_info, dict):
            customer_info = raw_customer_info
        else:
            customer_info = {}

        customer_info = {
            'full_name': request.data.get('customer_name') or customer_info.get('full_name'),
            'birth_date': request.data.get('customer_date_of_birth') or customer_info.get('birth_date'),
            'id_number': request.data.get('customer_id_number') or customer_info.get('id_number'),
            'id_issue_date': request.data.get('customer_id_issued_date') or customer_info.get('id_issue_date'),
            'id_issue_place': request.data.get('customer_id_issued_place') or customer_info.get('id_issue_place'),
            'phone': request.data.get('customer_phone') or customer_info.get('phone'),
            'address': request.data.get('customer_address') or customer_info.get('address'),
        }
        additional_notes = request.data.get('additional_notes', '')

        customer = order.customer
        if customer_info.get('full_name'):
            customer.full_name = customer_info['full_name']
        if customer_info.get('birth_date'):
            customer.date_of_birth = customer_info['birth_date']
        if customer_info.get('id_number'):
            customer.id_number = customer_info['id_number']
        if customer_info.get('id_issue_date'):
            customer.id_issued_date = customer_info['id_issue_date']
        if customer_info.get('id_issue_place'):
            customer.id_issued_place = customer_info['id_issue_place']
        if customer_info.get('phone'):
            customer.phone = customer_info['phone']
        if customer_info.get('address'):
            customer.address = customer_info['address']
        customer.save()

        customer_sig_upload = request.FILES.get('customer_signature')
        if not customer_sig_upload:
            return Response({
                'success': False,
                'error': 'Thiếu customer_signature. Vui lòng gửi file ảnh chữ ký khách hàng bằng multipart/form-data.'
            }, status=400)

        allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        max_size = 10 * 1024 * 1024
        if customer_sig_upload.content_type not in allowed_types:
            return Response({
                'success': False,
                'error': 'customer_signature: Định dạng không hợp lệ. Chỉ chấp nhận JPEG, PNG, WEBP'
            }, status=400)
        if customer_sig_upload.size > max_size:
            return Response({
                'success': False,
                'error': 'customer_signature: File quá lớn. Tối đa 10MB'
            }, status=400)

        file_bytes = customer_sig_upload.read()
        try:
            with Image.open(BytesIO(file_bytes)) as img:
                if img.format not in ('PNG', 'JPEG', 'WEBP'):
                    raise ValueError('Ảnh không hợp lệ')
                file_ext = 'jpg' if img.format == 'JPEG' else img.format.lower()
        except Exception as exc:
            return Response({
                'success': False,
                'error': f'customer_signature: {str(exc)}'
            }, status=400)

        receipt.customer_signature = ContentFile(
            file_bytes,
            name=f"customer_sig_{uuid.uuid4().hex[:8]}.{file_ext}"
        )
        if additional_notes:
            receipt.additional_notes = additional_notes
        receipt.save()

        template_path = os.path.join(settings.BASE_DIR, 'templates', 'contract_template.docx')
        if not os.path.exists(template_path):
            return Response({
                'success': False,
                'error': 'Template contract_template.docx không tồn tại'
            }, status=500)

        authorization_start = receipt.received_at if receipt.received_at else timezone.now()
        authorization_end = timezone.now()
        data = {
            'today_date': timezone.now().strftime('%d/%m/%Y'),
            'order_code': order.order_code,
            'customer_name': customer.full_name,
            'customer_phone': customer.phone,
            'customer_address': customer.address or '',
            'customer_date_of_birth': str(customer.date_of_birth) if customer.date_of_birth else '',
            'customer_id_number': customer.id_number or '',
            'customer_id_issued_date': str(customer.id_issued_date) if customer.id_issued_date else '',
            'customer_id_issued_place': customer.id_issued_place or '',
            'vehicle_brand': order.vehicle.brand or '',
            'vehicle_manufacturer': order.vehicle.brand or '',
            'vehicle_plate': order.vehicle.license_plate,
            'vehicle_chassis_number': order.vehicle.chassis_number or '',
            'vehicle_engine_number': order.vehicle.engine_number or '',
            'vehicle_model': order.vehicle.model or '',
            'vehicle_year': order.vehicle.manufacture_year or '',
            'station_name': order.station.station_name,
            'station_address': order.station.address,
            'staff_name': order.assigned_staff.full_name if order.assigned_staff else '',
            'staff_code': order.assigned_staff.employee_code if order.assigned_staff else '',
            'staff_phone': order.assigned_staff.phone if order.assigned_staff else '',
            'odometer_reading': receipt.odometer_reading or '',
            'fuel_level': receipt.fuel_level or '',
            'receipt_status': receipt.status,
            'received_at': receipt.received_at.strftime('%d/%m/%Y %H:%M') if receipt.received_at else '',
            'additional_notes': receipt.additional_notes or '',
            'authorization_start_date': authorization_start.strftime('%d/%m/%Y'),
            'authorization_end_date': authorization_end.strftime('%d/%m/%Y'),
        }

        try:
            docx_bytes = render_contract_docx(
                template_path,
                data,
                customer_sig_path=getattr(receipt.customer_signature, 'path', None),
                staff_sig_path=get_default_staff_signature_path()
            )
            pdf_bytes = convert_docx_bytes_to_pdf(docx_bytes)
        except Exception as exc:
            return Response({
                'success': False,
                'error': f'Tạo hợp đồng thất bại: {type(exc).__name__}: {str(exc)}'
            }, status=500)

        docx_filename = f"order_{order.id}_{uuid.uuid4().hex[:8]}.docx"
        order.contract_document = ContentFile(docx_bytes.getvalue(), name=docx_filename)
        pdf_filename = f"order_{order.id}_{uuid.uuid4().hex[:8]}.pdf"
        order.contract_document_pdf = ContentFile(pdf_bytes.getvalue(), name=pdf_filename)
        order.contract_document_created_at = timezone.now()

        order.save()

        contract_file_url = None
        contract_pdf_download_url = None
        contract_file_error = None

        if order.contract_document:
            try:
                contract_file_url = order.contract_document.url
            except Exception:
                contract_file_url = None

        if order.contract_document_pdf:
            try:
                contract_pdf_download_url = request.build_absolute_uri(
                    reverse('order-download-contract-pdf', args=[order.id])
                )
            except Exception:
                contract_pdf_download_url = None

        if not order.contract_document and not order.contract_document_pdf:
            contract_file_error = 'Chưa tạo được hợp đồng trên order.'

        # 6️⃣ Return response
        return Response({
            'success': True,
            'message': 'Đã tạo hợp đồng thành công',
            'order': {
                'id': order.id,
                'order_code': order.order_code,
                'status': order.status.status_code if order.status else 'unknown',
                'status_name': order.status_name,
                'completed_at': order.completed_at,
                'contract_file': contract_file_url,
                'contract_pdf_download_url': contract_pdf_download_url,
                'contract_file_error': contract_file_error,
                'contract_admin_link': f'http://{request.get_host()}/admin/api/order/{order.id}/change/'
            },
            'customer': {
                'id': customer.id,
                'full_name': customer.full_name,
                'phone': customer.phone,
                'id_number': customer.id_number
            },
            'request_mode': 'multipart' if request.FILES else 'json'
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
        current_status_code = order.status.status_code if order.status else order.status_legacy
        if current_status_code != 'in_progress':
            return Response({
                'error': f'Order phải ở trạng thái in_progress. Hiện tại: {current_status_code}'
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
        try:
            vehicle_returned_status = OrderStatus.objects.get(status_code='vehicle_returned')
            order.status = vehicle_returned_status
            order.status_legacy = 'vehicle_returned'
        except OrderStatus.DoesNotExist:
            order.status_legacy = 'vehicle_returned'
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
                'status': order.status.status_code if order.status else order.status_legacy,
                'status_display': get_order_status_label(order)
            }
        }, status=201)
    
    @action(detail=True, methods=['post', 'put'], url_path='vehicle-return-vehicle-inspection', permission_classes=[IsAuthenticated])
    def vehicle_return_vehicle_inspection(self, request, pk=None):
        """
        API #2: Vehicle Inspection - Xác nhận bước ảnh xe KHI TRẢ
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
        
        # 4. Đồng bộ ảnh đã upload riêng qua media/upload vào biên bản cũ
        sync_return_media_fields(return_log)
        
        # 5. Update status → vehicle_inspected
        return_log.status = 'vehicle_inspected'
        return_log.save()
        
        # 6. Return response
        return Response({
            'success': True,
            'message': 'Đã xác nhận bước ảnh xe khi trả. Ảnh được lấy từ media_files.',
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
        
        # 4. Cập nhật 8 checkbox cho TRẢ XE
        checkbox_fields = ['exterior_ok', 'tires_ok', 'lights_ok', 'mirrors_ok',
                          'windows_ok', 'interior_ok', 'documents_complete_ok', 'stamp_attached_ok']

        for field in checkbox_fields:
            value = serializer.validated_data.get(field)
            if value is not None:  # Cho phép False
                setattr(return_log, field, value)

        sync_return_media_fields(return_log)
        
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
        current_status_code = order.status.status_code if order.status else order.status_legacy
        if current_status_code != 'vehicle_returned':
            return Response({
                'error': f'Order phải ở trạng thái vehicle_returned. Hiện tại: {current_status_code}'
            }, status=400)
        
        # 4. Kiểm tra status của biên bản (phải đã qua condition_checked)
        if return_log.status not in ['condition_checked', 'completed']:
            return Response({
                'error': f'Biên bản phải ở trạng thái condition_checked. Hiện tại: {return_log.status}'
            }, status=400)

        # 4b. Kiểm tra ảnh bắt buộc giai đoạn RETURN
        missing_images = get_missing_required_images(order, 'RETURN')
        if missing_images:
            return Response({
                'error': 'Chưa đủ ảnh bắt buộc cho giai đoạn trả xe',
                'missing_requirements': [
                    {
                        'id': item.id,
                        'name': item.name,
                        'category': item.category,
                        'position': item.position,
                        'stage': item.stage,
                    }
                    for item in missing_images
                ]
            }, status=400)

        # 5. Validate data
        serializer = VehicleReturnFinalizeSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        
        # 6. Cập nhật 11 giấy tờ + ghi chú + chữ ký (UPDATED 10/03/2026)
        data = serializer.validated_data

        sync_return_media_fields(return_log)

        # NHÓM A: Giấy đăng ký xe (1 field text)
        if data.get('registration_number'):
            return_log.registration_number = data['registration_number']

        # NHÓM B: Tem đăng kiểm (2 fields text)
        if data.get('stamp_number'):
            return_log.stamp_number = data['stamp_number']
        if data.get('stamp_expiry_date'):
            return_log.stamp_expiry_date = data['stamp_expiry_date']
        
        # NHÓM C: Các giấy tờ khác (1 field - JSON array)
        if data.get('other_documents_urls'):
            return_log.other_documents_urls = data['other_documents_urls']
        
        # NHÓM D: Biên lai (1 field text)
        if data.get('receipt_number'):
            return_log.receipt_number = data['receipt_number']

        # NHÓM E: Giấy chứng nhận kiểm định (2 fields text)
        if data.get('certificate_number'):
            return_log.certificate_number = data['certificate_number']
        if data.get('certificate_expiry_date'):
            return_log.certificate_expiry_date = data['certificate_expiry_date']
        
        # NHÓM F: Ghi chú (1 field)
        if data.get('additional_notes'):
            return_log.additional_notes = data['additional_notes']
        
        # NHÓM G: Chữ ký khách hàng (1 field)
        if data.get('customer_signature'):
            try:
                customer_sig_file = base64_to_file(data['customer_signature'], 'customer_sig_return')
                return_log.customer_signature = customer_sig_file
                return_log.customer_confirmed = True
            except Exception as e:
                return Response({
                    'success': False,
                    'error': f'Lỗi xử lý chữ ký khách hàng: {str(e)}'
                }, status=400)
        
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
        try:
            completed_status = OrderStatus.objects.get(status_code='completed')
            order.status = completed_status
            order.status_legacy = 'completed'
        except OrderStatus.DoesNotExist:
            order.status_legacy = 'completed'
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
                'status': order.status.status_code if order.status else order.status_legacy,
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
        current_status_code = get_order_status_code(order)
        if current_status_code not in TRACKABLE_STATUSES:
            return Response({
                'success': False,
                'error': f'Không thể tracking đơn hàng ở trạng thái "{current_status_code}"',
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
            'order_status': get_order_status_code(order)
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


PAYMENT_METHOD_MAP = {
    'QR': 'vietqr',
    'VNPAY': 'vnpay',
    'CASH': 'cash',
}


def _get_payos_client():
    return PayOS(
        client_id=os.getenv('PAYOS_CLIENT_ID'),
        api_key=os.getenv('PAYOS_API_KEY'),
        checksum_key=os.getenv('PAYOS_CHECKSUM_KEY'),
    )


def _mark_payment_paid(payment, transaction_code=None, paid_at=None):
    paid_time = paid_at or timezone.now()
    payment.status = 'SUCCESS'
    payment.paid_at = paid_time
    if transaction_code:
        payment.transaction_id = str(transaction_code)
        payment.transaction_code = str(transaction_code)
    payment.save(update_fields=['status', 'paid_at', 'transaction_id', 'transaction_code', 'updated_at'])


def _sync_payment_status_from_payos(payment):
    """Đồng bộ trạng thái payment từ PayOS để tránh lệ thuộc hoàn toàn vào webhook."""
    if not payment or not payment.order_code:
        return payment

    try:
        payos_client = _get_payos_client()
        remote_payment = payos_client.payment_requests.get(payment.order_code)
    except Exception:
        return payment

    remote_status = (getattr(remote_payment, 'status', '') or '').upper()
    remote_paid_amount = getattr(remote_payment, 'amount_paid', 0) or 0
    remote_transactions = getattr(remote_payment, 'transactions', None) or []

    transaction_code = None
    if remote_transactions:
        latest_transaction = remote_transactions[-1]
        transaction_code = getattr(latest_transaction, 'reference', None) or getattr(latest_transaction, 'id', None)

    if remote_status in ['PAID', 'SUCCESS'] or remote_paid_amount >= int(payment.amount):
        _mark_payment_paid(payment, transaction_code=transaction_code)
    elif remote_status in ['CANCELLED', 'CANCELED']:
        payment.status = 'FAILED'
        payment.save(update_fields=['status', 'updated_at'])
    elif remote_status in ['EXPIRED', 'FAILED']:
        payment.status = 'FAILED'
        payment.save(update_fields=['status', 'updated_at'])

    return payment


def _status_to_public(status_value):
    status_map = {
        'PENDING': 'PENDING',
        'SUCCESS': 'SUCCESS',
        'FAILED': 'FAILED',
        # Backward-compat for old records before migration
        'pending': 'PENDING',
        'paid': 'SUCCESS',
        'failed': 'FAILED',
        'refunded': 'FAILED',
        'cancelled': 'FAILED',
    }
    return status_map.get(status_value, 'PENDING')


@api_view(['POST'])
@permission_classes([AllowAny])
def create_payment(request):
    """
    POST /api/create-payment
    Tạo giao dịch thanh toán và trả về QR + checkout URL.
    """
    amount_raw = request.data.get('amount')
    method = str(request.data.get('method', 'QR')).upper()
    order_id = request.data.get('order_id')
    additional_cost_id = request.data.get('additional_cost_id')  # Cho thanh toán chi phí phát sinh trả xe

    # Parse amount
    amount = None
    if amount_raw is not None:
        try:
            amount = int(amount_raw)
        except (TypeError, ValueError):
            return Response({'error': 'Số tiền không hợp lệ'}, status=status.HTTP_400_BAD_REQUEST)

    if amount is not None and amount < 10000:
        return Response({'error': 'Số tiền tối thiểu là 10.000 VND'}, status=status.HTTP_400_BAD_REQUEST)

    if not order_id and not additional_cost_id:
        return Response({'error': 'Cần truyền order_id hoặc additional_cost_id'}, status=status.HTTP_400_BAD_REQUEST)

    if method not in PAYMENT_METHOD_MAP:
        return Response({'error': 'Phương thức thanh toán không hợp lệ'}, status=status.HTTP_400_BAD_REQUEST)

    linked_order = None
    linked_additional_cost = None
    payment_type = 'order'
    description = ''

    # ── Luồng 1: Thanh toán chi phí phát sinh TRẢ XE ──
    if additional_cost_id:
        linked_additional_cost = VehicleReturnAdditionalCost.objects.filter(id=additional_cost_id).first()
        if not linked_additional_cost:
            return Response({'error': f'Không tìm thấy chi phí phát sinh id={additional_cost_id}'}, status=status.HTTP_404_NOT_FOUND)
        linked_order = linked_additional_cost.order
        if amount is None:
            amount = int(linked_additional_cost.amount)
        description = f'Chi phí phát sinh: {linked_additional_cost.cost_name} — đơn {linked_order.order_code}'
        payment_type = 'additional_cost'

    # ── Luồng 2: Thanh toán đơn hàng NHẬN XE ──
    elif order_id:
        linked_order = Order.objects.filter(id=order_id).first()
        if not linked_order:
            return Response({'error': f'Không tìm thấy đơn hàng id={order_id}'}, status=status.HTTP_404_NOT_FOUND)
        if amount is None:
            amount = int(linked_order.estimated_amount + linked_order.additional_amount)
        description = f'Thanh toán đơn {linked_order.order_code}'
        payment_type = 'order'

    order_code = int(timezone.now().timestamp() * 1000)

    # Tạo payment link thật từ PayOS để có QR đúng chuẩn ngân hàng/nhà cung cấp.
    return_url = os.getenv('RETURN_URL')
    cancel_url = os.getenv('CANCEL_URL')
    if not return_url or not cancel_url:
        return Response(
            {'error': 'Thiếu RETURN_URL hoặc CANCEL_URL trong cấu hình môi trường'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    payos_description = description[:25] if description else f"PAY {order_code}"[:25]
    payos_item_name = 'Thanh toan don'

    try:
        payos_client = _get_payos_client()
        payos_request = CreatePaymentLinkRequest(
            orderCode=order_code,
            amount=amount,
            description=payos_description,
            cancelUrl=cancel_url,
            returnUrl=return_url,
            items=[ItemData(name=payos_item_name, quantity=1, price=amount)],
        )
        payos_result = payos_client.payment_requests.create(payos_request)
        checkout_url = payos_result.checkout_url
        qr_payload = payos_result.qr_code
        qr_image_url = f"https://api.qrserver.com/v1/create-qr-code/?size=260x260&data={quote(qr_payload)}"
    except Exception as exc:
        return Response(
            {'error': f'Không tạo được payment link từ PayOS: {type(exc).__name__}: {str(exc)}'},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    # Khi user thanh toán lại cho cùng đơn hàng, xóa payment cũ để tránh xung đột OneToOne(order).
    if linked_order:
        Payment.objects.filter(order=linked_order).delete()

    payment = Payment.objects.create(
        order=linked_order,
        order_code=order_code,
        user_id=(str(linked_order.customer.id) if linked_order and linked_order.customer else None),
        amount=amount,
        currency='VND',
        method=method,
        payment_method=PAYMENT_METHOD_MAP[method],
        payment_type=payment_type,
        status='PENDING',
        payment_url=checkout_url,
        qr_code=qr_payload,
        qr_content=qr_payload,
        vietqr_code_url=qr_image_url,
        description=description,
        notes=f'additional_cost_id={additional_cost_id}' if additional_cost_id else None,
    )

    return Response({
        'paymentId': payment.id,
        'orderCode': order_code,
        'qrCode': qr_payload,
        'qrImageUrl': qr_image_url,
        'checkoutUrl': checkout_url,
        'status': _status_to_public(payment.status),
        'paymentType': payment_type,
        'description': description,
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def check_payment_status(request, order_code):
    """
    GET /api/check-payment-status/{order_code}
    """
    payment = Payment.objects.filter(order_code=order_code).first()
    if not payment:
        return Response({'error': 'Không tìm thấy giao dịch'}, status=status.HTTP_404_NOT_FOUND)

    payment = _sync_payment_status_from_payos(payment)

    public_status = _status_to_public(payment.status)
    message_map = {
        'PENDING': 'Đang chờ thanh toán',
        'SUCCESS': 'Thanh toán thành công',
        'FAILED': 'Thanh toán thất bại',
    }

    return Response({
        'orderCode': payment.order_code,
        'status': public_status,
        'amount': int(payment.amount),
        'message': message_map.get(public_status, 'Đang xử lý'),
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_order_by_order_code(request, order_code):
    """
    GET /api/payment-order/{order_code}
    Tra cứu order_id tương ứng với orderCode thanh toán.
    """
    payment = Payment.objects.select_related('order').filter(order_code=order_code).first()
    if not payment:
        return Response({'error': 'Không tìm thấy giao dịch'}, status=status.HTTP_404_NOT_FOUND)

    payment = _sync_payment_status_from_payos(payment)
    public_status = _status_to_public(payment.status)

    return Response({
        'orderCode': payment.order_code,
        'paymentId': payment.id,
        'orderId': payment.order.id if payment.order else None,
        'status': public_status,
        'isPaid': public_status == 'SUCCESS',
        'paidAt': payment.paid_at,
    }, status=status.HTTP_200_OK)


def _verify_payos_webhook_signature(payload_data, signature_from_webhook):
    """
    Xác minh chữ ký webhook từ PayOS.
    
    PayOS dùng HMAC_SHA256 để ký webhook.
    Các trường cần verify: orderCode, amount, description, accountNumber, reference, transactionDateTime, currency
    (sorted theo alphabet)
    
    Args:
        payload_data: dict chứa dữ liệu từ webhook (cái `data` object)
        signature_from_webhook: signature string từ webhook
    
    Returns:
        bool: True nếu signature hợp lệ, False nếu không
    """
    checksum_key = os.getenv('PAYOS_CHECKSUM_KEY')
    if not checksum_key:
        print("⚠️  PAYOS_CHECKSUM_KEY không được cấu hình")
        return False
    
    # Danh sách trường cần verify (sorted alphabet)
    verify_fields = [
        'amount',
        'accountNumber',
        'currency',
        'description',
        'orderCode',
        'reference',
        'transactionDateTime',
    ]
    
    # Xây dựng signature string
    signature_parts = []
    for field in verify_fields:
        value = payload_data.get(field, '')
        if value is not None:
            signature_parts.append(str(value))
    
    signature_str = ''.join(signature_parts)
    
    # Compute HMAC_SHA256
    computed_signature = hmac.new(
        checksum_key.encode('utf-8'),
        signature_str.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    
    # So sánh signature
    is_valid = computed_signature == signature_from_webhook.lower()
    
    if not is_valid:
        print(f"❌ Webhook signature không hợp lệ!")
        print(f"   Expected: {computed_signature}")
        print(f"   Got: {signature_from_webhook}")
    
    return is_valid


@api_view(['POST'])
@permission_classes([AllowAny])
def webhook_payos(request):
    """
    POST /api/webhook/payos
    Nhận webhook từ PayOS và cập nhật trạng thái thanh toán.
    
    Cấu trúc webhook từ PayOS:
    {
        "code": "00",
        "desc": "success",
        "success": true,
        "data": {
            "orderCode": 123,
            "amount": 3000,
            "description": "...",
            "accountNumber": "...",
            "reference": "TF230204212323",        # Transaction code
            "transactionDateTime": "2023-02-04 18:25:00",
            "currency": "VND",
            "paymentLinkId": "...",
            "code": "00",
            "desc": "Thành công"
        },
        "signature": "8d8640d802..."
    }
    """
    try:
        payload = request.data
        
        # Trích xuất dữ liệu từ webhook
        code = str(payload.get('code', ''))
        desc = payload.get('desc', '')
        success = payload.get('success', False)
        data = payload.get('data', {}) or {}
        signature = payload.get('signature', '')
        
        # Lấy thông tin thanh toán
        order_code = data.get('orderCode')
        amount = data.get('amount')
        transaction_ref = data.get('reference')  # Reference từ PayOS = transaction code
        payment_code = data.get('code')  # Status code trong data
        
        # Xác minh signature
        if not _verify_payos_webhook_signature(data, signature):
            PaymentLog.objects.create(
                payment=None,
                order_code=order_code,
                type='WEBHOOK',
                raw_data=json.dumps(payload, ensure_ascii=False),
                status_code=code,
                ip_address=request.META.get('REMOTE_ADDR'),
                notes='❌ Signature không hợp lệ'
            )
            return Response(
                {'error': 'Invalid signature'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Tìm payment từ order_code
        payment = Payment.objects.filter(order_code=order_code).first()
        
        if not payment:
            # Log webhook nhưng không tìm thấy payment
            PaymentLog.objects.create(
                payment=None,
                order_code=order_code,
                type='WEBHOOK',
                raw_data=json.dumps(payload, ensure_ascii=False),
                status_code=code,
                ip_address=request.META.get('REMOTE_ADDR'),
                notes=f'⚠️  Không tìm thấy payment với order_code={order_code}'
            )
            return Response({'success': False}, status=status.HTTP_404_NOT_FOUND)
        
        # Cập nhật trạng thái thanh toán
        if payment_code == '00' and success:
            # Thanh toán thành công
            payment.status = 'SUCCESS'
            payment.paid_at = timezone.now()
            
            if transaction_ref:
                payment.transaction_id = str(transaction_ref)
                payment.transaction_code = str(transaction_ref)
            
            payment.save(update_fields=['status', 'paid_at', 'transaction_id', 'transaction_code', 'updated_at'])
            
            # ── Luồng 2: Thanh toán đơn hàng NHẬN XE ──
            if payment.payment_type == 'order' and payment.order:
                payment.order.payment_status = 'paid'
                payment.order.payment_completed_at = timezone.now()
                if payment.payment_method:
                    payment.order.payment_method = payment.payment_method
                payment.order.save(update_fields=['payment_status', 'payment_completed_at', 'payment_method', 'updated_at'])
            
            # ── Luồng 1: Thanh toán chi phí phát sinh TRẢ XE ──
            elif payment.payment_type == 'additional_cost' and payment.notes:
                try:
                    cost_id = int(payment.notes.replace('additional_cost_id=', ''))
                    cost = VehicleReturnAdditionalCost.objects.filter(id=cost_id).first()
                    if cost:
                        cost.payment_status = 'paid'
                        cost.paid_at = timezone.now()
                        cost.transaction_id = str(transaction_ref) if transaction_ref else None
                        cost.save(update_fields=['payment_status', 'paid_at', 'transaction_id', 'updated_at'])
                except (ValueError, TypeError) as e:
                    print(f"⚠️  Lỗi xử lý additional_cost: {e}")
            
            log_notes = '✅ Thanh toán thành công'
        else:
            # Thanh toán thất bại
            payment.status = 'FAILED'
            payment.save(update_fields=['status', 'updated_at'])
            log_notes = f'❌ Thanh toán thất bại: {desc}'
        
        # Log webhook
        PaymentLog.objects.create(
            payment=payment,
            order_code=order_code,
            type='WEBHOOK',
            raw_data=json.dumps(payload, ensure_ascii=False),
            status_code=code,
            ip_address=request.META.get('REMOTE_ADDR'),
            notes=log_notes
        )
        
        return Response({'success': True}, status=status.HTTP_200_OK)
    
    except Exception as exc:
        print(f"❌ Lỗi xử lý webhook PayOS: {type(exc).__name__}: {str(exc)}")
        return Response(
            {'error': str(exc)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


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
    Legacy upload ảnh (mock URL)
    
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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def media_upload_v1(request):
    """
    POST /api/v1/media/upload/
    Upload ảnh và lưu metadata vào bảng media_files.
    """
    uploaded_file = request.FILES.get('file')
    if not uploaded_file:
        return Response({
            'status': 'error',
            'message': 'Thiếu file. Vui lòng gửi multipart/form-data với key "file".'
        }, status=400)

    order_id = request.data.get('order_id')
    if not order_id:
        return Response({
            'status': 'error',
            'message': 'Thiếu order_id'
        }, status=400)

    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Order không tồn tại'
        }, status=404)

    requirement_id = request.data.get('requirement_id')
    if not requirement_id:
        return Response({
            'status': 'error',
            'message': 'Thiếu requirement_id'
        }, status=400)

    try:
        requirement = InspectionImageRequirement.objects.get(id=requirement_id, is_active=True)
    except InspectionImageRequirement.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'requirement_id không hợp lệ hoặc đã bị vô hiệu hóa'
        }, status=400)

    stage = (request.data.get('stage') or requirement.stage or '').upper()
    category = (request.data.get('category') or requirement.category or '').upper()
    position = (request.data.get('position') or requirement.position or '').upper()

    valid_stages = {item[0] for item in InspectionImageRequirement.STAGE_CHOICES}
    valid_categories = {item[0] for item in InspectionImageRequirement.CATEGORY_CHOICES}
    valid_positions = {item[0] for item in InspectionImageRequirement.POSITION_CHOICES}

    if stage not in valid_stages:
        return Response({'status': 'error', 'message': 'stage không hợp lệ'}, status=400)
    if category not in valid_categories:
        return Response({'status': 'error', 'message': 'category không hợp lệ'}, status=400)
    if position not in valid_positions:
        return Response({'status': 'error', 'message': 'position không hợp lệ'}, status=400)

    if requirement.stage != stage or requirement.category != category or requirement.position != position:
        return Response({
            'status': 'error',
            'message': 'Thông tin stage/category/position không khớp requirement_id'
        }, status=400)

    allowed_types = {'image/jpeg', 'image/jpg', 'image/png', 'image/webp'}
    if uploaded_file.content_type not in allowed_types:
        return Response({
            'status': 'error',
            'message': 'Định dạng file không hợp lệ. Chỉ chấp nhận JPEG, PNG, WEBP.'
        }, status=400)

    max_size = 10 * 1024 * 1024
    if uploaded_file.size > max_size:
        return Response({
            'status': 'error',
            'message': 'File quá lớn. Tối đa 10MB.'
        }, status=400)

    media = MediaFile(
        order=order,
        requirement=requirement,
        stage=stage,
        category=category,
        position=position,
        file=uploaded_file,
        file_type=uploaded_file.content_type,
        file_size=uploaded_file.size,
    )

    if hasattr(request.user, 'staff_profile'):
        media.created_by = request.user.staff_profile

    media.save()
    file_url = request.build_absolute_uri(media.file.url)
    media.url = file_url
    media.thumbnail_url = file_url
    media.save(update_fields=['url', 'thumbnail_url'])

    return Response({
        'status': 'success',
        'data': {
            'id': media.id,
            'url': media.url,
            'thumbnail_url': media.thumbnail_url,
            'category': media.category,
            'position': media.position,
            'stage': media.stage,
            'requirement_id': media.requirement_id,
            'order_id': media.order_id,
            'file_type': media.file_type,
            'file_size': media.file_size,
        }
    }, status=201)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def media_list_v1(request):
    """
    GET /api/v1/media/?order_id=123
    """
    order_id = request.query_params.get('order_id') or request.query_params.get('order')
    if not order_id:
        return Response({'status': 'error', 'message': 'Thiếu order_id (hoặc order)'}, status=400)

    queryset = MediaFile.objects.filter(order_id=order_id).order_by('created_at')
    stage = request.query_params.get('stage')
    if stage:
        queryset = queryset.filter(stage=stage.strip().upper())

    data = [
        {
            'id': item.id,
            'url': item.url,
            'thumbnail_url': item.thumbnail_url,
            'category': item.category,
            'position': item.position,
            'stage': item.stage,
            'requirement_id': item.requirement_id,
            'created_at': item.created_at,
        }
        for item in queryset
    ]

    return Response({'status': 'success', 'data': data}, status=200)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def image_requirements_v1(request):
    """
    GET /api/v1/image-requirements/
    """
    queryset = InspectionImageRequirement.objects.filter(is_active=True)

    stage = request.query_params.get('stage')
    if stage:
        queryset = queryset.filter(stage=stage.upper())

    vehicle_type_id = request.query_params.get('vehicle_type_id')
    if vehicle_type_id:
        queryset = queryset.filter(Q(vehicle_type_id=vehicle_type_id) | Q(vehicle_type__isnull=True))

    serializer = InspectionImageRequirementSerializer(queryset.order_by('sort_order', 'id'), many=True)
    return Response({'status': 'success', 'data': serializer.data}, status=200)


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
            set_order_status(order, 'assigned')
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
            set_order_status(order, 'assigned')
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

