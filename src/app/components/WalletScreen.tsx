import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Plus, History, CreditCard, ChevronRight, TrendingUp, TrendingDown, Wallet, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { walletAPI, type WalletStatementTransaction } from '../../lib/api';

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'in' | 'out';
  time: string;
  status: 'success' | 'pending' | 'failed';
}

export default function WalletScreen() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatDisplayTime = (value?: string | null) => {
    if (!value) return 'Vừa xong';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Vừa xong';
    return `${date.toLocaleTimeString('vi-VN')} - ${date.toLocaleDateString('vi-VN')}`;
  };

  const mapTransaction = (tx: WalletStatementTransaction): Transaction => {
    const amount = Number(tx.amount || 0);
    const status = tx.status === 'SUCCESS' ? 'success' : tx.status === 'PENDING' ? 'pending' : 'failed';
    const title = tx.payment_type === 'wallet_topup'
      ? `Nạp tiền ví${tx.order_code ? ` #${tx.order_code}` : ''}`
      : (tx.description || 'Giao dịch ví');

    return {
      id: String(tx.payment_id),
      title,
      amount: Math.abs(Number.isNaN(amount) ? 0 : amount),
      type: tx.payment_type === 'wallet_topup' ? 'in' : 'out',
      time: formatDisplayTime(tx.paid_at || tx.created_at),
      status,
    };
  };

  const loadWalletData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [balanceData, statementData] = await Promise.all([
        walletAPI.getBalance(),
        walletAPI.getStatement(20),
      ]);

      const parsedBalance = Number(balanceData.balance || 0);
      setBalance(Number.isNaN(parsedBalance) ? 0 : parsedBalance);
      setTransactions((statementData.transactions || []).map(mapTransaction));
    } catch (error: any) {
      toast.error(error?.message || 'Không thể tải dữ liệu ví');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWalletData();
  }, [loadWalletData]);

  const hasTransactions = useMemo(() => transactions.length > 0, [transactions]);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Sticky Top Section: Header + Cards */}
      <div className="sticky top-0 z-40 bg-gray-50">
        {/* Header - Modern Glass Effect */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 px-5 pt-12 pb-20 rounded-b-[2.5rem] relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute top-32 -left-32 w-80 h-80 bg-blue-400 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-white/30 transition-all text-white border border-white/20 shadow-lg"
              >
                <ArrowLeft size={20} strokeWidth={2.5} />
              </button>
              <h1 className="text-white font-bold text-xl tracking-tight">Ví của tôi</h1>
            </div>

            <div className="flex flex-col items-center text-center">
              <p className="text-blue-100 text-sm font-medium mb-1 flex items-center gap-2">
                <Wallet size={14} />
                Số dư khả dụng
              </p>
              <h2 className="text-white text-4xl font-bold tracking-tight mb-2">
                {balance.toLocaleString('vi-VN')}đ
              </h2>
              <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                <Sparkles size={14} className="text-yellow-300" />
                <span className="text-white text-xs font-bold">Thành viên Vàng</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions - Floating inside the sticky container */}
        <div className="px-5 -mt-10 pb-4 relative z-10">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/wallet/topup')}
              className="bg-white rounded-3xl p-5 shadow-xl border border-white hover:border-blue-200 transition-all active:scale-95 group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Plus size={24} strokeWidth={2.5} className="text-blue-600 group-hover:text-white" />
              </div>
              <p className="text-gray-900 font-bold text-base leading-tight">Nạp tiền</p>
              <p className="text-gray-500 text-xs mt-1">Vào ví ngay</p>
            </button>

            <button
              onClick={() => navigate('/payments')}
              className="bg-white rounded-3xl p-5 shadow-xl border border-white hover:border-indigo-200 transition-all active:scale-95 group"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <CreditCard size={24} strokeWidth={2.5} className="text-indigo-600 group-hover:text-white" />
              </div>
              <p className="text-gray-900 font-bold text-base leading-tight">Liên kết</p>
              <p className="text-gray-500 text-xs mt-1">Thẻ & Ngân hàng</p>
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="px-5 pt-2 space-y-4">
        {/* Transaction History Header */}
        <div className="flex items-center justify-between pt-4 pb-2">
          <h3 className="text-gray-900 font-bold text-lg flex items-center gap-2">
            <History size={20} className="text-blue-600" />
            Lịch sử giao dịch
          </h3>
          <button onClick={loadWalletData} className="text-blue-600 text-sm font-bold flex items-center">
            Làm mới <ChevronRight size={16} />
          </button>
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          {isLoading && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center text-sm text-gray-500 font-semibold">
              Đang tải dữ liệu ví...
            </div>
          )}

          {!isLoading && !hasTransactions && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center text-sm text-gray-500 font-semibold">
              Chưa có giao dịch ví nào
            </div>
          )}

          {!isLoading && transactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                tx.type === 'in' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {tx.type === 'in' ? (
                  <TrendingUp className="text-green-600" size={20} />
                ) : (
                  <TrendingDown className="text-red-600" size={20} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 font-bold text-sm truncate">{tx.title}</p>
                <p className="text-gray-500 text-xs mt-0.5">{tx.time}</p>
              </div>
              <div className="text-right">
                <p className={`font-bold text-sm ${
                  tx.type === 'in' ? 'text-green-600' : 'text-gray-900'
                }`}>
                  {tx.type === 'in' ? '+' : '-'}{tx.amount.toLocaleString('vi-VN')}đ
                </p>
                <p className={`text-[10px] font-bold mt-0.5 uppercase tracking-wider ${
                  tx.status === 'success' ? 'text-green-500' : 'text-orange-500'
                }`}>
                  {tx.status === 'success' ? 'Thành công' : 'Đang xử lý'}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Help Banner */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100 mt-4">
          <p className="text-blue-900 text-xs font-medium leading-relaxed">
            <span className="font-bold">💡 Bạn có biết?</span> Nạp tiền vào ví giúp quá trình thanh toán đăng kiểm diễn ra nhanh chóng hơn và nhận được nhiều ưu đãi tích điểm.
          </p>
        </div>
      </div>
    </div>
  );
}
