import { useNavigate, useParams } from 'react-router';
  import { ArrowLeft, Check, AlertTriangle, FileText, CheckCircle, User, Edit3, CreditCard, Banknote, QrCode, Camera, X, FileCheck } from 'lucide-react';
  import { useState } from 'react';
  import { toast } from 'sonner';
  import { useStaffOrders } from '@/app/contexts/StaffOrdersContext';
  
  interface CustomerInfo {
    fullName: string;
    dateOfBirth: string;
    idNumber: string;
    idIssuedDate: string;
    idIssuedPlace: string;
    phone: string;
    address: string;
  }
  
  interface ChecklistItem {
    checked: boolean;
    photo: string | null;
  }
  
  export default function VehicleReceiptScreen() {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const { getOrderById, markVehicleReceived } = useStaffOrders();
    const order = getOrderById(orderId || '');
  
    // Current step: 1, 2, or 3
    const [currentStep, setCurrentStep] = useState(1);
  
    // Bước 1: Thông tin khách hàng + Chữ ký
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
      fullName: '',
      dateOfBirth: '',
      idNumber: '',
      idIssuedDate: '',
      idIssuedPlace: '',
      phone: '',
      address: '',
    });
    const [customerSignature, setCustomerSignature] = useState<string | null>(null);
  
    // Bước 2: Thanh toán
    const [paymentMethod, setPaymentMethod] = useState<'qr' | 'cash'>('qr');
    const [paymentRequested, setPaymentRequested] = useState(false);
    const [paymentCompleted, setPaymentCompleted] = useState(false);
  
    // Bước 3: 6 ảnh xe + Checklist + Ghi chú + Giấy tờ xe
    const [vehiclePhotos, setVehiclePhotos] = useState({
      front: null as string | null,
      back: null as string | null,
      left: null as string | null,
      right: null as string | null,
      interior: null as string | null,
      dashboard: null as string | null,
    });
    
    const [checklist, setChecklist] = useState<Record<string, ChecklistItem>>({
      exterior: { checked: false, photo: null },
      tires: { checked: false, photo: null },
      lights: { checked: false, photo: null },
      mirrors: { checked: false, photo: null },
      windshield: { checked: false, photo: null },
      interior: { checked: false, photo: null },
      engine: { checked: false, photo: null },
      fuel: { checked: false, photo: null },
    });
  
    const [generalNote, setGeneralNote] = useState('');
    const [vehicleRegistration, setVehicleRegistration] = useState<string | null>(null);
    const [vehicleInsurance, setVehicleInsurance] = useState<string | null>(null);
  
    const [isSubmitting, setIsSubmitting] = useState(false);
  
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
  
    // Validate Bước 1
    const validateStep1 = () => {
      if (!customerInfo.fullName.trim() || !customerInfo.idNumber.trim() || 
          !customerInfo.phone.trim() || !customerInfo.address.trim()) {
        toast.error('Vui lòng điền đầy đủ thông tin khách hàng!');
        return false;
      }
      if (!customerSignature) {
        toast.error('Vui lòng yêu cầu khách hàng ký chữ ký!');
        return false;
      }
      return true;
    };
  
    // Handler Bước 1
    const handleStep1Next = () => {
      if (validateStep1()) {
        setCurrentStep(2);
        toast.success('✅ Đã hoàn thành hợp đồng và chữ ký!');
      }
    };
  
    const handleCustomerSignature = () => {
      toast.success('Đã lưu chữ ký khách hàng!');
      setCustomerSignature(`signature-${Date.now()}`);
    };
  
    // Handler Bước 2: Thanh toán QR
    const handleRequestPayment = () => {
      toast.success('🎉 Đã gửi yêu cầu thanh toán QR!');
      toast.info('Khách hàng sẽ nhận được mã QR thanh toán trên app.');
      setPaymentRequested(true);
  
      // Simulate payment completion after 3s
      setTimeout(() => {
        toast.success('💳 Khách hàng đã thanh toán QR thành công!');
        setPaymentCompleted(true);
      }, 3000);
    };
  
    // Handler Bước 2: Thanh toán tiền mặt
    const handleCashPayment = () => {
      if (confirm(`Xác nhận đã thu tiền mặt ${order.total} từ khách hàng?`)) {
        toast.success('💵 Đã xác nhận thu tiền mặt!');
        setPaymentRequested(true);
        setPaymentCompleted(true);
      }
    };
  
    // Chuyển sang bước 3
    const handleStep2Next = () => {
      if (paymentCompleted) {
        setCurrentStep(3);
        toast.success('✅ Đã hoàn thành thanh toán!');
      } else {
        toast.error('Vui lòng hoàn tất thanh toán trước!');
      }
    };
  
    // Handler Bước 3: Chụp 6 ảnh xe
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
  
    // Handler Bước 3: Chụp giấy tờ
    const handleCaptureRegistration = () => {
      toast.success('Chụp giấy đăng ký xe thành công!');
      setVehicleRegistration(`https://picsum.photos/400/300?random=registration-${Date.now()}`);
    };
  
    const handleCaptureInsurance = () => {
      toast.success('Chụp giấy bảo hiểm thành công!');
      setVehicleInsurance(`https://picsum.photos/400/300?random=insurance-${Date.now()}`);
    };
  
    const handleRemoveRegistration = (e: React.MouseEvent) => {
      e.stopPropagation();
      setVehicleRegistration(null);
      toast.success('Đã xóa ảnh');
    };
  
    const handleRemoveInsurance = (e: React.MouseEvent) => {
      e.stopPropagation();
      setVehicleInsurance(null);
      toast.success('Đã xóa ảnh');
    };
  
    // Hoàn thành quy trình
    const handleComplete = () => {
      // Validate 6 ảnh xe
      const vehiclePhotoCount = Object.values(vehiclePhotos).filter(p => p !== null).length;
      if (vehiclePhotoCount < 6) {
        toast.error('Vui lòng chụp đầy đủ 6 ảnh xe!');
        return;
      }
  
      // Validate checklist
      const checklistCount = Object.values(checklist).filter(c => c.checked).length;
      if (checklistCount < 6) {
        toast.error('Vui lòng kiểm tra tối thiểu 6 hạng mục!');
        return;
      }
  
      // Validate note
      if (!generalNote.trim()) {
        toast.error('Vui lòng nhập ghi chú tình trạng xe!');
        return;
      }
  
      // Validate giấy tờ
      if (!vehicleRegistration || !vehicleInsurance) {
        toast.error('Vui lòng chụp đầy đủ giấy đăng ký xe và bảo hiểm!');
        return;
      }
  
      setIsSubmitting(true);
      // Simulate saving to server
      setTimeout(() => {
        setIsSubmitting(false);
        
        // Mark vehicle as received in context
        if (orderId) {
          markVehicleReceived(orderId);
        }
        
        toast.success('🎉 Hoàn thành quy trình nhận xe!');
        
        // Navigate back after saving
        setTimeout(() => {
          navigate(`/staff/order/${orderId}`);
        }, 2000);
      }, 1500);
    };
  
    const steps = [
      { number: 1, title: 'Hợp đồng + Ký', icon: FileText },
      { number: 2, title: 'Thanh toán', icon: CreditCard },
      { number: 3, title: 'Chụp ảnh xe & giấy tờ', icon: Camera },
    ];
  
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
      { key: 'tires', label: 'Lốp xe còn tốt' },
      { key: 'lights', label: 'Đèn chiếu sáng hoạt động' },
      { key: 'mirrors', label: 'Gương chiếu hậu đầy đủ' },
      { key: 'windshield', label: 'Kính chắn gió nguyên vẹn' },
      { key: 'interior', label: 'Nội thất sạch sẽ' },
      { key: 'engine', label: 'Động cơ hoạt động bình thường' },
      { key: 'fuel', label: 'Xác nhận mức nhiên liệu' },
    ];
  
    const vehiclePhotoCount = Object.values(vehiclePhotos).filter(p => p !== null).length;
    const checkedCount = Object.values(checklist).filter(c => c.checked).length;
    const photoCount = Object.values(checklist).filter(c => c.checked && c.photo).length;
  
    return (
      <div className="min-h-screen bg-gray-50 pb-24 max-w-md mx-auto">
        {/* Header - Sticky */}
        <div className="sticky top-0 z-40 bg-white px-5 pt-12 pb-6 rounded-b-[2rem] shadow-md border-b border-gray-100 relative overflow-hidden">
          {/* Decorative Circle Patterns */}
          <div className="absolute inset-0 opacity-[0.06]">
            <div className="absolute top-6 right-8 w-24 h-24 border-2 border-blue-600 rounded-full"></div>
            <div className="absolute top-10 right-24 w-16 h-16 border-2 border-green-600 rounded-full"></div>
            <div className="absolute bottom-2 left-6 w-28 h-28 border-2 border-blue-600 rounded-full"></div>
            <div className="absolute bottom-4 left-28 w-10 h-10 border border-green-600 rounded-full"></div>
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
              <h1 className="text-gray-900 text-xl font-bold mb-1 tracking-tight">Quy trình NHẬN xe</h1>
              <p className="text-gray-500 text-sm">{order.vehicle} • {order.customer}</p>
            </div>
          </div>
        </div>
  
        {/* Progress Steps */}
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    currentStep > step.number 
                      ? 'bg-green-600 text-white' 
                      : currentStep === step.number
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step.number ? (
                      <Check size={20} />
                    ) : (
                      <step.icon size={20} />
                    )}
                  </div>
                  <p className={`text-xs font-semibold mt-2 text-center ${
                    currentStep >= step.number ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-full -mt-6 transition-colors ${
                    currentStep > step.number ? 'bg-green-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
  
        {/* Content */}
        <div className="px-5 py-4 space-y-4">
          {/* Vehicle Info Summary */}
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-4 text-white shadow-lg">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-green-100 text-sm">Khách hàng:</span>
                <span className="font-semibold">{order.customer}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-100 text-sm">Loại xe:</span>
                <span className="font-semibold">{order.vehicleType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-100 text-sm">Hãng xe:</span>
                <span className="font-semibold">{order.brand}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-100 text-sm">Tổng chi phí:</span>
                <span className="font-bold text-lg">{order.total}</span>
              </div>
            </div>
          </div>
  
          {/* BƯỚC 1: Làm hợp đồng + Ký */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Thông tin khách hàng */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <User size={18} className="text-blue-600" />
                  Thông tin khách hàng
                </h3>
                <p className="text-xs text-blue-600 mb-3 bg-blue-50 p-2 rounded-lg">
                  💡 Thông tin này sẽ được điền vào biên bản ủy quyền
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customerInfo.fullName}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, fullName: e.target.value })}
                      placeholder="Nhập họ và tên đầy đủ"
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Ngày sinh <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={customerInfo.dateOfBirth}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, dateOfBirth: e.target.value })}
                      placeholder="Nhập ngày sinh"
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      CMND/CCCD <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customerInfo.idNumber}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, idNumber: e.target.value })}
                      placeholder="Nhập số CMND/CCCD"
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Ngày cấp CMND/CCCD <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={customerInfo.idIssuedDate}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, idIssuedDate: e.target.value })}
                      placeholder="Nhập ngày cấp CMND/CCCD"
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Nơi cấp CMND/CCCD <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customerInfo.idIssuedPlace}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, idIssuedPlace: e.target.value })}
                      placeholder="Nhập nơi cấp CMND/CCCD"
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      placeholder="Nhập số điện thoại"
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Địa chỉ <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                      placeholder="Nhập địa chỉ đầy đủ"
                      className="w-full h-20 px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none text-sm"
                    />
                  </div>
                </div>
              </div>
  
              {/* Hiển thị hợp đồng */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText size={18} className="text-green-600" />
                  Hợp đồng ủy quyền
                </h3>
                <p className="text-xs text-green-600 mb-3 bg-green-50 p-2 rounded-lg">
                  📄 Khách hàng vui lòng đọc kỹ hợp đồng trước khi ký
                </p>
                
                {/* Contract Content - Scrollable */}
                <div className="max-h-96 overflow-y-auto border-2 border-gray-200 rounded-xl p-4 bg-gray-50 text-xs leading-relaxed">
                  <div className="text-center font-bold mb-2">
                    <p>CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                    <p>ĐỘC LẬP - TỰ DO - HẠNH PHÚC</p>
                  </div>
                  
                  <div className="text-center font-bold my-3">
                    <p>HỢP ĐỒNG UỶ QUYỀN</p>
                    <p className="text-[10px] font-normal">(V/v: Nhận xe ô tô và thực hiện thủ tục đăng kiểm)</p>
                  </div>
  
                  <p className="text-center mb-3">
                    Hôm nay, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}, tại Hồ Chí Minh
                  </p>
                  <p className="mb-2">chúng tôi gồm có:</p>
  
                  <p className="font-bold mb-2">BÊN ỦY QUYỀN (BÊN A – CHỦ XE)</p>
                  
                  <p className="mb-1">
                    Họ và tên: <span className="font-semibold text-blue-600">{customerInfo.fullName || '.................................'}</span>
                  </p>
                  
                  <p className="mb-1">
                    Ngày sinh: <span className="font-semibold text-blue-600">{customerInfo.dateOfBirth || '..............'}</span>
                  </p>
                  
                  <p className="mb-1">
                    Số CCCD/CMND/Hộ chiếu: <span className="font-semibold text-blue-600">{customerInfo.idNumber || '................'}</span> cấp ngày {customerInfo.idIssuedDate || '..............'} nơi cấp {customerInfo.idIssuedPlace || '..................................'}
                  </p>
                  
                  <p className="mb-1">
                    Địa chỉ thường trú: <span className="font-semibold text-blue-600">{customerInfo.address || '.........................................'}</span>
                  </p>
                  
                  <p className="mb-2">
                    Số điện thoại: <span className="font-semibold text-blue-600">{customerInfo.phone || '.................................'}</span>
                  </p>
  
                  <p className="mb-1">Là chủ sở hữu hợp pháp của xe ô tô có thông tin sau:</p>
                  
                  <p className="mb-1">Nhãn hiệu xe: <span className="font-semibold text-blue-600">{order.brand}</span></p>
                  <p className="mb-1">Biển số: <span className="font-semibold text-blue-600">{order.vehicle}</span></p>
                  <p className="mb-1">Số khung: .................................................</p>
                  <p className="mb-2">Số máy: .................................................</p>
  
                  <p className="font-bold mb-2">BÊN ĐƯỢC ỦY QUYỀN (BÊN B – ĐƠN VỊ DỊCH VỤ)</p>
                  
                  <p className="mb-1">TRUNG TÂM HỖ TRỢ DỊCH VỤ ĐĂNG KIỂM VIỆT DKV 50S</p>
                  <p className="mb-1">Mã số doanh nghiệp: 0316969591 - 00005</p>
                  <p className="mb-1">Địa chỉ trụ sở: 26B Đường 34 - Phường Thủ Đức – TP.HCM</p>
                  <p className="mb-1">Đại diện theo pháp luật: Đặng Hồng Nam - Chức vụ: Giám Đốc</p>
                  <p className="mb-3">Số điện thoại: 0944484444</p>
  
                  <p className="font-bold mb-2">ĐIỀU 1. NỘI DUNG VÀ PHẠM VI ỦY QUYỀN</p>
                  <p className="mb-1">Bên A đồng ý ủy quyền cho Bên B thực hiện các công việc sau:</p>
                  <p className="mb-1">• Nhận xe ô tô nêu trên tại địa chỉ do Bên A chỉ định.</p>
                  <p className="mb-1">• Thay mặt Bên A điều khiển xe chỉ nhằm mục đích đưa xe đi đăng kiểm và đưa xe trở lại.</p>
                  <p className="mb-1">• Thực hiện các thủ tục đăng kiểm xe cơ giới theo quy định pháp luật.</p>
                  <p className="mb-1">• Nộp các khoản phí, lệ phí đăng kiểm (nếu có) theo thỏa thuận giữa hai bên.</p>
                  <p className="mb-1">• Nhận lại Giấy chứng nhận kiểm định và tem kiểm định để bàn giao cho Bên A.</p>
                  <p className="mb-3 text-red-600 font-semibold">👉 Bên B không được sử dụng xe vào bất kỳ mục đích nào khác ngoài các nội dung nêu trên.</p>
  
                  <p className="font-bold mb-2">ĐIỀU 2. THỜI HẠN ỦY QUYỀN</p>
                  <p className="mb-1">Thời hạn ủy quyền: từ ngày {new Date().getDate()}/{new Date().getMonth() + 1}/{new Date().getFullYear()} cho đến khi đăng kiểm xong</p>
                  <p className="mb-3">Văn bản ủy quyền tự động chấm dứt hiệu lực sau khi Bên B hoàn thành việc bàn giao xe và giấy tờ liên quan cho Bên A.</p>
  
                  <p className="font-bold mb-2">ĐIỀU 3. CAM KẾT CỦA BÊN B (ĐƠN VỊ DỊCH VỤ)</p>
                  <p className="mb-1">• Thực hiện đúng phạm vi ủy quyền, tuân thủ luật giao thông đường bộ.</p>
                  <p className="mb-1">• Chịu trách nhiệm đối với các vi phạm giao thông phát sinh do lỗi của Bên B trong thời gian nhận và điều khiển xe.</p>
                  <p className="mb-1">• Bồi thường thiệt hại nếu xảy ra mất mát, hư hỏng xe do lỗi của Bên B.</p>
                  <p className="mb-3">• Không giao xe cho bên thứ ba khi chưa có sự đồng ý của Bên A (trừ trường hợp nhân sự của công ty thực hiện theo phân công nội bộ).</p>
  
                  <p className="font-bold mb-2">ĐIỀU 4. CAM KẾT CỦA BÊN A (CHỦ XE)</p>
                  <p className="mb-1">• Cam kết xe đủ điều kiện lưu hành, không tranh chấp, không bị cầm cố, thế chấp trái pháp luật.</p>
                  <p className="mb-1">• Cung cấp đầy đủ, trung thực giấy tờ liên quan đến xe (đăng ký xe, bảo hiểm, giấy tờ khác nếu có).</p>
                  <p className="mb-1">• Chịu trách nhiệm đối với các lỗi kỹ thuật, tình trạng xe không đạt đăng kiểm không phát sinh từ quá trình vận chuyển của Bên B.</p>
                  <p className="mb-3">• Thanh toán đầy đủ chi phí dịch vụ theo thỏa thuận.</p>
  
                  <p className="font-bold mb-2">ĐIỀU 5. GIỚI HẠN TRÁCH NHIỆM</p>
                  <p className="mb-1">Bên B không chịu trách nhiệm đối với:</p>
                  <p className="mb-1">• Các hư hỏng, sự cố do lỗi kỹ thuật có sẵn của xe.</p>
                  <p className="mb-1">• Việc xe không đạt đăng kiểm do nguyên nhân khách quan hoặc tình trạng xe.</p>
                  <p className="mb-3">• Sự kiện bất khả kháng (tai nạn không do lỗi, thiên tai, sự cố giao thông ngoài tầm kiểm soát).</p>
  
                  <p className="font-bold mb-2">ĐIỀU 6. HIỆU LỰC</p>
                  <p className="mb-1">Văn bản này được lập thành 02 bản, mỗi bên giữ 01 bản, có giá trị pháp lý như nhau.</p>
                  <p className="mb-4">Hai bên đã đọc, hiểu rõ quyền và nghĩa vụ của mình và tự nguyện ký tên dưới đây.</p>
  
                  <div className="flex justify-between mt-6">
                    <div className="text-center">
                      <p className="font-bold mb-1">ĐẠI DIỆN BÊN A</p>
                      <p className="text-[10px]">(Ký, ghi rõ họ tên)</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold mb-1">ĐẠI DIỆN BÊN B</p>
                      <p className="text-[10px]">(Ký, ghi rõ họ tên, đóng dấu)</p>
                      <p className="mt-8 font-bold">ĐẶNG HỒNG NAM</p>
                    </div>
                  </div>
                </div>
              </div>
  
              {/* Chữ ký khách hàng */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Edit3 size={18} className="text-orange-600" />
                  Chữ ký khách hàng
                </h3>
                <p className="text-xs text-orange-600 mb-3 bg-orange-50 p-2 rounded-lg">
                  ⚠️ Yêu cầu khách hàng ký vào biên bản ủy quyền
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
                        <p className="text-green-700 text-sm">Khách hàng đã ký biên bản</p>
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
                    className="w-full py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors"
                  >
                    {customerSignature ? 'Ký lại' : 'Xác nhận chữ ký'}
                  </button>
                </div>
              </div>
  
              {/* Button tiếp tục */}
              <button
                onClick={handleStep1Next}
                className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
              >
                <FileCheck size={20} />
                <span>Tiếp tục thanh toán</span>
              </button>
            </div>
          )}
  
          {/* BƯỚC 2: Thanh toán */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Chọn phương thức thanh toán */}
              {!paymentRequested && (
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <CreditCard size={18} className="text-blue-600" />
                    Phương thức thanh toán
                  </h3>
                  <p className="text-xs text-blue-600 mb-3 bg-blue-50 p-2 rounded-lg">
                    💡 Chọn phương thức thanh toán phù hợp
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                      onClick={() => setPaymentMethod('qr')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === 'qr'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <QrCode size={32} className={`mx-auto mb-2 ${paymentMethod === 'qr' ? 'text-blue-600' : 'text-gray-400'}`} />
                      <p className={`text-sm font-semibold text-center ${paymentMethod === 'qr' ? 'text-blue-900' : 'text-gray-700'}`}>
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
  
                  {/* Button xác nhận thanh toán */}
                  {paymentMethod === 'qr' ? (
                    <button
                      onClick={handleRequestPayment}
                      className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                    >
                      <QrCode size={20} />
                      <span>Gửi yêu cầu thanh toán QR</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleCashPayment}
                      className="w-full flex items-center justify-center gap-2 py-4 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
                    >
                      <Banknote size={20} />
                      <span>Xác nhận thu tiền mặt</span>
                    </button>
                  )}
                </div>
              )}
  
              {/* Đang chờ thanh toán QR */}
              {paymentRequested && !paymentCompleted && (
                <div className="bg-orange-50 rounded-2xl p-6 border-2 border-orange-200 animate-pulse">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin mt-0.5"></div>
                    <div className="flex-1">
                      <p className="text-orange-900 font-bold text-lg">Đã gửi yêu cầu thanh toán QR</p>
                      <p className="text-orange-700 text-sm mt-1">Đang chờ khách hàng quét mã thanh toán...</p>
                    </div>
                  </div>
                </div>
              )}
  
              {/* Thanh toán thành công */}
              {paymentCompleted && (
                <>
                  <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle size={32} className="text-green-600" />
                      <div>
                        <p className="text-green-900 font-bold text-lg">Thanh toán thành công!</p>
                        <p className="text-green-700 text-sm mt-1">
                          {paymentMethod === 'qr' ? 'Đã nhận thanh toán QR' : 'Đã thu tiền mặt'} {order.total}
                        </p>
                      </div>
                    </div>
                  </div>
  
                  {/* Button tiếp tục */}
                  <button
                    onClick={handleStep2Next}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                  >
                    <Camera size={20} />
                    <span>Tiếp tục chụp ảnh xe & giấy tờ</span>
                  </button>
                </>
              )}
  
              {/* Button quay lại */}
              {!paymentRequested && (
                <button
                  onClick={() => setCurrentStep(1)}
                  className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Quay lại
                </button>
              )}
            </div>
          )}
  
          {/* BƯỚC 3: Chụp 6 ảnh xe + Checklist + Ghi chú + Giấy tờ */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* 6 ảnh thực tế của xe */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Camera size={18} className="text-green-600" />
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
                            ? 'border-green-500 bg-green-50'
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
                            <div className="absolute inset-0 bg-green-600/20 flex items-center justify-center pointer-events-none">
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
  
              {/* Checklist kiểm tra (có ảnh kèm theo) */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Check size={18} className="text-purple-600" />
                  2. Checklist kiểm tra ({checkedCount}/{checklistItems.length})
                </h3>
                <p className="text-xs text-purple-600 mb-3 bg-purple-50 p-2 rounded-lg">
                  💡 Mỗi hạng mục đã check phải có ảnh kèm theo
                </p>
                <div className="space-y-3">
                  {checklistItems.map((item) => (
                    <div
                      key={item.key}
                      className={`rounded-xl border-2 transition-all ${
                        checklist[item.key].checked
                          ? 'border-purple-500 bg-purple-50'
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
                          className="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500 cursor-pointer"
                        />
                        <span className={`text-sm flex-1 ${checklist[item.key].checked ? 'text-purple-900 font-semibold' : 'text-gray-700'}`}>
                          {item.label}
                        </span>
                        {checklist[item.key].checked && (
                          <Check size={18} className="text-purple-600" />
                        )}
                      </label>
  
                      {/* Photo Upload - Only show if checked */}
                      {checklist[item.key].checked && (
                        <div className="px-3 pb-3">
                          {checklist[item.key].photo ? (
                            <div className="relative rounded-lg overflow-hidden border-2 border-purple-400">
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
                              <div className="absolute bottom-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-lg font-semibold flex items-center gap-1">
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
  
              {/* Ghi chú chung */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText size={18} className="text-gray-600" />
                  3. Ghi chú chung (tùy chọn)
                </h3>
                <textarea
                  value={generalNote}
                  onChange={(e) => setGeneralNote(e.target.value)}
                  placeholder="Nhập ghi chú thêm về tình trạng xe..."
                  className="w-full h-24 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none resize-none text-sm"
                />
              </div>
  
              {/* Giấy đăng ký xe */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText size={18} className="text-blue-600" />
                  4. Giấy đăng ký xe <span className="text-red-500">*</span>
                </h3>
                <p className="text-xs text-blue-600 mb-3 bg-blue-50 p-2 rounded-lg">
                  📄 Chụp rõ toàn bộ nội dung giấy đăng ký xe
                </p>
                <div
                  className={`relative w-full aspect-video rounded-xl border-2 border-dashed overflow-hidden ${
                    vehicleRegistration
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 bg-gray-50'
                  } transition-colors flex flex-col items-center justify-center gap-2`}
                >
                  {vehicleRegistration ? (
                    <>
                      <img
                        src={vehicleRegistration}
                        alt="Giấy đăng ký xe"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-green-600/20 flex items-center justify-center pointer-events-none">
                        <Check size={48} className="text-white drop-shadow-lg" />
                      </div>
                      <button
                        onClick={handleRemoveRegistration}
                        className="absolute top-3 right-3 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors shadow-lg z-10"
                      >
                        <X size={18} className="text-white" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleCaptureRegistration}
                      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-2"
                    >
                      <Camera size={40} className="text-gray-400" />
                      <p className="text-sm font-semibold text-gray-600">Chụp giấy đăng ký xe</p>
                    </button>
                  )}
                </div>
              </div>
  
              {/* Giấy bảo hiểm */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FileCheck size={18} className="text-purple-600" />
                  5. Giấy bảo hiểm <span className="text-red-500">*</span>
                </h3>
                <p className="text-xs text-purple-600 mb-3 bg-purple-50 p-2 rounded-lg">
                  📋 Chụp rõ toàn bộ nội dung giấy bảo hiểm
                </p>
                <div
                  className={`relative w-full aspect-video rounded-xl border-2 border-dashed overflow-hidden ${
                    vehicleInsurance
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 bg-gray-50'
                  } transition-colors flex flex-col items-center justify-center gap-2`}
                >
                  {vehicleInsurance ? (
                    <>
                      <img
                        src={vehicleInsurance}
                        alt="Giấy bảo hiểm"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-green-600/20 flex items-center justify-center pointer-events-none">
                        <Check size={48} className="text-white drop-shadow-lg" />
                      </div>
                      <button
                        onClick={handleRemoveInsurance}
                        className="absolute top-3 right-3 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors shadow-lg z-10"
                      >
                        <X size={18} className="text-white" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleCaptureInsurance}
                      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-2"
                    >
                      <Camera size={40} className="text-gray-400" />
                      <p className="text-sm font-semibold text-gray-600">Chụp giấy bảo hiểm</p>
                    </button>
                  )}
                </div>
              </div>
  
              {/* Tình trạng hoàn thành */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 border-2 border-blue-200">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle size={18} className="text-blue-600" />
                  Tình trạng hoàn thành
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg">
                    <span className="text-sm text-gray-700 font-medium">1. 6 ảnh xe</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${vehiclePhotoCount === 6 ? 'text-green-600' : 'text-gray-400'}`}>
                        {vehiclePhotoCount}/6
                      </span>
                      {vehiclePhotoCount === 6 ? (
                        <CheckCircle size={18} className="text-green-600" />
                      ) : (
                        <div className="w-4.5 h-4.5 rounded-full border-2 border-gray-300"></div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg">
                    <span className="text-sm text-gray-700 font-medium">2. Checklist + Ảnh</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${photoCount === checkedCount && checkedCount >= 6 ? 'text-green-600' : 'text-gray-400'}`}>
                        {photoCount}/{checkedCount}
                      </span>
                      {photoCount === checkedCount && checkedCount >= 6 ? (
                        <CheckCircle size={18} className="text-green-600" />
                      ) : (
                        <div className="w-4.5 h-4.5 rounded-full border-2 border-gray-300"></div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg">
                    <span className="text-sm text-gray-700 font-medium">4. Giấy đăng ký xe</span>
                    {vehicleRegistration ? (
                      <CheckCircle size={18} className="text-green-600" />
                    ) : (
                      <div className="w-4.5 h-4.5 rounded-full border-2 border-gray-300"></div>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg">
                    <span className="text-sm text-gray-700 font-medium">5. Giấy bảo hiểm</span>
                    {vehicleInsurance ? (
                      <CheckCircle size={18} className="text-green-600" />
                    ) : (
                      <div className="w-4.5 h-4.5 rounded-full border-2 border-gray-300"></div>
                    )}
                  </div>
                </div>
              </div>
  
              {/* Button hoàn thành */}
              <button
                onClick={handleComplete}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-4 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang hoàn thành...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    <span>Hoàn thành quy trình nhận xe</span>
                  </>
                )}
              </button>
  
              {/* Button quay lại */}
              <button
                onClick={() => setCurrentStep(2)}
                className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Quay lại
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }