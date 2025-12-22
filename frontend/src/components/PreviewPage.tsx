import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { ArrowLeft, Smartphone, Tablet, Monitor, Laptop } from 'lucide-react';
import { Download } from 'lucide-react';

type Page = 'home' | 'dashboard' | 'auth' | 'qr-creator' | 'qr-settings' | 'page-editor' | 'subscription' | 'preview';

type DeviceType = 'iphone' | 'ipad' | 'android' | 'desktop';

interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'video' | 'link' | 'drawing';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

interface DrawingPath {
  points: { x: number; y: number }[];
  color: string;
  width: number;
}

interface PreviewData {
  elements: CanvasElement[];
  drawings: DrawingPath[];
  bgType: 'color' | 'gradient' | 'image';
  bgColor: string;
  bgGradient: { from: string; to: string };
  bgImage: string | null;
}

export function PreviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const qrId = location.state?.qrId;
  const pageId = location.state?.pageId;
  const [device, setDevice] = useState<DeviceType>('iphone');
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);

  // Device configurations
  const devices = [
    { 
      name: 'iPhone 8/SE',
      icon: Smartphone,
      width: 375, 
      height: 667, 
      scale: 1
    },
    { 
      name: 'Android Phone',
      icon: Smartphone,
      width: 360, 
      height: 640, 
      scale: 1
    },
    { 
      name: 'iPad',
      icon: Tablet,
      width: 768, 
      height: 1024, 
      scale: 0.65
    },
    { 
      name: 'Desktop',
      icon: Monitor,
      width: 1200, 
      height: 800, 
      scale: 0.75
    }
  ];

  const currentDevice = devices.find(d => d.name === device) || devices[0];

  useEffect(() => {
    // Load preview data from localStorage
    const savedData = localStorage.getItem('previewData');
    if (savedData) {
      setPreviewData(JSON.parse(savedData));
    }
  }, []);

  // Redraw canvas when data changes
  useEffect(() => {
    if (!drawCanvasRef.current || !previewData) return;
    
    const canvas = drawCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size based on device
    canvas.width = currentDevice.width;
    canvas.height = currentDevice.height;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    previewData.drawings.forEach(drawing => {
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
  }, [previewData, device, currentDevice]);

  const getBackgroundStyle = () => {
    if (!previewData) return {};
    
    if (previewData.bgType === 'color') return { backgroundColor: previewData.bgColor };
    if (previewData.bgType === 'gradient') return {
      background: `linear-gradient(135deg, ${previewData.bgGradient.from}, ${previewData.bgGradient.to})`
    };
    if (previewData.bgType === 'image' && previewData.bgImage) return {
      backgroundImage: `url(${previewData.bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    };
    return { background: `linear-gradient(135deg, #7c6afa, #c89afc)` };
  };

  if (!previewData) {
    return (
      <div className="min-h-screen bg-[#040404] flex items-center justify-center">
        <div className="text-white font-['Roboto']">Загрузка предпросмотра...</div>
      </div>
    );
  }

  const DeviceIcon = currentDevice.icon;

  return (
    <div className="min-h-screen bg-[#040404]">
      {/* Header */}
      <div className="bg-[#040404]/90 backdrop-blur-xl border-b border-white/10 px-4 py-3 sm:px-6 sm:py-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-4">
            <button
              onClick={() => navigate(`/page/${pageId}`, { state: {qrId: qrId}})}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-all text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-['Roboto'] hidden sm:inline">Назад</span>
            </button>

            <h1 className="font-['Roboto'] text-base sm:text-xl text-white">Предпросмотр</h1>

            {/* <button className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white transition-all hover:shadow-lg text-sm sm:text-base">
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-['Roboto'] hidden sm:inline">Экспорт</span>
            </button> */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left - Device Selector */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
              <h2 className="font-['Roboto'] text-white mb-4 text-sm sm:text-base">Выберите устройство</h2>
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">{devices.map((d) => (
                  <button
                    key={d.name}
                    onClick={() => setDevice(d.name)}
                    className={`flex items-center gap-3 px-3 sm:px-4 py-3 rounded-xl transition-all text-left ${
                      device === d.name
                        ? 'bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white'
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-['Roboto'] text-xs sm:text-sm truncate">{d.name}</p>
                      <p className="font-['Roboto'] text-[10px] sm:text-xs opacity-60 truncate">
                        {d.width}×{d.height}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center - Preview Canvas */}
          <div className="lg:col-span-9 flex justify-center items-start overflow-x-auto">
            <div className="relative" style={{ minWidth: 'min-content' }}>
              {/* Device Frame */}
              <div 
                className={`relative bg-black shadow-2xl ${
                  device === 'desktop' ? 'rounded-lg' : 'rounded-[40px] p-3'
                }`}
                style={{
                  width: device === 'desktop' ? currentDevice.width * currentDevice.scale : currentDevice.width + 24,
                  height: device === 'desktop' ? currentDevice.height * currentDevice.scale : currentDevice.height + 24,
                  maxWidth: '100%'
                }}
              >
                <div 
                  className={`relative w-full h-full overflow-hidden ${
                    device === 'desktop' ? 'rounded-lg' : 'rounded-[32px]'
                  }`}
                  style={{
                    ...getBackgroundStyle()
                  }}
                >
                  {/* Elements Layer */}
                  {previewData.elements.map((element) => (
                    <div
                      key={element.id}
                      className="absolute"
                      style={{
                        left: element.x,
                        top: element.y,
                        width: element.width,
                        height: element.height,
                        transform: `rotate(${element.rotation}deg)`,
                        transformOrigin: 'center center'
                      }}
                    >
                      {element.type === 'text' && (
                        <div
                          className="w-full h-full overflow-hidden"
                          style={{
                            color: element.color,
                            fontSize: element.fontSize,
                            fontFamily: element.fontFamily,
                            fontWeight: element.bold ? 'bold' : 'normal',
                            fontStyle: element.italic ? 'italic' : 'normal',
                            textDecoration: element.underline ? 'underline' : 'none',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word'
                          }}
                        >
                          {element.content}
                        </div>
                      )}
                      
                      {element.type === 'image' && element.content && (
                        <img src={element.content} alt="" className="w-full h-full object-contain rounded-lg" />
                      )}
                      
                      {element.type === 'video' && element.content && element.content.startsWith('data:video') && (
                        <video 
                          src={element.content} 
                          className="w-full h-full object-contain rounded-lg"
                          autoPlay
                          loop
                          muted
                          playsInline
                        />
                      )}
                      
                      {element.type === 'link' && (
                        <div className="w-full h-full bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center px-3">
                          <span className="font-['Roboto'] text-white text-sm truncate">{element.content}</span>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Drawing Canvas Layer */}
                  <canvas
                    ref={drawCanvasRef}
                    className="absolute inset-0 pointer-events-none"
                  />
                </div>
              </div>
              
              {/* Helper text */}
              <div className="mt-4 text-center">
                <p className="font-['Roboto'] text-white/60 text-sm">
                  Так будет выглядеть ваша страница на {currentDevice.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}