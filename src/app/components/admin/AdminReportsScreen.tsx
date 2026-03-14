import { useState } from 'react';
import { 
  Download,
  Calendar,
  TrendingUp,
  FileText,
  BarChart3,
  X
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { toast } from 'sonner';

export default function AdminReportsScreen() {
  const [showDateModal, setShowDateModal] = useState(false);
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-06-30');
  const [displayDateRange, setDisplayDateRange] = useState('01/01/2024 - 30/06/2024');

  const revenueData = [
    { month: 'T1', revenue: 320, orders: 245 },
    { month: 'T2', revenue: 380, orders: 298 },
    { month: 'T3', revenue: 420, orders: 356 },
    { month: 'T4', revenue: 390, orders: 312 },
    { month: 'T5', revenue: 480, orders: 401 },
    { month: 'T6', revenue: 520, orders: 445 },
  ];

  const staffPerformance = [
    { name: 'Lê Văn C', completed: 145 },
    { name: 'Nguyễn Văn E', completed: 132 },
    { name: 'Trần Văn H', completed: 118 },
    { name: 'Phạm Thị I', completed: 95 },
    { name: 'Hoàng Văn K', completed: 87 },
  ];

  const serviceData = [
    { name: 'Ô tô con', value: 720, color: '#3b82f6' },
    { name: 'Xe máy', value: 345, color: '#10b981' },
    { name: 'Xe tải', value: 169, color: '#f59e0b' },
    { name: 'Xe khách', value: 89, color: '#8b5cf6' },
  ];

  const handleApplyDateRange = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      toast.error('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
      return;
    }
    
    setDisplayDateRange(`${start.toLocaleDateString('vi-VN')} - ${end.toLocaleDateString('vi-VN')}`);
    setShowDateModal(false);
    toast.success(`Đã áp dụng khoảng thời gian: ${start.toLocaleDateString('vi-VN')} - ${end.toLocaleDateString('vi-VN')}`);
  };

  const handleExportReport = () => {
    toast.info('Đang tạo báo cáo...');
    
    // Create comprehensive report data
    const reportData = [
      ['BÁO CÁO HOẠT ĐỘNG ĐĂNG KIỂM'],
      [`Khoảng thời gian: ${displayDateRange}`],
      [''],
      ['I. THỐNG KÊ TỔNG QUAN'],
      ['Doanh thu tháng này', '520,000,000 VNĐ', '+12.5%'],
      ['Đơn hàng hoàn thành', '445', '+8.2%'],
      ['Đánh giá trung bình', '4.8/5.0', '96.5%'],
      [''],
      ['II. DOANH THU 6 THÁNG'],
      ['Tháng', 'Doanh thu (M VNĐ)', 'Số đơn hàng'],
      ...revenueData.map(item => [item.month, item.revenue, item.orders]),
      [''],
      ['III. PHÂN BỔ LOẠI XE'],
      ['Loại xe', 'Số lượng', 'Tỷ lệ'],
      ...serviceData.map(item => {
        const total = serviceData.reduce((sum, s) => sum + s.value, 0);
        const percentage = ((item.value / total) * 100).toFixed(1);
        return [item.name, item.value, `${percentage}%`];
      }),
      [''],
      ['IV. HIỆU SUẤT NHÂN VIÊN'],
      ['Nhân viên', 'Đơn hoàn thành'],
      ...staffPerformance.map(item => [item.name, item.completed]),
      [''],
      [`Báo cáo được tạo ngày: ${new Date().toLocaleDateString('vi-VN')}`]
    ];

    // Create CSV
    const csvContent = reportData.map(row => row.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `bao-cao-hoat-dong-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast.success('Đã xuất báo cáo thành công');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Báo cáo & Thống kê</h1>
            <p className="text-gray-600 mt-1">Phân tích dữ liệu và export báo cáo</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowDateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Calendar size={18} />
              <span className="text-sm font-medium">Chọn khoảng thời gian</span>
            </button>
            <button 
              onClick={handleExportReport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
            >
              <Download size={18} />
              <span className="text-sm font-medium">Xuất báo cáo</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <TrendingUp size={24} />
              </div>
              <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                +12.5%
              </span>
            </div>
            <h3 className="text-3xl font-bold mb-1">520M VNĐ</h3>
            <p className="text-blue-100">Doanh thu tháng này</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <FileText size={24} />
              </div>
              <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                +8.2%
              </span>
            </div>
            <h3 className="text-3xl font-bold mb-1">445</h3>
            <p className="text-green-100">Đơn hàng hoàn thành</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <BarChart3 size={24} />
              </div>
              <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                96.5%
              </span>
            </div>
            <h3 className="text-3xl font-bold mb-1">4.8/5.0</h3>
            <p className="text-purple-100">Đánh giá trung bình</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Doanh thu 6 tháng</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 5 }}
                  name="Doanh thu (M)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Service Distribution */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Phân bổ loại xe</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {serviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {serviceData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <div>
                    <p className="text-xs text-gray-600">{item.name}</p>
                    <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Staff Performance */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Hiệu suất nhân viên</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={staffPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="completed" fill="#10b981" radius={[8, 8, 0, 0]} name="Đơn hoàn thành" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Date Modal */}
      {showDateModal && (
        <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Chọn khoảng thời gian</h3>
              <button 
                onClick={() => setShowDateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowDateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                Hủy
              </button>
              <button 
                onClick={handleApplyDateRange}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}