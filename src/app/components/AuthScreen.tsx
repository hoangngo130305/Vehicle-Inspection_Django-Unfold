import { useState } from 'react';
import { useNavigate } from 'react-router';
import { LogIn, UserPlus, Phone, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/app/contexts/AuthContext';

interface AuthScreenProps {
  onLoginSuccess: () => void;
}

type AuthMode = 'login' | 'register';

export default function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerStep, setRegisterStep] = useState<'phone' | 'otp' | 'password'>('phone');
  const [otp, setOtp] = useState('');
  const [partnerCode, setPartnerCode] = useState('');
  const [showPartnerInput, setShowPartnerInput] = useState(false);

  const handleSocialLogin = (provider: string) => {
    toast.success(`Đang đăng nhập với ${provider}...`);
    setTimeout(() => {
      login('user', partnerCode || undefined);
      navigate('/');
    }, 1000);
  };

  const handlePhoneLogin = () => {
    if (!phoneNumber || !password) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    toast.success('Đăng nhập thành công!');
    login('user', partnerCode || undefined);
    navigate('/');
  };

  const handleRoleLogin = (role: 'staff' | 'admin') => {
    login(role);
    const roleName = role === 'staff' ? 'Nhân viên' : 'Quản trị';
    toast.success(`Đăng nhập với vai trò ${roleName}`);
    if (role === 'staff') {
      navigate('/staff');
    } else {
      navigate('/admin/orders');
    }
  };

  const handleSendOTP = () => {
    if (!phoneNumber) {
      toast.error('Vui lòng nhập số điện thoại');
      return;
    }
    setRegisterStep('otp');
    toast.success('Mã OTP đã được gửi đến ' + phoneNumber);
  };

  const handleVerifyOTP = () => {
    if (!otp || otp.length !== 6) {
      toast.error('Vui lòng nhập mã OTP 6 chữ số');
      return;
    }
    setRegisterStep('password');
    toast.success('Xác thực thành công!');
  };

  const handleRegister = () => {
    if (!password || !confirmPassword) {
      toast.error('Vui lòng nhập mật khẩu');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Mật khẩu không khớp');
      return;
    }
    if (password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    toast.success('Đăng ký thành công!');
    login('user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto relative overflow-hidden">
      {/* Modern Background Pattern - Gradient from bottom to top */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-50 via-blue-50/30 to-transparent" />
      
      {/* Decorative circles */}
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl" />
      <div className="absolute bottom-40 right-32 w-20 h-20 bg-blue-300/10 rounded-full blur-xl" />
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-blue-400/10 rounded-full blur-2xl" />

      <div className="flex-1 flex flex-col justify-center px-5 py-8 relative z-10">
        {/* Logo & Title - Enhanced */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-white rounded-[1.25rem] mx-auto mb-4 flex items-center justify-center shadow-2xl border-2 border-gray-100">
            {/* Truck Icon SVG */}
            <svg className="w-10 h-10 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17,8H20L23,12.5V15H21A3,3 0 0,1 18,18A3,3 0 0,1 15,15H9A3,3 0 0,1 6,18A3,3 0 0,1 3,15H1V6C1,4.89 1.9,4 3,4H17V8M17,10H21.5L19.5,7.5H17V10M6,13.5A1.5,1.5 0 0,0 4.5,15A1.5,1.5 0 0,0 6,16.5A1.5,1.5 0 0,0 7.5,15A1.5,1.5 0 0,0 6,13.5M18,13.5A1.5,1.5 0 0,0 16.5,15A1.5,1.5 0 0,0 18,16.5A1.5,1.5 0 0,0 19.5,15A1.5,1.5 0 0,0 18,13.5Z"/>
            </svg>
          </div>
          <h1 className="text-[1.75rem] font-bold text-gray-900 mb-1 tracking-tight">Đăng Kiểm 360</h1>
          <p className="text-blue-600 text-sm font-medium">Dịch vụ đăng kiểm chuyên nghiệp</p>
        </div>

        {/* Auth Mode Toggle */}
        <div className="bg-gray-100 rounded-2xl p-1 mb-4 grid grid-cols-2 gap-1">
          <button
            onClick={() => {
              setAuthMode('login');
              setRegisterStep('phone');
            }}
            className={`py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
              authMode === 'login'
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => {
              setAuthMode('register');
              setRegisterStep('phone');
            }}
            className={`py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
              authMode === 'register'
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Đăng ký
          </button>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-5 space-y-4 backdrop-blur-xl">
          {authMode === 'login' && (
            <>
              <h3 className="text-base font-bold text-gray-800 text-center mb-3">
                Chọn phương thức đăng nhập
              </h3>
              
              {/* Social Login Buttons */}
              <div className="space-y-2.5">
                <button
                  onClick={() => handleSocialLogin('Google')}
                  className="w-full flex items-center justify-center gap-2.5 bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-md rounded-xl py-3 transition-all active:scale-98"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="font-semibold text-gray-700 text-sm">Google</span>
                </button>

                <button
                  onClick={() => handleSocialLogin('Facebook')}
                  className="w-full flex items-center justify-center gap-2.5 bg-[#1877F2] hover:bg-[#166FE5] hover:shadow-md rounded-xl py-3 transition-all active:scale-98"
                >
                  <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="font-semibold text-white text-sm">Facebook</span>
                </button>

                <button
                  onClick={() => handleSocialLogin('Apple')}
                  className="w-full flex items-center justify-center gap-2.5 bg-black hover:bg-gray-900 hover:shadow-md rounded-xl py-3 transition-all active:scale-98"
                >
                  <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <span className="font-semibold text-white text-sm">Apple</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white text-gray-500 font-medium">Hoặc SĐT + Mật khẩu</span>
                </div>
              </div>

              {/* Phone + Password Login */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Nhập số điện thoại"
                      className="w-full pl-10 pr-3 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Nhập mật khẩu"
                      className="w-full pl-10 pr-10 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handlePhoneLogin}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl active:scale-98 transition-all"
                >
                  Đăng nhập
                </button>

                <button className="w-full text-blue-600 text-xs font-semibold hover:text-blue-700 transition-colors">
                  Quên mật khẩu?
                </button>
              </div>
            </>
          )}

          {authMode === 'register' && (
            <>
              <h3 className="text-base font-bold text-gray-800 text-center mb-3">
                {registerStep === 'otp' ? 'Xác thực OTP' : 'Tạo tài khoản mới'}
              </h3>

              {registerStep === 'phone' ? (
                <>
                  {/* Social Register Buttons */}
                  <div className="space-y-2.5 mb-4">
                    <button
                      onClick={() => handleSocialLogin('Google')}
                      className="w-full flex items-center justify-center gap-2.5 bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-md rounded-xl py-2.5 transition-all active:scale-98"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="font-semibold text-gray-700 text-xs">Google</span>
                    </button>

                    <button
                      onClick={() => handleSocialLogin('Facebook')}
                      className="w-full flex items-center justify-center gap-2.5 bg-[#1877F2] hover:bg-[#166FE5] hover:shadow-md rounded-xl py-2.5 transition-all active:scale-98"
                    >
                      <svg className="w-4 h-4" fill="white" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span className="font-semibold text-white text-xs">Facebook</span>
                    </button>

                    <button
                      onClick={() => handleSocialLogin('Apple')}
                      className="w-full flex items-center justify-center gap-2.5 bg-black hover:bg-gray-900 hover:shadow-md rounded-xl py-2.5 transition-all active:scale-98"
                    >
                      <svg className="w-4 h-4" fill="white" viewBox="0 0 24 24">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                      </svg>
                      <span className="font-semibold text-white text-xs">Apple</span>
                    </button>
                  </div>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-3 bg-white text-gray-500 font-medium">Hoặc SĐT + OTP</span>
                    </div>
                  </div>

                  {/* Phone Registration - Only Phone */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Số điện thoại
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="Nhập số điện thoại"
                          className="w-full pl-10 pr-3 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSendOTP}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl active:scale-98 transition-all"
                    >
                      Gửi mã OTP
                    </button>
                  </div>
                </>
              ) : registerStep === 'otp' ? (
                <>
                  {/* OTP Verification */}
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <p className="text-gray-600 text-xs">
                        Mã OTP đã được gửi đến
                      </p>
                      <p className="font-bold text-gray-800 text-sm">{phoneNumber}</p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5 text-center">
                        Nhập mã OTP
                      </label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="000000"
                        maxLength={6}
                        className="w-full text-center text-xl tracking-[0.5em] font-bold py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <button
                      onClick={handleVerifyOTP}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl active:scale-98 transition-all"
                    >
                      Xác nhận
                    </button>

                    <button
                      onClick={() => {
                        setRegisterStep('phone');
                        setOtp('');
                      }}
                      className="w-full text-blue-600 text-xs font-semibold hover:text-blue-700 transition-colors"
                    >
                      Gửi lại mã OTP
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Password Registration */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Mật khẩu
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Nhập mật khẩu"
                          className="w-full pl-10 pr-10 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Xác nhận mật khẩu
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Xác nhận mật khẩu"
                          className="w-full pl-10 pr-10 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleRegister}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl active:scale-98 transition-all"
                    >
                      Xác nhận
                    </button>

                    <button
                      onClick={() => {
                        setRegisterStep('phone');
                        setOtp('');
                      }}
                      className="w-full text-blue-600 text-xs font-semibold hover:text-blue-700 transition-colors"
                    >
                      Gửi lại mã OTP
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Terms */}
        <p className="text-center text-gray-500 text-[10px] mt-4 px-6 leading-relaxed">
          Bằng việc tiếp tục, bạn đồng ý với{' '}
          <span className="font-semibold text-blue-600">Điều khoản</span> và{' '}
          <span className="font-semibold text-blue-600">Chính sách bảo mật</span>
        </p>

        {/* Partner Code Input */}
        {authMode === 'login' && (
          <div className="mt-4">
            <button
              onClick={() => setShowPartnerInput(!showPartnerInput)}
              className="w-full text-xs text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              {showPartnerInput ? '▼' : '▶'} Bạn có mã đối tác?
            </button>
            
            {showPartnerInput && (
              <div className="mt-3 bg-white rounded-xl p-4 shadow-md">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Mã đối tác (tùy chọn)
                </label>
                <input
                  type="text"
                  value={partnerCode}
                  onChange={(e) => setPartnerCode(e.target.value.toUpperCase())}
                  placeholder="VD: DT001, DT002, DT003"
                  className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all uppercase"
                />
                <p className="text-[10px] text-gray-500 mt-2">
                  💡 Nhập mã đối tác nếu bạn thuộc một trung tâm/đại lý cụ thể
                </p>
              </div>
            )}
          </div>
        )}

        {/* Role Selection Buttons */}
        <div className="mt-6 space-y-3">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-gray-500 font-medium">Hoặc truy cập với vai trò</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleRoleLogin('staff')}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl active:scale-98 transition-all"
            >
              🧑‍💼 Nhân viên
            </button>
            <button
              onClick={() => handleRoleLogin('admin')}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl active:scale-98 transition-all"
            >
              👨‍💻 Quản trị
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
