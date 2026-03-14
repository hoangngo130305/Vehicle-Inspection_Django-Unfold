import { Navigation, MapPin, Phone, Clock, ExternalLink, Search, Filter } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { useStations } from '@/app/contexts/StationsContext';

export default function MapScreen() {
  const { activeStations } = useStations();
  const [selectedCenterId, setSelectedCenterId] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleGetDirections = (lat: number, lng: number) => {
    // Open Google Maps with directions
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(googleMapsUrl, '_blank');
    toast.success('Đang mở Google Maps...');
  };

  const handleGetUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          toast.success('Đã xác định vị trí của bạn');
        },
        (error) => {
          toast.error('Không thể xác định vị trí');
        }
      );
    } else {
      toast.error('Trình duyệt không hỗ trợ định vị');
    }
  };

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

  // Filter centers based on search query
  const filteredCenters = activeStations.filter(center => 
    center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    center.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats
  const stats = {
    empty: activeStations.filter(c => c.busyStatus === 'empty').length,
    normal: activeStations.filter(c => c.busyStatus === 'normal').length,
    busy: activeStations.filter(c => c.busyStatus === 'busy').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Modern Header with Rounded Bottom & Decorative Circles - Fixed */}
      <div className="bg-white px-5 pt-10 pb-6 rounded-b-[2rem] shadow-md border-b border-gray-100 relative overflow-hidden sticky top-0 z-40">
        {/* Decorative Circle Patterns */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute top-6 right-8 w-24 h-24 border-2 border-gray-900 rounded-full"></div>
          <div className="absolute top-10 right-24 w-16 h-16 border-2 border-gray-900 rounded-full"></div>
          <div className="absolute bottom-2 left-6 w-28 h-28 border-2 border-gray-900 rounded-full"></div>
          <div className="absolute bottom-4 left-28 w-10 h-10 border border-gray-900 rounded-full"></div>
        </div>
        
        <div className="flex items-center justify-between mb-1 relative z-10">
          <h1 className="text-gray-900 font-bold text-xl tracking-tight">Bản đồ</h1>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">{activeStations.length} trung tâm</span>
          </div>
        </div>
        <p className="text-gray-500 text-xs relative z-10">Tìm trung tâm đăng kiểm gần bạn</p>
      </div>

      {/* Enhanced Map Container */}
      <div className="relative h-[350px] bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 overflow-hidden">
        {/* Interactive Map Pins */}
        {activeStations.map((center, index) => (
          <button
            key={center.id}
            onClick={() => {
              setSelectedCenterId(center.id);
              toast.success(`Đã chọn ${center.name}`);
            }}
            className={`absolute transition-all duration-300 ${
              selectedCenterId === center.id ? 'scale-125 z-20' : 'hover:scale-110 z-10'
            }`}
            style={{
              left: `${30 + index * 20}%`,
              top: `${35 + index * 15}%`,
            }}
          >
            <div className={`w-11 h-11 ${getStatusColor(center.busyStatus)} rounded-full border-4 border-white shadow-xl flex items-center justify-center`}>
              <MapPin className="text-white" size={22} strokeWidth={2.5} />
            </div>
            {selectedCenterId === center.id && (
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                <p className="text-xs font-semibold text-gray-900">{center.name.split(' ').slice(0, 3).join(' ')}</p>
              </div>
            )}
          </button>
        ))}

        {/* My Location Button - Enhanced */}
        <button 
          className="absolute top-4 right-5 w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-blue-50 active:scale-95 transition-all border border-gray-100 z-30"
          onClick={handleGetUserLocation}
        >
          <Navigation className="text-blue-600" size={18} strokeWidth={2.5} />
        </button>
      </div>

      <div className="px-5 -mt-6 relative z-20">
        {/* Search Bar - Clean & Modern */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 mb-4 flex items-center gap-3">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm trung tâm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-gray-900 text-sm placeholder:text-gray-400 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-gray-400 hover:text-gray-600 text-xs font-medium"
            >
              Xóa
            </button>
          )}
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-900 font-bold text-base">
            Danh sách trung tâm
            {searchQuery && (
              <span className="text-sm text-gray-500 font-normal ml-2">
                ({filteredCenters.length} kết quả)
              </span>
            )}
          </h2>
        </div>

        {/* Enhanced Centers List */}
        <div className="space-y-3 pb-2">
          {filteredCenters.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
              <MapPin className="text-gray-300 mx-auto mb-3" size={48} />
              <p className="text-gray-500 text-sm font-medium">Không tìm thấy trung tâm</p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-blue-600 text-sm font-semibold mt-2 hover:underline"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            filteredCenters.map((center) => (
              <div
                key={center.id}
                onClick={() => setSelectedCenterId(center.id)}
                className={`bg-white rounded-xl p-4 shadow-sm border-2 transition-all cursor-pointer ${
                  selectedCenterId === center.id
                    ? 'border-blue-600 shadow-md'
                    : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 pr-3">
                    <h3 className="text-gray-900 font-bold text-sm mb-1 leading-snug">{center.name}</h3>
                    <p className="text-gray-600 text-xs leading-relaxed">{center.address}</p>
                  </div>
                  <div className={`${getStatusColor(center.busyStatus)} text-white px-3 py-1.5 rounded-lg text-xs font-bold flex-shrink-0 shadow-sm`}>
                    {getStatusText(center.busyStatus)}
                  </div>
                </div>

                <div className="flex items-center gap-4 py-2.5 border-t border-gray-100 mb-3">
                  <div className="flex items-center gap-2 text-gray-600 text-xs">
                    <Phone size={15} strokeWidth={2} />
                    <span className="font-medium">{center.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-xs">
                    <Clock size={15} strokeWidth={2} />
                    <span className="font-medium">8:00 - 17:00</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button 
                    className="bg-white border-2 border-blue-600 text-blue-600 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-50 transition-all active:scale-[0.97] flex items-center justify-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGetDirections(center.latitude, center.longitude);
                    }}
                  >
                    <Navigation size={16} strokeWidth={2.5} />
                    Chỉ đường
                  </button>
                  <button 
                    className="bg-blue-600 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all active:scale-[0.97] shadow-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/booking', { 
                        state: { 
                          preselectedCenter: {
                            id: center.id,
                            name: center.name,
                            address: center.address,
                            status: center.status
                          } 
                        } 
                      });
                    }}
                  >
                    Đặt lịch
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}