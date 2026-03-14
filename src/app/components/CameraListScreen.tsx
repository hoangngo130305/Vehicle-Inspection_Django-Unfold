import { Search, Camera, MapPin, Activity } from 'lucide-react';
import { useState } from 'react';

export default function CameraListScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const cameras = [
    {
      id: 1,
      name: 'Cầu Sài Gòn',
      location: 'Quốc lộ 1A, Bình Dương',
      type: 'Tốc độ',
      status: 'active',
    },
    {
      id: 2,
      name: 'Ngã tư Hàng Xanh',
      location: 'Điện Biên Phủ, TP.HCM',
      type: 'Vi phạm đèn đỏ',
      status: 'active',
    },
    {
      id: 3,
      name: 'Cầu Rạch Chiếc',
      location: 'Xa lộ Hà Nội, TP.HCM',
      type: 'Tốc độ',
      status: 'maintenance',
    },
    {
      id: 4,
      name: 'Đường Nguyễn Văn Linh',
      location: 'Quận 7, TP.HCM',
      type: 'Làn đường',
      status: 'active',
    },
    {
      id: 5,
      name: 'Cầu Phú Mỹ',
      location: 'Quốc lộ 1, TP.HCM',
      type: 'Tốc độ',
      status: 'active',
    },
  ];

  const filteredCameras = cameras.filter(
    (camera) =>
      camera.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camera.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-50 flex flex-col pb-20 min-h-screen">
      {/* Header - Fixed with rounded bottom & decorative circles */}
      <div className="bg-white px-5 pt-10 pb-6 rounded-b-[2rem] shadow-md border-b border-gray-100 relative overflow-hidden sticky top-0 z-40">
        {/* Decorative Circle Patterns */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute top-6 right-8 w-24 h-24 border-2 border-gray-900 rounded-full"></div>
          <div className="absolute top-10 right-24 w-16 h-16 border-2 border-gray-900 rounded-full"></div>
          <div className="absolute bottom-2 left-6 w-28 h-28 border-2 border-gray-900 rounded-full"></div>
          <div className="absolute bottom-4 left-28 w-10 h-10 border border-gray-900 rounded-full"></div>
        </div>
        
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div>
            <h1 className="text-gray-900 font-bold text-xl tracking-tight mb-1">Camera Giao Thông</h1>
            <p className="text-gray-500 text-xs">Giám sát vi phạm toàn quốc</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative z-10">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm vị trí camera..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border-0 focus:ring-2 focus:ring-blue-300 bg-white/95 text-sm placeholder:text-gray-400 shadow-sm"
          />
        </div>
      </div>

      {/* Camera List */}
      <div className="px-4 pt-5 pb-4">
        <div className="mb-3">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-900">{filteredCameras.length}</span> camera được tìm thấy
          </p>
        </div>

        <div className="space-y-2.5">
          {filteredCameras.map((camera) => (
            <div
              key={camera.id}
              className="bg-white rounded-xl p-4 border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Camera size={20} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1.5 text-sm">{camera.name}</h3>
                  <div className="flex items-start gap-1.5 mb-2">
                    <MapPin size={13} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-600 line-clamp-1">{camera.location}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 bg-gray-50 px-2.5 py-1 rounded-md font-medium">
                      {camera.type}
                    </span>
                    {camera.status === 'active' ? (
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600 font-medium">
                          Hoạt động
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                        <span className="text-xs text-orange-600 font-medium">
                          Bảo trì
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}