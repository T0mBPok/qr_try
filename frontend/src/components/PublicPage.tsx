import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Logo } from './Logo';
import { Loader2, AlertCircle, Instagram, Twitter, Facebook, Youtube, Linkedin, Link as LinkIcon, Globe, Mail, Phone, MapPin } from 'lucide-react';
import api, { Page, ContentBlock } from '../services/api';

type NavigatePage = 'home' | 'dashboard' | 'auth' | 'qr-creator' | 'qr-settings' | 'page-editor' | 'subscription' | 'preview' | 'examples' | 'instructions' | 'contacts';

interface PublicPageProps {
  shortCode: string;
  onNavigate: (page: NavigatePage) => void;
}

export function PublicPage({ shortCode, onNavigate }: PublicPageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageData, setPageData] = useState<Page | null>(null);

  useEffect(() => {
    loadPage();
    registerScan();
  }, [shortCode]);

  const loadPage = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.public.getPageByShortCode(shortCode);
      
      if (response.data.page.published) {
        setPageData(response.data.page);
      } else {
        setError('Эта страница не опубликована');
      }
    } catch (err: any) {
      console.error('Error loading page:', err);
      setError('Страница не найдена');
    } finally {
      setLoading(false);
    }
  };

  const registerScan = async () => {
    try {
      const userAgent = navigator.userAgent;
      const referrer = document.referrer;
      const deviceType = /Mobile|Android|iPhone/i.test(userAgent) ? 'mobile' : /Tablet|iPad/i.test(userAgent) ? 'tablet' : 'desktop';
      
      await api.public.registerScan(shortCode, {
        user_agent: userAgent,
        referrer: referrer,
        device_type: deviceType
      });
    } catch (err) {
      console.error('Error registering scan:', err);
    }
  };

  const getBackgroundStyle = () => {
    if (!pageData) return {};

    const { background } = pageData.content.theme;

    switch (background.type) {
      case 'color':
        return { backgroundColor: background.value };
      case 'gradient':
        return { background: background.value };
      case 'image':
        return {
          backgroundImage: `url(${background.value})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        };
      case 'video':
        return {};
      default:
        return { backgroundColor: '#040404' };
    }
  };

  const renderBlock = (block: ContentBlock) => {
    if (!block.visible) return null;

    const textColor = pageData?.content.theme.textColor || '#ffffff';
    const accentColor = pageData?.content.theme.accentColor || '#7c6afa';

    switch (block.type) {
      case 'text':
        return (
          <div
            key={block.id}
            className="w-full max-w-2xl mx-auto px-4"
            style={{
              textAlign: block.data.alignment || 'left',
              color: block.data.color || textColor,
              fontSize: block.data.fontSize === 'small' ? '14px' : block.data.fontSize === 'large' ? '24px' : block.data.fontSize === 'xlarge' ? '32px' : '16px',
              fontWeight: block.data.fontWeight || 'normal',
            }}
          >
            <p className="whitespace-pre-wrap">{block.data.text}</p>
          </div>
        );

      case 'image':
        return (
          <div key={block.id} className="w-full max-w-2xl mx-auto px-4">
            <img
              src={block.data.url}
              alt={block.data.alt || 'Image'}
              className="w-full h-auto rounded-lg"
              style={{
                maxHeight: block.data.height || 'auto',
                objectFit: block.data.fit || 'cover',
              }}
            />
            {block.data.caption && (
              <p className="text-sm text-center mt-2 opacity-70" style={{ color: textColor }}>
                {block.data.caption}
              </p>
            )}
          </div>
        );

      case 'video':
        return (
          <div key={block.id} className="w-full max-w-2xl mx-auto px-4">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={block.data.url}
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            {block.data.caption && (
              <p className="text-sm text-center mt-2 opacity-70" style={{ color: textColor }}>
                {block.data.caption}
              </p>
            )}
          </div>
        );

      case 'social_links':
        const getSocialIcon = (platform: string) => {
          switch (platform.toLowerCase()) {
            case 'instagram': return <Instagram className="w-6 h-6" />;
            case 'twitter': return <Twitter className="w-6 h-6" />;
            case 'facebook': return <Facebook className="w-6 h-6" />;
            case 'youtube': return <Youtube className="w-6 h-6" />;
            case 'linkedin': return <Linkedin className="w-6 h-6" />;
            case 'website': return <Globe className="w-6 h-6" />;
            case 'email': return <Mail className="w-6 h-6" />;
            case 'phone': return <Phone className="w-6 h-6" />;
            default: return <LinkIcon className="w-6 h-6" />;
          }
        };

        return (
          <div key={block.id} className="w-full max-w-2xl mx-auto px-4">
            <div className={`flex ${block.data.layout === 'grid' ? 'grid grid-cols-2 gap-4' : 'flex-wrap justify-center gap-4'}`}>
              {block.data.links?.map((link: any, index: number) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: link.color || accentColor,
                    color: '#ffffff',
                  }}
                >
                  {getSocialIcon(link.platform)}
                  {block.data.layout === 'buttons' && <span>{link.username || link.platform}</span>}
                </a>
              ))}
            </div>
          </div>
        );

      case 'link_button':
        return (
          <div key={block.id} className="w-full max-w-2xl mx-auto px-4">
            <a
              href={block.data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-8 py-4 rounded-full text-center transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: block.data.backgroundColor || accentColor,
                color: block.data.textColor || '#ffffff',
                fontSize: block.data.fontSize || '16px',
                fontWeight: block.data.fontWeight || 'normal',
              }}
            >
              {block.data.icon && <span className="mr-2">{block.data.icon}</span>}
              {block.data.text}
            </a>
          </div>
        );

      case 'gallery':
        return (
          <div key={block.id} className="w-full max-w-4xl mx-auto px-4">
            <div className={`grid gap-4 ${block.data.columns === 2 ? 'grid-cols-2' : block.data.columns === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
              {block.data.images?.map((image: any, index: number) => (
                <div key={index} className="relative overflow-hidden rounded-lg aspect-square">
                  <img
                    src={image.url}
                    alt={image.alt || `Gallery image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'divider':
        return (
          <div key={block.id} className="w-full max-w-2xl mx-auto px-4">
            <hr
              className="border-0"
              style={{
                height: block.data.thickness || '1px',
                backgroundColor: block.data.color || textColor,
                opacity: block.data.opacity || 0.3,
              }}
            />
          </div>
        );

      case 'spacer':
        return (
          <div
            key={block.id}
            style={{
              height: block.data.height || '40px',
            }}
          />
        );

      case 'contact_form':
        return (
          <div key={block.id} className="w-full max-w-2xl mx-auto px-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 space-y-4">
              <h3 className="text-xl font-semibold" style={{ color: textColor }}>
                {block.data.title || 'Связаться со мной'}
              </h3>
              <input
                type="text"
                placeholder="Имя"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30"
              />
              <textarea
                placeholder="Сообщение"
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30 resize-none"
              />
              <button
                className="w-full px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: accentColor,
                  color: '#ffffff',
                }}
              >
                Отправить
              </button>
            </div>
          </div>
        );

      case 'embed':
        return (
          <div key={block.id} className="w-full max-w-4xl mx-auto px-4">
            <div
              className="w-full"
              dangerouslySetInnerHTML={{ __html: block.data.code }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#040404] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#7c6afa] animate-spin mx-auto mb-4" />
          <p className="text-white/60">Загрузка страницы...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !pageData) {
    return (
      <div className="min-h-screen bg-[#040404]">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#040404]/80 border-b border-white/5">
          <div className="container mx-auto px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
            <div className="flex items-center justify-between">
              <Logo variant="white" size="md" />
              <button
                onClick={() => onNavigate('auth')}
                className="px-6 sm:px-8 py-2 sm:py-2.5 rounded-full border-2 border-white/20 text-white hover:bg-white/10 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
              >
                <span className="font-['Roboto']">Войти</span>
              </button>
            </div>
          </div>
        </header>

        {/* Error content */}
        <div className="flex items-center justify-center min-h-screen pt-32">
          <div className="text-center max-w-md px-4">
            <AlertCircle className="w-16 h-16 text-[#df5950] mx-auto mb-6" />
            <h1 className="text-3xl font-['Roboto'] text-white mb-4">
              {error || 'Страница не найдена'}
            </h1>
            <p className="text-white/60 mb-8">
              К сожалению, эта страница не существует или была удалена.
            </p>
            <button
              onClick={() => onNavigate('home')}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white transition-all duration-300 hover:scale-105"
            >
              На главную
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state - render page
  const sortedBlocks = [...pageData.content.blocks].sort((a, b) => a.order - b.order);

  return (
    <div
      className="min-h-screen"
      style={getBackgroundStyle()}
    >
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/5">
        <div className="container mx-auto px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="flex items-center justify-between">
            <Logo variant="white" size="md" />
            <button
              onClick={() => onNavigate('auth')}
              className="px-6 sm:px-8 py-2 sm:py-2.5 rounded-full border-2 border-white/20 text-white hover:bg-white/10 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
            >
              <span className="font-['Roboto']">Войти</span>
            </button>
          </div>
        </div>
      </header>

      {/* Background Video (if applicable) */}
      {pageData.content.theme.background.type === 'video' && (
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            src={pageData.content.theme.background.value}
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      {/* Content */}
      <main className="relative z-10 pt-32 pb-20">
        <div className="container mx-auto">
          {/* Page Title */}
          <div className="text-center mb-12 px-4">
            <h1
              className="text-4xl lg:text-5xl font-['Roboto'] mb-4"
              style={{ color: pageData.content.theme.textColor }}
            >
              {pageData.title}
            </h1>
            {pageData.description && (
              <p
                className="text-lg lg:text-xl opacity-80 max-w-2xl mx-auto"
                style={{ color: pageData.content.theme.textColor }}
              >
                {pageData.description}
              </p>
            )}
          </div>

          {/* Content Blocks */}
          <div className="space-y-8">
            {sortedBlocks.map(block => renderBlock(block))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p
              className="text-sm opacity-60"
              style={{ color: pageData.content.theme.textColor }}
            >
              Создано с помощью QR Wear
            </p>
            <button
              onClick={() => onNavigate('home')}
              className="mt-2 text-sm transition-colors duration-300"
              style={{
                color: pageData.content.theme.accentColor,
              }}
            >
              Создать свою страницу
            </button>
          </div>
        </div>
      </footer>

      {/* Animations */}
      {pageData.content.settings?.animations?.enabled && (
        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            
            main > div > div:not(.text-center) {
              animation: fadeIn ${pageData.content.settings.animations.duration || '0.3s'} ease-out both;
            }
            
            main > div > div:nth-child(1) { animation-delay: 0.1s; }
            main > div > div:nth-child(2) { animation-delay: 0.2s; }
            main > div > div:nth-child(3) { animation-delay: 0.3s; }
            main > div > div:nth-child(4) { animation-delay: 0.4s; }
            main > div > div:nth-child(5) { animation-delay: 0.5s; }
            main > div > div:nth-child(6) { animation-delay: 0.6s; }
            main > div > div:nth-child(7) { animation-delay: 0.7s; }
            main > div > div:nth-child(8) { animation-delay: 0.8s; }
          `}
        </style>
      )}
    </div>
  );
}
