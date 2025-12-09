import { useState, useEffect } from 'react';
import { Plus, QrCode, Edit, Trash2, ExternalLink, Settings, LogOut, Crown, Download, Eye, Zap, TrendingUp, Sparkles, Activity, AlertTriangle, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import bgImage from 'figma:asset/d172e93496736130643e676214481166b0b39a36.png';
import { Logo } from './Logo';
import api from '../services/api';

type Page = 'home' | 'dashboard' | 'auth' | 'qr-creator' | 'qr-settings' | 'page-editor' | 'subscription';

interface QRCodeItem {
  id: string;
  name: string;
  scans: number;
  createdAt: string;
  type: 'custom' | 'redirect';
  url?: string;
  preview: string;
  description?: string;
  link?: string; // Добавить если используете
  src?: string;  // Добавить если используете
}

interface DashboardProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  onEditQR: (qrId: string) => void;
  onEditPage: (qrId: string) => void;
}

export function Dashboard({ onNavigate, onLogout, onEditQR, onEditPage }: DashboardProps) {
  const [qrCodes, setQrCodes] = useState<QRCodeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'custom' | 'redirect'>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Загрузка QR-кодов при монтировании
  useEffect(() => {
    loadQRCodes();
  }, []);

  const loadQRCodes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Загрузка QR-кодов...');
      const response = await api.qr.getAll();
      
      console.log('📦 Получен ответ от API:', response);
      
      // Бэкенд возвращает массив QROut в data
      if (!response || !response.data) {
        console.warn('⚠️ Ответ от API не содержит данных');
        setQrCodes([]);
        return;
      }
      
      // Проверяем, что data является массивом
      const qrData = Array.isArray(response.data) ? response.data : [];
      
      // Преобразование в формат QRCodeItem для Dashboard
      const qrItems: QRCodeItem[] = qrData.map(qr => ({
        id: qr.id,
        name: qr.name,
        scans: 0, // Пока нет данных о сканированиях в QROut
        createdAt: new Date().toLocaleDateString('ru-RU'), // Нет created_at в QROut
        type: qr.link ? 'redirect' : 'custom', // Определяем тип по наличию ссылки
        url: qr.link, // Ссылка для перенаправления
        preview: qr.src || '', // URL изображения QR-кода
        description: qr.description || '', // Описание из бэкенда
      }));
      
      setQrCodes(qrItems);
      console.log('✅ Загружено QR-кодов:', qrItems.length);
    } catch (err: any) {
      console.error('❌ Ошибка загрузки QR-кодов:', err);
      setError(err.message || 'Не удалось загрузить QR-коды');
      setQrCodes([]);
    } finally {
      setLoading(false);
    }
    console.log('🔍 Тип response:', typeof response);
    console.log('🔍 Тип response.data:', typeof response.data);
    console.log('🔍 response.data является массивом?:', Array.isArray(response.data));
    console.log('🔍 Первый элемент:', response.data?.[0]);
  };

  const filteredQRCodes = activeTab === 'all' 
    ? qrCodes 
    : qrCodes.filter(qr => qr.type === activeTab);

  const handleDelete = async (id: string) => {
    try {
      setDeleting(true);
      console.log('🗑️ Удаление QR-кода:', id);
      
      await api.qr.delete(id);
      
      // Обновить локальный state
      setQrCodes(qrCodes.filter(qr => qr.id !== id));
      setDeleteConfirm(null);
      
      console.log('✅ QR-код удален');
    } catch (err: any) {
      console.error('❌ Ошибка удаления:', err);
      alert('Не удалось удалить QR-код: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = async () => {
    try {
      console.log('👋 Выход из системы...');
      await api.user.logout();
      onLogout();
    } catch (err: any) {
      console.error('❌ Ошибка выхода:', err);
      // Даже если запрос failed, выполняем logout на frontend
      onLogout();
    }
  };

  const qrToDelete = qrCodes.find(qr => qr.id === deleteConfirm);

  return (
    <div className="min-h-screen bg-[#040404] relative overflow-hidden">
      {/* Animated Background with Image */}
      <div className="fixed inset-0 z-0">
        {/* Background Image */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(4px)'
          }}
        />
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#7c6afa]/20 via-transparent to-[#c89afc]/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,106,250,0.1),transparent_50%)]" />
        
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-20" 
          style={{
            backgroundImage: `
              linear-gradient(rgba(124,106,250,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(124,106,250,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* Floating Particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-[#7c6afa] rounded-full animate-pulse" />
        <div className="absolute top-40 right-40 w-3 h-3 bg-[#c89afc] rounded-full animate-pulse delay-100" />
        <div className="absolute bottom-40 left-1/3 w-2 h-2 bg-[#df5950] rounded-full animate-pulse delay-200" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <div className="bg-[#040404] border border-[#df5950]/30 rounded-3xl p-8 max-w-md w-full shadow-2xl shadow-[#df5950]/20 relative overflow-hidden">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#df5950]/10 to-transparent pointer-events-none" />
              
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 rounded-2xl bg-[#df5950]/20 border border-[#df5950]/30">
                    <AlertTriangle className="w-8 h-8 text-[#df5950]" />
                  </div>
                  <div>
                    <h3 className="font-['Roboto'] text-xl text-white">Удалить QR-код?</h3>
                    <p className="font-['Roboto'] text-white/60 text-sm">Это действие нельзя отменить</p>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/10">
                  <p className="font-['Roboto'] text-white/80 mb-2">
                    Вы уверены, что хотите удалить:
                  </p>
                  <p className="font-['Roboto'] text-white">
                    &quot;{qrToDelete?.name}&quot;
                  </p>
                  <p className="font-['Roboto'] text-white/60 text-sm mt-2">
                    Сканирований: {qrToDelete?.scans}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-all duration-300 font-['Roboto']"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
                    className="flex-1 px-6 py-3 rounded-xl bg-[#df5950] text-white hover:bg-[#df5950]/90 transition-all duration-300 font-['Roboto'] flex items-center justify-center gap-2 shadow-lg shadow-[#df5950]/30"
                  >
                    {deleting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top Navigation */}
        <nav className="border-b border-white/10 bg-black/40 backdrop-blur-2xl sticky top-0 z-40">
          <div className="container mx-auto px-4 lg:px-8 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <button 
                onClick={() => onNavigate('home')}
                className="transition-all duration-300 hover:scale-105"
              >
                <Logo variant="gradient" size="md" />
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigate('subscription')}
                  className="group relative flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#c89afc] text-[#c89afc] overflow-hidden transition-all duration-300 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#7c6afa]/20 to-[#c89afc]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Crown className="w-4 h-4 relative z-10" />
                  <span className="font-['Roboto'] hidden sm:inline relative z-10">Premium</span>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 text-white hover:bg-white/10 transition-all duration-300 hover:border-white/40"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-['Roboto'] hidden sm:inline">Выход</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-72 shrink-0">
              <div className="bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/10 p-6 sticky top-24 shadow-2xl shadow-purple-500/10">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7c6afa] to-[#c89afc] flex items-center justify-center">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-['Roboto'] text-white/60 text-xs">Пользователь</p>
                      <p className="font-['Roboto'] text-white">User#1234</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button className="group w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white transition-all duration-300 shadow-lg shadow-purple-500/30">
                    <QrCode className="w-5 h-5" />
                    <span className="font-['Roboto']">Мои QR-коды</span>
                    <Zap className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  
                  <button 
                    onClick={() => onNavigate('subscription')}
                    className="group w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10"
                  >
                    <Settings className="w-5 h-5" />
                    <span className="font-['Roboto']">Настройки</span>
                    <Zap className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>

                {/* Quick Stats in Sidebar */}
                <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-['Roboto'] text-white/60 text-sm">План</span>
                    <span className="font-['Roboto'] text-white text-sm px-3 py-1 rounded-full bg-white/10">Free</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-['Roboto'] text-white/60 text-sm">Лимит</span>
                    <span className="font-['Roboto'] text-[#c89afc] text-sm">{qrCodes.length}/5</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="font-['Roboto'] text-4xl lg:text-5xl bg-gradient-to-r from-[#7c6afa] via-[#c89afc] to-[#7c6afa] bg-clip-text text-transparent animate-pulse">
                    Панель управления
                  </h1>
                  <Sparkles className="w-8 h-8 text-[#c89afc] animate-pulse" />
                </div>
                <p className="font-['Roboto'] text-white/60 text-lg">
                  Управляйте вашими QR-кодами и цифровыми профилями
                </p>
              </div>

              {/* Stats - Futuristic Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="group relative bg-black/40 backdrop-blur-2xl rounded-2xl border border-white/10 p-6 overflow-hidden transition-all duration-300 hover:border-[#7c6afa] hover:shadow-lg hover:shadow-purple-500/30">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#7c6afa]/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                  <div className="relative flex items-center gap-4">
                    <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#7c6afa] to-[#c89afc] shadow-lg">
                      <QrCode className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-['Roboto'] text-white/60 text-sm mb-1">Всего QR-кодов</p>
                      <p className="font-['Roboto'] text-3xl text-white">{qrCodes.length}</p>
                    </div>
                  </div>
                </div>

                <div className="group relative bg-black/40 backdrop-blur-2xl rounded-2xl border border-white/10 p-6 overflow-hidden transition-all duration-300 hover:border-[#c89afc] hover:shadow-lg hover:shadow-pink-500/30">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#c89afc]/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                  <div className="relative flex items-center gap-4">
                    <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#c89afc] to-[#df5950] shadow-lg">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-['Roboto'] text-white/60 text-sm mb-1">Всего сканирований</p>
                      <p className="font-['Roboto'] text-3xl text-white">
                        {qrCodes.reduce((sum, qr) => sum + qr.scans, 0)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group relative bg-black/40 backdrop-blur-2xl rounded-2xl border border-white/10 p-6 overflow-hidden transition-all duration-300 hover:border-[#df5950] hover:shadow-lg hover:shadow-red-500/30">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#df5950]/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                  <div className="relative flex items-center gap-4">
                    <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#df5950] to-[#7c6afa] shadow-lg">
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-['Roboto'] text-white/60 text-sm mb-1">Статус аккаунта</p>
                      <p className="font-['Roboto'] text-3xl text-white">Free</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Create New Button - More Futuristic */}
              <button
                onClick={() => onNavigate('qr-creator')}
                className="group relative w-full md:w-auto mb-8 flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white font-['Roboto'] text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-[1.02]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#c89afc] to-[#7c6afa] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Plus className="w-6 h-6 relative z-10" />
                <span className="relative z-10">Создать новый QR-код</span>
                <Zap className="w-5 h-5 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              {/* Filters - Futuristic Pills */}
              <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`group relative px-8 py-3 rounded-full font-['Roboto'] transition-all duration-300 whitespace-nowrap overflow-hidden ${
                    activeTab === 'all'
                      ? 'bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white shadow-lg shadow-purple-500/50'
                      : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {activeTab === 'all' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#c89afc] to-[#7c6afa] opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                  <span className="relative z-10">Все ({qrCodes.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('custom')}
                  className={`group relative px-8 py-3 rounded-full font-['Roboto'] transition-all duration-300 whitespace-nowrap overflow-hidden ${
                    activeTab === 'custom'
                      ? 'bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white shadow-lg shadow-purple-500/50'
                      : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {activeTab === 'custom' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#c89afc] to-[#7c6afa] opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                  <span className="relative z-10">Пользовательские ({qrCodes.filter(q => q.type === 'custom').length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('redirect')}
                  className={`group relative px-8 py-3 rounded-full font-['Roboto'] transition-all duration-300 whitespace-nowrap overflow-hidden ${
                    activeTab === 'redirect'
                      ? 'bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white shadow-lg shadow-purple-500/50'
                      : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {activeTab === 'redirect' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#c89afc] to-[#7c6afa] opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                  <span className="relative z-10">Перенаправления ({qrCodes.filter(q => q.type === 'redirect').length})</span>
                </button>
              </div>

              {/* QR Codes Grid - Futuristic Cards with Real QR Codes */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 text-[#7c6afa] animate-spin mx-auto mb-4" />
                    <p className="font-['Roboto'] text-white/60">Загрузка QR-кодов...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-20 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#df5950]/5 to-[#c89afc]/5 rounded-3xl" />
                  <div className="relative">
                    <div className="inline-flex p-6 rounded-full bg-[#df5950]/10 border border-[#df5950]/30 mb-6">
                      <AlertTriangle className="w-16 h-16 text-[#df5950]" />
                    </div>
                    <p className="font-['Roboto'] text-white mb-4">
                      {error}
                    </p>
                    <button
                      onClick={loadQRCodes}
                      className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white font-['Roboto'] transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 overflow-hidden"
                    >
                      <span className="relative z-10">Попробовать снова</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredQRCodes.map((qr) => (
                    <div
                      key={qr.id}
                      className="group relative bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden transition-all duration-300 hover:border-[#7c6afa] hover:shadow-2xl hover:shadow-purple-500/30 hover:-translate-y-1"
                    >
                      {/* Animated Glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#7c6afa]/10 via-transparent to-[#c89afc]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      
                      {/* QR Preview with Real QR Code */}
                      <div className="relative aspect-square bg-gradient-to-br from-[#7c6afa]/20 to-[#c89afc]/20 flex items-center justify-center p-8">
                        <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center p-6 shadow-2xl">
                          <QRCodeSVG
                            value={qr.preview}
                            size={200}
                            level="H"
                            includeMargin={false}
                            fgColor="#040404"
                            bgColor="#ffffff"
                          />
                        </div>
                        
                        {/* Hover Overlay with Actions */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6 gap-3">
                          <button className="p-3 bg-white/20 backdrop-blur-md rounded-xl hover:bg-white/30 transition-all duration-300 shadow-lg hover:scale-110">
                            <Download className="w-5 h-5 text-white" />
                          </button>
                          <button className="p-3 bg-white/20 backdrop-blur-md rounded-xl hover:bg-white/30 transition-all duration-300 shadow-lg hover:scale-110">
                            <Eye className="w-5 h-5 text-white" />
                          </button>
                        </div>

                        {/* Type Badge */}
                        <div className="absolute top-4 right-4">
                          <div className={`px-3 py-1.5 rounded-full text-xs font-['Roboto'] backdrop-blur-md border ${
                            qr.type === 'custom' 
                              ? 'bg-[#7c6afa]/80 text-white border-[#7c6afa]' 
                              : 'bg-[#c89afc]/80 text-white border-[#c89afc]'
                          }`}>
                            {qr.type === 'custom' ? 'Custom' : 'Redirect'}
                          </div>
                        </div>
                      </div>

                      {/* Info Section */}
                      <div className="relative p-6 space-y-4">
                        <div>
                          <h3 className="font-['Roboto'] text-white text-lg mb-1">{qr.name}</h3>
                          <p className="font-['Roboto'] text-white/40 text-sm">
                            {qr.type === 'custom' ? 'Пользовательская страница' : 'Перенаправление'}
                          </p>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-[#c89afc]" />
                            <span className="font-['Roboto'] text-white/60 text-sm">Сканирований:</span>
                          </div>
                          <span className="font-['Roboto'] text-[#c89afc] font-medium">{qr.scans}</span>
                        </div>

                        {qr.url && (
                          <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
                            <ExternalLink className="w-4 h-4 text-white/40 shrink-0" />
                            <span className="font-['Roboto'] text-white/60 text-sm truncate">{qr.url}</span>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                          {qr.type === 'custom' ? (
                            <button
                              onClick={() => onEditPage(qr.id)}
                              className="group/btn relative flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white font-['Roboto'] text-sm transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-[#c89afc] to-[#7c6afa] opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                              <Edit className="w-4 h-4 relative z-10" />
                              <span className="relative z-10">Редактировать</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => onEditQR(qr.id)}
                              className="group/btn relative flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white font-['Roboto'] text-sm transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-[#c89afc] to-[#7c6afa] opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                              <Settings className="w-4 h-4 relative z-10" />
                              <span className="relative z-10">Настроить</span>
                            </button>
                          )}
                          
                          <button 
                            onClick={() => setDeleteConfirm(qr.id)}
                            className="px-4 py-3 rounded-xl border border-[#df5950]/50 text-[#df5950] hover:bg-[#df5950]/10 transition-all duration-300 hover:border-[#df5950] hover:shadow-lg hover:shadow-red-500/30"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredQRCodes.length === 0 && (
                <div className="text-center py-20 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#7c6afa]/5 to-[#c89afc]/5 rounded-3xl" />
                  <div className="relative">
                    <div className="inline-flex p-6 rounded-full bg-white/5 border border-white/10 mb-6">
                      <QrCode className="w-16 h-16 text-white/20" />
                    </div>
                    <p className="font-['Roboto'] text-white/60 text-lg mb-6">
                      {activeTab === 'all' 
                        ? 'У вас пока нет QR-кодов' 
                        : `Нет ${activeTab === 'custom' ? 'пользовательских' : 'перенаправлений'} QR-кодов`}
                    </p>
                    <button
                      onClick={() => onNavigate('qr-creator')}
                      className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white font-['Roboto'] transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#c89afc] to-[#7c6afa] opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Plus className="w-5 h-5 relative z-10" />
                      <span className="relative z-10">Создать первый QR-код</span>
                    </button>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}