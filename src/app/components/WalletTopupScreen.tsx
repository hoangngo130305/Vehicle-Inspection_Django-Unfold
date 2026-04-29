import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft,
  CreditCard,
  CheckCircle2,
  Plus,
  Banknote,
  ShieldCheck,
  Copy,
  Clock,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { paymentAPI, type CreatePaymentResponse } from '../../lib/api';

const QUICK_AMOUNTS = [100000, 200000, 500000, 1000000, 2000000, 5000000];

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  details: string;
  backendMethod: 'cash' | 'bank_transfer' | 'vietqr' | 'momo' | 'zalopay' | 'vnpay';
}

type TopupStep = 'input' | 'qr' | 'success';

export default function WalletTopupScreen() {
  const navigate = useNavigate();

  const [step, setStep] = useState<TopupStep>('input');
  const [amount, setAmount] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<string>('vnpay');
  const [isCreating, setIsCreating] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [countdown, setCountdown] = useState(600);
  const [paymentSession, setPaymentSession] = useState<CreatePaymentResponse | null>(null);
  const [latestStatus, setLatestStatus] = useState<'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'REFUNDED'>('PENDING');

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'vnpay',
      name: 'VNPAY-QR (PayOS)',
      icon: '🏧',
      details: 'Quét mã PayOS tự động',
      backendMethod: 'vnpay',
    },
    {
      id: 'visa',
      name: 'Visa/Mastercard',
      icon: '💳',
      details: 'Thanh toán qua cổng PayOS',
      backendMethod: 'bank_transfer',
    },
    {
      id: 'momo',
      name: 'Ví MoMo',
      icon: '🍑',
      details: 'Chuyển qua PayOS',
      backendMethod: 'momo',
    },
    {
      id: 'bank',
      name: 'Chuyển khoản ngân hàng',
      icon: '🏦',
      details: 'Nội dung chuẩn PayOS',
      backendMethod: 'bank_transfer',
    },
  ];

  const selectedMethodData = useMemo(
    () => paymentMethods.find((m) => m.id === selectedMethod) || paymentMethods[0],
    [paymentMethods, selectedMethod],
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAmountChange = (val: string) => {
    const cleanVal = val.replace(/\D/g, '');
    setAmount(cleanVal);
  };

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`Đã sao chép ${label}`);
    } catch {
      toast.error('Không thể sao chép');
    }
  };

  const checkPaymentStatus = async (silent = false) => {
    if (!paymentSession?.orderCode) return;

    if (!silent) {
      setIsChecking(true);
    }

    try {
      const result = await paymentAPI.checkPaymentStatus(paymentSession.orderCode);
      setLatestStatus(result.status);

      if (result.status === 'SUCCESS') {
        setStep('success');
        toast.success('Nạp tiền thành công! Ví đã đồng bộ từ PayOS.');
        return;
      }

      if (!silent && result.status !== 'PENDING') {
        toast.error(result.message || 'Giao dịch chưa thành công');
      }
    } catch (error: any) {
      if (!silent) {
        toast.error(error?.message || 'Không kiểm tra được trạng thái giao dịch');
      }
    } finally {
      if (!silent) {
        setIsChecking(false);
      }
    }
  };

  const handleTopupAction = async () => {
    const numAmount = parseInt(amount, 10);

    if (!amount || Number.isNaN(numAmount) || numAmount < 10000) {
      toast.error('Số tiền nạp tối thiểu là 10.000đ');
      return;
    }

    try {
      setIsCreating(true);

      const session = await paymentAPI.createPaymentSession({
        amount: numAmount,
        method: 'QR',
        payment_target: 'wallet_topup',
        payment_method: selectedMethodData.backendMethod,
        description: `Nap vi ${numAmount} VND`,
      });

      setPaymentSession(session);
      setLatestStatus(session.status || 'PENDING');
      setCountdown(600);
      setStep('qr');
      toast.success('Đã tạo mã thanh toán PayOS');
    } catch (error: any) {
      toast.error(error?.message || 'Không thể tạo giao dịch nạp ví');
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    if (step !== 'qr' || !paymentSession) return;

    const countdownTimer = window.setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    const pollTimer = window.setInterval(() => {
      void checkPaymentStatus(true);
    }, 5000);

    return () => {
      window.clearInterval(countdownTimer);
      window.clearInterval(pollTimer);
    };
  }, [step, paymentSession]);

  useEffect(() => {
    if (countdown === 0 && step === 'qr') {
      toast.error('Mã thanh toán đã hết hạn, vui lòng tạo lại giao dịch');
    }
  }, [countdown, step]);

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-500/20">
          <CheckCircle2 size={48} className="text-green-600" strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Giao dịch thành công!</h2>
        <p className="text-gray-500 mb-8 max-w-xs">
          Bạn vừa nạp <span className="font-bold text-blue-600">{parseInt(amount || '0', 10).toLocaleString('vi-VN')}đ</span> vào ví thành công.
        </p>

        <div className="bg-gray-50 rounded-2xl p-5 w-full space-y-3 mb-8 border border-gray-100">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 font-medium">Mã đơn PayOS</span>
            <span className="text-gray-900 font-bold">#{paymentSession?.orderCode}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 font-medium">Thời gian</span>
            <span className="text-gray-900 font-bold">{new Date().toLocaleTimeString('vi-VN')} - {new Date().toLocaleDateString('vi-VN')}</span>
          </div>
          <div className="h-px bg-gray-200"></div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium text-sm">Phương thức</span>
            <span className="text-gray-900 font-bold text-sm">{selectedMethodData.name}</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/wallet')}
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-base shadow-xl shadow-blue-600/20 active:scale-95 transition-all"
        >
          Quay lại ví
        </button>
      </div>
    );
  }

  if (step === 'qr' && paymentSession) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-white px-5 pt-12 pb-6 border-b border-gray-100 flex items-center justify-between sticky top-0 z-40">
          <button onClick={() => setStep('input')} className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-gray-900 font-bold text-lg">Quét mã thanh toán</h1>
          <div className="w-10" />
        </div>

        <div className="p-5 flex flex-col items-center">
          <div className="mb-6 text-center">
            <p className="text-gray-500 text-xs font-medium mb-1">Số tiền cần nạp</p>
            <h2 className="text-3xl font-black text-blue-600">{parseInt(amount || '0', 10).toLocaleString('vi-VN')}đ</h2>
          </div>

          <div className="relative bg-white p-6 rounded-[2.5rem] shadow-2xl border border-gray-50 mb-6 group">
            <div className="absolute inset-0 bg-blue-600/5 rounded-[2.5rem] scale-110 blur-2xl -z-10 group-hover:bg-blue-600/10 transition-colors" />
            <div className="bg-gray-50 p-4 rounded-2xl mb-4 border border-blue-100">
              <img
                src={paymentSession.qrImageUrl}
                alt="PayOS QR"
                className="w-56 h-56 rounded-lg shadow-inner"
              />
            </div>

            <div className="flex items-center justify-center gap-2 text-orange-600 font-bold text-sm bg-orange-50 py-2 rounded-xl border border-orange-100 mb-2">
              <Clock size={16} />
              <span>Hết hạn sau: {formatTime(countdown)}</span>
            </div>
          </div>

          <div className="w-full bg-blue-50 rounded-3xl p-5 space-y-4 border border-blue-100 mb-4">
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1">
                <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest mb-1">Mã đơn PayOS</p>
                <p className="text-gray-900 font-bold text-lg break-all">{paymentSession.orderCode}</p>
              </div>
              <button
                onClick={() => handleCopy(String(paymentSession.orderCode), 'mã đơn')}
                className="p-2 bg-blue-100 rounded-lg text-blue-600 active:bg-blue-600 active:text-white transition-all"
              >
                <Copy size={18} />
              </button>
            </div>

            {paymentSession.qrCode && (
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest mb-1">QR Payload</p>
                  <p className="text-gray-700 text-xs break-all">{paymentSession.qrCode}</p>
                </div>
                <button
                  onClick={() => handleCopy(paymentSession.qrCode, 'QR payload')}
                  className="p-2 bg-blue-100 rounded-lg text-blue-600 active:bg-blue-600 active:text-white transition-all"
                >
                  <Copy size={18} />
                </button>
              </div>
            )}

            <button
              onClick={() => window.open(paymentSession.checkoutUrl, '_blank', 'noopener,noreferrer')}
              className="w-full bg-indigo-600 text-white py-3 rounded-2xl font-bold text-sm shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Mở trang thanh toán
              <ExternalLink size={16} />
            </button>
          </div>

          <div className="w-full space-y-3">
            <div className="bg-green-50 text-green-700 px-4 py-3 rounded-2xl flex items-center gap-3 border border-green-100">
              <RefreshCw size={18} className="animate-spin" />
              <p className="text-xs font-bold">Hệ thống đang tự động kiểm tra giao dịch từ PayOS...</p>
            </div>

            <div className="text-center text-xs font-semibold text-gray-500">
              Trạng thái hiện tại: <span className="text-blue-600">{latestStatus}</span>
            </div>

            <button
              onClick={() => void checkPaymentStatus(false)}
              disabled={isChecking}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-base shadow-xl shadow-blue-600/20 active:scale-95 transition-all disabled:opacity-60"
            >
              {isChecking ? 'Đang kiểm tra...' : 'Tôi đã thanh toán'}
            </button>

            <p className="text-[10px] text-gray-400 text-center px-4 leading-relaxed">
              Nếu thanh toán thành công, số dư ví sẽ tự đồng bộ theo PayOS.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white px-5 pt-12 pb-6 rounded-b-[2rem] shadow-md border-b border-gray-100 sticky top-0 z-40 overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 opacity-[0.04]">
            <div className="absolute top-6 right-8 w-24 h-24 border-2 border-gray-900 rounded-full"></div>
            <div className="absolute top-10 right-24 w-16 h-16 border-2 border-gray-900 rounded-full"></div>
            <div className="absolute bottom-2 left-6 w-28 h-28 border-2 border-gray-900 rounded-full"></div>
          </div>

          <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={20} strokeWidth={2.5} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-gray-900 font-bold text-xl tracking-tight">Nạp tiền vào ví</h1>
            <p className="text-gray-500 text-xs">Nạp tiền qua PayOS và đồng bộ vào ví</p>
          </div>
        </div>
        </div>
      </div>

      <div className="p-5 space-y-6">
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-gray-900 font-bold text-sm flex items-center gap-2">
              <Banknote size={18} className="text-blue-600" />
              Chọn số tiền cần nạp
            </h3>
            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase">đơn vị VNĐ</span>
          </div>

          <div className="relative">
            <input
              type="text"
              value={amount ? parseInt(amount, 10).toLocaleString('vi-VN') : ''}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="Nhập số tiền nạp"
              className="w-full bg-white border-2 border-transparent focus:border-blue-600 rounded-3xl py-6 px-8 text-3xl font-bold text-gray-900 text-center shadow-xl shadow-black/[0.03] transition-all outline-none"
            />
            {!amount && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <span className="text-3xl font-bold">0đ</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            {QUICK_AMOUNTS.map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(amt.toString())}
                className={`py-3 rounded-2xl text-xs font-bold transition-all active:scale-95 ${
                  amount === amt.toString()
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-white text-gray-600 border border-gray-100 hover:border-blue-200'
                }`}
              >
                {(amt / 1000).toLocaleString('vi-VN')}k
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-gray-900 font-bold text-sm px-1 flex items-center gap-2">
            <CreditCard size={18} className="text-blue-600" />
            Phương thức thanh toán
          </h3>
          <div className="space-y-2.5">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border-2 active:scale-[0.99] ${
                  selectedMethod === method.id
                    ? 'border-blue-600 bg-blue-50 shadow-md'
                    : 'border-white bg-white hover:border-gray-100'
                }`}
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm">
                  {method.icon}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-gray-900 font-bold text-sm">{method.name}</p>
                  <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">{method.details}</p>
                </div>
                {selectedMethod === method.id ? (
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={16} className="text-white" strokeWidth={3} />
                  </div>
                ) : (
                  <div className="w-6 h-6 border-2 border-gray-100 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </section>

        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-3 border border-gray-200/50">
          <ShieldCheck size={24} className="text-green-600" />
          <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
            Mọi giao dịch sẽ được xử lý bởi PayOS và ví của bạn được đồng bộ tự động khi thanh toán thành công.
          </p>
        </div>

        <button
          onClick={() => void handleTopupAction()}
          disabled={isCreating}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-blue-600/30 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <Plus size={20} strokeWidth={2.5} />
          {isCreating ? 'Đang tạo giao dịch...' : 'Xác nhận nạp tiền'}
        </button>
      </div>
    </div>
  );
}
