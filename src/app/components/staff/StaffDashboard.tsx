import { useNavigate } from 'react-router';
import { useAuth } from '@/app/contexts/AuthContext';
import { LogOut, Briefcase, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export default function StaffDashboard() {
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
    { label: 'Đơn hôm nay', value: '12', icon: Clock, color: 'blue' },
    { label: 'Đang xử lý', value: '5', icon: TrendingUp, color: 'orange' },
    { label: 'Hoàn thành', value: '7', icon: CheckCircle2, color: 'green' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 px-5 pt-12 pb-20 rounded-b-[2.5rem] relative overflow-hidden shadow-lg">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 border-2 border-white rounded-full"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-white text-2xl font-bold mb-1">APP Nhân viên</h1>
              <p className="text-green-100 text-sm">Chào {user?.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <LogOut size={20} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-12 relative z-20">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
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

        {/* Features Grid */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
          <h3 className="font-bold text-gray-900 mb-4 text-sm">Chức năng</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors text-left">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mb-2">
                <Briefcase size={20} className="text-white" />
              </div>
              <p className="font-semibold text-gray-900 text-xs">Quản lý đơn hàng</p>
              <p className="text-gray-600 text-[10px] mt-0.5">Xem danh sách công việc</p>
            </button>

            <button className="p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors text-left">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                <CheckCircle2 size={20} className="text-white" />
              </div>
              <p className="font-semibold text-gray-900 text-xs">Cập nhật tiến độ</p>
              <p className="text-gray-600 text-[10px] mt-0.5">Tracking realtime</p>
            </button>

            <button className="p-4 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition-colors text-left">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
              </div>
              <p className="font-semibold text-gray-900 text-xs">Gọi khách hàng</p>
              <p className="text-gray-600 text-[10px] mt-0.5">Xác nhận lịch hẹn</p>
            </button>

            <button className="p-4 bg-orange-50 border border-orange-200 rounded-xl hover:bg-orange-100 transition-colors text-left">
              <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
                </svg>
              </div>
              <p className="font-semibold text-gray-900 text-xs">Chụp ảnh xác thực</p>
              <p className="text-gray-600 text-[10px] mt-0.5">Upload chứng từ</p>
            </button>
          </div>
        </div>

        {/* Coming Soon Banner */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-center shadow-lg">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Briefcase size={32} className="text-white" />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">Đang phát triển</h3>
          <p className="text-green-100 text-sm mb-4">
            Các tính năng đầy đủ sẽ được cập nhật sớm
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            <span className="bg-white/20 text-white px-3 py-1 rounded-full">Biên bản nhận xe</span>
            <span className="bg-white/20 text-white px-3 py-1 rounded-full">Cập nhật tiến độ</span>
            <span className="bg-white/20 text-white px-3 py-1 rounded-full">Biên bản trả xe</span>
          </div>
        </div>
      </div>
    </div>
  );
}