import { useNavigate } from 'react-router';
import { ArrowLeft, Bell } from 'lucide-react';
import { useState } from 'react';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export default function StaffNotificationsScreen() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'admin-status-change',
      title: 'Admin thay đổi trạng thái',
      description: 'Nhận thông báo khi admin thay đổi trạng thái đơn hàng',
      enabled: true,
    },
    {
      id: 'new-order',
      title: 'Đơn hàng mới',
      description: 'Nhận thông báo khi có đơn hàng mới được phân công',
      enabled: true,
    },
    {
      id: 'order-update',
      title: 'Cập nhật đơn hàng',
      description: 'Nhận thông báo khi khách hàng thay đổi thông tin',
      enabled: true,
    },
    {
      id: 'customer-message',
      title: 'Tin nhắn khách hàng',
      description: 'Nhận thông báo khi có tin nhắn mới từ khách hàng',
      enabled: true,
    },
    {
      id: 'payment-received',
      title: 'Thanh toán thành công',
      description: 'Nhận thông báo khi khách hàng thanh toán',
      enabled: true,
    },
    {
      id: 'schedule-reminder',
      title: 'Nhắc lịch hẹn',
      description: 'Nhắc nhở trước 30 phút khi có lịch hẹn',
      enabled: true,
    },
    {
      id: 'rating-received',
      title: 'Đánh giá mới',
      description: 'Nhận thông báo khi khách hàng đánh giá dịch vụ',
      enabled: true,
    },
  ]);

  const toggleSetting = (id: string) => {
    setSettings(settings.map(setting =>
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    ));
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col max-w-md mx-auto">
      {/* Header - Fixed */}
      <div className="sticky top-0 z-40 bg-white px-5 pt-12 pb-4 rounded-b-[2rem] shadow-md border-b border-gray-100 relative overflow-hidden">
        {/* Decorative Circle Patterns */}
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute top-6 right-8 w-24 h-24 border-2 border-blue-600 rounded-full"></div>
          <div className="absolute top-10 right-24 w-16 h-16 border-2 border-green-600 rounded-full"></div>
          <div className="absolute bottom-2 left-6 w-28 h-28 border-2 border-blue-600 rounded-full"></div>
          <div className="absolute bottom-4 left-28 w-10 h-10 border border-green-600 rounded-full"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/staff/profile')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} strokeWidth={2.5} />
            </button>
            <h1 className="text-gray-900 font-bold flex-1">Thông báo</h1>
            <Bell size={20} className="text-green-600" />
          </div>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-5 py-5 pb-24">
        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5">
          <p className="text-blue-800 text-sm">
            <strong>Lưu ý:</strong> Bạn cần bật thông báo trong cài đặt hệ thống để nhận được thông báo đẩy.
          </p>
        </div>

        {/* Settings List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {settings.map((setting, index) => (
            <div
              key={setting.id}
              className={`flex items-center justify-between p-4 ${
                index !== settings.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className="flex-1 pr-4">
                <p className="font-semibold text-gray-900 text-sm mb-1">{setting.title}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{setting.description}</p>
              </div>
              <button
                onClick={() => toggleSetting(setting.id)}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  setting.enabled ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    setting.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                ></div>
              </button>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-5 px-4">
          <p className="text-gray-500 text-xs text-center leading-relaxed">
            Bạn có thể tùy chỉnh các loại thông báo muốn nhận. Các thay đổi sẽ được áp dụng ngay lập tức.
          </p>
        </div>
      </div>

      {/* Bottom Navigation - Fixed */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg max-w-md mx-auto">
        <div className="flex items-center justify-around py-3">
          <button
            onClick={() => navigate('/staff/orders')}
            className="flex flex-col items-center gap-1 px-4 py-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span className="text-xs font-medium">Trang chủ</span>
          </button>

          <button
            onClick={() => navigate('/staff/notifications')}
            className="flex flex-col items-center gap-1 px-4 py-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span className="text-xs font-medium">Thông báo</span>
          </button>

          <button
            onClick={() => navigate('/staff/profile')}
            className="flex flex-col items-center gap-1 px-4 py-1 text-green-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span className="text-xs font-bold">Tôi</span>
          </button>
        </div>
      </div>
    </div>
  );
}