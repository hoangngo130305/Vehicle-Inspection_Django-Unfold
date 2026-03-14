import { useState } from 'react';
import { 
  Plus,
  Edit,
  Trash2,
  MapPin,
  Phone,
  Download,
  X
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { toast } from 'sonner';
import { useStations } from '@/app/contexts/StationsContext';

export default function AdminStationsScreen() {
  const { stations, addStation, updateStation, deleteStation } = useStations();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStationId, setEditingStationId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    phone: '',
    status: 'active' as 'active' | 'inactive'
  });

  const handleAddStation = () => {
    if (!formData.name || !formData.address || !formData.latitude || !formData.longitude || !formData.phone) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      toast.error('Latitude và Longitude phải là số');
      return;
    }

    if (lat < -90 || lat > 90) {
      toast.error('Latitude phải trong khoảng -90 đến 90');
      return;
    }

    if (lng < -180 || lng > 180) {
      toast.error('Longitude phải trong khoảng -180 đến 180');
      return;
    }

    addStation({
      name: formData.name,
      address: formData.address,
      latitude: lat,
      longitude: lng,
      phone: formData.phone,
      status: formData.status
    });

    setShowAddModal(false);
    setFormData({
      name: '',
      address: '',
      latitude: '',
      longitude: '',
      phone: '',
      status: 'active'
    });
    toast.success('Đã thêm trạm đăng kiểm mới');
  };

  const handleEditStation = () => {
    if (!editingStationId || !formData.name || !formData.address || !formData.latitude || !formData.longitude || !formData.phone) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      toast.error('Latitude và Longitude phải là số');
      return;
    }

    if (lat < -90 || lat > 90) {
      toast.error('Latitude phải trong khoảng -90 đến 90');
      return;
    }

    if (lng < -180 || lng > 180) {
      toast.error('Longitude phải trong khoảng -180 đến 180');
      return;
    }

    updateStation(editingStationId, {
      name: formData.name,
      address: formData.address,
      latitude: lat,
      longitude: lng,
      phone: formData.phone,
      status: formData.status
    });

    setShowEditModal(false);
    setEditingStationId(null);
    setFormData({
      name: '',
      address: '',
      latitude: '',
      longitude: '',
      phone: '',
      status: 'active'
    });
    toast.success('Đã cập nhật thông tin trạm');
  };

  const handleDeleteStation = (id: number) => {
    if (window.confirm('Bạn có chắc muốn xóa trạm này?')) {
      deleteStation(id);
      toast.success('Đã xóa trạm đăng kiểm');
    }
  };

  const openEditModal = (station: Station) => {
    setEditingStationId(station.id);
    setFormData({
      name: station.name,
      address: station.address,
      latitude: station.latitude.toString(),
      longitude: station.longitude.toString(),
      phone: station.phone,
      status: station.status
    });
    setShowEditModal(true);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Tên trạm', 'Địa chỉ', 'Latitude', 'Longitude', 'Điện thoại', 'Trạng thái'];
    const rows = stations.map(station => [
      station.id,
      station.name,
      station.address,
      station.latitude,
      station.longitude,
      station.phone,
      station.status === 'active' ? 'Hoạt động' : 'Ngưng hoạt động'
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `danh-sach-tram-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast.success('Đã xuất danh sách trạm');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý trạm đăng kiểm</h1>
            <p className="text-gray-600 mt-1">Danh sách các trạm đăng kiểm trên hệ thống</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Download size={18} />
              <span className="text-sm font-medium">Xuất CSV</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
            >
              <Plus size={18} />
              <span className="text-sm font-medium">Thêm trạm</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <MapPin size={24} />
            </div>
            <h3 className="text-3xl font-bold mb-1">{stations.length}</h3>
            <p className="text-blue-100">Tổng số trạm</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <MapPin size={24} />
            </div>
            <h3 className="text-3xl font-bold mb-1">
              {stations.filter(s => s.status === 'active').length}
            </h3>
            <p className="text-green-100">Đang hoạt động</p>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <MapPin size={24} />
            </div>
            <h3 className="text-3xl font-bold mb-1">
              {stations.filter(s => s.status === 'inactive').length}
            </h3>
            <p className="text-red-100">Ngưng hoạt động</p>
          </div>
        </div>

        {/* Stations Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tên trạm</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Địa chỉ</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Latitude</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Longitude</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Điện thoại</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Trạng thái</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stations.map((station) => (
                  <tr key={station.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900">{station.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{station.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{station.address}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 font-mono">{station.latitude}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 font-mono">{station.longitude}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <a href={`tel:${station.phone}`} className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
                        <Phone size={14} />
                        {station.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {station.status === 'active' ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Hoạt động
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                          Ngưng hoạt động
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(station)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteStation(station.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Thêm trạm đăng kiểm mới</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên trạm *</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: Trạm Đăng kiểm Hà Nội"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ *</label>
                <input 
                  type="text" 
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="VD: 123 Nguyễn Trãi, Thanh Xuân, Hà Nội"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitude * (-90 đến 90)</label>
                  <input 
                    type="text" 
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    placeholder="VD: 21.0285"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitude * (-180 đến 180)</label>
                  <input 
                    type="text" 
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    placeholder="VD: 105.8542"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="VD: 024 1234 5678"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Ngưng hoạt động</option>
                </select>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Lưu ý:</strong> Latitude và Longitude là tọa độ GPS của trạm, cần thiết để hiển thị trên bản đồ. 
                  Bạn có thể lấy tọa độ từ Google Maps bằng cách nhấp chuột phải vào vị trí và chọn "Copy coordinates".
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                Hủy
              </button>
              <button 
                onClick={handleAddStation}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                Thêm trạm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Chỉnh sửa trạm đăng kiểm</h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên trạm *</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ *</label>
                <input 
                  type="text" 
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitude * (-90 đến 90)</label>
                  <input 
                    type="text" 
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitude * (-180 đến 180)</label>
                  <input 
                    type="text" 
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Ngưng hoạt động</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                Hủy
              </button>
              <button 
                onClick={handleEditStation}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}