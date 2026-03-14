import { useState } from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Phone,
  Mail,
  Lock,
  X,
  Check,
  AlertCircle,
  Key,
  MapPin,
  Briefcase,
  Calendar,
  Shield,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from './AdminLayout';

interface Employee {
  id: string;
  // Account info
  username: string;
  password: string;
  role: 'admin' | 'staff' | 'accountant' | 'viewer';
  status: 'active' | 'inactive';
  
  // Personal info
  fullName: string;
  phone: string;
  email: string;
  
  // Work info
  position: string;
  location: string;
  tasksToday: number;
  tasksCompleted: number;
  
  // Dates
  joinedDate: string;
  lastLogin: string;
}

const roleOptions = [
  { value: 'admin', label: 'Quản trị viên', color: 'purple' },
  { value: 'staff', label: 'Nhân viên', color: 'blue' },
  { value: 'accountant', label: 'Kế toán', color: 'green' },
  { value: 'viewer', label: 'Người xem', color: 'gray' },
];

const positionOptions = [
  'Nhân viên kiểm định',
  'Trưởng phòng',
  'Kế toán',
  'Lễ tân',
  'Quản lý',
];

const locationOptions = [
  'Hà Nội',
  'Hồ Chí Minh',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
];

export default function AdminEmployeesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    email: '',
    role: 'staff' as Employee['role'],
    position: 'Nhân viên kiểm định',
    location: 'Hà Nội',
  });

  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 'EMP001',
      username: 'admin',
      password: 'Admin@123',
      role: 'admin',
      status: 'active',
      fullName: 'Nguyễn Văn A',
      phone: '0912345678',
      email: 'nguyenvana@example.com',
      position: 'Quản lý',
      location: 'Hà Nội',
      tasksToday: 0,
      tasksCompleted: 0,
      joinedDate: '2024-01-15',
      lastLogin: '2024-02-04 09:30',
    },
    {
      id: 'EMP002',
      username: 'tranthib',
      password: 'Staff@123',
      role: 'staff',
      status: 'active',
      fullName: 'Trần Thị B',
      phone: '0923456789',
      email: 'tranthib@example.com',
      position: 'Nhân viên kiểm định',
      location: 'Hà Nội',
      tasksToday: 5,
      tasksCompleted: 3,
      joinedDate: '2024-01-20',
      lastLogin: '2024-02-03 14:20',
    },
    {
      id: 'EMP003',
      username: 'levanc',
      password: 'Account@123',
      role: 'accountant',
      status: 'active',
      fullName: 'Lê Văn C',
      phone: '0934567890',
      email: 'levanc@example.com',
      position: 'Kế toán',
      location: 'Hà Nội',
      tasksToday: 2,
      tasksCompleted: 2,
      joinedDate: '2024-01-25',
      lastLogin: '2024-02-04 08:15',
    },
    {
      id: 'EMP004',
      username: 'phamthid',
      password: 'Viewer@123',
      role: 'viewer',
      status: 'inactive',
      fullName: 'Phạm Thị D',
      phone: '0945678901',
      email: 'phamthid@example.com',
      position: 'Lễ tân',
      location: 'Hà Nội',
      tasksToday: 0,
      tasksCompleted: 0,
      joinedDate: '2024-02-01',
      lastLogin: '2024-02-01 10:00',
    },
  ]);

  const filteredEmployees = employees.filter(
    (emp) =>
      (emp.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.phone.includes(searchQuery)) &&
      (roleFilter === 'all' || emp.role === roleFilter) &&
      (statusFilter === 'all' || emp.status === statusFilter)
  );

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      phone: '',
      email: '',
      role: 'staff',
      position: 'Nhân viên kiểm định',
      location: 'Hà Nội',
    });
  };

  const handleAddEmployee = () => {
    // Validation
    if (!formData.username || !formData.password || !formData.fullName || !formData.phone || !formData.email) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    // Check username exists
    if (employees.some(emp => emp.username === formData.username)) {
      toast.error('Tên đăng nhập đã tồn tại');
      return;
    }

    const newEmployee: Employee = {
      id: `EMP${String(employees.length + 1).padStart(3, '0')}`,
      username: formData.username,
      password: formData.password,
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      role: formData.role,
      position: formData.position,
      location: formData.location,
      status: 'active',
      tasksToday: 0,
      tasksCompleted: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      lastLogin: 'Chưa đăng nhập',
    };

    setEmployees([...employees, newEmployee]);
    toast.success('Thêm nhân viên thành công!');
    setShowAddModal(false);
    resetForm();
  };

  const handleEditEmployee = () => {
    if (!selectedEmployee) return;

    if (!formData.username || !formData.fullName || !formData.phone || !formData.email) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Check username exists (except current employee)
    if (employees.some(emp => emp.username === formData.username && emp.id !== selectedEmployee.id)) {
      toast.error('Tên đăng nhập đã tồn tại');
      return;
    }

    setEmployees(
      employees.map((emp) =>
        emp.id === selectedEmployee.id
          ? {
              ...emp,
              username: formData.username,
              fullName: formData.fullName,
              phone: formData.phone,
              email: formData.email,
              role: formData.role,
              position: formData.position,
              location: formData.location,
            }
          : emp
      )
    );

    toast.success('Cập nhật thông tin thành công!');
    setShowEditModal(false);
    setSelectedEmployee(null);
    resetForm();
  };

  const handleChangePassword = () => {
    if (!selectedEmployee) return;

    if (!formData.password || !formData.confirmPassword) {
      toast.error('Vui lòng nhập mật khẩu mới');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setEmployees(
      employees.map((emp) =>
        emp.id === selectedEmployee.id
          ? { ...emp, password: formData.password }
          : emp
      )
    );

    toast.success('Đổi mật khẩu thành công!');
    setShowPasswordModal(false);
    setSelectedEmployee(null);
    resetForm();
  };

  const handleDeleteEmployee = (employee: Employee) => {
    if (employee.role === 'admin' && employees.filter(emp => emp.role === 'admin').length === 1) {
      toast.error('Không thể xóa quản trị viên cuối cùng');
      return;
    }

    if (confirm(`Bạn có chắc muốn xóa nhân viên "${employee.fullName}"?`)) {
      setEmployees(employees.filter((emp) => emp.id !== employee.id));
      toast.success('Xóa nhân viên thành công!');
    }
  };

  const handleToggleStatus = (employee: Employee) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === employee.id
          ? { ...emp, status: emp.status === 'active' ? 'inactive' : 'active' }
          : emp
      )
    );
    toast.success(
      employee.status === 'active' ? 'Đã vô hiệu hóa tài khoản' : 'Đã kích hoạt tài khoản'
    );
  };

  const openEditModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFormData({
      username: employee.username,
      password: '',
      confirmPassword: '',
      fullName: employee.fullName,
      phone: employee.phone,
      email: employee.email,
      role: employee.role,
      position: employee.position,
      location: employee.location,
    });
    setShowEditModal(true);
  };

  const openPasswordModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFormData({
      username: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      phone: '',
      email: '',
      role: 'staff',
      position: 'Nhân viên kiểm định',
      location: 'Hà Nội',
    });
    setShowPasswordModal(true);
  };

  const getRoleBadge = (role: string) => {
    const roleOption = roleOptions.find((r) => r.value === role);
    if (!roleOption) return null;

    const colorClasses = {
      purple: 'bg-purple-100 text-purple-700',
      blue: 'bg-blue-100 text-blue-700',
      green: 'bg-green-100 text-green-700',
      gray: 'bg-gray-100 text-gray-700',
    };

    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colorClasses[roleOption.color as keyof typeof colorClasses]}`}>
        {roleOption.label}
      </span>
    );
  };

  const stats = {
    total: employees.length,
    active: employees.filter((emp) => emp.status === 'active').length,
    inactive: employees.filter((emp) => emp.status === 'inactive').length,
    tasksToday: employees.reduce((sum, emp) => sum + emp.tasksToday, 0),
    tasksProcessing: employees.reduce((sum, emp) => sum + (emp.tasksToday - emp.tasksCompleted), 0),
    tasksCompleted: employees.reduce((sum, emp) => sum + emp.tasksCompleted, 0),
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="text-blue-600" size={28} />
              Quản lý Nhân viên
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Quản lý thông tin nhân viên và tài khoản đăng nhập
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            <UserPlus size={20} />
            Thêm nhân viên
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Tổng nhân viên</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Đang hoạt động</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Check className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Vô hiệu hóa</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{stats.inactive}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <X className="text-red-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Công việc hôm nay</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{stats.tasksToday}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Briefcase className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Work Statistics Cards - Detailed */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Briefcase size={24} />
              </div>
              <span className="text-orange-100 text-sm font-medium">Tổng số</span>
            </div>
            <p className="text-3xl font-bold mb-1">{stats.tasksToday}</p>
            <p className="text-orange-100 text-sm">Đơn hôm nay</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Clock size={24} />
              </div>
              <span className="text-blue-100 text-sm font-medium">Chưa xong</span>
            </div>
            <p className="text-3xl font-bold mb-1">{stats.tasksProcessing}</p>
            <p className="text-blue-100 text-sm">Đang xử lý</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Check size={24} />
              </div>
              <span className="text-green-100 text-sm font-medium">Đã xong</span>
            </div>
            <p className="text-3xl font-bold mb-1">{stats.tasksCompleted}</p>
            <p className="text-green-100 text-sm">Hoàn thành</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, username, email, SĐT..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả vai trò</option>
              {roleOptions.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Vô hiệu hóa</option>
            </select>
          </div>
        </div>

        {/* Employees Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Nhân viên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Liên hệ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tài khoản
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Công việc
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Users className="text-gray-300 mx-auto mb-2" size={48} />
                      <p className="text-gray-500">Không tìm thấy nhân viên</p>
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold">
                            {employee.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{employee.fullName}</p>
                            <p className="text-xs text-gray-500">{employee.position}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone size={14} className="text-gray-400" />
                            {employee.phone}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail size={14} className="text-gray-400" />
                            {employee.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-900">@{employee.username}</p>
                          {getRoleBadge(employee.role)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin size={14} className="text-gray-400" />
                            {employee.location}
                          </div>
                          <div className="text-xs text-gray-500">
                            Hôm nay: {employee.tasksCompleted}/{employee.tasksToday}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(employee)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                            employee.status === 'active'
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {employee.status === 'active' ? 'Hoạt động' : 'Vô hiệu hóa'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openPasswordModal(employee)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Đổi mật khẩu"
                          >
                            <Key size={18} />
                          </button>
                          <button
                            onClick={() => openEditModal(employee)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(employee)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Thêm nhân viên mới</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Account Info Section */}
                <div className="col-span-2">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Shield size={16} className="text-blue-600" />
                    Thông tin tài khoản
                  </h3>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tên đăng nhập *
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="vd: nguyenvana"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Vai trò *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as Employee['role'] })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {roleOptions.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mật khẩu *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Tối thiểu 6 ký tự"
                      className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Xác nhận mật khẩu *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="Nhập lại mật khẩu"
                      className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Personal Info Section */}
                <div className="col-span-2 mt-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Users size={16} className="text-blue-600" />
                    Thông tin cá nhân
                  </h3>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0912345678"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Work Info Section */}
                <div className="col-span-2 mt-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Briefcase size={16} className="text-blue-600" />
                    Thông tin công việc
                  </h3>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Chức vụ *
                  </label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {positionOptions.map((pos) => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Địa điểm làm việc *
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {locationOptions.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-blue-900">
                    Nhân viên sẽ sử dụng tên đăng nhập và mật khẩu này để truy cập hệ thống.
                    Sau đó có thể phân quyền chi tiết tại trang "Phân quyền".
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleAddEmployee}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Thêm nhân viên
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal - Similar structure but with edit functionality */}
      {showEditModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Chỉnh sửa thông tin nhân viên</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedEmployee(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Account Info */}
                <div className="col-span-2">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Shield size={16} className="text-blue-600" />
                    Thông tin tài khoản
                  </h3>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tên đăng nhập *
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Vai trò *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as Employee['role'] })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {roleOptions.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Personal Info */}
                <div className="col-span-2 mt-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Users size={16} className="text-blue-600" />
                    Thông tin cá nhân
                  </h3>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Work Info */}
                <div className="col-span-2 mt-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Briefcase size={16} className="text-blue-600" />
                    Thông tin công việc
                  </h3>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Chức vụ *
                  </label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {positionOptions.map((pos) => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Địa điểm làm việc *
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {locationOptions.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedEmployee(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleEditEmployee}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Đổi mật khẩu</h2>
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setSelectedEmployee(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Đổi mật khẩu cho: <span className="font-semibold text-gray-900">{selectedEmployee.fullName}</span>
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mật khẩu mới *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Tối thiểu 6 ký tự"
                    className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Xác nhận mật khẩu *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Nhập lại mật khẩu mới"
                    className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setSelectedEmployee(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleChangePassword}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Đổi mật khẩu
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}