import { ArrowLeft, Calendar, MapPin, Clock, Phone, CheckCircle, XCircle, Edit2, Trash2, Eye } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

interface BookingHistoryScreenProps {
  onBack: () => void;
}

interface Booking {
  id: string;
  bookingCode: string;
  center: string;
  address: string;
  date: string;
  time: string;
  licensePlate: string;
  vehicleType: string;
  phone: string;
  status: 'confirmed' | 'on_the_way' | 'receiving' | 'in_progress' | 'returning' | 'completed' | 'cancelled';
  createdAt: string;
  currentStep?: string; // For in-progress orders
}

export default function BookingHistoryScreen({ onBack }: BookingHistoryScreenProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'processing' | 'completed' | 'cancelled'>('processing');
  const [bookings] = useState<Booking[]>([
    // PROCESSING ORDERS
    {
      id: '1',
      bookingCode: '#DK123456',
      center: 'TT Đăng kiểm 29-03D',
      address: 'Số 8 Phạm Hùng, Cầu Giấy, Hà Nội',
      date: '08/02/2026',
      time: '09:00 - 10:00',
      licensePlate: '29A-12345',
      vehicleType: 'Ô tô dưới 9 chỗ',
      phone: '0912 345 678',
      status: 'confirmed',
      createdAt: '08/02/2026 07:30',
      currentStep: 'Đã xác nhận - Chờ nhân viên đến',
    },
    {
      id: '2',
      bookingCode: '#DK123457',
      center: 'TT Đăng kiểm 29-02V',
      address: 'Số 456 Giải Phóng, Hai Bà Trưng, Hà Nội',
      date: '08/02/2026',
      time: '08:30 - 09:30',
      licensePlate: '30A-67890',
      vehicleType: 'Xe máy',
      phone: '0912 345 678',
      status: 'on_the_way',
      createdAt: '08/02/2026 07:00',
      currentStep: 'Nhân viên đang đến - Dự kiến 08:45',
    },
    {
      id: '3',
      bookingCode: '#DK123458',
      center: 'TT Đăng kiểm 29-01S',
      address: 'Số 120 Nguyễn Trãi, Thanh Xuân, Hà Nội',
      date: '08/02/2026',
      time: '08:00 - 09:00',
      licensePlate: '51F-99999',
      vehicleType: 'Ô tô dưới 9 chỗ',
      phone: '0912 345 678',
      status: 'receiving',
      createdAt: '08/02/2026 06:30',
      currentStep: 'Đang làm biên bản - Vui lòng thanh toán',
    },
    {
      id: '4',
      bookingCode: '#DK123459',
      center: 'TT Đăng kiểm 29-04K',
      address: 'Số 78 Nguyễn Văn Cừ, Long Biên, Hà Nội',
      date: '08/02/2026',
      time: '07:30 - 08:30',
      licensePlate: '29B-54321',
      vehicleType: 'Ô tô dưới 9 chỗ',
      phone: '0912 345 678',
      status: 'in_progress',
      createdAt: '08/02/2026 06:00',
      currentStep: 'Đang đăng kiểm - Còn khoảng 1 giờ',
    },
    {
      id: '5',
      bookingCode: '#DK123460',
      center: 'TT Đăng kiểm 29-05T',
      address: 'Số 234 Đường Láng, Đống Đa, Hà Nội',
      date: '08/02/2026',
      time: '07:00 - 08:00',
      licensePlate: '30B-11111',
      vehicleType: 'Xe máy',
      phone: '0912 345 678',
      status: 'returning',
      createdAt: '08/02/2026 05:30',
      currentStep: 'Đang trả xe - Dự kiến đến 14:30',
    },
    
    // COMPLETED ORDERS
    {
      id: '6',
      bookingCode: '#DK123455',
      center: 'TT Đăng kiểm 29-02V',
      address: 'Số 456 Giải Phóng, Hai Bà Trưng, Hà Nội',
      date: '15/01/2026',
      time: '14:00 - 15:00',
      licensePlate: '29A-12345',
      vehicleType: 'Ô tô dưới 9 chỗ',
      phone: '0912 345 678',
      status: 'completed',
      createdAt: '05/01/2026',
    },
    {
      id: '7',
      bookingCode: '#DK123450',
      center: 'TT Đăng kiểm 29-03D',
      address: 'Số 8 Phạm Hùng, Cầu Giấy, Hà Nội',
      date: '20/12/2025',
      time: '09:00 - 10:00',
      licensePlate: '30A-67890',
      vehicleType: 'Xe máy',
      phone: '0912 345 678',
      status: 'completed',
      createdAt: '15/12/2025',
    },
    {
      id: '8',
      bookingCode: '#DK123445',
      center: 'TT Đăng kiểm 29-01S',
      address: 'Số 120 Nguyễn Trãi, Thanh Xuân, Hà Nội',
      date: '10/11/2025',
      time: '10:00 - 11:00',
      licensePlate: '29A-12345',
      vehicleType: 'Ô tô dưới 9 chỗ',
      phone: '0912 345 678',
      status: 'completed',
      createdAt: '05/11/2025',
    },
    
    // CANCELLED ORDERS
    {
      id: '9',
      bookingCode: '#DK123454',
      center: 'TT Đăng kiểm 29-01S',
      address: 'Số 120 Nguyễn Trãi, Thanh Xuân, Hà Nội',
      date: '10/01/2026',
      time: '10:00 - 11:00',
      licensePlate: '30A-67890',
      vehicleType: 'Xe máy',
      phone: '0912 345 678',
      status: 'cancelled',
      createdAt: '28/12/2025',
    },
    {
      id: '10',
      bookingCode: '#DK123440',
      center: 'TT Đăng kiểm 29-04K',
      address: 'Số 78 Nguyễn Văn Cừ, Long Biên, Hà Nội',
      date: '05/01/2026',
      time: '15:00 - 16:00',
      licensePlate: '51F-99999',
      vehicleType: 'Ô tô dưới 9 chỗ',
      phone: '0912 345 678',
      status: 'cancelled',
      createdAt: '01/01/2026',
    },
  ]);

  // Filter logic - group processing statuses together
  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'processing') {
      return ['confirmed', 'on_the_way', 'receiving', 'in_progress', 'returning'].includes(b.status);
    }
    return b.status === activeTab;
  });

  const processingCount = bookings.filter(b => 
    ['confirmed', 'on_the_way', 'receiving', 'in_progress', 'returning'].includes(b.status)
  ).length;

  const getStatusDisplay = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return { label: '✓ Đã xác nhận', color: 'from-green-50 to-green-100 text-green-700 border-green-200/50' };
      case 'on_the_way':
        return { label: '🚗 Đang đến', color: 'from-blue-50 to-blue-100 text-blue-700 border-blue-200/50' };
      case 'receiving':
        return { label: '📝 Đang nhận xe', color: 'from-purple-50 to-purple-100 text-purple-700 border-purple-200/50' };
      case 'in_progress':
        return { label: '🔧 Đang kiểm tra', color: 'from-cyan-50 to-cyan-100 text-cyan-700 border-cyan-200/50' };
      case 'returning':
        return { label: '🏁 Đang trả xe', color: 'from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200/50' };
      case 'completed':
        return { label: '✓ Hoàn thành', color: 'from-green-50 to-green-100 text-green-700 border-green-200/50' };
      case 'cancelled':
        return { label: '✕ Đã hủy', color: 'from-red-50 to-red-100 text-red-700 border-red-200/50' };
      default:
        return { label: 'Đang xử lý', color: 'from-gray-50 to-gray-100 text-gray-700 border-gray-200/50' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 pb-24">
      {/* Modern Header với Decorative Patterns + Tabs */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 px-5 pt-10 pb-5 rounded-b-[2rem] shadow-lg relative overflow-hidden sticky top-0 z-40">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-32 -left-32 w-80 h-80 bg-blue-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-white/90 mb-3 -ml-1 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
            <span className="text-sm font-bold">Quay lại</span>
          </button>
          <h1 className="text-white font-bold text-2xl tracking-tight mb-1">Đơn hàng của bạn</h1>
          <p className="text-blue-100 text-sm mb-4">Theo dõi và quản lý đơn hàng</p>
          
          {/* Filter Tabs */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-1.5 grid grid-cols-3 gap-1.5">
            <button
              onClick={() => setActiveTab('processing')}
              className={`py-3 rounded-xl font-bold text-xs transition-all duration-200 ${
                activeTab === 'processing'
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'text-white/70 hover:bg-white/10'
              }`}
            >
              Đang xử lý ({processingCount})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`py-3 rounded-xl font-bold text-xs transition-all duration-200 ${
                activeTab === 'completed'
                  ? 'bg-white text-green-600 shadow-lg'
                  : 'text-white/70 hover:bg-white/10'
              }`}
            >
              Hoàn thành ({bookings.filter(b => b.status === 'completed').length})
            </button>
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`py-3 rounded-xl font-bold text-xs transition-all duration-200 ${
                activeTab === 'cancelled'
                  ? 'bg-white text-red-600 shadow-lg'
                  : 'text-white/70 hover:bg-white/10'
              }`}
            >
              Đã hủy ({bookings.filter(b => b.status === 'cancelled').length})
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5">
        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const statusDisplay = getStatusDisplay(booking.status);
              const isProcessing = ['confirmed', 'on_the_way', 'receiving', 'in_progress', 'returning'].includes(booking.status);
              
              return (
                <div key={booking.id} className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100 hover:shadow-2xl transition-all">
                  {/* Booking Code & Status */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                    <div>
                      <p className="text-gray-500 text-xs mb-1 font-medium">Mã đơn hàng</p>
                      <p className="text-blue-600 font-bold text-lg">{booking.bookingCode}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm bg-gradient-to-br border ${statusDisplay.color}`}>
                      {statusDisplay.label}
                    </div>
                  </div>

                  {/* Current Step for processing orders */}
                  {isProcessing && booking.currentStep && (
                    <div className="mb-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
                      <p className="text-xs text-blue-600 font-bold mb-1">TRẠNG THÁI HIỆN TẠI</p>
                      <p className="text-sm font-bold text-gray-900">{booking.currentStep}</p>
                    </div>
                  )}

                  {/* Booking Details */}
                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-gray-500 text-xs mb-1.5 font-medium">Trung tâm</p>
                      <p className="text-gray-900 font-bold text-sm">{booking.center}</p>
                      <p className="text-gray-600 text-xs mt-1 flex items-start gap-1.5">
                        <MapPin size={14} className="text-gray-400 mt-0.5" />
                        <span>{booking.address}</span>
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                        <p className="text-gray-500 text-xs mb-1.5 font-medium flex items-center gap-1.5">
                          <Calendar size={12} className="text-gray-400" />
                          Ngày hẹn
                        </p>
                        <p className="text-gray-900 font-bold text-sm">{booking.date}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                        <p className="text-gray-500 text-xs mb-1.5 font-medium flex items-center gap-1.5">
                          <Clock size={12} className="text-gray-400" />
                          Giờ hẹn
                        </p>
                        <p className="text-gray-900 font-bold text-sm">{booking.time}</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3.5 border border-blue-100">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-gray-500 text-xs mb-1.5 font-medium">Biển số xe</p>
                          <p className="text-gray-900 font-bold text-base">{booking.licensePlate}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-1.5 font-medium">Loại xe</p>
                          <p className="text-gray-900 font-bold text-sm">{booking.vehicleType}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {isProcessing && (
                    <div className="pt-4 border-t border-gray-100">
                      <button 
                        onClick={() => navigate(`/tracking/${booking.id}`)}
                        className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/40 transition-all active:scale-95 font-bold text-sm flex items-center justify-center gap-2"
                      >
                        <Eye size={18} strokeWidth={2.5} />
                        Theo dõi đơn hàng
                      </button>
                    </div>
                  )}

                  {booking.status === 'completed' && (
                    <div className="pt-4 border-t border-gray-100">
                      <button className="w-full py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/40 transition-all active:scale-95 font-bold text-sm flex items-center justify-center gap-2">
                        <CheckCircle size={18} strokeWidth={2.5} />
                        Xem giấy chứng nhận
                      </button>
                    </div>
                  )}

                  <p className="text-gray-400 text-xs mt-4 text-center">
                    Đặt lịch lúc {booking.createdAt}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 text-center shadow-xl border border-gray-100">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="text-gray-400" size={36} strokeWidth={2} />
            </div>
            <h3 className="text-gray-900 font-bold text-lg mb-2">Không có đơn hàng</h3>
            <p className="text-gray-500 text-sm">
              Bạn chưa có đơn hàng nào trong mục này
            </p>
          </div>
        )}
      </div>
    </div>
  );
}