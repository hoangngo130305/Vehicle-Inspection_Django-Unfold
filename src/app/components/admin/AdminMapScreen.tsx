import { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  AlertTriangle,
  Car,
  Clock,
  Phone,
  Eye,
  Filter,
  RefreshCw,
  X,
  MessageSquare,
  MapPinned,
  Send
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { toast } from 'sonner';

interface Driver {
  id: string;
  name: string;
  vehicle: string;
  orderId: string;
  status: 'on-route' | 'off-route' | 'arrived' | 'idle';
  location: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  eta: string;
  distance: string;
  phone: string;
}

export default function AdminMapScreen() {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showHandleOffRouteModal, setShowHandleOffRouteModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{id: string; sender: 'admin' | 'driver'; text: string; time: string}>>([]);
  const [messageInput, setMessageInput] = useState('');
  const [offRouteDrivers, setOffRouteDrivers] = useState<Driver[]>([]);

  // Mock drivers data
  const [drivers, setDrivers] = useState<Driver[]>([
    {
      id: '1',
      name: 'Lê Văn C',
      vehicle: '30A-123.45',
      orderId: 'DK001',
      status: 'on-route',
      location: { lat: 21.0285, lng: 105.8542 },
      destination: { lat: 21.0378, lng: 105.8345 },
      eta: '15 phút',
      distance: '3.2 km',
      phone: '0123456789',
    },
    {
      id: '2',
      name: 'Nguyễn Văn E',
      vehicle: '29B-678.90',
      orderId: 'DK002',
      status: 'off-route',
      location: { lat: 21.0145, lng: 105.8412 },
      destination: { lat: 21.0245, lng: 105.8212 },
      eta: '25 phút',
      distance: '5.8 km',
      phone: '0987654321',
    },
    {
      id: '3',
      name: 'Trần Văn H',
      vehicle: '51F-234.56',
      orderId: 'DK003',
      status: 'arrived',
      location: { lat: 21.0378, lng: 105.8345 },
      destination: { lat: 21.0378, lng: 105.8345 },
      eta: '0 phút',
      distance: '0 km',
      phone: '0369258147',
    },
    {
      id: '4',
      name: 'Phạm Thị I',
      vehicle: '40H-456.78',
      orderId: 'DK004',
      status: 'idle',
      location: { lat: 21.0201, lng: 105.8467 },
      destination: { lat: 21.0201, lng: 105.8467 },
      eta: '-',
      distance: '-',
      phone: '0912345678',
    },
  ]);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'on-route':
        return { label: 'Đang di chuyển', color: 'bg-blue-100 text-blue-700', dotColor: 'bg-blue-500' };
      case 'off-route':
        return { label: 'Sai lộ trình', color: 'bg-red-100 text-red-700', dotColor: 'bg-red-500' };
      case 'arrived':
        return { label: 'Đã đến nơi', color: 'bg-green-100 text-green-700', dotColor: 'bg-green-500' };
      case 'idle':
        return { label: 'Chờ phân công', color: 'bg-gray-100 text-gray-700', dotColor: 'bg-gray-500' };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-700', dotColor: 'bg-gray-500' };
    }
  };

  const filteredDrivers = drivers.filter(driver => {
    if (filterStatus === 'all') return true;
    return driver.status === filterStatus;
  });

  const offRouteCount = drivers.filter(d => d.status === 'off-route').length;

  const handleRefresh = () => {
    toast.info('Đang làm mới dữ liệu...');
    
    // Simulate API refresh
    setTimeout(() => {
      // Reset filters
      setFilterStatus('all');
      setSelectedDriver(null);
      
      toast.success('Đã làm mới vị trí nhân viên');
    }, 500);
  };

  const handleViewDetail = (driver: Driver) => {
    setSelectedDriver(driver);
    setShowDetailModal(true);
  };

  const handleCallDriver = (driver: Driver) => {
    toast.success(`Đang gọi cho ${driver.name}`);
    // In real app: window.location.href = `tel:${driver.phone}`;
  };

  const handleSendMessage = (driver: Driver) => {
    toast.success(`Đã mở chat với ${driver.name}`);
    // In real app: open chat modal or navigate to chat
    setSelectedDriver(driver);
    setShowChatModal(true);
  };

  const handleHandleOffRoute = () => {
    const offRoute = drivers.filter(d => d.status === 'off-route');
    setOffRouteDrivers(offRoute);
    setShowHandleOffRouteModal(true);
  };

  const handleFixRoute = (driverId: string) => {
    // Update driver status to on-route
    setDrivers(prevDrivers => 
      prevDrivers.map(d => 
        d.id === driverId 
          ? { ...d, status: 'on-route' }
          : d
      )
    );
    
    const driver = drivers.find(d => d.id === driverId);
    toast.success(`Đã gửi lộ trình mới cho ${driver?.name}`);
    
    // Close modal if no more off-route drivers
    const remaining = drivers.filter(d => d.status === 'off-route' && d.id !== driverId);
    if (remaining.length === 0) {
      setShowHandleOffRouteModal(false);
    }
  };

  const handleCenterMap = (driver: Driver) => {
    setSelectedDriver(driver);
    toast.info(`Đang di chuyển đến vị trí ${driver.name}`);
    // In real app: center map on driver location
  };

  const handleSendMessageSubmit = () => {
    if (messageInput.trim() === '') return;
    
    const newMessage = {
      id: Date.now().toString(),
      sender: 'admin' as 'admin' | 'driver',
      text: messageInput,
      time: new Date().toLocaleTimeString(),
    };
    
    setChatMessages(prevMessages => [...prevMessages, newMessage]);
    setMessageInput('');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Giám sát bản đồ</h1>
            <p className="text-gray-600 mt-1">Theo dõi vị trí và lộ trình nhân viên real-time</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={18} />
              <span className="text-sm font-medium">Làm mới</span>
            </button>
          </div>
        </div>

        {/* Alert Banner */}
        {offRouteCount > 0 && (
          <div className="bg-red-50 rounded-xl p-4 border border-red-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <div>
                <h4 className="font-semibold text-red-900">Cảnh báo lộ trình</h4>
                <p className="text-sm text-red-800">
                  <span className="font-bold">{offRouteCount}</span> nhân viên đang đi sai lộ trình
                </p>
              </div>
            </div>
            <button
              onClick={handleHandleOffRoute}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
            >
              Xử lý ngay
            </button>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Area */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Bản đồ theo dõi</h3>
              <div className="flex items-center gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tất cả</option>
                  <option value="on-route">Đang di chuyển</option>
                  <option value="off-route">Sai lộ trình</option>
                  <option value="arrived">Đã đến</option>
                  <option value="idle">Chờ phân công</option>
                </select>
              </div>
            </div>
            
            {/* Mock Map */}
            <div className="relative bg-gradient-to-br from-blue-50 to-green-50 h-[600px]">
              {/* Map placeholder with driver markers */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={64} className="text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Bản đồ tương tác Google Maps</p>
                  <p className="text-sm text-gray-500">Hiển thị vị trí real-time của {filteredDrivers.length} nhân viên</p>
                </div>
              </div>

              {/* Simulated driver pins */}
              {filteredDrivers.map((driver, index) => {
                const statusInfo = getStatusInfo(driver.status);
                const top = 20 + (index * 15) % 60;
                const left = 15 + (index * 20) % 70;
                
                return (
                  <button
                    key={driver.id}
                    onClick={() => handleCenterMap(driver)}
                    className="absolute group"
                    style={{ top: `${top}%`, left: `${left}%` }}
                  >
                    <div className="relative">
                      <div className={`w-10 h-10 ${statusInfo.dotColor} rounded-full flex items-center justify-center shadow-lg border-4 border-white transition-transform group-hover:scale-110`}>
                        <Car size={20} className="text-white" />
                      </div>
                      {driver.status === 'off-route' && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                          <AlertTriangle size={12} className="text-white" />
                        </div>
                      )}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs whitespace-nowrap">
                          {driver.name} - {driver.vehicle}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Map Legend */}
            <div className="border-t border-gray-200 p-4 flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Đang di chuyển</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Sai lộ trình</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Đã đến nơi</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Chờ phân công</span>
              </div>
            </div>
          </div>

          {/* Driver List Sidebar */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden h-fit lg:sticky lg:top-6">
            <div className="border-b border-gray-200 p-4">
              <h3 className="font-bold text-gray-900">Danh sách nhân viên</h3>
              <p className="text-xs text-gray-500 mt-1">{filteredDrivers.length} nhân viên</p>
            </div>
            
            <div className="divide-y divide-gray-200 max-h-[700px] overflow-y-auto">
              {filteredDrivers.map((driver) => {
                const statusInfo = getStatusInfo(driver.status);
                const isSelected = selectedDriver?.id === driver.id;
                
                return (
                  <div
                    key={driver.id}
                    onClick={() => handleCenterMap(driver)}
                    className={`p-4 cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 ${statusInfo.dotColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <Car size={20} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900 text-sm truncate">{driver.name}</h4>
                          {driver.status === 'off-route' && (
                            <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-1">
                          {driver.vehicle} • {driver.orderId}
                        </p>
                        <span className={`inline-block px-2 py-0.5 ${statusInfo.color} text-xs font-semibold rounded-full`}>
                          {statusInfo.label}
                        </span>
                        
                        {driver.status !== 'idle' && (
                          <div className="mt-2 pt-2 border-t border-gray-200 space-y-1">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Clock size={12} />
                              <span>ETA: {driver.eta}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Navigation size={12} />
                              <span>Còn: {driver.distance}</span>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex gap-1 mt-3">
                          <button
                            onClick={() => handleCallDriver(driver)}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-xs font-medium"
                          >
                            <Phone size={12} />
                            Gọi
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetail(driver);
                            }}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-xs font-medium"
                          >
                            <Eye size={12} />
                            Chi tiết
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Car size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {drivers.filter(d => d.status === 'on-route').length}
                </p>
                <p className="text-xs text-gray-600">Đang di chuyển</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {offRouteCount}
                </p>
                <p className="text-xs text-gray-600">Sai lộ trình</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <MapPin size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {drivers.filter(d => d.status === 'arrived').length}
                </p>
                <p className="text-xs text-gray-600">Đã đến nơi</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Clock size={20} className="text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {drivers.filter(d => d.status === 'idle').length}
                </p>
                <p className="text-xs text-gray-600">Chờ phân công</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedDriver && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Chi tiết nhân viên</h3>
                  <p className="text-sm text-gray-600 mt-1">{selectedDriver.name}</p>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-180px)]">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Tên nhân viên:</p>
                    <p className="text-sm text-gray-900 font-semibold">{selectedDriver.name}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Biển số xe:</p>
                    <p className="text-sm text-gray-900 font-mono">{selectedDriver.vehicle}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Đơn hàng:</p>
                    <p className="text-sm text-gray-900">{selectedDriver.orderId}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Trạng thái:</p>
                    <span className={`px-2 py-1 ${getStatusInfo(selectedDriver.status).color} text-xs font-semibold rounded-full`}>
                      {getStatusInfo(selectedDriver.status).label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Số điện thoại:</p>
                    <p className="text-sm text-gray-900">{selectedDriver.phone}</p>
                  </div>
                  {selectedDriver.status !== 'idle' && (
                    <>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-700">Thời gian đến:</p>
                        <p className="text-sm text-gray-900">{selectedDriver.eta}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-700">Khoảng cách:</p>
                        <p className="text-sm text-gray-900">{selectedDriver.distance}</p>
                      </div>
                    </>
                  )}
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Vị trí hiện tại:</p>
                    <p className="text-sm text-gray-900">
                      {selectedDriver.location.lat.toFixed(4)}, {selectedDriver.location.lng.toFixed(4)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Điểm đến:</p>
                    <p className="text-sm text-gray-900">
                      {selectedDriver.destination.lat.toFixed(4)}, {selectedDriver.destination.lng.toFixed(4)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
                  <button
                    onClick={() => handleCallDriver(selectedDriver)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    <Phone size={18} />
                    Gọi điện
                  </button>
                  <button
                    onClick={() => handleSendMessage(selectedDriver)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <MessageSquare size={18} />
                    Nhắn tin
                  </button>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Handle Off-Route Modal */}
        {showHandleOffRouteModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Xử lý nhân viên sai lộ trình</h3>
                  <p className="text-sm text-gray-600 mt-1">{drivers.filter(d => d.status === 'off-route').length} nhân viên cần xử lý</p>
                </div>
                <button
                  onClick={() => setShowHandleOffRouteModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-180px)]">
                <div className="space-y-3">
                  {drivers.filter(d => d.status === 'off-route').map((driver) => (
                    <div key={driver.id} className="p-4 bg-red-50 rounded-xl border border-red-200">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Car size={20} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{driver.name}</h4>
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                              Sai lộ trình
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {driver.vehicle} • {driver.orderId}
                          </p>
                          <p className="text-xs text-gray-500 mb-3">
                            Còn {driver.distance} • ETA: {driver.eta}
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleFixRoute(driver.id)}
                              className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                            >
                              Gửi lộ trình mới
                            </button>
                            <button
                              onClick={() => handleCallDriver(driver)}
                              className="px-4 py-2 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                            >
                              <Phone size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowHandleOffRouteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chat Modal */}
        {showChatModal && selectedDriver && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Nhắn tin cho {selectedDriver.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">Biển số xe: {selectedDriver.vehicle}</p>
                </div>
                <button
                  onClick={() => setShowChatModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-180px)]">
                <div className="space-y-3">
                  {chatMessages.map((message) => (
                    <div key={message.id} className={`p-4 ${message.sender === 'admin' ? 'bg-gray-50' : 'bg-blue-50'}`}>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Car size={20} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{message.sender === 'admin' ? 'Admin' : selectedDriver.name}</h4>
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                              {message.time}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {message.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessageSubmit()}
                  className="flex-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập tin nhắn..."
                />
                <button
                  onClick={handleSendMessageSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  Gửi
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}