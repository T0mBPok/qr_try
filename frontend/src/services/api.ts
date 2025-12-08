/**
 * API Service для взаимодействия с backend
 * Base URL: http://localhost:9000
 * 
 * ВАЖНО: Чтобы изменить базовый URL, измените константу API_BASE_URL ниже
 */

// ============================================
// КОНФИГУРАЦИЯ
// ============================================

/**
 * Базовый URL для всех API запросов
 * Измените это значение для переключения на production или другой сервер
 */
export const API_BASE_URL = 'http://localhost:9000';

/**
 * Включить подробное логирование в консоль
 */
const ENABLE_LOGGING = true;

/**
 * Логирование запросов и ответов
 */
function logRequest(method: string, endpoint: string, data?: any) {
  if (!ENABLE_LOGGING) return;
  
  console.group(`🌐 API Request: ${method} ${endpoint}`);
  console.log('📤 URL:', `${API_BASE_URL}${endpoint}`);
  if (data) {
    console.log('📦 Data:', data);
  }
  console.log('🕒 Time:', new Date().toLocaleTimeString());
  console.groupEnd();
}

function logResponse(method: string, endpoint: string, response: any) {
  if (!ENABLE_LOGGING) return;
  
  console.group(`✅ API Response: ${method} ${endpoint}`);
  console.log('📥 Data:', response);
  console.log('🕒 Time:', new Date().toLocaleTimeString());
  console.groupEnd();
}

function logError(method: string, endpoint: string, error: any) {
  if (!ENABLE_LOGGING) return;
  
  console.group(`❌ API Error: ${method} ${endpoint}`);
  console.error('💥 Error:', error);
  console.error('📍 Endpoint:', `${API_BASE_URL}${endpoint}`);
  console.error('🕒 Time:', new Date().toLocaleTimeString());
  if (error.stack) {
    console.error('📚 Stack:', error.stack);
  }
  console.groupEnd();
}

// ============================================
// ТИПЫ ДАННЫХ
// ============================================

// User Types
export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  subscription_tier: 'free' | 'basic' | 'premium';
  subscription_expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// QR Code Types
export interface QRCode {
  id: string;
  user_id: string;
  name: string;
  qr_url: string;
  short_code: string;
  qr_style: {
    pattern: 'squares' | 'dots' | 'rounded';
    eye_style: 'square' | 'rounded' | 'dots';
    colors: {
      foreground: string;
      background: string;
      gradient?: {
        enabled: boolean;
        start: string;
        end: string;
      };
    };
    logo?: {
      enabled: boolean;
      url?: string;
      size: number;
    };
  };
  scan_count: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface CreateQRData {
  name: string;
  qr_style?: QRCode['qr_style'];
}

export interface UpdateQRData {
  name?: string;
  qr_style?: QRCode['qr_style'];
  is_active?: boolean;
}

// Page Types
export interface Page {
  id: string;
  qr_code_id: string;
  title: string;
  description?: string;
  content: {
    version: string;
    theme: {
      background: {
        type: 'color' | 'gradient' | 'image' | 'video';
        value: string;
      };
      textColor: string;
      accentColor: string;
      fontFamily?: string;
    };
    blocks: ContentBlock[];
    seo?: {
      metaTitle?: string;
      metaDescription?: string;
      metaImage?: string;
      favicon?: string;
    };
    settings?: {
      animations?: {
        enabled: boolean;
        entrance?: string;
        duration?: string;
      };
      analytics?: {
        enabled: boolean;
        googleAnalytics?: string;
        yandexMetrika?: string;
      };
    };
  };
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'video' | 'social_links' | 'link_button' | 'gallery' | 'redirect' | 'embed' | 'contact_form' | 'divider' | 'spacer';
  order: number;
  visible: boolean;
  data: any;
}

export interface CreatePageData {
  qr_code_id: string;
  title: string;
  description?: string;
  content: Page['content'];
}

export interface UpdatePageData {
  title?: string;
  description?: string;
  content?: Page['content'];
  published?: boolean;
}

// Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

// ============================================
// HELPER ФУНКЦИИ
// ============================================

/**
 * Базовая функция для выполнения fetch запросов
 */
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const method = options.method || 'GET';
  
