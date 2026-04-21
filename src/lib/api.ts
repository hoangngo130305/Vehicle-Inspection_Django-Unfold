/**
 * API Client for Đăng Kiểm Việt Admin Web
 * Centralized API calls with JWT authentication and auto-refresh
 *
 * FEATURES:
 * - JWT Token Management (auto-refresh)
 * - Orders API (full CRUD)
 * - Employees API (full CRUD)
 * - Stations, Vehicle Types, Users, Roles, etc.
 */

import {
  API_BASE_URL,
  TOKEN_REFRESH_BUFFER,
  VERBOSE_API_LOGS,
  STORAGE_KEYS,
  API_ENDPOINTS,
} from "./config"; // ✅ ADDED: API_ENDPOINTS

// ============================================================
// TOKEN MANAGEMENT
// ============================================================

export const getToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

export const setToken = (token: string): void => {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
};

export const clearToken = (): void => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
};

export const setRefreshToken = (token: string): void => {
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
};

/**
 * Decode JWT token and get payload
 */
export const decodeToken = (token: string): any | null => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true;
  }

  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime + TOKEN_REFRESH_BUFFER;
};

/**
 * Get token expiry time
 */
export const getTokenExpiry = (token: string): Date | null => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return null;
  }
  return new Date(decoded.exp * 1000);
};

