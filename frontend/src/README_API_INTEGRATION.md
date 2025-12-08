# 🚀 QR Platform - API Integration Complete!

## ✅ Статус интеграции: ГОТОВО

Все основные компоненты приложения полностью интегрированы с backend API.

---

## 📋 Что интегрировано

| # | Компонент | Статус | Функционал |
|---|-----------|--------|------------|
| 1 | **Auth** | ✅ Готово | Регистрация, вход, JWT tokens |
| 2 | **Dashboard** | ✅ Готово | Список QR, удаление, статистика |
| 3 | **QRCreator** | ✅ Готово | Создание QR с дизайном |
| 4 | **FileUploader** | ✅ Готово | Загрузка/удаление файлов |
| 5 | **PublicPage** | ✅ Готово | Публичные страницы, сканы |
| 6 | QRSettings | ⏳ Опционально | Редактирование QR |
| 7 | PageEditor | ⏳ Опционально | Редактирование страниц |

**Прогресс:** 71% (5 из 7 компонентов)  
**Критические компоненты:** 100% готовы ✨

---

## 🎯 Быстрый старт

### 1. Базовый URL API

**Файл:** `/services/api.ts` (строка 13)

```typescript
export const API_BASE_URL = 'http://localhost:9000';
```

**Изменить URL:**
```typescript
// Production
export const API_BASE_URL = 'https://api.your-domain.com';

// Другой порт
export const API_BASE_URL = 'http://localhost:8000';
```

### 2. Логирование

**Включить/выключить логи в консоль:**

```typescript
// /services/api.ts (строка 20)
const ENABLE_LOGGING = true;  // false для отключения
```

---

## 📊 Примеры использования API

### Регистрация пользователя

```typescript
import api from './services/api';

try {
  const response = await api.user.register({
    email: 'user@example.com',
    password: 'SecurePass123!',
    username: 'johndoe'
  });
  
  console.log('✅ Пользователь создан:', response.data.user);
  // JWT token автоматически сохранён в cookies
} catch (error) {
  console.error('❌ Ошибка:', error.message);
}
```

**Консольный вывод:**
```
🌐 API Request: POST /user/register/
📤 URL: http://localhost:9000/user/register/
📦 Data: { email: "user@example.com", username: "johndoe", password: "..." }
🕒 Time: 14:32:15

✅ API Response: POST /user/register/
📥 Data: {
  success: true,
  data: {
    user: { id: "abc-123", email: "user@example.com", ... },
    session: { access: "...", refresh: "..." }
  }
}
🕒 Time: 14:32:16
```

---

### Создание QR-кода

```typescript
const response = await api.qr.create({
  name: 'Мой Instagram',
  qr_style: {
    pattern: 'rounded',
    eye_style: 'rounded',
    colors: {
      primary: '#7c6afa',
      secondary: '#c89afc',
      background: '#ffffff',
      gradient: true
    },
    logo_url: 'https://...'
  }
});

console.log('QR ID:', response.data.qr_code.id);
console.log('QR URL:', response.data.qr_code.qr_url);
console.log('Image:', response.data.qr_image_url);
```

**Консольный вывод:**
```
📝 Создание QR-кода: { name: "Мой Instagram", style: "rounded", ... }

🌐 API Request: POST /qr/
📤 URL: http://localhost:9000/qr/
📦 Data: { name: "Мой Instagram", qr_style: {...} }
🕒 Time: 14:35:22

✅ API Response: POST /qr/
📥 Data: {
  success: true,
  data: {
    qr_code: {
      id: "xyz-789",
      name: "Мой Instagram",
      qr_url: "https://qr.app/xyz789",
      short_code: "xyz789",
      scan_count: 0,
      ...
    },
    qr_image_url: "https://cdn.qr.app/images/xyz789.png"
  }
}
🕒 Time: 14:35:23

✅ QR-код создан: {...}
```

---

### Загрузка всех QR-кодов

```typescript
const response = await api.qr.getAll();

console.log('Всего QR:', response.data.qr_codes.length);

response.data.qr_codes.forEach(qr => {
  console.log(`- ${qr.name}: ${qr.scan_count} сканирований`);
});
```

**Консольный вывод:**
```
🔄 Загрузка QR-кодов...

🌐 API Request: GET /qr/
📤 URL: http://localhost:9000/qr/
🕒 Time: 14:40:10

✅ API Response: GET /qr/
📥 Data: {
  success: true,
  data: {
    qr_codes: [
      { id: "1", name: "Мой профиль", scan_count: 42 },
      { id: "2", name: "Instagram", scan_count: 156 },
      ...
    ]
  }
}
🕒 Time: 14:40:11

✅ Загружено QR-кодов: 5
```

---

### Удаление QR-кода

```typescript
const qrId = 'xyz-789';

try {
  await api.qr.delete(qrId);
  console.log('✅ QR-код удалён');
} catch (error) {
  console.error('❌ Ошибка удаления:', error.message);
}
```

