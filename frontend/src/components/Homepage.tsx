import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import {userAPI} from "../services/api"
import img924Ed62AC76D4410824260231161F80CPhotoroom1 from "figma:asset/9d282855eadf5ed88f133ac91c14a91e31615720.png";
import imgE81D0A54Eb21488C977BFccc63C0F9BdPhotoroom1 from "figma:asset/2a17dc4793431ca873be8eb9ef3196d3f99b713d.png";
import { Logo } from './Logo';
import bgImage from 'figma:asset/d172e93496736130643e676214481166b0b39a36.png';

export function Homepage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await userAPI.checkAuth();
        setIsAuthenticated(response.data.authenticated);
        console.log(response)
      } catch (err) {
        setIsAuthenticated(false);
      }
    }

    checkAuth();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#040404] overflow-hidden">
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

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#040404]/80 border-b border-white/5">
        <div className="container mx-auto px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4">
            {/* Logo */}
            <button
              onClick={() => navigate('/')}
              className="transition-all duration-300 hover:scale-105"
            >
              <Logo variant="white" size="md" />
            </button>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8 font-['Roboto'] text-white">
              <button onClick={() => navigate('/')} className="hover:text-[#c89afc] transition-colors duration-300">Главная</button>
              <button onClick={() => navigate('/examples')} className="hover:text-[#c89afc] transition-colors duration-300">Примеры QR</button>
              <button onClick={() => navigate('/instructions')} className="hover:text-[#c89afc] transition-colors duration-300\">Инструкция</button>
              <button onClick={() => navigate('/contacts')} className="hover:text-[#c89afc] transition-colors duration-300">Контакты</button>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => isAuthenticated ? navigate('/dashboard') : navigate('/auth')}
              className="px-6 sm:px-8 py-2 sm:py-2.5 rounded-full border-2 border-white/20 text-white hover:bg-white/10 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
            >
              <span className="font-['Roboto']">
                {isAuthenticated ? 'Панель' : 'Войти'}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 lg:px-8 pt-32 lg:pt-40 pb-12 lg:pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 lg:space-y-8">
            <h1 className="font-['Roboto'] text-4xl lg:text-5xl xl:text-6xl text-white leading-tight">
              <span>Одежда с историей. </span>
              <span className="bg-gradient-to-r from-[#7c6afa] to-[#c89afc] bg-clip-text text-transparent underline decoration-2 underline-offset-4">
                QR — это ключ.
              </span>
            </h1>
            
            <p className="font-['Roboto'] text-lg lg:text-xl xl:text-2xl text-white/90 leading-relaxed max-w-xl">
              Создавай уникальные цифровые профили, которые активируются при сканировании QR-кода на одежде. Покажи миру, что стоит за твоим стилем: ссылка, фото, видео ли послание — всё в одном шве.
            </p>

            <button 
              onClick={() => navigate("/qr/create")}
              className="px-10 py-4 rounded-full bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white font-['Roboto'] transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105"
            >
              Смотри, как это работает
            </button>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative hidden lg:block">
            <div className="relative w-full max-w-[520px] mx-auto">
              {/* Gradient Circle with Drawing Animation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 520 520">
                  <circle 
                    cx="260" 
                    cy="260" 
                    r="235" 
                    stroke="url(#heroGradient)" 
                    strokeWidth="50" 
                    fill="none"
                    strokeDasharray="1476"
                    strokeDashoffset="1476"
                    strokeLinecap="round"
                    className="animate-[draw_2s_ease-out_forwards]"
                    style={{
                      transformOrigin: 'center',
                      transform: 'rotate(-90deg)'
                    }}
                  />
                  <defs>
                    <linearGradient id="heroGradient" x1="53.1492" x2="501.682" y1="0" y2="33.4325">
                      <stop stopColor="#C89AFC" />
                      <stop offset="1" stopColor="#7C6AFA" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              {/* Model Image */}
              <div className="relative z-10 pt-8">
                {/* ЯРКИЙ ЭНЕРГЕТИЧЕСКИЙ ПОРТАЛ ВНИЗУ */}
                <div className="absolute left-1/2 -translate-x-1/2 w-[90%] z-0" style={{ bottom: '-40px' }}>
                  
                  {/* Мощное центральное свечение портала */}
                  <div 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85%] h-48 rounded-full"
                    style={{
                      background: 'radial-gradient(ellipse at center, rgba(124, 106, 250, 0.9) 0%, rgba(200, 154, 252, 0.7) 25%, rgba(223, 89, 80, 0.5) 50%, transparent 80%)',
                      filter: 'blur(30px)',
                      boxShadow: '0 0 80px rgba(124, 106, 250, 1), 0 0 120px rgba(200, 154, 252, 0.8), 0 0 160px rgba(124, 106, 250, 0.6)',
                      animation: 'pulse 2.5s ease-in-out infinite'
                    }}
                  />
                  
                  {/* Второй слой свечения */}
                  <div 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-40 rounded-full"
                    style={{
                      background: 'radial-gradient(ellipse at center, rgba(124, 106, 250, 1) 0%, rgba(200, 154, 252, 0.8) 40%, transparent 70%)',
                      filter: 'blur(20px)',
                      boxShadow: '0 0 60px rgba(124, 106, 250, 1), 0 0 100px rgba(200, 154, 252, 0.9)',
                      animation: 'pulse 2s ease-in-out infinite reverse'
                    }}
                  />
                  
                  {/* Концентрические круги с ярким свечением */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-40">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="absolute left-1/2 bottom-0 -translate-x-1/2 rounded-full"
                        style={{
                          width: `${30 + i * 15}%`,
                          height: `${40 + i * 15}px`,
                          border: `${3 - i * 0.5}px solid ${i % 2 === 0 ? '#7c6afa' : '#c89afc'}`,
                          opacity: 0.7 - i * 0.1,
                          boxShadow: `0 0 ${20 - i * 3}px ${i % 2 === 0 ? '#7c6afa' : '#c89afc'}, inset 0 0 ${15 - i * 2}px ${i % 2 === 0 ? '#7c6afa' : '#c89afc'}`,
                          animation: `pulse ${1.5 + i * 0.4}s ease-in-out infinite`,
                          animationDelay: `${i * 0.2}s`
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Энергетическая платформа с сильным свечением */}
                  <div 
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[60%] h-20 rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, rgba(124, 106, 250, 0.95), rgba(200, 154, 252, 0.9))',
                      boxShadow: '0 0 60px rgba(124, 106, 250, 1), 0 0 100px rgba(200, 154, 252, 0.9), 0 0 140px rgba(124, 106, 250, 0.7)',
                      filter: 'blur(12px)',
                      animation: 'pulse 2.5s ease-in-out infinite'
                    }}
                  />
                </div>

                {/* Усиленные вертикальные энергетические лучи */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute bottom-0"
                      style={{
                        left: `${15 + i * 6.5}%`,
                        width: '3px',
                        height: '120%',
                        background: `linear-gradient(to top, ${i % 2 === 0 ? 'rgba(124, 106, 250, 0.9)' : 'rgba(200, 154, 252, 0.9)'} 0%, ${i % 2 === 0 ? 'rgba(124, 106, 250, 0.5)' : 'rgba(200, 154, 252, 0.5)'} 50%, transparent 100%)`,
                        opacity: 0.6,
                        boxShadow: `0 0 10px ${i % 2 === 0 ? '#7c6afa' : '#c89afc'}`,
                        animation: `rise ${1.5 + Math.random() * 1.5}s ease-out infinite`,
                        animationDelay: `${i * 0.15}s`,
                        filter: 'blur(1px)'
                      }}
                    />
                  ))}
                </div>

                {/* Больше энергетических частиц */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        bottom: `${Math.random() * 30}%`,
                        width: `${3 + Math.random() * 8}px`,
                        height: `${3 + Math.random() * 8}px`,
                        background: i % 3 === 0 ? '#7c6afa' : i % 3 === 1 ? '#c89afc' : '#df5950',
                        boxShadow: `0 0 ${10 + Math.random() * 15}px ${i % 3 === 0 ? '#7c6afa' : i % 3 === 1 ? '#c89afc' : '#df5950'}`,
                        animation: `float ${2 + Math.random() * 3}s ease-in-out infinite`,
                        animationDelay: `${Math.random() * 2}s`,
                        opacity: 0.8,
                        filter: 'blur(0.5px)'
                      }}
                    />
                  ))}
                </div>

                {/* Изображение модели с эффектом свечения */}
                <div className="relative">
                  {/* Свечение вокруг модели */}
                  <div 
                    className="absolute inset-0 z-0"
                    style={{
                      filter: 'blur(25px)',
                      opacity: 0.4,
                      background: 'radial-gradient(ellipse at center bottom, rgba(124, 106, 250, 0.6) 0%, transparent 60%)',
                    }}
                  />
                  
                  <img 
                    alt="QR code on clothing" 
                    className="w-full h-auto object-contain relative z-10 drop-shadow-[0_0_30px_rgba(124,106,250,0.4)]" 
                    src={img924Ed62AC76D4410824260231161F80CPhotoroom1}
                    style={{
                      filter: 'drop-shadow(0 0 20px rgba(124, 106, 250, 0.3))'
                    }}
                  />
                </div>
                
                {/* Дополнительное энергетическое кольцо вокруг модели */}
                <div 
                  className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[75%] h-32 rounded-full pointer-events-none"
                  style={{
                    border: '2px solid rgba(124, 106, 250, 0.3)',
                    boxShadow: '0 0 40px rgba(124, 106, 250, 0.5), inset 0 0 40px rgba(200, 154, 252, 0.3)',
                    animation: 'pulse 3s ease-in-out infinite',
                    background: 'radial-gradient(ellipse at center, transparent 40%, rgba(124, 106, 250, 0.1) 70%, transparent 100%)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-4 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Phone Preview */}
          <div className="order-2 lg:order-1">
            <img 
              alt="Digital profile preview" 
              className="w-full max-w-[482px] mx-auto h-auto object-contain" 
              src={imgE81D0A54Eb21488C977BFccc63C0F9BdPhotoroom1} 
            />
          </div>

          {/* Features Content */}
          <div className="order-1 lg:order-2 space-y-6">
            <h2 className="font-['Roboto'] text-3xl lg:text-4xl xl:text-5xl bg-gradient-to-r from-[#7c6afa] to-[#c89afc] bg-clip-text text-transparent">
              Активируй. Делись. Впечатляй.
            </h2>

            <div className="space-y-4 font-['Roboto'] text-lg lg:text-xl text-white/90 leading-relaxed">
              <p className="underline decoration-2 underline-offset-4">
                Цифровой профиль — всегда с тобой.
              </p>
              
              <p>
                Сканируй QR-код на одежде и мгновенно активируй уникальный цифровой профиль.
                Фото, соцсети, видео, цитаты — всё, что ты хочешь рассказать о себе, теперь доступно за секунды.
              </p>

              <div className="space-y-2 pt-4">
                <p>👁 Покажи, кто ты.</p>
                <p>📲 Делись с друзьями.</p>
                <p>💡 Будь первым в новом тренде.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 container mx-auto px-4 lg:px-8 py-20 lg:py-32">
        <div className="text-center mb-16">
          <h2 className="font-['Roboto'] text-3xl lg:text-4xl xl:text-5xl bg-gradient-to-r from-[#7c6afa] to-[#c89afc] bg-clip-text text-transparent mb-4">
            Отзывы клиентов
          </h2>
          <p className="font-['Roboto'] text-white/60 text-lg max-w-2xl mx-auto">
            Тысячи пользователей уже создают свои уникальные цифровые профили
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              name: 'Иван Петров', 
              role: 'Предприниматель',
              avatar: '👨‍💼',
              rating: 5,
              text: 'Теперь моя одежда говорит за меня! Каждый может узнать о моём бизнесе, просто отсканировав QR-код.',
              color: '#7c6afa',
              delay: '0ms'
            },
            { 
              name: 'Мария Соколова', 
              role: 'Фотогрф',
              avatar: '📸',
              rating: 5,
              text: 'Идеальный способ показать моё потфолио! Клиенты сразу видят мои работы, когда сканируют код на моей куртке.',
              color: '#c89afc',
              delay: '100ms'
            },
            { 
              name: 'Алекс Новиков', 
              role: 'Музыкант',
              avatar: '🎸',
              rating: 5,
              text: 'Гениальная идея! Теперь люди могут послушать мою музыку и подписаться на меня в соцсетях одним касанием.',
              color: '#df5950',
              delay: '200ms'
            },
            { 
              name: 'Анна Волкова', 
              role: 'Дизайнер',
              avatar: '🎨',
              rating: 5,
              text: 'Это будущее! Моя одежда теперь интерактивна, а клиенты находят меня намного быстрее. Просто космос!',
              color: '#7c6afa',
              delay: '300ms'
            }
          ].map((testimonial, index) => (
            <div 
              key={index}
              className="group relative"
              style={{ animation: `fadeInUp 0.6s ease-out ${testimonial.delay} both` }}
            >
              {/* Card */}
              <div className="relative h-full bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
                {/* Stars Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5"
                      style={{ fill: testimonial.color }}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <div className="mb-6">
                  <svg className="w-10 h-10 mb-3 opacity-20" style={{ fill: testimonial.color }} viewBox="0 0 24 24">
                    <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                  </svg>
                  <p className="font-['Roboto'] text-white/90 leading-relaxed">
                    {testimonial.text}
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{ 
                      background: `linear-gradient(135deg, ${testimonial.color}40, ${testimonial.color}20)`,
                      border: `2px solid ${testimonial.color}40`
                    }}
                  >
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-['Roboto'] text-white">{testimonial.name}</p>
                    <p className="font-['Roboto'] text-white/60 text-sm">{testimonial.role}</p>
                  </div>
                </div>

                {/* Accent gradient on hover */}
                <div 
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, ${testimonial.color}10, transparent)`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 lg:gap-12">
          <div className="text-center">
            <p className="font-['Roboto'] text-3xl text-white mb-1">10k+</p>
            <p className="font-['Roboto'] text-white/60 text-sm">Активных пользователей</p>
          </div>
          <div className="w-px h-12 bg-white/10 hidden sm:block" />
          <div className="text-center">
            <p className="font-['Roboto'] text-3xl text-white mb-1">50k+</p>
            <p className="font-['Roboto'] text-white/60 text-sm">Созданных QR-кодов</p>
          </div>
          <div className="w-px h-12 bg-white/10 hidden sm:block" />
          <div className="text-center">
            <p className="font-['Roboto'] text-3xl text-white mb-1">1M+</p>
            <p className="font-['Roboto'] text-white/60 text-sm">Сканирований</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-20">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-['Roboto'] text-white mb-4">О платформе</h3>
              <p className="font-['Roboto'] text-white/60 text-sm leading-relaxed">
                QR-коды для одежды с уникальными цифровыми профилями
              </p>
            </div>
            <div>
              <h3 className="font-['Roboto'] text-white mb-4">Навигация</h3>
              <ul className="space-y-2 font-['Roboto'] text-white/60 text-sm">
                <li><button onClick={() => navigate('/')} className="hover:text-white transition-colors">Главная</button></li>
                <li><button onClick={() => navigate('/examples')} className="hover:text-white transition-colors">Примеры QR</button></li>
                <li><button onClick={() => navigate('/instructions')} className="hover:text-white transition-colors">Инструкция</button></li>
                <li><button onClick={() => navigate('/contacts')} className="hover:text-white transition-colors">Контакты</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-['Roboto'] text-white mb-4">Аккаунт</h3>
              <ul className="space-y-2 font-['Roboto'] text-white/60 text-sm">
                <li><button onClick={() => navigate('/auth')} className="hover:text-white transition-colors">Войти</button></li>
                <li><button onClick={() => navigate('/qr/creator')} className="hover:text-white transition-colors">Создать QR</button></li>
                <li><button onClick={() => navigate('/subscription')} className="hover:text-white transition-colors">Подписка</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-['Roboto'] text-white mb-4">Контакты</h3>
              <ul className="space-y-2 font-['Roboto'] text-white/60 text-sm">
                <li>support@qrwear.com</li>
                <li>+7 (999) 123-45-67</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <p className="font-['Roboto'] text-white/40 text-sm">
              © 2025 QR Wear. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}