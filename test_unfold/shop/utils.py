"""
Utility functions for dangkiem API
"""
import math


def calculate_distance(lat1, lng1, lat2, lng2):
    """
    Tính khoảng cách giữa 2 điểm sử dụng Haversine formula
    
    Args:
        lat1, lng1: Tọa độ điểm 1 (latitude, longitude)
        lat2, lng2: Tọa độ điểm 2 (latitude, longitude)
    
    Returns:
        float: Khoảng cách (km)
    
    Example:
        >>> distance = calculate_distance(13.776489, 109.223688, 13.780000, 109.230000)
        >>> print(f"{distance:.2f} km")
        0.85 km
    """
    if not all([lat1, lng1, lat2, lng2]):
        return None
    
    # Bán kính Trái Đất (km)
    R = 6371.0
    
    # Chuyển sang radian
    lat1_rad = math.radians(float(lat1))
    lng1_rad = math.radians(float(lng1))
    lat2_rad = math.radians(float(lat2))
    lng2_rad = math.radians(float(lng2))
    
    # Haversine formula
    dlat = lat2_rad - lat1_rad
    dlng = lng2_rad - lng1_rad
    
    a = math.sin(dlat / 2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlng / 2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    distance = R * c
    return distance


def calculate_eta(distance_km, average_speed_kmh=30):
    """
    Tính thời gian ước tính đến nơi (ETA - Estimated Time of Arrival)
    
    Args:
        distance_km: Khoảng cách (km)
        average_speed_kmh: Tốc độ trung bình (km/h) - mặc định 30 km/h cho thành phố
    
    Returns:
        int: Thời gian ước tính (phút)
    
    Example:
        >>> eta = calculate_eta(2.5, average_speed=30)
        >>> print(f"{eta} phút")
        5 phút
    """
    if not distance_km or distance_km <= 0:
        return 0
    
    # Tính thời gian (giờ)
    hours = distance_km / average_speed_kmh
    
    # Chuyển sang phút
    minutes = hours * 60
    
    # Làm tròn lên
    return math.ceil(minutes)


def format_distance(distance_km):
    """
    Format khoảng cách để hiển thị user-friendly
    
    Args:
        distance_km: Khoảng cách (km)
    
    Returns:
        str: Chuỗi hiển thị (VD: "2.5 km", "850 m")
    
    Example:
        >>> format_distance(2.5)
        "2.5 km"
        >>> format_distance(0.35)
        "350 m"
    """
    if not distance_km:
        return "0 km"
    
    if distance_km < 1:
        # Hiển thị mét nếu < 1 km
        meters = int(distance_km * 1000)
        return f"{meters} m"
    else:
        # Hiển thị km với 1 chữ số thập phân
        return f"{distance_km:.1f} km"


def format_eta(minutes):
    """
    Format ETA để hiển thị user-friendly
    
    Args:
        minutes: Thời gian (phút)
    
    Returns:
        str: Chuỗi hiển thị (VD: "5 phút", "1 giờ 30 phút")
    
    Example:
        >>> format_eta(5)
        "5 phút"
        >>> format_eta(90)
        "1 giờ 30 phút"
    """
    if not minutes or minutes <= 0:
        return "< 1 phút"
    
    if minutes < 60:
        return f"{minutes} phút"
    else:
        hours = minutes // 60
        remaining_minutes = minutes % 60
        if remaining_minutes == 0:
            return f"{hours} giờ"
        else:
            return f"{hours} giờ {remaining_minutes} phút"
