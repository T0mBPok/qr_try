import { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

type NavigationFunction = (page: 'home' | 'auth' | 'dashboard' | 'create-qr' | 'link-setup' | 'editor' | 'subscription') => void;

interface AuthPageProps {
  onLogin: () => void;
  onNavigate: NavigationFunction;
}

export default function AuthPage({ onLogin, onNavigate }: AuthPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const handlePasswordChange = (password: string) => {
    setSignupPassword(password);
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  const getStrengthColor = () => {
    if (passwordStrength < 25) return '#df5950';
    if (passwordStrength < 50) return '#ff9800';
    if (passwordStrength < 75) return '#ffd700';
    return '#4caf50';
  };

  const getStrengthText = () => {
    if (passwordStrength < 25) return 'Слабый';
    if (passwordStrength < 50) return 'Средний';
    if (passwordStrength < 75) return 'Хороший';
    return 'Отличный';
  };

  return (
    <div className="min-h-screen bg-[#040404] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-gradient-to-r from-[#7c6afa]/20 to-[#c89afc]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-r from-[#c89afc]/20 to-[#7c6afa]/20 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[480px] relative z-10"
      >
        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate('home')}
          className="mb-8 text-white/70 hover:text-white transition-colors font-['Roboto'] flex items-center gap-2"
        >
          ← Назад на главную
        </motion.button>

        {/* Auth Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 md:p-12 shadow-2xl">
          <h1 className="font-['Roboto'] text-white text-center mb-8">
            Добро пожаловать
          </h1>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/5">
              <TabsTrigger value="login" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#7c6afa] data-[state=active]:to-[#c89afc]">
                Вход
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#7c6afa] data-[state=active]:to-[#c89afc]">
                Регистрация
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-white/90 font-['Roboto']">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#7c6afa] transition-colors h-12"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-white/90 font-['Roboto']">Пароль</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="pl-12 pr-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#7c6afa] transition-colors h-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button type="button" className="text-[#c89afc] hover:text-[#7c6afa] transition-colors font-['Roboto']">
                    Забыли пароль?
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-[#7c6afa] to-[#c89afc] hover:opacity-90 transition-opacity font-['Roboto']"
                >
                  Войти
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-[#040404] px-4 text-white/50 font-['Roboto']">или</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-12"
                  >
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-12"
                  >
                    Facebook
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-white/90 font-['Roboto']">Имя</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Ваше имя"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#7c6afa] transition-colors h-12"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-white/90 font-['Roboto']">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#7c6afa] transition-colors h-12"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-white/90 font-['Roboto']">Пароль</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      className="pl-12 pr-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#7c6afa] transition-colors h-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {signupPassword && (
                    <div className="space-y-2 mt-2">
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${passwordStrength}%` }}
                          transition={{ duration: 0.3 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: getStrengthColor() }}
                        />
                      </div>
                      <p className="font-['Roboto'] text-white/70" style={{ color: getStrengthColor() }}>
                        {getStrengthText()}
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-[#7c6afa] to-[#c89afc] hover:opacity-90 transition-opacity font-['Roboto']"
                >
                  Зарегистрироваться
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-[#040404] px-4 text-white/50 font-['Roboto']">или</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-12"
                  >
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-12"
                  >
                    Facebook
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        <p className="text-center text-white/50 mt-6 font-['Roboto']">
          Регистрируясь, вы соглашаетесь с{' '}
          <span className="text-[#c89afc] hover:text-[#7c6afa] cursor-pointer">условиями использования</span>
        </p>
      </motion.div>
    </div>
  );
}
