import { useState } from 'react';
import { Upload, X, File, Image, Video, FileText, Download, Trash2, Loader2, AlertCircle } from 'lucide-react';
import api from '../services/api';

interface FileItem {
  filename: string;
  url: string;
  size: number;
  uploaded_at?: string;
}

interface FileUploaderProps {
  pageId: string;
  onFileSelect?: (file: FileItem) => void;
}

export function FileUploader({ pageId, onFileSelect }: FileUploaderProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Загрузка списка файлов
  const loadFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.page.getFiles(pageId);
      setFiles(response.data.files);
    } catch (err: any) {
      console.error('Error loading files:', err);
      setError('Не удалось загрузить список файлов');
    } finally {
      setLoading(false);
    }
  };

  // Загрузка файлов на сервер
  const handleUpload = async (filesToUpload: File[]) => {
    if (filesToUpload.length === 0) return;

    try {
      setUploading(true);
      setError(null);
      
      const response = await api.page.uploadFiles(pageId, filesToUpload);
      setFiles(prev => [...prev, ...response.data.files]);
      
      // Уведомление об успехе
      console.log(`Загружено ${response.data.files.length} файлов`);
    } catch (err: any) {
      console.error('Error uploading files:', err);
      setError(err.message || 'Не удалось загрузить файлы');
    } finally {
      setUploading(false);
    }
  };

  // Удаление файла
  const handleDelete = async (filename: string) => {
    if (!confirm(`Удалить файл ${filename}?`)) return;

    try {
      await api.page.deleteFile(pageId, filename);
      setFiles(prev => prev.filter(f => f.filename !== filename));
    } catch (err: any) {
      console.error('Error deleting file:', err);
      setError(err.message || 'Не удалось удалить файл');
    }
  };

  // Скачивание файла
  const handleDownload = async (filename: string) => {
    try {
      const blob = await api.page.downloadFile(pageId, filename);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Error downloading file:', err);
      setError(err.message || 'Не удалось скачать файл');
    }
  };

  // Обработка выбора файлов через input
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    handleUpload(selectedFiles);
  };

  // Обработка drag & drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleUpload(droppedFiles);
  };

  // Получение иконки по типу файла
  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) {
      return <Image className="w-5 h-5 text-[#7c6afa]" />;
    } else if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext || '')) {
      return <Video className="w-5 h-5 text-[#7c6afa]" />;
    } else if (['txt', 'doc', 'docx', 'pdf'].includes(ext || '')) {
      return <FileText className="w-5 h-5 text-[#7c6afa]" />;
    } else {
      return <File className="w-5 h-5 text-[#7c6afa]" />;
    }
  };

  // Форматирование размера файла
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
          dragActive
            ? 'border-[#7c6afa] bg-[#7c6afa]/10'
            : 'border-white/20 hover:border-white/40'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          multiple
          className="hidden"
          onChange={handleFileInputChange}
          disabled={uploading}
        />
        
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          {uploading ? (
            <>
              <Loader2 className="w-12 h-12 text-[#7c6afa] animate-spin mb-4" />
              <p className="text-white/60">Загрузка файлов...</p>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-white/40 mb-4" />
              <p className="text-white mb-2">
                Перетащите файлы сюда или{' '}
                <span className="text-[#7c6afa] underline">выберите</span>
              </p>
              <p className="text-white/40 text-sm">
                Поддерживаются изображения, видео, документы
              </p>
            </>
          )}
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-[#df5950]/10 border border-[#df5950]/30 rounded-xl">
          <AlertCircle className="w-5 h-5 text-[#df5950]" />
          <p className="text-[#df5950] text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-[#df5950] hover:text-[#df5950]/80"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Load Files Button */}
      {files.length === 0 && !loading && (
        <button
          onClick={loadFiles}
          className="w-full px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors duration-300"
        >
          Загрузить список файлов
        </button>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-[#7c6afa] animate-spin" />
        </div>
      )}

      {/* Files List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">
              Загруженные файлы ({files.length})
            </h3>
            <button
              onClick={loadFiles}
              className="text-sm text-[#7c6afa] hover:text-[#c89afc] transition-colors duration-300"
            >
              Обновить
            </button>
          </div>

          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.filename}
                className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 group"
              >
                {/* Icon */}
                <div className="flex-shrink-0">
                  {getFileIcon(file.filename)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white truncate">{file.filename}</p>
                  <p className="text-white/40 text-sm">
                    {formatFileSize(file.size)}
                    {file.uploaded_at && (
                      <> · {new Date(file.uploaded_at).toLocaleDateString()}</>
                    )}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {onFileSelect && (
                    <button
                      onClick={() => onFileSelect(file)}
                      className="p-2 rounded-lg bg-[#7c6afa]/20 text-[#7c6afa] hover:bg-[#7c6afa]/30 transition-colors duration-300"
                      title="Вставить в редактор"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDownload(file.filename)}
                    className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors duration-300"
                    title="Скачать"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(file.filename)}
                    className="p-2 rounded-lg bg-[#df5950]/20 text-[#df5950] hover:bg-[#df5950]/30 transition-colors duration-300"
                    title="Удалить"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
