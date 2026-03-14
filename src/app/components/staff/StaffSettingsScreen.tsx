import { useNavigate } from 'react-router';
import { ArrowLeft, Settings, Globe, Moon, Volume2, Vibrate, Download } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function StaffSettingsScreen() {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [sound, setSound] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [language, setLanguage] = useState('vi');
  const [autoUpdate, setAutoUpdate] = useState(true);

  const languages = [
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
  ];

  return (
    <div className="h-screen bg-gray-50 flex flex-col max-w-md mx-auto">
      {/* Header - Fixed */}
      <div className="sticky top-0 z-40 bg-white px-5 pt-12 pb-4 rounded-b-[2rem] shadow-md border-b border-gray-100 relative overflow-hidden">
        {/* Decorative Circle Patterns */}
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute top-6 right-8 w-24 h-24 border-2 border-blue-600 rounded-full"></div>
          <div className="absolute top-10 right-24 w-16 h-16 border-2 border-green-600 rounded-full"></div>
          <div className="absolute bottom-2 left-6 w-28 h-28 border-2 border-blue-600 rounded-full"></div>
          <div className="absolute bottom-4 left-28 w-10 h-10 border border-green-600 rounded-full"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/staff/profile')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} strokeWidth={2.5} />
            </button>
            <h1 className="text-gray-900 font-bold flex-1">Cài đặt</h1>
            <Settings size={20} className="text-green-600" />
          </div>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-5 py-5 pb-24">
        {/* Display Settings */}
        <div className="mb-5">
          <h2 className="text-gray-900 font-bold text-sm mb-3 px-1">Hiển thị</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Moon size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Chế độ tối</p>
                  <p className="text-gray-500 text-xs">Giảm ánh sáng màn hình</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setDarkMode(!darkMode);
                  toast.info('Tính năng đang được phát triển');
                }}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  darkMode ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                ></div>
              </button>
            </div>
          </div>
        </div>

        {/* Language Settings */}
        <div className="mb-5">
          <h2 className="text-gray-900 font-bold text-sm mb-3 px-1">Ngôn ngữ</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => toast.info('Tính năng đang được phát triển')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Globe size={20} className="text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 text-sm">Ngôn ngữ ứng dụng</p>
                  <p className="text-gray-500 text-xs">
                    {languages.find(l => l.code === language)?.flag}{' '}
                    {languages.find(l => l.code === language)?.name}
                  </p>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>

        {/* Sound & Notifications */}
        <div className="mb-5">
          <h2 className="text-gray-900 font-bold text-sm mb-3 px-1">Âm thanh & Rung</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Volume2 size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Âm thanh</p>
                  <p className="text-gray-500 text-xs">Phát âm thanh thông báo</p>
                </div>
              </div>
              <button
                onClick={() => setSound(!sound)}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  sound ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    sound ? 'translate-x-6' : 'translate-x-1'
                  }`}
                ></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Vibrate size={20} className="text-orange-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Rung</p>
                  <p className="text-gray-500 text-xs">Rung khi có thông báo</p>
                </div>
              </div>
              <button
                onClick={() => setVibration(!vibration)}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  vibration ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    vibration ? 'translate-x-6' : 'translate-x-1'
                  }`}
                ></div>
              </button>
            </div>
          </div>
        </div>

        {/* App Updates */}
        <div className="mb-5">
          <h2 className="text-gray-900 font-bold text-sm mb-3 px-1">Cập nhật</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Download size={20} className="text-indigo-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Tự động cập nhật</p>
                  <p className="text-gray-500 text-xs">Cập nhật ứng dụng tự động</p>
                </div>
              </div>
              <button
                onClick={() => setAutoUpdate(!autoUpdate)}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  autoUpdate ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    autoUpdate ? 'translate-x-6' : 'translate-x-1'
                  }`}
                ></div>
              </button>
            </div>

            <button
              onClick={() => toast.success('Bạn đang sử dụng phiên bản mới nhất')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="text-left">
                <p className="font-semibold text-gray-900 text-sm">Kiểm tra cập nhật</p>
                <p className="text-gray-500 text-xs">Phiên bản hiện tại: 1.0.0</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>

        {/* Cache & Data */}
        <div className="mb-5">
          <h2 className="text-gray-900 font-bold text-sm mb-3 px-1">Dữ liệu</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => {
                if (confirm('Bạn có chắc muốn xóa bộ nhớ cache?')) {
                  toast.success('Đã xóa bộ nhớ cache thành công');
                }
              }}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="text-left">
                <p className="font-semibold text-gray-900 text-sm">Xóa bộ nhớ cache</p>
                <p className="text-gray-500 text-xs">Giải phóng 124 MB</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Fixed */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg max-w-md mx-auto">
        <div className="flex items-center justify-around py-3">
          <button
            onClick={() => navigate('/staff/orders')}
            className="flex flex-col items-center gap-1 px-4 py-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span className="text-xs font-medium">Trang chủ</span>
          </button>

          <button
            onClick={() => navigate('/staff/notifications')}
            className="flex flex-col items-center gap-1 px-4 py-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span className="text-xs font-medium">Thông báo</span>
          </button>

          <button
            onClick={() => navigate('/staff/profile')}
            className="flex flex-col items-center gap-1 px-4 py-1 text-green-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span className="text-xs font-bold">Tôi</span>
          </button>
        </div>
      </div>
    </div>
  );
}
