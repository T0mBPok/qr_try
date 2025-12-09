import { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, Save, Type, Image as ImageIcon, Video, Link as LinkIcon, 
  Palette, Upload, Check, Pencil, Trash2, RotateCw, Move,
  ZoomIn, ZoomOut, Plus, Download, Eye, Home, AlertCircle, Loader2, CheckCircle
} from 'lucide-react';
import api from '../services/api';

type Page = 'home' | 'dashboard' | 'auth' | 'qr-creator' | 'qr-settings' | 'page-editor' | 'subscription' | 'preview';

interface PageEditorProps {
  onNavigate: (page: Page) => void;
  qrId: string | null;
}

type ElementType = 'text' | 'image' | 'video' | 'link' | 'drawing';

interface CanvasElement {
  id: string;
  type: ElementType;
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

export function PageEditor({ onNavigate, qrId }: PageEditorProps) {
  const [saved, setSaved] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [bgType, setBgType] = useState<'color' | 'gradient' | 'image'>('gradient');
  const [bgColor, setBgColor] = useState('#7c6afa');
  const [bgGradient, setBgGradient] = useState({ from: '#7c6afa', to: '#c89afc' });
  const [bgImage, setBgImage] = useState<string | null>(null);
  
  // API Integration states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageData, setPageData] = useState<any>(null);
  const [pageId, setPageId] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState('Моя страница');
  const [pageDescription, setPageDescription] = useState('');
  const [viewOnly, setViewOnly] = useState(false);
  
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingMode, setDrawingMode] = useState(false);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [drawings, setDrawings] = useState<DrawingPath[]>([]);
  const [drawColor, setDrawColor] = useState('#ffffff');
  const [drawWidth, setDrawWidth] = useState(3);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);

  // Fonts
  const fonts = ['Roboto', 'Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana'];
  const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72];

  // Загрузка страницы при монтировании
  useEffect(() => {
    if (qrId) {
      loadPageData();
    } else {
      setLoading(false);
      setError('QR ID не указан');
    }
  }, [qrId]);

    const loadPageData = async () => {
      if (!qrId) return;
      const check = await api.user.checkAuth();

      if (!check.ok) {
        console.log("👁 Режим просмотра (без авторизации)");
        setViewOnly(true);
      }

      try {
        setLoading(true);
        setError(null);

        console.log('📄 Загрузка страницы для QR:', qrId);

        // 1️⃣ Получаем QR
        const qrResponse = await api.qr.getById(Number(qrId));
        const qr = qrResponse;
        

        if (!qr || !qr.link) {
          throw new Error('QR не найден или отсутствует link');
        }

        // 2️⃣ Достаём page_id из link
        // пример: http://localhost:9000/page/8
        const match = qr.link.match(/\/page\/(\d+)/);
        if (!match) {
          throw new Error('В QR link не найден page_id');
        }

        const pageIdFromLink = match[1];
        console.log('📄 Найден page_id:', pageIdFromLink);

        // 3️⃣ Загружаем страницу по page_id
        const pageResponse = await api.page.getById(Number(pageIdFromLink));
        const page = pageResponse;

        if (!page) {
          throw new Error('Страница не найдена');
        }

        // 4️⃣ Инициализация состояния
        setPageData(page);
        setPageId(page.id);
        setPageTitle(page.name || 'Моя страница');
        setPageDescription(page.description || '');

        // Background
        if (page.background) {
          const bg = page.background;

          if (bg.type === 'color') {
            setBgType('color');
            setBgColor(bg.value);
          }

          if (bg.type === 'gradient') {
            setBgType('gradient');
            const match = bg.value.match(
              /linear-gradient\(135deg,\s*(.+?)\s*0%,\s*(.+?)\s*100%\)/
            );
            if (match) {
              setBgGradient({ from: match[1], to: match[2] });
            }
          }

          if (bg.type === 'image') {
            setBgType('image');
            setBgImage(bg.value);
          }
        }

        // Elements
        if (page.elements) {
          setElements(page.elements);
        }

        console.log('✅ Страница загружена:', page);

      } catch (err: any) {
        console.error('❌ Ошибка загрузки страницы:', err);
        setError(err.message || 'Не удалось загрузить страницу');
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };


  const createNewPage = async () => {
    if (!qrId) return;

    try {
      console.log("🆕 Создание новой страницы...");

      const response = await api.page.create({
        qr_id: Number(qrId),
        name: "Моя страница",
        background: {
          type: "gradient",
          value: `linear-gradient(135deg, #7c6afa 0%, #c89afc 100%)`,
        },
        elements: [],
      });

      const page = response.data;
      setPageData(page);
      setPageId(page.id);
      setPageTitle(page.name || "Моя страница");

      console.log("✅ Новая страница создана:", page);
    } catch (err: any) {
      console.error("❌ Ошибка создания страницы:", err);
      throw err;
    }
  };


  const handleSavePage = async () => {
    if (viewOnly) return;
    if (!pageId) {
      console.error('❌ Page ID не установлен');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Подготовить background в формате backend
      const background =
        bgType === "color"
          ? { type: "color", value: bgColor }
          : bgType === "gradient"
          ? {
              type: "gradient",
              value: `linear-gradient(135deg, ${bgGradient.from} 0%, ${bgGradient.to} 100%)`,
            }
          : {
              type: "image",
              value: bgImage,
            };

      // Подготовить элементы
      const formattedElements = elements.map((el) => ({
        id: el.id,
        type: el.type,
        content: el.content,
        x: el.x,
        y: el.y,
        width: el.width,
        height: el.height,
        rotation: el.rotation,
        style: {
          fontSize: el.fontSize,
          fontFamily: el.fontFamily,
          color: el.color,
          bold: el.bold,
          italic: el.italic,
          underline: el.underline,
        },
      }));

      const payload = {
        name: pageTitle,
        background,
        elements: formattedElements,
      };

      console.log("📤 Отправка payload:", payload);

      await api.page.update(pageId, payload);

      setSaved(true);
      setHasUnsavedChanges(false);
      setTimeout(() => setSaved(false), 2000);

    } catch (err: any) {
      console.error("❌ Ошибка сохранения:", err);
      setError(err.message || "Не удалось сохранить страницу");
    } finally {
      setSaving(false);
    }
  };


  // Initialize - only run once
  useEffect(() => {
    if (isInitialized && !loading) {
      // Initialization complete
    }
  }, [isInitialized, loading]);

  // Mark as changed when any state changes (but skip initial render)
  useEffect(() => {
    if (isInitialized && !loading) {
      setHasUnsavedChanges(true);
      setSaved(false);
    }
  }, [elements, drawings, bgType, bgColor, bgGradient, bgImage, isInitialized, loading]);

  const addElement = (type: ElementType) => {
    if (viewOnly) return;
    const newElement: CanvasElement = {
      id: Date.now().toString(),
      type,
      content: type === 'text' ? 'Новый текст' : type === 'link' ? 'https://' : '',
      x: 150,
      y: 150,
      width: type === 'text' ? 200 : 150,
      height: type === 'text' ? 50 : 150,
      rotation: 0,
      fontSize: 24,
      fontFamily: 'Roboto',
      color: '#ffffff',
      bold: false,
      italic: false,
      underline: false
    };
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
  };

  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    if (viewOnly) return;
    setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const deleteElement = (id: string) => {
    if (viewOnly) return;
    setElements(elements.filter(el => el.id !== id));
    if (selectedElement === id) setSelectedElement(null);
  };

  const handleMouseDown = (e: React.MouseEvent, elementId: string, action: 'drag' | 'resize' | 'rotate') => {
    e.stopPropagation();
    setSelectedElement(elementId);
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    setDragStart({ x: startX, y: startY });
    
    if (action === 'drag') setIsDragging(true);
    if (action === 'resize') setIsResizing(true);
    if (action === 'rotate') setIsRotating(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!selectedElement || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    const element = elements.find(el => el.id === selectedElement);
    if (!element) return;
    
    if (isDragging) {
      const dx = currentX - dragStart.x;
      const dy = currentY - dragStart.y;
      updateElement(selectedElement, {
        x: element.x + dx,
        y: element.y + dy
      });
      setDragStart({ x: currentX, y: currentY });
    }
    
    if (isResizing) {
      const dx = currentX - dragStart.x;
      const dy = currentY - dragStart.y;
      updateElement(selectedElement, {
        width: Math.max(50, element.width + dx),
        height: Math.max(30, element.height + dy)
      });
      setDragStart({ x: currentX, y: currentY });
    }
    
    if (isRotating) {
      const centerX = element.x + element.width / 2;
      const centerY = element.y + element.height / 2;
      const angle = Math.atan2(currentY - centerY, currentX - centerX) * (180 / Math.PI);
      updateElement(selectedElement, { rotation: angle });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setIsRotating(false);
  };

  // Drawing functions
  const startDrawing = (e: React.MouseEvent) => {
    if (!drawingMode || !drawCanvasRef.current) return;
    
    const rect = drawCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    setCurrentPath([{ x, y }]);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !drawingMode || !drawCanvasRef.current) return;
    
    const rect = drawCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCurrentPath([...currentPath, { x, y }]);
    
    const ctx = drawCanvasRef.current.getContext('2d');
    if (!ctx) return;
    
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = drawWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (currentPath.length > 0) {
      const lastPoint = currentPath[currentPath.length - 1];
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (isDrawing && currentPath.length > 0) {
      setDrawings([...drawings, { points: currentPath, color: drawColor, width: drawWidth }]);
    }
    setIsDrawing(false);
    setCurrentPath([]);
  };

  const clearDrawings = () => {
    setDrawings([]);
    if (drawCanvasRef.current) {
      const ctx = drawCanvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, drawCanvasRef.current.width, drawCanvasRef.current.height);
      }
    }
  };

  // Redraw all paths when drawings change
  useEffect(() => {
    if (!drawCanvasRef.current) return;
    
    const ctx = drawCanvasRef.current.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, drawCanvasRef.current.width, drawCanvasRef.current.height);
    
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

  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setBgImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, elementId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      // Load image without compression using canvas
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Create canvas with original dimensions
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          
          const ctx = canvas.getContext('2d');
          if (ctx) {
            // Draw image at full quality
            ctx.drawImage(img, 0, 0);
            
            // Convert to base64 with maximum quality
            const highQualityDataUrl = canvas.toDataURL('image/png', 1.0);
            updateElement(elementId, { content: highQualityDataUrl });
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>, elementId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => updateElement(elementId, { content: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setHasUnsavedChanges(false);
  };

  const selectedEl = elements.find(el => el.id === selectedElement);

  const getBackgroundStyle = () => {
    if (bgType === 'color') return { backgroundColor: bgColor };
    if (bgType === 'gradient') return {
      background: `linear-gradient(135deg, ${bgGradient.from}, ${bgGradient.to})`
    };
    if (bgType === 'image' && bgImage) return {
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    };
    return { background: `linear-gradient(135deg, ${bgGradient.from}, ${bgGradient.to})` };
  };

  return (
    <div className="min-h-screen bg-[#040404]">
      {/* Header */}
      <div className="relative z-30">
        <div className="bg-[#040404]/90 backdrop-blur-xl border-b border-white/10 px-4 py-3 sm:px-6 sm:py-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-4">
            <button
              onClick={() => {
                if (hasUnsavedChanges) {
                  setShowExitDialog(true);
                } else {
                  onNavigate('dashboard');
                }
              }}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-all text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-['Roboto'] hidden sm:inline">Назад</span>
            </button>

            <h1 className="font-['Roboto'] text-base sm:text-xl text-white">Редактор страницы</h1>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => {
                  // Save current state to localStorage for preview
                  const previewData = {
                    elements,
                    drawings,
                    bgType,
                    bgColor,
                    bgGradient,
                    bgImage
                  };
                  localStorage.setItem('previewData', JSON.stringify(previewData));
                  console.log('Preview data saved:', previewData);
                  onNavigate('preview');
                }}
                className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-all text-sm sm:text-base"
              >
                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-['Roboto'] hidden sm:inline">Превью</span>
              </button>
              
              <button
                onClick={handleSavePage}
                className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-2 rounded-lg bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white transition-all hover:shadow-lg text-sm sm:text-base"
              >
                {saving ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : <Save className="w-4 h-4 sm:w-5 sm:h-5" />}
                <span className="font-['Roboto'] hidden sm:inline">{saving ? 'Сохранение...' : saved ? 'Сохранено' : 'Сохранить'}</span>
              </button>

              {saved && (
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-all"
                >
                  <Home className="w-5 h-5" />
                  <span className="font-['Roboto']">В меню</span>
                </button>
              )}
            </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Tools */}
          <div className="lg:col-span-3 space-y-4">
            {/* Add Elements */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
              <h2 className="font-['Roboto'] text-white mb-3 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Добавить
              </h2>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => addElement('text')}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#7c6afa] hover:bg-white/10 transition-all"
                >
                  <Type className="w-5 h-5 text-[#c89afc] mx-auto mb-1" />
                  <p className="font-['Roboto'] text-white text-xs">Текст</p>
                </button>
                
                <button
                  onClick={() => addElement('image')}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#7c6afa] hover:bg-white/10 transition-all"
                >
                  <ImageIcon className="w-5 h-5 text-[#c89afc] mx-auto mb-1" />
                  <p className="font-['Roboto'] text-white text-xs">Фото</p>
                </button>
                
                <button
                  onClick={() => addElement('video')}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#7c6afa] hover:bg-white/10 transition-all"
                >
                  <Video className="w-5 h-5 text-[#c89afc] mx-auto mb-1" />
                  <p className="font-['Roboto'] text-white text-xs">Видео</p>
                </button>
                
                <button
                  onClick={() => addElement('link')}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#7c6afa] hover:bg-white/10 transition-all"
                >
                  <LinkIcon className="w-5 h-5 text-[#c89afc] mx-auto mb-1" />
                  <p className="font-['Roboto'] text-white text-xs">Ссылка</p>
                </button>
              </div>
            </div>

            {/* Drawing Tools */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
              <h2 className="font-['Roboto'] text-white mb-3 flex items-center gap-2">
                <Pencil className="w-5 h-5" />
                Рисование
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => setDrawingMode(!drawingMode)}
                  className={`w-full py-2.5 rounded-lg font-['Roboto'] text-sm transition-all ${
                    drawingMode
                      ? 'bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {drawingMode ? 'Режим рисования ON' : 'Включить рисование'}
                </button>
                
                {drawingMode && (
                  <>
                    <div className="space-y-2">
                      <label className="font-['Roboto'] text-white/60 text-xs">Цвет кисти</label>
                      <input
                        type="color"
                        value={drawColor}
                        onChange={(e) => setDrawColor(e.target.value)}
                        className="w-full h-10 rounded-lg cursor-pointer"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="font-['Roboto'] text-white/60 text-xs">Толщина: {drawWidth}px</label>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        value={drawWidth}
                        onChange={(e) => setDrawWidth(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    
                    <button
                      onClick={clearDrawings}
                      className="w-full py-2 rounded-lg bg-[#df5950]/20 text-[#df5950] hover:bg-[#df5950]/30 transition-all font-['Roboto'] text-sm"
                    >
                      Очистить рисунки
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Background Settings */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
              <h2 className="font-['Roboto'] text-white mb-3 flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Фон
              </h2>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => setBgType('color')}
                    className={`flex-1 px-2 py-2 rounded-lg font-['Roboto'] text-xs transition-all ${
                      bgType === 'color'
                        ? 'bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white'
                        : 'bg-white/5 text-white/60'
                    }`}
                  >
                    Цвет
                  </button>
                  <button
                    onClick={() => setBgType('gradient')}
                    className={`flex-1 px-2 py-2 rounded-lg font-['Roboto'] text-xs transition-all ${
                      bgType === 'gradient'
                        ? 'bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white'
                        : 'bg-white/5 text-white/60'
                    }`}
                  >
                    Градиент
                  </button>
                  <button
                    onClick={() => setBgType('image')}
                    className={`flex-1 px-2 py-2 rounded-lg font-['Roboto'] text-xs transition-all ${
                      bgType === 'image'
                        ? 'bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white'
                        : 'bg-white/5 text-white/60'
                    }`}
                  >
                    Фото
                  </button>
                </div>

                {bgType === 'color' && (
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                )}

                {bgType === 'gradient' && (
                  <div className="space-y-2">
                    <input
                      type="color"
                      value={bgGradient.from}
                      onChange={(e) => setBgGradient({ ...bgGradient, from: e.target.value })}
                      className="w-full h-10 rounded-lg cursor-pointer"
                    />
                    <input
                      type="color"
                      value={bgGradient.to}
                      onChange={(e) => setBgGradient({ ...bgGradient, to: e.target.value })}
                      className="w-full h-10 rounded-lg cursor-pointer"
                    />
                  </div>
                )}

                {bgType === 'image' && (
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBgImageUpload}
                      className="hidden"
                    />
                    <div className="p-3 border-2 border-dashed border-white/20 rounded-xl text-center cursor-pointer hover:border-[#7c6afa] transition-colors">
                      {bgImage ? (
                        <img src={bgImage} alt="Background" className="w-full h-20 object-cover rounded-lg" />
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-white/40 mx-auto mb-1" />
                          <p className="font-['Roboto'] text-white/60 text-xs">Загрузить</p>
                        </>
                      )}
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Element Settings */}
            {selectedEl && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-['Roboto'] text-white">Настройки</h2>
                  <button
                    onClick={() => deleteElement(selectedEl.id)}
                    className="p-2 rounded-lg bg-[#df5950]/20 text-[#df5950] hover:bg-[#df5950]/30 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  {selectedEl.type === 'text' && (
                    <>
                      <div className="space-y-2">
                        <label className="font-['Roboto'] text-white/60 text-xs">Шрифт</label>
                        <select
                          value={selectedEl.fontFamily}
                          onChange={(e) => updateElement(selectedEl.id, { fontFamily: e.target.value })}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#7c6afa] focus:outline-none"
                        >
                          {fonts.map(font => (
                            <option key={font} value={font}>{font}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="font-['Roboto'] text-white/60 text-xs">Размер</label>
                        <select
                          value={selectedEl.fontSize}
                          onChange={(e) => updateElement(selectedEl.id, { fontSize: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#7c6afa] focus:outline-none"
                        >
                          {fontSizes.map(size => (
                            <option key={size} value={size}>{size}px</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="font-['Roboto'] text-white/60 text-xs">Цвет</label>
                        <input
                          type="color"
                          value={selectedEl.color}
                          onChange={(e) => updateElement(selectedEl.id, { color: e.target.value })}
                          className="w-full h-10 rounded-lg cursor-pointer"
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateElement(selectedEl.id, { bold: !selectedEl.bold })}
                          className={`flex-1 py-2 rounded-lg text-xs font-['Roboto'] transition-all ${
                            selectedEl.bold ? 'bg-[#7c6afa] text-white' : 'bg-white/5 text-white/60'
                          }`}
                        >
                          B
                        </button>
                        <button
                          onClick={() => updateElement(selectedEl.id, { italic: !selectedEl.italic })}
                          className={`flex-1 py-2 rounded-lg text-xs font-['Roboto'] italic transition-all ${
                            selectedEl.italic ? 'bg-[#7c6afa] text-white' : 'bg-white/5 text-white/60'
                          }`}
                        >
                          I
                        </button>
                        <button
                          onClick={() => updateElement(selectedEl.id, { underline: !selectedEl.underline })}
                          className={`flex-1 py-2 rounded-lg text-xs font-['Roboto'] underline transition-all ${
                            selectedEl.underline ? 'bg-[#7c6afa] text-white' : 'bg-white/5 text-white/60'
                          }`}
                        >
                          U
                        </button>
                      </div>
                    </>
                  )}
                  
                  {selectedEl.type === 'image' && !selectedEl.content && (
                    <label className="block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, selectedEl.id)}
                        className="hidden"
                      />
                      <div className="p-4 border-2 border-dashed border-white/20 rounded-xl text-center cursor-pointer hover:border-[#7c6afa] transition-colors">
                        <Upload className="w-8 h-8 text-white/40 mx-auto mb-2" />
                        <p className="font-['Roboto'] text-white/60 text-sm">Загрузить фото</p>
                      </div>
                    </label>
                  )}
                  
                  {selectedEl.type === 'video' && !selectedEl.content && (
                    <label className="block">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleVideoUpload(e, selectedEl.id)}
                        className="hidden"
                      />
                      <div className="p-4 border-2 border-dashed border-white/20 rounded-xl text-center cursor-pointer hover:border-[#7c6afa] transition-colors">
                        <Upload className="w-8 h-8 text-white/40 mx-auto mb-2" />
                        <p className="font-['Roboto'] text-white/60 text-sm">Загрузить видео</p>
                      </div>
                    </label>
                  )}
                  
                  {(selectedEl.type === 'video' || selectedEl.type === 'link') && (
                    <div className="space-y-2">
                      <label className="font-['Roboto'] text-white/60 text-xs">
                        {selectedEl.type === 'video' ? 'URL видео' : 'URL ссылки'}
                      </label>
                      <input
                        type="url"
                        value={selectedEl.content}
                        onChange={(e) => updateElement(selectedEl.id, { content: e.target.value })}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#7c6afa] focus:outline-none"
                        placeholder="https://"
                      />
                    </div>
                  )}
                  
                  <div className="pt-2 border-t border-white/10">
                    <p className="font-['Roboto'] text-white/40 text-xs mb-2">
                      Используйте мышь для перемещения, изменения размера и поворота
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Center - Canvas Preview (Phone mockup) */}
          <div className="lg:col-span-9 flex justify-center">
            <div className="relative">
              {/* Phone Frame */}
              <div className="relative w-[375px] h-[667px] bg-black rounded-[40px] p-3 shadow-2xl">
                <div 
                  ref={canvasRef}
                  className="relative w-full h-full rounded-[32px] overflow-hidden"
                  style={getBackgroundStyle()}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onClick={() => !drawingMode && setSelectedElement(null)}
                >
                  {/* Elements Layer */}
                  {elements.map((element) => (
                    <div
                      key={element.id}
                      className={`absolute cursor-move ${
                        selectedElement === element.id ? 'ring-2 ring-[#7c6afa] ring-offset-2 ring-offset-transparent' : ''
                      }`}
                      style={{
                        left: element.x,
                        top: element.y,
                        width: element.width,
                        height: element.height,
                        transform: `rotate(${element.rotation}deg)`,
                        transformOrigin: 'center center'
                      }}
                      onMouseDown={(e) => !drawingMode && handleMouseDown(e, element.id, 'drag')}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!drawingMode) setSelectedElement(element.id);
                      }}
                    >
                      {element.type === 'text' && (
                        <textarea
                          value={element.content}
                          onChange={(e) => updateElement(element.id, { content: e.target.value })}
                          className="w-full h-full bg-transparent border-none resize-none focus:outline-none"
                          style={{
                            color: element.color,
                            fontSize: element.fontSize,
                            fontFamily: element.fontFamily,
                            fontWeight: element.bold ? 'bold' : 'normal',
                            fontStyle: element.italic ? 'italic' : 'normal',
                            textDecoration: element.underline ? 'underline' : 'none'
                          }}
                        />
                      )}
                      
                      {element.type === 'image' && element.content && (
                        <img src={element.content} alt="" className="w-full h-full object-contain rounded-lg" />
                      )}
                      
                      {element.type === 'video' && (
                        <div className="w-full h-full rounded-lg flex items-center justify-center overflow-hidden">
                          {element.content ? (
                            element.content.startsWith('data:video') ? (
                              <video 
                                src={element.content} 
                                className="w-full h-full object-contain rounded-lg"
                                autoPlay
                                loop
                                muted
                                playsInline
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-black/30 backdrop-blur-sm">
                                <Video className="w-12 h-12 text-white/60" />
                              </div>
                            )
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-black/30 backdrop-blur-sm">
                              <Video className="w-12 h-12 text-white/60" />
                            </div>
                          )}
                        </div>
                      )}
                      
                      {element.type === 'link' && (
                        <div className="w-full h-full bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center px-3">
                          <LinkIcon className="w-5 h-5 text-white shrink-0 mr-2" />
                          <span className="font-['Roboto'] text-white text-sm truncate">{element.content}</span>
                        </div>
                      )}
                      
                      {/* Resize handle */}
                      {selectedElement === element.id && !drawingMode && (
                        <>
                          <div
                            className="absolute -bottom-2 -right-2 w-6 h-6 bg-[#7c6afa] rounded-full cursor-se-resize flex items-center justify-center"
                            onMouseDown={(e) => handleMouseDown(e, element.id, 'resize')}
                          >
                            <ZoomIn className="w-3 h-3 text-white" />
                          </div>
                          
                          {/* Rotate handle */}
                          <div
                            className="absolute -top-8 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#c89afc] rounded-full cursor-grab flex items-center justify-center"
                            onMouseDown={(e) => handleMouseDown(e, element.id, 'rotate')}
                          >
                            <RotateCw className="w-3 h-3 text-white" />
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  
                  {/* Drawing Canvas Layer */}
                  <canvas
                    ref={drawCanvasRef}
                    width={375 - 24}
                    height={667 - 24}
                    className={`absolute inset-0 ${drawingMode ? 'cursor-crosshair' : 'pointer-events-none'}`}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                  
                  {/* Drawing Mode Indicator */}
                  {drawingMode && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-[#7c6afa] rounded-full text-white text-sm font-['Roboto'] shadow-lg">
                      Режим рисования
                    </div>
                  )}
                </div>
              </div>
              
              {/* Helper text */}
              <div className="mt-4 text-center">
                <p className="font-['Roboto'] text-white/60 text-sm">
                  Превью в размере iPhone 8/SE
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exit Dialog */}
      {showExitDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#040404] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-full bg-[#df5950]/20">
                <AlertCircle className="w-6 h-6 text-[#df5950]" />
              </div>
              <div className="flex-1">
                <h2 className="font-['Roboto'] text-white text-lg mb-2">Несохраненные изменения</h2>
                <p className="font-['Roboto'] text-white/60 text-sm">
                  У вас есть несохраненные изменения. Хотите сохранить их перед выходом?
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowExitDialog(false)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-['Roboto'] text-sm"
              >
                Отмена
              </button>
              
              <button
                onClick={() => {
                  setShowExitDialog(false);
                  onNavigate('dashboard');
                }}
                className="flex-1 px-4 py-2.5 rounded-lg bg-[#df5950]/20 border border-[#df5950]/30 text-[#df5950] hover:bg-[#df5950]/30 transition-all font-['Roboto'] text-sm"
              >
                Выйти без сохранения
              </button>
              
              <button
                onClick={() => {
                  handleSave();
                  setShowExitDialog(false);
                  setTimeout(() => onNavigate('dashboard'), 500);
                }}
                className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#7c6afa] to-[#c89afc] text-white hover:shadow-lg transition-all font-['Roboto'] text-sm"
              >
                Сохранить и выйти
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}