**Консольный вывод:**
```
🗑️ Удаление QR-кода: xyz-789

🌐 API Request: DELETE /qr/xyz-789/
📤 URL: http://localhost:9000/qr/xyz-789/
🕒 Time: 14:45:30

✅ API Response: DELETE /qr/xyz-789/
📥 Data: { success: true, message: "QR code deleted" }
🕒 Time: 14:45:31

✅ QR-код удален
```

---

### Загрузка файлов

```typescript
const pageId = 'page-123';
const files = [file1, file2]; // File objects

try {
  const response = await api.page.uploadFiles(pageId, files);
  
  response.data.files.forEach(file => {
    console.log(`Uploaded: ${file.filename} → ${file.url}`);
  });
} catch (error) {
  console.error('Upload failed:', error.message);
}
```

---

### Публичная страница

```typescript
const shortCode = 'abc123';

try {
  // Загрузка страницы
  const response = await api.public.getPageByShortCode(shortCode);
  console.log('Page:', response.data.page);
  console.log('QR:', response.data.qr_code);
  
  // Регистрация сканирования
  await api.public.registerScan(shortCode, {
    user_agent: navigator.userAgent,
    device_type: 'mobile'
  });
} catch (error) {
  console.error('Page not found:', error.message);
}
```

---

## 🔑 Аутентификация

### JWT Tokens

Токены **автоматически** управляются:

✅ **Сохраняются** в cookies при login  
✅ **Отправляются** с каждым запросом (`credentials: 'include'`)  
✅ **Обновляются** автоматически (если backend поддерживает)  
✅ **Удаляются** при logout

**Вам НЕ нужно:**
- ❌ Вручную добавлять токены в headers
- ❌ Хранить токены в localStorage
- ❌ Передавать токены в функции API

### Проверка авторизации

```typescript
const response = await api.user.checkAuth();

if (response.data.authenticated) {
  console.log('User:', response.data.user);
} else {
  console.log('Not logged in');
}
```

---

## 📦 Все доступные API методы

### User API

```typescript
api.user.register(data)      // POST /user/register/
api.user.login(data)          // POST /user/login/
api.user.logout()             // POST /user/logout/
api.user.getMe()              // GET /user/me/
api.user.checkAuth()          // GET /user/check/
```

### QR API

```typescript
api.qr.create(data)           // POST /qr/
api.qr.getAll(params)         // GET /qr/
api.qr.getById(qrId)          // GET /qr/{qr_id}/
api.qr.update(qrId, data)     // PUT /qr/{qr_id}/
api.qr.delete(qrId)           // DELETE /qr/{qr_id}/
```

### Page API

```typescript
api.page.create(data)                      // POST /page/
api.page.getAll()                          // GET /page/
api.page.getById(pageId)                   // GET /page/{page_id}/
api.page.update(pageId, data)              // PUT /page/{page_id}/
api.page.delete(pageId)                    // DELETE /page/{page_id}/
api.page.uploadFiles(pageId, files)        // POST /page/{page_id}/files/
api.page.getFiles(pageId)                  // GET /page/{page_id}/files/
api.page.downloadFile(pageId, filename)    // GET /page/{page_id}/files/{filename}/
api.page.deleteFile(pageId, filename)      // DELETE /page/{page_id}/files/{filename}/
```

### Public API

```typescript
api.public.getPageByShortCode(code)  // GET /public/page/{short_code}/
api.public.registerScan(code, data)  // POST /public/scan/{short_code}/
```

---

## 🐛 Обработка ошибок

Все ошибки:
1. ✅ Автоматически логируются в консоль
2. ✅ Пробрасываются для catch блоков
3. ✅ Содержат читаемое сообщение

```typescript
try {
  await api.qr.delete('invalid-id');
} catch (error) {
  // error.message = "QR code not found"
  console.error('Failed:', error.message);
  
  // Показать уведомление пользователю
  alert(`Error: ${error.message}`);
}
```

**Консольный вывод при ошибке:**
```
🌐 API Request: DELETE /qr/invalid-id/
📤 URL: http://localhost:9000/qr/invalid-id/
🕒 Time: 14:50:10

❌ API Error: DELETE /qr/invalid-id/
💥 Error: QR code not found
📍 Endpoint: http://localhost:9000/qr/invalid-id/
🕒 Time: 14:50:11
📚 Stack: Error: QR code not found
    at fetchAPI (/services/api.ts:245)
    ...
```

---

## 🎨 Интегрированные компоненты

### 1. Auth Component

**Что работает:**
- ✅ Регистрация с валидацией
- ✅ Вход с сохранением JWT
- ✅ Loading states
- ✅ Отображение ошибок
- ✅ Password strength indicator

**Используемые API:**
```typescript
api.user.register({ email, password, username })
api.user.login({ email, password })
```

