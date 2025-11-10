import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Download, Sparkles, Palette, Grid3x3 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

type NavigationFunction = (page: 'home' | 'auth' | 'dashboard' | 'create-qr' | 'link-setup' | 'editor' | 'subscription') => void;

interface QRCreatorProps {
  onNavigate: NavigationFunction;
}

export default function QRCreator({ onNavigate }: QRCreatorProps) {
  const [qrName, setQrName] = useState('');
  const [qrData, setQrData] = useState('https://example.com');
  const [qrColor, setQrColor] = useState('#7c6afa');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [cornerStyle, setCornerStyle] = useState<'square' | 'rounded' | 'dots'>('square');
  const [size, setSize] = useState([300]);
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M');

  const patterns = [
    { id: 'solid', name: 'Сплошной', preview: 'bg-gradient-to-r from-[#7c6afa] to-[#c89afc]' },
    { id: 'dots', name: 'Точки', preview: 'bg-gradient-to-r from-[#c89afc] to-[#7c6afa]' },
    { id: 'rounded', name: 'Скругленный', preview: 'bg-gradient-to-r from-[#7c6afa] to-[#df5950]' }
  ];

  const generateQRCode = () => {
    const baseUrl = 'https://api.qrserver.com/v1/create-qr-code/';
    const params = new URLSearchParams({
      size: `${size[0]}x${size[0]}`,
      data: qrData,
      color: qrColor.replace('#', ''),
      bgcolor: bgColor.replace('#', ''),
      qzone: '2',
      format: 'png'
    });
    return `${baseUrl}?${params.toString()}`;
  };

  const handleSave = () => {
    // In a real app, this would save to database
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#040404]">
      <div className="max-w-[1400px] mx-auto p-6 md:p-12">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-white/70 hover:text-white transition-colors font-['Roboto'] flex items-center gap-2 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Назад в панель управления
          </button>
          <h1 className="font-['Roboto'] text-white mb-2">Создание QR-кода</h1>
          <p className="font-['Roboto'] text-white/70">
            Настройте дизайн и параметры вашего уникального QR-кода
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Settings */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
            >
              <h2 className="font-['Roboto'] text-white mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#c89afc]" />
                Основные настройки
              </h2>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="qr-name" className="text-white/90 font-['Roboto']">
                    Название QR-кода
                  </Label>
                  <Input
                    id="qr-name"
                    value={qrName}
                    onChange={(e) => setQrName(e.target.value)}
                    placeholder="Например: Моя визитка"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#7c6afa]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qr-data" className="text-white/90 font-['Roboto']">
                    Данные для QR-кода (URL)
                  </Label>
                  <Input
                    id="qr-data"
                    value={qrData}
                    onChange={(e) => setQrData(e.target.value)}
                    placeholder="https://example.com"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#7c6afa]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white/90 font-['Roboto']">
                    Размер: {size[0]}px
                  </Label>
                  <Slider
                    value={size}
                    onValueChange={setSize}
                    min={200}
                    max={600}
                    step={50}
                    className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-[#7c6afa] [&_[role=slider]]:to-[#c89afc]"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
            >
              <h2 className="font-['Roboto'] text-white mb-6 flex items-center gap-2">
                <Palette className="w-5 h-5 text-[#c89afc]" />
                Настройка цвета
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="qr-color" className="text-white/90 font-['Roboto']">
                      Цвет QR-кода
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="qr-color"
                        type="color"
                        value={qrColor}
                        onChange={(e) => setQrColor(e.target.value)}
                        className="w-16 h-12 p-1 bg-white/5 border-white/10 cursor-pointer"
                      />
                      <Input
                        value={qrColor}
                        onChange={(e) => setQrColor(e.target.value)}
                        className="flex-1 bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bg-color" className="text-white/90 font-['Roboto']">
                      Цвет фона
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="bg-color"
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-16 h-12 p-1 bg-white/5 border-white/10 cursor-pointer"
                      />
                      <Input
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="flex-1 bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-white/90 font-['Roboto']">Быстрый выбор</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { fg: '#7c6afa', bg: '#ffffff', name: 'Фиолетовый' },
                      { fg: '#000000', bg: '#ffffff', name: 'Классика' },
                      { fg: '#df5950', bg: '#ffffff', name: 'Красный' },
                      { fg: '#ffffff', bg: '#7c6afa', name: 'Инверсия' },
                      { fg: '#c89afc', bg: '#040404', name: 'Темный' },
                      { fg: '#00ff88', bg: '#000000', name: 'Неон' }
                    ].map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => {
                          setQrColor(preset.fg);
                          setBgColor(preset.bg);
                        }}
                        className="h-16 rounded-xl border-2 border-white/10 hover:border-[#7c6afa] transition-all"
                        style={{ backgroundColor: preset.bg }}
                      >
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-8 h-8 rounded" style={{ backgroundColor: preset.fg }} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
            >
              <h2 className="font-['Roboto'] text-white mb-6 flex items-center gap-2">
                <Grid3x3 className="w-5 h-5 text-[#c89afc]" />
                Стиль узора
              </h2>

              <div className="grid grid-cols-3 gap-4">
                {patterns.map((pattern) => (
                  <button
                    key={pattern.id}
                    onClick={() => setCornerStyle(pattern.id as any)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      cornerStyle === pattern.id
                        ? 'border-[#7c6afa] bg-[#7c6afa]/10'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className={`w-full h-20 rounded-lg ${pattern.preview} mb-3`} />
                    <p className="font-['Roboto'] text-white/90">{pattern.name}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:sticky lg:top-6 h-fit">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
            >
              <h2 className="font-['Roboto'] text-white mb-6">Предварительный просмотр</h2>

              <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-8 mb-6 flex items-center justify-center min-h-[400px]">
                <motion.div
                  key={`${qrData}-${qrColor}-${bgColor}-${size[0]}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-6 rounded-2xl shadow-2xl"
                >
                  <img
                    src={generateQRCode()}
                    alt="QR Code Preview"
                    className="w-full h-auto"
                    style={{ maxWidth: size[0], maxHeight: size[0] }}
                  />
                </motion.div>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={handleSave}
                  className="w-full h-12 bg-gradient-to-r from-[#7c6afa] to-[#c89afc] hover:opacity-90 transition-opacity font-['Roboto']"
                >
                  Сохранить и продолжить
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-12 bg-white/5 border-white/10 text-white hover:bg-white/10"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Скачать QR-код
                </Button>
              </div>

              <div className="mt-6 p-4 bg-[#7c6afa]/10 border border-[#7c6afa]/20 rounded-xl">
                <p className="font-['Roboto'] text-white/70 leading-relaxed">
                  💡 <span className="text-white">Совет:</span> После сохранения вы сможете настроить,
                  куда будет вести этот QR-код: на кастомную страницу или внешнюю ссылку.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
