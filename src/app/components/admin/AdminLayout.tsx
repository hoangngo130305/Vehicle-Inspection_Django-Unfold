import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { 
  FileText, 
  Map, 
  Wallet,
  Users,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  MapPin,
  Building2,
  Shield,
  UserCog,
  DollarSign,
  CheckSquare,
  Car
} from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const menuItems = [
    { 
      label: 'Quản lý đơn hàng', 
      icon: FileText, 
      path: '/admin/orders',
      badge: '12'
    },
    { 
      label: 'Giám sát bản đồ', 
      icon: Map, 
      path: '/admin/map',
      badge: '3'
    },
    { 
      label: 'Tài chính', 
      icon: Wallet, 
      path: '/admin/finance',
      badge: null
    },
    { 
      label: 'Bảng giá', 
      icon: DollarSign, 
      path: '/admin/pricing',
      badge: null
    },
    { 
      label: 'Nhân viên', 
      icon: Users, 
      path: '/admin/employees',
      badge: null
    },
    { 
      label: 'Trạm đăng kiểm', 
      icon: MapPin, 
      path: '/admin/stations',
      badge: null
    },
    { 
      label: 'Checklist kiểm tra', 
      icon: CheckSquare, 
      path: '/admin/checklist',
      badge: null
    },
    { 
      label: 'Loại xe', 
      icon: Car, 
      path: '/admin/vehicle-types',
      badge: null
    },
    { 
      label: 'Báo cáo', 
      icon: BarChart3, 
      path: '/admin/reports',
      badge: null
    },
    { 
      label: 'Phân quyền', 
      icon: Shield, 
      path: '/admin/permissions',
      badge: null
    },
    { 
      label: 'Cài đặt', 
      icon: Settings, 
      path: '/admin/settings',
      badge: null
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        } bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-lg`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">DK</span>
              </div>
              <span className="font-bold text-gray-900">Đăng Kiểm</span>
            </div>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isSidebarCollapsed ? (
              <ChevronRight size={20} className="text-gray-600" />
            ) : (
              <ChevronLeft size={20} className="text-gray-600" />
            )}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-all relative group ${
                  active
                    ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon 
                  size={20} 
                  className={active ? 'text-blue-600' : 'text-gray-500'} 
                />
                {!isSidebarCollapsed && (
                  <>
                    <span className={`text-sm font-medium flex-1 text-left ${
                      active ? 'font-semibold' : ''
                    }`}>
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {isSidebarCollapsed && item.badge && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            {!isSidebarCollapsed && (
              <span className="text-sm font-medium">Đăng xuất</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm đơn hàng, khách hàng..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Admin Avatar */}
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">Admin</p>
                <p className="text-xs text-gray-500">Quản trị viên</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}