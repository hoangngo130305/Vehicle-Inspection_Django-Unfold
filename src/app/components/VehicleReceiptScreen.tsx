import { ArrowLeft, CheckCircle, Camera, Upload, Edit3, QrCode, Check, CreditCard, X } from 'lucide-react';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router';

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export default function VehicleReceiptScreen() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  
  const [step, setStep] = useState<'receipt' | 'payment' | 'success'>('receipt');
  const [paymentCountdown, setPaymentCountdown] = useState(300); // 5 minutes

  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: '1', label: 'Ngoại thất xe không bị trầy xước, móp méo', checked: false },
    { id: '2', label: 'Kính chắn gió, đèn, gương không bị hư hỏng', checked: false },
    { id: '3', label: 'Lốp xe còn tốt, không bị xẹp hoặc rách', checked: false },
    { id: '4', label: 'Nội thất sạch sẽ, không bị hư hại', checked: false },
    { id: '5', label: 'Đầy đủ giấy tờ xe: Đăng ký, bảo hiểm', checked: false },
    { id: '6', label: 'Tem đăng kiểm mới đã được dán đúng vị trí', checked: false },
  ]);

  const [photos, setPhotos] = useState<string[]>([]);
  const [signature, setSignature] = useState<string>('');
  const [notes, setNotes] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Mock booking data
  const bookingData = {
    bookingCode: orderId || 'DK001',
    licensePlate: '51F-12345',
    vehicleType: 'Ô tô con 5 chỗ',
    center: 'Trung tâm 5001D',
    staffName: 'Lê Văn C',
    staffCode: 'NV003',
    amount: 561000,
  };

  const handleCheckToggle = (id: string) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handlePhotoUpload = () => {
    const mockPhoto = `https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop`;
    setPhotos(prev => [...prev, mockPhoto]);
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  // Canvas signature
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1e40af';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setSignature(canvas.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setSignature('');
    }
  };

  const handleConfirmReceipt = () => {
    toast.success('Xác nhận nhận xe thành công!');
    setStep('payment');
    
    // Start countdown
    const interval = setInterval(() => {
      setPaymentCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handlePaymentSuccess = () => {
    setStep('success');
    toast.success('Thanh toán thành công!');
    setTimeout(() => {
      navigate('/home');
    }, 2000);
  };

  const allChecked = checklist.every(item => item.checked);
  const canConfirm = allChecked && signature;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // STEP 3: Success Screen
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">
        <div className="bg-white rounded-3xl p-8 text-center max-w-sm w-full shadow-lg">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="text-green-600" size={40} strokeWidth={3} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Hoàn tất!</h2>
          <p className="text-gray-600 mb-6">
            Đã thanh toán và nhận xe thành công.<br/>
            Chúc bạn lái xe an toàn!
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate(`/invoice/${orderId}`)}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Xem hóa đơn
            </button>
            <button
              onClick={() => navigate('/home')}
              className="w-full py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 2: Payment Screen
  if (step === 'payment') {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        {/* Header */}
        <div className="bg-white px-5 pt-10 pb-6 rounded-b-[2rem] shadow-md border-b border-gray-100 relative overflow-hidden sticky top-0 z-40">
          <div className="absolute inset-0 opacity-[0.04]">
            <div className="absolute top-6 right-8 w-24 h-24 border-2 border-gray-900 rounded-full"></div>
            <div className="absolute top-10 right-24 w-16 h-16 border-2 border-gray-900 rounded-full"></div>
            <div className="absolute bottom-2 left-6 w-28 h-28 border-2 border-gray-900 rounded-full"></div>
          </div>
          
          <div className="relative z-10">
            <h1 className="text-gray-900 font-bold text-xl tracking-tight mb-1">Thanh toán dịch vụ</h1>
            <p className="text-gray-500 text-xs">Quét mã QR để thanh toán chi phí đăng kiểm</p>
          </div>
        </div>

        <div className="px-5 pt-5 space-y-5">
          {/* Payment Info */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 shadow-lg shadow-blue-600/20 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-blue-100 text-xs mb-1 font-medium">Mã đơn hàng</p>
                <p className="font-bold text-lg">{bookingData.bookingCode}</p>
              </div>
              <div className="bg-yellow-500 px-3 py-1.5 rounded-xl">
                <p className="text-xs font-bold">⏱ {formatTime(paymentCountdown)}</p>
              </div>
            </div>
            
            <div className="pt-3 border-t border-white/20">
              <p className="text-blue-100 text-xs mb-1">Tổng thanh toán</p>
              <p className="font-bold text-2xl">{bookingData.amount.toLocaleString('vi-VN')} đ</p>
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <QrCode className="text-purple-600" size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-gray-900 font-bold text-sm">Mã QR thanh toán</h3>
                <p className="text-gray-500 text-xs">Quét bằng ứng dụng ngân hàng</p>
              </div>
            </div>

            {/* Mock QR Code */}
            <div className="bg-gray-100 rounded-2xl p-6 flex items-center justify-center mb-4">
              <div className="bg-white p-4 rounded-xl">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=VietQR_Payment_561000" 
                  alt="VietQR" 
                  className="w-48 h-48"
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-900">
                <span className="font-bold">Lưu ý:</span> Vui lòng không thoát khỏi màn hình này cho đến khi thanh toán hoàn tất.
              </p>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="text-gray-900 font-bold text-sm mb-3">Chi tiết thanh toán</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Phí đăng kiểm</span>
                <span className="font-semibold text-gray-900">340,000 đ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Kiểm tra khí thải</span>
                <span className="font-semibold text-gray-900">50,000 đ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tem đăng kiểm</span>
                <span className="font-semibold text-gray-900">120,000 đ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">VAT (10%)</span>
                <span className="font-semibold text-gray-900">51,000 đ</span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between">
                <span className="text-gray-900 font-bold">Tổng cộng</span>
                <span className="text-blue-600 font-bold text-lg">561,000 đ</span>
              </div>
            </div>
          </div>

          {/* Mock Payment Button */}
          <button
            onClick={handlePaymentSuccess}
            className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl font-bold text-base shadow-lg hover:from-green-700 hover:to-green-800 active:scale-95 transition-all shadow-green-600/30"
          >
            ✓ Xác nhận đã thanh toán
          </button>

          <p className="text-gray-400 text-xs text-center">
            Sau khi quét mã thanh toán thành công, vui lòng nhấn nút xác nhận
          </p>
        </div>
      </div>
    );
  }

  // STEP 1: Receipt Screen
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-5 pt-10 pb-6 rounded-b-[2rem] shadow-md border-b border-gray-100 relative overflow-hidden sticky top-0 z-40">
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute top-6 right-8 w-24 h-24 border-2 border-gray-900 rounded-full"></div>
          <div className="absolute top-10 right-24 w-16 h-16 border-2 border-gray-900 rounded-full"></div>
          <div className="absolute bottom-2 left-6 w-28 h-28 border-2 border-gray-900 rounded-full"></div>
        </div>
        
        <div className="relative z-10">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 mb-3 -ml-1 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
            <span className="text-sm font-semibold">Quay lại</span>
          </button>
          <h1 className="text-gray-900 font-bold text-xl tracking-tight mb-1">Xác nhận nhận xe</h1>
          <p className="text-gray-500 text-xs">Kiểm tra tình trạng xe trước khi nhận</p>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-5">
        {/* Booking Info */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 shadow-lg shadow-blue-600/20 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-blue-100 text-xs mb-1 font-medium">Mã đặt lịch</p>
              <p className="font-bold text-lg">{bookingData.bookingCode}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-xl">
              <p className="text-xs font-bold">✓ Hoàn thành</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-blue-100 text-xs mb-1">Biển số xe</p>
              <p className="font-bold text-sm">{bookingData.licensePlate}</p>
            </div>
            <div>
              <p className="text-blue-100 text-xs mb-1">Loại xe</p>
              <p className="font-bold text-sm">{bookingData.vehicleType}</p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-white/20">
            <p className="text-blue-100 text-xs mb-1">Nhân viên giao xe</p>
            <p className="font-bold text-sm">{bookingData.staffName} - {bookingData.staffCode}</p>
          </div>
        </div>

        {/* Checklist */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="text-blue-600" size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold text-sm">Kiểm tra tình trạng xe</h3>
              <p className="text-gray-500 text-xs">
                {checklist.filter(i => i.checked).length}/{checklist.length} mục đã kiểm tra
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {checklist.map((item) => (
              <label
                key={item.id}
                className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  item.checked
                    ? 'bg-green-50 border-green-500'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleCheckToggle(item.id)}
                  className="w-5 h-5 mt-0.5 accent-green-600 cursor-pointer"
                />
                <span className={`text-sm flex-1 ${item.checked ? 'text-green-900 font-medium' : 'text-gray-700'}`}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Photos */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Camera className="text-purple-600" size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-gray-900 font-bold text-sm">Hình ảnh xe</h3>
                <p className="text-gray-500 text-xs">Tùy chọn: Chụp ảnh để lưu trữ</p>
              </div>
            </div>
            <button
              onClick={handlePhotoUpload}
              className="p-2 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-200 transition-colors"
            >
              <Upload size={18} strokeWidth={2.5} />
            </button>
          </div>

          {photos.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo}
                    alt={`Vehicle ${index + 1}`}
                    className="w-full h-24 object-cover rounded-xl"
                  />
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <label className="block">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Edit3 className="text-orange-600" size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-gray-900 font-bold text-sm">Ghi chú (nếu có)</h3>
                <p className="text-gray-500 text-xs">Vấn đề hoặc điểm lưu ý</p>
              </div>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ví dụ: Có vết xước nhỏ ở cửa trước bên trái..."
              className="w-full h-24 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none resize-none text-sm"
            />
          </label>
        </div>

        {/* Signature */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Edit3 className="text-blue-600" size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-gray-900 font-bold text-sm">Chữ ký xác nhận</h3>
                <p className="text-gray-500 text-xs">Ký tên để xác nhận nhận xe</p>
              </div>
            </div>
            <button
              onClick={clearSignature}
              className="text-red-600 text-xs font-bold hover:text-red-700"
            >
              Xóa
            </button>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden">
            <canvas
              ref={canvasRef}
              width={320}
              height={160}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-40 cursor-crosshair touch-none bg-gray-50"
            />
          </div>
          <p className="text-gray-400 text-xs mt-2 text-center">Vẽ chữ ký của bạn ở trên</p>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirmReceipt}
          disabled={!canConfirm}
          className={`w-full py-4 rounded-2xl font-bold text-base shadow-lg transition-all ${
            canConfirm
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 active:scale-95 shadow-blue-600/30'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {canConfirm ? 'Tiếp tục thanh toán →' : '⚠️ Vui lòng hoàn thành checklist & ký tên'}
        </button>

        <p className="text-gray-400 text-xs text-center">
          Sau khi xác nhận, bạn sẽ được chuyển đến màn hình thanh toán
        </p>
      </div>
    </div>
  );
}
