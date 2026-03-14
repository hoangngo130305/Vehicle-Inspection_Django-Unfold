import { ArrowLeft, Download, Share2, FileText, Check, MapPin, Calendar, Clock, Car, DollarSign, Receipt } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router';
import { useState } from 'react';

export default function InvoiceScreen() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [showVATForm, setShowVATForm] = useState(false);
  const [vatInfo, setVatInfo] = useState({
    companyName: '',
    taxCode: '',
    companyAddress: '',
    companyEmail: '',
  });

  // Mock invoice data based on orderId
  const invoiceData = {
    invoiceNumber: `INV-${orderId}-2026`,
    bookingCode: orderId || 'DK001',
    date: '29/01/2026',
    customerName: 'Nguyễn Văn Nam',
    customerPhone: '0901234567',
    customerEmail: 'nam.nguyen@email.com',
    licensePlate: '51F-12345',
    vehicleType: 'Ô tô con 5 chỗ',
    center: 'Trung tâm Đăng kiểm 5001D',
    centerAddress: '123 Nguyễn Trãi, Q.1, TP.HCM',
    inspectionDate: '29/01/2026',
    inspectionTime: '09:00 - 10:00',
    items: [
      {
        id: '1',
        description: 'Phí đăng kiểm xe ô tô con',
        quantity: 1,
        unitPrice: 340000,
        amount: 340000,
      },
      {
        id: '2',
        description: 'Phí kiểm tra khí thải',
        quantity: 1,
        unitPrice: 50000,
        amount: 50000,
      },
      {
        id: '3',
        description: 'Tem đăng kiểm',
        quantity: 1,
        unitPrice: 120000,
        amount: 120000,
      },
    ],
    subtotal: 510000,
    tax: 51000,
    discount: 0,
    total: 561000,
    paymentMethod: 'VietQR',
    paymentStatus: 'paid' as const,
    paidAt: '29/01/2026 09:15',
  };

  const handleDownloadPDF = () => {
    toast.success('Đang tải hóa đơn PDF...');
    // Mock download
    setTimeout(() => {
      toast.success('Tải thành công! Hóa đơn đã được lưu vào thiết bị.');
    }, 1500);
  };

  const handleShare = () => {
    toast.success('Chia sẻ hóa đơn qua email/SMS...');
    // Mock share
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRequestVATInvoice = () => {
    if (!vatInfo.companyName || !vatInfo.taxCode || !vatInfo.companyAddress) {
      toast.error('Vui lòng điền đầy đủ thông tin công ty');
      return;
    }

    // Mock request
    toast.success('Đã gửi yêu cầu xuất hóa đơn VAT!');
    toast.info('Hóa đơn điện tử sẽ được gửi qua email trong 24h');
    setShowVATForm(false);
    setVatInfo({
      companyName: '',
      taxCode: '',
      companyAddress: '',
      companyEmail: '',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-5 pt-10 pb-6 rounded-b-[2rem] shadow-md border-b border-gray-100 relative overflow-hidden sticky top-0 z-40">
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute top-6 right-8 w-24 h-24 border-2 border-gray-900 rounded-full"></div>
          <div className="absolute top-10 right-24 w-16 h-16 border-2 border-gray-900 rounded-full"></div>
          <div className="absolute bottom-2 left-6 w-28 h-28 border-2 border-gray-900 rounded-full"></div>
        </div>
        
        <div className="relative z-10">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 mb-3 -ml-1 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
            <span className="text-sm font-semibold">Quay lại</span>
          </button>
          <h1 className="text-gray-900 font-bold text-xl tracking-tight mb-1">Hóa đơn</h1>
          <p className="text-gray-500 text-xs">Chi tiết thanh toán dịch vụ</p>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-5">
        {/* Invoice Header */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 shadow-lg shadow-blue-600/20 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-blue-100 text-xs mb-1 font-medium">Số hóa đơn</p>
              <p className="font-bold text-lg">{invoiceData.invoiceNumber}</p>
            </div>
            <div className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
              invoiceData.paymentStatus === 'paid'
                ? 'bg-green-500 text-white'
                : 'bg-yellow-500 text-white'
            }`}>
              {invoiceData.paymentStatus === 'paid' ? '✓ Đã thanh toán' : '⏳ Chờ thanh toán'}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-blue-100 mb-1">Ngày lập</p>
              <p className="font-bold">{invoiceData.date}</p>
            </div>
            <div>
              <p className="text-blue-100 mb-1">Mã đặt lịch</p>
              <p className="font-bold">{invoiceData.bookingCode}</p>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <FileText className="text-purple-600" size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold text-sm">Thông tin khách hàng</h3>
              <p className="text-gray-500 text-xs">Người nhận dịch vụ</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Họ tên</span>
              <span className="text-gray-900 font-bold">{invoiceData.customerName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Số điện thoại</span>
              <span className="text-gray-900 font-bold">{invoiceData.customerPhone}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Email</span>
              <span className="text-gray-900 font-bold">{invoiceData.customerEmail}</span>
            </div>
          </div>
        </div>

        {/* Vehicle & Service Info */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Car className="text-orange-600" size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold text-sm">Thông tin xe & dịch vụ</h3>
              <p className="text-gray-500 text-xs">Chi tiết đăng kiểm</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
              <Car className="text-gray-400 mt-0.5" size={16} strokeWidth={2.5} />
              <div className="flex-1">
                <p className="text-gray-500 text-xs mb-1">Phương tiện</p>
                <p className="text-gray-900 font-bold text-sm">{invoiceData.licensePlate} - {invoiceData.vehicleType}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
              <MapPin className="text-gray-400 mt-0.5" size={16} strokeWidth={2.5} />
              <div className="flex-1">
                <p className="text-gray-500 text-xs mb-1">Trung tâm</p>
                <p className="text-gray-900 font-bold text-sm">{invoiceData.center}</p>
                <p className="text-gray-600 text-xs mt-1">{invoiceData.centerAddress}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl">
                <Calendar className="text-gray-400 mt-0.5" size={16} strokeWidth={2.5} />
                <div>
                  <p className="text-gray-500 text-xs mb-1">Ngày</p>
                  <p className="text-gray-900 font-bold text-sm">{invoiceData.inspectionDate}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl">
                <Clock className="text-gray-400 mt-0.5" size={16} strokeWidth={2.5} />
                <div>
                  <p className="text-gray-500 text-xs mb-1">Giờ</p>
                  <p className="text-gray-900 font-bold text-sm">{invoiceData.inspectionTime}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="text-green-600" size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold text-sm">Chi tiết thanh toán</h3>
              <p className="text-gray-500 text-xs">Các khoản phí dịch vụ</p>
            </div>
          </div>

          <div className="space-y-3">
            {invoiceData.items.map((item) => (
              <div key={item.id} className="flex justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <p className="text-gray-900 font-medium text-sm mb-1">{item.description}</p>
                  <p className="text-gray-500 text-xs">
                    {item.quantity} x {item.unitPrice.toLocaleString('vi-VN')}đ
                  </p>
                </div>
                <p className="text-gray-900 font-bold text-sm">{item.amount.toLocaleString('vi-VN')}đ</p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t-2 border-gray-200 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tạm tính</span>
              <span className="text-gray-900 font-medium">{invoiceData.subtotal.toLocaleString('vi-VN')}đ</span>
            </div>
            
            {invoiceData.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Giảm giá</span>
                <span className="text-green-600 font-medium">-{invoiceData.discount.toLocaleString('vi-VN')}đ</span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">VAT (10%)</span>
              <span className="text-gray-900 font-medium">{invoiceData.tax.toLocaleString('vi-VN')}đ</span>
            </div>

            <div className="flex justify-between py-3 mt-2 bg-gradient-to-r from-green-50 to-green-100 rounded-xl px-4">
              <span className="text-green-900 font-bold">Tổng cộng</span>
              <span className="text-green-900 font-bold text-lg">{invoiceData.total.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Check className="text-green-600" size={20} strokeWidth={2.5} />
            <h3 className="text-gray-900 font-bold text-sm">Phương thức thanh toán</h3>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Phương thức</span>
              <span className="text-gray-900 font-bold">{invoiceData.paymentMethod}</span>
            </div>
            {invoiceData.paidAt && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Thanh toán lúc</span>
                <span className="text-gray-900 font-bold">{invoiceData.paidAt}</span>
              </div>
            )}
          </div>
        </div>

        {/* Invoice Type Info */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
              <Receipt className="text-blue-600" size={20} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h3 className="text-gray-900 font-bold text-sm mb-2">📋 Thông tin hóa đơn</h3>
              <div className="space-y-2 text-xs leading-relaxed">
                <p className="text-gray-700">
                  <strong className="text-blue-700">🧾 Hóa đơn hiện tại:</strong> Đây là hóa đơn thanh toán thông thường (có bao gồm VAT 10% trong tổng tiền).
                </p>
                <p className="text-gray-700">
                  <strong className="text-purple-700">🏢 Hóa đơn VAT điện tử:</strong> Nếu bạn cần xuất hóa đơn VAT đỏ cho công ty, vui lòng click nút bên dưới và điền thông tin công ty.
                </p>
                <p className="text-gray-600">
                  <strong>Lưu ý:</strong> Hóa đơn VAT chỉ được xuất cho doanh nghiệp có MST hợp lệ.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleDownloadPDF}
            className="py-3.5 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all active:scale-95 font-bold text-sm flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20"
          >
            <Download size={18} strokeWidth={2.5} />
            Tải PDF
          </button>
          <button
            onClick={handleShare}
            className="py-3.5 px-4 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all active:scale-95 font-bold text-sm flex items-center justify-center gap-2"
          >
            <Share2 size={18} strokeWidth={2.5} />
            Chia sẻ
          </button>
        </div>

        <button
          onClick={handlePrint}
          className="w-full py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all active:scale-95 font-bold text-sm flex items-center justify-center gap-2"
        >
          <FileText size={18} strokeWidth={2.5} />
          In hóa đơn
        </button>

        {/* VAT Invoice Request Button */}
        <button
          onClick={() => setShowVATForm(!showVATForm)}
          className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all active:scale-95 font-bold text-sm flex items-center justify-center gap-2 shadow-sm shadow-purple-600/20"
        >
          <Receipt size={18} strokeWidth={2.5} />
          {showVATForm ? 'Đóng form xuất hóa đơn VAT' : 'Yêu cầu xuất hóa đơn VAT'}
        </button>

        {/* VAT Invoice Form */}
        {showVATForm && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border-2 border-purple-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Receipt className="text-purple-600" size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-gray-900 font-bold text-sm">Thông tin xuất hóa đơn VAT</h3>
                <p className="text-gray-500 text-xs">Hóa đơn điện tử sẽ gửi qua email</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên công ty <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={vatInfo.companyName}
                  onChange={(e) => setVatInfo({ ...vatInfo, companyName: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
                  placeholder="Nhập tên công ty"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mã số thuế <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={vatInfo.taxCode}
                  onChange={(e) => setVatInfo({ ...vatInfo, taxCode: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
                  placeholder="Nhập mã số thuế"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Địa chỉ công ty <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={vatInfo.companyAddress}
                  onChange={(e) => setVatInfo({ ...vatInfo, companyAddress: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
                  placeholder="Nhập địa chỉ công ty"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email nhận hóa đơn
                </label>
                <input
                  type="email"
                  value={vatInfo.companyEmail}
                  onChange={(e) => setVatInfo({ ...vatInfo, companyEmail: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
                  placeholder="Nhập email (mặc định dùng email khách hàng)"
                />
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-xl p-3">
                <p className="text-purple-800 text-xs leading-relaxed">
                  <strong>Lưu ý:</strong> Hóa đơn VAT điện tử sẽ được gửi đến email của bạn trong vòng 24 giờ sau khi xác nhận.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowVATForm(false);
                    setVatInfo({
                      companyName: '',
                      taxCode: '',
                      companyAddress: '',
                      companyEmail: '',
                    });
                  }}
                  className="py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all active:scale-95 font-bold text-sm"
                >
                  Hủy
                </button>
                <button
                  onClick={handleRequestVATInvoice}
                  className="py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all active:scale-95 font-bold text-sm"
                >
                  Gửi yêu cầu
                </button>
              </div>
            </div>
          </div>
        )}

        <p className="text-gray-400 text-xs text-center">
          Hóa đơn được lập ngày {invoiceData.date}
          <br />
          Cảm ơn quý khách đã sử dụng dịch vụ!
        </p>
      </div>
    </div>
  );
}