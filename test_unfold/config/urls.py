from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

# Cấu hình Swagger UI (tài liệu API tự động)
schema_view = get_schema_view(
    openapi.Info(
        title="dangkiem_admin API",
        default_version='v1',
        description="Tài liệu API cho hệ thống Dang Kiem Viet.",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="admin@dangkiemviet.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # JWT Token endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # API routes
    path('api/', include('api.urls')),

    # Swagger
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]