  // Логирование запроса
  const requestData = options.body ? JSON.parse(options.body as string) : undefined;
  logRequest(method, endpoint, requestData);
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include', // Для отправки cookies (JWT токен)
  };

  try {
    const response = await fetch(url, config);

    // Обработка ошибок HTTP
    if (!response.ok) {
      let errorMessage = `HTTP Error: ${response.status}`;
      try {
        const errorData: ApiError = await response.json();
        errorMessage = errorData.error?.message || errorMessage;
      } catch {
        // Если не удалось распарсить JSON ошибки
      }
      
      const error = new Error(errorMessage);
      logError(method, endpoint, error);
      throw error;
    }

    // Проверка на пустой ответ (для DELETE запросов)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      logResponse(method, endpoint, data);
      return data;
    }

    const emptyResponse = {} as T;
    logResponse(method, endpoint, emptyResponse);
    return emptyResponse;
  } catch (error) {
    if (!logError.name) { // Только если ошибка еще не залогирована
      logError(method, endpoint, error);
    }
    throw error;
  }
}

// ============================================
// USER API
// ============================================

export const userAPI = {
  /**
   * POST /user/register/
   * Регистрация нового пользователя
   */
  register: async (data: RegisterData): Promise<ApiResponse<{ user: User; session: any }>> => {
    const response = await fetchAPI('/user/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  },

  /**
   * POST /user/login/
   * Авторизация пользователя
   */
  login: async (data: LoginData): Promise<ApiResponse<{ user: User; session: any }>> => {
    const response = await fetchAPI('/user/login/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  },

  /**
   * GET /user/me/
   * Получение данных о текущем пользователе
   */
  getMe: async (): Promise<ApiResponse<{ user: User; stats?: any }>> => {
    const response = await fetchAPI('/user/me/', {
      method: 'GET',
    });
    return response;
  },

  /**
   * GET /user/check/
   * Проверка статуса авторизации пользователя
   */
  checkAuth: async (): Promise<ApiResponse<{ authenticated: boolean; user?: User }>> => {
    const response = await fetchAPI('/user/check/', {
      method: 'GET',
    });
    return response;
  },

  /**
   * POST /user/logout/
   * Выход пользователя
   */
  logout: async (): Promise<ApiResponse<{ message: string }>> => {
    const response = await fetchAPI('/user/logout/', {
      method: 'POST',
    });
    return response;
  },
};

// ============================================
// QR CODE API
// ============================================

export const qrAPI = {
  /**
   * POST /qr/
   * Создание нового QR-кода
   */
  create: async (data: CreateQRData): Promise<ApiResponse<{ qr_code: QRCode; qr_image_url: string }>> => {
    const response = await fetchAPI('/qr/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  },

  /**
   * GET /qr/
   * Получение всех QR-кодов пользователя
   */
  getAll: async (params?: { page?: number; limit?: number }): Promise<ApiResponse<{ qr_codes: QRCode[]; pagination?: any }>> => {
    const queryString = params 
      ? `?${new URLSearchParams(params as any).toString()}` 
      : '';
    
    const response = await fetchAPI(`/qr/${queryString}`, {
      method: 'GET',
    });
    return response;
  },

  /**
   * GET /qr/{qr_id}/
   * Получение QR-кода по ID
   */
  getById: async (qrId: string): Promise<ApiResponse<{ qr_code: QRCode; page?: Page; stats?: any }>> => {
    const response = await fetchAPI(`/qr/${qrId}/`, {
      method: 'GET',
    });
    return response;
  },

  /**
   * PUT /qr/{qr_id}/
   * Обновление QR-кода
   */
  update: async (qrId: string, data: UpdateQRData): Promise<ApiResponse<{ qr_code: QRCode; qr_image_url?: string }>> => {
    const response = await fetchAPI(`/qr/${qrId}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response;
  },

  /**
   * DELETE /qr/{qr_id}/
   * Удаление QR-кода
   */
  delete: async (qrId: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await fetchAPI(`/qr/${qrId}/`, {
      method: 'DELETE',
    });
    return response;
  },
};

// ============================================
// PAGE API
// ============================================

export const pageAPI = {
  /**
   * POST /page/
   * Создание новой страницы
   */
  create: async (data: CreatePageData): Promise<ApiResponse<{ page: Page }>> => {
    const response = await fetchAPI('/page/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  },

  /**
   * GET /page/
   * Получение всех страниц пользователя
   */
  getAll: async (): Promise<ApiResponse<{ pages: Page[] }>> => {
    const response = await fetchAPI('/page/', {
      method: 'GET',
    });
    return response;
  },

  /**
   * GET /page/{page_id}/
   * Получение страницы по ID
   */
  getById: async (pageId: string): Promise<ApiResponse<{ page: Page }>> => {
    const response = await fetchAPI(`/page/${pageId}/`, {
      method: 'GET',
    });
    return response;
  },

  /**
   * PUT /page/{page_id}/
   * Обновление страницы
   */
  update: async (pageId: string, data: UpdatePageData): Promise<ApiResponse<{ page: Page }>> => {
    const response = await fetchAPI(`/page/${pageId}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response;
  },

  /**
   * DELETE /page/{page_id}/
   * Удаление страницы
   */
  delete: async (pageId: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await fetchAPI(`/page/${pageId}/`, {
      method: 'DELETE',
    });
    return response;
  },

  /**
   * POST /page/{page_id}/files/
   * Загрузка одного или нескольких файлов на страницу
   * Поддержив��ет множественную загрузку, проверку размера
   */
  uploadFiles: async (pageId: string, files: File[]): Promise<ApiResponse<{ files: Array<{ filename: string; url: string; size: number }> }>> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await fetchAPI(`/page/${pageId}/files/`, {
      method: 'POST',
      body: formData,
      headers: {}, // Убираем Content-Type для FormData
    });
    return response;
  },

  /**
   * GET /page/{page_id}/files/
   * Получение списка всех файлов страницы
   */
  getFiles: async (pageId: string): Promise<ApiResponse<{ files: Array<{ filename: string; url: string; size: number; uploaded_at: string }> }>> => {
    const response = await fetchAPI(`/page/${pageId}/files/`, {
      method: 'GET',
    });
    return response;
  },

  /**
   * GET /page/{page_id}/files/{filename}/
   * Скачивание конкретного файла
   */
  downloadFile: async (pageId: string, filename: string): Promise<Blob> => {
    const url = `${API_BASE_URL}/page/${pageId}/files/${filename}/`;
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.status}`);
    }

    return await response.blob();
  },

  /**
   * DELETE /page/{page_id}/files/{filename}/
   * Удаление конкретного файла (с диска и из списка страницы)
   */
  deleteFile: async (pageId: string, filename: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await fetchAPI(`/page/${pageId}/files/${filename}/`, {
      method: 'DELETE',
    });
    return response;
  },
};

// ============================================
// ЭКСПОРТ ОСНОВНОГО API ОБЪЕКТА
// ============================================

// ============================================
// PUBLIC API (без авторизации)
// ============================================

export const publicAPI = {
  /**
   * GET /public/page/{short_code}/
   * Получение страницы по короткому коду (публичный доступ)
   */
  getPageByShortCode: async (shortCode: string): Promise<ApiResponse<{ page: Page; qr_code: QRCode }>> => {
    const response = await fetchAPI(`/public/page/${shortCode}/`, {
      method: 'GET',
    });
    return response;
  },

  /**
   * POST /public/scan/{short_code}/
   * Регистрация сканироания QR-кода
   */
  registerScan: async (shortCode: string, data?: { user_agent?: string; referrer?: string; device_type?: string }): Promise<ApiResponse<{ message: string; scan_count: number }>> => {
    const response = await fetchAPI(`/public/scan/${shortCode}/`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    });
    return response;
  },
};

// ============================================
// ЭКСПОРТ ОСНОВНОГО API ОБЪЕКТА
// ============================================

export const api = {
  user: userAPI,
  qr: qrAPI,
  page: pageAPI,
  public: publicAPI,
};

export default api;