import { useNavigate } from 'react-router';
import { useAuth } from '@/app/contexts/AuthContext';
import { useStaffOrders } from '@/app/contexts/StaffOrdersContext';
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Camera,
  FileText,
  TrendingUp,
  AlertCircle,
  Info
} from 'lucide-react';

export default function StaffHomeScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { orders } = useStaffOrders();

  // Calculate real stats from orders
  const todayOrders = orders.filter(o => o.date === new Date().toLocaleDateString('vi-VN'));
  const processingOrders = orders.filter(o => o.status === 'processing');
  const completedOrders = orders.filter(o => o.status === 'completed');

  const stats = [
    { 
      label: 'Đang hoạt động', 
      description: 'Số đơn bạn đang làm (chưa hoàn thành)',
      value: processingOrders.length.toString(), 
      icon: TrendingUp, 
      color: 'orange' 
    },
    { 
      label: 'Hoàn thành', 
      description: 'Số đơn bạn đã hoàn thành thành công',
      value: completedOrders.length.toString(), 
      icon: CheckCircle2, 
      color: 'green' 
    },
  ];

  const quickActions = [
    {
      title: 'Đang xử lý',
      desc: `${processingOrders.length} đơn đang làm`,
      icon: TrendingUp,
      color: 'blue',
      onClick: () => navigate('/staff/orders'),
    },
    {
      title: 'Hoàn thành',
      desc: `${completedOrders.length} đơn đã xong`,
      icon: CheckCircle2,
      color: 'green',
      onClick: () => navigate('/staff/orders'),
    },
    {
      title: 'Biên bản nhận xe',
      desc: 'Lập biên bản mới',
      icon: FileText,
      color: 'purple',
      onClick: () => navigate('/staff/orders'),
    },
    {
      title: 'Upload chứng từ',
      desc: 'Chụp ảnh xác thực',
      icon: Camera,
      color: 'orange',
      onClick: () => navigate('/staff/orders'),
    },
  ];

  // Show recent orders (waiting and processing only)
  const recentOrders = orders
    .filter(o => o.status === 'waiting' || o.status === 'processing')
    .slice(0, 3);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'bg-orange-100 text-orange-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'Chờ xử lý';
      case 'processing':
        return 'Đang xử lý';
      case 'completed':
        return 'Hoàn thành';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 px-5 pt-12 pb-24 rounded-b-[2.5rem] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 border-2 border-white rounded-full"></div>
        </div>

        <div className="relative z-10">
          <div className="mb-6">
            <h1 className="text-white text-2xl font-bold mb-1">Xin chào, {user?.name}!</h1>
            <p className="text-green-100 text-sm">Ngày {new Date().toLocaleDateString('vi-VN')}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg text-center">
                  <div className={`w-10 h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center mx-auto mb-2`}>
                    <Icon size={20} className={`text-${stat.color}-600`} />
                  </div>
                  <p className={`text-${stat.color}-600 text-lg font-bold mb-0.5`}>{stat.value}</p>
                  <p className="text-gray-600 text-[10px] font-semibold">{stat.label}</p>
                  <p className="text-gray-500 text-[8px] mt-1 leading-tight">{stat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-5 -mt-16 relative z-20">
        {/* Stats Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 shadow-sm">
          <div className="flex items-start gap-2">
            <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-blue-900 text-xs font-semibold mb-1">Giải thích thống kê:</p>
              <ul className="text-blue-800 text-[10px] space-y-1">
                <li>• <span className="font-semibold">Đang hoạt động:</span> Đơn bạn đang làm, chưa hoàn tất</li>
                <li>• <span className="font-semibold">Hoàn thành:</span> Đơn bạn đã làm xong thành công</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 text-sm">Đơn hàng gần đây</h3>
            <button
              onClick={() => navigate('/staff/orders')}
              className="text-green-600 text-xs font-semibold"
            >
              Xem tất cả →
            </button>
          </div>

          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => navigate(`/staff/order/${order.id}`)}
              >
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Briefcase size={24} className="text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm mb-0.5">{order.id}</p>
                  <p className="text-gray-600 text-xs mb-0.5">{order.customer}</p>
                  <p className="text-gray-500 text-[10px]">BKS: {order.vehicle}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`inline-block px-2 py-1 rounded-lg text-[10px] font-semibold mb-1 ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                  <p className="text-gray-500 text-[10px]">{order.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Quick Action */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-4 shadow-lg mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Phone size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold mb-1">Liên hệ nhanh</h3>
              <p className="text-green-100 text-xs">Gọi cho khách hàng để xác nhận lịch hẹn</p>
            </div>
            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-white font-semibold text-sm transition-colors">
              Gọi ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}