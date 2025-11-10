import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Link2, FileEdit, ExternalLink, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Switch } from './ui/switch';

type NavigationFunction = (page: 'home' | 'auth' | 'dashboard' | 'create-qr' | 'link-setup' | 'editor' | 'subscription') => void;

interface QRLinkSetupProps {
  qrId: string | null;
  onNavigate: NavigationFunction;
  onEditPage: (qrId: string) => void;
}

export default function QRLinkSetup({ qrId, onNavigate, onEditPage }: QRLinkSetupProps) {
  const [linkType, setLinkType] = useState<'custom' | 'redirect'>('custom');
  const [externalUrl, setExternalUrl] = useState('');
  const [enableAnalytics, setEnableAnalytics] = useState(true);
  const [enablePassword, setEnablePassword] = useState(false);
  const [password, setPassword] = useState('');

  const handleSave = () => {
    if (linkType === 'custom' && qrId) {
      onEditPage(qrId);
    } else {
      onNavigate('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#040404]">
      <div className="max-w-[900px] mx-auto p-6 md:p-12">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-white/70 hover:text-white transition-colors font-['Roboto'] flex items-center gap-2 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Назад в панель управления
          </button>
          <h1 className="font-['Roboto'] text-white mb-2">Настройка ссылки QR-кода</h1>
          <p className="font-['Roboto'] text-white/70">
            Выберите, куда будет вести ваш QR-код
          </p>
        </div>

        <div className="space-y-6">
          {/* Link Type Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
          >
            <h2 className="font-['Roboto'] text-white mb-6">Тип ссылки</h2>

            <RadioGroup value={linkType} onValueChange={(value) => setLinkType(value as 'custom' | 'redirect')}>
              <div className="space-y-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-start space-x-4 p-6 rounded-xl border-2 transition-all cursor-pointer ${
                    linkType === 'custom'
                      ? 'border-[#7c6afa] bg-[#7c6afa]/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => setLinkType('custom')}
                >
                  <RadioGroupItem value="custom" id="custom" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="custom" className="cursor-pointer">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-[#7c6afa] to-[#c89afc] rounded-lg flex items-center justify-center">
                          <FileEdit className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-['Roboto'] text-white">Кастомная страница</h3>
                          <p className="font-['Roboto'] text-white/70">
                            Создайте уникальную страницу с текстом, фото, видео и ссылками
                          </p>
                        </div>
                      </div>
                    </Label>
                    {linkType === 'custom' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 pt-4 border-t border-white/10"
                      >
                        <p className="font-['Roboto'] text-white/90 mb-3">
                          Вы сможете добавить:
                        </p>
                        <ul className="space-y-2 font-['Roboto'] text-white/70">
                          <li>• Текстовые блоки с форматированием</li>
                          <li>• Фотографии и изображения</li>
                          <li>• Видео (YouTube, Vimeo)</li>
                          <li>• Ссылки на соцсети</li>
                          <li>• Фоновые изображения и градиенты</li>
                        </ul>
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-start space-x-4 p-6 rounded-xl border-2 transition-all cursor-pointer ${
                    linkType === 'redirect'
                      ? 'border-[#7c6afa] bg-[#7c6afa]/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => setLinkType('redirect')}
                >
                  <RadioGroupItem value="redirect" id="redirect" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="redirect" className="cursor-pointer">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-[#c89afc] to-[#7c6afa] rounded-lg flex items-center justify-center">
                          <ExternalLink className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-['Roboto'] text-white">Внешняя ссылка</h3>
                          <p className="font-['Roboto'] text-white/70">
                            Перенаправление на любой внешний сайт
                          </p>
                        </div>
                      </div>
                    </Label>
                    {linkType === 'redirect' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 pt-4 border-t border-white/10 space-y-3"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="external-url" className="text-white/90 font-['Roboto']">
                            URL для перенаправления
                          </Label>
                          <Input
                            id="external-url"
                            type="url"
                            value={externalUrl}
                            onChange={(e) => setExternalUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#7c6afa]"
                          />
                        </div>
                        <p className="font-['Roboto'] text-white/50">
                          Примеры: ваш Instagram, личный сайт, портфолио, магазин
                        </p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </div>
            </RadioGroup>
          </motion.div>

          {/* Additional Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
          >
            <h2 className="font-['Roboto'] text-white mb-6">Дополнительные настройки</h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div className="flex-1">
                  <h3 className="font-['Roboto'] text-white mb-1">Аналитика сканирований</h3>
                  <p className="font-['Roboto'] text-white/70">
                    Отслеживайте количество сканирований и статистику
                  </p>
                </div>
                <Switch
                  checked={enableAnalytics}
                  onCheckedChange={setEnableAnalytics}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#7c6afa] data-[state=checked]:to-[#c89afc]"
                />
              </div>

              <div className="p-4 rounded-xl bg-white/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-['Roboto'] text-white mb-1">Защита паролем</h3>
                    <p className="font-['Roboto'] text-white/70">
                      Требовать пароль для доступа к странице
                    </p>
                  </div>
                  <Switch
                    checked={enablePassword}
                    onCheckedChange={setEnablePassword}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#7c6afa] data-[state=checked]:to-[#c89afc]"
                  />
                </div>
                {enablePassword && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-4 border-t border-white/10"
                  >
                    <Label htmlFor="password" className="text-white/90 font-['Roboto'] mb-2 block">
                      Установить пароль
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Введите пароль"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#7c6afa]"
                    />
                  </motion.div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-[#7c6afa]/10 to-[#c89afc]/10 border border-[#7c6afa]/20">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#7c6afa] to-[#c89afc] rounded-lg flex items-center justify-center shrink-0 mt-1">
                    <Link2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-['Roboto'] text-white mb-1">Короткая ссылка</h3>
                    <p className="font-['Roboto'] text-white/70 mb-2">
                      Ваша персональная ссылка:
                    </p>
                    <code className="font-['Roboto'] text-[#c89afc] bg-white/5 px-3 py-1 rounded">
                      qr-clothes.com/{qrId || 'abc123'}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              onClick={handleSave}
              className="flex-1 h-12 bg-gradient-to-r from-[#7c6afa] to-[#c89afc] hover:opacity-90 transition-opacity font-['Roboto']"
            >
              <Save className="w-5 h-5 mr-2" />
              {linkType === 'custom' ? 'Сохранить и редактировать страницу' : 'Сохранить настройки'}
            </Button>
            <Button
              onClick={() => onNavigate('dashboard')}
              variant="outline"
              className="h-12 bg-white/5 border-white/10 text-white hover:bg-white/10 px-8"
            >
              Отмена
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
