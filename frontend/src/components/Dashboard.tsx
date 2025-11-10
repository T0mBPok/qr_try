import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, QrCode, Edit, Download, Share2, Trash2, Crown, LogOut, User, Settings, ChevronDown } from 'lucide-react';
import img7Fdec1905F104F7C9Bcc559A85B9Ea72Photoroom1 from "figma:asset/e6813539f17b4e045c58f9a6d3e588e5914c727f.png";
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';

type NavigationFunction = (page: 'home' | 'auth' | 'dashboard' | 'create-qr' | 'link-setup' | 'editor' | 'subscription') => void;

interface DashboardProps {
  onNavigate: NavigationFunction;
  onSelectQR: (qrId: string) => void;
  onEditPage: (qrId: string) => void;
  onLogout: () => void;
}

interface QRCodeItem {
  id: string;
  name: string;
  createdAt: string;
  scans: number;
  type: 'custom' | 'redirect';
  url?: string;
  preview: string;
}

export default function Dashboard({ onNavigate, onSelectQR, onEditPage, onLogout }: DashboardProps) {
  const [activeSection, setActiveSection] = useState<'qr-codes' | 'subscription'>('qr-codes');
  const [qrCodes, setQrCodes] = useState<QRCodeItem[]>([
    {
      id: '1',
      name: 'Моя визитка',
      createdAt: '2025-11-01',
      scans: 42,
      type: 'custom',
      preview: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://example.com/profile/1'
    },
    {
      id: '2',
      name: 'Instagram профиль',
      createdAt: '2025-11-05',
      scans: 128,
      type: 'redirect',
      url: 'https://instagram.com/username',
      preview: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://instagram.com/username'
    },
    {
      id: '3',
      name: 'Портфолио',
      createdAt: '2025-11-08',
      scans: 67,
      type: 'custom',
      preview: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://example.com/portfolio/3'
    }
  ]);

  const handleDeleteQR = (id: string) => {
    setQrCodes(qrCodes.filter(qr => qr.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#040404] relative overflow-x-hidden">
      {/* Background blur effect - Same as homepage */}
      <div className="absolute blur-[6.5px] filter h-[2914px] left-1/2 top-[24px] -translate-x-1/2 w-[1942px] max-w-[200%] pointer-events-none">
        <img 
          alt="" 
          className="absolute inset-0 max-w-none object-center object-cover opacity-15 pointer-events-none size-full" 
          src={img7Fdec1905F104F7C9Bcc559A85B9Ea72Photoroom1} 
        />
      </div>

      {/* Header Navigation - Integrated from Homepage */}
      <header className="relative z-10 max-w-[1920px] mx-auto px-4 md:px-8 lg:px-20 py-8 border-b border-white/10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('home')}
            className="cursor-pointer"
          >
            <div className="px-[30px] py-[10px] rounded-[50px]">
              <p className="font-['Roboto'] text-white">
                Логотип
              </p>
            </div>
          </motion.div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-16 font-['Roboto'] text-white">
            <motion.a 
              whileHover={{ scale: 1.1 }} 
              onClick={() => onNavigate('home')}
              className="cursor-pointer transition-colors hover:text-[#c89afc]"
            >
              Главная
            </motion.a>
            <motion.a whileHover={{ scale: 1.1 }} className="cursor-pointer transition-colors hover:text-[#c89afc]">
              Примеры QR
            </motion.a>
            <motion.a whileHover={{ scale: 1.1 }} className="cursor-pointer transition-colors hover:text-[#c89afc]">
              Инструкция
            </motion.a>
            <motion.a whileHover={{ scale: 1.1 }} className="cursor-pointer transition-colors hover:text-[#c89afc]">
              Контакты
            </motion.a>
          </nav>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-[30px] py-[10px] rounded-[50px] border-2 border-white/20 hover:border-white/40 transition-all bg-white/5 backdrop-blur-sm"
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white">
                    ИИ
                  </AvatarFallback>
                </Avatar>
                <span className="font-['Roboto'] text-white hidden sm:inline">Иван Иванов</span>
                <ChevronDown className="w-4 h-4 text-white/70" />
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-56 bg-[#1a1a1a] border-white/10 backdrop-blur-xl"
            >
              <div className="px-3 py-3 border-b border-white/10">
                <p className="font-['Roboto'] text-white">Иван Иванов</p>
                <p className="font-['Roboto'] text-white/50">ivan@example.com</p>
              </div>
              <DropdownMenuItem 
                onClick={() => onNavigate('dashboard')}
                className="text-white hover:bg-white/10 cursor-pointer font-['Roboto']"
              >
                <QrCode className="w-4 h-4 mr-2" />
                Мои QR-коды
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onNavigate('subscription')}
                className="text-white hover:bg-white/10 cursor-pointer font-['Roboto']"
              >
                <Crown className="w-4 h-4 mr-2" />
                Подписка
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-white/10 cursor-pointer font-['Roboto']">
                <Settings className="w-4 h-4 mr-2" />
                Настройки
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem 
                onClick={onLogout}
                className="text-[#df5950] hover:bg-[#df5950]/10 cursor-pointer font-['Roboto']"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Выйти
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Dashboard Content Container - Nested Account Layout */}
      <div className="relative z-10 max-w-[1920px] mx-auto px-4 md:px-8 lg:px-20 py-8 md:py-16">
        {/* Account Section Header with Sub-Navigation */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6"
          >
            {/* Breadcrumb / Account Indicator */}
            <div className="flex items-center gap-2 font-['Roboto'] text-white/50">
              <span 
                onClick={() => onNavigate('home')}
                className="cursor-pointer hover:text-white transition-colors"
              >
                Главная
              </span>
              <span>/</span>
              <span className="text-white">Личный кабинет</span>
            </div>

            {/* Sub-Navigation Tabs */}
            <div className="flex items-center justify-between flex-wrap gap-6">
              <div className="flex items-center gap-4 overflow-x-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveSection('qr-codes')}
                  className={`px-6 py-3 rounded-[50px] font-['Roboto'] transition-all whitespace-nowrap ${
                    activeSection === 'qr-codes'
                      ? 'bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white shadow-lg shadow-purple-500/30'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <QrCode className="w-5 h-5" />
                    Мои QR-коды
                  </span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNavigate('subscription')}
                  className={`px-6 py-3 rounded-[50px] font-['Roboto'] transition-all whitespace-nowrap ${
                    activeSection === 'subscription'
                      ? 'bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white shadow-lg shadow-purple-500/30'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Crown className="w-5 h-5" />
                    Подписка
                  </span>
                </motion.button>
              </div>

              {/* Create QR Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('create-qr')}
                className="bg-gradient-to-r from-[#7c6afa] to-[#c89afc] px-[30px] py-[10px] rounded-[50px] font-['Roboto'] text-white flex items-center gap-2 justify-center hover:shadow-lg hover:shadow-purple-500/30 transition-all whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                Создать QR-код
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Main Dashboard Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Page Title */}
          <div className="mb-12">
            <h1 className="font-['Roboto'] text-white mb-3">Мои QR-коды</h1>
            <p className="font-['Roboto'] text-white/70 leading-relaxed">
              Управляйте вашими цифровыми профилями и отслеживайте статистику
            </p>
          </div>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -5 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 transition-all hover:border-white/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-['Roboto'] text-white/70 mb-3 leading-relaxed">Всего QR-кодов</p>
                  <p className="font-['Roboto'] text-white">{qrCodes.length}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-[#7c6afa] to-[#c89afc] rounded-[20px] flex items-center justify-center">
                  <QrCode className="w-7 h-7 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -5 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 transition-all hover:border-white/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-['Roboto'] text-white/70 mb-3 leading-relaxed">Всего сканирований</p>
                  <p className="font-['Roboto'] text-white">
                    {qrCodes.reduce((acc, qr) => acc + qr.scans, 0)}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-[#c89afc] to-[#7c6afa] rounded-[20px] flex items-center justify-center">
                  <Share2 className="w-7 h-7 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ y: -5 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 transition-all hover:border-white/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-['Roboto'] text-white/70 mb-3 leading-relaxed">Подписка</p>
                  <p className="font-['Roboto'] text-white">Бесплатная</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-[#7c6afa] to-[#c89afc] rounded-[20px] flex items-center justify-center">
                  <Crown className="w-7 h-7 text-white" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* QR Codes Grid */}
          {qrCodes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px]"
            >
              <div className="w-24 h-24 bg-gradient-to-r from-[#7c6afa]/20 to-[#c89afc]/20 rounded-[24px] flex items-center justify-center mx-auto mb-8">
                <QrCode className="w-12 h-12 text-white/30" />
              </div>
              <h3 className="font-['Roboto'] text-white mb-4 leading-relaxed">У вас пока нет QR-кодов</h3>
              <p className="font-['Roboto'] text-white/70 mb-10 leading-relaxed max-w-md mx-auto px-6">
                Создайте свой первый QR-код и начните делиться своим цифровым профилем
              </p>
              <Button
                onClick={() => onNavigate('create-qr')}
                className="bg-gradient-to-r from-[#7c6afa] to-[#c89afc] hover:opacity-90 h-12 px-8 rounded-[50px]"
              >
                <Plus className="w-5 h-5 mr-2" />
                Создать первый QR-код
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {qrCodes.map((qr, index) => (
                <motion.div
                  key={qr.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-[32px] overflow-hidden hover:border-[#7c6afa]/50 transition-all group hover:scale-[1.02] duration-300">
                    <CardHeader className="pb-4 p-8">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-['Roboto'] text-white mb-3 leading-relaxed">{qr.name}</h3>
                          <p className="font-['Roboto'] text-white/50 leading-relaxed">
                            Создан: {new Date(qr.createdAt).toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="text-white/50 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5">
                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <circle cx="10" cy="5" r="1.5" fill="currentColor" />
                                <circle cx="10" cy="10" r="1.5" fill="currentColor" />
                                <circle cx="10" cy="15" r="1.5" fill="currentColor" />
                              </svg>
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-[#1a1a1a] border-white/10 backdrop-blur-xl">
                            <DropdownMenuItem onClick={() => handleDeleteQR(qr.id)} className="text-[#df5950] focus:text-[#df5950] focus:bg-[#df5950]/10 cursor-pointer font-['Roboto']">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Удалить
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>

                    <CardContent className="pb-4 px-8">
                      <div className="bg-white rounded-[24px] p-6 mb-6 flex items-center justify-center">
                        <img src={qr.preview} alt={qr.name} className="w-full max-w-[200px] h-auto" />
                      </div>
                      <div className="flex items-center justify-between text-white/70 font-['Roboto'] leading-relaxed">
                        <span>{qr.type === 'custom' ? 'Кастомная страница' : 'Редирект'}</span>
                        <span>{qr.scans} сканирований</span>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-4 pb-8 px-8 border-t border-white/10 gap-3">
                      <Button
                        onClick={() => qr.type === 'custom' ? onEditPage(qr.id) : onSelectQR(qr.id)}
                        variant="outline"
                        className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10 h-11 rounded-xl font-['Roboto']"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Редактировать
                      </Button>
                      <Button
                        variant="outline"
                        className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-11 w-11 p-0 rounded-xl"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Footer - Matching Homepage */}
        <footer className="relative z-10 max-w-[1920px] mx-auto px-4 md:px-8 lg:px-20 py-16 mt-24 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="font-['Roboto'] text-white mb-4 leading-relaxed">О сервисе</h3>
              <p className="font-['Roboto'] text-white/70 leading-relaxed">
                Платформа для создания уникальных цифровых профилей с QR-кодами.
              </p>
            </div>
            <div>
              <h3 className="font-['Roboto'] text-white mb-4 leading-relaxed">Навигация</h3>
              <ul className="space-y-3 font-['Roboto'] text-white/70">
                <li 
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer leading-relaxed"
                >
                  Главная
                </li>
                <li className="hover:text-white transition-colors cursor-pointer leading-relaxed">Примеры QR</li>
                <li className="hover:text-white transition-colors cursor-pointer leading-relaxed">Инструкция</li>
                <li className="hover:text-white transition-colors cursor-pointer leading-relaxed">Контакты</li>
              </ul>
            </div>
            <div>
              <h3 className="font-['Roboto'] text-white mb-4 leading-relaxed">Контакты</h3>
              <p className="font-['Roboto'] text-white/70 leading-relaxed mb-2">Email: info@qrclothes.com</p>
              <p className="font-['Roboto'] text-white/70 leading-relaxed">Телефон: +7 (999) 123-45-67</p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <p className="font-['Roboto'] text-white/50 leading-relaxed">© 2025 QR Clothes. Все права защищены.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
