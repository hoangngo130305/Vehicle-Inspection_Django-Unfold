import { User, Car, Bell, Lock, HelpCircle, LogOut, ChevronRight, Settings, CreditCard, History, Calendar } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useAuth } from '@/app/contexts/AuthContext';
import BookingHistoryScreen from './BookingHistoryScreen';
import PaymentMethodsScreen from './PaymentMethodsScreen';

type ScreenType = 'profile' | 'history' | 'payments' | 'notifications' | 'settings' | 'security' | 'help';

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('profile');

  const handleLogout = () => {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
      logout();
      toast.success('Đã đăng xuất thành công');
      navigate('/auth');
    }
  };

  const menuItems = [
    {
      icon: User,
      label: 'Thông tin cá nhân',
      description: 'Cập nhật thông tin tài khoản',
      onClick: () => navigate('/personal-info'),
    },
    {
      icon: History,
      label: 'Lịch sử đặt lịch',
      description: 'Xem lịch sử các lần đặt lịch',
      onClick: () => setCurrentScreen('history'),
    },
    {
      icon: CreditCard,
      label: 'Phương thức thanh toán',
      description: 'Quản lý thẻ và thanh toán',
      onClick: () => setCurrentScreen('payments'),
    },
    {
      icon: Bell,
      label: 'Thông báo',
      description: 'Cài đặt thông báo',
      onClick: () => navigate('/notifications'),
    },
    {
      icon: Settings,
      label: 'Cài đặt',
      description: 'Tùy chỉnh ứng dụng',
      onClick: () => navigate('/settings'),
    },
    {
      icon: Lock,
      label: 'Bảo mật',
      description: 'Đổi mật khẩu, xác thực 2 lớp',
      onClick: () => navigate('/security'),
    },
    {
      icon: HelpCircle,
      label: 'Trợ giúp',
      description: 'Hướng dẫn sử dụng',
      onClick: () => navigate('/help'),
    },
  ];

  if (currentScreen === 'history') {
    return <BookingHistoryScreen onBack={() => setCurrentScreen('profile')} />;
  }

  if (currentScreen === 'payments') {
    return <PaymentMethodsScreen onBack={() => setCurrentScreen('profile')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Profile */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-5 pt-12 pb-20 rounded-b-[2.5rem] relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16" />
        
        <div className="relative z-10">
          {/* User Info */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center ring-4 ring-white/30">
              <span className="text-white text-2xl font-bold">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-white text-xl font-bold mb-1">{user?.name || 'User'}</h2>
              <p className="text-blue-100 text-sm">{user?.email || 'user@example.com'}</p>
              {user?.partner && (
                <div className="flex items-center gap-2 mt-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white text-xs font-medium">
                    {user.partner.name}
                  </span>
                  <span className="text-white/80 text-xs">
                    ({user.partner.code})
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-12 relative z-20">
        {/* Quick Stats - Compact & Modern */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Calendar size={22} className="text-blue-600" />
              </div>
              <div>
                <p className="text-blue-600 text-2xl font-bold leading-none mb-1">1</p>
                <p className="text-gray-500 text-xs">Lịch sắp tới</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Car size={22} className="text-green-600" />
              </div>
              <div>
                <p className="text-green-600 text-2xl font-bold leading-none mb-1">2</p>
                <p className="text-gray-500 text-xs">Xe đang dùng</p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-5">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={item.onClick}
                className={`w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${
                  index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900 text-sm">{item.label}</p>
                  <p className="text-gray-500 text-xs">{item.description}</p>
                </div>
                <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />
              </button>
            );
          })}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 py-4 bg-red-50 border border-red-200 rounded-2xl hover:bg-red-100 transition-colors mb-5"
        >
          <LogOut size={20} className="text-red-600" />
          <span className="text-red-600 font-bold">Đăng xuất</span>
        </button>

        {/* App Version */}
        <p className="text-center text-gray-400 text-xs mb-6">
          Phiên bản 1.0.0
        </p>
      </div>
    </div>
  );
}