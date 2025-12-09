import { useState, useEffect } from 'react';
import { ArrowLeft, Save, ExternalLink, Copy, Check, Eye, BarChart, Download, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import api from '../services/api';

type Page = 'home' | 'dashboard' | 'auth' | 'qr-creator' | 'qr-settings' | 'page-editor' | 'subscription';

interface QRSettingsProps {
  onNavigate: (page: Page) => void;
  qrId: string | null;
  onEditPage: (qrId: string) => void;
}

export function QRSettings({ onNavigate, qrId, onEditPage }: QRSettingsProps) {
  const [linkType, setLinkType] = useState<'external' | 'custom'>('external');
  const [externalUrl, setExternalUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // API Integration states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrData, setQrData] = useState<any>(null);
  const [qrName, setQrName] = useState('');
  const [isActive, setIsActive] = useState(true);

  const generatedQRUrl = qrData?.qr_url || `https://qrwear.app/scan/${qrId || 'abc123'}`;

  // Загрузка QR-кода при монтировании
  useEffect(() => {
    if (qrId) {
      loadQRData();
    } else {
      setLoading(false);
      setError('QR ID не указан');
    }
  }, [qrId]);

  const loadQRData = async () => {
    if (!qrId) return;

    try {
      setLoading(true);
      setError(null);
      
      console.log('📥 Загрузка данных QR-кода:', qrId);
      const response = await api.qr.getById(qrId);
      
      const qr = response;
      setQrData(qr);
      setQrName(qr.name);
      setIsActive(qr.is_active);
      
      // TODO: Определить тип ссылки из данных
      // setLinkType(...);
      // setExternalUrl(...);
      
      console.log('✅ QR-код загружен:', qr);
    } catch (err: any) {
      console.error('❌ Ошибка загрузки QR-кода:', err);
      setError(err.message || 'Не удалось загрузить QR-код');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedQRUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!qrId) return;

    try {
      setSaving(true);
      setError(null);
      
      console.log('💾 Сохранение настроек QR-кода:', {
        qrId,
        name: qrName,
        is_active: isActive,
        link_type: linkType,
        external_url: externalUrl
      });

      await api.qr.update(qrId, {
        name: qrName,
        is_active: isActive,
        // TODO: Добавить поля для типа ссылки и URL когда backend будет готов
        // redirect_type: linkType,
        // redirect_url: externalUrl
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      
      console.log('✅ Настройки сохранены');
      
      // Перезагрузить данные
      await loadQRData();
    } catch (err: any) {
      console.error('❌ Ошибка сохранения:', err);
      setError(err.message || 'Не удалось сохранить настройки');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040404] relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#7c6afa]/10 via-transparent to-[#c89afc]/10" />

      {/* Back button */}
      <button
        onClick={() => onNavigate('dashboard')}
        className="absolute top-4 left-4 sm:top-8 sm:left-8 z-20 px-4 py-2 sm:px-6 sm:py-3 rounded-full border-2 border-white/20 text-white hover:bg-white/10 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
      >
        <span className="font-['Roboto'] flex items-center gap-2">
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">К панели</span>
        </span>
      </button>

      <div className="relative z-10 container mx-auto px-4 py-16 sm:py-12 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-5xl">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="font-['Roboto'] text-2xl sm:text-3xl lg:text-4xl bg-gradient-to-r from-[#7c6afa] to-[#c89afc] bg-clip-text text-transparent mb-2">
              Настройка перенаправления
            </h1>
            <p className="font-['Roboto'] text-white/60">
              Настройте, куда будет вести ваш QR-код
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-[#7c6afa] animate-spin mx-auto mb-4" />
                <p className="font-['Roboto'] text-white/60">Загрузка настроек...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-20 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#df5950]/5 to-[#c89afc]/5 rounded-3xl" />
              <div className="relative">
                <div className="inline-flex p-6 rounded-full bg-[#df5950]/10 border border-[#df5950]/30 mb-6">
                  <AlertCircle className="w-16 h-16 text-[#df5950]" />
                </div>
                <p className="font-['Roboto'] text-white mb-4">{error}</p>
                <button
                  onClick={loadQRData}
                  className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white font-['Roboto'] transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 overflow-hidden"
                >
                  <span className="relative z-10">Попробовать снова</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Settings */}
              <div className="lg:col-span-2 space-y-6">
                {/* Link Type Selection */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
                  <h2 className="font-['Roboto'] text-xl text-white mb-6">Тип ссылки</h2>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-8">
                    <button
                      onClick={() => setLinkType('external')}
                      className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                        linkType === 'external'
                          ? 'border-[#7c6afa] bg-[#7c6afa]/10'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <ExternalLink className="w-8 h-8 text-[#c89afc] mb-3" />
                      <h3 className="font-['Roboto'] text-white mb-2">Внешняя ссылка</h3>
                      <p className="font-['Roboto'] text-white/60 text-sm leading-relaxed">
                        Перенаправить на любой URL
                      </p>
                    </button>

                    <button
                      onClick={() => setLinkType('custom')}
                      className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                        linkType === 'custom'
                          ? 'border-[#7c6afa] bg-[#7c6afa]/10'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <Eye className="w-8 h-8 text-[#c89afc] mb-3" />
                      <h3 className="font-['Roboto'] text-white mb-2">Своя страница</h3>
                      <p className="font-['Roboto'] text-white/60 text-sm leading-relaxed">
                        Создать кастомную страницу
                      </p>
                    </button>
                  </div>

                  {/* External URL Input */}
                  {linkType === 'external' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="font-['Roboto'] text-white/80">URL для перенаправления</label>
                        <input
                          type="url"
                          value={externalUrl}
                          onChange={(e) => setExternalUrl(e.target.value)}
                          className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:border-[#7c6afa] focus:outline-none transition-colors font-['Roboto']"
                          placeholder="https://instagram.com/yourprofile"
                        />
                        <p className="font-['Roboto'] text-white/40 text-sm">
                          Введите полный URL, включая https://
                        </p>
                      </div>

                      {/* Quick Links */}
                      <div className="space-y-2">
                        <label className="font-['Roboto'] text-white/60 text-sm">Быстрые ссылки:</label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { name: 'Instagram', url: 'https://instagram.com/' },
                            { name: 'TikTok', url: 'https://tiktok.com/@' },
                            { name: 'YouTube', url: 'https://youtube.com/@' },
                            { name: 'LinkedIn', url: 'https://linkedin.com/in/' }
                          ].map((link) => (
                            <button
                              key={link.name}
                              onClick={() => setExternalUrl(link.url)}
                              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:border-[#7c6afa] hover:text-white transition-all duration-300 font-['Roboto'] text-sm"
                            >
                              {link.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Custom Page Option */}
                  {linkType === 'custom' && (
                    <div className="space-y-4">
                      <div className="p-6 bg-gradient-to-r from-[#7c6afa]/10 to-[#c89afc]/10 rounded-xl border border-[#7c6afa]/20">
                        <p className="font-['Roboto'] text-white/90 mb-4">
                          Создайте уникальную страницу с вашим контентом: текст, изображения, видео, ссылки и многое другое.
                        </p>
                        <button
                          onClick={() => qrId && onEditPage(qrId)}
                          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white font-['Roboto'] transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50"
                        >
                          Перейти к редактору
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSave}
                  disabled={linkType === 'external' && !externalUrl.trim()}
                  className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white font-['Roboto'] transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Сохранение...
                    </>
                  ) : saved ? (
                    <>
                      <Check className="w-5 h-5" />
                      Сохранено!
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Сохранить настройки
                    </>
                  )}
                </button>
              </div>

              {/* Sidebar - QR Preview & Info */}
              <div className="space-y-6">
                {/* QR Code Preview */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                  <h3 className="font-['Roboto'] text-white mb-4">QR-код</h3>
                  <div className="aspect-square bg-white rounded-xl p-4 mb-4">
                    <div className="w-full h-full flex items-center justify-center">
                      <QRCodeSVG
                        value={linkType === 'external' ? externalUrl : generatedQRUrl}
                        size={160}
                        level="M"
                        includeMargin={false}
                        bgColor="#ffffff"
                        fgColor="#000000"
                      />
                    </div>
                  </div>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-300">
                    <Download className="w-5 h-5" />
                    <span className="font-['Roboto']">Скачать</span>
                  </button>
                </div>

                {/* QR URL */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                  <h3 className="font-['Roboto'] text-white mb-4">Ссылка на QR</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10 break-all">
                      <p className="font-['Roboto'] text-white/80 text-sm">{generatedQRUrl}</p>
                    </div>
                    <button
                      onClick={handleCopy}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white transition-all duration-300 hover:shadow-lg"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span className="font-['Roboto'] text-sm">Скопировано!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="font-['Roboto'] text-sm">Копировать</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                  <h3 className="font-['Roboto'] text-white mb-4 flex items-center gap-2">
                    <BarChart className="w-5 h-5" />
                    Статистика
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-['Roboto'] text-white/60 text-sm">Сканирований</span>
                      <span className="font-['Roboto'] text-white">156</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-['Roboto'] text-white/60 text-sm">За сегодня</span>
                      <span className="font-['Roboto'] text-white">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-['Roboto'] text-white/60 text-sm">За неделю</span>
                      <span className="font-['Roboto'] text-white">45</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}