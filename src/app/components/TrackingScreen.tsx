import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  Star,
  CheckCircle2,
  User as UserIcon,
  Clock,
  MapPin,
  FileText,
  QrCode,
  Camera,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

type OrderStatus =
  | 'confirmed'             // Đã xác nhận
  | 'on_the_way'           // Tài xế đang đến
  | 'receiving'            // Đang nhận xe
  | 'in_progress'          // Đang đăng kiểm
  | 'returning'            // Đang trả xe
  | 'completed';           // Hoàn thành

// Mock order data
const mockOrders: Record<string, { status: OrderStatus; vehiclePlate: string }> = {
  '1': { status: 'on_the_way', vehiclePlate: '29A-12345' },
  '2': { status: 'completed', vehiclePlate: '30A-67890' },
  '3': { status: 'in_progress', vehiclePlate: '29A-12345' },
};

export default function TrackingScreen() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  
  const mockOrder = mockOrders[orderId || '1'] || mockOrders['1'];
  const [orderStatus, setOrderStatus] = useState<OrderStatus>(mockOrder.status);
  const [showChat, setShowChat] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [showDebug, setShowDebug] = useState(false);

  const driver = {
    name: 'Nguyễn Văn A',
    code: 'NV-12345',
    phone: '0987654321',
    vehiclePlate: '29X-98765',
    rating: 4.9,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  };

  const order = {
    vehiclePlate: '29A-12345',
    station: 'TT Đăng kiểm 29-03D',
    address: 'Số 8 Phạm Hùng, Cầu Giấy, HN',
    totalCost: 350000,
    pickupAddress: 'Số 123 Trần Duy Hưng, Cầu Giấy, HN',
    pickupTime: '08:30',
    estimatedArrival: '08:45',
    confirmedTime: '08:00',
    returnTime: '30 phút',
  };

  const timelineSteps: { key: OrderStatus; label: string }[] = [
    { key: 'confirmed', label: 'Xác nhận' },
    { key: 'on_the_way', label: 'Đang đến' },
    { key: 'receiving', label: 'Nhận xe' },
    { key: 'in_progress', label: 'Đăng kiểm' },
    { key: 'returning', label: 'Trả xe' },
    { key: 'completed', label: 'Hoàn thành' },
  ];

  const getCurrentStepIndex = () => {
    return timelineSteps.findIndex((s) => s.key === orderStatus);
  };

  const handleSubmitRating = () => {
    if (rating === 0) {
      toast.error('Vui lòng chọn số sao đánh giá');
      return;
    }
    toast.success('Cảm ơn bạn đã đánh giá!');
    navigate('/');
  };

  // Driver Info Component
  const DriverInfo = () => (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <UserIcon size={18} className="text-blue-600" />
        Thông tin tài xế
      </h3>
      <div className="flex items-center gap-4">
        <img
          src={driver.avatar}
          alt={driver.name}
          className="w-16 h-16 rounded-xl object-cover"
        />
        <div className="flex-1">
          <p className="font-bold text-gray-900">{driver.name}</p>
          <p className="text-sm text-gray-500">Mã NV: {driver.code}</p>
          <div className="flex items-center gap-1 mt-1">
            <Star size={14} className="text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-semibold text-gray-900">{driver.rating}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => toast.success('Đang gọi...')}
            className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors"
          >
            <Phone size={18} className="text-white" />
          </button>
          <button
            onClick={() => setShowChat(true)}
            className="w-11 h-11 bg-green-600 rounded-xl flex items-center justify-center hover:bg-green-700 transition-colors"
          >
            <MessageCircle size={18} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 pb-24">
      {/* Header */}
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
        
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <button
              onClick={() => navigate(-1)}
              className="w-12 h-12 bg-white/15 backdrop-blur-xl rounded-2xl flex items-center justify-center hover:bg-white/25 transition-all active:scale-95 shadow-lg shadow-black/10"
            >
              <ArrowLeft size={20} className="text-white" strokeWidth={2.5} />
            </button>
            <div className="flex-1">
              <h1 className="text-white text-2xl font-bold tracking-tight">Theo dõi đơn hàng</h1>
              <p className="text-blue-100 text-sm">{order.vehiclePlate}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 relative z-10">
            <div className="flex items-center justify-between">
              {timelineSteps.map((step, index) => {
                const isActive = index <= getCurrentStepIndex();
                const isCurrent = index === getCurrentStepIndex();
                
                return (
                  <div key={step.key} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                          isActive
                            ? 'bg-white text-blue-600 shadow-lg'
                            : 'bg-white/20 text-white/50'
                        } ${isCurrent ? 'ring-4 ring-white/30 scale-110' : ''}`}
                      >
                        {isActive ? <CheckCircle2 size={16} strokeWidth={3} /> : index + 1}
                      </div>
                      <p
                        className={`text-[9px] mt-1.5 font-bold text-center ${
                          isActive ? 'text-white' : 'text-white/50'
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                    {index < timelineSteps.length - 1 && (
                      <div
                        className={`h-0.5 flex-1 -mt-5 transition-all ${
                          index < getCurrentStepIndex()
                            ? 'bg-white'
                            : 'bg-white/20'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
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

      {/* Content với margin-top âm giống HomeScreen */}
      <div className="px-5 -mt-28 relative z-20 space-y-4">
        {/* Debug Panel */}
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="w-full bg-gray-800 text-white py-2 rounded-lg text-xs font-bold"
        >
          {showDebug ? 'Ẩn' : 'Hiện'} Debug Panel (Dev Only)
        </button>

        {showDebug && (
          <div className="bg-white rounded-2xl p-4 shadow-xl border border-gray-200">
            <h3 className="font-bold mb-3">Chuyển trạng thái test:</h3>
            <div className="grid grid-cols-2 gap-2">
              {timelineSteps.map((step) => (
                <button
                  key={step.key}
                  onClick={() => setOrderStatus(step.key)}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-colors ${
                    orderStatus === step.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {step.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Status Content */}
        {orderStatus === 'confirmed' && (
          <>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-1 shadow-2xl">
              <div className="bg-white rounded-[22px] p-5">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="text-white" size={28} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">Đơn hàng đã được xác nhận!</h3>
                    <p className="text-gray-600 text-sm">
                      Đơn hàng của quý khách đã được trung tâm xác nhận. Nhân viên <span className="font-bold text-gray-900">{driver.name}</span> sẽ đến lấy xe vào lúc <span className="font-bold text-blue-600">{order.pickupTime}</span>.
                    </p>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-blue-600" />
                    <span className="text-gray-600">Thời gian:</span>
                    <span className="font-bold text-gray-900">{order.pickupTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={16} className="text-blue-600" />
                    <span className="text-gray-600">Địa chỉ:</span>
                    <span className="font-bold text-gray-900 flex-1">{order.pickupAddress}</span>
                  </div>
                </div>
              </div>
            </div>
            <DriverInfo />
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
              <p className="text-blue-900 text-sm">
                <span className="font-bold">Lưu ý:</span> Vui lòng chuẩn bị đầy đủ giấy tờ xe và đợi nhân viên đến nhận xe.
              </p>
            </div>
          </>
        )}

        {orderStatus === 'on_the_way' && (
          <>
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-1 shadow-2xl">
              <div className="bg-white rounded-[22px] p-5">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse">
                    <MapPin className="text-white" size={28} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">Nhân viên đang đến!</h3>
                    <p className="text-gray-600 text-sm">
                      Nhân viên <span className="font-bold text-gray-900">{driver.name}</span> đang trên đường đến địa chỉ của bạn để nhận xe.
                    </p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock size={20} className="text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-600">Dự kiến đến lúc</p>
                      <p className="text-lg font-bold text-blue-600">{order.estimatedArrival}</p>
                    </div>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2 mt-3">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Đang di chuyển đến địa chỉ của bạn...</p>
                </div>
              </div>
            </div>
            <DriverInfo />
          </>
        )}

        {orderStatus === 'receiving' && (
          <>
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl p-1 shadow-2xl">
              <div className="bg-white rounded-[22px] p-5">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <FileText className="text-white" size={28} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">Làm biên bản nhận xe</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Nhân viên đang làm biên bản nhận xe. Vui lòng kiểm tra kỹ thông tin.
                    </p>
                  </div>
                </div>

                {/* QR Payment */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 mb-4">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <QrCode size={18} className="text-orange-600" />
                    Thanh toán VietQR
                  </h4>
                  <div className="bg-white rounded-xl p-4 flex flex-col items-center">
                    <div className="w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                      <QrCode size={120} className="text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 text-center mb-2">Quét mã QR để thanh toán</p>
                    <p className="text-2xl font-bold text-gray-900">{order.totalCost.toLocaleString()}đ</p>
                    <p className="text-xs text-gray-500 mt-1">Chi phí dự kiến</p>
                  </div>
                </div>

                {/* Receipt Info */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText size={18} className="text-blue-600" />
                    Biên bản nhận xe
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Biển số xe:</span>
                      <span className="font-bold text-gray-900">{order.vehiclePlate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thời gian nhận:</span>
                      <span className="font-bold text-gray-900">{order.pickupTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trạng thái xe:</span>
                      <span className="font-bold text-green-600">Tốt</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DriverInfo />
          </>
        )}

        {orderStatus === 'in_progress' && (
          <>
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl p-1 shadow-2xl">
              <div className="bg-white rounded-[22px] p-5">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="text-white" size={28} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">Đang đăng kiểm</h3>
                    <p className="text-gray-600 text-sm">
                      Xe đang được kiểm tra tại <span className="font-bold text-gray-900">{order.station}</span>. Quá trình này có thể mất 1-2 giờ.
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div className="bg-blue-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-900">Tiến độ</span>
                    <span className="text-sm font-bold text-blue-600">75%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
                  </div>
                </div>

                {/* Documents Preview */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Camera size={18} className="text-gray-600" />
                    Giấy tờ sau đăng kiểm
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="aspect-square bg-white rounded-xl border-2 border-gray-200 flex items-center justify-center">
                        <Camera size={24} className="text-gray-300" />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">Nhân viên sẽ tải ảnh lên sau khi hoàn thành</p>
                </div>
              </div>
            </div>
            <DriverInfo />
          </>
        )}

        {orderStatus === 'returning' && (
          <>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-1 shadow-2xl">
              <div className="bg-white rounded-[22px] p-5">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse">
                    <MapPin className="text-white" size={28} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">Đang trả xe</h3>
                    <p className="text-gray-600 text-sm">
                      Quá trình đăng kiểm đã hoàn tất! Tài xế sẽ đến trả xe sau <span className="font-bold text-green-600">{order.returnTime}</span>.
                    </p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <Clock size={20} className="text-green-600" />
                    <div>
                      <p className="text-xs text-gray-600">Dự kiến đến lúc</p>
                      <p className="text-lg font-bold text-green-600">14:30</p>
                    </div>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2 mt-3">
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 h-2 rounded-full animate-pulse" style={{ width: '40%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <DriverInfo />
          </>
        )}

        {orderStatus === 'completed' && (
          <>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-1 shadow-2xl">
              <div className="bg-white rounded-[22px] p-5">
                <div className="flex flex-col items-center text-center mb-5">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="text-white" size={40} strokeWidth={2.5} />
                  </div>
                  <h3 className="font-bold text-2xl text-gray-900 mb-2">🎉 Hoàn thành!</h3>
                  <p className="text-gray-600 text-sm">
                    Cảm ơn quý khách đã tin tưởng và sử dụng dịch vụ của <span className="font-bold text-blue-600">AutoCare</span>. Chúc quý khách lái xe an toàn!
                  </p>
                </div>

                {/* Return Receipt */}
                <div className="bg-blue-50 rounded-xl p-4 mb-4">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText size={18} className="text-blue-600" />
                    Biên bản trả xe
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Biển số xe:</span>
                      <span className="font-bold text-gray-900">{order.vehiclePlate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thời gian trả:</span>
                      <span className="font-bold text-gray-900">14:30</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trạng thái xe:</span>
                      <span className="font-bold text-green-600">Tốt - Đã đăng kiểm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tổng chi phí:</span>
                      <span className="font-bold text-gray-900">{order.totalCost.toLocaleString()}đ</span>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-5">
                  <h4 className="font-bold text-gray-900 mb-3 text-center">Đánh giá dịch vụ</h4>
                  <div className="flex justify-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-110 active:scale-95"
                      >
                        <Star
                          size={36}
                          className={`${
                            star <= rating
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          }`}
                          strokeWidth={2}
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Chia sẻ trải nghiệm của bạn..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                    rows={3}
                  />
                  <button
                    onClick={handleSubmitRating}
                    className="w-full mt-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all"
                  >
                    Gửi đánh giá
                  </button>
                </div>
              </div>
            </div>
            <DriverInfo />
          </>
        )}
      </div>

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl max-h-[80vh] flex flex-col">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={driver.avatar} alt={driver.name} className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-bold text-gray-900">{driver.name}</p>
                  <p className="text-xs text-gray-500">Đang hoạt động</p>
                </div>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 p-5 overflow-y-auto">
              <div className="bg-blue-50 rounded-2xl p-4 mb-3">
                <p className="text-sm text-blue-900">
                  <span className="font-bold">Lưu ý:</span> Bạn có thể chat và gửi ảnh cho tài xế tại đây.
                </p>
              </div>
            </div>
            <div className="p-5 border-t border-gray-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center">
                  <MessageCircle size={20} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}