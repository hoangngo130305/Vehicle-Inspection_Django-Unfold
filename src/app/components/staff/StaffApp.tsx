import { Outlet, useLocation, useNavigate } from 'react-router';
import { Home, ClipboardList, User } from 'lucide-react';
import { StaffOrdersProvider } from '@/app/contexts/StaffOrdersContext';

export default function StaffApp() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/staff', icon: Home, label: 'Trang chủ' },
    { path: '/staff/orders', icon: ClipboardList, label: 'Đơn hàng' },
    { path: '/staff/profile', icon: User, label: 'Cá nhân' },
  ];

  const isActive = (path: string) => {
    if (path === '/staff') {
      return location.pathname === '/staff';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <StaffOrdersProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto relative">
        {/* Main Content */}
        <div className="flex-1 pb-16">
          <Outlet />
        </div>
        
        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 z-50 backdrop-blur-lg bg-white/95">
          <div className="grid grid-cols-3 h-16 px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ease-out active:scale-95 ${
                    active ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  <Icon
                    size={24}
                    strokeWidth={active ? 2.5 : 2}
                    className="transition-all duration-300"
                  />
                  <span className={`text-xs transition-all duration-300 ${active ? 'font-semibold' : 'font-medium'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </StaffOrdersProvider>
  );
}