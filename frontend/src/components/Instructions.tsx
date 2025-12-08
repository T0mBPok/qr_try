import { ArrowLeft, QrCode, Palette, Edit, Share2, Download, Smartphone, Check, Play } from 'lucide-react';
import { Logo } from './Logo';
import bgImage from 'figma:asset/d172e93496736130643e676214481166b0b39a36.png';

type Page = 'home' | 'dashboard' | 'auth' | 'qr-creator' | 'qr-settings' | 'page-editor' | 'subscription' | 'examples' | 'instructions' | 'contacts';

interface InstructionsProps {
  onNavigate: (page: Page) => void;
  isAuthenticated: boolean;
}

export function Instructions({ onNavigate, isAuthenticated }: InstructionsProps) {
  const steps = [
    {
      number: '01',
      title: 'Создай аккаунт',
      description: 'Зарегистрируйся бесплатно и получи доступ ко всем функциям платформы',
      icon: QrCode,
      color: '#7c6afa',
      details: [
        'Быстрая регистрация за 30 секунд',
        'Подтверждение email',
        'Настройка профиля',
        'Выбор тарифного плана'
      ]
    },
    {
      number: '02',
      title: 'Дизайн QR-кода',
      description: 'Создай уникальный QR-код с индивидуальным стилем и цветами',
      icon: Palette,
      color: '#c89afc',
      details: [
        'Выбери стиль QR-кода (квадраты, точки, скругленные)',
        'Настрой цвета и градиенты',
        'Добавь логотип в центр',
        'Предпросмотр в реальном времени'
      ]
    },
    {
      number: '03',
      title: 'Создай контент',
      description: 'Наполни свою страницу текстом, фото, видео и ссылками',
      icon: Edit,
      color: '#df5950',
      details: [
        'Редактор в стиле Instagram Stories',
        'Добавляй текст, изображения, видео',
        'Настраивай фоны и градиенты',
        'Меняй позицию элементов перетаскиванием'
      ]
    },
    {
      number: '04',
      title: 'Скачай и используй',
      description: 'Скачай QR-код и разместите его на одежде или любой поверхности',
      icon: Download,
      color: '#7c6afa',
      details: [
        'Скачай в высоком разрешении (PNG, SVG)',
        'Распечатай на термонаклейке',
        'Размести на одежде, сумках, аксессуарах',
        'Готово! Теперь можно сканировать'
      ]
    }
  ];

  const features = [
    {
      title: 'QR-код',
      icon: QrCode,
      items: ['Кастомизация дизайна', 'Высокое разрешение', 'Несколько форматов', 'Безлимитные сканирования']
    },
    {
      title: 'Редактор',
      icon: Edit,
      items: ['Интуитивный интерфейс', 'Drag & drop элементы', 'Фоны и градиенты', 'Рисование от руки']
    },
    {
      title: 'Контент',
      icon: Smartphone,
      items: ['Текст, фото, видео', 'Социальные сети', 'Внешние ссылки', 'Неограниченные элементы']
    },
    {
      title: 'Аналитика',
      icon: Share2,
      items: ['Статистика сканирований', 'География пользователей', 'Время активности', 'Экспорт данных']
    }
  ];

  const faqs = [
    {
      question: 'Как работает QR-код на одежде?',
      answer: 'QR-код печатается на одежде с помощью термонаклейки или вышивки. При сканировании смартфоном, пользователь попадает на вашу персональную страницу с контентом.'
    },
    {
      question: 'Можно ли изменить содержимое после печати QR-кода?',
      answer: 'Да! QR-код ведёт на динамическую страницу, которую вы можете редактировать в любое время. Сам QR-код остаётся неизменным.'
    },
    {
      question: 'Какой формат лучше для печати?',
      answer: 'Для печати рекомендуем использовать векторный формат SVG или PNG в высоком разрешении (минимум 1000x1000 пикселей).'
    },
    {
      question: 'Есть ли ограничения на количество сканирований?',
      answer: 'Нет! Ваш QR-код можно сканировать неограниченное количество раз. В платных тарифах доступна подробная аналитика.'
    },
    {
      question: 'Как разместить QR-код на одежде?',
      answer: 'Самый простой способ — термонаклейка. Распечатайте QR-код, купите термотрансферную бумагу и приклейте утюгом. Также можно заказать вышивку или прямую печать в типографии.'
    },
    {
      question: 'Работает ли QR-код после стирки?',
      answer: 'Да, при использовании качественной термонаклейки или вышивки QR-код сохраняется после многократных стирок. Рекомендуем стирать при температуре не выше 40°C.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#040404] relative overflow-hidden">
      {/* Futuristic Animated Background */}
      <div className="fixed inset-0 z-0">
        {/* Background Image with Blur */}
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
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-[#7c6afa] rounded-full animate-pulse delay-300" />
      </div>

      {/* Back button */}
      <div className="relative z-10 container mx-auto px-4 py-6 sm:py-8">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="px-4 py-2 sm:px-6 sm:py-3 rounded-full border-2 border-white/20 text-white hover:bg-white/10 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
          >
            <span className="font-['Roboto'] flex items-center gap-2">
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">На главную</span>
            </span>
          </button>

          <Logo variant="white" size="md" />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 sm:py-24">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="font-['Roboto'] text-3xl sm:text-4xl lg:text-5xl bg-gradient-to-r from-[#7c6afa] to-[#c89afc] bg-clip-text text-transparent mb-4">
            Как это работает
          </h1>
          <p className="font-['Roboto'] text-white/60 text-base sm:text-lg max-w-2xl mx-auto">
            Создай свой уникальный QR-код за 4 простых шага
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto space-y-8 mb-20">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8 transition-all duration-300 hover:border-white/20 hover:bg-white/10"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 100}ms both`
                }}
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Number & Icon */}
                  <div className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-0">
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${step.color}40, ${step.color}20)`,
                        border: `2px solid ${step.color}40`
                      }}
                    >
                      <Icon className="w-10 h-10" style={{ color: step.color }} />
                    </div>
                    <span
                      className="font-['Roboto'] text-4xl sm:text-5xl sm:mt-4 opacity-20"
                      style={{ color: step.color }}
                    >
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-['Roboto'] text-xl sm:text-2xl text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="font-['Roboto'] text-white/60 mb-4 text-sm sm:text-base">
                      {step.description}
                    </p>

                    {/* Details */}
                    <div className="grid sm:grid-cols-2 gap-2">
                      {step.details.map((detail, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: step.color }} />
                          <span className="font-['Roboto'] text-white/80 text-sm">
                            {detail}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Hover Gradient */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, ${step.color}05, transparent)`,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h2 className="font-['Roboto'] text-2xl sm:text-3xl text-center text-white mb-8 sm:mb-12">
            Основные возможности
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:scale-105"
                >
                  <Icon className="w-10 h-10 mb-4 text-[#7c6afa]" />
                  <h3 className="font-['Roboto'] text-white text-lg mb-4">{feature.title}</h3>
                  <ul className="space-y-2">
                    {feature.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#7c6afa] mt-1">•</span>
                        <span className="font-['Roboto'] text-white/60 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Video Tutorial Placeholder */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="font-['Roboto'] text-2xl sm:text-3xl text-center text-white mb-8">
            Видео-инструкция
          </h2>
          <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden aspect-video group cursor-pointer hover:border-white/20 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-[#7c6afa]/20 to-[#c89afc]/20 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center border-2 border-white/20 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                <Play className="w-10 h-10 text-white ml-1" />
              </div>
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <p className="font-['Roboto'] text-white text-lg">
                Полное руководство по созданию QR-кода
              </p>
              <p className="font-['Roboto'] text-white/60 text-sm">
                5:30 минут
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mb-12">
          <h2 className="font-['Roboto'] text-2xl sm:text-3xl text-center text-white mb-8 sm:mb-12">
            Часто задаваемые вопросы
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 transition-all duration-300 hover:border-white/20"
              >
                <summary className="font-['Roboto'] text-white text-base sm:text-lg cursor-pointer list-none flex items-center justify-between">
                  {faq.question}
                  <span className="text-[#7c6afa] text-2xl group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="font-['Roboto'] text-white/60 mt-4 text-sm sm:text-base leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-[#7c6afa] to-[#c89afc] rounded-3xl p-8 sm:p-12">
          <h2 className="font-['Roboto'] text-2xl sm:text-3xl text-white mb-4">
            Всё понятно? Начни прямо сейчас!
          </h2>
          <p className="font-['Roboto'] text-white/90 text-base sm:text-lg mb-6">
            Создай свой первый QR-код бесплатно за 5 минут
          </p>
          <button
            onClick={() => onNavigate(isAuthenticated ? 'qr-creator' : 'auth')}
            className="px-8 sm:px-10 py-3 sm:py-4 rounded-full bg-white text-[#7c6afa] font-['Roboto'] transition-all duration-300 hover:shadow-lg hover:scale-105 text-sm sm:text-base"
          >
            Создать QR-код
          </button>
        </div>
      </div>
    </div>
  );
}