import { ArrowLeft, Bell, Calendar, AlertCircle, CheckCircle, XCircle, CalendarX, CalendarClock } from 'lucide-react';

interface NotificationScreenProps {
  onBack: () => void;
}

const notifications = [
  {
    id: '1',
    type: 'reminder',
    title: 'Nhắc nhở đăng kiểm',
    message: 'Xe 29A-12345 sẽ hết hạn đăng kiểm vào 15/02/2026. Đặt lịch ngay!',
    time: '2 giờ trước',
    read: false,
  },
  {
    id: '2',
    type: 'cancelled',
    title: 'Lịch hẹn bị hủy',
    message: 'Lịch đăng kiểm của bạn tại TT Đăng kiểm 29-03D vào 20/01/2026 đã bị hủy do trung tâm bảo trì. Vui lòng đặt lịch mới.',
    time: '3 giờ trước',
    read: false,
  },
  {
    id: '3',
    type: 'rescheduled',
    title: 'Lịch hẹn đã được dời',
    message: 'Lịch đăng kiểm của bạn đã được dời từ 18/01/2026 sang 20/01/2026 lúc 10:00 do yêu cầu của trung tâm.',
    time: '5 giờ trước',
    read: false,
  },
  {
    id: '4',
    type: 'success',
    title: 'Đặt lịch thành công',
    message: 'Bạn đã đặt lịch đăng kiểm tại TT Đăng kiểm 29-03D vào 15/02/2026 lúc 09:00',
    time: '1 ngày trước',
    read: true,
  },
  {
    id: '5',
    type: 'warning',
    title: 'Trung tâm quá tải',
    message: 'TT Đăng kiểm 29-01S hiện đang quá tải. Thời gian chờ dự kiến: 2-3 giờ. Vui lòng cân nhắc chọn trung tâm khác.',
    time: '2 ngày trước',
    read: true,
  },
  {
    id: '6',
    type: 'reminder',
    title: 'Nhắc lịch hẹn sắp tới',
    message: 'Bạn có lịch đăng kiểm vào ngày mai (22/01/2026) lúc 09:00 tại TT Đăng kiểm 29-03D. Nhớ mang theo giấy tờ xe nhé!',
    time: '1 ngày trước',
    read: true,
  },
];

export default function NotificationScreen({ onBack }: NotificationScreenProps) {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reminder':
        return { icon: <Bell size={20} strokeWidth={2.5} />, bg: 'bg-gradient-to-br from-orange-400 to-orange-600', color: 'text-white' };
      case 'success':
        return { icon: <CheckCircle size={20} strokeWidth={2.5} />, bg: 'bg-gradient-to-br from-green-400 to-green-600', color: 'text-white' };
      case 'warning':
        return { icon: <AlertCircle size={20} strokeWidth={2.5} />, bg: 'bg-gradient-to-br from-red-400 to-red-600', color: 'text-white' };
      case 'cancelled':
        return { icon: <CalendarX size={20} strokeWidth={2.5} />, bg: 'bg-gradient-to-br from-red-500 to-red-700', color: 'text-white' };
      case 'rescheduled':
        return { icon: <CalendarClock size={20} strokeWidth={2.5} />, bg: 'bg-gradient-to-br from-blue-400 to-blue-600', color: 'text-white' };
      default:
        return { icon: <Bell size={20} strokeWidth={2.5} />, bg: 'bg-gradient-to-br from-gray-400 to-gray-600', color: 'text-white' };
    }
  };

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
          <h1 className="text-gray-900 font-bold text-xl tracking-tight mb-1">Thông báo</h1>
          <p className="text-gray-500 text-xs">Cập nhật mới nhất từ hệ thống</p>
        </div>
      </div>

      <div className="p-5">
        <div className="space-y-3">
          {notifications.map((notification) => {
            const iconInfo = getNotificationIcon(notification.type);
            return (
              <div
                key={notification.id}
                className={`bg-white border rounded-xl p-4 ${
                  notification.read ? 'border-gray-200' : 'border-blue-200 bg-blue-50/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 ${iconInfo.bg} rounded-xl flex items-center justify-center flex-shrink-0 ${iconInfo.color}`}>
                    {iconInfo.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-gray-900 font-semibold text-sm">{notification.title}</h3>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 ml-2 mt-1"></div>
                      )}
                    </div>
                    <p className="text-gray-600 text-xs mb-2">{notification.message}</p>
                    <p className="text-gray-400 text-xs">{notification.time}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}