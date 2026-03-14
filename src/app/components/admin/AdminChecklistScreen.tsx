import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Check, X, Camera } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { toast } from 'sonner';

interface ChecklistItem {
  id: string;
  key: string;
  label: string;
  category: 'receipt' | 'return' | 'both';
  order: number;
  requirePhoto: boolean;
  active: boolean;
}

export default function AdminChecklistScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ChecklistItem | null>(null);

  // Mock data
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    { id: '1', key: 'exterior', label: 'Ngoại thất không trầy xước', category: 'both', order: 1, requirePhoto: true, active: true },
    { id: '2', key: 'tires', label: 'Lốp xe đầy đủ, không rò', category: 'both', order: 2, requirePhoto: true, active: true },
    { id: '3', key: 'lights', label: 'Hệ thống đèn hoạt động tốt', category: 'both', order: 3, requirePhoto: true, active: true },
    { id: '4', key: 'mirrors', label: 'Gương chiếu hậu nguyên vẹn', category: 'both', order: 4, requirePhoto: true, active: true },
    { id: '5', key: 'windshield', label: 'Kính chắn gió không vỡ/nứt', category: 'both', order: 5, requirePhoto: true, active: true },
    { id: '6', key: 'interior', label: 'Nội thất sạch sẽ', category: 'both', order: 6, requirePhoto: true, active: true },
    { id: '7', key: 'documents', label: 'Giấy tờ xe đầy đủ', category: 'both', order: 7, requirePhoto: true, active: true },
    { id: '8', key: 'inspection_sticker', label: 'Tem đăng kiểm đã dán', category: 'return', order: 8, requirePhoto: true, active: true },
  ]);

  const [formData, setFormData] = useState({
    key: '',
    label: '',
    category: 'both' as 'receipt' | 'return' | 'both',
    requirePhoto: true,
    active: true,
  });

  const filteredItems = checklistItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    if (!formData.key || !formData.label) {
      toast.error('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      key: formData.key,
      label: formData.label,
      category: formData.category,
      order: checklistItems.length + 1,
      requirePhoto: formData.requirePhoto,
      active: formData.active,
    };

    setChecklistItems([...checklistItems, newItem]);
    setShowAddModal(false);
    setFormData({ key: '', label: '', category: 'both', requirePhoto: true, active: true });
    toast.success('✅ Thêm mục checklist thành công!');
  };

  const handleEdit = () => {
    if (!selectedItem) return;
    if (!formData.key || !formData.label) {
      toast.error('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    setChecklistItems(
      checklistItems.map(item =>
        item.id === selectedItem.id
          ? { ...item, ...formData }
          : item
      )
    );
    setShowEditModal(false);
    setSelectedItem(null);
    setFormData({ key: '', label: '', category: 'both', requirePhoto: true, active: true });
    toast.success('✅ Cập nhật mục checklist thành công!');
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa mục checklist này?')) {
      setChecklistItems(checklistItems.filter(item => item.id !== id));
      toast.success('✅ Đã xóa mục checklist!');
    }
  };

  const openEditModal = (item: ChecklistItem) => {
    setSelectedItem(item);
    setFormData({
      key: item.key,
      label: item.label,
      category: item.category,
      requirePhoto: item.requirePhoto,
      active: item.active,
    });
    setShowEditModal(true);
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'receipt':
        return <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">Nhận xe</span>;
      case 'return':
        return <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">Trả xe</span>;
      case 'both':
        return <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">Cả 2</span>;
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý Checklist</h1>
              <p className="text-gray-500 mt-1">Quản lý các mục kiểm tra khi nhận/trả xe</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Thêm mục mới
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm mục checklist..."
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
                <Check size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng số mục</p>
                <p className="text-2xl font-bold text-gray-900">{checklistItems.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Check size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Đang hoạt động</p>
                <p className="text-2xl font-bold text-gray-900">{checklistItems.filter(i => i.active).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Camera size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Yêu cầu ảnh</p>
                <p className="text-2xl font-bold text-gray-900">{checklistItems.filter(i => i.requirePhoto).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <X size={24} className="text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Không hoạt động</p>
                <p className="text-2xl font-bold text-gray-900">{checklistItems.filter(i => !i.active).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Checklist Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">STT</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Key</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Mô tả</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Áp dụng</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Yêu cầu ảnh</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Trạng thái</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-700">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredItems.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4">
                      <code className="text-sm text-purple-600 bg-purple-50 px-2 py-1 rounded">{item.key}</code>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.label}</td>
                    <td className="px-6 py-4">{getCategoryBadge(item.category)}</td>
                    <td className="px-6 py-4">
                      {item.requirePhoto ? (
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium flex items-center gap-1 w-fit">
                          <Check size={12} />
                          Có
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full font-medium flex items-center gap-1 w-fit">
                          <X size={12} />
                          Không
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {item.active ? (
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">Hoạt động</span>
                      ) : (
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">Tắt</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Thêm mục checklist mới</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Key (mã định danh)</label>
                <input
                  type="text"
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  placeholder="VD: brake_system"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả</label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="VD: Hệ thống phanh hoạt động tốt"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Áp dụng cho</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="both">Cả nhận xe và trả xe</option>
                  <option value="receipt">Chỉ nhận xe</option>
                  <option value="return">Chỉ trả xe</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="requirePhoto"
                  checked={formData.requirePhoto}
                  onChange={(e) => setFormData({ ...formData, requirePhoto: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="requirePhoto" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Yêu cầu chụp ảnh
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="active" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Kích hoạt ngay
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({ key: '', label: '', category: 'both', requirePhoto: true, active: true });
                }}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Thêm mục
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Chỉnh sửa mục checklist</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Key (mã định danh)</label>
                <input
                  type="text"
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả</label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Áp dụng cho</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="both">Cả nhận xe và trả xe</option>
                  <option value="receipt">Chỉ nhận xe</option>
                  <option value="return">Chỉ trả xe</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="editRequirePhoto"
                  checked={formData.requirePhoto}
                  onChange={(e) => setFormData({ ...formData, requirePhoto: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="editRequirePhoto" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Yêu cầu chụp ảnh
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="editActive"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="editActive" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Kích hoạt
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedItem(null);
                  setFormData({ key: '', label: '', category: 'both', requirePhoto: true, active: true });
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
