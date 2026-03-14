import { Toaster } from 'sonner';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { StationsProvider } from './contexts/StationsContext';
import { useState } from 'react';

// Lazy load components
import AuthScreen from './components/AuthScreen';

// User Components
import UserApp from './components/UserApp';
import HomeScreen from './components/HomeScreen';
import UtilitiesApp from './components/UtilitiesApp';
import UtilitiesScreen from './components/UtilitiesScreen';
import CameraListScreen from './components/CameraListScreen';
import PenaltiesScreen from './components/PenaltiesScreen';
import VehicleManagementScreen from './components/VehicleManagementScreen';
import NewBookingScreen from './components/NewBookingScreen';
import MapScreen from './components/MapScreen';
import ProfileScreen from './components/ProfileScreen';
import TrackingScreen from './components/TrackingScreen';
import OrderHistoryScreen from './components/OrderHistoryScreen';
import VehicleReceiptScreen from './components/VehicleReceiptScreen';
import RatingScreen from './components/RatingScreen';
import InvoiceScreen from './components/InvoiceScreen';
import PersonalInfoScreen from './components/PersonalInfoScreen';
import NotificationsScreen from './components/NotificationsScreen';
import SettingsScreen from './components/SettingsScreen';
import SecurityScreen from './components/SecurityScreen';
import HelpScreen from './components/HelpScreen';

// Staff Components
import StaffApp from './components/staff/StaffApp';
import StaffHomeScreen from './components/staff/StaffHomeScreen';
import StaffOrdersScreen from './components/staff/StaffOrdersScreen';
import StaffOrderDetailScreen from './components/staff/StaffOrderDetailScreen';
import StaffVehicleReceiptScreen from './components/staff/VehicleReceiptScreen';
import StaffVehicleReturnScreen from './components/staff/VehicleReturnScreen';
import StaffDocumentUploadScreen from './components/staff/DocumentUploadScreen';
import StaffChatScreen from './components/staff/StaffChatScreen';
import StaffProfileScreen from './components/staff/StaffProfileScreen';
import StaffPersonalInfoScreen from './components/staff/StaffPersonalInfoScreen';
import StaffNotificationsScreen from './components/staff/StaffNotificationsScreen';
import StaffSettingsScreen from './components/staff/StaffSettingsScreen';
import StaffSecurityScreen from './components/staff/StaffSecurityScreen';
import StaffHelpScreen from './components/staff/StaffHelpScreen';

// Admin Components
import AdminOrdersScreen from './components/admin/AdminOrdersScreen';
import AdminMapScreen from './components/admin/AdminMapScreen';
import AdminFinanceScreen from './components/admin/AdminFinanceScreen';
import AdminStationsScreen from './components/admin/AdminStationsScreen';
import AdminReportsScreen from './components/admin/AdminReportsScreen';
import AdminSettingsScreen from './components/admin/AdminSettingsScreen';
import AdminPermissionsScreen from './components/admin/AdminPermissionsScreen';
import AdminEmployeesScreen from './components/admin/AdminEmployeesScreen';
import AdminPricingScreen from './components/admin/AdminPricingScreen';
import AdminChecklistScreen from './components/admin/AdminChecklistScreen';
import AdminVehicleTypesScreen from './components/admin/AdminVehicleTypesScreen';

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    return (
      <Routes>
        {user.role === 'user' && (
          <>
            <Route element={<UtilitiesApp />}>
              <Route path="/utilities" element={<UtilitiesScreen />} />
              <Route path="/cameras" element={<CameraListScreen />} />
              <Route path="/penalties" element={<PenaltiesScreen />} />
            </Route>
            
            <Route path="/" element={<UserApp />}>
              <Route index element={<Navigate to="/utilities" replace />} />
              <Route path="home" element={<HomeScreen />} />
              <Route path="vehicles" element={<VehicleManagementScreen />} />
              <Route path="booking" element={<NewBookingScreen />} />
              <Route path="map" element={<MapScreen />} />
              <Route path="profile" element={<ProfileScreen />} />
              <Route path="orders" element={<OrderHistoryScreen />} />
              <Route path="tracking/:orderId" element={<TrackingScreen />} />
              <Route path="vehicle-receipt/:orderId" element={<VehicleReceiptScreen />} />
              <Route path="rating/:orderId" element={<RatingScreen />} />
              <Route path="invoice/:orderId" element={<InvoiceScreen />} />
              <Route path="personal-info" element={<PersonalInfoScreen />} />
              <Route path="notifications" element={<NotificationsScreen />} />
              <Route path="settings" element={<SettingsScreen />} />
              <Route path="security" element={<SecurityScreen />} />
              <Route path="help" element={<HelpScreen />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/utilities" replace />} />
          </>
        )}

        {user.role === 'staff' && (
          <>
            <Route path="/staff" element={<StaffApp />}>
              <Route index element={<StaffHomeScreen />} />
              <Route path="orders" element={<StaffOrdersScreen />} />
              <Route path="order/:orderId" element={<StaffOrderDetailScreen />} />
              <Route path="profile" element={<StaffProfileScreen />} />
              <Route path="vehicle-receipt/:orderId" element={<StaffVehicleReceiptScreen />} />
              <Route path="vehicle-return/:orderId" element={<StaffVehicleReturnScreen />} />
              <Route path="document-upload/:orderId" element={<StaffDocumentUploadScreen />} />
              <Route path="chat/:orderId" element={<StaffChatScreen />} />
              <Route path="personal-info" element={<StaffPersonalInfoScreen />} />
              <Route path="notifications" element={<StaffNotificationsScreen />} />
              <Route path="settings" element={<StaffSettingsScreen />} />
              <Route path="security" element={<StaffSecurityScreen />} />
              <Route path="help" element={<StaffHelpScreen />} />
            </Route>
            <Route path="/" element={<Navigate to="/staff" replace />} />
            <Route path="*" element={<Navigate to="/staff" replace />} />
          </>
        )}

        {user.role === 'admin' && (
          <>
            <Route path="/admin/orders" element={<AdminOrdersScreen />} />
            <Route path="/admin/map" element={<AdminMapScreen />} />
            <Route path="/admin/finance" element={<AdminFinanceScreen />} />
            <Route path="/admin/stations" element={<AdminStationsScreen />} />
            <Route path="/admin/reports" element={<AdminReportsScreen />} />
            <Route path="/admin/settings" element={<AdminSettingsScreen />} />
            <Route path="/admin/permissions" element={<AdminPermissionsScreen />} />
            <Route path="/admin/employees" element={<AdminEmployeesScreen />} />
            <Route path="/admin/pricing" element={<AdminPricingScreen />} />
            <Route path="/admin/checklist" element={<AdminChecklistScreen />} />
            <Route path="/admin/vehicle-types" element={<AdminVehicleTypesScreen />} />
            <Route path="/admin" element={<Navigate to="/admin/orders" replace />} />
            <Route path="/" element={<Navigate to="/admin/orders" replace />} />
            <Route path="*" element={<Navigate to="/admin/orders" replace />} />
          </>
        )}
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="*" element={<AuthScreen onLoginSuccess={() => {}} />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <StationsProvider>
          <Toaster position="top-center" richColors />
          <AppRoutes />
        </StationsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}