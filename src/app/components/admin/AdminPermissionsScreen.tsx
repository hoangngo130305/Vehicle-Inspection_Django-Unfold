import { useState } from 'react';
import { 
  Shield, 
  Search, 
  User, 
  Eye, 
  Edit, 
  Save,
  X,
  Check,
  ChevronDown,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from './AdminLayout';

interface Permission {
  id: string;
  name: string;
  canView: boolean;
  canEdit: boolean;
}

interface UserRole {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  permissions: Permission[];
}

// Mock categories for permissions
const categories = [
  { id: 'orders', name: 'Quản lý đơn hàng' },
  { id: 'map', name: 'Giám sát bản đồ' },
  { id: 'finance', name: 'Tài chính' },
  { id: 'partners', name: 'Đối tác' },
  { id: 'staff', name: 'Nhân viên' },
  { id: 'stations', name: 'Trạm đăng kiểm' },
  { id: 'reports', name: 'Báo cáo' },
  { id: 'settings', name: 'Cài đặt' },
  { id: 'permissions', name: 'Phân quyền' },
];

export default function AdminPermissionsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserRole | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Mock users data
  const [users] = useState<UserRole[]>([
    {
      id: '1',
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      role: 'Quản trị viên',
      avatar: 'A',
      permissions: categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        canView: true,
        canEdit: true,
      })),
    },
    {
      id: '2',
      name: 'Trần Thị B',
      email: 'tranthib@example.com',
      role: 'Nhân viên',
      avatar: 'B',
      permissions: categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        canView: ['orders', 'map', 'stations'].includes(cat.id),
        canEdit: cat.id === 'orders',
      })),
    },
    {
      id: '3',
      name: 'Lê Văn C',
      email: 'levanc@example.com',
      role: 'Kế toán',
      avatar: 'C',
      permissions: categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        canView: ['finance', 'reports', 'orders'].includes(cat.id),
        canEdit: cat.id === 'finance',
      })),
    },
    {
      id: '4',
      name: 'Phạm Thị D',
      email: 'phamthid@example.com',
      role: 'Nhân viên',
      avatar: 'D',
      permissions: categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        canView: ['orders', 'stations'].includes(cat.id),
        canEdit: false,
      })),
    },
  ]);

  const [tempPermissions, setTempPermissions] = useState<Permission[]>([]);

  const filteredUsers = users.filter(
    user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectUser = (user: UserRole) => {
    setSelectedUser(user);
    setTempPermissions(JSON.parse(JSON.stringify(user.permissions)));
    setIsEditMode(false);
    setShowUserDropdown(false);
  };

  const handleTogglePermission = (categoryId: string, type: 'view' | 'edit') => {
    setTempPermissions(prev =>
      prev.map(perm => {
        if (perm.id === categoryId) {
          if (type === 'view') {
            // If disabling view, also disable edit
            return {
              ...perm,
              canView: !perm.canView,
              canEdit: !perm.canView ? false : perm.canEdit,
            };
          } else {
            // If enabling edit, also enable view
            return {
              ...perm,
              canEdit: !perm.canEdit,
              canView: !perm.canEdit ? true : perm.canView,
            };
          }
        }
        return perm;
      })
    );
  };

  const handleSavePermissions = () => {
    if (!selectedUser) return;

    // Update the user's permissions
    selectedUser.permissions = tempPermissions;
    setIsEditMode(false);
    toast.success(`Đã cập nhật quyền cho ${selectedUser.name}`);
  };

  const handleCancelEdit = () => {
    if (selectedUser) {
      setTempPermissions(JSON.parse(JSON.stringify(selectedUser.permissions)));
    }
    setIsEditMode(false);
  };

  const getPermissionStats = (permissions: Permission[]) => {
    const viewCount = permissions.filter(p => p.canView).length;
    const editCount = permissions.filter(p => p.canEdit).length;
    return { viewCount, editCount };
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="text-blue-600" size={28} />
              Phân Quyền Người Dùng
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Quản lý quyền truy cập và chỉnh sửa cho từng người dùng
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Selection Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="font-semibold text-gray-900 mb-3 text-sm">Chọn người dùng</h2>
                
                {/* Search */}
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm người dùng..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* User List */}
              <div className="max-h-[600px] overflow-y-auto">
                {filteredUsers.length === 0 ? (
                  <div className="p-8 text-center">
                    <User className="text-gray-300 mx-auto mb-2" size={40} />
                    <p className="text-gray-500 text-sm">Không tìm thấy người dùng</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredUsers.map((user) => {
                      const stats = getPermissionStats(user.permissions);
                      const isSelected = selectedUser?.id === user.id;

                      return (
                        <button
                          key={user.id}
                          onClick={() => handleSelectUser(user)}
                          className={`w-full p-4 text-left transition-colors ${
                            isSelected
                              ? 'bg-blue-50 border-l-4 border-blue-600'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-white ${
                              isSelected ? 'bg-blue-600' : 'bg-gradient-to-br from-gray-600 to-gray-700'
                            }`}>
                              {user.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className={`font-semibold text-sm mb-0.5 ${
                                isSelected ? 'text-blue-900' : 'text-gray-900'
                              }`}>
                                {user.name}
                              </h3>
                              <p className="text-xs text-gray-500 mb-1.5 truncate">{user.email}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium">
                                  {user.role}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 mt-2">
                                <div className="flex items-center gap-1">
                                  <Eye size={12} className="text-gray-400" />
                                  <span className="text-xs text-gray-600 font-medium">{stats.viewCount}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Edit size={12} className="text-gray-400" />
                                  <span className="text-xs text-gray-600 font-medium">{stats.editCount}</span>
                                </div>
                              </div>
                            </div>
                            {isSelected && (
                              <Check size={18} className="text-blue-600 flex-shrink-0" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Permissions Panel */}
          <div className="lg:col-span-2">
            {!selectedUser ? (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
                <Shield className="text-gray-300 mx-auto mb-4" size={64} />
                <h3 className="text-gray-900 font-semibold mb-2">Chọn người dùng để phân quyền</h3>
                <p className="text-gray-500 text-sm">
                  Chọn một người dùng từ danh sách bên trái để xem và chỉnh sửa quyền của họ
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* User Info Header */}
                <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-blue-50 to-white">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center font-bold text-white text-xl shadow-lg">
                        {selectedUser.avatar}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{selectedUser.name}</h2>
                        <p className="text-gray-600 text-sm">{selectedUser.email}</p>
                        <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-semibold">
                          {selectedUser.role}
                        </span>
                      </div>
                    </div>

                    {!isEditMode ? (
                      <button
                        onClick={() => setIsEditMode(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm"
                      >
                        <Edit size={16} />
                        Chỉnh sửa quyền
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                        >
                          <X size={16} />
                          Hủy
                        </button>
                        <button
                          onClick={handleSavePermissions}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm shadow-sm"
                        >
                          <Save size={16} />
                          Lưu thay đổi
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Permissions List */}
                <div className="p-6">
                  {isEditMode && (
                    <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-3">
                      <AlertCircle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-amber-900 text-sm font-medium mb-1">Chế độ chỉnh sửa</p>
                        <p className="text-amber-700 text-xs">
                          Điều chỉnh quyền xem và sửa cho từng danh mục. Nhấn "Lưu thay đổi" để áp dụng.
                        </p>
                      </div>
                    </div>
                  )}

                  <h3 className="font-semibold text-gray-900 mb-4 text-sm">Quyền truy cập danh mục</h3>
                  
                  <div className="space-y-2">
                    {tempPermissions.map((permission) => (
                      <div
                        key={permission.id}
                        className={`border rounded-lg p-4 transition-all ${
                          isEditMode
                            ? 'border-gray-200 bg-gray-50'
                            : 'border-gray-100 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-sm">{permission.name}</h4>
                          </div>

                          <div className="flex items-center gap-4">
                            {/* View Permission */}
                            <label className="flex items-center gap-2 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={permission.canView}
                                onChange={() => handleTogglePermission(permission.id, 'view')}
                                disabled={!isEditMode}
                                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                              />
                              <div className="flex items-center gap-1.5">
                                <Eye size={16} className={permission.canView ? 'text-blue-600' : 'text-gray-400'} />
                                <span className={`text-sm font-medium ${
                                  permission.canView ? 'text-gray-900' : 'text-gray-500'
                                }`}>
                                  Xem
                                </span>
                              </div>
                            </label>

                            {/* Edit Permission */}
                            <label className="flex items-center gap-2 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={permission.canEdit}
                                onChange={() => handleTogglePermission(permission.id, 'edit')}
                                disabled={!isEditMode}
                                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                              />
                              <div className="flex items-center gap-1.5">
                                <Edit size={16} className={permission.canEdit ? 'text-green-600' : 'text-gray-400'} />
                                <span className={`text-sm font-medium ${
                                  permission.canEdit ? 'text-gray-900' : 'text-gray-500'
                                }`}>
                                  Sửa
                                </span>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 text-sm mb-3">Tổng quan quyền hạn</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Eye size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            {tempPermissions.filter(p => p.canView).length}
                          </p>
                          <p className="text-xs text-gray-500">Quyền xem</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Edit size={20} className="text-green-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            {tempPermissions.filter(p => p.canEdit).length}
                          </p>
                          <p className="text-xs text-gray-500">Quyền sửa</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}