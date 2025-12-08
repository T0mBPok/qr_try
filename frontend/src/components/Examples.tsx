import { ArrowLeft, ExternalLink, Smartphone, Instagram, Music, Briefcase, Heart, ShoppingBag, Camera, Code } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import { Logo } from './Logo';
import bgImage from 'figma:asset/d172e93496736130643e676214481166b0b39a36.png';

type Page = 'home' | 'dashboard' | 'auth' | 'qr-creator' | 'qr-settings' | 'page-editor' | 'subscription' | 'examples' | 'instructions' | 'contacts';

interface ExamplesProps {
  onNavigate: (page: Page) => void;
  isAuthenticated: boolean;
}

export function Examples({ onNavigate, isAuthenticated }: ExamplesProps) {
  const examples = [
    {
      id: 1,
      title: 'Социальные сети',
      description: 'Все твои соцсети в одном месте',
      icon: Instagram,
      color: '#7c6afa',
      url: 'https://qrwear.app/social/alexsmith',
      category: 'Популярное',
      image: '👤',
      features: ['Instagram', 'TikTok', 'Twitter', 'LinkedIn']
    },
    {
      id: 2,
      title: 'Музыкант',
      description: 'Поделись своей музыкой со всем миром',
      icon: Music,
      color: '#c89afc',
      url: 'https://qrwear.app/music/dj-pulse',
      category: 'Креатив',
      image: '🎵',
      features: ['Spotify', 'Apple Music', 'SoundCloud', 'YouTube']
    },
    {
      id: 3,
      title: 'Бизнес-карта',
      description: 'Профессиональная визитка нового поколения',
      icon: Briefcase,
      color: '#df5950',
      url: 'https://qrwear.app/business/john-doe',
      category: 'Бизнес',
      image: '💼',
      features: ['Контакты', 'Портфолио', 'Календарь', 'Email']
    },
    {
      id: 4,
      title: 'Фотограф',
      description: 'Покажи своё портфолио в лучшем свете',
      icon: Camera,
      color: '#7c6afa',
      url: 'https://qrwear.app/photo/lens-master',
      category: 'Креатив',
      image: '📸',
      features: ['Галерея', 'Прайс', 'Отзывы', 'Бронирование']
    },
    {
      id: 5,
      title: 'Интернет-магазин',
      description: 'Прямая ссылка на твой магазин',
      icon: ShoppingBag,
      color: '#c89afc',
      url: 'https://qrwear.app/shop/streetwear',
      category: 'Бизнес',
      image: '🛍️',
      features: ['Каталог', 'Корзина', 'Акции', 'Поддержка']
    },
    {
      id: 6,
      title: 'Благотворительность',
      description: 'Собирай пожертвования легко и прозрачно',
      icon: Heart,
      color: '#df5950',
      url: 'https://qrwear.app/charity/help-kids',
      category: 'Социальное',
      image: '❤️',
      features: ['Донаты', 'История', 'Отчёты', 'Волонтёры']
    },
    {
      id: 7,
      title: 'Разработчик',
      description: 'GitHub, портфолио и резюме в одном месте',
      icon: Code,
      color: '#7c6afa',
      url: 'https://qrwear.app/dev/code-ninja',
      category: 'Технологии',
      image: '💻',
      features: ['GitHub', 'Проекты', 'CV', 'Стек технологий']
    },
    {
      id: 8,
      title: 'Персональный блог',
      description: 'Делись своими мыслями и историями',
      icon: Smartphone,
      color: '#c89afc',
      url: 'https://qrwear.app/blog/life-stories',
      category: 'Популярное',
      image: '📝',
      features: ['Статьи', 'Видео', 'Подкасты', 'Подписка']
    }
  ];

  const categories = ['Все', 'Популярное', 'Креатив', 'Бизнес', 'Технологии', 'Социальное'];
  const [selectedCategory, setSelectedCategory] = useState('Все');

  const filteredExamples = selectedCategory === 'Все' 
    ? examples 
    : examples.filter(ex => ex.category === selectedCategory);

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

      {/* Header with back button */}
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
            Примеры QR-кодов
          </h1>
          <p className="font-['Roboto'] text-white/60 text-base sm:text-lg max-w-2xl mx-auto">
            Вдохновись реальными примерами и создай свой уникальный цифровой профиль
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-['Roboto'] transition-all duration-300 text-sm sm:text-base ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white shadow-lg'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Examples Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredExamples.map((example, index) => {
            const Icon = example.icon;
            return (
              <div
                key={example.id}
                className="group relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:scale-105 hover:shadow-2xl"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 50}ms both`
                }}
              >
                {/* Category Badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white/60 text-xs font-['Roboto']">
                    {example.category}
                  </span>
                </div>

                {/* Icon */}
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-3xl"
                  style={{
                    background: `linear-gradient(135deg, ${example.color}40, ${example.color}20)`,
                    border: `2px solid ${example.color}40`
                  }}
                >
                  {example.image}
                </div>

                {/* Content */}
                <h3 className="font-['Roboto'] text-white text-lg mb-2">{example.title}</h3>
                <p className="font-['Roboto'] text-white/60 text-sm mb-4 line-clamp-2">
                  {example.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {example.features.slice(0, 3).map((feature, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded-lg bg-white/5 text-white/60 text-xs font-['Roboto']"
                    >
                      {feature}
                    </span>
                  ))}
                  {example.features.length > 3 && (
                    <span className="px-2 py-1 rounded-lg bg-white/5 text-white/60 text-xs font-['Roboto']">
                      +{example.features.length - 3}
                    </span>
                  )}
                </div>

                {/* QR Code Preview */}
                <div className="bg-white rounded-xl p-3 mb-4">
                  <QRCodeSVG
                    value={example.url}
                    size={120}
                    level="M"
                    className="w-full h-auto"
                    fgColor={example.color}
                  />
                </div>

                {/* View Button */}
                <button 
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white hover:shadow-lg transition-all text-sm font-['Roboto']"
                >
                  <ExternalLink className="w-4 h-4" />
                  Посмотреть пример
                </button>

                {/* Hover Gradient */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, ${example.color}10, transparent)`,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto text-center bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 sm:p-12">
          <h2 className="font-['Roboto'] text-2xl sm:text-3xl text-white mb-4">
            Готов создать свой уникальный QR-код?
          </h2>
          <p className="font-['Roboto'] text-white/60 text-base sm:text-lg mb-6">
            Начни бесплатно и создай свой цифровой профиль за несколько минут
          </p>
          <button
            onClick={() => onNavigate(isAuthenticated ? 'qr-creator' : 'auth')}
            className="px-8 sm:px-10 py-3 sm:py-4 rounded-full bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white font-['Roboto'] transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105 text-sm sm:text-base"
          >
            Создать QR-код
          </button>
        </div>
      </div>
    </div>
  );
}