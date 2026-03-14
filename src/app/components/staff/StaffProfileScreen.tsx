import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/app/contexts/AuthContext';
import { 
  User, 
  Bell, 
  Lock, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  Settings,
  Award,
  TrendingUp,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

export default function StaffProfileScreen() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
      logout();
      toast.success('Đã đăng xuất thành công');
      navigate('/auth');
    }
  };

  const stats = [
    { label: 'Đơn hoàn thành', value: '127', icon: Award, color: 'green' },
    { label: 'Đánh giá TB', value: '4.8', icon: TrendingUp, color: 'orange' },
  ];

  const menuItems = [
    {
      icon: User,
      label: 'Thông tin cá nhân',
      description: 'Cập nhật thông tin tài khoản',
      onClick: () => navigate('/staff/personal-info'),
    },
    {
      icon: Bell,
      label: 'Thông báo',
      description: 'Cài đặt thông báo',
      onClick: () => navigate('/staff/notifications'),
    },
    {
      icon: Settings,
      label: 'Cài đặt',
      description: 'Tùy chỉnh ứng dụng',
      onClick: () => navigate('/staff/settings'),
    },
    {
      icon: Lock,
      label: 'Bảo mật',
      description: 'Đổi mật khẩu, xác thực 2 lớp',
      onClick: () => navigate('/staff/security'),
    },
    {
      icon: HelpCircle,
      label: 'Trợ giúp',
      description: 'Hướng dẫn sử dụng',
      onClick: () => navigate('/staff/help'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Profile */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 px-5 pt-12 pb-20 rounded-b-[2.5rem] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 border-2 border-white rounded-full"></div>
        </div>

        <div className="relative z-10">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User size={48} className="text-white" />
              )}
            </div>
            <h1 className="text-white text-2xl font-bold mb-1">{user?.name}</h1>
            <p className="text-green-100 text-sm mb-1">{user?.email}</p>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-semibold">
              Nhân viên
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-12 relative z-20">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center">
                <div className={`w-10 h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center mx-auto mb-2`}>
                  <Icon size={20} className={`text-${stat.color}-600`} />
                </div>
                <p className={`text-${stat.color}-600 text-lg font-bold mb-0.5`}>{stat.value}</p>
                <p className="text-gray-600 text-[10px]">{stat.label}</p>
              </div>
            );
          })}
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
                <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-green-600" />
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