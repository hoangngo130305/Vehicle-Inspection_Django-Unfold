import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Edit, 
  UserPlus,
  Eye,
  MoreVertical,
  Download,
  RefreshCw,
  UserCheck,
  Shuffle,
  X,
  Trash2,
  Printer,
  FileText
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { toast } from 'sonner';
import { orderAPI, employeeAPI, type Order, type Employee, autoLogin, getToken } from '../../../lib/api'; // ✅ Using Employee type

// ✅ API Configuration - Using centralized API client from /src/lib/api.ts
// No hardcoded URLs or tokens needed! Uses getToken() automatically.
// ✅ Using Order & Employee types from api.ts - no local interface needed

export default function AdminOrdersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showMoreMenu, setShowMoreMenu] = useState<number | null>(null); // ✅ CHANGED: number (order.id) instead of string
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Edit form states
  const [editStatus, setEditStatus] = useState<'pending' | 'confirmed' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'>('pending'); // ✅ FIXED: Match Django status
  const [editPriority, setEditPriority] = useState<'high' | 'normal' | 'low' | 'urgent'>('normal'); // ✅ FIXED: Added 'urgent'
  const [editNote, setEditNote] = useState('');

  // ✅ FIXED: Use Employee type from API instead of local Staff interface
  const [orders, setOrders] = useState<Order[]>([]);
  const [staffList, setStaffList] = useState<Employee[]>([]);

  useEffect(() => {
    // ✅ FIXED: Check token, if not exist, redirect to login (DO NOT auto-login)
    const initializeData = async () => {
      // 1. Check if we have a valid token
      const existingToken = getToken();
      if (!existingToken) {
        console.warn('⚠️ [ADMIN ORDERS] No token found. User needs to login manually.');
        toast.error('Vui lòng đăng nhập để xem dữ liệu', {
          duration: 3000,
        });
        // ❌ DO NOT auto-login - it will fail with 401 if no user exists
        // User should login manually via AuthScreen
        return;
      }

      console.log('✅ [ADMIN ORDERS] Token found, fetching data...');

      // 2. Fetch orders from API
      try {
        const response = await orderAPI.getOrders();
        
        // ✅ HANDLE BOTH: Direct array OR paginated response
        const ordersList = Array.isArray(response) ? response : (response.results || []);
        
        console.log('✅ [ADMIN ORDERS] Orders loaded:', ordersList.length);
        setOrders(ordersList);
      } catch (error) {
        console.error('❌ [ADMIN ORDERS] Error fetching orders:', error);
        toast.error('Không thể tải đơn hàng');
      }

      // 3. Fetch staff list from API
      try {
        const response = await employeeAPI.getEmployees();
        console.log('✅ [ADMIN ORDERS] Staff loaded:', response.length || 0);
        setStaffList(response as any);
      } catch (error) {
        console.error('❌ [ADMIN ORDERS] Error fetching staff list:', error);
        toast.error('Không thể tải danh sách nhân viên');
      }
    };

    initializeData();
  }, []);

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      assigned: 'bg-cyan-100 text-cyan-700',
      in_progress: 'bg-purple-100 text-purple-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    
    const labels = {
      pending: 'Chờ xử lý',
      confirmed: 'Đã xác nhận',
      assigned: 'Đã phân công',
      in_progress: 'Đang thực hiện',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy',
    };
    
    return (
      <span className={`px-2 py-1 ${styles[status as keyof typeof styles]} text-xs font-semibold rounded-full`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      high: 'bg-red-100 text-red-700',
      normal: 'bg-gray-100 text-gray-700',
      low: 'bg-blue-100 text-blue-700',
      urgent: 'bg-orange-100 text-orange-700',
    };
    
    const labels = {
      high: 'Cao',
      normal: 'Bình thường',
      low: 'Thấp',
      urgent: 'Khẩn cấp',
    };
    
    return (
      <span className={`px-2 py-1 ${styles[priority as keyof typeof styles]} text-xs font-semibold rounded-full`}>
        {labels[priority as keyof typeof labels]}
      </span>
    );
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(o => o.id.toString()));
    }
  };

  const handleAssign = (order: Order) => {
    setSelectedOrder(order);
    setShowAssignModal(true);
  };

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setEditStatus(order.status as 'pending' | 'confirmed' | 'assigned' | 'in_progress' | 'completed' | 'cancelled');
    setEditPriority(order.priority as 'high' | 'normal' | 'low' | 'urgent');
    setEditNote('');
    setShowEditModal(true);
  };

  const handleAssignStaff = (staffName: string, staffId: number) => {
    if (!selectedOrder) return;
    
    // ✅ Call real API to assign staff
    orderAPI.assignStaff(selectedOrder.id, staffId)
      .then((updatedOrder) => {
        // ✅ Update local state with response from API
        setOrders(prevOrders => 
          prevOrders.map(o => 
            o.id === selectedOrder.id ? updatedOrder : o
          )
        );
        
        toast.success(`Đã phân công cho ${staffName}`);
        setShowAssignModal(false);
        setSelectedOrder(null);
      })
      .catch((error) => {
        console.error('❌ [ASSIGN STAFF] Error:', error);
        toast.error(`Lỗi phân công: ${error.message}`);
      });
  };

  const handleRandomAssign = () => {
    if (!selectedOrder) return;
    
    // ✅ FIXED: Use 'active' status instead of 'available'
    const availableStaff = staffList.filter(s => s.status === 'active');
    if (availableStaff.length === 0) {
      toast.error('Không có nhân viên rảnh');
      return;
    }
    
    const randomStaff = availableStaff[Math.floor(Math.random() * availableStaff.length)];
    
    // ✅ Update with correct API field names
    setOrders(prevOrders => 
      prevOrders.map(o => 
        o.id === selectedOrder.id 
          ? { ...o, assigned_staff: randomStaff.id, staff_name: randomStaff.full_name, status: 'in_progress' as const } // ✅ FIXED: 'processing' → 'in_progress'
          : o
      )
    );
    
    toast.success(`Đã phân công ngẫu nhiên cho ${randomStaff.full_name}`);
    setShowAssignModal(false);
    setSelectedOrder(null);
  };

  // Bulk random assignment
  const handleBulkRandomAssign = () => {
    const availableStaff = staffList.filter(s => s.status === 'active');
    if (availableStaff.length === 0) {
      toast.error('Không có nhân viên rảnh');
      return;
    }

    let assignedCount = 0;
    setOrders(prevOrders => 
      prevOrders.map(o => {
        if (selectedOrders.includes(o.id.toString()) && !o.assigned_staff) {
          const randomStaff = availableStaff[Math.floor(Math.random() * availableStaff.length)];
          assignedCount++;
          return { ...o, assigned_staff: randomStaff.id, staff_name: randomStaff.full_name, status: 'in_progress' as const }; // ✅ FIXED: 'processing' → 'in_progress'
        }
        return o;
      })
    );

    toast.success(`Đã phân công ngẫu nhiên ${assignedCount} đơn hàng`);
    setSelectedOrders([]);
  };

  const handleExport = () => {
    toast.info('Đang xuất dữ liệu...');
    
    // ✅ Create CSV content with correct API field names
    const headers = ['Mã ĐH', 'Khách hàng', 'SĐT', 'Biển số', 'Loại xe', 'Trạng thái', 'Nhân viên', 'Ngày', 'Giờ', 'Số tiền'];
    const csvContent = [
      headers.join(','),
      ...orders.map(o => [
        o.order_code,
        o.customer_name,
        o.customer_phone,
        o.vehicle_plate,
        o.vehicle_type || 'N/A',
        o.status,
        o.staff_name || 'Chưa phân công',
        o.appointment_date,
        o.appointment_time,
        o.estimated_amount
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `don-hang-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast.success('Đã xuất file thành công');
  };

  const handleRefresh = () => {
    toast.info('Đang làm mới dữ liệu...');
    
    // Simulate API call
    setTimeout(() => {
      // Reset filters
      setSearchQuery('');
      setStatusFilter('all');
      setSelectedOrders([]);
      setCurrentPage(1);
      
      toast.success('Đã làm mới dữ liệu');
    }, 500);
  };

  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleSaveEdit = () => {
    if (!selectedOrder) return;

    // Update orders state with edited values
    setOrders(prevOrders => 
      prevOrders.map(o => 
        o.id === selectedOrder.id 
          ? { 
              ...o, 
              status: editStatus,
              priority: editPriority
            }
          : o
      )
    );

    toast.success(`Đã cập nhật đơn hàng ${selectedOrder.id}`);
    setShowEditModal(false);
    setSelectedOrder(null);
  };

  const handlePrintOrder = (order: Order) => {
    toast.success(`Đang in đơn hàng ${order.id}`);
    setShowMoreMenu(null);
  };

  const handleDeleteOrder = (order: Order) => {
    if (confirm(`Bạn có chắc muốn xóa đơn hàng ${order.id}?`)) {
      setOrders(prevOrders => prevOrders.filter(o => o.id !== order.id));
      toast.success(`Đã xóa đơn hàng ${order.id}`);
    }
    setShowMoreMenu(null);
  };

  const handleExportOrder = (order: Order) => {
    toast.success(`Đang xuất đơn hàng ${order.id}`);
    setShowMoreMenu(null);
  };

  const filteredOrders = orders.filter(order => {
    // ✅ Use correct API flat field names
    const matchesSearch = 
      order.order_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.vehicle_plate.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
            <p className="text-gray-600 mt-1">Quản lý và phân công đơn hàng đăng kiểm</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download size={18} />
              <span className="text-sm font-medium">Export</span>
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw size={18} />
              <span className="text-sm font-medium">Làm mới</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã, khách hàng, biển số..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="assigned">Đã phân công</option>
              <option value="in_progress">Đang thực hiện</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>

            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Filter size={18} />
              <span className="text-sm font-medium">Lọc</span>
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedOrders.length > 0 && (
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 flex items-center justify-between">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">{selectedOrders.length}</span> đơn hàng được chọn
            </p>
            <div className="flex gap-2">
              <button 
                onClick={handleBulkRandomAssign}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Phân công hàng loạt
              </button>
              <button 
                onClick={() => setSelectedOrders([])}
                className="px-4 py-2 bg-white border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
              >
                Hủy chọn
              </button>
            </div>
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Mã ĐH</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Khách hàng</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Biển số</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Loại xe</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Trạng thái</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Ưu tiên</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nhân viên</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Ngày/Giờ</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Số tiền</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id.toString())}
                        onChange={() => handleSelectOrder(order.id.toString())}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-gray-900">{order.order_code}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.customer_name}</p>
                        <p className="text-xs text-gray-500">{order.customer_phone}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-900 font-mono">{order.vehicle_plate}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600">{order.vehicle_type || 'N/A'}</span>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-4 py-3">
                      {getPriorityBadge(order.priority)}
                    </td>
                    <td className="px-4 py-3">
                      {order.staff_name ? (
                        <span className="text-sm text-gray-900">{order.staff_name}</span>
                      ) : (
                        <button
                          onClick={() => handleAssign(order)}
                          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold"
                        >
                          <UserPlus size={14} />
                          Phân công
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm text-gray-900">{order.appointment_date}</p>
                        <p className="text-xs text-gray-500">{order.appointment_time}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-gray-900">{order.estimated_amount}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 relative">
                        <button
                          onClick={() => handleViewDetail(order)}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(order)}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                          title="Sửa"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setShowMoreMenu(showMoreMenu === order.id ? null : order.id)}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                          title="Thêm"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {/* Dropdown Menu */}
                        {showMoreMenu === order.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={() => setShowMoreMenu(null)}
                            />
                            <div className="absolute right-0 top-8 z-20 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[160px]">
                              <button
                                onClick={() => handlePrintOrder(order)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                <Printer size={16} />
                                In đơn hàng
                              </button>
                              <button
                                onClick={() => handleExportOrder(order)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                <FileText size={16} />
                                Xuất file
                              </button>
                              <div className="border-t border-gray-200 my-1" />
                              <button
                                onClick={() => handleDeleteOrder(order)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 size={16} />
                                Xóa đơn hàng
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Hiển thị <span className="font-semibold">{startIndex + 1}-{Math.min(endIndex, filteredOrders.length)}</span> / <span className="font-semibold">{filteredOrders.length}</span> đơn hàng
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 text-sm transition-colors ${
                  currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                ←
              </button>
              {[...Array(Math.min(totalPages, 3))].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 text-sm transition-colors ${
                  currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* Assign Modal */}
        {showAssignModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Phân công nhân viên</h3>
                  <p className="text-sm text-gray-600 mt-1">Đơn hàng: {selectedOrder.id}</p>
                </div>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-180px)]">
                {/* Assignment Mode Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Chọn phương thức phân công</label>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Manual Assignment */}
                    <div className="p-4 rounded-xl border-2 border-blue-600 bg-blue-50">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                          <UserCheck size={20} className="text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">Phân công thủ công</p>
                          <p className="text-xs text-gray-600">Chọn nhân viên cụ thể</p>
                        </div>
                      </div>
                    </div>

                    {/* Random Assignment */}
                    <button
                      onClick={handleRandomAssign}
                      className="p-4 rounded-xl border-2 border-gray-200 hover:border-green-600 hover:bg-green-50 transition-all group"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gray-200 group-hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors">
                          <Shuffle size={20} className="text-gray-600 group-hover:text-white transition-colors" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-gray-900 text-sm">Phân công ngẫu nhiên</p>
                          <p className="text-xs text-gray-600">Tự động chọn nhân viên rảnh</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Staff List */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Danh sách nhân viên</label>
                  <div className="space-y-2">
                    {staffList.map((staff) => (
                      <button
                        key={staff.id}
                        onClick={() => handleAssignStaff(staff.full_name, staff.id)}
                        disabled={staff.status !== 'active'}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          staff.status === 'active'
                            ? 'border-gray-200 hover:border-blue-600 hover:bg-blue-50 cursor-pointer'
                            : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-bold text-sm">{staff.full_name.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{staff.full_name}</p>
                              <p className="text-xs text-gray-500">{staff.role_name || 'Nhân viên đăng kiểm'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
                              staff.status === 'active'
                                ? 'bg-green-100 text-green-700'
                                : staff.status === 'inactive'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {staff.status === 'active' ? '🟢 Hoạt động' : staff.status === 'inactive' ? '🔴 Không hoạt động' : '🟡 Nghỉ phép'}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-lg w-full p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Sửa thông tin đơn hàng
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as 'pending' | 'confirmed' | 'assigned' | 'in_progress' | 'completed' | 'cancelled')}
                  >
                    <option value="pending">Chờ xử lý</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="assigned">Đã phân công</option>
                    <option value="in_progress">Đang thực hiện</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ưu tiên
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as 'high' | 'normal' | 'low' | 'urgent')}
                  >
                    <option value="high">Cao</option>
                    <option value="normal">Bình thường</option>
                    <option value="low">Thấp</option>
                    <option value="urgent">Khẩn cấp</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ghi chú
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    placeholder="Nhập ghi chú..."
                  ></textarea>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Chi tiết đơn hàng</h3>
                  <p className="text-sm text-gray-600 mt-1">Đơn hàng: {selectedOrder.id}</p>
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
                    <p className="text-sm font-medium text-gray-700">Khách hàng:</p>
                    <p className="text-sm text-gray-900">{selectedOrder.customer_name}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Số điện thoại:</p>
                    <p className="text-sm text-gray-900">{selectedOrder.customer_phone}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Biển số xe:</p>
                    <p className="text-sm text-gray-900 font-mono">{selectedOrder.vehicle_plate}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Loại xe:</p>
                    <p className="text-sm text-gray-900">{selectedOrder.vehicle_type || 'N/A'}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Trạng thái:</p>
                    <p className="text-sm text-gray-900">{getStatusBadge(selectedOrder.status)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Ưu tiên:</p>
                    <p className="text-sm text-gray-900">{getPriorityBadge(selectedOrder.priority)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Nhân viên:</p>
                    <p className="text-sm text-gray-900">{selectedOrder.staff_name || 'Chưa phân công'}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Ngày:</p>
                    <p className="text-sm text-gray-900">{selectedOrder.appointment_date}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Giờ:</p>
                    <p className="text-sm text-gray-900">{selectedOrder.appointment_time}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Số tiền:</p>
                    <p className="text-sm text-gray-900 font-semibold">{selectedOrder.estimated_amount}</p>
                  </div>
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
      </div>
    </AdminLayout>
  );
}