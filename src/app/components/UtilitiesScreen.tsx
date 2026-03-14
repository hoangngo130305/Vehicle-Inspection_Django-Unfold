import { useNavigate } from 'react-router';
import { 
  ShieldCheck,
  Search,
  Car,
  Users,
  Newspaper,
  HelpCircle,
  MapPin,
  Beer,
  Camera,
  Star,
  Share2,
  FileText,
  ChevronRight
} from 'lucide-react';

export default function UtilitiesScreen() {
  const navigate = useNavigate();

  const quickLinks = [
    {
      icon: ShieldCheck,
      title: 'Tra Cứu Cục CSGT',
      description: 'Toàn quốc, dữ liệu Cục CSGT',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      onClick: () => {},
    },
    {
      icon: ShieldCheck,
      title: 'Tra Cứu Cục Đăng Kiểm',
      description: 'Dữ liệu từ Cục Đăng kiểm VN',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      onClick: () => {},
    },
    {
      icon: ShieldCheck,
      title: 'Tra Cứu CSGT Thành Phố',
      description: 'Hà Nội, TP.HCM, Đà Nẵng',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      onClick: () => {},
    },
  ];

  const utilities = [
    {
      icon: Car,
      label: 'Đặt Lịch Đăng Kiểm',
      color: 'text-white',
      bgColor: 'bg-green-600',
      onClick: () => navigate('/home'),
      featured: true,
    },
    {
      icon: Users,
      label: 'Nhóm Cộng Đồng',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      onClick: () => window.open('https://facebook.com', '_blank'),
    },
    {
      icon: Newspaper,
      label: 'Tin Tức Xe Cộ',
      color: 'text-slate-600',
      bgColor: 'bg-slate-50',
      onClick: () => {},
    },
    {
      icon: HelpCircle,
      label: 'Giải Đáp Thắc Mắc',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      onClick: () => {},
    },
    {
      icon: MapPin,
      label: 'Chỉ Dẫn Đường',
      color: 'text-slate-600',
      bgColor: 'bg-slate-50',
      onClick: () => {},
    },
    {
      icon: Beer,
      label: 'Dịch Vụ Lái Xe',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      onClick: () => {},
    },
    {
      icon: Camera,
      label: 'Camera Giao Thông',
      color: 'text-slate-600',
      bgColor: 'bg-slate-50',
      onClick: () => navigate('/cameras'),
    },
  ];

  const options = [
    {
      icon: Star,
      label: 'Đánh giá ứng dụng',
    },
    {
      icon: Share2,
      label: 'Chia sẻ ứng dụng',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
      {/* Header - Fixed with rounded bottom & decorative circles */}
      <div className="bg-white px-5 pt-10 pb-6 rounded-b-[2rem] shadow-md border-b border-gray-100 relative overflow-hidden sticky top-0 z-40">
        {/* Decorative Circle Patterns */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute top-6 right-8 w-24 h-24 border-2 border-gray-900 rounded-full"></div>
          <div className="absolute top-10 right-24 w-16 h-16 border-2 border-gray-900 rounded-full"></div>
          <div className="absolute bottom-2 left-6 w-28 h-28 border-2 border-gray-900 rounded-full"></div>
          <div className="absolute bottom-4 left-28 w-10 h-10 border border-gray-900 rounded-full"></div>
        </div>
        
        <div className="flex items-center justify-between mb-1 relative z-10">
          <h1 className="text-gray-900 font-bold text-xl tracking-tight">Đăng Kiểm Việt</h1>
        </div>
        <p className="text-gray-500 text-xs relative z-10">Tra cứu & tiện ích xe cộ</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 pt-5">
        {/* VIP Banner */}
        <div className="bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl p-4 mb-4 shadow-sm">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-1.5 h-1.5 bg-amber-900 rounded-full mt-2"></div>
            <p className="flex-1 text-sm text-amber-900 leading-relaxed">
              Dữ liệu lấy trực tiếp từ máy chủ chính thức tại thời điểm tra cứu
            </p>
          </div>
          <button className="w-full bg-white text-amber-700 font-semibold py-2.5 rounded-lg shadow-sm hover:shadow transition-shadow text-sm">
            Nâng Cấp VIP
          </button>
        </div>

        {/* Quick Links */}
        <div className="space-y-2.5 mb-5">
          {quickLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <button
                key={index}
                onClick={link.onClick}
                className="w-full bg-white rounded-xl p-3.5 border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all flex items-center gap-3.5"
              >
                <div className={`w-10 h-10 ${link.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon size={20} className={link.color} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-gray-900 font-semibold text-sm mb-0.5">{link.title}</h3>
                  <p className="text-gray-500 text-xs">{link.description}</p>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
              </button>
            );
          })}
        </div>

        {/* Utilities Section */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 mb-4">
          <h2 className="text-gray-900 font-semibold text-sm mb-3.5">Tiện ích</h2>
          <div className="grid grid-cols-3 gap-3">
            {utilities.map((utility, index) => {
              const Icon = utility.icon;
              return (
                <button
                  key={index}
                  onClick={utility.onClick}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div 
                    className={`w-14 h-14 ${utility.bgColor} rounded-xl flex items-center justify-center transition-all group-hover:scale-105 ${utility.featured ? 'shadow-md ring-2 ring-green-500 ring-offset-2' : 'shadow-sm'}`}
                  >
                    <Icon size={22} className={utility.color} />
                  </div>
                  <span className={`text-xs text-center leading-snug ${utility.featured ? 'text-green-600 font-semibold' : 'text-gray-700 font-medium'}`}>
                    {utility.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Options Section */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 mb-4">
          <div className="flex items-center justify-around">
            {options.map((option, index) => {
              const Icon = option.icon;
              return (
                <button
                  key={index}
                  className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                >
                  <Icon size={16} className="text-blue-600" />
                  <span className="text-blue-600 text-xs font-medium">{option.label}</span>
                </button>
              );
            })}
          </div>
          <div className="h-px bg-gray-100 my-3"></div>
          <button className="w-full text-blue-600 text-xs font-medium hover:text-blue-700">
            Chính sách & điều khoản
          </button>
        </div>
      </div>
    </div>
  );
}