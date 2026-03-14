import { useState } from 'react';
import { 
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Search,
  Filter,
  Eye,
  Check,
  X
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { toast } from 'sonner';

interface Payment {
  id: string;
  orderId: string;
  customer: string;
  amount: string;
  method: 'vietqr' | 'cash' | 'transfer';
  status: 'completed' | 'pending' | 'failed';
  date: string;
  time: string;
  vatRequested: boolean;
}

interface PendingFee {
  id: string;
  orderId: string;
  customer: string;
  description: string;
  amount: string;
  requestedBy: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function AdminFinanceScreen() {
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'fees' | 'vat'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPaymentDetailModal, setShowPaymentDetailModal] = useState(false);
  const [showVatDetailModal, setShowVatDetailModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Mock data
  const stats = [
    {
      label: 'Tổng doanh thu',
      value: '456.8M',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'green',
    },
    {
      label: 'Thanh toán VietQR',
      value: '389.2M',
      change: '+18.2%',
      trend: 'up',
      icon: TrendingUp,
      color: 'blue',
    },
    {
      label: 'Đã hoàn thành',
      value: '1,234',
      change: '+8.1%',
      trend: 'up',
      icon: CheckCircle2,
      color: 'purple',
    },
    {
      label: 'Chờ duyệt',
      value: '23',
      change: '-5.3%',
      trend: 'down',
      icon: Clock,
      color: 'orange',
    },
  ];

  const [payments, setPayments] = useState<Payment[]>([
    {
      id: 'PAY001',
      orderId: 'DK001',
      customer: 'Nguyễn Văn A',
      amount: '460.000đ',
      method: 'vietqr',
      status: 'completed',
      date: '28/01/2026',
      time: '08:45',
      vatRequested: true,
    },
    {
      id: 'PAY002',
      orderId: 'DK002',
      customer: 'Trần Thị B',
      amount: '520.000đ',
      method: 'vietqr',
      status: 'completed',
      date: '28/01/2026',
      time: '09:15',
      vatRequested: false,
    },
    {
      id: 'PAY003',
      orderId: 'DK003',
      customer: 'Lê Văn C',
      amount: '380.000đ',
      method: 'cash',
      status: 'pending',
      date: '28/01/2026',
      time: '10:30',
      vatRequested: false,
    },
  ]);

  const [pendingFees, setPendingFees] = useState<PendingFee[]>([
    {
      id: 'FEE001',
      orderId: 'DK004',
      customer: 'Phạm Thị D',
      description: 'Phí sửa chữa phanh khẩn cấp',
      amount: '250.000đ',
      requestedBy: 'Lê Văn C',
      date: '28/01/2026',
      status: 'pending',
    },
    {
      id: 'FEE002',
      orderId: 'DK005',
      customer: 'Hoàng Văn E',
      description: 'Phí thay lốp dự phòng',
      amount: '180.000đ',
      requestedBy: 'Nguyễn Văn F',
      date: '28/01/2026',
      status: 'pending',
    },
  ]);

  const vatRequests = payments.filter(p => p.vatRequested);

  const getPaymentMethodBadge = (method: string) => {
    const styles = {
      vietqr: 'bg-blue-100 text-blue-700',
      cash: 'bg-green-100 text-green-700',
      transfer: 'bg-purple-100 text-purple-700',
    };
    
    const labels = {
      vietqr: 'VietQR',
      cash: 'Tiền mặt',
      transfer: 'Chuyển khoản',
    };
    
    return (
      <span className={`px-2 py-1 ${styles[method as keyof typeof styles]} text-xs font-semibold rounded-full`}>
        {labels[method as keyof typeof labels]}
      </span>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-green-100 text-green-700',
      pending: 'bg-orange-100 text-orange-700',
      failed: 'bg-red-100 text-red-700',
    };
    
    const labels = {
      completed: 'Hoàn thành',
      pending: 'Chờ xử lý',
      failed: 'Thất bại',
    };
    
    return (
      <span className={`px-2 py-1 ${styles[status as keyof typeof styles]} text-xs font-semibold rounded-full`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const handleExportReport = () => {
    toast.info('Đang xuất báo cáo...');
    
    // Create CSV content
    const headers = ['Mã GD', 'Đơn hàng', 'Khách hàng', 'Số tiền', 'Phương thức', 'Trạng thái', 'Ngày', 'Giờ'];
    const csvContent = [
      headers.join(','),
      ...payments.map(p => [
        p.id,
        p.orderId,
        p.customer,
        p.amount,
        p.method,
        p.status,
        p.date,
        p.time
      ].join(','))
    ].join('\n');

    // Download file
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `bao-cao-tai-chinh-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast.success('Đã xuất báo cáo thành công');
  };

  const handleViewPaymentDetail = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowPaymentDetailModal(true);
  };

  const handleApproveFee = (feeId: string) => {
    setPendingFees(prevFees =>
      prevFees.map(f =>
        f.id === feeId
          ? { ...f, status: 'approved' as const }
          : f
      ).filter(f => f.status === 'pending') // Remove approved from list
    );
    
    const fee = pendingFees.find(f => f.id === feeId);
    toast.success(`Đã duyệt phí ${fee?.amount} cho đơn ${fee?.orderId}`);
  };

  const handleRejectFee = (feeId: string) => {
    setPendingFees(prevFees =>
      prevFees.map(f =>
        f.id === feeId
          ? { ...f, status: 'rejected' as const }
          : f
      ).filter(f => f.status === 'pending') // Remove rejected from list
    );
    
    const fee = pendingFees.find(f => f.id === feeId);
    toast.error(`Đã từ chối phí ${fee?.amount} cho đơn ${fee?.orderId}`);
  };

  const handleViewVatDetail = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowVatDetailModal(true);
  };

  const handleExportVat = (payment: Payment) => {
    toast.info(`Đang xuất hóa đơn VAT cho ${payment.id}...`);
    
    // Create VAT invoice content
    const vatContent = `
HOÁ ĐƠN GIÁ TRỊ GIA TĂNG
----------------------------------------
Mã giao dịch: ${payment.id}
Mã đơn hàng: ${payment.orderId}
Khách hàng: ${payment.customer}
Số tiền: ${payment.amount}
Phương thức: ${payment.method}
Ngày: ${payment.date} ${payment.time}
----------------------------------------
    `.trim();

    // Download file
    const blob = new Blob([vatContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `VAT-${payment.id}.txt`;
    link.click();
    
    toast.success(`Đã xuất hóa đơn VAT cho ${payment.id}`);
  };

  const handleExportAllVat = () => {
    toast.info('Đang xuất danh sách VAT...');
    
    // Create Excel-like CSV
    const headers = ['Mã GD', 'Đơn hàng', 'Khách hàng', 'Số tiền', 'Ngày'];
    const csvContent = [
      headers.join(','),
      ...vatRequests.map(p => [
        p.id,
        p.orderId,
        p.customer,
        p.amount,
        p.date
      ].join(','))
    ].join('\n');

    // Download file
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `danh-sach-VAT-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast.success('Đã xuất danh sách VAT thành công');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý tài chính</h1>
            <p className="text-gray-600 mt-1">Theo dõi doanh thu, thanh toán và hóa đơn</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportReport}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download size={18} />
              <span className="text-sm font-medium">Xuất báo cáo</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            
            const colorClasses = {
              green: { bg: 'bg-green-100', text: 'text-green-600' },
              blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
              purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
              orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
            };
            
            const colors = colorClasses[stat.color as keyof typeof colorClasses];
            
            return (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center`}>
                    <Icon size={24} className={colors.text} />
                  </div>
                  <span className={`text-xs font-semibold ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-3 text-sm font-semibold transition-colors ${
                  activeTab === 'overview'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Tổng quan
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`px-6 py-3 text-sm font-semibold transition-colors ${
                  activeTab === 'payments'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Thanh toán
              </button>
              <button
                onClick={() => setActiveTab('fees')}
                className={`px-6 py-3 text-sm font-semibold transition-colors relative ${
                  activeTab === 'fees'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Phí phát sinh
                {pendingFees.filter(f => f.status === 'pending').length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center z-[100] shadow-lg">
                    {pendingFees.filter(f => f.status === 'pending').length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('vat')}
                className={`px-6 py-3 text-sm font-semibold transition-colors relative ${
                  activeTab === 'vat'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Hóa đơn VAT
                {vatRequests.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center z-[100] shadow-lg">
                    {vatRequests.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-sm font-semibold text-blue-900 mb-4">Doanh thu theo phương thức</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-800">VietQR (Tự động)</span>
                        <span className="text-lg font-bold text-blue-900">389.2M</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-800">Tiền mặt</span>
                        <span className="text-lg font-bold text-blue-900">52.6M</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-800">Chuyển khoản</span>
                        <span className="text-lg font-bold text-blue-900">15.0M</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <h3 className="text-sm font-semibold text-green-900 mb-4">Thống kê hôm nay</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-800">Giao dịch hoàn thành</span>
                        <span className="text-lg font-bold text-green-900">45</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-800">Tổng doanh thu</span>
                        <span className="text-lg font-bold text-green-900">23.5M</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-800">Trung bình/đơn</span>
                        <span className="text-lg font-bold text-green-900">522K</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Tìm kiếm giao dịch..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                    <Filter size={18} />
                    Lọc
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Mã GD</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Đơn hàng</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Khách hàng</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Số tiền</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Phương thức</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Trạng thái</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Ngày/Giờ</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {payments
                        .filter(p => 
                          p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.orderId.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <span className="text-sm font-semibold text-gray-900">{payment.id}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-900">{payment.orderId}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-900">{payment.customer}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm font-bold text-gray-900">{payment.amount}</span>
                          </td>
                          <td className="px-4 py-3">
                            {getPaymentMethodBadge(payment.method)}
                          </td>
                          <td className="px-4 py-3">
                            {getPaymentStatusBadge(payment.status)}
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <p className="text-sm text-gray-900">{payment.date}</p>
                              <p className="text-xs text-gray-500">{payment.time}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleViewPaymentDetail(payment)}
                              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                            >
                              <Eye size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Fees Tab */}
            {activeTab === 'fees' && (
              <div className="space-y-4">
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200 mb-4">
                  <p className="text-sm text-orange-800">
                    <span className="font-semibold">{pendingFees.filter(f => f.status === 'pending').length}</span> khoản phí phát sinh đang chờ duyệt
                  </p>
                </div>

                <div className="space-y-3">
                  {pendingFees.filter(f => f.status === 'pending').map((fee) => (
                    <div key={fee.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold text-gray-900">{fee.id}</span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-sm text-gray-600">{fee.orderId}</span>
                          </div>
                          <p className="text-sm text-gray-900 mb-1">{fee.customer}</p>
                          <p className="text-sm text-gray-700 mb-2">{fee.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Yêu cầu bởi: {fee.requestedBy}</span>
                            <span>•</span>
                            <span>{fee.date}</span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-xl font-bold text-gray-900 mb-3">{fee.amount}</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApproveFee(fee.id)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-medium"
                            >
                              <Check size={14} />
                              Duyệt
                            </button>
                            <button
                              onClick={() => handleRejectFee(fee.id)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs font-medium"
                            >
                              <X size={14} />
                              Từ chối
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VAT Tab */}
            {activeTab === 'vat' && (
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4 flex items-center justify-between">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">{vatRequests.length}</span> yêu cầu xuất hóa đơn VAT
                  </p>
                  <button
                    onClick={handleExportAllVat}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Download size={16} />
                    Xuất Excel
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Mã GD</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Đơn hàng</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Khách hàng</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Số tiền</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Ngày</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {vatRequests.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <span className="text-sm font-semibold text-gray-900">{payment.id}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-900">{payment.orderId}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-900">{payment.customer}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm font-bold text-gray-900">{payment.amount}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-900">{payment.date}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleViewVatDetail(payment)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-xs font-medium"
                              >
                                <Eye size={14} />
                                Xem
                              </button>
                              <button
                                onClick={() => handleExportVat(payment)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-xs font-medium"
                              >
                                <FileText size={14} />
                                Xuất VAT
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Detail Modal */}
        {showPaymentDetailModal && selectedPayment && (
          <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Chi tiết giao dịch</h3>
                  <p className="text-sm text-gray-600 mt-1">{selectedPayment.id}</p>
                </div>
                <button
                  onClick={() => setShowPaymentDetailModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="px-6 py-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Mã giao dịch:</p>
                    <p className="text-sm text-gray-900 font-semibold">{selectedPayment.id}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Đơn hàng:</p>
                    <p className="text-sm text-gray-900">{selectedPayment.orderId}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Khách hàng:</p>
                    <p className="text-sm text-gray-900">{selectedPayment.customer}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Số tiền:</p>
                    <p className="text-lg font-bold text-gray-900">{selectedPayment.amount}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Phương thức:</p>
                    {getPaymentMethodBadge(selectedPayment.method)}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Trạng thái:</p>
                    {getPaymentStatusBadge(selectedPayment.status)}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Thời gian:</p>
                    <p className="text-sm text-gray-900">{selectedPayment.date} {selectedPayment.time}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Yêu cầu VAT:</p>
                    <p className="text-sm text-gray-900">{selectedPayment.vatRequested ? 'Có' : 'Không'}</p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowPaymentDetailModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VAT Detail Modal */}
        {showVatDetailModal && selectedPayment && (
          <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Chi tiết hóa đơn VAT</h3>
                  <p className="text-sm text-gray-600 mt-1">{selectedPayment.id}</p>
                </div>
                <button
                  onClick={() => setShowVatDetailModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="px-6 py-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Thông tin hóa đơn</h4>
                  <div className="space-y-2 text-sm text-blue-800">
                    <p>Mẫu số: 01GTKT0/001</p>
                    <p>Ký hiệu: AA/26E</p>
                    <p>Số hóa đơn: 0000123</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Khách hàng:</p>
                    <p className="text-sm text-gray-900 font-semibold">{selectedPayment.customer}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Tiền hàng:</p>
                    <p className="text-sm text-gray-900">{selectedPayment.amount}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Thuế VAT (10%):</p>
                    <p className="text-sm text-gray-900">46.000đ</p>
                  </div>
                  <div className="flex items-center justify-between border-t pt-4">
                    <p className="text-base font-bold text-gray-900">Tổng cộng:</p>
                    <p className="text-lg font-bold text-blue-600">506.000đ</p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowVatDetailModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Đóng
                </button>
                <button
                  onClick={() => {
                    handleExportVat(selectedPayment);
                    setShowVatDetailModal(false);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm flex items-center gap-2"
                >
                  <FileText size={16} />
                  Xuất hóa đơn
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}