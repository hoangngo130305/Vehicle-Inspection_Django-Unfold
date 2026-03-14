import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Camera, Check, AlertTriangle, FileText, CheckCircle, X, Edit3, DollarSign, Plus, Trash2, CreditCard, Banknote, QrCode } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useStaffOrders } from '@/app/contexts/StaffOrdersContext';

interface ChecklistItem {
  checked: boolean;
  photo: string | null;
}

interface AdditionalCost {
  id: string;
  description: string;
  amount: number;
}

export default function VehicleReturnScreen() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { getOrderById } = useStaffOrders();
  const order = getOrderById(orderId || '');

  // 1. 6 ảnh thực tế của xe (RIÊNG BIỆT)
  const [vehiclePhotos, setVehiclePhotos] = useState({
    front: null as string | null,
    back: null as string | null,
    left: null as string | null,
    right: null as string | null,
    interior: null as string | null,
    dashboard: null as string | null,
  });

  // 2. Checklist kiểm tra (có ảnh kèm theo)
  const [checklist, setChecklist] = useState<Record<string, ChecklistItem>>({
    exterior: { checked: false, photo: null },
    tires: { checked: false, photo: null },
    lights: { checked: false, photo: null },
    mirrors: { checked: false, photo: null },
    windshield: { checked: false, photo: null },
    interior: { checked: false, photo: null },
    documents: { checked: false, photo: null },
    inspection_sticker: { checked: false, photo: null },
  });

  // 3. Chi phí phát sinh
  const [additionalCosts, setAdditionalCosts] = useState<AdditionalCost[]>([]);

  // 4. Ghi chú chung
  const [generalNote, setGeneralNote] = useState('');

  // 5. Chữ ký khách hàng
  const [customerSignature, setCustomerSignature] = useState<string | null>(null);

  // 6. Phương thức thanh toán (cho chi phí phát sinh)
  const [paymentMethod, setPaymentMethod] = useState<'qr' | 'cash'>('qr');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentRequested, setPaymentRequested] = useState(false); // Đã gửi yêu cầu thanh toán phát sinh
  const [paymentCompleted, setPaymentCompleted] = useState(false); // Khách đã thanh toán phát sinh
  const [receiptSaved, setReceiptSaved] = useState(false); // Đã lưu biên bản
  const [expiryDateSaved, setExpiryDateSaved] = useState(false); // Đã lưu ngày hết hạn đăng kiểm

  // Ngày hết hạn đăng kiểm
  const [expiryDate, setExpiryDate] = useState('');

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">
        <div className="text-center">
          <AlertTriangle size={64} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy đơn hàng</h2>
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

  // Handler cho 6 ảnh xe
  const handleVehiclePhotoCapture = (position: keyof typeof vehiclePhotos) => {
    toast.success(`Chụp ảnh ${getPhotoLabel(position)} thành công!`);
    setVehiclePhotos({
      ...vehiclePhotos,
      [position]: `https://picsum.photos/400/300?random=vehicle-${position}-${Date.now()}`,
    });
  };

  const handleRemoveVehiclePhoto = (position: keyof typeof vehiclePhotos, e: React.MouseEvent) => {
    e.stopPropagation();
    setVehiclePhotos({
      ...vehiclePhotos,
      [position]: null,
    });
    toast.success('Đã xóa ảnh');
  };

  const getPhotoLabel = (key: string) => {
    const labels: Record<string, string> = {
      front: 'phía trước',
      back: 'phía sau',
      left: 'bên trái',
      right: 'bên phải',
      interior: 'nội thất',
      dashboard: 'bảng điều khiển',
    };
    return labels[key] || key;
  };

  // Handler cho checklist photos
  const handleChecklistPhotoCapture = (itemKey: string) => {
    toast.success(`Chụp ảnh thành công!`);
    setChecklist({
      ...checklist,
      [itemKey]: {
        ...checklist[itemKey],
        photo: `https://picsum.photos/400/300?random=checklist-${itemKey}-${Date.now()}`,
      },
    });
  };

  const handleChecklistToggle = (itemKey: string) => {
    setChecklist({
      ...checklist,
      [itemKey]: {
        ...checklist[itemKey],
        checked: !checklist[itemKey].checked,
      },
    });
  };

  const handleRemoveChecklistPhoto = (itemKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChecklist({
      ...checklist,
      [itemKey]: {
        ...checklist[itemKey],
        photo: null,
      },
    });
    toast.success('Đã xóa ảnh');
  };

  // Handler cho chữ ký khách hàng
  const handleCustomerSignature = () => {
    toast.success('Đã lưu chữ ký khách hàng!');
    setCustomerSignature(`signature-${Date.now()}`);
  };

  // Handler cho chi phí phát sinh
  const handleAddCost = () => {
    const description = prompt('Mô tả chi phí:');
    if (!description) return;
    const amount = prompt('Số tiền (VNĐ):');
    if (!amount || isNaN(Number(amount))) {
      toast.error('Số tiền không hợp lệ!');
      return;
    }
    setAdditionalCosts([
      ...additionalCosts,
      {
        id: Date.now().toString(),
        description,
        amount: Number(amount),
      },
    ]);
    toast.success('Đã thêm chi phí phát sinh!');
  };

  const handleRemoveCost = (id: string) => {
    setAdditionalCosts(additionalCosts.filter(c => c.id !== id));
    toast.success('Đã xóa chi phí');
  };

  // BƯỚC 1A: Gửi yêu cầu thanh toán QR phát sinh
  const handleRequestExtraPaymentQR = () => {
    toast.success('🎉 Đã gửi yêu cầu thanh toán QR phát sinh!');
    toast.info('Khách hàng sẽ nhận được mã QR thanh toán trên app.');
    setPaymentRequested(true);

    // Simulate payment completion after 3s
    setTimeout(() => {
      toast.success('💳 Khách hàng đã thanh toán QR chi phí phát sinh!');
      setPaymentCompleted(true);
    }, 3000);
  };

  // BƯỚC 1B: Xác nhận thu tiền mặt phát sinh
  const handleCashExtraPayment = () => {
    if (confirm(`Xác nhận đã thu tiền mặt ${totalAdditionalCost.toLocaleString('vi-VN')}đ từ khách hàng?`)) {
      toast.success('💵 Đã xác nhận thu tiền mặt phát sinh!');
      setPaymentRequested(true);
      setPaymentCompleted(true);
    }
  };

  // BƯỚC 2: Lưu biên bản trả xe
  const handleSaveReturnReceipt = () => {
    // Validate 6 ảnh xe
    const vehiclePhotoCount = Object.values(vehiclePhotos).filter(p => p !== null).length;
    if (vehiclePhotoCount < 6) {
      toast.error('Vui lòng chụp đầy đủ 6 ảnh xe!');
      return;
    }

    // Validate checklist
    const checklistCount = Object.values(checklist).filter(c => c.checked).length;
    if (checklistCount < 6) {
      toast.error('Vui lòng kiểm tra ít nhất 6 hạng mục!');
      return;
    }

    // Validate ảnh checklist (các item đã check phải có ảnh)
    const checkedItemsWithoutPhoto = Object.values(checklist).filter(c => c.checked && !c.photo).length;
    if (checkedItemsWithoutPhoto > 0) {
      toast.error('Vui lòng chụp ảnh cho tất cả các hạng mục đã kiểm tra!');
      return;
    }

    // Validate chữ ký
    if (!customerSignature) {
      toast.error('Vui lòng yêu cầu khách hàng ký chữ ký!');
      return;
    }

    // Nếu có chi phí phát sinh và chưa thanh toán
    if (additionalCosts.length > 0 && !paymentCompleted) {
      toast.error('Vui lòng gửi yêu cầu thanh toán phát sinh trước!');
      return;
    }

    setIsSubmitting(true);
    // Simulate saving to server
    setTimeout(() => {
      setIsSubmitting(false);
      setReceiptSaved(true);
      toast.success('✅ Lưu biên bản trả xe thành công!');
      toast.info('🔔 Vui lòng nhập ngày hết hạn đăng kiểm!');
    }, 1500);
  };

  // BƯỚC 3: Lưu ngày hết hạn đăng kiểm
  const handleSaveExpiryDate = () => {
    if (!expiryDate) {
      toast.error('Vui lòng nhập ngày hết hạn đăng kiểm!');
      return;
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(expiryDate)) {
      toast.error('Định dạng ngày không hợp lệ!');
      return;
    }

    // Check if date is in the future
    const selectedDate = new Date(expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate <= today) {
      toast.error('Ngày hết hạn phải sau ngày hôm nay!');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setExpiryDateSaved(true);
      toast.success('✅ Lưu ngày hết hạn đăng kiểm thành công!');
      toast.success('🎉 Hoàn thành đơn hàng!');
      
      // Navigate back after saving
      setTimeout(() => {
        navigate(`/staff/order/${orderId}`);
      }, 2000);
    }, 1000);
  };

  const vehiclePhotoPositions = [
    { key: 'front' as const, label: 'Phía trước', icon: '🚗' },
    { key: 'back' as const, label: 'Phía sau', icon: '🚙' },
    { key: 'left' as const, label: 'Bên trái', icon: '🚘' },
    { key: 'right' as const, label: 'Bên phải', icon: '🚖' },
    { key: 'interior' as const, label: 'Nội thất', icon: '💺' },
    { key: 'dashboard' as const, label: 'Bảng điều khiển', icon: '🎛️' },
  ];

  const checklistItems = [
    { key: 'exterior', label: 'Ngoại thất không trầy xước' },
    { key: 'tires', label: 'Lốp xe đầy đủ, không rò' },
    { key: 'lights', label: 'Hệ thống đèn hoạt động tốt' },
    { key: 'mirrors', label: 'Gương chiếu hậu nguyên vẹn' },
    { key: 'windshield', label: 'Kính chắn gió không vỡ/nứt' },
    { key: 'interior', label: 'Nội thất sạch sẽ' },
    { key: 'documents', label: 'Giấy tờ xe đầy đủ' },
    { key: 'inspection_sticker', label: 'Tem đăng kiểm đã dán' },
  ];

  const checkedCount = Object.values(checklist).filter(c => c.checked).length;
  const photoCount = Object.values(checklist).filter(c => c.checked && c.photo).length;
  const vehiclePhotoCount = Object.values(vehiclePhotos).filter(p => p !== null).length;
  const totalAdditionalCost = additionalCosts.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 max-w-md mx-auto">
      {/* Header - Sticky */}
      <div className="sticky top-0 z-40 bg-white px-5 pt-12 pb-6 rounded-b-[2rem] shadow-md border-b border-gray-100 relative overflow-hidden">
        {/* Decorative Circle Patterns */}
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute top-6 right-8 w-24 h-24 border-2 border-purple-600 rounded-full"></div>
          <div className="absolute top-10 right-24 w-16 h-16 border-2 border-pink-600 rounded-full"></div>
          <div className="absolute bottom-2 left-6 w-28 h-28 border-2 border-purple-600 rounded-full"></div>
          <div className="absolute bottom-4 left-28 w-10 h-10 border border-pink-600 rounded-full"></div>
        </div>

        <div className="relative z-10">
          <button
            onClick={() => navigate(`/staff/order/${orderId}`)}
            className="flex items-center gap-2 text-gray-600 mb-4 -ml-1 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
            <span className="text-sm font-semibold">Quay lại</span>
          </button>
          <div>
            <h1 className="text-gray-900 text-xl font-bold mb-1 tracking-tight">Biên bản TRẢ xe</h1>
            <p className="text-gray-500 text-sm">{order.vehicle} • {order.customer}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-4 space-y-4">
        {/* Vehicle Info Summary */}
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-4 text-white shadow-lg">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-purple-100 text-sm">Khách hàng:</span>
              <span className="font-semibold">{order.customer}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-purple-100 text-sm">Loại xe:</span>
              <span className="font-semibold">{order.vehicleType}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-purple-100 text-sm">Hãng xe:</span>
              <span className="font-semibold">{order.brand}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-purple-100 text-sm">Màu sắc:</span>
              <span className="font-semibold">{order.color}</span>
            </div>
          </div>
        </div>

        {/* 1. 6 ảnh thực tế của xe */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Camera size={18} className="text-purple-600" />
            1. Chụp 6 ảnh thực tế của xe ({vehiclePhotoCount}/6)
          </h3>
          <p className="text-xs text-orange-600 mb-3 bg-orange-50 p-2 rounded-lg">
            ⚠️ Bắt buộc chụp đầy đủ 6 ảnh để lưu biên bản
          </p>
          <div className="grid grid-cols-2 gap-3">
            {vehiclePhotoPositions.map((pos) => (
              <div key={pos.key} className="space-y-2">
                <div
                  className={`relative w-full aspect-video rounded-xl border-2 border-dashed overflow-hidden ${
                    vehiclePhotos[pos.key]
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-300 bg-gray-50'
                  } transition-colors flex flex-col items-center justify-center gap-1`}
                >
                  {vehiclePhotos[pos.key] ? (
                    <>
                      <img
                        src={vehiclePhotos[pos.key]!}
                        alt={pos.label}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-purple-600/20 flex items-center justify-center pointer-events-none">
                        <Check size={32} className="text-white drop-shadow-lg" />
                      </div>
                      <button
                        onClick={(e) => handleRemoveVehiclePhoto(pos.key, e)}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors shadow-lg z-10"
                      >
                        <X size={14} className="text-white" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleVehiclePhotoCapture(pos.key)}
                      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-1"
                    >
                      <Camera size={24} className="text-gray-400" />
                      <span className="text-2xl">{pos.icon}</span>
                    </button>
                  )}
                </div>
                <p className="text-xs text-center font-medium text-gray-700">{pos.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Checklist kiểm tra (có ảnh kèm theo) */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Check size={18} className="text-green-600" />
            2. Checklist kiểm tra ({checkedCount}/{checklistItems.length})
          </h3>
          <p className="text-xs text-green-600 mb-3 bg-green-50 p-2 rounded-lg">
            💡 Mỗi hạng mục đã check phải có ảnh kèm theo
          </p>
          <div className="space-y-3">
            {checklistItems.map((item) => (
              <div
                key={item.key}
                className={`rounded-xl border-2 transition-all ${
                  checklist[item.key].checked
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {/* Checkbox */}
                <label
                  className="flex items-center gap-3 p-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={checklist[item.key].checked}
                    onChange={() => handleChecklistToggle(item.key)}
                    className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500 cursor-pointer"
                  />
                  <span className={`text-sm flex-1 ${checklist[item.key].checked ? 'text-green-900 font-semibold' : 'text-gray-700'}`}>
                    {item.label}
                  </span>
                  {checklist[item.key].checked && (
                    <Check size={18} className="text-green-600" />
                  )}
                </label>

                {/* Photo Upload - Only show if checked */}
                {checklist[item.key].checked && (
                  <div className="px-3 pb-3">
                    {checklist[item.key].photo ? (
                      <div className="relative rounded-lg overflow-hidden border-2 border-green-400">
                        <img
                          src={checklist[item.key].photo!}
                          alt={item.label}
                          className="w-full h-32 object-cover"
                        />
                        <button
                          onClick={(e) => handleRemoveChecklistPhoto(item.key, e)}
                          className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors shadow-lg"
                        >
                          <X size={16} className="text-white" />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-lg font-semibold flex items-center gap-1">
                          <Check size={12} />
                          Đã chụp
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleChecklistPhotoCapture(item.key)}
                        className="w-full h-32 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center gap-2"
                      >
                        <Camera size={24} className="text-gray-400" />
                        <span className="text-sm text-gray-600 font-medium">Chụp ảnh</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 3. Chi phí phát sinh */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <DollarSign size={18} className="text-orange-600" />
            3. Chi phí phát sinh (tùy chọn)
          </h3>
          
          {additionalCosts.length > 0 && (
            <div className="space-y-2 mb-3">
              {additionalCosts.map((cost) => (
                <div key={cost.id} className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{cost.description}</p>
                    <p className="text-xs text-orange-600 font-bold">{cost.amount.toLocaleString('vi-VN')} đ</p>
                  </div>
                  <button
                    onClick={() => handleRemoveCost(cost.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                <span className="text-sm font-bold text-gray-900">Tổng chi phí phát sinh:</span>
                <span className="text-lg font-bold text-orange-600">
                  {totalAdditionalCost.toLocaleString('vi-VN')} đ
                </span>
              </div>
            </div>
          )}

          <button
            onClick={handleAddCost}
            className="w-full py-2.5 border-2 border-dashed border-gray-300 text-gray-600 rounded-xl font-semibold hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Thêm chi phí phát sinh
          </button>
        </div>

        {/* 4. Ghi chú chung */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <FileText size={18} className="text-gray-600" />
            4. Ghi chú chung (tùy chọn)
          </h3>
          <textarea
            value={generalNote}
            onChange={(e) => setGeneralNote(e.target.value)}
            placeholder="Nhập ghi chú thêm về việc trả xe..."
            className="w-full h-24 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none text-sm"
          />
        </div>

        {/* 5. Chữ ký khách hàng */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Edit3 size={18} className="text-blue-600" />
            5. Chữ ký khách hàng
          </h3>
          <p className="text-xs text-blue-600 mb-3 bg-blue-50 p-2 rounded-lg">
            ⚠️ Yêu cầu khách hàng ký xác nhận đã nhận xe
          </p>
          <div className="space-y-3">
            <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              customerSignature 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-300 bg-gray-50'
            }`}>
              {customerSignature ? (
                <div className="space-y-2">
                  <CheckCircle size={48} className="text-green-600 mx-auto" />
                  <p className="text-green-900 font-bold">Đã ký xác nhận</p>
                  <p className="text-green-700 text-sm">Khách hàng đã ký nhận xe</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto text-3xl">
                    ✍️
                  </div>
                  <p className="text-gray-700 font-semibold">Chưa có chữ ký</p>
                  <p className="text-gray-500 text-sm">Nhấn nút bên dưới để xác nhận</p>
                </div>
              )}
            </div>
            <button
              onClick={handleCustomerSignature}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              {customerSignature ? 'Ký lại' : 'Xác nhận chữ ký'}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        {additionalCosts.length > 0 && !paymentRequested ? (
          // CÓ chi phí phát sinh → Chọn phương thức thanh toán
          <>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <CreditCard size={18} className="text-orange-600" />
                6. Phương thức thanh toán phát sinh
              </h3>
              <p className="text-xs text-orange-600 mb-3 bg-orange-50 p-2 rounded-lg">
                💡 Chọn phương thức thanh toán cho chi phí phát sinh
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPaymentMethod('qr')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'qr'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <QrCode size={32} className={`mx-auto mb-2 ${paymentMethod === 'qr' ? 'text-orange-600' : 'text-gray-400'}`} />
                  <p className={`text-sm font-semibold text-center ${paymentMethod === 'qr' ? 'text-orange-900' : 'text-gray-700'}`}>
                    VietQR
                  </p>
                  <p className="text-xs text-gray-500 text-center mt-1">Quét mã thanh toán</p>
                </button>
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'cash'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <Banknote size={32} className={`mx-auto mb-2 ${paymentMethod === 'cash' ? 'text-green-600' : 'text-gray-400'}`} />
                  <p className={`text-sm font-semibold text-center ${paymentMethod === 'cash' ? 'text-green-900' : 'text-gray-700'}`}>
                    Tiền mặt
                  </p>
                  <p className="text-xs text-gray-500 text-center mt-1">Thu tiền trực tiếp</p>
                </button>
              </div>
            </div>

            {paymentMethod === 'qr' ? (
              <button
                onClick={handleRequestExtraPaymentQR}
                className="w-full flex items-center justify-center gap-2 py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/20"
              >
                <QrCode size={20} />
                <span>Gửi yêu cầu thanh toán QR</span>
              </button>
            ) : (
              <button
                onClick={handleCashExtraPayment}
                className="w-full flex items-center justify-center gap-2 py-4 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
              >
                <Banknote size={20} />
                <span>Xác nhận thu tiền mặt</span>
              </button>
            )}
          </>
        ) : additionalCosts.length > 0 && !paymentCompleted ? (
          // Đang chờ thanh toán phát sinh QR
          <div className="bg-orange-50 rounded-2xl p-4 border-2 border-orange-200">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin mt-0.5"></div>
              <div className="flex-1">
                <p className="text-orange-900 font-bold">Đã gửi yêu cầu thanh toán QR</p>
                <p className="text-orange-700 text-sm mt-1">Đang chờ khách quét mã thanh toán {totalAdditionalCost.toLocaleString('vi-VN')}đ...</p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Nút lưu biên bản - hiện khi: không có phí phát sinh HOẶC đã thanh toán xong */}
        {(additionalCosts.length === 0 || paymentCompleted) && !receiptSaved && (
          <>
            {paymentCompleted && (
              <div className="bg-green-50 rounded-2xl p-4 border-2 border-green-200">
                <div className="flex items-center gap-3">
                  <CheckCircle size={24} className="text-green-600" />
                  <div>
                    <p className="text-green-900 font-bold">Thanh toán phát sinh thành công!</p>
                    <p className="text-green-700 text-sm">Bây giờ bạn có thể lưu biên bản</p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleSaveReturnReceipt}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-4 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <FileText size={20} />
                  <span>Lưu biên bản trả xe & Hoàn thành</span>
                </>
              )}
            </button>
          </>
        )}

        {receiptSaved && !expiryDateSaved && (
          <div className="bg-purple-50 rounded-2xl p-4 border-2 border-purple-200">
            <div className="flex items-center gap-3">
              <CheckCircle size={24} className="text-purple-600" />
              <div>
                <p className="text-purple-900 font-bold">🎉 Lưu biên bản thành công!</p>
                <p className="text-purple-700 text-sm">Vui lòng nhập ngày hết hạn đăng kiểm</p>
              </div>
            </div>
          </div>
        )}

        {expiryDateSaved && (
          <div className="bg-purple-50 rounded-2xl p-4 border-2 border-purple-200">
            <div className="flex items-center gap-3">
              <CheckCircle size={24} className="text-purple-600" />
              <div>
                <p className="text-purple-900 font-bold">🎉 Hoàn thành đơn hàng!</p>
                <p className="text-purple-700 text-sm">Đang chuyển hướng...</p>
              </div>
            </div>
          </div>
        )}

        {/* Nút lưu ngày hết hạn đăng kiểm */}
        {receiptSaved && !expiryDateSaved && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <FileText size={18} className="text-gray-600" />
              7. Nhập ngày hết hạn đăng kiểm
            </h3>
            <p className="text-xs text-gray-600 mb-3 bg-gray-50 p-2 rounded-lg">
              ⚠️ Bắt buộc nhập ngày hết hạn đăng kiểm
            </p>
            <div className="space-y-3">
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-sm"
              />
              <button
                onClick={handleSaveExpiryDate}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-4 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <FileText size={20} />
                    <span>Lưu ngày hết hạn đăng kiểm</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}