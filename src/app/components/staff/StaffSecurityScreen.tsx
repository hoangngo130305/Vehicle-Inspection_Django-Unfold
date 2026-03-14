import { useNavigate } from 'react-router';
import { ArrowLeft, Lock, Key, Smartphone, Shield, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function StaffSecurityScreen() {
  const navigate = useNavigate();

  const [twoFactor, setTwoFactor] = useState(false);
  const [biometric, setBiometric] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleChangePassword = () => {
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (passwordData.new !== passwordData.confirm) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    if (passwordData.new.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    toast.success('Đã thay đổi mật khẩu thành công');
    setPasswordData({ current: '', new: '', confirm: '' });
  };

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
            <h1 className="text-gray-900 font-bold flex-1">Bảo mật</h1>
            <Shield size={20} className="text-green-600" />
          </div>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-5 py-5 pb-24">
        {/* Change Password Section */}
        <div className="mb-5">
          <h2 className="text-gray-900 font-bold text-sm mb-3 px-1">Đổi mật khẩu</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mật khẩu hiện tại
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
                  placeholder="Nhập mật khẩu hiện tại"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.new}
                  onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
                  placeholder="Nhập mật khẩu mới"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Xác nhận mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
                  placeholder="Nhập lại mật khẩu mới"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleChangePassword}
              className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Key size={18} />
              Đổi mật khẩu
            </button>
          </div>
        </div>

        {/* Security Settings */}
        <div className="mb-5">
          <h2 className="text-gray-900 font-bold text-sm mb-3 px-1">Xác thực</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Lock size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Xác thực 2 lớp (2FA)</p>
                  <p className="text-gray-500 text-xs">Bảo vệ tài khoản tốt hơn</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setTwoFactor(!twoFactor);
                  if (!twoFactor) {
                    toast.success('Đã bật xác thực 2 lớp');
                  } else {
                    toast.info('Đã tắt xác thực 2 lớp');
                  }
                }}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  twoFactor ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    twoFactor ? 'translate-x-6' : 'translate-x-1'
                  }`}
                ></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Smartphone size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Sinh trắc học</p>
                  <p className="text-gray-500 text-xs">Vân tay / Face ID</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setBiometric(!biometric);
                  if (!biometric) {
                    toast.success('Đã bật đăng nhập sinh trắc học');
                  } else {
                    toast.info('Đã tắt đăng nhập sinh trắc học');
                  }
                }}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  biometric ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    biometric ? 'translate-x-6' : 'translate-x-1'
                  }`}
                ></div>
              </button>
            </div>
          </div>
        </div>

        {/* Session Management */}
        <div className="mb-5">
          <h2 className="text-gray-900 font-bold text-sm mb-3 px-1">Phiên đăng nhập</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-gray-900 text-sm">Thiết bị hiện tại</p>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  Đang hoạt động
                </span>
              </div>
              <p className="text-gray-500 text-xs">iPhone 14 Pro • TP.HCM</p>
              <p className="text-gray-400 text-xs mt-1">Đăng nhập lúc: 29/01/2026 09:15</p>
            </div>

            <button
              onClick={() => {
                if (confirm('Bạn có chắc muốn đăng xuất khỏi tất cả thiết bị khác?')) {
                  toast.success('Đã đăng xuất khỏi tất cả thiết bị khác');
                }
              }}
              className="w-full p-4 text-red-600 font-semibold text-sm hover:bg-red-50 transition-colors text-center"
            >
              Đăng xuất tất cả thiết bị khác
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-blue-800 text-xs leading-relaxed">
            <strong>Mẹo bảo mật:</strong> Sử dụng mật khẩu mạnh và kích hoạt xác thực 2 lớp để bảo vệ tài khoản tốt hơn.
          </p>
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
