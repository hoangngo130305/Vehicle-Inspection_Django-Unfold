import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Car, Truck, Bike, X } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { toast } from 'sonner';

interface VehicleType {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  active: boolean;
  order: number;
}

export default function AdminVehicleTypesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedType, setSelectedType] = useState<VehicleType | null>(null);

  // Mock data
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([
    { id: '1', code: 'car_4_seat', name: 'Ô tô 4 chỗ', description: 'Xe ô tô con 4 chỗ ngồi', icon: '🚗', active: true, order: 1 },
    { id: '2', code: 'car_7_seat', name: 'Ô tô 7 chỗ', description: 'Xe ô tô con 7 chỗ ngồi', icon: '🚙', active: true, order: 2 },
    { id: '3', code: 'pickup', name: 'Bán tải', description: 'Xe bán tải', icon: '🛻', active: true, order: 3 },
    { id: '4', code: 'truck', name: 'Xe tải', description: 'Xe tải vận chuyển hàng hóa', icon: '🚚', active: true, order: 4 },
    { id: '5', code: 'motorcycle', name: 'Xe máy', description: 'Xe máy 2 bánh', icon: '🏍️', active: true, order: 5 },
  ]);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    icon: '🚗',
    active: true,
  });

  const filteredTypes = vehicleTypes.filter(type =>
    type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    type.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    type.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    if (!formData.code || !formData.name) {
      toast.error('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    const newType: VehicleType = {
      id: Date.now().toString(),
      code: formData.code,
      name: formData.name,
      description: formData.description,
      icon: formData.icon,
      active: formData.active,
      order: vehicleTypes.length + 1,
    };

    setVehicleTypes([...vehicleTypes, newType]);
    setShowAddModal(false);
    setFormData({ code: '', name: '', description: '', icon: '🚗', active: true });
    toast.success('✅ Thêm loại xe thành công!');
  };

  const handleEdit = () => {
    if (!selectedType) return;
    if (!formData.code || !formData.name) {
      toast.error('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    setVehicleTypes(
      vehicleTypes.map(type =>
        type.id === selectedType.id
          ? { ...type, ...formData }
          : type
      )
    );
    setShowEditModal(false);
    setSelectedType(null);
    setFormData({ code: '', name: '', description: '', icon: '🚗', active: true });
    toast.success('✅ Cập nhật loại xe thành công!');
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa loại xe này?')) {
      setVehicleTypes(vehicleTypes.filter(type => type.id !== id));
      toast.success('✅ Đã xóa loại xe!');
    }
  };

  const openEditModal = (type: VehicleType) => {
    setSelectedType(type);
    setFormData({
      code: type.code,
      name: type.name,
      description: type.description,
      icon: type.icon,
      active: type.active,
    });
    setShowEditModal(true);
  };

  const iconOptions = ['🚗', '🚙', '🚕', '🚖', '🚘', '🛻', '🚚', '🚛', '🏍️', '🛵', '🚲', '🚌', '🚐'];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý Loại xe</h1>
              <p className="text-gray-500 mt-1">Quản lý các loại xe trong hệ thống</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Thêm loại xe
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm loại xe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Car size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng loại xe</p>
                <p className="text-2xl font-bold text-gray-900">{vehicleTypes.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Car size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Đang hoạt động</p>
                <p className="text-2xl font-bold text-gray-900">{vehicleTypes.filter(t => t.active).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Truck size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Xe tải</p>
                <p className="text-2xl font-bold text-gray-900">
                  {vehicleTypes.filter(t => t.code.includes('truck')).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Bike size={24} className="text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Xe máy</p>
                <p className="text-2xl font-bold text-gray-900">
                  {vehicleTypes.filter(t => t.code.includes('motorcycle') || t.code.includes('bike')).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Types Grid */}
        <div className="grid grid-cols-3 gap-6">
          {filteredTypes.map((type) => (
            <div
              key={type.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{type.icon}</div>
                  <div>
                    <h3 className="font-bold text-gray-900">{type.name}</h3>
                    <code className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{type.code}</code>
                  </div>
                </div>
                {type.active ? (
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">Hoạt động</span>
                ) : (
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">Tắt</span>
                )}
              </div>

              <p className="text-sm text-gray-600 mb-4">{type.description}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(type)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Edit2 size={16} />
                  <span className="text-sm font-semibold">Sửa</span>
                </button>
                <button
                  onClick={() => handleDelete(type.id)}
                  className="flex items-center justify-center px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTypes.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <Car size={64} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Không tìm thấy loại xe</h3>
            <p className="text-gray-500">Thử tìm kiếm với từ khóa khác</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Thêm loại xe mới</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mã loại xe</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="VD: car_4_seat"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tên loại xe</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: Ô tô 4 chỗ"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả chi tiết về loại xe..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Icon</label>
                <div className="grid grid-cols-6 gap-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`text-2xl p-2 rounded-lg border-2 transition-all ${
                        formData.icon === icon
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="activeAdd"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="activeAdd" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Kích hoạt ngay
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({ code: '', name: '', description: '', icon: '🚗', active: true });
                }}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Thêm loại xe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Chỉnh sửa loại xe</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mã loại xe</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tên loại xe</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Icon</label>
                <div className="grid grid-cols-6 gap-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`text-2xl p-2 rounded-lg border-2 transition-all ${
                        formData.icon === icon
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="activeEdit"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="activeEdit" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Kích hoạt
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedType(null);
                  setFormData({ code: '', name: '', description: '', icon: '🚗', active: true });
                }}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleEdit}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
