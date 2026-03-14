import { useNavigate } from 'react-router';
import { User, Briefcase, Shield, ArrowRight } from 'lucide-react';
import { useAuth, UserRole } from '@/app/contexts/AuthContext';
import { toast } from 'sonner';

export default function RoleSelectionScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const roles = [
    {
      key: 'user' as UserRole,
      title: 'Khách hàng',
      description: 'Đặt lịch và theo dõi đăng kiểm xe',
      icon: User,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      key: 'staff' as UserRole,
      title: 'Nhân viên',
      description: 'Quản lý công việc và đơn hàng',
      icon: Briefcase,
      color: 'green',
      gradient: 'from-green-500 to-green-600',
    },
    {
      key: 'admin' as UserRole,
      title: 'Quản trị viên',
      description: 'Điều phối và giám sát hệ thống',
      icon: Shield,
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
    },
  ];

  const handleSelectRole = (role: UserRole) => {
    login(role);
    toast.success(`Đăng nhập thành công với vai trò ${roles.find((r) => r.key === role)?.title}`);
    
    // Navigate based on role
    if (role === 'admin') {
      navigate('/admin/orders');
    } else if (role === 'staff') {
      navigate('/staff');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center p-5">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <svg className="w-10 h-10 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17,8H20L23,12.5V15H21A3,3 0 0,1 18,18A3,3 0 0,1 15,15H9A3,3 0 0,1 6,18A3,3 0 0,1 3,15H1V6C1,4.89 1.9,4 3,4H17V8M17,10H21.5L19.5,7.5H17V10M6,13.5A1.5,1.5 0 0,0 4.5,15A1.5,1.5 0 0,0 6,16.5A1.5,1.5 0 0,0 7.5,15A1.5,1.5 0 0,0 6,13.5M18,13.5A1.5,1.5 0 0,0 16.5,15A1.5,1.5 0 0,0 18,16.5A1.5,1.5 0 0,0 19.5,15A1.5,1.5 0 0,0 18,13.5Z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Đăng Kiểm 360</h1>
          <p className="text-blue-100 text-sm">Chọn vai trò để tiếp tục</p>
        </div>

        {/* Role Cards */}
        <div className="space-y-4">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.key}
                onClick={() => handleSelectRole(role.key)}
                className="w-full bg-white rounded-2xl p-5 shadow-2xl hover:shadow-3xl transition-all active:scale-98 text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${role.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon size={32} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{role.title}</h3>
                    <p className="text-sm text-gray-600">{role.description}</p>
                  </div>
                  <ArrowRight size={24} className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/auth')}
            className="text-blue-100 text-sm hover:text-white transition-colors"
          >
            ← Quay lại đăng nhập/đăng ký
          </button>
        </div>

        <p className="text-center text-blue-100 text-xs mt-6">
          © 2026 Đăng Kiểm 360. All rights reserved.
        </p>
      </div>
    </div>
  );
}