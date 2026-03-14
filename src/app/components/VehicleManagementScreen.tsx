import { ArrowLeft, Car, Plus, Edit2, Trash2, Calendar } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

interface Vehicle {
  id: number;
  plate: string;
  type: string;
  brand: string;
  color: string;
  inspectionDate: string;
}

export default function VehicleManagementScreen() {
  const navigate = useNavigate();
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: 1,
      plate: '29A-12345',
      type: 'Ô tô dưới 9 chỗ',
      brand: 'Toyota Vios',
      color: 'Trắng',
      inspectionDate: '15/02/2026',
    },
    {
      id: 2,
      plate: '30A-67890',
      type: 'Xe máy',
      brand: 'Honda Wave',
      color: 'Đen',
      inspectionDate: '20/08/2026',
    },
  ]);

  const [formData, setFormData] = useState({
    plate: '',
    type: 'car',
    brand: '',
    color: '',
  });

  const handleAddVehicle = () => {
    if (!formData.plate || !formData.brand || !formData.color) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const newVehicle: Vehicle = {
      id: vehicles.length + 1,
      plate: formData.plate,
      type: formData.type === 'car' ? 'Ô tô dưới 9 chỗ' : formData.type === 'motorcycle' ? 'Xe máy' : formData.type === 'truck' ? 'Xe tải' : 'Xe khách',
      brand: formData.brand,
      color: formData.color,
      inspectionDate: 'Chưa đăng kiểm',
    };

    setVehicles([...vehicles, newVehicle]);
    setShowAddVehicle(false);
    setFormData({ plate: '', type: 'car', brand: '', color: '' });
    toast.success('Thêm xe thành công!');
  };

  const handleUpdateVehicle = () => {
    if (!formData.plate || !formData.brand || !formData.color || !editingVehicle) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const updatedVehicles = vehicles.map((v) =>
      v.id === editingVehicle.id
        ? {
            ...v,
            plate: formData.plate,
            type: formData.type === 'car' ? 'Ô tô dưới 9 chỗ' : formData.type === 'motorcycle' ? 'Xe máy' : formData.type === 'truck' ? 'Xe tải' : 'Xe khách',
            brand: formData.brand,
            color: formData.color,
          }
        : v
    );

    setVehicles(updatedVehicles);
    setEditingVehicle(null);
    setFormData({ plate: '', type: 'car', brand: '', color: '' });
    toast.success('Cập nhật xe thành công!');
  };

  const handleDeleteVehicle = (id: number) => {
    if (confirm('Bạn có chắc muốn xóa xe này?')) {
      setVehicles(vehicles.filter((v) => v.id !== id));
      toast.success('Xóa xe thành công!');
    }
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      plate: vehicle.plate,
      type: vehicle.type.includes('Ô tô') ? 'car' : vehicle.type.includes('Xe máy') ? 'motorcycle' : vehicle.type.includes('Xe tải') ? 'truck' : 'bus',
      brand: vehicle.brand,
      color: vehicle.color,
    });
  };

  // Add/Edit Vehicle Form
  if (showAddVehicle || editingVehicle) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header với Decorative Circles */}
        <div className="bg-white px-5 pt-10 pb-6 rounded-b-[2rem] shadow-md border-b border-gray-100 relative overflow-hidden sticky top-0 z-40">
          {/* Decorative Circle Patterns */}
          <div className="absolute inset-0 opacity-[0.04]">
            <div className="absolute top-6 right-8 w-24 h-24 border-2 border-gray-900 rounded-full"></div>
            <div className="absolute top-10 right-24 w-16 h-16 border-2 border-gray-900 rounded-full"></div>
            <div className="absolute bottom-2 left-6 w-28 h-28 border-2 border-gray-900 rounded-full"></div>
            <div className="absolute bottom-4 left-28 w-10 h-10 border border-gray-900 rounded-full"></div>
          </div>

          <div className="relative z-10">
            <button
              onClick={() => {
                setShowAddVehicle(false);
                setEditingVehicle(null);
                setFormData({ plate: '', type: 'car', brand: '', color: '' });
              }}
              className="flex items-center gap-2 text-gray-600 mb-3 -ml-1 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} strokeWidth={2.5} />
              <span className="text-sm font-semibold">Quay lại</span>
            </button>
            <h1 className="text-gray-900 font-bold text-xl tracking-tight mb-1">
              {editingVehicle ? 'Chỉnh sửa xe' : 'Thêm xe mới'}
            </h1>
            <p className="text-gray-500 text-xs">Nhập thông tin xe của bạn</p>
          </div>
        </div>

        <div className="px-5 pt-5">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold text-sm mb-2">
                  Biển số xe *
                </label>
                <input
                  type="text"
                  placeholder="VD: 29A-12345"
                  value={formData.plate}
                  onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold text-sm mb-2">
                  Loại xe *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                >
                  <option value="car">Ô tô dưới 9 chỗ</option>
                  <option value="motorcycle">Xe máy</option>
                  <option value="truck">Xe tải</option>
                  <option value="bus">Xe khách</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold text-sm mb-2">
                  Hãng xe *
                </label>
                <input
                  type="text"
                  placeholder="VD: Toyota Vios"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold text-sm mb-2">
                  Màu xe *
                </label>
                <input
                  type="text"
                  placeholder="VD: Trắng"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
              </div>

              <button
                onClick={editingVehicle ? handleUpdateVehicle : handleAddVehicle}
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold shadow-md hover:bg-blue-700 transition-all duration-200 active:scale-[0.98]"
              >
                {editingVehicle ? 'Cập nhật' : 'Thêm xe'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main List View
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header với Decorative Circles */}
      <div className="bg-white px-5 pt-10 pb-6 rounded-b-[2rem] shadow-md border-b border-gray-100 relative overflow-hidden sticky top-0 z-40">
        {/* Decorative Circle Patterns */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute top-6 right-8 w-24 h-24 border-2 border-gray-900 rounded-full"></div>
          <div className="absolute top-10 right-24 w-16 h-16 border-2 border-gray-900 rounded-full"></div>
          <div className="absolute bottom-2 left-6 w-28 h-28 border-2 border-gray-900 rounded-full"></div>
          <div className="absolute bottom-4 left-28 w-10 h-10 border border-gray-900 rounded-full"></div>
        </div>

        <div className="relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 mb-3 -ml-1 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
            <span className="text-sm font-semibold">Quay lại</span>
          </button>
          <h1 className="text-gray-900 font-bold text-xl tracking-tight mb-1">Quản lý xe</h1>
          <p className="text-gray-500 text-xs">Thêm và chỉnh sửa thông tin xe</p>
        </div>
      </div>

      <div className="px-5 pt-5">
        {/* Add Vehicle Button */}
        <button
          onClick={() => setShowAddVehicle(true)}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 mb-5 shadow-md hover:bg-blue-700 transition-all duration-200 active:scale-[0.98]"
        >
          <Plus size={20} strokeWidth={2.5} />
          Thêm xe mới
        </button>

        {/* Vehicles List */}
        <div className="space-y-4">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      vehicle.type.includes('Ô tô')
                        ? 'bg-blue-100'
                        : vehicle.type.includes('Xe máy')
                        ? 'bg-green-100'
                        : vehicle.type.includes('Xe tải')
                        ? 'bg-orange-100'
                        : 'bg-purple-100'
                    }`}
                  >
                    <Car
                      className={
                        vehicle.type.includes('Ô tô')
                          ? 'text-blue-600'
                          : vehicle.type.includes('Xe máy')
                          ? 'text-green-600'
                          : vehicle.type.includes('Xe tải')
                          ? 'text-orange-600'
                          : 'text-purple-600'
                      }
                      size={24}
                    />
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold text-base">{vehicle.plate}</p>
                    <p className="text-gray-500 text-xs">{vehicle.type}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditVehicle(vehicle)}
                    className="p-2 hover:bg-blue-50 rounded-lg transition-all duration-300 active:scale-95"
                  >
                    <Edit2 size={16} className="text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteVehicle(vehicle.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-all duration-300 active:scale-95"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Hãng xe:</span>
                  <span className="text-gray-900 font-semibold">{vehicle.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Màu sắc:</span>
                  <span className="text-gray-900 font-semibold">{vehicle.color}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Hạn đăng kiểm:</span>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-500" />
                    <span className="text-gray-900 font-semibold">{vehicle.inspectionDate}</span>
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