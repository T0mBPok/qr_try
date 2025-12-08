import { ArrowLeft, Mail, Phone, MapPin, Send, MessageCircle, Clock, Instagram, Twitter, Linkedin, Github } from 'lucide-react';
import { useState } from 'react';
import { Logo } from './Logo';
import bgImage from 'figma:asset/d172e93496736130643e676214481166b0b39a36.png';

type Page = 'home' | 'dashboard' | 'auth' | 'qr-creator' | 'qr-settings' | 'page-editor' | 'subscription' | 'examples' | 'instructions' | 'contacts';

interface ContactsProps {
  onNavigate: (page: Page) => void;
  isAuthenticated: boolean;
}

export function Contacts({ onNavigate, isAuthenticated }: ContactsProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'support@qrwear.com',
      link: 'mailto:support@qrwear.com',
      color: '#7c6afa',
      description: 'Ответим в течение 24 часов'
    },
    {
      icon: Phone,
      title: 'Телефон',
      value: '+7 (999) 123-45-67',
      link: 'tel:+79991234567',
      color: '#c89afc',
      description: 'Пн-Пт, 10:00 - 19:00 МСК'
    },
    {
      icon: MapPin,
      title: 'Адрес',
      value: 'Москва, ул. Примерная, 123',
      link: '#',
      color: '#df5950',
      description: 'Офис работает по записи'
    },
    {
      icon: MessageCircle,
      title: 'Telegram',
      value: '@qrwear_support',
      link: 'https://t.me/qrwear_support',
      color: '#7c6afa',
      description: 'Быстрая поддержка в мессенджере'
    }
  ];

  const socialLinks = [
    { icon: Instagram, link: 'https://instagram.com/qrwear', color: '#E4405F', name: 'Instagram' },
    { icon: Twitter, link: 'https://twitter.com/qrwear', color: '#1DA1F2', name: 'Twitter' },
    { icon: Linkedin, link: 'https://linkedin.com/company/qrwear', color: '#0A66C2', name: 'LinkedIn' },
    { icon: Github, link: 'https://github.com/qrwear', color: '#ffffff', name: 'GitHub' }
  ];

  const workingHours = [
    { day: 'Понедельник - Пятница', hours: '10:00 - 19:00' },
    { day: 'Суббота', hours: '11:00 - 16:00' },
    { day: 'Воскресенье', hours: 'Выходной' }
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
            Свяжитесь с нами
          </h1>
          <p className="font-['Roboto'] text-white/60 text-base sm:text-lg max-w-2xl mx-auto">
            Мы всегда рады помочь! Выберите удобный способ связи или заполните форму ниже
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
          {/* Contact Form */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8">
            <h2 className="font-['Roboto'] text-xl sm:text-2xl text-white mb-6">
              Напишите нам
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-['Roboto'] text-white/80 text-sm mb-2 block">
                  Ваше имя
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:border-[#7c6afa] focus:outline-none transition-colors font-['Roboto']"
                  placeholder="Иван Иванов"
                  required
                />
              </div>

              <div>
                <label className="font-['Roboto'] text-white/80 text-sm mb-2 block">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:border-[#7c6afa] focus:outline-none transition-colors font-['Roboto']"
                  placeholder="ivan@example.com"
                  required
                />
              </div>

              <div>
                <label className="font-['Roboto'] text-white/80 text-sm mb-2 block">
                  Тема обращения
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:border-[#7c6afa] focus:outline-none transition-colors font-['Roboto']"
                  placeholder="Вопрос о подписке"
                  required
                />
              </div>

              <div>
                <label className="font-['Roboto'] text-white/80 text-sm mb-2 block">
                  Сообщение
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:border-[#7c6afa] focus:outline-none transition-colors font-['Roboto'] resize-none"
                  rows={5}
                  placeholder="Расскажите подробнее о вашем вопросе..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white hover:shadow-lg transition-all font-['Roboto']"
              >
                {submitted ? (
                  <>
                    <MessageCircle className="w-5 h-5" />
                    Сообщение отправлено!
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Отправить сообщение
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {/* Contact Cards */}
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <a
                  key={index}
                  href={info.link}
                  className="block bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:scale-105"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 100}ms both`
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${info.color}40, ${info.color}20)`,
                        border: `2px solid ${info.color}40`
                      }}
                    >
                      <Icon className="w-6 h-6" style={{ color: info.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-['Roboto'] text-white text-lg mb-1">
                        {info.title}
                      </h3>
                      <p className="font-['Roboto'] text-white/90 mb-1 break-all">
                        {info.value}
                      </p>
                      <p className="font-['Roboto'] text-white/60 text-sm">
                        {info.description}
                      </p>
                    </div>
                  </div>
                </a>
              );
            })}

            {/* Working Hours */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-[#7c6afa]" />
                <h3 className="font-['Roboto'] text-white text-lg">
                  Часы работы
                </h3>
              </div>
              <div className="space-y-3">
                {workingHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="font-['Roboto'] text-white/80 text-sm">
                      {schedule.day}
                    </span>
                    <span className="font-['Roboto'] text-white text-sm">
                      {schedule.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <h3 className="font-['Roboto'] text-white text-lg mb-4">
                Социальные сети
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
                    >
                      <Icon className="w-5 h-5 transition-colors" style={{ color: social.color }} />
                      <span className="font-['Roboto'] text-white/80 text-sm group-hover:text-white transition-colors">
                        {social.name}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden aspect-[21/9]">
            <div className="w-full h-full bg-gradient-to-br from-[#7c6afa]/10 to-[#c89afc]/10 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-[#7c6afa] mx-auto mb-4" />
                <p className="font-['Roboto'] text-white text-lg">
                  Интерактивная карта
                </p>
                <p className="font-['Roboto'] text-white/60 text-sm">
                  Москва, ул. Примерная, 123
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}