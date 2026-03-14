import { Bell, Calendar, Car, AlertCircle, HelpCircle, Clock, X, CheckCircle, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import SupportScreen from './SupportScreen';
import NotificationScreen from './NotificationScreen';
import BookingHistoryScreen from './BookingHistoryScreen';

export default function HomeScreen() {
  const navigate = useNavigate();
  const [showSupport, setShowSupport] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showBookingHistory, setShowBookingHistory] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

  // Mock vehicle data
  const vehicles = [
    {
      id: '1',
      licensePlate: '29A-12345',
      type: 'Ô tô dưới 9 chỗ',
      brand: 'Toyota Vios',
      year: '2020',
      color: 'Trắng',
      owner: 'Nguyễn Văn Nam',
      registrationDate: '15/01/2020',
      expiryDate: '15/02/2026',
      status: 'Tốt',
      icon: 'car',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      id: '2',
      licensePlate: '30A-67890',
      type: 'Xe máy',
      brand: 'Honda SH 150i',
      year: '2022',
      color: 'Đen',
      owner: 'Nguyễn Văn Nam',
      registrationDate: '20/05/2022',
      expiryDate: '20/05/2027',
      status: 'Tốt',
      icon: 'motorcycle',
      gradient: 'from-gray-800 to-gray-900'
    }
  ];

  if (showSupport) {
    return <SupportScreen onBack={() => setShowSupport(false)} />;
  }

  if (showNotifications) {
    return <NotificationScreen onBack={() => setShowNotifications(false)} />;
  }

  if (showBookingHistory) {
    return <BookingHistoryScreen onBack={() => setShowBookingHistory(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 pb-24">
      {/* Premium Header với Wave Design */}
      <div className="relative overflow-hidden">
        {/* Background với Gradient */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 px-5 pt-14 pb-40 relative">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute top-32 -left-32 w-80 h-80 bg-blue-400 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-20 w-64 h-64 bg-indigo-400 rounded-full blur-3xl"></div>
          </div>

          {/* Decorative Grid Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
          
          <div className="flex justify-between items-start relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Sparkles size={16} className="text-yellow-300" />
                </div>
                <p className="text-blue-100 text-xs font-semibold uppercase tracking-wider">Premium Dashboard</p>
              </div>
              <h1 className="text-white text-3xl font-bold tracking-tight mb-1">Xin chào, Nam 👋</h1>
              <p className="text-blue-100 text-sm">Chào mừng bạn quay trở lại</p>
            </div>
            <button 
              onClick={() => setShowNotifications(true)}
              className="relative w-12 h-12 bg-white/15 backdrop-blur-xl rounded-2xl hover:bg-white/25 transition-all active:scale-95 flex items-center justify-center shadow-lg shadow-black/10"
            >
              <Bell size={20} className="text-white" strokeWidth={2.5} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">3</span>
            </button>
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path 
              fill="#f9fafb" 
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            ></path>
          </svg>
        </div>
      </div>

      <div className="px-5 -mt-28 relative z-20">
        {/* Alert Card - Modern Design với Glass Effect */}
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-1 shadow-2xl shadow-orange-500/30 mb-6">
          <div className="bg-white/95 backdrop-blur-xl rounded-[22px] p-5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/30">
                <AlertCircle className="text-white" size={28} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-gray-900 font-bold text-base">Sắp hết hạn đăng kiểm!</h3>
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">Khẩn</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Xe <span className="font-bold text-gray-900">29A-12345</span> sẽ hết hạn vào <span className="font-bold text-orange-600">15/02/2026</span>
                </p>
                <button 
                  onClick={() => navigate('/booking')}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-orange-500/40 transition-all active:scale-95 flex items-center gap-2"
                >
                  Đặt lịch ngay
                  <ArrowRight size={16} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Card - Modern với Gradient Background */}
        <div className="bg-gradient-to-br from-white to-blue-50/50 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/60 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Car className="text-white" size={28} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Tổng số xe</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">2</p>
                  <span className="text-sm text-gray-400">xe</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl">
              <Shield className="text-green-600" size={20} />
              <div>
                <p className="text-xs text-gray-600">Trạng thái</p>
                <p className="text-sm font-bold text-green-600">Tốt</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions - Premium Design */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900 font-bold text-xl flex items-center gap-2">
              <Zap className="text-blue-600" size={24} />
              Dịch vụ nhanh
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Đặt lịch đăng kiểm */}
            <button 
              onClick={() => navigate('/booking')}
              className="group relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-6 hover:shadow-2xl hover:shadow-blue-500/40 transition-all active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Calendar className="text-white" size={24} strokeWidth={2.5} />
                </div>
                <p className="text-white font-bold text-base mb-1">Đặt lịch</p>
                <p className="text-blue-100 text-xs">Đăng kiểm nhanh chóng</p>
              </div>
              <div className="absolute top-2 right-2">
                <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <ArrowRight size={16} className="text-white" strokeWidth={3} />
                </div>
              </div>
            </button>

            {/* Hỗ trợ 24/7 */}
            <button 
              onClick={() => setShowSupport(true)}
              className="group relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 hover:shadow-2xl hover:shadow-gray-800/40 transition-all active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <HelpCircle className="text-white" size={24} strokeWidth={2.5} />
                </div>
                <p className="text-white font-bold text-base mb-1">Hỗ trợ 24/7</p>
                <p className="text-gray-300 text-xs">Tư vấn miễn phí</p>
              </div>
              <div className="absolute top-2 right-2">
                <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <ArrowRight size={16} className="text-white" strokeWidth={3} />
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Upcoming Booking - Modern Card */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900 font-bold text-xl flex items-center gap-2">
              <Calendar className="text-blue-600" size={24} />
              Lịch hẹn sắp tới
            </h2>
            <button 
              onClick={() => navigate('/orders')}
              className="text-blue-600 text-sm font-bold hover:text-blue-700 transition-colors flex items-center gap-1"
            >
              Xem tất cả
              <ArrowRight size={16} strokeWidth={3} />
            </button>
          </div>
          <button
            onClick={() => navigate('/tracking/1')}
            className="w-full group bg-white rounded-3xl p-5 shadow-xl border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all active:scale-[0.98]"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Calendar className="text-white" size={18} strokeWidth={2.5} />
                  </div>
                  <div className="text-left">
                    <p className="text-gray-900 font-bold text-base">TT Đăng kiểm 29-03D</p>
                    <p className="text-gray-500 text-xs">Số 8 Phạm Hùng, Cầu Giấy, HN</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold ml-3 shadow-lg shadow-blue-500/30">
                Đã đặt
              </div>
            </div>
            <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Calendar size={16} className="text-blue-600" strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500">Ngày hẹn</p>
                  <p className="text-sm font-bold text-gray-900">15/02/2026</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <Clock size={16} className="text-indigo-600" strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500">Giờ hẹn</p>
                  <p className="text-sm font-bold text-gray-900">09:00 - 10:00</p>
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* My Vehicles - Premium Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900 font-bold text-xl flex items-center gap-2">
              <Car className="text-blue-600" size={24} />
              Xe của bạn
            </h2>
            <button 
              onClick={() => navigate('/vehicles')}
              className="text-blue-600 text-sm font-bold hover:text-blue-700 transition-colors flex items-center gap-1"
            >
              Quản lý
              <ArrowRight size={16} strokeWidth={3} />
            </button>
          </div>
          <div className="space-y-3">
            {vehicles.map((vehicle) => (
              <button
                key={vehicle.id}
                onClick={() => setSelectedVehicle(vehicle)}
                className="w-full group relative overflow-hidden bg-white rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all active:scale-[0.98]"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${vehicle.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                
                <div className="relative p-5 flex items-center gap-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${vehicle.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Car className="text-white" size={24} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-gray-900 font-bold text-lg mb-0.5">{vehicle.licensePlate}</p>
                    <p className="text-gray-500 text-sm">{vehicle.brand}</p>
                    <p className="text-gray-400 text-xs mt-1">{vehicle.type}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-xl text-xs font-bold">
                      <CheckCircle size={14} strokeWidth={3} />
                      {vehicle.status}
                    </div>
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <ArrowRight size={16} className="text-gray-600 group-hover:text-blue-600" strokeWidth={3} />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Vehicle Detail Modal - Premium Design */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300 shadow-2xl">
            {/* Modal Header với Gradient */}
            <div className={`sticky top-0 bg-gradient-to-br ${selectedVehicle.gradient} px-6 py-6`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
                    <Car className="text-white" size={28} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedVehicle.licensePlate}</h2>
                    <p className="text-white/80 text-sm font-medium">{selectedVehicle.brand}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedVehicle(null)}
                  className="w-11 h-11 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X size={22} className="text-white" strokeWidth={2.5} />
                </button>
              </div>
              
              {/* Status Badge */}
              <div className="flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-xl px-5 py-2.5 rounded-xl flex items-center gap-2">
                  <CheckCircle size={20} className="text-white" strokeWidth={2.5} />
                  <span className="text-white font-bold">Trạng thái: {selectedVehicle.status}</span>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              {/* Vehicle Info Card */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl p-5 space-y-4">
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <Car className="text-blue-600" size={20} />
                  Thông tin xe
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Biển số', value: selectedVehicle.licensePlate },
                    { label: 'Loại xe', value: selectedVehicle.type },
                    { label: 'Hãng xe', value: selectedVehicle.brand },
                    { label: 'Năm sản xuất', value: selectedVehicle.year },
                    { label: 'Màu sắc', value: selectedVehicle.color },
                    { label: 'Chủ xe', value: selectedVehicle.owner }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2.5 px-3 bg-white rounded-xl">
                      <span className="text-sm text-gray-600 font-medium">{item.label}</span>
                      <span className="text-sm font-bold text-gray-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Registration Info Card */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50/30 rounded-2xl p-5 space-y-4">
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <Shield className="text-orange-600" size={20} />
                  Thông tin đăng kiểm
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2.5 px-3 bg-white rounded-xl">
                    <span className="text-sm text-gray-600 font-medium">Ngày đăng ký</span>
                    <span className="text-sm font-bold text-gray-900">{selectedVehicle.registrationDate}</span>
                  </div>
                  <div className="flex items-center justify-between py-2.5 px-3 bg-white rounded-xl">
                    <span className="text-sm text-gray-600 font-medium">Ngày hết hạn</span>
                    <div className="flex items-center gap-2">
                      <AlertCircle size={16} className="text-orange-600" />
                      <span className="text-sm font-bold text-orange-600">{selectedVehicle.expiryDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setSelectedVehicle(null);
                    navigate('/booking');
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-bold hover:shadow-xl hover:shadow-blue-500/40 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Calendar size={20} strokeWidth={2.5} />
                  Đặt lịch ngay
                </button>
                <button
                  onClick={() => {
                    setSelectedVehicle(null);
                    navigate('/vehicles');
                  }}
                  className="px-6 bg-gray-100 text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-95"
                >
                  Chỉnh sửa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
