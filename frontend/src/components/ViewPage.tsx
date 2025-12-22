import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from '../services/api';

const PageViewer: React.FC = () => {
  const navigate = useNavigate();
  const { pageId } = useParams<{ pageId: string }>();
  
  const [page, setPage] = useState<any>(null);
  const [pageTitle, setPageTitle] = useState('Моя страница');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawings, setDrawings] = useState<any[]>([]);
  const parseYoutubeId = (url: string): string | null => {
    const regExp = /(?:youtube\.com\/.*v=|youtu\.be\/)([^&]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };


  // Загрузка страницы ПРЯМО ПО PAGEID
  useEffect(() => {
    if (pageId) {
      loadPageData();
    } else {
      setLoading(false);
      setError('Page ID не указан');
    }
  }, [pageId]);

  const loadPageData = async () => {
    if (!pageId) return;

    try {
      setLoading(true);
      setError(null);

      console.log('📄 Загрузка страницы по ID:', pageId);

      // 1️⃣ СРАЗУ Загружаем страницу по page_id
      const pageResponse = await api.page.getById(Number(pageId));
      const pageData = pageResponse;

      if (!pageData) {
        throw new Error('Страница не найдена');
      }

      // 2️⃣ Инициализация состояния
      setPageTitle(pageData.name || 'Моя страница');
      setPage(pageData);

      // 3️⃣ Парсим drawings ТОЧНО КАК В РЕДАКТОРЕ
      const parsedDrawings: any[] = [];
      if (pageData.elements) {
        pageData.elements.forEach((el: any) => {
          if (el.type === 'drawing') {
            try {
              const points = JSON.parse(el.content);
              parsedDrawings.push({
                points,
                color: el.style?.color || '#ffffff',
                width: el.style?.lineWidth || 3
              });
            } catch (err) {
              console.error('Ошибка парсинга drawing:', err);
            }
          }
        });
      }
      setDrawings(parsedDrawings);

      console.log('✅ Страница загружена:', pageData);
      console.log('🎨 Элементы:', pageData.elements);

    } catch (err: any) {
      console.error('❌ Ошибка загрузки страницы:', err);
      setError(err.message || 'Не удалось загрузить страницу');
    } finally {
      setLoading(false);
    }
  };

  // Canvas ТОЛЬКО для рисунков (как в редакторе)
  useEffect(() => {
    if (!canvasRef.current || drawings.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 351; // 375 - 24 (padding)
    canvas.height = 643; // 667 - 24 (padding)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawings.forEach(drawing => {
      ctx.strokeStyle = drawing.color;
      ctx.lineWidth = drawing.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      if (drawing.points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(drawing.points[0].x, drawing.points[0].y);
        for (let i = 1; i < drawing.points.length; i++) {
          ctx.lineTo(drawing.points[i].x, drawing.points[i].y);
        }
        ctx.stroke();
      }
    });
  }, [drawings]);

  // Фон как в редакторе
  const getBackgroundStyle = () => {
    if (!page?.background) {
      return { 
        background: 'linear-gradient(135deg, #7c6afa 0%, #c89afc 100%)' 
      };
    }
    
    const bg = page.background;
    if (bg.type === 'color') {
      return { backgroundColor: bg.value };
    }
    if (bg.type === 'gradient') {
      return { background: bg.value };
    }
    if (bg.type === 'image') {
      return {
        backgroundImage: `url(${bg.value})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    return {};
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#7c6afa] to-[#c89afc] flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Загрузка страницы...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#7c6afa] to-[#c89afc] flex items-center justify-center">
        <div className="text-white text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#7c6afa] to-[#c89afc]">
      {/* КНОПКА "ВОЙТИ" СПРАВА СВЕРХУ */}
      <button
        onClick={() => navigate('/auth')}
        className="fixed top-4 right-4 z-50 px-6 py-3 bg-white/20 backdrop-blur-xl text-white rounded-xl hover:bg-white/30 transition-all font-medium border border-white/30 shadow-xl"
      >
        Войти
      </button>

      {/* ТЕЛЕФОННЫЙ ФРЕЙМ */}
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="w-[375px] h-[667px] bg-black rounded-[40px] p-6 shadow-2xl">
          <div 
            className="w-full h-full rounded-[32px] overflow-hidden relative"
            style={getBackgroundStyle()}
          >
            {/* ✅ DOM-ЭЛЕМЕНТЫ как в PageEditor */}
            {page?.elements?.map((el: any) => {
                if (el.type === 'drawing') return null;

                return (
                    <div
                    key={el.id}
                    className="absolute select-none"
                    style={{
                        left: el.x || 0,
                        top: el.y || 0,
                        width: el.width || 150,
                        height: el.height || 50,
                        transform: `rotate(${el.rotation || 0}deg)`,
                        transformOrigin: 'center center'
                    }}
                    >
                    {/* Текст */}
                    {el.type === 'text' && el.content && (
                        <div
                        className="w-full h-full flex items-center justify-center p-2 overflow-hidden"
                        style={{
                            color: el.style?.color || '#000000',
                            fontSize: `${el.style?.fontSize || 24}px`,
                            fontFamily: el.style?.fontFamily || 'Roboto',
                            fontWeight: el.style?.bold ? 'bold' : 'normal',
                            textDecoration: el.style?.underline ? 'underline' : 'none',
                            fontStyle: el.style?.italic ? 'italic' : 'normal'
                        }}
                        >
                        {el.content}
                        </div>
                    )}
                    
                    {/* Изображение */}
                    {el.type === 'image' && el.content?.startsWith('data:image') && (
                        <img 
                        src={el.content} 
                        alt="" 
                        className="w-full h-full object-contain"
                        style={{ borderRadius: '4px' }}
                        />
                    )}
                    
                    {/* ✅ ВИДЕО — правильный рендер */}
                    {el.type === 'video' && el.content && (
                        el.content.startsWith('data:video') ? (
                        <video
                            src={el.content}
                            className="w-full h-full object-cover rounded"
                            controls
                            autoPlay={true}
                            playsInline
                            style={{ 
                            backgroundColor: '#000',
                            borderRadius: '4px'
                            }}
                        />
                        ) : (
                        <div className="w-full h-full bg-black/50 flex items-center justify-center rounded">
                            <span className="text-white text-sm font-medium">▶ Видео</span>
                        </div>
                        )
                    )}
                    
                    {/* Ссылка */}
                    {el.type === 'link' && el.content && (
                        <div className="w-full h-full border-2 border-blue-400/50 bg-blue-400/10 rounded flex items-center justify-center hover:border-blue-400 hover:bg-blue-400/20 transition-all">
                        <span className="text-blue-400 text-xs font-medium px-2 truncate">
                            🔗 {el.content.slice(0, 20)}...
                        </span>
                        </div>
                    )}
                    
                    {/* YouTube */}
                    {el.type === 'youtube' && el.content && (() => {
                        const id = parseYoutubeId(el.content);
                        if (!id) return null;
                        return (
                            <iframe
                            src={`https://www.youtube.com/embed/${id}`}
                            className="w-full h-full rounded"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            loading="lazy"
                            style={{ border: 'none' }}
                            />
                        );
                        })()}
{/* 
                        <div className="w-full h-full bg-red-600/20 border-2 border-red-500/50 rounded flex items-center justify-center">
                        <span className="text-red-400 text-sm font-medium">📺 YouTube</span>
                        </div>
                    )} */}
                    </div>
                );
                })}

            {/* ✅ Canvas ТОЛЬКО ДЛЯ РИСУНКОВ */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 pointer-events-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageViewer;
