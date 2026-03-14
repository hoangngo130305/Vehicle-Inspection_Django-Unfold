import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ChevronRight, MapPin, Clock, Car, Phone, CheckCircle, Search, ChevronLeft, User, Mail, Edit2, Trash2, Plus, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

type BookingStep = 1 | 2 | 3 | 4;

interface InspectionCenter {
  id: string;
  name: string;
  address: string;
  distance: string;
  status: 'empty' | 'normal' | 'busy';
}

interface ContactInfo {
  id: string;
  name: string;
  phone: string;
  email: string;
}

const centers: InspectionCenter[] = [
  { id: '1', name: 'Trung tâm Đăng kiểm 29-03D', address: 'Số 8 Phạm Hùng, Cầu Giấy, Hà Nội', distance: '2.3 km', status: 'empty' },
  { id: '2', name: 'Trung tâm Đăng kiểm 29-02V', address: 'Số 456 Giải Phóng, Hai Bà Trưng, Hà Nội', distance: '4.5 km', status: 'normal' },
  { id: '3', name: 'Trung tâm Đăng kiểm 29-01S', address: 'Số 120 Nguyễn Trãi, Thanh Xuân, Hà Nội', distance: '5.8 km', status: 'busy' },
  { id: '4', name: 'Trung tâm Đăng kiểm 29-04D', address: 'Số 234 Láng Hạ, Đống Đa, Hà Nội', distance: '3.2 km', status: 'normal' },
];

const timeSlots = [
  { id: 'morning-1', time: '08:00 - 09:00', period: 'morning' },
  { id: 'morning-2', time: '09:00 - 10:00', period: 'morning' },
  { id: 'morning-3', time: '10:00 - 11:00', period: 'morning' },
  { id: 'afternoon-1', time: '13:00 - 14:00', period: 'afternoon' },
  { id: 'afternoon-2', time: '14:00 - 15:00', period: 'afternoon' },
  { id: 'afternoon-3', time: '15:00 - 16:00', period: 'afternoon' },
];

