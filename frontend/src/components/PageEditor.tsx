import { useState } from 'react';
import { motion, Reorder } from 'motion/react';
import {
  ArrowLeft,
  Save,
  Eye,
  Type,
  Image as ImageIcon,
  Video,
  Link2,
  Palette,
  Plus,
  GripVertical,
  Trash2,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Upload,
  Smartphone,
  Monitor
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type NavigationFunction = (page: 'home' | 'auth' | 'dashboard' | 'create-qr' | 'link-setup' | 'editor' | 'subscription') => void;

interface PageEditorProps {
  qrId: string | null;
  onNavigate: NavigationFunction;
}

interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'video' | 'link';
  content: any;
}

export default function PageEditor({ qrId, onNavigate }: PageEditorProps) {
  const [previewMode, setPreviewMode] = useState(false);
  const [devicePreview, setDevicePreview] = useState<'mobile' | 'desktop'>('mobile');
  const [backgroundColor, setBackgroundColor] = useState('#040404');
  const [backgroundType, setBackgroundType] = useState<'color' | 'gradient' | 'image'>('color');
  const [gradientStart, setGradientStart] = useState('#7c6afa');
  const [gradientEnd, setGradientEnd] = useState('#c89afc');
  
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([
    {
      id: '1',
      type: 'text',
      content: {
        text: 'Привет! Я Иван',
        fontSize: 32,
        textAlign: 'center',
        color: '#ffffff',
        isBold: true
      }
    },
    {
      id: '2',
      type: 'text',
      content: {
        text: 'Дизайнер и разработчик',
        fontSize: 18,
        textAlign: 'center',
        color: '#c89afc'
      }
    }
  ]);

  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

  const addBlock = (type: 'text' | 'image' | 'video' | 'link') => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      content: type === 'text' 
        ? { text: 'Новый текстовый блок', fontSize: 16, textAlign: 'left', color: '#ffffff' }
        : type === 'image'
        ? { url: '', alt: '' }
        : type === 'video'
        ? { url: '' }
        : { url: '', title: 'Ссылка' }
    };
    setContentBlocks([...contentBlocks, newBlock]);
    setSelectedBlock(newBlock.id);
  };

  const updateBlock = (id: string, content: any) => {
    setContentBlocks(contentBlocks.map(block =>
      block.id === id ? { ...block, content: { ...block.content, ...content } } : block
    ));
  };

  const deleteBlock = (id: string) => {
    setContentBlocks(contentBlocks.filter(block => block.id !== id));
    if (selectedBlock === id) setSelectedBlock(null);
  };

  const getBackgroundStyle = () => {
    if (backgroundType === 'gradient') {
      return { background: `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})` };
    }
    return { backgroundColor };
  };

  const renderBlock = (block: ContentBlock) => {
    switch (block.type) {
      case 'text':
        return (
          <p
            className="font-['Roboto'] transition-all"
            style={{
              fontSize: `${block.content.fontSize}px`,
              textAlign: block.content.textAlign,
              color: block.content.color,
              fontWeight: block.content.isBold ? 'bold' : 'normal',
              fontStyle: block.content.isItalic ? 'italic' : 'normal',
              lineHeight: '1.5'
            }}
          >
            {block.content.text}
          </p>
        );
      case 'image':
        return block.content.url ? (
          <img
            src={block.content.url}
            alt={block.content.alt || ''}
            className="w-full h-auto rounded-xl"
          />
        ) : (
          <div className="w-full h-40 bg-white/10 rounded-xl flex items-center justify-center">
            <ImageIcon className="w-12 h-12 text-white/30" />
          </div>
        );
      case 'video':
        return block.content.url ? (
          <div className="aspect-video bg-black rounded-xl overflow-hidden">
            <iframe
              src={block.content.url}
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="w-full h-40 bg-white/10 rounded-xl flex items-center justify-center">
            <Video className="w-12 h-12 text-white/30" />
          </div>
        );
      case 'link':
        return (
          <a
            href={block.content.url || '#'}
            className="block px-6 py-3 bg-gradient-to-r from-[#7c6afa] to-[#c89afc] rounded-xl text-white font-['Roboto'] text-center hover:opacity-90 transition-opacity"
          >
            {block.content.title}
          </a>
        );
      default:
        return null;
    }
  };

  const renderEditor = (block: ContentBlock) => {
    switch (block.type) {
      case 'text':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white/90">Текст</Label>
              <Textarea
                value={block.content.text}
                onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                className="bg-white/5 border-white/10 text-white min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/90">Размер</Label>
                <Input
                  type="number"
                  value={block.content.fontSize}
                  onChange={(e) => updateBlock(block.id, { fontSize: parseInt(e.target.value) })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/90">Цвет</Label>
                <Input
                  type="color"
                  value={block.content.color}
                  onChange={(e) => updateBlock(block.id, { color: e.target.value })}
                  className="bg-white/5 border-white/10 h-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateBlock(block.id, { isBold: !block.content.isBold })}
                className={`${block.content.isBold ? 'bg-[#7c6afa]/20 border-[#7c6afa]' : 'bg-white/5 border-white/10'} text-white`}
              >
                <Bold className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateBlock(block.id, { isItalic: !block.content.isItalic })}
                className={`${block.content.isItalic ? 'bg-[#7c6afa]/20 border-[#7c6afa]' : 'bg-white/5 border-white/10'} text-white`}
              >
                <Italic className="w-4 h-4" />
              </Button>
              <div className="flex-1" />
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateBlock(block.id, { textAlign: 'left' })}
                className={`${block.content.textAlign === 'left' ? 'bg-[#7c6afa]/20 border-[#7c6afa]' : 'bg-white/5 border-white/10'} text-white`}
              >
                <AlignLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateBlock(block.id, { textAlign: 'center' })}
                className={`${block.content.textAlign === 'center' ? 'bg-[#7c6afa]/20 border-[#7c6afa]' : 'bg-white/5 border-white/10'} text-white`}
              >
                <AlignCenter className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateBlock(block.id, { textAlign: 'right' })}
                className={`${block.content.textAlign === 'right' ? 'bg-[#7c6afa]/20 border-[#7c6afa]' : 'bg-white/5 border-white/10'} text-white`}
              >
                <AlignRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );
      case 'image':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white/90">URL изображения</Label>
              <Input
                value={block.content.url}
                onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/90">Описание (alt text)</Label>
              <Input
                value={block.content.alt}
                onChange={(e) => updateBlock(block.id, { alt: e.target.value })}
                placeholder="Описание изображения"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <Button variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10">
              <Upload className="w-4 h-4 mr-2" />
              Загрузить изображение
            </Button>
          </div>
        );
      case 'video':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white/90">URL видео (YouTube/Vimeo)</Label>
              <Input
                value={block.content.url}
                onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                placeholder="https://www.youtube.com/embed/..."
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <p className="font-['Roboto'] text-white/50">
              Используйте embed-ссылку из YouTube или Vimeo
            </p>
          </div>
        );
      case 'link':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white/90">Текст кнопки</Label>
              <Input
                value={block.content.title}
                onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                placeholder="Название ссылки"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/90">URL</Label>
              <Input
                value={block.content.url}
                onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                placeholder="https://example.com"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#040404]">
      {/* Top Bar */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-white/70 hover:text-white transition-colors font-['Roboto'] flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Выход
          </button>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
              className="bg-white/5 border-white/10 text-white hover:bg-white/10"
            >
              <Eye className="w-4 h-4 mr-2" />
              {previewMode ? 'Редактировать' : 'Предпросмотр'}
            </Button>
            <Button
              size="sm"
              onClick={() => onNavigate('dashboard')}
              className="bg-gradient-to-r from-[#7c6afa] to-[#c89afc] hover:opacity-90"
            >
              <Save className="w-4 h-4 mr-2" />
              Сохранить
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto flex h-[calc(100vh-73px)]">
        {/* Left Sidebar - Tools */}
        {!previewMode && (
          <div className="w-[280px] border-r border-white/10 bg-white/5 p-6 overflow-y-auto">
            <h3 className="font-['Roboto'] text-white mb-4">Добавить элемент</h3>
            <div className="space-y-2 mb-8">
              <Button
                onClick={() => addBlock('text')}
                variant="outline"
                className="w-full justify-start bg-white/5 border-white/10 text-white hover:bg-white/10"
              >
                <Type className="w-4 h-4 mr-2" />
                Текст
              </Button>
              <Button
                onClick={() => addBlock('image')}
                variant="outline"
                className="w-full justify-start bg-white/5 border-white/10 text-white hover:bg-white/10"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Изображение
              </Button>
              <Button
                onClick={() => addBlock('video')}
                variant="outline"
                className="w-full justify-start bg-white/5 border-white/10 text-white hover:bg-white/10"
              >
                <Video className="w-4 h-4 mr-2" />
                Видео
              </Button>
              <Button
                onClick={() => addBlock('link')}
                variant="outline"
                className="w-full justify-start bg-white/5 border-white/10 text-white hover:bg-white/10"
              >
                <Link2 className="w-4 h-4 mr-2" />
                Ссылка/Кнопка
              </Button>
            </div>

            <h3 className="font-['Roboto'] text-white mb-4">Фон страницы</h3>
            <div className="space-y-4">
              <Select value={backgroundType} onValueChange={(value: any) => setBackgroundType(value)}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10">
                  <SelectItem value="color">Цвет</SelectItem>
                  <SelectItem value="gradient">Градиент</SelectItem>
                  <SelectItem value="image">Изображение</SelectItem>
                </SelectContent>
              </Select>

              {backgroundType === 'color' && (
                <Input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="h-12 bg-white/5 border-white/10"
                />
              )}

              {backgroundType === 'gradient' && (
                <div className="space-y-2">
                  <Label className="text-white/90">Начальный цвет</Label>
                  <Input
                    type="color"
                    value={gradientStart}
                    onChange={(e) => setGradientStart(e.target.value)}
                    className="h-12 bg-white/5 border-white/10"
                  />
                  <Label className="text-white/90">Конечный цвет</Label>
                  <Input
                    type="color"
                    value={gradientEnd}
                    onChange={(e) => setGradientEnd(e.target.value)}
                    className="h-12 bg-white/5 border-white/10"
                  />
                </div>
              )}

              {backgroundType === 'image' && (
                <div className="space-y-2">
                  <Input
                    placeholder="URL изображения"
                    className="bg-white/5 border-white/10 text-white"
                  />
                  <Button variant="outline" className="w-full bg-white/5 border-white/10 text-white">
                    <Upload className="w-4 h-4 mr-2" />
                    Загрузить
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Center - Preview */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-white/5 to-transparent p-6 md:p-12">
          <div className="max-w-[600px] mx-auto">
            {/* Device Selector */}
            <div className="flex justify-center gap-2 mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDevicePreview('mobile')}
                className={`${devicePreview === 'mobile' ? 'bg-[#7c6afa]/20 border-[#7c6afa]' : 'bg-white/5 border-white/10'} text-white`}
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Mobile
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDevicePreview('desktop')}
                className={`${devicePreview === 'desktop' ? 'bg-[#7c6afa]/20 border-[#7c6afa]' : 'bg-white/5 border-white/10'} text-white`}
              >
                <Monitor className="w-4 h-4 mr-2" />
                Desktop
              </Button>
            </div>

            {/* Preview Container */}
            <div
              className={`mx-auto rounded-3xl overflow-hidden shadow-2xl transition-all ${
                devicePreview === 'mobile' ? 'max-w-[375px]' : 'max-w-full'
              }`}
              style={getBackgroundStyle()}
            >
              <div className="p-8 min-h-[600px]">
                <Reorder.Group axis="y" values={contentBlocks} onReorder={setContentBlocks} className="space-y-4">
                  {contentBlocks.map((block) => (
                    <Reorder.Item key={block.id} value={block}>
                      <div
                        onClick={() => !previewMode && setSelectedBlock(block.id)}
                        className={`group relative transition-all ${
                          !previewMode && selectedBlock === block.id
                            ? 'ring-2 ring-[#7c6afa] rounded-xl p-2'
                            : previewMode
                            ? ''
                            : 'hover:ring-2 hover:ring-white/20 rounded-xl p-2 cursor-pointer'
                        }`}
                      >
                        {!previewMode && (
                          <div className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <GripVertical className="w-5 h-5 text-white/50 cursor-grab" />
                          </div>
                        )}
                        {renderBlock(block)}
                        {!previewMode && selectedBlock === block.id && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteBlock(block.id);
                            }}
                            className="absolute -right-8 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#df5950] rounded-lg flex items-center justify-center hover:bg-[#df5950]/80 transition-colors"
                          >
                            <Trash2 className="w-3 h-3 text-white" />
                          </button>
                        )}
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>

                {contentBlocks.length === 0 && (
                  <div className="text-center py-20">
                    <Plus className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <p className="font-['Roboto'] text-white/50">
                      Добавьте первый элемент на страницу
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        {!previewMode && selectedBlock && (
          <div className="w-[320px] border-l border-white/10 bg-white/5 p-6 overflow-y-auto">
            <h3 className="font-['Roboto'] text-white mb-4">Настройки элемента</h3>
            {renderEditor(contentBlocks.find(b => b.id === selectedBlock)!)}
          </div>
        )}
      </div>
    </div>
  );
}