// ============================================================
// TOKEN REFRESH
// ============================================================

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.REFRESH_TOKEN}`,
      {
        // ✅ FIXED: Use API_ENDPOINTS.REFRESH_TOKEN from config
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      },
    );

    if (!response.ok) {
      clearToken();
      localStorage.removeItem("adminRefreshToken");
      return null;
    }

    const data = await response.json();

    if (data.access) {
      setToken(data.access);
      return data.access;
    }

    return null;
  } catch (error) {
    clearToken();
    localStorage.removeItem("adminRefreshToken");
    return null;
  }
};

// ============================================================
// HEADERS
// ============================================================

export const getAuthHeaders = async (): Promise<HeadersInit> => {
  let token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    // Check if token is expired
    if (isTokenExpired(token)) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        token = newToken;
      } else {
        clearToken();
        return headers;
      }
    }

    // ✅ FIXED: Django Simple JWT uses "Bearer" prefix, not "Token"
    headers["Authorization"] = `Bearer ${token}`;
    console.log(
      "🔑 [AUTH HEADERS] Token added:",
      token.substring(0, 20) + "...",
    ); // DEBUG
  } else {
    console.warn("⚠️ [AUTH HEADERS] No token found!"); // DEBUG
  }

  return headers;
};

// ============================================================
// GENERIC API CALL WITH AUTO-REFRESH
// ============================================================

interface ApiOptions extends RequestInit {
  requireAuth?: boolean;
}

export const apiCall = async <T = any>(
  endpoint: string,
  options: ApiOptions = {},
  retryCount = 0,
): Promise<T> => {
  const { requireAuth = true, ...fetchOptions } = options;

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  const headers: HeadersInit = requireAuth
    ? await getAuthHeaders()
    : { "Content-Type": "application/json" };

  if (VERBOSE_API_LOGS) {
    console.log(`📡 [API CALL] ${fetchOptions.method || "GET"} ${endpoint}`);
    console.log("📋 [HEADERS]", headers); // ✅ ADDED: Debug headers
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      ...headers,
      ...fetchOptions.headers,
    },
  });

  // Handle 401 - Token expired, try to refresh
  if (response.status === 401 && requireAuth && retryCount === 0) {
    // If already refreshing, wait for it
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh(() => {
          // Retry the original request with new token
          apiCall<T>(endpoint, options, retryCount + 1)
            .then(resolve)
            .catch(reject);
        });
      });
    }

    // Start refreshing
    isRefreshing = true;
    const newToken = await refreshAccessToken();
    isRefreshing = false;

    if (newToken) {
      // Notify all waiting requests
      onTokenRefreshed(newToken);

      // Retry the original request
      return apiCall<T>(endpoint, options, retryCount + 1);
    } else {
      // Refresh failed, clear tokens
      clearToken();
      localStorage.removeItem("adminRefreshToken");
      throw new Error("Session expired - Please login again");
    }
  }

  // Handle other errors
  if (!response.ok) {
    const errorText = await response.text();
    let errorData;
    try {
      errorData = JSON.parse(errorText);
    } catch {
      errorData = { detail: errorText };
    }

    console.error(`❌ [API ERROR] ${response.status}:`, errorData);

    // ✅ IMPROVED ERROR MESSAGE - Show all validation errors
    if (typeof errorData === "object" && !errorData.detail) {
      const errorMessages = Object.entries(errorData)
        .map(
          ([field, messages]) =>
            `${field}: ${Array.isArray(messages) ? messages.join(", ") : messages}`,
        )
        .join(" | ");
      throw new Error(`Validation Error: ${errorMessages}`);
    }

    throw new Error(
      errorData.detail || `HTTP ${response.status}: ${response.statusText}`,
    );
  }

  // Handle 204 No Content (DELETE success)
  if (response.status === 204) {
    return undefined as T;
  }

  // Parse JSON response
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const data = await response.json();
    if (VERBOSE_API_LOGS) {
      console.log(
        `✅ [API SUCCESS] ${fetchOptions.method || "GET"} ${endpoint}`,
        data,
      );
    }
    return data;
  }

  return {} as T;
};

// ============================================================
// AUTO-LOGIN FUNCTION
// ============================================================

export const autoLogin = async (): Promise<boolean> => {
  try {
    const existingToken = getToken();
    if (existingToken && !isTokenExpired(existingToken)) {
      console.log("✅ [AUTO-LOGIN] Already have valid token");
      return true;
    }

    const refreshToken = getRefreshToken();
    if (refreshToken) {
      console.log("🔄 [AUTO-LOGIN] Attempting to refresh token...");
      const newToken = await refreshAccessToken();
      if (newToken) {
        console.log("✅ [AUTO-LOGIN] Token refreshed successfully");
        return true;
      }
    }

    console.log(
      "🔑 [AUTO-LOGIN] Performing auto-login with demo credentials...",
    );
    console.log("🔑 [AUTO-LOGIN] Endpoint:", `${API_BASE_URL}/token/`); // ✅ FIXED: Use JWT endpoint

    const response = await fetch(`${API_BASE_URL}/token/`, {
      // ✅ FIXED: /login/ → /token/
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "admin",
        password: "admin123",
      }),
    });

    console.log(
      "🔑 [AUTO-LOGIN] Response status:",
      response.status,
      response.statusText,
    );

    if (!response.ok) {
      console.error("❌ [AUTO-LOGIN] Failed:", response.statusText);
      console.error(
        "❌ [AUTO-LOGIN] Check if Django server is running on http://14.224.210.210:8008/",
      );
      console.error("❌ [AUTO-LOGIN] Check if you created admin user");
      console.error("❌ [AUTO-LOGIN] Run: python manage.py createsuperuser");
      return false;
    }

    const data = await response.json();
    console.log("🔑 [AUTO-LOGIN] Response data:", data);

    if (data.access) {
      setToken(data.access);
      console.log("✅ [AUTO-LOGIN] Access token saved");
    }
    if (data.refresh) {
      setRefreshToken(data.refresh);
      console.log("✅ [AUTO-LOGIN] Refresh token saved");
    }

    console.log("✅ [AUTO-LOGIN] Auto-login successful!");
    return true;
  } catch (error) {
    console.error("❌ [AUTO-LOGIN] Error:", error);
    console.error("❌ [AUTO-LOGIN] Make sure Django backend is running!");
    console.error("❌ [AUTO-LOGIN] Commands to run:");
    console.error("   1. cd dangkiem");
    console.error("   2. python manage.py create_demo_data");
    console.error("   3. python manage.py runserver");
    return false;
  }
};

// ============================================================
// CLEAR TOKENS - Logout helper
// ============================================================

export const clearTokens = (): void => {
  clearToken();
  localStorage.removeItem("adminRefreshToken");
  console.log("🗑️ [TOKENS] All tokens cleared");
};

// ============================================================
// AUTHENTICATION API
// ============================================================

export interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    username: string;
    email: string;
    full_name: string;
    phone: string;
    avatar_url: string | null;
    role: string;
  };
}

// ============================================================
// NEW: Customer & Staff Login Response Types
// ============================================================

export interface CustomerOTPRequest {
  phone: string;
  purpose: "register" | "login";
}

export interface CustomerOTPResponse {
  success: boolean;
  message: string;
  debug_otp?: string; // Only in development
}

export interface CustomerRegisterRequest {
  phone: string;
  otp_code: string;
  full_name: string;
}

export interface CustomerLoginRequest {
  phone: string;
  password: string;
}

export interface CustomerAuthResponse {
  success: boolean;
  message: string;
  token: string;
  user_type: "customer";
  customer: {
    id: number;
    full_name: string;
    phone: string;
    email?: string;
    date_of_birth?: string;
    gender?: string;
    avatar_url?: string;
    membership_tier: string;
    loyalty_points: number;
    total_orders: number;
  };
}

export interface StaffLoginRequest {
  phone: string;
  password: string;
}

export interface StaffAuthResponse {
  success: boolean;
  message: string;
  token: string;
  user_type: "staff";
  staff: {
    id: number;
    employee_code: string;
    full_name: string;
    phone: string;
    email?: string;
    role_id: number;
    role_name: string;
    station_id: number;
    station_name: string;
    position?: string;
    avatar_url?: string;
  };
}

export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminAuthResponse {
  success: boolean;
  message: string;
  token: string;
  user_type: "admin";
  redirect_url?: string; // ✅ Admin redirect URL
  admin: {
    id: number;
    username: string;
    email: string;
    is_superuser: boolean;
    is_staff: boolean;
  };
}

export interface MeResponse {
  user_type: "customer" | "staff";
  profile: any; // Customer or Staff profile
}

export const authAPI = {
  /**
   * Login with email/username and password
   */
  login: async (email: string, password: string): Promise<LoginResponse> => {
    console.log("🔐 [AUTH API] Login request:", { email });

    // Django expects 'username' field, but we allow email or username
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: email, // Django uses 'username' field
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ [AUTH API] Login failed:", errorData);
      throw new Error(errorData.detail || "Đăng nhập thất bại");
    }

    const data = await response.json();
    console.log("✅ [AUTH API] Login successful:", data);

    return data;
  },

  // ============================================================
  // CUSTOMER AUTH - Using UNIFIED LOGIN
  // ============================================================

  /**
   * Request OTP for customer registration/login
   */
  customerRequestOTP: async (
    data: CustomerOTPRequest,
  ): Promise<CustomerOTPResponse> => {
    console.log("📱 [CUSTOMER AUTH] Request OTP:", data);

    const response = await fetch(`${API_BASE_URL}/auth/request-otp/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ [CUSTOMER AUTH] Request OTP failed:", errorData);
      throw new Error(
        errorData.message || errorData.detail || "Gửi OTP thất bại",
      );
    }

    const result = await response.json();
    console.log("✅ [CUSTOMER AUTH] OTP sent:", result);

    return result;
  },

  /**
   * Login customer with OTP (UNIFIED LOGIN)
   */
  customerLogin: async (
    data: CustomerLoginRequest,
  ): Promise<CustomerAuthResponse> => {
    console.log("🔐 [CUSTOMER AUTH] Login:", { phone: data.phone });
    console.log("🔐 [CUSTOMER AUTH] Login payload:", JSON.stringify(data));

    const response = await fetch(`${API_BASE_URL}/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ [CUSTOMER AUTH] Login failed:", errorData);

      // Handle different error formats
      if (
        errorData.non_field_errors &&
        Array.isArray(errorData.non_field_errors)
      ) {
        throw new Error(errorData.non_field_errors[0] || "Đăng nhập thất bại");
      }

      throw new Error(
        errorData.message || errorData.detail || "Đăng nhập thất bại",
      );
    }

    const result = await response.json();
    console.log("✅ [CUSTOMER AUTH] Login successful:", result);

    // Save token
    if (result.token) {
      setToken(result.token);
    }

    return result;
  },

  /**
   * Register new customer with phone + OTP + password
   */
  customerRegister: async (data: {
    phone: string;
    otp_code: string;
    full_name: string;
    password: string;
    email?: string;
  }): Promise<CustomerAuthResponse> => {
    console.log("📝 [CUSTOMER AUTH] Register:", {
      phone: data.phone,
      full_name: data.full_name,
    });

    const response = await fetch(`${API_BASE_URL}/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ [CUSTOMER AUTH] Register failed:", errorData);

      // Handle field errors
      if (errorData.phone) {
        throw new Error(errorData.phone[0] || "Số điện thoại không hợp lệ");
      }
      if (errorData.password) {
        throw new Error(errorData.password[0] || "Mật khẩu không hợp lệ");
      }

      throw new Error(
        errorData.message ||
          errorData.non_field_errors?.[0] ||
          "Đăng ký thất bại",
      );
    }

    const result = await response.json();
    console.log("✅ [CUSTOMER AUTH] Register successful:", result);

    // Save token
    if (result.token) {
      setToken(result.token);
    }

    return result;
  },

  // ============================================================
  // STAFF AUTH - Using UNIFIED LOGIN
  // ============================================================

  /**
   * Login staff with phone + password (UNIFIED LOGIN)
   */
  staffLogin: async (data: StaffLoginRequest): Promise<StaffAuthResponse> => {
    console.log("🔐 [STAFF AUTH] Login:", { phone: data.phone });

    const response = await fetch(`${API_BASE_URL}/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ [STAFF AUTH] Login failed:", errorData);
      throw new Error(
        errorData.message || errorData.detail || "Đăng nhập thất bại",
      );
    }

    const result = await response.json();
    console.log("✅ [STAFF AUTH] Login successful:", result);

    // Save token
    if (result.token) {
      setToken(result.token);
    }

    return result;
  },

  // ============================================================
  // ADMIN AUTH - Using UNIFIED LOGIN
  // ============================================================

  /**
   * Login admin with username/password (UNIFIED LOGIN)
   */
  adminLogin: async (data: AdminLoginRequest): Promise<AdminAuthResponse> => {
    console.log("🔐 [ADMIN AUTH] Login:", { username: data.username });

    // ✅ FIXED: Use JWT /token/ endpoint instead of /login/
    const response = await fetch(`${API_BASE_URL}/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ [ADMIN AUTH] Login failed:", errorData);
      throw new Error(
        errorData.detail || errorData.message || "Đăng nhập thất bại",
      );
    }

    const jwtData = await response.json();
    console.log("✅ [ADMIN AUTH] JWT received:", jwtData);

    // ✅ TRANSFORM: JWT response to AdminAuthResponse format
    const result: AdminAuthResponse = {
      success: true,
      message: "Đăng nhập thành công",
      token: jwtData.access, // ✅ Map 'access' to 'token'
      user_type: "admin",
      admin: {
        id: 0, // Will be populated from token or /auth/me/
        username: data.username,
        email: "",
        is_superuser: true,
        is_staff: true,
      },
    };

    // Save tokens
    if (jwtData.access) {
      setToken(jwtData.access);
    }
    if (jwtData.refresh) {
      setRefreshToken(jwtData.refresh);
    }

    console.log("✅ [ADMIN AUTH] Login successful:", result);
    return result;
  },

  // ============================================================
  // COMMON AUTH
  // ============================================================

  /**
   * Get current user profile
   */
  getMe: async (): Promise<MeResponse> => {
    console.log("👤 [AUTH API] Get profile");

    const token = getToken();
    if (!token) {
      throw new Error("No authentication token");
    }

    const response = await fetch(`${API_BASE_URL}/auth/me/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ [AUTH API] Get profile failed:", errorData);
      throw new Error(errorData.detail || "Lấy thông tin thất bại");
    }

    const result = await response.json();
    console.log("✅ [AUTH API] Profile retrieved:", result);

    return result;
  },

  /**
   * Logout (clears token and calls backend)
   */
  logout: async (): Promise<void> => {
    console.log("🔐 [AUTH API] Logout request");

    try {
      const token = getToken();
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });
      }
      console.log("✅ [AUTH API] Logout successful");
    } catch (error) {
      console.error("❌ [AUTH API] Logout failed:", error);
      // Continue anyway - we'll clear tokens locally
    } finally {
      clearTokens();
    }
  },
};

// ============================================================
// TYPES - ORDERS
// ============================================================

export interface OrderFilters {
  page?: number;
  page_size?: number;
  status?: string;
  priority?: string;
  search?: string;
  station?: number;
  customer?: number;
  vehicle?: number;
  date_from?: string;
  date_to?: string;
  assigned_staff?: number | string | null; // Support 'null' as string
}

export interface Order {
  id: number;
  order_code: string;
  customer: number;
  customer_name: string;
  customer_phone: string;
  vehicle: number;
  vehicle_plate: string;
  vehicle_type: string;
  station: number;
  station_name: string;
  assigned_staff: number | null;
  staff_name: string | null; // ✅ Backend trả về 'staff_name' (không phải assigned_staff_name)
  status:
    | "pending"
    | "confirmed"
    | "assigned"
    | "in_progress"
    | "completed"
    | "cancelled"; // ✅ FIXED: Match Django backend
  priority: "low" | "normal" | "high" | "urgent"; // ✅ FIXED: Added 'urgent'
  appointment_date: string;
  appointment_time: string;
  estimated_amount: string;
  additional_amount: string;
  total_amount: string;
  customer_notes?: string;
  started_at?: string;
  completed_at?: string;
  inspection_result?: "not_started" | "pass" | "fail"; // ✅ FIXED: Match Django backend
  created_at: string;
  updated_at: string;
}

export interface OrdersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Order[];
}

// ============================================================
// TYPES - EMPLOYEES
// ============================================================

export interface EmployeeFilters {
  page?: number;
  page_size?: number;
  status?: string;
  role?: number;
  station?: number;
  search?: string;
}

export interface Employee {
  id: number;
  user: number;
  employee_code: string;
  username?: string; // ✅ Added
  full_name: string;
  phone: string;
  email?: string;
  role: number;
  role_name: string;
  station: number;
  station_name: string;
  position: string;
  hire_date: string;
  address?: string; // ✅ Added
  status: "active" | "inactive" | "on_leave"; // ✅ Keep all 3 statuses
  created_at: string;
  updated_at: string;
}

export interface EmployeesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Employee[];
}

// ============================================================
// TYPES - STATIONS
// ============================================================

export interface Station {
  id: number;
  station_code: string;
  station_name: string; // ✅ Match backend field name
  address: string;
  phone?: string; // ✅ Make optional to match backend
  email?: string;
  daily_capacity?: number; // ✅ Make optional (can be null)
  working_hours?: string; // ✅ Make optional
  status: "active" | "inactive" | "maintenance";
  created_at: string;
  updated_at: string;
}

export interface StationsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Station[];
}

// ============================================================
// TYPES - VEHICLE TYPES
// ============================================================

export interface VehicleType {
  id: number;
  type_name: string;
  type_code: string;
  description: string;
  display_order: number;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface VehicleTypesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: VehicleType[];
}

// ============================================================
// TYPES - USERS
// ============================================================

export interface User {
  id: number;
  username: string;
  phone: string;
  email?: string;
  full_name: string;
  is_staff: boolean;
  is_superuser: boolean;
  status: "active" | "inactive" | "banned";
  created_at: string;
  updated_at: string;
}

// ============================================================
// TYPES - ROLES
// ============================================================

export interface Role {
  id: number;
  role_code: string;
  role_name: string;
  description: string;
  color?: string;
  priority: number;
  status?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================
// TYPES - PAYMENTS
// ============================================================

export interface Payment {
  id: number;
  payment_code: string;
  payment_type: "inspection" | "additional" | "refund" | "online" | "offline";
  order: number;
  order_code: string;
  customer_name: string;
  payment_method:
    | "cash"
    | "bank_transfer"
    | "vietqr"
    | "momo"
    | "vnpay"
    | "zalopay";
  amount: string;
  status: "pending" | "paid" | "failed" | "refunded"; // ✅ Changed 'completed' to 'paid' to match backend
  transaction_id?: string;
  vietqr_code_url?: string;
  qr_content?: string;
  notes?: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Payment[];
}

export interface PaymentFilters {
  page?: number;
  page_size?: number;
  status?: string;
  payment_method?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface CreatePaymentRequest {
  amount: number;
  user_id?: string;
  order_id?: number;
  method?: "QR" | "VNPAY" | "CASH";
}

export interface CreatePaymentResponse {
  paymentId: number;
  orderCode: number;
  qrCode: string;
  qrImageUrl: string;
  checkoutUrl: string;
  status: "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED" | "REFUNDED";
}

export interface CheckPaymentStatusResponse {
  orderCode: number;
  status: "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED" | "REFUNDED";
  amount: number;
  message: string;
}

// ============================================================
// TYPES - PRICING
// ============================================================

export interface Pricing {
  id: number;
  vehicle_type: number;
  vehicle_type_name: string;
  base_price: string;
  inspection_fee: string;
  certificate_fee: string;
  total_price: string;
  effective_from: string;
  effective_to?: string;
  status: "active" | "inactive" | "expired";
  created_at: string;
  updated_at: string;
}

export interface PricingsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pricing[];
}

// ============================================================
// TYPES - CHECKLIST ITEMS
// ============================================================

export interface ChecklistItem {
  id: number;
  item_key: string; // ✅ Changed from item_code
  item_label: string; // ✅ Changed from item_name
  category: "safety" | "emission" | "both"; // ✅ Updated to match Django model
  display_order: number;
  require_photo: boolean; // ✅ Changed from is_required
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface ChecklistItemsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ChecklistItem[];
}

export interface ChecklistFilters {
  page?: number;
  page_size?: number;
  category?: string;
  vehicle_type?: number;
  status?: string;
  search?: string;
}

// ============================================================
// TYPES - PERMISSIONS
// ============================================================

export interface Permission {
  id: number;
  permission_name: string;
  permission_code: string;
  description: string;
  module: string;
  created_at: string;
  updated_at: string;
}

export interface RolePermission {
  id: number;
  role: number;
  role_name: string;
  permission: number;
  permission_name: string;
  permission_code: string;
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================
// TYPES - ANALYTICS
// ============================================================

export interface AnalyticsOverview {
  total_orders: number;
  total_revenue: string;
  total_customers: number;
  total_vehicles: number;
  orders_by_status: {
    waiting: number;
    processing: number;
    completed: number;
    cancelled: number;
  };
  payments_by_status: {
    pending: number;
    paid: number;
    failed: number;
    refunded: number;
  };
  top_stations: Array<{
    station_id: number;
    station_name: string;
    orders: number;
    revenue: string;
  }>;
  revenue_by_station: Array<{
    station_id: number;
    station_name: string;
    revenue: string;
  }>;
  orders_by_date: Array<{
    date: string;
    orders: number;
    revenue: string;
  }>;
  top_vehicle_types: Array<{
    vehicle_type_id: number;
    vehicle_type_name: string;
    count: number;
  }>;
}

export interface AnalyticsFilters {
  date_from?: string;
  date_to?: string;
  station?: number;
}

// ============================================================
// TYPES - SYSTEM SETTINGS
// ============================================================

export interface SystemSetting {
  id: number;
  setting_key: string;
  setting_group: string;
  setting_name: string;
  setting_value: string | null;
  default_value: string | null;
  value_type: "string" | "number" | "boolean" | "json";
  description: string | null;
  is_public: boolean;
  is_editable: boolean;
  validation_rule: string | null;
  allowed_values: string | null;
  display_order: number;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface SystemSettingsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SystemSetting[];
}

export interface SystemSettingFilters {
  group?: string;
}

// ============================================================
// ORDERS API
// ============================================================

export const orderAPI = {
  /**
   * Get orders list with pagination and filters
   */
  getOrders: async (filters?: OrderFilters): Promise<OrdersResponse> => {
    const params = new URLSearchParams();

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.page_size)
      params.append("page_size", filters.page_size.toString());
    if (filters?.status) params.append("status", filters.status);
    if (filters?.priority) params.append("priority", filters.priority);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.station) params.append("station", filters.station.toString());
    if (filters?.customer)
      params.append("customer", filters.customer.toString());
    if (filters?.vehicle) params.append("vehicle", filters.vehicle.toString());
    if (filters?.date_from) params.append("date_from", filters.date_from);
    if (filters?.date_to) params.append("date_to", filters.date_to);
    if (filters?.assigned_staff !== undefined) {
      params.append(
        "assigned_staff",
        filters.assigned_staff?.toString() || "null",
      );
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/orders/?${queryString}` : "/orders/"; // ✅ FIXED: Removed /api/ prefix (already in API_BASE_URL)

    return apiCall<OrdersResponse>(endpoint);
  },

  /**
   * Get single order by ID
   */
  getOrder: async (id: number): Promise<Order> => {
    return apiCall<Order>(`/orders/${id}/`); // ✅ FIXED: Removed /api/ prefix
  },

  /**
   * Update order
   */
  updateOrder: async (id: number, data: Partial<Order>): Promise<Order> => {
    return apiCall<Order>(`/orders/${id}/`, {
      // ✅ FIXED: Removed /api/ prefix
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * Assign staff to order
   */
  assignStaff: async (
    orderId: number,
    staffId: number | null,
  ): Promise<Order> => {
    // ✅ Use custom action endpoint
    return apiCall<Order>(`/orders/${orderId}/assign_staff/`, {
      method: "POST",
      body: JSON.stringify({ staff_id: staffId }),
    });
  },

  /**
   * Update order status
   */
  updateStatus: async (
    orderId: number,
    status: Order["status"],
  ): Promise<Order> => {
    return apiCall<Order>(`/orders/${orderId}/`, {
      // ✅ FIXED: Removed /api/ prefix
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  /**
   * Update order priority
   */
  updatePriority: async (
    orderId: number,
    priority: Order["priority"],
  ): Promise<Order> => {
    return apiCall<Order>(`/orders/${orderId}/`, {
      // ✅ FIXED: Removed /api/ prefix
      method: "PATCH",
      body: JSON.stringify({ priority }),
    });
  },

  /**
   * Delete order
   */
  deleteOrder: async (id: number): Promise<void> => {
    return apiCall<void>(`/orders/${id}/`, {
      // ✅ FIXED: Removed /api/ prefix
      method: "DELETE",
    });
  },
};

// ============================================================
// EMPLOYEES API
// ============================================================

export const employeeAPI = {
  /**
   * Get employees list with pagination and filters
   */
  getEmployees: async (filters?: EmployeeFilters): Promise<Employee[]> => {
    const params = new URLSearchParams();

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.page_size)
      params.append("page_size", filters.page_size.toString());
    if (filters?.status) params.append("status", filters.status);
    if (filters?.role) params.append("role", filters.role.toString());
    if (filters?.station) params.append("station", filters.station.toString());
    if (filters?.search) params.append("search", filters.search);

    const queryString = params.toString();
    const endpoint = queryString ? `/staff/?${queryString}` : "/staff/"; // ✅ FIXED: Removed /api/ prefix (already in API_BASE_URL)

    const response = await apiCall<any>(endpoint);

    // Backend có thể trả về Array hoặc { results: [] }
    if (Array.isArray(response)) {
      return response;
    } else if (response.results && Array.isArray(response.results)) {
      return response.results;
    }
    return [];
  },

  /**
   * Get single employee by ID
   */
  getEmployee: async (id: number): Promise<Employee> => {
    return apiCall<Employee>(`/staff/${id}/`); // ✅ FIXED: Removed /api/ prefix
  },

  /**
   * Create employee
   */
  createEmployee: async (data: Partial<Employee>): Promise<Employee> => {
    return apiCall<Employee>("/staff/", {
      // ✅ FIXED: Removed /api/ prefix
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Update employee
   */
  updateEmployee: async (
    id: number,
    data: Partial<Employee>,
  ): Promise<Employee> => {
    return apiCall<Employee>(`/staff/${id}/`, {
      // ✅ FIXED: Removed /api/ prefix
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete employee
   */
  deleteEmployee: async (id: number): Promise<void> => {
    return apiCall<void>(`/staff/${id}/`, {
      // ✅ FIXED: Removed /api/ prefix
      method: "DELETE",
    });
  },
};

// ============================================================
// STATIONS API
// ============================================================

export const stationAPI = {
  getStations: async (): Promise<StationsResponse> => {
    return apiCall<StationsResponse>("/stations/");
  },

  getStation: async (id: number): Promise<Station> => {
    return apiCall<Station>(`/stations/${id}/`);
  },

  createStation: async (data: Partial<Station>): Promise<Station> => {
    return apiCall<Station>("/stations/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateStation: async (
    id: number,
    data: Partial<Station>,
  ): Promise<Station> => {
    return apiCall<Station>(`/stations/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  deleteStation: async (id: number): Promise<void> => {
    return apiCall<void>(`/stations/${id}/`, {
      method: "DELETE",
    });
  },
};

// ============================================================
// VEHICLE TYPES API
// ============================================================

export const vehicleTypeAPI = {
  getVehicleTypes: async (): Promise<VehicleTypesResponse> => {
    return apiCall<VehicleTypesResponse>("/vehicle-types/");
  },

  getVehicleType: async (id: number): Promise<VehicleType> => {
    return apiCall<VehicleType>(`/vehicle-types/${id}/`);
  },

  createVehicleType: async (
    data: Partial<VehicleType>,
  ): Promise<VehicleType> => {
    return apiCall<VehicleType>("/vehicle-types/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateVehicleType: async (
    id: number,
    data: Partial<VehicleType>,
  ): Promise<VehicleType> => {
    return apiCall<VehicleType>(`/vehicle-types/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  deleteVehicleType: async (id: number): Promise<void> => {
    return apiCall<void>(`/vehicle-types/${id}/`, {
      method: "DELETE",
    });
  },
};

// ============================================================
// USERS API
// ============================================================

export const userAPI = {
  getUsers: async (): Promise<User[]> => {
    return apiCall<User[]>("/users/");
  },

  getUser: async (id: number): Promise<User> => {
    return apiCall<User>(`/users/${id}/`);
  },

  createUser: async (data: Partial<User>): Promise<User> => {
    return apiCall<User>("/users/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateUser: async (id: number, data: Partial<User>): Promise<User> => {
    return apiCall<User>(`/users/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  deleteUser: async (id: number): Promise<void> => {
    return apiCall<void>(`/users/${id}/`, {
      method: "DELETE",
    });
  },
};

// ============================================================
// ROLES API
// ============================================================

export const roleAPI = {
  getRoles: async (): Promise<{ results: Role[] }> => {
    const data = await apiCall<Role[]>("/roles/");
    return { results: Array.isArray(data) ? data : [] };
  },

  getRole: async (id: number): Promise<Role> => {
    return apiCall<Role>(`/roles/${id}/`);
  },

  createRole: async (data: Partial<Role>): Promise<Role> => {
    return apiCall<Role>("/roles/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateRole: async (id: number, data: Partial<Role>): Promise<Role> => {
    return apiCall<Role>(`/roles/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  deleteRole: async (id: number): Promise<void> => {
    return apiCall<void>(`/roles/${id}/`, {
      method: "DELETE",
    });
  },
};

// ============================================================
// PAYMENTS API
// ============================================================

export const paymentAPI = {
  /**
   * Get payments list with pagination and filters
   */
  getPayments: async (
    filters?: PaymentFilters,
  ): Promise<PaymentsResponse | Payment[]> => {
    const params = new URLSearchParams();

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.page_size)
      params.append("page_size", filters.page_size.toString());
    if (filters?.status) params.append("status", filters.status);
    if (filters?.payment_method)
      params.append("payment_method", filters.payment_method);
    if (filters?.date_from) params.append("date_from", filters.date_from);
    if (filters?.date_to) params.append("date_to", filters.date_to);
    if (filters?.search) params.append("search", filters.search);

    const queryString = params.toString();
    const endpoint = queryString ? `/payments/?${queryString}` : "/payments/";

    return apiCall<PaymentsResponse | Payment[]>(endpoint);
  },

  /**
   * Get single payment by ID
   */
  getPayment: async (id: number): Promise<Payment> => {
    return apiCall<Payment>(`/payments/${id}/`);
  },

  /**
   * Create payment
   */
  createPayment: async (data: Partial<Payment>): Promise<Payment> => {
    return apiCall<Payment>("/payments/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Update payment
   */
  updatePayment: async (
    id: number,
    data: Partial<Payment>,
  ): Promise<Payment> => {
    return apiCall<Payment>(`/payments/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete payment
   */
  deletePayment: async (id: number): Promise<void> => {
    return apiCall<void>(`/payments/${id}/`, {
      method: "DELETE",
    });
  },

  /**
   * Create payment session for PayOS-style QR flow
   */
  createPaymentSession: async (
    data: CreatePaymentRequest,
  ): Promise<CreatePaymentResponse> => {
    return apiCall<CreatePaymentResponse>("/create-payment/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Poll payment status by order code
   */
  checkPaymentStatus: async (
    orderCode: number,
  ): Promise<CheckPaymentStatusResponse> => {
    return apiCall<CheckPaymentStatusResponse>(
      `/check-payment-status/${orderCode}/`,
    );
  },
};

// ============================================================
// PRICINGS API
// ============================================================

export const pricingAPI = {
  /**
   * Get pricings list with pagination and filters
   */
  getPricings: async (): Promise<PricingsResponse> => {
    return apiCall<PricingsResponse>("/pricings/");
  },

  /**
   * Get single pricing by ID
   */
  getPricing: async (id: number): Promise<Pricing> => {
    return apiCall<Pricing>(`/pricings/${id}/`);
  },

  /**
   * Create pricing
   */
  createPricing: async (data: Partial<Pricing>): Promise<Pricing> => {
    return apiCall<Pricing>("/pricings/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Update pricing
   */
  updatePricing: async (
    id: number,
    data: Partial<Pricing>,
  ): Promise<Pricing> => {
    return apiCall<Pricing>(`/pricings/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete pricing
   */
  deletePricing: async (id: number): Promise<void> => {
    return apiCall<void>(`/pricings/${id}/`, {
      method: "DELETE",
    });
  },
};

// ============================================================
// CHECKLIST ITEMS API
// ============================================================

export const checklistItemAPI = {
  /**
   * Get checklist items list with pagination and filters
   */
  getChecklistItems: async (
    filters?: ChecklistFilters,
  ): Promise<ChecklistItemsResponse> => {
    const params = new URLSearchParams();

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.page_size)
      params.append("page_size", filters.page_size.toString());
    if (filters?.category) params.append("category", filters.category);
    if (filters?.vehicle_type)
      params.append("vehicle_type", filters.vehicle_type.toString());
    if (filters?.status) params.append("status", filters.status);
    if (filters?.search) params.append("search", filters.search);

    const queryString = params.toString();
    const endpoint = queryString
      ? `/checklist-items/?${queryString}`
      : "/checklist-items/";

    return apiCall<ChecklistItemsResponse>(endpoint);
  },

  /**
   * Get single checklist item by ID
   */
  getChecklistItem: async (id: number): Promise<ChecklistItem> => {
    return apiCall<ChecklistItem>(`/checklist-items/${id}/`);
  },

  /**
   * Create checklist item
   */
  createChecklistItem: async (
    data: Partial<ChecklistItem>,
  ): Promise<ChecklistItem> => {
    return apiCall<ChecklistItem>("/checklist-items/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Update checklist item
   */
  updateChecklistItem: async (
    id: number,
    data: Partial<ChecklistItem>,
  ): Promise<ChecklistItem> => {
    return apiCall<ChecklistItem>(`/checklist-items/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete checklist item
   */
  deleteChecklistItem: async (id: number): Promise<void> => {
    return apiCall<void>(`/checklist-items/${id}/`, {
      method: "DELETE",
    });
  },
};

// ============================================================
// PERMISSIONS API
// ============================================================

export const permissionAPI = {
  /**
   * Get permissions list
   */
  getPermissions: async (): Promise<{ results: Permission[] }> => {
    const data = await apiCall<Permission[]>("/permissions/");
    return { results: Array.isArray(data) ? data : [] };
  },

  /**
   * Get single permission by ID
   */
  getPermission: async (id: number): Promise<Permission> => {
    return apiCall<Permission>(`/permissions/${id}/`);
  },

  /**
   * Create permission
   */
  createPermission: async (data: Partial<Permission>): Promise<Permission> => {
    return apiCall<Permission>("/permissions/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Update permission
   */
  updatePermission: async (
    id: number,
    data: Partial<Permission>,
  ): Promise<Permission> => {
    return apiCall<Permission>(`/permissions/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete permission
   */
  deletePermission: async (id: number): Promise<void> => {
    return apiCall<void>(`/permissions/${id}/`, {
      method: "DELETE",
    });
  },
};

export const rolePermissionAPI = {
  /**
   * Get role permissions list
   */
  getRolePermissions: async (): Promise<{ results: RolePermission[] }> => {
    const data = await apiCall<RolePermission[]>("/role-permissions/");
    return { results: Array.isArray(data) ? data : [] };
  },

  /**
   * Get single role permission by ID
   */
  getRolePermission: async (id: number): Promise<RolePermission> => {
    return apiCall<RolePermission>(`/role-permissions/${id}/`);
  },

  /**
   * Create role permission
   */
  createRolePermission: async (
    data: Partial<RolePermission>,
  ): Promise<RolePermission> => {
    return apiCall<RolePermission>("/role-permissions/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Update role permission
   */
  updateRolePermission: async (
    id: number,
    data: Partial<RolePermission>,
  ): Promise<RolePermission> => {
    return apiCall<RolePermission>(`/role-permissions/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete role permission
   */
  deleteRolePermission: async (id: number): Promise<void> => {
    return apiCall<void>(`/role-permissions/${id}/`, {
      method: "DELETE",
    });
  },
};

// ============================================================
// ANALYTICS API
// ============================================================

export const analyticsAPI = {
  /**
   * Get analytics overview
   */
  getOverview: async (
    filters?: AnalyticsFilters,
  ): Promise<AnalyticsOverview> => {
    const params = new URLSearchParams();

    if (filters?.date_from) params.append("date_from", filters.date_from);
    if (filters?.date_to) params.append("date_to", filters.date_to);
    if (filters?.station) params.append("station", filters.station.toString());

    const queryString = params.toString();
    const endpoint = queryString
      ? `/analytics/overview/?${queryString}`
      : "/analytics/overview/";

    return apiCall<AnalyticsOverview>(endpoint);
  },
};

// ============================================================
// SYSTEM SETTINGS API
// ============================================================

export const systemSettingAPI = {
  /**
   * Get system settings list with optional group filter
   */
  getSettings: async (
    filters?: SystemSettingFilters,
  ): Promise<SystemSettingsResponse> => {
    const params = new URLSearchParams();

    if (filters?.group) params.append("group", filters.group);

    const queryString = params.toString();
    const endpoint = queryString
      ? `/system-settings/?${queryString}`
      : "/system-settings/";

    return apiCall<SystemSettingsResponse>(endpoint);
  },

  /**
   * Get public settings (no auth required)
   */
  getPublicSettings: async (): Promise<SystemSetting[]> => {
    return apiCall<SystemSetting[]>("/system-settings/public/", {
      requireAuth: false,
    });
  },

  /**
   * Get single setting by ID
   */
  getSetting: async (id: number): Promise<SystemSetting> => {
    return apiCall<SystemSetting>(`/system-settings/${id}/`);
  },

  /**
   * Create setting
   */
  createSetting: async (
    data: Partial<SystemSetting>,
  ): Promise<SystemSetting> => {
    return apiCall<SystemSetting>("/system-settings/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Update setting
   */
  updateSetting: async (
    id: number,
    data: Partial<SystemSetting>,
  ): Promise<SystemSetting> => {
    return apiCall<SystemSetting>(`/system-settings/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete setting
   */
  deleteSetting: async (id: number): Promise<void> => {
    return apiCall<void>(`/system-settings/${id}/`, {
      method: "DELETE",
    });
  },
};

// ============================================================
// EXPORT ALL
// ============================================================

export default {
  // Auth
  authAPI,
  autoLogin,
  getToken,
  setToken,
  clearToken,
  clearTokens,
  getRefreshToken,
  setRefreshToken,
  isTokenExpired,
  refreshAccessToken,

  // API Objects
  orderAPI,
  employeeAPI,
  stationAPI,
  vehicleTypeAPI,
  userAPI,
  roleAPI,
  paymentAPI,
  pricingAPI,
  checklistItemAPI,
  permissionAPI,
  rolePermissionAPI,
  analyticsAPI,
  systemSettingAPI,

  // Generic API call
  apiCall,
};
