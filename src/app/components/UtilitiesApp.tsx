import { Outlet, useNavigate, useLocation } from 'react-router';
import { Home, Camera, FileText } from 'lucide-react';

export default function UtilitiesApp() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: '/utilities', label: 'Tra Cứu', icon: Home },
    { path: '/cameras', label: 'Danh Sách Cam', icon: Camera },
    { path: '/penalties', label: 'Mức Phạt', icon: FileText },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>

      {/* Bottom Navigation - Fixed */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg max-w-md mx-auto z-50">
        <div className="grid grid-cols-3 h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path;
            
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                  isActive ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'
                }`}
              >
                <Icon size={22} />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
