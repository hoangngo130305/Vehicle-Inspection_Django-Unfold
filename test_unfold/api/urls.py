from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

# Router cho ViewSets
router = DefaultRouter()
router.register('customers', CustomerViewSet, basename='customer')
router.register('staff', StaffViewSet, basename='staff')
router.register('vehicles', VehicleViewSet, basename='vehicle')
router.register('vehicle-types', VehicleTypeViewSet, basename='vehicle-type')
router.register('stations', StationViewSet, basename='station')
router.register('time-slots', TimeSlotViewSet, basename='time-slot')  # ✅ ADDED
router.register('pricings', PricingViewSet, basename='pricing')
router.register('services', ServiceViewSet, basename='service')  # ✅ ADDED (17/03/2026)
router.register('orders', OrderViewSet, basename='order')
router.register('checklist-items', ChecklistItemViewSet, basename='checklist-item')
router.register('order-checklists', OrderChecklistViewSet, basename='order-checklist')
router.register('payments', PaymentViewSet, basename='payment')
router.register('ratings', RatingViewSet, basename='rating')
router.register('vehicle-return-additional-costs', VehicleReturnAdditionalCostViewSet, basename='vehicle-return-additional-cost')  # ✅ NEW (10/03/2026)

urlpatterns = [
    # ========================================
    # UNIFIED LOGIN - API ĐĂNG NHẬP THỐNG NHẤT
    # ========================================
    path('login/', unified_login, name='unified-login'),
    path('register/', customer_register, name='customer-register'),
    
    # ========================================
    # OTP MANAGEMENT
    # ========================================
    path('auth/request-otp/', customer_request_otp, name='request-otp'),
    path('auth/verify-otp/', verify_otp, name='verify-otp'),
    
    # ========================================
    # AUTHENTICATION UTILITIES
    # ========================================
    path('auth/logout/', user_logout, name='logout'),
    path('auth/me/', current_user, name='current-user'),

    # ========================================
    # PAYMENTS (PayOS flow)
    # ========================================
    path('create-payment/', create_payment, name='create-payment'),
    path('check-payment-status/<int:order_code>/', check_payment_status, name='check-payment-status'),
    path('payment-order/<int:order_code>/', get_order_by_order_code, name='payment-order-by-order-code'),
    path('webhook/payos/', webhook_payos, name='webhook-payos'),

    # ========================================
    # ✅✅ NEW - UPLOAD IMAGE (08/03/2026)
    # ========================================
    path('upload-image/', upload_image, name='upload-image'),
    path('v1/media/upload/', media_upload_v1, name='media-upload-v1'),
    path('v1/media/', media_list_v1, name='media-list-v1'),
    path('v1/image-requirements/', image_requirements_v1, name='image-requirements-v1'),
    
    # ========================================
    # ✅✅ STAFF ASSIGNMENT AJAX ENDPOINTS (DJANGO ADMIN ONLY - ĐÃ XÓA KHỎI API)
    # ========================================
    # ❌ REMOVED: Các endpoints này chỉ dùng trong Django Admin, không phải public API
    # path('get-staff-list/', get_staff_list_ajax, name='get-staff-list'),
    # path('assign-staff/', assign_staff_ajax, name='assign-staff'),
    # path('random-assign-staff/', random_assign_staff_ajax, name='random-assign-staff'),
    
    # ViewSet routes
    path('', include(router.urls)),
]