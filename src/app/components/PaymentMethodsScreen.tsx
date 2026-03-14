import { ArrowLeft, CreditCard, Plus, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface PaymentMethodsScreenProps {
  onBack: () => void;
}

interface PaymentMethod {
  id: number;
  type: 'card' | 'bank' | 'wallet';
  name: string;
  number: string;
  isDefault: boolean;
}

export default function PaymentMethodsScreen({ onBack }: PaymentMethodsScreenProps) {
  const [showAddCard, setShowAddCard] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 1,
      type: 'card',
      name: 'Visa',
      number: '**** **** **** 1234',
      isDefault: true
    },
    {
      id: 2,
      type: 'bank',
      name: 'Vietcombank',
      number: '**** **** 5678',
      isDefault: false
    },
    {
      id: 3,
      type: 'wallet',
      name: 'MoMo',
      number: '0912345678',
      isDefault: false
    }
  ]);

  const [formData, setFormData] = useState({
    type: 'card' as 'card' | 'bank' | 'wallet',
    name: '',
    number: ''
  });

  const handleAddPayment = () => {
    if (!formData.name || !formData.number) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const newMethod: PaymentMethod = {
      id: paymentMethods.length + 1,
      type: formData.type,
      name: formData.name,
      number: formData.number,
      isDefault: false
    };

    setPaymentMethods([...paymentMethods, newMethod]);
    setShowAddCard(false);
    setFormData({ type: 'card', name: '', number: '' });
    toast.success('Thêm phương thức thanh toán thành công!');
  };

  const handleSetDefault = (id: number) => {
    setPaymentMethods(paymentMethods.map(pm => ({
      ...pm,
      isDefault: pm.id === id
    })));
    toast.success('Đã đặt phương thức thanh toán mặc định!');
  };

  const handleDelete = (id: number) => {
    if (confirm('Bạn có chắc muốn xóa phương thức thanh toán này?')) {
      setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
      toast.success('Xóa phương thức thanh toán thành công!');
    }
  };

  // Add Payment Method Form
  if (showAddCard) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Modern Header với Decorative Patterns */}
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
                setShowAddCard(false);
                setFormData({ type: 'card', name: '', number: '' });
              }}
              className="flex items-center gap-2 text-gray-600 mb-3 -ml-1 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} strokeWidth={2.5} />
              <span className="text-sm font-semibold">Quay lại</span>
            </button>
            <h1 className="text-gray-900 font-bold text-xl tracking-tight mb-1">Thêm phương thức</h1>
            <p className="text-gray-500 text-xs">Nhập thông tin thanh toán</p>
          </div>
        </div>

        <div className="px-5 -mt-6 relative z-20">
          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold text-sm mb-2">
                  Loại thanh toán *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                >
                  <option value="card">Thẻ tín dụng/ghi nợ</option>
                  <option value="bank">Tài khoản ngân hàng</option>
                  <option value="wallet">Ví điện tử</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold text-sm mb-2">
                  Tên thẻ/Ngân hàng/Ví *
                </label>
                <input
                  type="text"
                  placeholder="VD: Visa, Vietcombank, MoMo"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold text-sm mb-2">
                  Số thẻ/Số tài khoản *
                </label>
                <input
                  type="text"
                  placeholder="VD: 1234 5678 9012 3456"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                />
              </div>

              <button
                onClick={handleAddPayment}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
              >
                Thêm phương thức
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Modern Header với Decorative Patterns */}
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
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 mb-3 -ml-1 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
            <span className="text-sm font-semibold">Quay lại</span>
          </button>
          <h1 className="text-gray-900 font-bold text-xl tracking-tight mb-1">Phương thức thanh toán</h1>
          <p className="text-gray-500 text-xs">Quản lý thẻ và ví điện tử</p>
        </div>
      </div>

      <div className="px-5 py-5">
        {/* Add Button */}
        <button
          onClick={() => setShowAddCard(true)}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 mb-5 shadow-md hover:bg-blue-700 transition-all duration-200 active:scale-[0.98]"
        >
          <Plus size={20} strokeWidth={2.5} />
          Thêm phương thức mới
        </button>

        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    method.type === 'card' ? 'bg-blue-100' : 
                    method.type === 'bank' ? 'bg-green-100' : 'bg-purple-100'
                  }`}>
                    <CreditCard className={
                      method.type === 'card' ? 'text-blue-600' : 
                      method.type === 'bank' ? 'text-green-600' : 'text-purple-600'
                    } size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-gray-900 font-bold text-sm">{method.name}</p>
                      {method.isDefault && (
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-lg text-xs font-semibold flex items-center gap-1">
                          <CheckCircle size={12} />
                          Mặc định
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs mt-1">{method.number}</p>
                    <div className="flex gap-3 mt-2">
                      {!method.isDefault && (
                        <button 
                          onClick={() => handleSetDefault(method.id)}
                          className="text-blue-600 text-xs font-semibold transition-all duration-200 active:scale-95"
                        >
                          Đặt mặc định
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(method.id)}
                        className="text-red-600 text-xs font-semibold transition-all duration-200 active:scale-95"
                      >
                        Xóa
                      </button>
                    </div>
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