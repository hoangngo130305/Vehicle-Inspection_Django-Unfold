import { ArrowLeft, Car, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

interface VehicleHealthScreenProps {
  onBack: () => void;
}

export default function VehicleHealthScreen({ onBack }: VehicleHealthScreenProps) {
  const navigate = useNavigate();
  const vehicles = [
    {
      id: '1',
      licensePlate: '29A-12345',
      type: 'Ô tô dưới 9 chỗ',
      brand: 'Toyota Vios',
      expiryDate: '15/02/2026',
      status: 'expiring',
      daysLeft: 37,
    },
    {
      id: '2',
      licensePlate: '30A-67890',
      type: 'Xe máy',
      brand: 'Honda Wave',
      expiryDate: '20/08/2026',
      status: 'valid',
      daysLeft: 223,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Modern Header với Decorative Patterns */}
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
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 mb-4 -ml-1 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
            <span className="text-sm font-semibold">Quay lại</span>
          </button>
          <h1 className="text-gray-900 text-xl font-bold mb-1 tracking-tight">Xe của tôi</h1>
          <p className="text-gray-500 text-sm">Quản lý thông tin xe</p>
        </div>
      </div>

      <div className="p-5">
        <div className="space-y-3">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              {/* Header với Status Badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${ 
                    vehicle.status === 'expiring' 
                      ? 'bg-gradient-to-br from-orange-400 to-orange-600' 
                      : 'bg-gradient-to-br from-blue-500 to-blue-700'
                  }`}>
                    <Car className="text-white" size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-bold text-base leading-tight mb-0.5">{vehicle.licensePlate}</h3>
                    <p className="text-gray-500 text-xs leading-tight">{vehicle.brand} • {vehicle.type}</p>
                  </div>
                </div>
                <div className={`px-2.5 py-1 rounded-lg ${
                  vehicle.status === 'expiring' 
                    ? 'bg-orange-100 text-orange-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  <p className="text-xs font-bold">{vehicle.daysLeft}d</p>
                </div>
              </div>

              {/* Expiry Info */}
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2.5 mb-3">
                <div className="flex items-center gap-2">
                  <Calendar size={14} strokeWidth={2.5} className="text-gray-500" />
                  <span className="text-xs text-gray-600 font-medium">Hết hạn</span>
                </div>
                <span className="text-xs font-bold text-gray-900">{vehicle.expiryDate}</span>
              </div>

              {/* Status Message */}
              {vehicle.status === 'expiring' && (
                <div className="flex items-center gap-2 bg-orange-50 rounded-lg p-2.5 mb-3 border border-orange-100">
                  <AlertCircle className="text-orange-600" size={14} strokeWidth={2.5} />
                  <p className="text-orange-900 font-semibold text-xs">Cần đăng kiểm trong {vehicle.daysLeft} ngày</p>
                </div>
              )}

              {/* Action Button */}
              <button 
                onClick={() => navigate('/booking')}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors active:scale-[0.98]"
              >
                Đặt lịch ngay
              </button>
            </div>
          ))}
        </div>

        <button 
          onClick={() => toast.success('Tính năng thêm xe mới đang phát triển')}
          className="w-full mt-4 bg-white text-blue-600 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors active:scale-[0.98] border-2 border-blue-600"
        >
          + Thêm xe mới
        </button>
      </div>
    </div>
  );
}