---

### 2. Dashboard Component

**Что работает:**
- ✅ Загрузка всех QR-кодов при монтировании
- ✅ Отображение статистики
- ✅ Удаление QR с подтверждением
- ✅ Фильтрация по типу
- ✅ Loading/error states

**Используемые API:**
```typescript
api.qr.getAll()
api.qr.delete(qrId)
api.user.logout()
```

---

### 3. QRCreator Component

**Что работает:**
- ✅ Создание QR с кастомным дизайном
- ✅ Выбор стиля (square, rounded, dots, fluid)
- ✅ Настройка цветов и градиентов
- ✅ Загрузка логотипа
- ✅ Live preview
- ✅ Loading/success/error states

**Используемые API:**
```typescript
api.qr.create({
  name,
  qr_style: { pattern, eye_style, colors, logo_url }
})
```

---

### 4. FileUploader Component

**Что работает:**
- ✅ Drag & drop загрузка
- ✅ Множественная загрузка файлов
- ✅ Progress bar
- ✅ Список загруженных файлов
- ✅ Удаление файлов
- ✅ Скачивание файлов

**Используемые API:**
```typescript
api.page.uploadFiles(pageId, files)
api.page.getFiles(pageId)
api.page.deleteFile(pageId, filename)
api.page.downloadFile(pageId, filename)
```

---

### 5. PublicPage Component

**Что работает:**
- ✅ Загрузка страницы по short code
- ✅ Регистрация сканирования
- ✅ Отображение контента
- ✅ Loading/error states
- ✅ Автоматическая статистика

**Используемые API:**
```typescript
api.public.getPageByShortCode(shortCode)
api.public.registerScan(shortCode, metadata)
```

---

## ⚙️ Конфигурация

### Изменить базовый URL

**Файл:** `/services/api.ts` (строка 13)

```typescript
// Localhost (default)
export const API_BASE_URL = 'http://localhost:9000';

// Production
export const API_BASE_URL = 'https://api.your-domain.com';

// С переменными окружения
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9000';
```

### Включить/отключить логи

**Файл:** `/services/api.ts` (строка 20)

```typescript
const ENABLE_LOGGING = true;  // false для отключения
```

---

## 📚 Документация

### Созданные файлы документации:

1. **`/INTEGRATION_COMPLETE.md`** - Полный статус интеграции
2. **`/API_INTEGRATION_STATUS.md`** - Прогресс и что осталось
3. **`/HOW_TO_CHANGE_API_URL.md`** - Инструкция по смене URL
4. **`/README_API_INTEGRATION.md`** - Этот файл

---

## 🚀 Следующие шаги

### Запуск проекта:

1. **Backend должен быть запущен на** `http://localhost:9000`

2. **Запустите frontend:**
   ```bash
   npm run dev
   ```

3. **Откройте консоль браузера (F12)** для просмотра логов

4. **Тестируйте:**
   - Регистрация → Login → Dashboard
   - Создание QR → Просмотр → Удаление
   - Загрузка файлов
   - Публичные страницы

---

## 🎯 Опциональная доработка

### QRSettings Component

Интегрируйте редактирование QR:

```typescript
// При монтировании
useEffect(() => {
  const loadQR = async () => {
    const response = await api.qr.getById(qrId);
    setQrData(response.data.qr_code);
  };
  loadQR();
}, [qrId]);

// При сохранении
const handleSave = async () => {
  await api.qr.update(qrId, {
    name: qrName,
    qr_style: qrStyle,
    is_active: isActive
  });
};
```

### PageEditor Component

Интегрируйте редактирование страниц:

```typescript
// Загрузка
useEffect(() => {
  const loadPage = async () => {
    const response = await api.page.getById(pageId);
    setPageData(response.data.page);
  };
  loadPage();
}, [pageId]);

// Сохранение
const handleSave = async () => {
  await api.page.update(pageId, {
    title,
    description,
    content: { theme, blocks, ... },
    published
  });
};

// Загрузка медиа
<FileUploader 
  pageId={pageId}
  onFileSelect={(file) => addImageBlock(file.url)}
/>
```

---

## ✨ Итого

### Готово:
✅ API сервис с логированием  
✅ Auth (регистрация, вход)  
✅ Dashboard (список, удаление)  
✅ QR Creator (создание с дизайном)  
✅ File Uploader (загрузка файлов)  
✅ Public Page (публичный доступ)  

### Опционально:
⏳ QR Settings (редактирование QR)  
⏳ Page Editor (редактирование страниц)  

### Прогресс:
**71% интегрировано** (5 из 7 компонентов)  
**100% критических функций** готовы к работе!

---

## 🎊 Готово к использованию!

Ваш frontend полностью готов к работе с backend.  
Все запросы логируются, ошибки обрабатываются, JWT работает автоматически.

**Удачи с проектом!** 🚀
