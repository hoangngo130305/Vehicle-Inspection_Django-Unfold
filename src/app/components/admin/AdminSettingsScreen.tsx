import { 
  Save,
  Bell,
  Shield,
  Palette,
  Info
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { toast } from 'sonner';
import { useState } from 'react';

export default function AdminSettingsScreen() {
  const [settings, setSettings] = useState({
    // Thông báo
    emailNotification: true,
    smsNotification: true,
    pushNotification: false,
    
    // Bảo mật
    autoLogout: true,
    sessionTimeout: 30,
    
    // Giao diện
    companyName: 'Hệ thống Đăng Kiểm',
    companyPhone: '1900-xxxx',
    companyEmail: 'support@dangkiem.vn',
  });

  const handleSave = () => {
    toast.success('Đã lưu cài đặt thành công');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cài đặt</h1>
            <p className="text-gray-500 text-sm mt-1">
              Cấu hình cài đặt hệ thống
            </p>
          </div>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
          >
            <Save size={20} />
            Lưu thay đổi
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Thông báo */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Bell size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Thông báo</h3>
                  <p className="text-xs text-gray-500">Cấu hình các kênh thông báo</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <p className="font-medium text-gray-900">Email thông báo</p>
                  <p className="text-xs text-gray-500 mt-0.5">Gửi email khi có đơn hàng mới</p>
                </div>
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={settings.emailNotification} 
                    onChange={(e) => setSettings({ ...settings, emailNotification: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <p className="font-medium text-gray-900">SMS thông báo</p>
                  <p className="text-xs text-gray-500 mt-0.5">Gửi SMS cho khách hàng</p>
                </div>
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={settings.smsNotification} 
                    onChange={(e) => setSettings({ ...settings, smsNotification: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <p className="font-medium text-gray-900">Push notification</p>
                  <p className="text-xs text-gray-500 mt-0.5">Thông báo trên ứng dụng</p>
                </div>
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={settings.pushNotification} 
                    onChange={(e) => setSettings({ ...settings, pushNotification: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
              </label>
            </div>
          </div>

          {/* Bảo mật */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Shield size={20} className="text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Bảo mật</h3>
                  <p className="text-xs text-gray-500">Cài đặt bảo mật hệ thống</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <p className="font-medium text-gray-900">Tự động đăng xuất</p>
                  <p className="text-xs text-gray-500 mt-0.5">Đăng xuất khi không hoạt động</p>
                </div>
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={settings.autoLogout} 
                    onChange={(e) => setSettings({ ...settings, autoLogout: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
              </label>

              <div>
                <label className="block font-medium text-gray-900 mb-2">
                  Thời gian tự động đăng xuất
                </label>
                <div className="relative">
                  <select
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
                    disabled={!settings.autoLogout}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value={15}>15 phút</option>
                    <option value={30}>30 phút</option>
                    <option value={60}>1 giờ</option>
                    <option value={120}>2 giờ</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Thông tin công ty */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm lg:col-span-2">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Info size={20} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Thông tin công ty</h3>
                  <p className="text-xs text-gray-500">Thông tin hiển thị trên hệ thống</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium text-gray-900 mb-2">
                    Tên công ty
                  </label>
                  <input
                    type="text"
                    value={settings.companyName}
                    onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Hệ thống Đăng Kiểm"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-900 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    value={settings.companyPhone}
                    onChange={(e) => setSettings({ ...settings, companyPhone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1900-xxxx"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-900 mb-2">
                    Email hỗ trợ
                  </label>
                  <input
                    type="email"
                    value={settings.companyEmail}
                    onChange={(e) => setSettings({ ...settings, companyEmail: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="support@dangkiem.vn"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <Info size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">Lưu ý khi thay đổi cài đặt</p>
            <p className="text-blue-800">
              Các thay đổi sẽ được áp dụng ngay lập tức cho toàn bộ hệ thống. 
              Vui lòng kiểm tra kỹ trước khi lưu.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
