import { useNavigate } from 'react-router-dom';
import img924Ed62AC76D4410824260231161F80CPhotoroom1 from "figma:asset/9d282855eadf5ed88f133ac91c14a91e31615720.png";
import imgE81D0A54Eb21488C977BFccc63C0F9BdPhotoroom1 from "figma:asset/2a17dc4793431ca873be8eb9ef3196d3f99b713d.png";
import { Logo } from './Logo';
import bgImage from 'figma:asset/d172e93496736130643e676214481166b0b39a36.png';

export function Homepage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-[#040404] overflow-hidden">
      {/* Futuristic Animated Background */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(4px)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#7c6afa]/20 via-transparent to-[#c89afc]/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,106,250,0.1),transparent_50%)]" />
        <div className="absolute inset-0 opacity-20" 
          style={{
            backgroundImage: `
              linear-gradient(rgba(124,106,250,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(124,106,250,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
        <div className="absolute top-20 left-20 w-2 h-2 bg-[#7c6afa] rounded-full animate-pulse" />
        <div className="absolute top-40 right-40 w-3 h-3 bg-[#c89afc] rounded-full animate-pulse delay-100" />
        <div className="absolute bottom-40 left-1/3 w-2 h-2 bg-[#df5950] rounded-full animate-pulse delay-200" />
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-[#7c6afa] rounded-full animate-pulse delay-300" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#040404]/80 border-b border-white/5">
        <div className="container mx-auto px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4">
            <button onClick={() => navigate('/')} className="transition-all duration-300 hover:scale-105">
              <Logo variant="white" size="md" />
            </button>
            <div className="hidden lg:flex items-center gap-8 font-['Roboto'] text-white">
              <button onClick={() => navigate('/')} className="hover:text-[#c89afc] transition-colors duration-300">Главная</button>
              <button onClick={() => navigate('/examples')} className="hover:text-[#c89afc] transition-colors duration-300">Примеры QR</button>
              <button onClick={() => navigate('/instructions')} className="hover:text-[#c89afc] transition-colors duration-300">Инструкция</button>
              <button onClick={() => navigate('/contacts')} className="hover:text-[#c89afc] transition-colors duration-300">Контакты</button>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 sm:px-8 py-2 sm:py-2.5 rounded-full border-2 border-white/20 text-white hover:bg-white/10 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
            >
              <span className="font-['Roboto']">Панель</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 lg:px-8 pt-32 lg:pt-40 pb-12 lg:pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
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
              onClick={() => navigate('/qr/create')}
              className="px-10 py-4 rounded-full bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white font-['Roboto'] transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105"
            >
              Смотри, как это работает
            </button>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative hidden lg:block">
            <div className="relative w-full max-w-[520px] mx-auto">
              <div className="relative">
                <img 
                  alt="QR code on clothing" 
                  className="w-full h-auto object-contain relative z-10 drop-shadow-[0_0_30px_rgba(124,106,250,0.4)]" 
                  src={img924Ed62AC76D4410824260231161F80CPhotoroom1}
                  style={{ filter: 'drop-shadow(0 0 20px rgba(124, 106, 250, 0.3))' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-4 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <img 
              alt="Digital profile preview" 
              className="w-full max-w-[482px] mx-auto h-auto object-contain" 
              src={imgE81D0A54Eb21488C977BFccc63C0F9BdPhotoroom1} 
            />
          </div>
          <div className="order-1 lg:order-2 space-y-6">
            <h2 className="font-['Roboto'] text-3xl lg:text-4xl xl:text-5xl bg-gradient-to-r from-[#7c6afa] to-[#c89afc] bg-clip-text text-transparent">
              Активируй. Делись. Впечатляй.
            </h2>
            <div className="space-y-4 font-['Roboto'] text-lg lg:text-xl text-white/90 leading-relaxed">
              <p className="underline decoration-2 underline-offset-4">Цифровой профиль — всегда с тобой.</p>
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
    </div>
  );
}
