import { useState } from 'react';
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

interface Order {
  id: string;
  customer: string;
  phone: string;
  vehicle: string;
  vehicleType: string;
  status: 'waiting' | 'processing' | 'completed' | 'cancelled';
  assignedTo: string | null;
  date: string;
  time: string;
  amount: string;
  priority: 'high' | 'normal' | 'low';
}

export default function AdminOrdersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showMoreMenu, setShowMoreMenu] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Edit form states
  const [editStatus, setEditStatus] = useState<'waiting' | 'processing' | 'completed' | 'cancelled'>('waiting');
  const [editPriority, setEditPriority] = useState<'high' | 'normal' | 'low'>('normal');
  const [editNote, setEditNote] = useState('');

  // Mock data - CHANGED TO STATE
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'DK001',
      customer: 'Nguyễn Văn A',
      phone: '0123456789',
      vehicle: '30A-123.45',
      vehicleType: 'Ô tô con',
      status: 'waiting',
      assignedTo: null,
      date: '28/01/2026',
      time: '08:30',
      amount: '460.000đ',
      priority: 'high',
    },
    {
      id: 'DK002',
      customer: 'Trần Thị B',
      phone: '0987654321',
      vehicle: '29B-678.90',
      vehicleType: 'Ô tô con',
      status: 'processing',
      assignedTo: 'Lê Văn C',
      date: '28/01/2026',
      time: '09:00',
      amount: '520.000đ',
      priority: 'normal',
    },
    {
      id: 'DK003',
      customer: 'Phạm Thị D',
      phone: '0369258147',
      vehicle: '51F-234.56',
      vehicleType: 'Xe tải',
      status: 'completed',
      assignedTo: 'Nguyễn Văn E',
      date: '27/01/2026',
      time: '14:00',
      amount: '680.000đ',
      priority: 'normal',
    },
    {
      id: 'DK004',
      customer: 'Hoàng Văn F',
      phone: '0912345678',
      vehicle: '40H-456.78',
      vehicleType: 'Ô tô con',
      status: 'waiting',
      assignedTo: null,
      date: '28/01/2026',
      time: '10:30',
      amount: '450.000đ',
      priority: 'low',
    },
    {
      id: 'DK005',
      customer: 'Đỗ Thị G',
      phone: '0834567891',
      vehicle: '99X-789.01',
      vehicleType: 'Xe máy',
      status: 'processing',
      assignedTo: 'Lê Văn C',
      date: '28/01/2026',
      time: '11:00',
      amount: '180.000đ',
      priority: 'normal',
    },
    {
      id: 'DK006',
      customer: 'Lý Văn H',
      phone: '0945678123',
      vehicle: '30A-456.78',
      vehicleType: 'Ô tô con',
      status: 'waiting',
      assignedTo: null,
      date: '29/01/2026',
      time: '08:00',
      amount: '490.000đ',
      priority: 'normal',
    },
    {
      id: 'DK007',
      customer: 'Võ Thị K',
      phone: '0956789234',
      vehicle: '29B-234.56',
      vehicleType: 'Ô tô con',
      status: 'waiting',
      assignedTo: null,
      date: '29/01/2026',
      time: '09:30',
      amount: '510.000đ',
      priority: 'high',
    },
  ]);

  const staffList = [
    { id: '1', name: 'Lê Văn C', available: true },
    { id: '2', name: 'Nguyễn Văn E', available: true },
    { id: '3', name: 'Trần Văn H', available: false },
    { id: '4', name: 'Phạm Thị I', available: true },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      waiting: 'bg-orange-100 text-orange-700',
      processing: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    
    const labels = {
      waiting: 'Chờ xử lý',
      processing: 'Đang xử lý',
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
    };
    
    const labels = {
      high: 'Cao',
      normal: 'Bình thường',
      low: 'Thấp',
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
      setSelectedOrders(orders.map(o => o.id));
    }
  };

  const handleAssign = (order: Order) => {
    setSelectedOrder(order);
    setShowAssignModal(true);
  };

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setEditStatus(order.status);
    setEditPriority(order.priority);
    setEditNote('');
    setShowEditModal(true);
  };

  const handleAssignStaff = (staffName: string) => {
    if (!selectedOrder) return;
    
    // Update orders state
    setOrders(prevOrders => 
      prevOrders.map(o => 
        o.id === selectedOrder.id 
          ? { ...o, assignedTo: staffName, status: 'processing' as const }
          : o
      )
    );
    
    toast.success(`Đã phân công cho ${staffName}`);
    setShowAssignModal(false);
    setSelectedOrder(null);
  };

  const handleRandomAssign = () => {
    if (!selectedOrder) return;
    
    const availableStaff = staffList.filter(s => s.available);
    if (availableStaff.length === 0) {
      toast.error('Không có nhân viên rảnh');
      return;
    }
    
    const randomStaff = availableStaff[Math.floor(Math.random() * availableStaff.length)];
    
    // Update orders state
    setOrders(prevOrders => 
      prevOrders.map(o => 
        o.id === selectedOrder.id 
          ? { ...o, assignedTo: randomStaff.name, status: 'processing' as const }
          : o
      )
    );
    
    toast.success(`Đã phân công ngẫu nhiên cho ${randomStaff.name}`);
    setShowAssignModal(false);
    setSelectedOrder(null);
  };

  // Bulk random assignment
  const handleBulkRandomAssign = () => {
    const availableStaff = staffList.filter(s => s.available);
    if (availableStaff.length === 0) {
      toast.error('Không có nhân viên rảnh');
      return;
    }

    let assignedCount = 0;
    setOrders(prevOrders => 
      prevOrders.map(o => {
        if (selectedOrders.includes(o.id) && !o.assignedTo) {
          const randomStaff = availableStaff[Math.floor(Math.random() * availableStaff.length)];
          assignedCount++;
          return { ...o, assignedTo: randomStaff.name, status: 'processing' as const };
        }
        return o;
      })
    );

    toast.success(`Đã phân công ngẫu nhiên ${assignedCount} đơn hàng`);
    setSelectedOrders([]);
  };

  const handleExport = () => {
    toast.info('Đang xuất dữ liệu...');
    
    // Create CSV content
    const headers = ['Mã ĐH', 'Khách hàng', 'SĐT', 'Biển số', 'Loại xe', 'Trạng thái', 'Nhân viên', 'Ngày', 'Giờ', 'Số tiền'];
    const csvContent = [
      headers.join(','),
      ...orders.map(o => [
        o.id,
        o.customer,
        o.phone,
        o.vehicle,
        o.vehicleType,
        o.status,
        o.assignedTo || 'Chưa phân công',
        o.date,
        o.time,
        o.amount
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
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.vehicle.toLowerCase().includes(searchQuery.toLowerCase());
    
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
              <option value="waiting">Chờ xử lý</option>
              <option value="processing">Đang xử lý</option>
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
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => handleSelectOrder(order.id)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-gray-900">{order.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                        <p className="text-xs text-gray-500">{order.phone}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-900 font-mono">{order.vehicle}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600">{order.vehicleType}</span>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-4 py-3">
                      {getPriorityBadge(order.priority)}
                    </td>
                    <td className="px-4 py-3">
                      {order.assignedTo ? (
                        <span className="text-sm text-gray-900">{order.assignedTo}</span>
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
                        <p className="text-sm text-gray-900">{order.date}</p>
                        <p className="text-xs text-gray-500">{order.time}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-gray-900">{order.amount}</span>
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
                        onClick={() => handleAssignStaff(staff.name)}
                        disabled={!staff.available}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          staff.available
                            ? 'border-gray-200 hover:border-blue-600 hover:bg-blue-50 cursor-pointer'
                            : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-bold text-sm">{staff.name.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{staff.name}</p>
                              <p className="text-xs text-gray-500">Nhân viên đăng kiểm</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
                              staff.available
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {staff.available ? '🟢 Rảnh' : '🔴 Bận'}
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
                    onChange={(e) => setEditStatus(e.target.value as 'waiting' | 'processing' | 'completed' | 'cancelled')}
                  >
                    <option value="waiting">Chờ xử lý</option>
                    <option value="processing">Đang xử lý</option>
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
                    onChange={(e) => setEditPriority(e.target.value as 'high' | 'normal' | 'low')}
                  >
                    <option value="high">Cao</option>
                    <option value="normal">Bình thường</option>
                    <option value="low">Thấp</option>
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
                    <p className="text-sm text-gray-900">{selectedOrder.customer}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Số điện thoại:</p>
                    <p className="text-sm text-gray-900">{selectedOrder.phone}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Biển số xe:</p>
                    <p className="text-sm text-gray-900 font-mono">{selectedOrder.vehicle}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Loại xe:</p>
                    <p className="text-sm text-gray-900">{selectedOrder.vehicleType}</p>
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
                    <p className="text-sm text-gray-900">{selectedOrder.assignedTo || 'Chưa phân công'}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Ngày:</p>
                    <p className="text-sm text-gray-900">{selectedOrder.date}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Giờ:</p>
                    <p className="text-sm text-gray-900">{selectedOrder.time}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Số tiền:</p>
                    <p className="text-sm text-gray-900 font-semibold">{selectedOrder.amount}</p>
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