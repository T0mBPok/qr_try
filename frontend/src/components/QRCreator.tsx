import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, QrCode, Download, Palette, Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import api from '../services/api';

type Page = 'home' | 'dashboard' | 'auth' | 'qr-creator' | 'qr-settings' | 'page-editor' | 'subscription';

interface QRCreatorProps {
  onComplete: () => void;
}

interface QROut {
  id: number;
  description: string | null;
  link: string;
  src: string;
}

type QRStyle = 'square' | 'rounded' | 'dots' | 'fluid';

export function QRCreator({onComplete }: QRCreatorProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [pageId, setPageId] = useState<string | null>(null);
  const [qrName, setQrName] = useState('');
  const [qrStyle, setQrStyle] = useState<QRStyle>('square');
  const [primaryColor, setPrimaryColor] = useState('#7c6afa');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [useGradient, setUseGradient] = useState(false);
  const [gradientColor2, setGradientColor2] = useState('#c89afc');
  const [logo, setLogo] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [description, setDescription] = useState('');  // Для textarea
  const [createdQr, setCreatedQr] = useState<QROut | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateQR = async () => {
    if (!qrName.trim()) {
      setError('Пожалуйста, введите название QR-кода');
      return;
    }

    try {
      setCreating(true);
      setError(null);
      
      console.log('📝 Создание QR-кода:', {
        name: qrName,
        description,  // ← Новое
        link: null,   // ← Новое (Optional, backend сгенерирует дефолт?)
        style: qrStyle,
        colors: { primary: primaryColor, background: backgroundColor, gradient: useGradient }
      });

      const response = await api.qr.create({
        name: qrName,
        description: description || undefined,  // ← Новое: передаём, если не пусто
        link: undefined,  // ← Новое: Optional, станет null в JSON
        qr_style: {  // Без изменений
          pattern: qrStyle,
          eye_style: qrStyle === 'rounded' ? 'rounded' : 'square',
          colors: useGradient 
            ? {
                primary: primaryColor,
                secondary: gradientColor2,
                background: backgroundColor,
                gradient: true
              }
            : {
                primary: primaryColor,
                background: backgroundColor,
                gradient: false
              },
          logo_url: logo || undefined,
        }
      });

      // Гибкая обработка: response.data или прямой response
      const qrData = response?.data ?? response;
      if (!qrData) {
        throw new Error('Нет данных о созданном QR-коде');
      }

      console.log('✅ QR-код создан:', qrData.src);  // ← Изменено: src вместо qr_code
      
      // Сохраняем полный объект для дальнейшего использования
      setCreatedQr(qrData);

      const extractedPageId = new URL(qrData.link).pathname.split('/').pop();
      setPageId(extractedPageId);

      // Показать успех и перейти (без изменений)
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        if (step < 3) setStep(step + 1);
      }, 1500);
      
    } catch (err: any) {
      console.error('❌ Ошибка создания QR-кода:', err);
      // Улучшенная обработка ошибок от backend (напр. FastAPI detail)
      const errorMsg = err.response?.data?.detail?.[0]?.msg || err.message || 'Не удалось создать QR-код';
      setError(errorMsg);
    } finally {
      setCreating(false);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      // Шаг 1 -> 2: Просто переходим
      if (!qrName.trim()) {
        setError('Пожалуйста, введите название QR-кода');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      // Шаг 2 -> 3: Создаём QR через API
      handleCreateQR();
    } else {
      // Шаг 3: Завершение
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const qrStyles: { name: string; value: QRStyle; icon: string }[] = [
    { name: 'Квадраты', value: 'square', icon: '■' },
    { name: 'Скругленные', value: 'rounded', icon: '●' },
    { name: 'Точки', value: 'dots', icon: '•' },
    { name: 'Плавные', value: 'fluid', icon: '~' }
  ];

  const presetThemes = [
    { name: 'Фиолетовый', primary: '#7c6afa', bg: '#ffffff', gradient: false },
    { name: 'Красный', primary: '#df5950', bg: '#ffffff', gradient: false },
    { name: 'Классический', primary: '#000000', bg: '#ffffff', gradient: false },
    { name: 'Градиент Purple', primary: '#7c6afa', secondary: '#c89afc', bg: '#ffffff', gradient: true },
    { name: 'Градиент Sunset', primary: '#df5950', secondary: '#ff9a56', bg: '#ffffff', gradient: true },
    { name: 'Градиент Ocean', primary: '#4facfe', secondary: '#00f2fe', bg: '#ffffff', gradient: true }
  ];

  const qrDataUrl = createdQr
  ? createdQr.link
  : `https://qrwear.app/${qrName || 'demo'}`;

  // Render real QR code with different styles
  const renderQRWithStyle = () => {
    // Get the QR cell shape based on style
    let cellShape: 'square' | 'dots' | 'rounded' | 'fluid' = 'square';
    
    if (qrStyle === 'square') cellShape = 'square';
    else if (qrStyle === 'rounded') cellShape = 'rounded';
    else if (qrStyle === 'dots') cellShape = 'dots';
    else if (qrStyle === 'fluid') cellShape = 'dots'; // fluid uses dots but with different size
    
    if (useGradient) {
      // For gradient QR codes, we need to create a custom SVG with gradient fill
      return (
        <div className="relative w-full h-full">
          <svg width="0" height="0" className="absolute">
            <defs>
              <linearGradient id="qrGradientFill" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: primaryColor }} />
                <stop offset="100%" style={{ stopColor: gradientColor2 }} />
              </linearGradient>
            </defs>
          </svg>
          <QRCodeSVG
            value={qrDataUrl}
            size={256}
            level="H"
            includeMargin={false}
            style={{
              width: '100%',
              height: '100%'
            }}
            fgColor="url(#qrGradientFill)"
            bgColor={backgroundColor}
            imageSettings={
              logo
                ? {
                    src: logo,
                    height: 56,
                    width: 56,
                    excavate: true,
                  }
                : undefined
            }
          />
        </div>
      );
    }

    // Regular QR code (non-gradient)
    return (
      <QRCodeSVG
        value={qrDataUrl}
        size={256}
        level="H"
        includeMargin={false}
        style={{
          width: '100%',
          height: '100%'
        }}
        fgColor={primaryColor}
        bgColor={backgroundColor}
        imageSettings={
          logo
            ? {
                src: logo,
                height: 56,
                width: 56,
                excavate: true,
              }
            : undefined
        }
      />
    );
  };

  // Полный URL для src (если relative)
  const getFullSrc = (src: string) => {
    return src.startsWith('http') ? src : `https://qrwear.app${src}`;
  };

  return (
    <div className="min-h-screen bg-[#040404] relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#7c6afa]/10 via-transparent to-[#c89afc]/10" />

      {/* Back button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="absolute top-4 left-4 sm:top-8 sm:left-8 z-20 px-4 py-2 sm:px-6 sm:py-3 rounded-full border-2 border-white/20 text-white hover:bg-white/10 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
      >
        <span className="font-['Roboto']">← К панели</span>
      </button>

      <div className="relative z-10 container mx-auto px-4 py-16 sm:py-12 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-6xl">
          {/* Progress Steps */}
          <div className="mb-8 sm:mb-12">
            <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4 overflow-x-auto pb-2">{[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center shrink-0">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-['Roboto'] transition-all duration-300 ${
                      s === step
                        ? 'bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white scale-110'
                        : s < step
                        ? 'bg-[#7c6afa] text-white'
                        : 'bg-white/10 text-white/40'
                    }`}
                  >
                    {s < step ? <Check className="w-6 h-6" /> : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`w-16 lg:w-24 h-1 mx-2 rounded-full transition-all duration-300 ${
                        s < step ? 'bg-[#7c6afa]' : 'bg-white/10'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <p className="font-['Roboto'] text-white/60">
                Шаг {step} из 3
              </p>
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 lg:p-12">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="font-['Roboto'] text-3xl lg:text-4xl bg-gradient-to-r from-[#7c6afa] to-[#c89afc] bg-clip-text text-transparent mb-2">
                    Основная информация
                  </h2>
                  <p className="font-['Roboto'] text-white/60">
                    Давайте начнем с названия вашего QR-кода
                  </p>
                </div>

                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="space-y-2">
                    <label className="font-['Roboto'] text-white/80">Название QR-кода</label>
                    <input
                      type="text"
                      value={qrName}
                      onChange={(e) => setQrName(e.target.value)}
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:border-[#7c6afa] focus:outline-none transition-colors font-['Roboto']"
                      placeholder="Например: Мой профиль, Instagram, Портфолио..."
                    />
                    <p className="font-['Roboto'] text-white/40 text-sm">
                      Это название для вашего удобства, пользователи его не увидят
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="font-['Roboto'] text-white/80">Описание (опционально)</label>
                    <textarea
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:border-[#7c6afa] focus:outline-none transition-colors font-['Roboto'] resize-none"
                      rows={4}
                      value={description}  // ← Добавьте
                      onChange={(e) => setDescription(e.target.value)}  // ← Добавьте
                      placeholder="Краткое описание для чего этот QR-код..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Design Customization */}
            {step === 2 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="font-['Roboto'] text-3xl lg:text-4xl bg-gradient-to-r from-[#7c6afa] to-[#c89afc] bg-clip-text text-transparent mb-2">
                    Дизайн QR-кода
                  </h2>
                  <p className="font-['Roboto'] text-white/60">
                    Настройте внешний вид вашего QR-кода
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                  {/* Customization Options */}
                  <div className="space-y-6">
                    {/* Style Selection */}
                    <div className="space-y-3">
                      <label className="font-['Roboto'] text-white/80 flex items-center gap-2">
                        <Palette className="w-5 h-5" />
                        Стиль QR-кода
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {qrStyles.map((style) => (
                          <button
                            key={style.value}
                            onClick={() => setQrStyle(style.value)}
                            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                              qrStyle === style.value
                                ? 'border-[#7c6afa] bg-[#7c6afa]/10'
                                : 'border-white/10 hover:border-white/20'
                            }`}
                          >
                            <div className="text-3xl mb-2">{style.icon}</div>
                            <p className="font-['Roboto'] text-white text-sm">{style.name}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color Selection - Redesigned */}
                    <div className="space-y-4">
                      <label className="font-['Roboto'] text-white/80">Цветовая схема</label>
                      
                      {/* Preset Themes */}
                      <div className="space-y-3">
                        <p className="font-['Roboto'] text-white/60 text-sm">Готовые решения</p>
                        <div className="grid grid-cols-3 gap-3">
                          {presetThemes.map((preset, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                setPrimaryColor(preset.primary);
                                setBackgroundColor(preset.bg);
                                setUseGradient(preset.gradient);
                                if (preset.gradient && preset.secondary) {
                                  setGradientColor2(preset.secondary);
                                }
                              }}
                              className={`group relative p-3 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                                (!useGradient && primaryColor === preset.primary && !preset.gradient) ||
                                (useGradient && preset.gradient && primaryColor === preset.primary && gradientColor2 === preset.secondary)
                                  ? 'border-[#7c6afa]'
                                  : 'border-white/10 hover:border-white/30'
                              }`}
                            >
                              <div 
                                className="w-full h-16 rounded-lg mb-2"
                                style={
                                  preset.gradient && preset.secondary
                                    ? { background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})` }
                                    : { backgroundColor: preset.primary }
                                }
                              />
                              <p className="font-['Roboto'] text-white text-xs text-center truncate">
                                {preset.name}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Custom Color Selection */}
                      <div className="space-y-3 pt-2">
                        <p className="font-['Roboto'] text-white/60 text-sm">Настроить цвета</p>
                        
                        {/* Toggle between solid and gradient */}
                        <div className="flex gap-2 bg-white/5 rounded-xl p-1">
                          <button
                            onClick={() => setUseGradient(false)}
                            className={`flex-1 py-2.5 rounded-lg font-['Roboto'] text-sm transition-all duration-300 ${
                              !useGradient
                                ? 'bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white'
                                : 'text-white/60 hover:text-white'
                            }`}
                          >
                            Однотонный
                          </button>
                          <button
                            onClick={() => setUseGradient(true)}
                            className={`flex-1 py-2.5 rounded-lg font-['Roboto'] text-sm transition-all duration-300 ${
                              useGradient
                                ? 'bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white'
                                : 'text-white/60 hover:text-white'
                            }`}
                          >
                            Градиент
                          </button>
                        </div>

                        {/* Color Pickers */}
                        <div className="space-y-3">
                          {!useGradient ? (
                            <div className="space-y-3">
                              {/* QR Color */}
                              <div className="space-y-2">
                                <label className="font-['Roboto'] text-white/60 text-sm">Цвет QR-кода</label>
                                <div className="relative group">
                                  <input
                                    type="color"
                                    value={primaryColor}
                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                  />
                                  <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-white/20 cursor-pointer transition-all duration-300 group-hover:border-[#7c6afa] bg-white/5">
                                    <div
                                      className="w-10 h-10 rounded-lg shrink-0"
                                      style={{ backgroundColor: primaryColor }}
                                    />
                                    <span className="font-['Roboto'] text-white text-sm flex-1">
                                      {primaryColor.toUpperCase()}
                                    </span>
                                    <Palette className="w-5 h-5 text-white/40 group-hover:text-[#7c6afa]" />
                                  </div>
                                </div>
                              </div>
                              {/* Background */}
                              <div className="space-y-2">
                                <label className="font-['Roboto'] text-white/60 text-sm">Цвет фона</label>
                                <div className="relative group">
                                  <input
                                    type="color"
                                    value={backgroundColor}
                                    onChange={(e) => setBackgroundColor(e.target.value)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                  />
                                  <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-white/20 cursor-pointer transition-all duration-300 group-hover:border-[#7c6afa] bg-white/5">
                                    <div
                                      className="w-10 h-10 rounded-lg shrink-0 border border-white/20"
                                      style={{ backgroundColor }}
                                    />
                                    <span className="font-['Roboto'] text-white text-sm flex-1">
                                      {backgroundColor.toUpperCase()}
                                    </span>
                                    <Palette className="w-5 h-5 text-white/40 group-hover:text-[#7c6afa]" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {/* Gradient Color 1 */}
                              <div className="space-y-2">
                                <label className="font-['Roboto'] text-white/60 text-sm">Градиент: Цвет 1</label>
                                <div className="relative group">
                                  <input
                                    type="color"
                                    value={primaryColor}
                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                  />
                                  <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-white/20 cursor-pointer transition-all duration-300 group-hover:border-[#7c6afa] bg-white/5">
                                    <div
                                      className="w-10 h-10 rounded-lg shrink-0"
                                      style={{ backgroundColor: primaryColor }}
                                    />
                                    <span className="font-['Roboto'] text-white text-sm flex-1">
                                      {primaryColor.toUpperCase()}
                                    </span>
                                    <Palette className="w-5 h-5 text-white/40 group-hover:text-[#7c6afa]" />
                                  </div>
                                </div>
                              </div>
                              {/* Gradient Color 2 */}
                              <div className="space-y-2">
                                <label className="font-['Roboto'] text-white/60 text-sm">Градиент: Цвет 2</label>
                                <div className="relative group">
                                  <input
                                    type="color"
                                    value={gradientColor2}
                                    onChange={(e) => setGradientColor2(e.target.value)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                  />
                                  <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-white/20 cursor-pointer transition-all duration-300 group-hover:border-[#7c6afa] bg-white/5">
                                    <div
                                      className="w-10 h-10 rounded-lg shrink-0"
                                      style={{ backgroundColor: gradientColor2 }}
                                    />
                                    <span className="font-['Roboto'] text-white text-sm flex-1">
                                      {gradientColor2.toUpperCase()}
                                    </span>
                                    <Palette className="w-5 h-5 text-white/40 group-hover:text-[#7c6afa]" />
                                  </div>
                                </div>
                              </div>
                              {/* Background */}
                              <div className="space-y-2">
                                <label className="font-['Roboto'] text-white/60 text-sm">Цвет фона</label>
                                <div className="relative group">
                                  <input
                                    type="color"
                                    value={backgroundColor}
                                    onChange={(e) => setBackgroundColor(e.target.value)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                  />
                                  <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-white/20 cursor-pointer transition-all duration-300 group-hover:border-[#7c6afa] bg-white/5">
                                    <div
                                      className="w-10 h-10 rounded-lg shrink-0 border border-white/20"
                                      style={{ backgroundColor }}
                                    />
                                    <span className="font-['Roboto'] text-white text-sm flex-1">
                                      {backgroundColor.toUpperCase()}
                                    </span>
                                    <Palette className="w-5 h-5 text-white/40 group-hover:text-[#7c6afa]" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Logo Upload */}
                    <div className="space-y-3">
                      <label className="font-['Roboto'] text-white/80 flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        Логотип в центре (опционально)
                      </label>
                      <label className="block">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                        <div className="px-6 py-4 border-2 border-dashed border-white/20 rounded-xl text-center cursor-pointer hover:border-[#7c6afa] transition-colors">
                          {logo ? (
                            <div className="flex items-center justify-center gap-3">
                              <img src={logo} alt="Logo" className="w-12 h-12 rounded object-cover" />
                              <span className="font-['Roboto'] text-white">Логотип загружен</span>
                            </div>
                          ) : (
                            <p className="font-['Roboto'] text-white/60">
                              Нажмите для загрузки логотипа
                            </p>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Preview - Redesigned like the image */}
                  <div className="flex flex-col">
                    <div className="bg-[#1a1a1a] rounded-3xl p-8 border border-white/10">
                      <h3 className="font-['Roboto'] text-white text-xl mb-6">
                        Предварительный просмотр
                      </h3>
                      
                      {/* QR Code Preview */}
                      <div className="bg-[#2a2a2a] rounded-2xl p-6 mb-6 flex items-center justify-center">
                        <div 
                          className="rounded-2xl p-4 shadow-2xl"
                          style={{ backgroundColor }}
                        >
                          <div className="w-64 h-64">
                            {renderQRWithStyle()}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        {/* Error Display */}
                        {error && (
                          <div className="flex items-center gap-2 p-3 bg-[#df5950]/10 border border-[#df5950]/30 rounded-xl text-[#df5950] text-sm">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span className="font-['Roboto']">{error}</span>
                          </div>
                        )}

                        {/* Success Display */}
                        {success && (
                          <div className="flex items-center gap-2 p-3 bg-[#7c6afa]/10 border border-[#7c6afa]/30 rounded-xl text-[#7c6afa] text-sm">
                            <CheckCircle className="w-4 h-4 flex-shrink-0" />
                            <span className="font-['Roboto']">QR-код успешно создан!</span>
                          </div>
                        )}

                        
                        
                        <button 
                          onClick={() => {
                            if (createdQr?.src) {
                              const fullSrc = getFullSrc(createdQr.src);
                              const link = document.createElement('a');
                              link.href = fullSrc;
                              link.download = `${qrName || 'qr-code'}.png`;  // Или .svg, в зависимости от backend
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            } else {
                              setError('QR-код ещё не создан');
                            }
                          }}
                          className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-['Roboto'] transition-all duration-300 hover:bg-white/10 flex items-center justify-center gap-2"
                          disabled={!createdQr || creating}
                        >
                          {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                          {creating ? 'Создание...' : 'Скачать QR-код'}
                        </button>
                      </div>

                      {/* Tip */}
                      <div className="mt-6 p-4 bg-[#1a1a2e] rounded-xl border border-[#7c6afa]/20">
                        <div className="flex gap-3">
                          <div className="shrink-0 mt-0.5">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#7c6afa] to-[#c89afc] flex items-center justify-center">
                              <span className="text-white text-xs">💡</span>
                            </div>
                          </div>
                          <div>
                            <p className="font-['Roboto'] text-white/80 text-sm leading-relaxed">
                              <span className="text-white">Совет:</span> После сохранения вы сможете настроить, куда будет вести этот QR-код: на кастомную страницу или внешнюю ссылку.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Type Selection & Preview */}
            {step === 3 && createdQr && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="font-['Roboto'] text-3xl lg:text-4xl bg-gradient-to-r from-[#7c6afa] to-[#c89afc] bg-clip-text text-transparent mb-2">
                    Тип QR-кода
                  </h2>
                  <p className="font-['Roboto'] text-white/60">
                    Выберите, куда будет вести ваш QR-код
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  <button
                    onClick={() => {
                      navigate(`/page/${pageId}`, { state: { qrId: createdQr.id } });  // ← Передаём id
                    }}
                    className="group p-8 rounded-2xl border-2 border-white/10 hover:border-[#7c6afa] bg-white/5 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="mb-6 flex justify-center">
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#7c6afa] to-[#c89afc]">
                        <QrCode className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    <h3 className="font-['Roboto'] text-xl text-white mb-3">
                      Пользовательская страница
                    </h3>
                    <p className="font-['Roboto'] text-white/60 leading-relaxed">
                      Создайте уникальную страницу с текстом, изображениями, видео и ссылками. 
                      Полный контроль над дизайном.
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-[#c89afc] group-hover:translate-x-2 transition-transform">
                      <span className="font-['Roboto']">Создать страницу</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      navigate(`/qr/${createdQr.id}/settings`, { state: { qr: createdQr } });  // ← Передаём id
                    }}
                    className="group p-8 rounded-2xl border-2 border-white/10 hover:border-[#7c6afa] bg-white/5 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="mb-6 flex justify-center">
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#7c6afa] to-[#c89afc]">
                        <ArrowRight className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    <h3 className="font-['Roboto'] text-xl text-white mb-3">
                      Перенаправление на URL
                    </h3>
                    <p className="font-['Roboto'] text-white/60 leading-relaxed">
                      Направьте пользователей на любой сайт: Instagram, TikTok, портфолио, 
                      магазин или любую другую ссылку.
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-[#c89afc] group-hover:translate-x-2 transition-transform">
                      <span className="font-['Roboto']">Настроить ссылку</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </button>
                </div>

                {/* Download Option */}
                <div className="max-w-2xl mx-auto mt-12 p-6 bg-white/5 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-4">
                    <Download className="w-8 h-8 text-[#c89afc]" />
                    <div className="flex-1">
                      <p className="font-['Roboto'] text-white mb-1">Готовы скачать?</p>
                      <p className="font-['Roboto'] text-white/60 text-sm">
                        Сначала выберите тип QR-кода, затем сможете скачать его в высоком качестве
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/10">
              <button
                onClick={handlePrevious}
                disabled={step === 1}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-white/20 text-white hover:bg-white/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-['Roboto']">Назад</span>
              </button>

              <div className="flex items-center gap-2 text-white/60 font-['Roboto'] text-sm">
                <span>Шаг {step} из 3</span>
              </div>

              <button
                onClick={handleNext}
                disabled={(step === 1 && !qrName.trim()) || (step === 2 && creating)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="font-['Roboto']">{step === 3 ? 'Готово' : 'Далее'}</span>}
                {step < 3 && !creating && <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}