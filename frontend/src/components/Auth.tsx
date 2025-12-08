import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import api from '../services/api';

type Page = 'home' | 'dashboard' | 'auth' | 'qr-creator' | 'qr-settings' | 'page-editor' | 'subscription';

interface AuthProps {
  onLogin: () => void;
  onNavigate: (page: Page) => void;
}

export function Auth({ onLogin, onNavigate }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const handlePasswordChange = (password: string) => {
    setFormData({ ...formData, password });
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Неверный формат email';
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Пароль должен содержать минимум 8 символов';
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Имя обязательно';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Пароли не совпадают';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        // Login
        await api.user.login({
          email: formData.email,
          password: formData.password
        });
      } else {
        // Register
        await api.user.register({
          email: formData.email,
          password: formData.password,
          username: formData.name
        });
      }
      
      // Success - notify parent
      onLogin();
    } catch (err: any) {
      console.error('Auth error:', err);
      setErrors({ 
        general: err.message || (isLogin ? 'Неверный email или пароль' : 'Ошибка регистрации. Возможно, пользователь уже существует.') 
      });
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return '#df5950';
    if (passwordStrength === 2) return '#f0a500';
    if (passwordStrength === 3) return '#90ee90';
    return '#7c6afa';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'Слабый';
    if (passwordStrength === 2) return 'Средний';
    if (passwordStrength === 3) return 'Хороший';
    return 'Отличный';
  };

  return (
    <div className="min-h-screen bg-[#040404] relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#7c6afa]/10 via-transparent to-[#c89afc]/10" />
      
      {/* Back button */}
      <button
        onClick={() => onNavigate('home')}
        className="absolute top-4 left-4 sm:top-8 sm:left-8 z-20 px-4 py-2 sm:px-6 sm:py-3 rounded-full border-2 border-white/20 text-white hover:bg-white/10 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
      >
        <span className="font-['Roboto']">← Назад</span>
      </button>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-16 sm:py-12">
        <div className="w-full max-w-md">
          {/* Auth Card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
            {/* Logo/Title */}
            <div className="text-center mb-8">
              <h1 className="font-['Roboto'] text-3xl bg-gradient-to-r from-[#7c6afa] to-[#c89afc] bg-clip-text text-transparent mb-2">
                {isLogin ? 'Вход в аккаунт' : 'Регистрация'}
              </h1>
              <p className="font-['Roboto'] text-white/60">
                {isLogin ? 'Добро пожаловать обратно' : 'Создайте свой аккаунт'}
              </p>
            </div>

            {/* Toggle Login/Register */}
            <div className="flex gap-2 bg-white/5 rounded-full p-1 mb-8">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 rounded-full font-['Roboto'] transition-all duration-300 ${
                  isLogin 
                    ? 'bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white' 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Вход
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 rounded-full font-['Roboto'] transition-all duration-300 ${
                  !isLogin 
                    ? 'bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white' 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Регистрация
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field (Register only) */}
              {!isLogin && (
                <div className="space-y-2">
                  <label className="font-['Roboto'] text-white/80 text-sm">Имя</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:border-[#7c6afa] focus:outline-none transition-colors font-['Roboto']"
                      placeholder="Введите ваше имя"
                    />
                  </div>
                  {errors.name && (
                    <div className="flex items-center gap-2 text-[#df5950] text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span className="font-['Roboto']">{errors.name}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label className="font-['Roboto'] text-white/80 text-sm">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:border-[#7c6afa] focus:outline-none transition-colors font-['Roboto']"
                    placeholder="email@example.com"
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center gap-2 text-[#df5950] text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-['Roboto']">{errors.email}</span>
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="font-['Roboto'] text-white/80 text-sm">Пароль</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:border-[#7c6afa] focus:outline-none transition-colors font-['Roboto']"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center gap-2 text-[#df5950] text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-['Roboto']">{errors.password}</span>
                  </div>
                )}
                
                {/* Password Strength Indicator (Register only) */}
                {!isLogin && formData.password && (
                  <div className="space-y-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className="h-1 flex-1 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: level <= passwordStrength ? getPasswordStrengthColor() : 'rgba(255,255,255,0.1)'
                          }}
                        />
                      ))}
                    </div>
                    <p className="font-['Roboto'] text-sm" style={{ color: getPasswordStrengthColor() }}>
                      Надежность: {getPasswordStrengthText()}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password (Register only) */}
              {!isLogin && (
                <div className="space-y-2">
                  <label className="font-['Roboto'] text-white/80 text-sm">Подтвердите пароль</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:border-[#7c6afa] focus:outline-none transition-colors font-['Roboto']"
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <div className="flex items-center gap-2 text-[#df5950] text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span className="font-['Roboto']">{errors.confirmPassword}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Forgot Password (Login only) */}
              {isLogin && (
                <div className="text-right">
                  <button
                    type="button"
                    className="font-['Roboto'] text-sm text-[#c89afc] hover:text-[#7c6afa] transition-colors"
                  >
                    Забыли пароль?
                  </button>
                </div>
              )}

              {/* General Error */}
              {errors.general && (
                <div className="flex items-center gap-2 p-4 bg-[#df5950]/10 border border-[#df5950]/30 rounded-xl text-[#df5950]">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="font-['Roboto'] text-sm">{errors.general}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white font-['Roboto'] transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
              </button>

              {/* Social Auth */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-[#040404] font-['Roboto'] text-white/40 text-sm">или</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onLogin}
                className="w-full py-3 rounded-xl border-2 border-white/10 text-white font-['Roboto'] hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Продолжить с Google
              </button>
            </form>
          </div>

          {/* Privacy Notice */}
          <p className="font-['Roboto'] text-white/40 text-xs text-center mt-6 leading-relaxed">
            Регистрируясь, вы соглашаетесь с условиями использования и политикой конфиденциальности. 
            Figma Make не предназначена для сбора персональных данных или защиты конфиденциальной информации.
          </p>
        </div>
      </div>
    </div>
  );
}