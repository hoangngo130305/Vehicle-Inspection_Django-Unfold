import { useState } from 'react';
import { DollarSign, Plus, Edit2, Trash2, Search, Check, X, TrendingUp, Car } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from './AdminLayout';

interface PriceItem {
  id: string;
  vehicleType: string;
  inspectionFee: number;
  emissionTestFee: number;
  stickerFee: number;
  vat: number;
  total: number;
  status: 'active' | 'inactive';
  updatedAt: string;
}

export default function AdminPricingScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PriceItem | null>(null);

  // Mock data
  const [prices, setPrices] = useState<PriceItem[]>([
    {
      id: '1',
      vehicleType: 'Ô tô con (dưới 9 chỗ)',
      inspectionFee: 340000,
      emissionTestFee: 50000,
      stickerFee: 120000,
      vat: 10,
      total: 561000,
      status: 'active',
      updatedAt: '05/02/2026',
    },
    {
      id: '2',
      vehicleType: 'Ô tô khách (9-16 chỗ)',
      inspectionFee: 450000,
      emissionTestFee: 60000,
      stickerFee: 150000,
      vat: 10,
      total: 726000,
      status: 'active',
      updatedAt: '05/02/2026',
    },
    {
      id: '3',
      vehicleType: 'Ô tô khách (trên 16 chỗ)',
      inspectionFee: 550000,
      emissionTestFee: 70000,
      stickerFee: 180000,
      vat: 10,
      total: 880000,
      status: 'active',
      updatedAt: '05/02/2026',
    },
    {
      id: '4',
      vehicleType: 'Ô tô tải (dưới 3.5 tấn)',
      inspectionFee: 400000,
      emissionTestFee: 55000,
      stickerFee: 130000,
      vat: 10,
      total: 643500,
      status: 'active',
      updatedAt: '05/02/2026',
    },
    {
      id: '5',
      vehicleType: 'Ô tô tải (3.5 - 8 tấn)',
      inspectionFee: 500000,
      emissionTestFee: 65000,
      stickerFee: 160000,
      vat: 10,
      total: 797500,
      status: 'active',
      updatedAt: '05/02/2026',
    },
    {
      id: '6',
      vehicleType: 'Ô tô tải (trên 8 tấn)',
      inspectionFee: 600000,
      emissionTestFee: 75000,
      stickerFee: 200000,
      vat: 10,
      total: 962500,
      status: 'active',
      updatedAt: '05/02/2026',
    },
    {
      id: '7',
      vehicleType: 'Xe máy',
      inspectionFee: 50000,
      emissionTestFee: 15000,
      stickerFee: 30000,
      vat: 10,
      total: 104500,
      status: 'active',
      updatedAt: '05/02/2026',
    },
    {
      id: '8',
      vehicleType: 'Xe container',
      inspectionFee: 750000,
      emissionTestFee: 85000,
      stickerFee: 250000,
      vat: 10,
      total: 1193500,
      status: 'active',
      updatedAt: '05/02/2026',
    },
  ]);

  const [formData, setFormData] = useState({
    vehicleType: '',
    inspectionFee: 0,
    emissionTestFee: 0,
    stickerFee: 0,
    vat: 10,
    status: 'active' as 'active' | 'inactive',
  });

  const calculateTotal = (inspection: number, emission: number, sticker: number, vat: number) => {
    const subtotal = inspection + emission + sticker;
    return subtotal + (subtotal * vat / 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.vehicleType.trim()) {
      toast.error('Vui lòng nhập loại xe!');
      return;
    }

    const total = calculateTotal(
      formData.inspectionFee,
      formData.emissionTestFee,
      formData.stickerFee,
      formData.vat
    );

    if (editingItem) {
      // Update
      setPrices(prices.map(p => 
        p.id === editingItem.id 
          ? { ...p, ...formData, total, updatedAt: new Date().toLocaleDateString('vi-VN') }
          : p
      ));
      toast.success('Cập nhật giá thành công!');
    } else {
      // Add new
      const newPrice: PriceItem = {
        id: Date.now().toString(),
        ...formData,
        total,
        updatedAt: new Date().toLocaleDateString('vi-VN'),
      };
      setPrices([...prices, newPrice]);
      toast.success('Thêm bảng giá mới thành công!');
    }

    handleCloseModal();
  };

  const handleEdit = (item: PriceItem) => {
    setEditingItem(item);
    setFormData({
      vehicleType: item.vehicleType,
      inspectionFee: item.inspectionFee,
      emissionTestFee: item.emissionTestFee,
      stickerFee: item.stickerFee,
      vat: item.vat,
      status: item.status,
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa bảng giá này?')) {
      setPrices(prices.filter(p => p.id !== id));
      toast.success('Đã xóa bảng giá!');
    }
  };

  const handleToggleStatus = (id: string) => {
    setPrices(prices.map(p => 
      p.id === id 
        ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' }
        : p
    ));
    toast.success('Đã cập nhật trạng thái!');
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingItem(null);
    setFormData({
      vehicleType: '',
      inspectionFee: 0,
      emissionTestFee: 0,
      stickerFee: 0,
      vat: 10,
      status: 'active',
    });
  };

  const filteredPrices = prices.filter(p =>
    p.vehicleType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = prices.filter(p => p.status === 'active').length;
  const totalRevenue = prices
    .filter(p => p.status === 'active')
    .reduce((sum, p) => sum + p.total, 0);
  const avgPrice = activeCount > 0 ? Math.round(totalRevenue / activeCount) : 0;

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Bảng giá dịch vụ</h1>
              <p className="text-gray-600">Quản lý giá đăng kiểm theo loại xe</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
            >
              <Plus size={20} />
              Thêm bảng giá
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Car size={24} />
              </div>
              <span className="text-blue-100 text-sm font-medium">Tổng số</span>
            </div>
            <p className="text-3xl font-bold mb-1">{prices.length}</p>
            <p className="text-blue-100 text-sm">Loại xe</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Check size={24} />
              </div>
              <span className="text-green-100 text-sm font-medium">Đang dùng</span>
            </div>
            <p className="text-3xl font-bold mb-1">{activeCount}</p>
            <p className="text-green-100 text-sm">Bảng giá active</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <TrendingUp size={24} />
              </div>
              <span className="text-purple-100 text-sm font-medium">Trung bình</span>
            </div>
            <p className="text-3xl font-bold mb-1">{(avgPrice / 1000).toFixed(0)}K</p>
            <p className="text-purple-100 text-sm">Giá TB/dịch vụ</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <DollarSign size={24} />
              </div>
              <span className="text-orange-100 text-sm font-medium">Tổng giá trị</span>
            </div>
            <p className="text-3xl font-bold mb-1">{(totalRevenue / 1000000).toFixed(1)}M</p>
            <p className="text-orange-100 text-sm">Tổng bảng giá</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm theo loại xe..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Pricing Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Loại xe
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Phí đăng kiểm
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Khí thải
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tem
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    VAT (%)
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tổng cộng
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Cập nhật
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPrices.map((price) => (
                  <tr key={price.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Car size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{price.vehicleType}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-gray-900 font-medium">
                        {price.inspectionFee.toLocaleString('vi-VN')}đ
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-gray-900 font-medium">
                        {price.emissionTestFee.toLocaleString('vi-VN')}đ
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-gray-900 font-medium">
                        {price.stickerFee.toLocaleString('vi-VN')}đ
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-gray-900 font-medium">{price.vat}%</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-blue-600 font-bold text-lg">
                        {price.total.toLocaleString('vi-VN')}đ
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(price.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          price.status === 'active'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {price.status === 'active' ? <Check size={14} /> : <X size={14} />}
                        {price.status === 'active' ? 'Đang dùng' : 'Tạm ngưng'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                      {price.updatedAt}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(price)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(price.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredPrices.length === 0 && (
              <div className="text-center py-12">
                <Car size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Không tìm thấy bảng giá nào</p>
                <p className="text-gray-400 text-sm mt-1">Thử tìm kiếm với từ khóa khác</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingItem ? 'Cập nhật bảng giá' : 'Thêm bảng giá mới'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Vehicle Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Loại xe <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.vehicleType}
                  onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                  placeholder="Ví dụ: Ô tô con (dưới 9 chỗ)"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Inspection Fee */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phí đăng kiểm (VNĐ) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.inspectionFee}
                  onChange={(e) => setFormData({ ...formData, inspectionFee: Number(e.target.value) })}
                  placeholder="340000"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  min="0"
                />
              </div>

              {/* Emission Test Fee */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phí kiểm tra khí thải (VNĐ) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.emissionTestFee}
                  onChange={(e) => setFormData({ ...formData, emissionTestFee: Number(e.target.value) })}
                  placeholder="50000"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  min="0"
                />
              </div>

              {/* Sticker Fee */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phí tem đăng kiểm (VNĐ) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.stickerFee}
                  onChange={(e) => setFormData({ ...formData, stickerFee: Number(e.target.value) })}
                  placeholder="120000"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  min="0"
                />
              </div>

              {/* VAT */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  VAT (%) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.vat}
                  onChange={(e) => setFormData({ ...formData, vat: Number(e.target.value) })}
                  placeholder="10"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  min="0"
                  max="100"
                />
              </div>

              {/* Total Preview */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-blue-900">Tổng cộng (tự động tính):</span>
                  <span className="text-xl font-bold text-blue-600">
                    {calculateTotal(
                      formData.inspectionFee,
                      formData.emissionTestFee,
                      formData.stickerFee,
                      formData.vat
                    ).toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Trạng thái</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="active"
                      checked={formData.status === 'active'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' })}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Đang áp dụng</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="inactive"
                      checked={formData.status === 'inactive'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'inactive' })}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Tạm ngưng</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                >
                  {editingItem ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
