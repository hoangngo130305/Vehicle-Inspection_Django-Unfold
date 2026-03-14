import { Outlet, useLocation, useNavigate } from 'react-router';
import { Home, Calendar, Map, User } from 'lucide-react';

export default function UserApp() {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide bottom nav only on root path
  const hideBottomNav = location.pathname === '/';

  const isActive = (path: string) => {
    if (path === '/home') return location.pathname === '/home';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto relative">
      {/* Main Content */}
      <div className={hideBottomNav ? 'flex-1' : 'flex-1 pb-16'}>
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      {!hideBottomNav && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 z-50 backdrop-blur-lg bg-white/95">
          <div className="grid grid-cols-4 h-16 px-2">
            <button
              onClick={() => navigate('/home')}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ease-out active:scale-95 ${
                isActive('/home')
                  ? 'text-blue-600'
                  : 'text-gray-400'
              }`}
            >
              <Home
                size={24}
                strokeWidth={isActive('/home') ? 2.5 : 2}
                className="transition-all duration-300"
              />
              <span className={`text-xs transition-all duration-300 ${isActive('/home') ? 'font-semibold' : 'font-medium'}`}>
                Trang chủ
              </span>
            </button>

            <button
              onClick={() => navigate('/booking')}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ease-out active:scale-95 ${
                isActive('/booking')
                  ? 'text-blue-600'
                  : 'text-gray-400'
              }`}
            >
              <Calendar
                size={24}
                strokeWidth={isActive('/booking') ? 2.5 : 2}
                className="transition-all duration-300"
              />
              <span className={`text-xs transition-all duration-300 ${isActive('/booking') ? 'font-semibold' : 'font-medium'}`}>
                Đặt lịch
              </span>
            </button>

            <button
              onClick={() => navigate('/map')}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ease-out active:scale-95 ${
                isActive('/map')
                  ? 'text-blue-600'
                  : 'text-gray-400'
              }`}
            >
              <Map
                size={24}
                strokeWidth={isActive('/map') ? 2.5 : 2}
                className="transition-all duration-300"
              />
              <span className={`text-xs transition-all duration-300 ${isActive('/map') ? 'font-semibold' : 'font-medium'}`}>
                Bản đồ
              </span>
            </button>

            <button
              onClick={() => navigate('/profile')}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ease-out active:scale-95 ${
                isActive('/profile')
                  ? 'text-blue-600'
                  : 'text-gray-400'
              }`}
            >
              <User
                size={24}
                strokeWidth={isActive('/profile') ? 2.5 : 2}
                className="transition-all duration-300"
              />
              <span className={`text-xs transition-all duration-300 ${isActive('/profile') ? 'font-semibold' : 'font-medium'}`}>
                Cá nhân
              </span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}