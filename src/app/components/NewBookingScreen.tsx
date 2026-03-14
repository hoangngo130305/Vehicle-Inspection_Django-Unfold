import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  ArrowLeft,
  Car,
  User,
  Phone,
  MapPin,
  Calendar,
  Clock,
  ChevronRight,
  CheckCircle2,
  Navigation,
  Star,
} from 'lucide-react';
import { toast } from 'sonner';
import { useStations } from '@/app/contexts/StationsContext';

export default function NewBookingScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const { activeStations, getStationDistance } = useStations();

  // Step 1: Vehicle & Contact Info
  const [selectedVehicle, setSelectedVehicle] = useState('29A-12345');
  const [contactName, setContactName] = useState('Nam Nguyễn');
  const [contactPhone, setContactPhone] = useState('0912345678');
  const [isModified, setIsModified] = useState(false);

  // Step 2: Station Selection
  const [selectedStation, setSelectedStation] = useState<number | null>(null);

  // Step 3: Time Selection
  const [selectedDate, setSelectedDate] = useState('2026-01-29');
  const [selectedTime, setSelectedTime] = useState('09:00');

  // Auto-select station from MapScreen (but stay at step 1)
  useEffect(() => {
    if (location.state?.preselectedCenter) {
      const preselectedCenter = location.state.preselectedCenter;
      // Find matching station by name
      const matchingStation = activeStations.find(s => 
        s.name === preselectedCenter.name
      );
      
      if (matchingStation) {
        setSelectedStation(matchingStation.id);
        // Don't skip to step 2 - stay at step 1
        toast.success(`Đã chọn ${matchingStation.name}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const vehicles = [
    { id: '1', plate: '29A-12345', model: 'Ô tô dưới 9 chỗ' },
    { id: '2', plate: '30A-67890', model: 'Xe máy' },
  ];

  const timeSlots = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
  ];

  const handleNext = () => {
    if (step === 1) {
      if (!selectedVehicle || !contactName || !contactPhone) {
        toast.error('Vui lòng điền đầy đủ thông tin');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!selectedStation) {
        toast.error('Vui lòng chọn trạm đăng kiểm');
        return;
      }
      setStep(3);
    } else {
      // Create booking
      toast.success('Đặt lịch thành công!');
      navigate('/');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as 1 | 2);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Modern Header with Rounded Bottom & Decorative Circles */}
      <div className="bg-white px-5 pt-10 pb-6 rounded-b-[2rem] shadow-md border-b border-gray-100 relative overflow-hidden sticky top-0 z-40">
        {/* Decorative Circle Patterns */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute top-6 right-8 w-24 h-24 border-2 border-gray-900 rounded-full"></div>
          <div className="absolute top-10 right-24 w-16 h-16 border-2 border-gray-900 rounded-full"></div>
          <div className="absolute bottom-2 left-6 w-28 h-28 border-2 border-gray-900 rounded-full"></div>
          <div className="absolute bottom-4 left-28 w-10 h-10 border border-gray-900 rounded-full"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={handleBack}
              className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors active:scale-95"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex-1">
              <h1 className="text-gray-900 font-bold text-xl tracking-tight">Đặt lịch đăng kiểm</h1>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`h-1 rounded-full flex-1 transition-all ${
                    s <= step ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-xs mt-2">
            Bước {step}/3:{' '}
            {step === 1
              ? 'Thông tin xe & liên hệ'
              : step === 2
              ? 'Chọn trạm'
              : 'Chọn thời gian'}
          </p>
        </div>
      </div>

      <div className="px-5 py-4">
        {/* Step 1: Vehicle & Contact Info */}
        {step === 1 && (
          <div className="space-y-4">
            {/* Vehicle Selection */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                <Car size={18} className="text-blue-600" />
                Chọn xe đăng kiểm
              </h3>
              <div className="space-y-2">
                {vehicles.map((vehicle) => (
                  <label
                    key={vehicle.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedVehicle === vehicle.plate
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="vehicle"
                      checked={selectedVehicle === vehicle.plate}
                      onChange={() => setSelectedVehicle(vehicle.plate)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-sm">{vehicle.plate}</p>
                      <p className="text-xs text-gray-600">{vehicle.model}</p>
                    </div>
                  </label>
                ))}
              </div>
              <button
                onClick={() => navigate('/vehicles')}
                className="w-full mt-3 text-blue-600 font-semibold text-xs py-2 hover:bg-blue-50 rounded-xl transition-colors"
              >
                + Thêm xe mới
              </button>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                <User size={18} className="text-blue-600" />
                Thông tin liên hệ
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Status */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Tình trạng xe</h3>
              <label className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={isModified}
                  onChange={(e) => setIsModified(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded mt-0.5"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">Xe có độ/cải tạo</p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Xe đã qua cải tạo, độ pô, nâng cấp động cơ hoặc thay đổi kết cấu
                  </p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Step 2: Station Selection */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-2xl p-3.5 flex items-start gap-3">
              <Navigation size={18} className="text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-xs">
                  Trạm gần bạn nhất
                </p>
                <p className="text-[10px] text-gray-600 mt-0.5">
                  Các trạm được sắp xếp theo khoảng cách từ vị trí hiện tại
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {activeStations.map((station) => (
                <label
                  key={station.id}
                  className={`block bg-white rounded-2xl p-4 shadow-sm border cursor-pointer transition-all ${
                    selectedStation === station.id
                      ? 'border-blue-600 ring-2 ring-blue-100'
                      : 'border-gray-100 hover:shadow-md'
                  }`}
                >
                  <input
                    type="radio"
                    name="station"
                    checked={selectedStation === station.id}
                    onChange={() => setSelectedStation(station.id)}
                    className="hidden"
                  />
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm">
                            {station.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-yellow-500 text-xs">★</span>
                            <span className="font-semibold text-xs">
                              {station.rating}
                            </span>
                            <span className="text-gray-400 text-[10px]">
                              ({station.reviews} đánh giá)
                            </span>
                          </div>
                        </div>
                        {selectedStation === station.id && (
                          <CheckCircle2
                            size={20}
                            className="text-blue-600 flex-shrink-0"
                          />
                        )}
                      </div>
                      <div className="flex items-start gap-2 text-gray-600 mb-2">
                        <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                        <p className="text-xs">{station.address}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-lg text-[10px] font-semibold">
                          {getStationDistance(station.id)}
                        </span>
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Time Selection */}
        {step === 3 && (
          <div className="space-y-4">
            {/* Date Selection */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                <Calendar size={18} className="text-blue-600" />
                Chọn ngày
              </h3>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Time Slots */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                <Clock size={18} className="text-blue-600" />
                Chọn giờ
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-2.5 rounded-xl font-semibold text-xs transition-all ${
                      selectedTime === time
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white">
              <h3 className="font-bold mb-3 text-sm">Tóm tắt đặt lịch</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-blue-100">Xe:</span>
                  <span className="font-semibold">{selectedVehicle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-100">Liên hệ:</span>
                  <span className="font-semibold">{contactName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-100">Trạm:</span>
                  <span className="font-semibold">
                    {activeStations.find((s) => s.id === selectedStation)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-100">Thời gian:</span>
                  <span className="font-semibold">
                    {selectedTime} - {selectedDate}
                  </span>
                </div>
                {isModified && (
                  <div className="bg-white/20 rounded-lg p-2 mt-2">
                    <span className="text-[10px]">⚠️ Xe có độ/cải tạo</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4 max-w-md mx-auto shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
        <button
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all active:scale-98 flex items-center justify-center gap-2 text-sm"
        >
          <span>{step === 3 ? 'Xác nhận đặt lịch' : 'Tiếp tục'}</span>
          {step < 3 && <ChevronRight size={18} />}
        </button>
      </div>
    </div>
  );
}