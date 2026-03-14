import { useNavigate, useParams } from 'react-router';
import { 
  ArrowLeft, 
  Phone, 
  MapPin, 
  Clock, 
  Car,
  User,
  CheckCircle2,
  Camera,
  Upload,
  MessageSquare,
  Navigation,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useStaffOrders } from '@/app/contexts/StaffOrdersContext';

export default function StaffOrderDetailScreen() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  
  // Use context instead of local state
  const { getOrderById, updateOrderStatus } = useStaffOrders();
  const order = getOrderById(orderId || '');

  // If order not found, show error
  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">
        <div className="text-center">
          <AlertCircle size={64} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy đơn hàng</h2>
          <p className="text-gray-600 mb-4">Mã đơn hàng "{orderId}" không tồn tại</p>
          <button
            onClick={() => navigate('/staff/orders')}
            className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const handleUpdateStatus = (newStatus: 'waiting' | 'processing' | 'completed' | 'cancelled') => {
    updateOrderStatus(order.id, newStatus);
    toast.success('Cập nhật trạng thái thành công!');
  };

  const handleStartInspection = () => {
    toast.success('Bắt đầu kiểm định');
    handleUpdateStatus('processing');
  };

  const handleCompleteInspection = () => {
    toast.success('Hoàn thành kiểm định');
    handleUpdateStatus('completed');
    // Navigate back to orders screen after 1 second
    setTimeout(() => {
      navigate('/staff/orders');
    }, 1000);
  };

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
    <div className="min-h-screen bg-gray-50 pb-20 max-w-md mx-auto">
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
          <button
            onClick={() => navigate('/staff/orders')}
            className="flex items-center gap-2 text-gray-600 mb-4 -ml-1 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
            <span className="text-sm font-semibold">Quay lại</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900 text-xl font-bold mb-1 tracking-tight">Chi tiết đơn hàng</h1>
              <p className="text-gray-500 text-sm">{order.id}</p>
            </div>
            <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${getStatusColor(order.status)}`}>
              {getStatusText(order.status)}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-4 space-y-3">
        {/* Customer Info */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <User size={18} className="text-green-600" />
            Thông tin khách hàng
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Họ tên:</span>
              <span className="text-gray-900 font-semibold text-sm">{order.customer}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Số điện thoại:</span>
              <a href={`tel:${order.phone}`} className="text-green-600 font-semibold text-sm hover:underline">
                {order.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Vehicle Info */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Car size={18} className="text-blue-600" />
            Thông tin phương tiện
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Biển kiểm soát:</span>
              <span className="text-gray-900 font-semibold text-sm">{order.vehicle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Loại xe:</span>
              <span className="text-gray-900 font-semibold text-sm">{order.vehicleType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Hãng xe:</span>
              <span className="text-gray-900 font-semibold text-sm">{order.brand}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Màu sắc:</span>
              <span className="text-gray-900 font-semibold text-sm">{order.color}</span>
            </div>
          </div>
        </div>

        {/* Appointment Info */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Clock size={18} className="text-purple-600" />
            Thông tin lịch hẹn
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Ngày hẹn:</span>
              <span className="text-gray-900 font-semibold text-sm">{order.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Giờ hẹn:</span>
              <span className="text-gray-900 font-semibold text-sm">{order.time}</span>
            </div>
            <div className="flex items-start justify-between">
              <span className="text-gray-600 text-sm">Địa điểm:</span>
              <span className="text-gray-900 font-semibold text-sm text-right flex-1 ml-2">{order.location}</span>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-green-600" />
            Dịch vụ
          </h3>
          <div className="space-y-2 mb-3">
            {order.services.map((service, index) => (
              <div key={index} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-gray-900 text-sm">{service.name}</span>
                <span className="text-gray-900 font-semibold text-sm">{service.price}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-2 border-t-2 border-gray-200">
            <span className="text-gray-900 font-bold">Tổng cộng:</span>
            <span className="text-green-600 font-bold text-lg">{order.total}</span>
          </div>
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
            <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
              <AlertCircle size={18} className="text-amber-600" />
              Ghi chú
            </h3>
            <p className="text-amber-800 text-sm">{order.notes}</p>
          </div>
        )}

        {/* Action Buttons based on status */}
        <div className="space-y-3 pt-2">
          {order.status === 'waiting' && (
            <>
              {/* Primary Actions */}
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${order.phone}`}
                  className="flex flex-col items-center justify-center gap-1.5 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-md"
                >
                  <Phone size={20} />
                  <span className="text-xs">Gọi khách</span>
                </a>
                <button
                  onClick={handleStartInspection}
                  className="flex flex-col items-center justify-center gap-1.5 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-md"
                >
                  <CheckCircle2 size={20} />
                  <span className="text-xs">Bắt đầu</span>
                </button>
              </div>
              
              {/* Secondary Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => navigate(`/staff/chat/${order.id}`)}
                  className="flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm"
                >
                  <MessageSquare size={16} />
                  Chat
                </button>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm"
                >
                  <Navigation size={16} />
                  Chỉ đường
                </a>
              </div>
            </>
          )}

          {order.status === 'processing' && (
            <>
              {/* Cancel/Return Button */}
              <button
                onClick={() => {
                  if (confirm('Bạn có chắc muốn hủy bắt đầu và quay lại trạng thái chờ xử lý?')) {
                    handleUpdateStatus('waiting');
                    toast.success('Đã quay lại trạng thái chờ xử lý');
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 border-2 border-red-200 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors mb-3"
              >
                <XCircle size={18} />
                <span className="text-sm">Hủy bắt đầu & Quay lại</span>
              </button>

              {/* Receipt/Return Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => navigate(`/staff/vehicle-receipt/${order.id}`)}
                  className="flex flex-col items-center justify-center gap-1.5 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-md"
                >
                  <CheckCircle2 size={20} />
                  <span className="text-xs">Nhận xe</span>
                </button>
                <button
                  onClick={() => navigate(`/staff/vehicle-return/${order.id}`)}
                  className="flex flex-col items-center justify-center gap-1.5 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-md"
                >
                  <CheckCircle2 size={20} />
                  <span className="text-xs">Trả xe</span>
                </button>
              </div>
              
              {/* Complete Button */}
              <button
                onClick={handleCompleteInspection}
                className="w-full flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
              >
                <CheckCircle2 size={20} />
                <span className="text-sm">Hoàn thành kiểm định</span>
              </button>
              
              {/* Secondary Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => navigate(`/staff/chat/${order.id}`)}
                  className="flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm"
                >
                  <MessageSquare size={16} />
                  Chat
                </button>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm"
                >
                  <Navigation size={16} />
                  Chỉ đường
                </a>
              </div>
            </>
          )}

          {order.status === 'completed' && (
            <>
              <div className="bg-green-50 rounded-2xl p-4 border border-green-200 text-center">
                <CheckCircle2 size={48} className="text-green-600 mx-auto mb-2" />
                <p className="text-green-900 font-bold mb-1">Đã hoàn thành</p>
                <p className="text-green-700 text-sm">Đơn hàng đã được xử lý thành công</p>
              </div>
              
              {/* Secondary Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => navigate(`/staff/chat/${order.id}`)}
                  className="flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm"
                >
                  <MessageSquare size={16} />
                  Chat
                </button>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm"
                >
                  <Navigation size={16} />
                  Chỉ đường
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}