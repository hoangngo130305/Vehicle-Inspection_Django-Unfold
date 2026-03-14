import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search,
  Filter,
  Phone,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { useStaffOrders, type OrderStatus } from '@/app/contexts/StaffOrdersContext';

export default function StaffOrdersScreen() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<OrderStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Use context to get orders
  const { orders } = useStaffOrders();

  const tabs = [
    { key: 'all', label: 'Tất cả', count: orders.length },
    { key: 'waiting', label: 'Chờ xử lý', count: orders.filter(o => o.status === 'waiting').length },
    { key: 'processing', label: 'Đang xử lý', count: orders.filter(o => o.status === 'processing').length },
    { key: 'completed', label: 'Hoàn thành', count: orders.filter(o => o.status === 'completed').length },
  ];

  const filteredOrders = orders.filter(order => {
    const matchesTab = selectedTab === 'all' || order.status === selectedTab;
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.vehicle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'processing':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
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
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'waiting':
        return Clock;
      case 'processing':
        return Clock;
      case 'completed':
        return CheckCircle2;
      case 'cancelled':
        return XCircle;
      default:
        return Clock;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Sticky */}
      <div className="sticky top-0 z-40 bg-white px-5 pt-12 pb-6 rounded-b-[2rem] shadow-md border-b border-gray-100 relative overflow-hidden">
        {/* Decorative Circle Patterns */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute top-6 right-8 w-24 h-24 border-2 border-gray-900 rounded-full"></div>
          <div className="absolute top-10 right-24 w-16 h-16 border-2 border-gray-900 rounded-full"></div>
          <div className="absolute bottom-2 left-6 w-28 h-28 border-2 border-gray-900 rounded-full"></div>
          <div className="absolute bottom-4 left-28 w-10 h-10 border border-gray-900 rounded-full"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-gray-900 text-xl font-bold mb-1 tracking-tight">Quản lý đơn hàng</h1>
              <p className="text-gray-500 text-sm">{filteredOrders.length} đơn hàng</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm mã đơn, khách hàng, BKS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 text-sm transition-all"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-5 sticky top-[140px] z-30"> {/* Adjust top value based on header height */}
        <div className="flex gap-2 justify-between">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as OrderStatus | 'all')}
              className={`py-2.5 px-0.5 border-b-2 transition-colors flex-1 ${
                selectedTab === tab.key
                  ? 'border-green-600 text-green-600 font-semibold'
                  : 'border-transparent text-gray-500'
              }`}
            >
              <span className="text-xs">{tab.label}</span>
              <span className="ml-1 text-[10px]">({tab.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="px-5 py-4 space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-600 font-semibold mb-1">Không tìm thấy đơn hàng</p>
            <p className="text-gray-500 text-sm">Thử tìm kiếm với từ khóa khác</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const StatusIcon = getStatusIcon(order.status);
            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                onClick={() => navigate(`/staff/order/${order.id}`)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{order.id}</h3>
                    <p className="text-gray-600 text-sm">{order.customer}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(order.status)}`}>
                    <StatusIcon size={14} />
                    {getStatusText(order.status)}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-semibold">{order.vehicle}</p>
                      <p className="text-gray-500 text-xs">{order.vehicleType}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock size={16} className="text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-semibold">{order.time} - {order.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin size={16} className="text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-semibold">{order.location}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <a
                    href={`tel:${order.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors"
                  >
                    <Phone size={16} className="text-green-600" />
                    <span className="text-green-600 font-semibold text-sm">Gọi ngay</span>
                  </a>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/staff/order/${order.id}`);
                    }}
                    className="flex-1 py-2.5 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors text-blue-600 font-semibold text-sm"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}