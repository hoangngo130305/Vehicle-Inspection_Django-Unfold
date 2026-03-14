import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Calendar,
  Car,
  MapPin,
  FileText,
  AlertCircle,
  Truck,
  Settings,
  Search,
} from 'lucide-react';

interface Order {
  id: string;
  vehiclePlate: string;
  station: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'on_the_way' | 'receiving' | 'waiting_payment' | 'vehicle_received' | 'in_progress' | 'returning' | 'checking_extra' | 'waiting_extra_payment' | 'completed' | 'cancelled';
  cost: number;
  extraCost?: number; // Chi phí phát sinh
}

export default function OrderHistoryScreen() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'on_the_way' | 'receiving' | 'waiting_payment' | 'vehicle_received' | 'in_progress' | 'returning' | 'checking_extra' | 'waiting_extra_payment' | 'completed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const orders: Order[] = [
    // 1. PENDING - Chờ xác nhận (3 đơn)
    {
      id: 'DK001',
      vehiclePlate: '51F-12345',
      station: 'TT Đăng kiểm 5001D',
      date: '07/02/2026',
      time: '09:00',
      status: 'pending',
      cost: 561000,
    },
    {
      id: 'DK002',
      vehiclePlate: '29A-98765',
      station: 'TT Đăng kiểm 29-03D',
      date: '07/02/2026',
      time: '14:00',
      status: 'pending',
      cost: 380000,
    },
    {
      id: 'DK003',
      vehiclePlate: '30H-22222',
      station: 'TT Đăng kiểm Hoàn Kiếm',
      date: '07/02/2026',
      time: '16:30',
      status: 'pending',
      cost: 420000,
    },
    
    // 2. CONFIRMED - Đã xác nhận (2 đơn)
    {
      id: 'DK004',
      vehiclePlate: '30B-11111',
      station: 'TT Đăng kiểm Thanh Xuân',
      date: '06/02/2026',
      time: '15:30',
      status: 'confirmed',
      cost: 420000,
    },
    {
      id: 'DK005',
      vehiclePlate: '51G-77777',
      station: 'TT Đăng kiểm Hà Đông',
      date: '06/02/2026',
      time: '10:30',
      status: 'confirmed',
      cost: 561000,
    },
    
    // 3. ON_THE_WAY - Nhân viên đang đến (3 đơn)
    {
      id: 'DK006',
      vehiclePlate: '51F-22222',
      station: 'TT Đăng kiểm Cầu Giấy',
      date: '06/02/2026',
      time: '10:00',
      status: 'on_the_way',
      cost: 561000,
    },
    {
      id: 'DK007',
      vehiclePlate: '29B-33333',
      station: 'TT Đăng kiểm Long Biên',
      date: '06/02/2026',
      time: '08:30',
      status: 'on_the_way',
      cost: 380000,
    },
    {
      id: 'DK008',
      vehiclePlate: '30A-88888',
      station: 'TT Đăng kiểm Đống Đa',
      date: '06/02/2026',
      time: '13:45',
      status: 'on_the_way',
      cost: 420000,
    },
    
    // 4. RECEIVING - Đang nhận xe (2 đơn)
    {
      id: 'DK009',
      vehiclePlate: '29A-12345',
      station: 'TT Đăng kiểm 29-03D',
      date: '06/02/2026',
      time: '11:30',
      status: 'receiving',
      cost: 350000,
    },
    {
      id: 'DK010',
      vehiclePlate: '51F-99999',
      station: 'TT Đăng kiểm 5001D',
      date: '06/02/2026',
      time: '09:15',
      status: 'receiving',
      cost: 561000,
    },
    
    // 5. WAITING_PAYMENT - Đang chờ thanh toán (2 đơn)
    {
      id: 'DK011',
      vehiclePlate: '30H-44444',
      station: 'TT Đăng kiểm Hoàn Kiếm',
      date: '06/02/2026',
      time: '14:00',
      status: 'waiting_payment',
      cost: 420000,
    },
    {
      id: 'DK012',
      vehiclePlate: '29C-55555',
      station: 'TT Đăng kiểm Hai Bà Trưng',
      date: '06/02/2026',
      time: '07:30',
      status: 'waiting_payment',
      cost: 380000,
    },
    
    // 6. VEHICLE_RECEIVED - Đã nhận xe (2 đơn)
    {
      id: 'DK013',
      vehiclePlate: '30A-67890',
      station: 'TT Đăng kiểm Thanh Xuân',
      date: '05/02/2026',
      time: '14:30',
      status: 'vehicle_received',
      cost: 380000,
    },
    {
      id: 'DK014',
      vehiclePlate: '51F-33333',
      station: 'TT Đăng kiểm Hà Đông',
      date: '05/02/2026',
      time: '16:00',
      status: 'vehicle_received',
      cost: 561000,
    },
    
    // 7. IN_PROGRESS - Đang kiểm tra (4 đơn)
    {
      id: 'DK015',
      vehiclePlate: '29A-66666',
      station: 'TT Đăng kiểm 29-03D',
      date: '04/02/2026',
      time: '10:15',
      status: 'in_progress',
      cost: 350000,
    },
    {
      id: 'DK016',
      vehiclePlate: '30B-77777',
      station: 'TT Đăng kiểm Cầu Giấy',
      date: '03/02/2026',
      time: '13:00',
      status: 'in_progress',
      cost: 420000,
    },
    {
      id: 'DK017',
      vehiclePlate: '51G-88888',
      station: 'TT Đăng kiểm 5001D',
      date: '02/02/2026',
      time: '08:45',
      status: 'in_progress',
      cost: 561000,
    },
    {
      id: 'DK018',
      vehiclePlate: '29B-99999',
      station: 'TT Đăng kiểm Long Biên',
      date: '01/02/2026',
      time: '15:30',
      status: 'in_progress',
      cost: 380000,
    },
    
    // 8. RETURNING - Đang trả xe (2 đơn)
    {
      id: 'DK019',
      vehiclePlate: '30A-11223',
      station: 'TT Đăng kiểm Đống Đa',
      date: '28/01/2026',
      time: '11:00',
      status: 'returning',
      cost: 420000,
    },
    {
      id: 'DK020',
      vehiclePlate: '51F-12345',
      station: 'TT Đăng kiểm Thanh Xuân',
      date: '25/01/2026',
      time: '09:30',
      status: 'returning',
      cost: 561000,
    },
    
    // 9. CHECKING_EXTRA - Đang kiểm tra phát sinh (2 đơn)
    {
      id: 'DK021',
      vehiclePlate: '29B-44444',
      station: 'TT Đăng kiểm Long Biên',
      date: '05/02/2026',
      time: '09:30',
      status: 'checking_extra',
      cost: 0,
      extraCost: 100000,
    },
    {
      id: 'DK022',
      vehiclePlate: '51F-12345',
      station: 'TT Đăng kiểm Cầu Giấy',
      date: '03/02/2026',
      time: '10:30',
      status: 'checking_extra',
      cost: 0,
      extraCost: 150000,
    },
    
    // 10. WAITING_EXTRA_PAYMENT - Đang chờ thanh toán phát sinh (2 đơn)
    {
      id: 'DK023',
      vehiclePlate: '30H-66666',
      station: 'TT Đăng kiểm Hoàn Kiếm',
      date: '01/02/2026',
      time: '14:00',
      status: 'waiting_extra_payment',
      cost: 0,
      extraCost: 200000,
    },
    {
      id: 'DK024',
      vehiclePlate: '29C-55555',
      station: 'TT Đăng kiểm Hai Bà Trưng',
      date: '06/02/2026',
      time: '07:30',
      status: 'waiting_extra_payment',
      cost: 0,
      extraCost: 250000,
    },
    
    // 11. COMPLETED - Hoàn thành (8 đơn)
    {
      id: 'DK025',
      vehiclePlate: '30A-67890',
      station: 'TT Đăng kiểm Thanh Xuân',
      date: '05/02/2026',
      time: '14:30',
      status: 'completed',
      cost: 380000,
    },
    {
      id: 'DK026',
      vehiclePlate: '51F-33333',
      station: 'TT Đăng kiểm Hà Đông',
      date: '05/02/2026',
      time: '16:00',
      status: 'completed',
      cost: 561000,
    },
    {
      id: 'DK027',
      vehiclePlate: '29A-66666',
      station: 'TT Đăng kiểm 29-03D',
      date: '04/02/2026',
      time: '10:15',
      status: 'completed',
      cost: 350000,
    },
    {
      id: 'DK028',
      vehiclePlate: '30B-77777',
      station: 'TT Đăng kiểm Cầu Giấy',
      date: '03/02/2026',
      time: '13:00',
      status: 'completed',
      cost: 420000,
    },
    {
      id: 'DK029',
      vehiclePlate: '51G-88888',
      station: 'TT Đăng kiểm 5001D',
      date: '02/02/2026',
      time: '08:45',
      status: 'completed',
      cost: 561000,
    },
    {
      id: 'DK030',
      vehiclePlate: '29B-99999',
      station: 'TT Đăng kiểm Long Biên',
      date: '01/02/2026',
      time: '15:30',
      status: 'completed',
      cost: 380000,
    },
    {
      id: 'DK031',
      vehiclePlate: '30A-11223',
      station: 'TT Đăng kiểm Đống Đa',
      date: '28/01/2026',
      time: '11:00',
      status: 'completed',
      cost: 420000,
    },
    {
      id: 'DK032',
      vehiclePlate: '51F-12345',
      station: 'TT Đăng kiểm Thanh Xuân',
      date: '25/01/2026',
      time: '09:30',
      status: 'completed',
      cost: 561000,
    },
    
    // 12. CANCELLED - Đã hủy (3 đơn)
    {
      id: 'DK033',
      vehiclePlate: '29B-44444',
      station: 'TT Đăng kiểm Long Biên',
      date: '05/02/2026',
      time: '09:30',
      status: 'cancelled',
      cost: 0,
    },
    {
      id: 'DK034',
      vehiclePlate: '51F-12345',
      station: 'TT Đăng kiểm Cầu Giấy',
      date: '03/02/2026',
      time: '10:30',
      status: 'cancelled',
      cost: 0,
    },
    {
      id: 'DK035',
      vehiclePlate: '30H-66666',
      station: 'TT Đăng kiểm Hoàn Kiếm',
      date: '01/02/2026',
      time: '14:00',
      status: 'cancelled',
      cost: 0,
    },
  ];

  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Chờ xác nhận',
          color: 'text-orange-600',
          bg: 'bg-orange-50',
          icon: AlertCircle,
        };
      case 'confirmed':
        return {
          label: 'Đã xác nhận',
          color: 'text-cyan-600',
          bg: 'bg-cyan-50',
          icon: CheckCircle2,
        };
      case 'on_the_way':
        return {
          label: 'Đang đến',
          color: 'text-indigo-600',
          bg: 'bg-indigo-50',
          icon: Truck,
        };
      case 'receiving':
        return {
          label: 'Đang nhận xe',
          color: 'text-purple-600',
          bg: 'bg-purple-50',
          icon: Settings,
        };
      case 'waiting_payment':
        return {
          label: 'Đang chờ thanh toán',
          color: 'text-pink-600',
          bg: 'bg-pink-50',
          icon: Settings,
        };
      case 'vehicle_received':
        return {
          label: 'Đã nhận xe',
          color: 'text-teal-600',
          bg: 'bg-teal-50',
          icon: Settings,
        };
      case 'in_progress':
        return {
          label: 'Đang đăng kiểm',
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          icon: Settings,
        };
      case 'returning':
        return {
          label: 'Đang trả xe',
          color: 'text-gray-600',
          bg: 'bg-gray-50',
          icon: Settings,
        };
      case 'checking_extra':
        return {
          label: 'Đang kiểm tra phát sinh',
          color: 'text-yellow-600',
          bg: 'bg-yellow-50',
          icon: Settings,
        };
      case 'waiting_extra_payment':
        return {
          label: 'Đang chờ thanh toán phát sinh',
          color: 'text-red-600',
          bg: 'bg-red-50',
          icon: Settings,
        };
      case 'completed':
        return {
          label: 'Hoàn thành',
          color: 'text-green-600',
          bg: 'bg-green-50',
          icon: CheckCircle2,
        };
      case 'cancelled':
        return {
          label: 'Đã hủy',
          color: 'text-red-600',
          bg: 'bg-red-50',
          icon: XCircle,
        };
    }
  };

  const filterTabs = [
    { label: 'Tất cả', value: 'all' as const, icon: FileText, color: 'blue' },
    { label: 'Chờ xác nhận', value: 'pending' as const, icon: Clock, color: 'orange' },
    { label: 'Đã xác nhận', value: 'confirmed' as const, icon: CheckCircle2, color: 'cyan' },
    { label: 'Đang đến', value: 'on_the_way' as const, icon: Truck, color: 'indigo' },
    { label: 'Đang nhận xe', value: 'receiving' as const, icon: Settings, color: 'purple' },
    { label: 'Đang chờ thanh toán', value: 'waiting_payment' as const, icon: Settings, color: 'pink' },
    { label: 'Đã nhận xe', value: 'vehicle_received' as const, icon: Settings, color: 'teal' },
    { label: 'Đang đăng kiểm', value: 'in_progress' as const, icon: Settings, color: 'blue' },
    { label: 'Đang trả xe', value: 'returning' as const, icon: Settings, color: 'gray' },
    { label: 'Đang kiểm tra phát sinh', value: 'checking_extra' as const, icon: Settings, color: 'yellow' },
    { label: 'Đang chờ thanh toán phát sinh', value: 'waiting_extra_payment' as const, icon: Settings, color: 'red' },
    { label: 'Hoàn thành', value: 'completed' as const, icon: CheckCircle2, color: 'green' },
    { label: 'Đã hủy', value: 'cancelled' as const, icon: XCircle, color: 'red' },
  ];

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    on_the_way: orders.filter(o => o.status === 'on_the_way').length,
    receiving: orders.filter(o => o.status === 'receiving').length,
    waiting_payment: orders.filter(o => o.status === 'waiting_payment').length,
    vehicle_received: orders.filter(o => o.status === 'vehicle_received').length,
    in_progress: orders.filter(o => o.status === 'in_progress').length,
    returning: orders.filter(o => o.status === 'returning').length,
    checking_extra: orders.filter(o => o.status === 'checking_extra').length,
    waiting_extra_payment: orders.filter(o => o.status === 'waiting_extra_payment').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = searchQuery === '' || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.station.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* White Header with Rounded Bottom */}
      <div className="bg-white rounded-b-[2rem] shadow-sm mb-4">
        {/* Header Content */}
        <div className="px-5 pt-10 pb-5">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 mb-4 -ml-1 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
            <span className="text-sm font-semibold">Quay lại</span>
          </button>
          <h1 className="text-gray-900 font-bold text-xl mb-1">Đơn hàng</h1>
          <p className="text-gray-500 text-sm mb-4">{orders.length} đơn hàng</p>

          {/* Search Bar */}
          <div className="relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm mã đơn, biển số xe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Filter Tabs - Horizontal Scrollable */}
        <div className="border-t border-gray-100">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 px-5 py-3 min-w-max">
              {filterTabs.map((tab) => {
                const isActive = filter === tab.value;
                const count = statusCounts[tab.value];
                const TabIcon = tab.icon;
                
                return (
                  <button
                    key={tab.value}
                    onClick={() => setFilter(tab.value)}
                    className={`
                      flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all active:scale-95
                      ${isActive 
                        ? tab.color === 'blue' 
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                          : tab.color === 'orange'
                          ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                          : tab.color === 'cyan'
                          ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                          : tab.color === 'indigo'
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                          : tab.color === 'purple'
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                          : tab.color === 'pink'
                          ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                          : tab.color === 'teal'
                          ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                          : tab.color === 'gray'
                          ? 'bg-gray-600 text-white shadow-md shadow-gray-600/30'
                          : tab.color === 'yellow'
                          ? 'bg-yellow-600 text-white shadow-md shadow-yellow-600/30'
                          : tab.color === 'green'
                          ? 'bg-green-600 text-white shadow-md shadow-green-600/30'
                          : 'bg-red-600 text-white shadow-md shadow-red-600/30'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                  >
                    {TabIcon && <TabIcon size={14} strokeWidth={2.5} />}
                    <span>{tab.label}</span>
                    <span className={`
                      px-1.5 py-0.5 rounded-md text-[10px] font-bold
                      ${isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-gray-200 text-gray-700'
                      }
                    `}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 space-y-3">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const StatusIcon = statusInfo.icon;

            return (
              <div key={order.id} className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Car size={14} className="text-gray-600" />
                      <span className="font-bold text-gray-900 text-sm">{order.vehiclePlate}</span>
                    </div>
                    <div className="flex items-start gap-2 text-gray-600 mb-2">
                      <MapPin size={12} className="mt-0.5 flex-shrink-0" />
                      <p className="text-xs">{order.station}</p>
                    </div>
                  </div>
                  <span
                    className={`${statusInfo.bg} ${statusInfo.color} px-2.5 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1`}
                  >
                    <StatusIcon size={10} />
                    {statusInfo.label}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 mb-3">
                  <div className="flex items-center gap-3 text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} strokeWidth={2} />
                      <span className="text-[10px]">{order.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} strokeWidth={2} />
                      <span className="text-[10px]">{order.time}</span>
                    </div>
                  </div>
                  {order.cost > 0 && (
                    <span className="font-bold text-blue-600 text-xs">
                      {order.cost.toLocaleString('vi-VN')}đ
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => navigate(`/tracking/${order.id}`)}
                    className="py-2.5 px-3 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all active:scale-95 font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <ChevronRight size={14} />
                    Chi tiết
                  </button>
                  
                  {order.status === 'completed' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/invoice/${order.id}`);
                      }}
                      className="py-2.5 px-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all active:scale-95 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-purple-600/20"
                    >
                      <FileText size={14} />
                      Hóa đơn
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-600 font-semibold mb-1 text-sm">Chưa có đơn hàng</p>
            <p className="text-xs text-gray-500 mb-4">
              Các đơn hàng của bạn sẽ hiển thị ở đây
            </p>
            <button
              onClick={() => navigate('/booking')}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-sm"
            >
              Đặt lịch ngay
            </button>
          </div>
        )}
      </div>
    </div>
  );
}