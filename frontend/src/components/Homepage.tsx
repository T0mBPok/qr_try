import img924Ed62AC76D4410824260231161F80CPhotoroom1 from "figma:asset/570df3af046b3e68456ff4cefb390c319f764e12.png";
import imgRectangle3 from "figma:asset/0e3d0b8cde1b4b537b85c5310cb19edb0473d193.png";
import img7Fdec1905F104F7C9Bcc559A85B9Ea72Photoroom1 from "figma:asset/e6813539f17b4e045c58f9a6d3e588e5914c727f.png";
import imgE81D0A54Eb21488C977BFccc63C0F9BdPhotoroom1 from "figma:asset/1bb58b860479754a6051ce53f029e586aebd2837.png";
import { motion } from 'motion/react';

type NavigationFunction = (page: 'home' | 'auth' | 'dashboard' | 'create-qr' | 'link-setup' | 'editor' | 'subscription') => void;

interface HomepageProps {
  onNavigate: NavigationFunction;
  isAuthenticated: boolean;
  onLogout: () => void;
}

export default function Homepage({ onNavigate, isAuthenticated, onLogout }: HomepageProps) {
  return (
    <div className="bg-[#040404] relative min-h-screen overflow-x-hidden">
      {/* Background blur effect */}
      <div className="absolute blur-[6.5px] filter h-[2914px] left-1/2 top-[24px] -translate-x-1/2 w-[1942px] max-w-[200%] pointer-events-none">
        <img 
          alt="" 
          className="absolute inset-0 max-w-none object-center object-cover opacity-25 pointer-events-none size-full" 
          src={img7Fdec1905F104F7C9Bcc559A85B9Ea72Photoroom1} 
        />
      </div>

      {/* Header Navigation */}
      <header className="relative z-10 max-w-[1920px] mx-auto px-4 md:px-8 lg:px-20 py-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
            <motion.a whileHover={{ scale: 1.1 }} className="cursor-pointer transition-colors hover:text-[#c89afc]">
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

          {/* Auth Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => isAuthenticated ? onLogout() : onNavigate('auth')}
            className="px-[30px] py-[10px] rounded-[50px] border-2 border-white/20 hover:border-white/40 transition-all"
          >
            <p className="font-['Roboto'] text-white text-nowrap">
              {isAuthenticated ? 'Выйти' : 'Зайти в кабинет'}
            </p>
          </motion.button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-[1920px] mx-auto px-4 md:px-8 lg:px-20 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent font-['Roboto']">
              <span>Одежда с историей. </span>
              <span className="underline decoration-[#7c6afa]">QR — это ключ.</span>
            </h1>
            <p className="font-['Roboto'] text-white/90 leading-relaxed max-w-[620px]">
              Создавай уникальные цифровые профили, которые активируются при сканировании QR-кода на одежде. 
              Покажи миру, что стоит за твоим стилем: ссылка, фото, видео или послание — всё в одном шве.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate(isAuthenticated ? 'create-qr' : 'auth')}
              className="bg-gradient-to-r from-[#7c6afa] to-[#c89afc] px-[30px] py-[10px] rounded-[50px] transition-all hover:shadow-lg hover:shadow-purple-500/50"
            >
              <p className="font-['Roboto'] text-white text-nowrap">
                Смотри, как это работает
              </p>
            </motion.button>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center items-center"
          >
            <div className="relative">
              {/* Circle gradient */}
              <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] md:w-[400px] md:h-[400px] lg:w-[520px] lg:h-[520px]" fill="none" viewBox="0 0 520 520">
                <motion.circle
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  cx="260" 
                  cy="260" 
                  r="235" 
                  stroke="url(#paint0_linear_1_224)" 
                  strokeWidth="50"
                />
                <defs>
                  <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_224" x1="53.1492" x2="501.682" y1="-5.64878e-05" y2="33.4325">
                    <stop stopColor="#C89AFC" />
                    <stop offset="1" stopColor="#7C6AFA" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Person image */}
              <img 
                alt="Person wearing QR code hoodie" 
                className="relative max-w-[250px] md:max-w-[350px] lg:max-w-[445px] h-auto object-cover" 
                src={img924Ed62AC76D4410824260231161F80CPhotoroom1} 
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-[1920px] mx-auto px-4 md:px-8 lg:px-20 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Image */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
          >
            <img 
              alt="Mobile app preview" 
              className="max-w-[300px] md:max-w-[400px] h-auto object-cover" 
              src={imgE81D0A54Eb21488C977BFccc63C0F9BdPhotoroom1} 
            />
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <h2 className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent font-['Roboto']">
              Активируй. Делись. Впечатляй.
            </h2>
            <div className="space-y-6 font-['Roboto'] text-white/90 leading-relaxed">
              <p className="underline">Цифровой профиль — всегда с тобой.</p>
              <p>
                Сканируй QR-код на одежде и мгновенно активируй уникальный цифровой профиль.
                Фото, соцсети, видео, цитаты — всё, что ты хочешь рассказать о себе, теперь доступно за секунды.
              </p>
              <div className="space-y-2">
                <p>👁 Покажи, кто ты.</p>
                <p>📲 Делись с друзьями.</p>
                <p>💡 Будь первым в новом тренде.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 max-w-[1920px] mx-auto px-4 md:px-8 lg:px-20 py-16 md:py-24">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent font-['Roboto'] text-center mb-16"
        >
          Отзывы клиентов
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {[
            { color: '#df5950', name: 'Иван' },
            { color: '#7c6afa', name: 'Мария' },
            { color: '#df5950', name: 'Алексей' },
            { color: '#7c6afa', name: 'Елена' }
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="relative h-[500px] md:h-[600px] lg:h-[833px] rounded-[50px] overflow-hidden group cursor-pointer"
            >
              <div className="absolute inset-0 rounded-[50px]">
                <img 
                  alt="" 
                  className="absolute w-full h-full object-cover rounded-[50px]" 
                  src={imgRectangle3} 
                />
                <div className="absolute backdrop-blur-[10px] backdrop-filter inset-0 rounded-[50px]" />
              </div>
              <div 
                className="absolute border-2 border-solid inset-0 rounded-[50px] transition-all group-hover:border-4" 
                style={{ borderColor: testimonial.color }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <p className="font-['Roboto'] text-white mb-8 leading-relaxed">
                  "Теперь моя одежда говорит за меня!"
                </p>
                <p className="font-['Roboto'] text-white">
                  {testimonial.name}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-[1920px] mx-auto px-4 md:px-8 lg:px-20 py-16 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-['Roboto'] text-white mb-4">О сервисе</h3>
            <p className="font-['Roboto'] text-white/70 leading-relaxed">
              Платформа для создания уникальных цифровых профилей с QR-кодами.
            </p>
          </div>
          <div>
            <h3 className="font-['Roboto'] text-white mb-4">Навигация</h3>
            <ul className="space-y-2 font-['Roboto'] text-white/70">
              <li className="hover:text-white transition-colors cursor-pointer">Главная</li>
              <li className="hover:text-white transition-colors cursor-pointer">Примеры QR</li>
              <li className="hover:text-white transition-colors cursor-pointer">Инструкция</li>
              <li className="hover:text-white transition-colors cursor-pointer">Контакты</li>
            </ul>
          </div>
          <div>
            <h3 className="font-['Roboto'] text-white mb-4">Контакты</h3>
            <p className="font-['Roboto'] text-white/70">Email: info@qrclothes.com</p>
            <p className="font-['Roboto'] text-white/70">Телефон: +7 (999) 123-45-67</p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="font-['Roboto'] text-white/50">© 2025 QR Clothes. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
