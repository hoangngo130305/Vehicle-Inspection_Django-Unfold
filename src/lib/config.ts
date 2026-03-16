/**
 * API Configuration - Đăng Kiểm Việt Admin Web
 * Centralized config for API endpoints and environment settings
 */

// ============================================================
// API BASE URLs
// ============================================================

/**
 * Django Backend API Base URL
 * Hard-coded to localhost for development
 */
export const API_BASE_URL = "http://14.224.210.210:8008/api";

/**
 * Media/Upload Base URL (for images, PDFs, etc.)
 */
export const MEDIA_BASE_URL = "http://14.224.210.210:8008";

/**
 * Get full URL for media files (PDF, images)
 * @param path - Media file path from API (e.g., "/media/legal_documents/abc.pdf")
 * @returns Full URL with backend base URL
 */
export function getMediaUrl(path: string): string {
  if (!path) return "";
  // If path already has http/https, return as is
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  // Otherwise, prepend backend URL
  return `${MEDIA_BASE_URL}${path}`;
}

// ============================================================
// STORAGE KEYS
// ============================================================

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "adminToken",
  REFRESH_TOKEN: "adminRefreshToken",
  USER_DATA: "adminUser",
  AUTH_FLAG: "adminAuth",
};

// ============================================================
// REQUEST CONFIGURATION
// ============================================================

/**
 * Request timeout in milliseconds
 */
export const REQUEST_TIMEOUT = 30000; // 30 seconds

/**
 * Token refresh buffer time (seconds before actual expiry)
 * Increased from 60 to 300 seconds (5 minutes) for better UX
 */
export const TOKEN_REFRESH_BUFFER = 300; // 5 minutes before expiry

// ============================================================
// DEBUG CONFIGURATION
// ============================================================

/**
 * Enable debug mode (console logs)
 */
export const DEBUG = true;

/**
 * Enable verbose API logging
 */
export const VERBOSE_API_LOGS = true; // Set to false to disable detailed logs

// ============================================================
// DEFAULT VALUES
// ============================================================

export const DEFAULT_VALUES = {
  COMPANY_NAME: "Trung Tâm Hỗ Trợ Dịch vụ Đăng kiểm Việt DKV 50S",
  TAX_CODE: "00005",
  ADDRESS: "26B Đường 34 Phường Thủ Đức, TP. Thủ Đức, TP. HCM",
  EMAIL: "dangkiemvietdkv@gmail.com",
  HOTLINE: "0944484444",
  WORKING_HOURS: "Thứ 2 - Thứ 7: 8:00 - 17:00\nChủ nhật: 8:00 - 12:00",
};

// ============================================================
// PAGINATION DEFAULTS
// ============================================================

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

// ============================================================
// API ENDPOINTS (for reference)
// ============================================================

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: "/auth/login/",
  LOGOUT: "/auth/logout/",
  REFRESH_TOKEN: "/token/refresh/", // ✅ FIXED: Removed /auth/ prefix to match Django backend
  PROFILE: "/auth/profile/",

  // Orders
  ORDERS: "/orders/",
  ORDER_DETAIL: (id: number) => `/orders/${id}/`,

  // Employees
  EMPLOYEES: "/employees/",
  EMPLOYEE_DETAIL: (id: number) => `/employees/${id}/`,

  // Stations
  STATIONS: "/stations/",
  STATION_DETAIL: (id: number) => `/stations/${id}/`,

  // Vehicle Types
  VEHICLE_TYPES: "/vehicle-types/",
  VEHICLE_TYPE_DETAIL: (id: number) => `/vehicle-types/${id}/`,

  // Vehicles
  VEHICLES: "/vehicles/",
  VEHICLE_DETAIL: (id: number) => `/vehicles/${id}/`,

  // Users
  USERS: "/users/",
  USER_DETAIL: (id: number) => `/users/${id}/`,

  // Roles
  ROLES: "/roles/",
  ROLE_DETAIL: (id: number) => `/roles/${id}/`,

  // Permissions
  PERMISSIONS: "/permissions/",
  PERMISSION_DETAIL: (id: number) => `/permissions/${id}/`,

  // Pricing
  PRICING: "/pricing/",
  PRICING_DETAIL: (id: number) => `/pricing/${id}/`,

  // Payments
  PAYMENTS: "/payments/",
  PAYMENT_DETAIL: (id: number) => `/payments/${id}/`,

  // Ratings
  RATINGS: "/ratings/",
  RATING_DETAIL: (id: number) => `/ratings/${id}/`,

  // Notifications
  NOTIFICATIONS: "/notifications/",
  NOTIFICATION_DETAIL: (id: number) => `/notifications/${id}/`,

  // System Settings
  SYSTEM_SETTINGS: "/system-settings/",
  SYSTEM_SETTING_DETAIL: (id: number) => `/system-settings/${id}/`,

  // Chat Messages
  CHAT_MESSAGES: "/chat-messages/",
  CHAT_MESSAGE_DETAIL: (id: number) => `/chat-messages/${id}/`,

  // Checklists
  CHECKLIST_ITEMS: "/checklist-items/",
  CHECKLIST_ITEM_DETAIL: (id: number) => `/checklist-items/${id}/`,

  // Order Checklists
  ORDER_CHECKLISTS: "/order-checklists/",
  ORDER_CHECKLIST_DETAIL: (id: number) => `/order-checklists/${id}/`,

  // Order Status History
  ORDER_STATUS_HISTORY: "/order-status-history/",
  ORDER_STATUS_HISTORY_DETAIL: (id: number) => `/order-status-history/${id}/`,
};

// ============================================================
// EXPORT ALL
// ============================================================

export default {
  API_BASE_URL,
  MEDIA_BASE_URL,
  STORAGE_KEYS,
  REQUEST_TIMEOUT,
  TOKEN_REFRESH_BUFFER,
  DEBUG,
  VERBOSE_API_LOGS,
  DEFAULT_VALUES,
  PAGINATION,
  API_ENDPOINTS,
  getMediaUrl,
};