export default function BookingScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState<BookingStep>(1);
  const [selectedCenter, setSelectedCenter] = useState<InspectionCenter | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicleInfo, setVehicleInfo] = useState({
    licensePlate: '',
    vehicleType: '',
    phoneNumber: '',
    isModified: false,
  });
  
  // Saved contacts management
  const [savedContacts, setSavedContacts] = useState<ContactInfo[]>([
    { id: '1', name: 'Nguyễn Văn A', phone: '0912 345 678', email: 'nguyenvana@email.com' },
    { id: '2', name: 'Trần Thị B', phone: '0987 654 321', email: 'tranthib@email.com' },
  ]);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '' });
  const [editingContactId, setEditingContactId] = useState<string | null>(null);

  // Auto-select center from navigation state (from MapScreen)
  useEffect(() => {
    if (location.state?.preselectedCenter) {
      const preselectedCenter = location.state.preselectedCenter;
      // Map the center data to match our format
      const mappedCenter: InspectionCenter = {
        id: preselectedCenter.id,
        name: preselectedCenter.name.replace('TT', 'Trung tâm'),
        address: preselectedCenter.address,
        distance: '2.3 km', // Default distance
        status: preselectedCenter.status
      };
      setSelectedCenter(mappedCenter);
      toast.success(`Đã chọn ${mappedCenter.name}`);
    }
  }, [location.state]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'empty': return 'bg-green-500';
      case 'normal': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'empty': return 'Trống';
      case 'normal': return 'Bình thường';
      case 'busy': return 'Đông';
      default: return '';
    }
  };

  const filteredCenters = centers.filter(center =>
    center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    center.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        full: date.toISOString().split('T')[0],
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        weekday: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][date.getDay()],
      });
    }
    return dates;
  };

  const dates = generateDates();

  const renderStep = () => {
    if (step === 1) {
      return (
        <>
          {/* Modern Header with Rounded Bottom & Decorative Circles */}
          <div className="bg-white px-5 pt-12 pb-6 rounded-b-[2rem] shadow-md border-b border-gray-100 relative overflow-hidden">
            {/* Decorative Circle Patterns */}
            <div className="absolute inset-0 opacity-[0.04]">
              <div className="absolute top-6 right-8 w-24 h-24 border-2 border-gray-900 rounded-full"></div>
              <div className="absolute top-10 right-24 w-16 h-16 border-2 border-gray-900 rounded-full"></div>
              <div className="absolute bottom-2 left-6 w-28 h-28 border-2 border-gray-900 rounded-full"></div>
              <div className="absolute bottom-4 left-28 w-10 h-10 border border-gray-900 rounded-full"></div>
            </div>
            
            <div className="relative z-10">
              <h1 className="text-gray-900 text-xl font-bold mb-1 tracking-tight">Chọn trung tâm</h1>
              <p className="text-gray-500 text-sm">Bước 1/3</p>
            </div>
          </div>

          <div className="p-5">
            {/* Show selected center from MapScreen */}
            {selectedCenter && (
              <div className="bg-blue-50 border-2 border-blue-600 rounded-xl p-4 mb-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="text-blue-600" size={18} strokeWidth={2.5} />
                      <p className="text-blue-600 text-xs font-bold">Đã chọn từ bản đồ</p>
                    </div>
                    <h3 className="text-gray-900 font-semibold text-sm">{selectedCenter.name}</h3>
                    <p className="text-gray-600 text-xs mt-1">{selectedCenter.address}</p>
                  </div>
                  <button
                    onClick={() => setSelectedCenter(null)}
                    className="text-gray-400 hover:text-gray-600 text-xs font-semibold"
                  >
                    Đổi
                  </button>
                </div>
              </div>
            )}

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm trung tâm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-100 border-0 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
            </div>

            {/* Centers List */}
            <div className="space-y-3 mb-6">
              {filteredCenters.map((center) => {
                const isSelected = selectedCenter?.id === center.id;
                return (
                  <button
                    key={center.id}
                    onClick={() => {
                      setSelectedCenter(center);
                      toast.success(`Đã chọn ${center.name}`);
                    }}
                    className={`w-full border-2 rounded-xl p-4 transition-all duration-300 text-left hover:shadow-md active:scale-[0.98] ${
                      isSelected
                        ? 'bg-blue-50 border-blue-600 shadow-md'
                        : 'bg-white border-gray-200 hover:border-blue-600'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1">
                        {isSelected && (
                          <CheckCircle className="text-blue-600 flex-shrink-0" size={18} strokeWidth={2.5} />
                        )}
                        <h3 className={`font-semibold text-sm flex-1 ${isSelected ? 'text-blue-600' : 'text-gray-900'}`}>
                          {center.name}
                        </h3>
                      </div>
                      <div className={`${getStatusColor(center.status)} text-white px-2 py-1 rounded-lg text-xs font-semibold ml-2`}>
                        {getStatusText(center.status)}
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs mb-2">{center.address}</p>
                    <div className="flex items-center gap-2 text-blue-600 text-xs font-semibold">
                      <MapPin size={14} />
                      <span>{center.distance}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Continue Button */}
            <button
              onClick={() => setStep(2)}
              disabled={!selectedCenter}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold disabled:bg-gray-300 disabled:text-gray-500 transition-all duration-300 active:scale-[0.98] disabled:active:scale-100"
            >
              Tiếp tục
            </button>

            {/* Validation message */}
            {!selectedCenter && (
              <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-amber-800 text-xs">
                  Vui lòng chọn trung tâm để tiếp tục
                </p>
              </div>
            )}
          </div>
        </>
      );
    }

    if (step === 2) {
      return (
        <>
          {/* Modern Header with Rounded Bottom & Decorative Circles */}
          <div className="bg-white px-5 pt-12 pb-6 rounded-b-[2rem] shadow-md border-b border-gray-100 relative overflow-hidden">
            {/* Decorative Circle Patterns */}
            <div className="absolute inset-0 opacity-[0.04]">
              <div className="absolute top-6 right-8 w-24 h-24 border-2 border-gray-900 rounded-full"></div>
              <div className="absolute top-10 right-24 w-16 h-16 border-2 border-gray-900 rounded-full"></div>
              <div className="absolute bottom-2 left-6 w-28 h-28 border-2 border-gray-900 rounded-full"></div>
              <div className="absolute bottom-4 left-28 w-10 h-10 border border-gray-900 rounded-full"></div>
            </div>
            
            <div className="relative z-10">
              <button 
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-gray-600 mb-4 -ml-1"
              >
                <ChevronLeft size={20} />
                <span className="text-sm font-semibold">Quay lại</span>
              </button>
              <h1 className="text-gray-900 text-xl font-bold mb-1 tracking-tight">Chọn ngày & giờ</h1>
              <p className="text-gray-500 text-sm">Bước 2/3</p>
            </div>
          </div>

          <div className="p-5">
            {/* Selected Center */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-gray-600 text-xs mb-1">Trung tâm đã chọn</p>
              <p className="text-gray-900 font-semibold text-sm">{selectedCenter?.name}</p>
            </div>

            {/* Date Selection */}
            <h3 className="text-gray-900 font-semibold text-sm mb-3">Chọn ngày</h3>
            <div className="grid grid-cols-4 gap-2 mb-6">
              {dates.map((date) => (
                <button
                  key={date.full}
                  onClick={() => setSelectedDate(date.full)}
                  className={`p-3 rounded-xl border-2 transition-colors ${
                    selectedDate === date.full
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-200 text-gray-900'
                  }`}
                >
                  <p className="text-xs mb-1 opacity-75">{date.weekday}</p>
                  <p className="font-bold">{date.day}</p>
                </button>
              ))}
            </div>

            {/* Time Selection */}
            <h3 className="text-gray-900 font-semibold text-sm mb-3">Chọn giờ</h3>
            <div className="mb-4">
              <p className="text-gray-600 text-xs mb-2">Buổi sáng</p>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.filter(slot => slot.period === 'morning').map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedTime(slot.time)}
                    className={`p-3 rounded-xl border-2 transition-colors text-sm font-semibold ${
                      selectedTime === slot.time
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 text-xs mb-2">Buổi chiều</p>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.filter(slot => slot.period === 'afternoon').map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedTime(slot.time)}
                    className={`p-3 rounded-xl border-2 transition-colors text-sm font-semibold ${
                      selectedTime === slot.time
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(3)}
              disabled={!selectedDate || !selectedTime}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold disabled:bg-gray-300 disabled:text-gray-500 transition-all duration-300 active:scale-[0.98] disabled:active:scale-100"
            >
              Tiếp tục
            </button>

            {/* Validation message */}
            {(!selectedDate || !selectedTime) && (
              <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-amber-800 text-xs">
                  {!selectedDate && !selectedTime && 'Vui lòng chọn ngày và giờ để tiếp tục'}
                  {selectedDate && !selectedTime && 'Vui lòng chọn giờ để tiếp tục'}
                  {!selectedDate && selectedTime && 'Vui lòng chọn ngày để tiếp tục'}
                </p>
              </div>
            )}
          </div>
        </>
      );
    }

    if (step === 3) {
      return (
        <>
          {/* Modern Header with Rounded Bottom & Decorative Circles */}
          <div className="bg-white px-5 pt-12 pb-6 rounded-b-[2rem] shadow-md border-b border-gray-100 relative overflow-hidden">
            {/* Decorative Circle Patterns */}
            <div className="absolute inset-0 opacity-[0.04]">
              <div className="absolute top-6 right-8 w-24 h-24 border-2 border-gray-900 rounded-full"></div>
              <div className="absolute top-10 right-24 w-16 h-16 border-2 border-gray-900 rounded-full"></div>
              <div className="absolute bottom-2 left-6 w-28 h-28 border-2 border-gray-900 rounded-full"></div>
              <div className="absolute bottom-4 left-28 w-10 h-10 border border-gray-900 rounded-full"></div>
            </div>
            
            <div className="relative z-10">
              <button 
                onClick={() => setStep(2)}
                className="flex items-center gap-2 text-gray-600 mb-4 -ml-1"
              >
                <ChevronLeft size={20} />
                <span className="text-sm font-semibold">Quay lại</span>
              </button>
              <h1 className="text-gray-900 text-xl font-bold mb-1 tracking-tight">Thông tin xe</h1>
              <p className="text-gray-500 text-sm">Bước 3/3</p>
            </div>
          </div>

          <div className="p-5">
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-gray-700 text-sm font-semibold mb-2 block">Biển số xe</label>
                <input
                  type="text"
                  placeholder="VD: 29A-12345"
                  value={vehicleInfo.licensePlate}
                  onChange={(e) => setVehicleInfo({ ...vehicleInfo, licensePlate: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="text-gray-700 text-sm font-semibold mb-2 block">Loại xe</label>
                <select
                  value={vehicleInfo.vehicleType}
                  onChange={(e) => setVehicleInfo({ ...vehicleInfo, vehicleType: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-xl text-sm"
                >
                  <option value="">Chọn loại xe</option>
                  <option value="car">Ô tô dưới 9 chỗ</option>
                  <option value="van">Ô tô từ 9-16 chỗ</option>
                  <option value="truck">Xe tải</option>
                  <option value="motorcycle">Xe máy</option>
                </select>
              </div>

              <div>
                <label className="text-gray-700 text-sm font-semibold mb-2 block">Số điện thoại</label>
                <input
                  type="tel"
                  placeholder="VD: 0912 345 678"
                  value={vehicleInfo.phoneNumber}
                  onChange={(e) => setVehicleInfo({ ...vehicleInfo, phoneNumber: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-xl text-sm"
                />
              </div>
            </div>

            <button
              onClick={() => {
                setStep(4);
                toast.success('Đặt lịch thành công! Mã đặt lịch: #DK123456');
              }}
              disabled={!vehicleInfo.licensePlate || !vehicleInfo.vehicleType || !vehicleInfo.phoneNumber}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold disabled:bg-gray-300 disabled:text-gray-500 transition-all duration-300 active:scale-[0.98] disabled:active:scale-100"
            >
              Xác nhận đặt lịch
            </button>

            {/* Validation message */}
            {(!vehicleInfo.licensePlate || !vehicleInfo.vehicleType || !vehicleInfo.phoneNumber) && (
              <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-amber-800 text-xs">
                  Vui lòng điền đầy đủ thông tin để đặt lịch
                </p>
              </div>
            )}
          </div>
        </>
      );
    }

    // Step 4 - Success
    return (
      <>
        <div className="bg-white px-5 pt-12 pb-6">
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-600" size={40} />
            </div>
            <h1 className="text-gray-900 text-xl font-bold mb-2">Đặt lịch thành công!</h1>
            <p className="text-gray-500 text-sm">Mã đặt lịch: <span className="font-semibold text-gray-900">#DK123456</span></p>
          </div>
        </div>

        <div className="p-5">
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
            <div className="mb-4 pb-4 border-b border-gray-100">
              <p className="text-gray-500 text-xs mb-1">Trung tâm</p>
              <p className="text-gray-900 font-semibold text-sm">{selectedCenter?.name}</p>
              <p className="text-gray-600 text-xs mt-1">{selectedCenter?.address}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-100">
              <div>
                <p className="text-gray-500 text-xs mb-1">Ngày hẹn</p>
                <p className="text-gray-900 font-semibold text-sm">
                  {selectedDate ? new Date(selectedDate).toLocaleDateString('vi-VN') : ''}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Giờ hẹn</p>
                <p className="text-gray-900 font-semibold text-sm">{selectedTime}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Biển số xe</span>
                <span className="text-gray-900 font-semibold">{vehicleInfo.licensePlate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Loại xe</span>
                <span className="text-gray-900 font-semibold">{vehicleInfo.vehicleType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Số điện thoại</span>
                <span className="text-gray-900 font-semibold">{vehicleInfo.phoneNumber}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setStep(1);
                setSelectedCenter(null);
                setSelectedDate('');
                setSelectedTime('');
                setVehicleInfo({ licensePlate: '', vehicleType: '', phoneNumber: '', isModified: false });
              }}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold"
            >
              Đặt lịch mới
            </button>
            <button className="w-full bg-white border border-gray-200 text-gray-900 py-4 rounded-xl font-semibold">
              Về trang chủ
            </button>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {renderStep()}
    </div>
  );
}