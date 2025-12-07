# 📚 API Quick Reference - Краткая справка

## 🔗 Base URL
```
http://localhost:9000
```

---

## 👤 USER API

| Метод | Эндпоинт | Описание | Авторизация |
|-------|----------|----------|-------------|
| `POST` | `/user/register/` | Регистрация | ❌ |
| `POST` | `/user/login/` | Вход | ❌ |
| `GET` | `/user/me/` | Данные пользователя | ✅ |
| `GET` | `/user/check/` | Проверка авторизации | ✅ |
| `POST` | `/user/logout/` | Выход | ✅ |

### Примеры запросов:

**Регистрация:**
```bash
curl -X POST http://localhost:9000/user/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "username": "cooluser"
  }'
```

**Вход:**
```bash
curl -X POST http://localhost:9000/user/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

**Получить данные:**
```bash
curl -X GET http://localhost:9000/user/me/ \
  -H "Cookie: session_token=YOUR_JWT_TOKEN"
```

---

## 🎨 QR CODE API

| Метод | Эндпоинт | Описание | Авторизация |
|-------|----------|----------|-------------|
| `POST` | `/qr/` | Создать QR-код | ✅ |
| `GET` | `/qr/` | Все QR-коды | ✅ |
| `GET` | `/qr/{qr_id}/` | QR-код по ID | ✅ |
| `PUT` | `/qr/{qr_id}/` | Обновить QR-код | ✅ |
| `DELETE` | `/qr/{qr_id}/` | Удалить QR-код | ✅ |

### Примеры запросов:

**Создать QR-код:**
```bash
curl -X POST http://localhost:9000/qr/ \
  -H "Content-Type: application/json" \
  -H "Cookie: session_token=YOUR_JWT_TOKEN" \
  -d '{
    "name": "Моя футболка",
    "qr_style": {
      "pattern": "dots",
      "eye_style": "rounded",
      "colors": {
        "foreground": "#7c6afa",
        "background": "#ffffff"
      }
    }
  }'
```

**Получить все QR-коды:**
```bash
curl -X GET "http://localhost:9000/qr/?page=1&limit=10" \
  -H "Cookie: session_token=YOUR_JWT_TOKEN"
```

**Обновить QR-код:**
```bash
curl -X PUT http://localhost:9000/qr/some-uuid/ \
  -H "Content-Type: application/json" \
  -H "Cookie: session_token=YOUR_JWT_TOKEN" \
  -d '{
    "name": "Новое название",
    "is_active": true
  }'
```

**Удалить QR-код:**
```bash
curl -X DELETE http://localhost:9000/qr/some-uuid/ \
  -H "Cookie: session_token=YOUR_JWT_TOKEN"
```

---

## 📄 PAGE API

| Метод | Эндпоинт | Описание | Авторизация |
|-------|----------|----------|-------------|
| `POST` | `/page/` | Создать страницу | ✅ |
| `GET` | `/page/` | Все страницы | ✅ |
| `GET` | `/page/{page_id}/` | Страница по ID | ✅ |
| `PUT` | `/page/{page_id}/` | Обновить страницу | ✅ |
| `DELETE` | `/page/{page_id}/` | Удалить страницу | ✅ |

### Примеры запросов:

**Создать страницу:**
```bash
curl -X POST http://localhost:9000/page/ \
  -H "Content-Type: application/json" \
  -H "Cookie: session_token=YOUR_JWT_TOKEN" \
  -d '{
    "qr_code_id": "qr-uuid-here",
    "title": "Моя страница",
    "content": {
      "version": "1.0",
      "theme": {
        "background": {
          "type": "gradient",
          "value": "linear-gradient(135deg, #7c6afa, #c89afc)"
        },
        "textColor": "#ffffff",
        "accentColor": "#df5950"
      },
      "blocks": [
        {
          "id": "block_1",
          "type": "text",
          "order": 0,
          "visible": true,
          "data": {
            "text": "Привет!",
            "alignment": "center",
            "fontSize": "large"
          }
        }
      ]
    }
  }'
```

**Обновить страницу:**
```bash
curl -X PUT http://localhost:9000/page/some-uuid/ \
  -H "Content-Type: application/json" \
  -H "Cookie: session_token=YOUR_JWT_TOKEN" \
  -d '{
    "title": "Обновленное название",
    "published": true
  }'
```

---

## 🔥 ИСПОЛЬЗОВАНИЕ В JAVASCRIPT/TYPESCRIPT

### Импорт:
```typescript
import api from './services/api';
```

### Примеры:

**Регистрация:**
```typescript
const response = await api.user.register({
  email: 'user@example.com',
  password: 'SecurePass123!',
  username: 'cooluser'
});
```

**Создание QR-кода:**
```typescript
const response = await api.qr.create({
  name: 'Моя футболка',
  qr_style: {
    pattern: 'dots',
    eye_style: 'rounded',
    colors: {
      foreground: '#7c6afa',
      background: '#ffffff'
    }
  }
});
```

**Получение всех QR-кодов:**
```typescript
const response = await api.qr.getAll({ page: 1, limit: 10 });
console.log(response.data.qr_codes);
```

**Создание страницы:**
```typescript
const response = await api.page.create({
  qr_code_id: 'qr-uuid',
  title: 'Моя страница',
  content: {
    version: '1.0',
    theme: { /* ... */ },
    blocks: [ /* ... */ ]
  }
});
```

**Обновление страницы:**
```typescript
const response = await api.page.update('page-uuid', {
  title: 'Новое название',
  published: true
});
```

---

## 🔐 АВТОРИЗАЦИЯ

JWT токен автоматически сохраняется в **cookies** при регистрации/входе.

Все последующие запросы отправляются с параметром `credentials: 'include'`:

```typescript
fetch('http://localhost:9000/qr/', {
  method: 'GET',
  credentials: 'include', // ← Отправляет cookies
});
```

В нашем API сервисе это уже настроено автоматически:

```typescript
const config: RequestInit = {
  ...options,
  credentials: 'include', // ← Уже включено
};
```

---

## 📦 СТРУКТУРА ОТВЕТОВ

### Успешный ответ:
```json
{
  "data": {
    "user": { ... },
    "qr_code": { ... }
  },
  "message": "Success"
}
```

### Ошибка:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email"
    }
  }
}
```

---

## 🎯 HTTP СТАТУС КОДЫ

| Код | Значение | Описание |
|-----|----------|----------|
| `200` | OK | Успешный запрос |
| `201` | Created | Ресурс создан |
| `400` | Bad Request | Ошибка валидации |
| `401` | Unauthorized | Не авторизован |
| `403` | Forbidden | Нет прав доступа |
| `404` | Not Found | Ресурс не найден |
| `500` | Server Error | Ошибка сервера |

---

## ⚡ БЫСТРЫЙ СТАРТ

### 1. Регистрация пользователя:
```typescript
await api.user.register({
  email: 'test@example.com',
  password: 'Test123!',
  username: 'testuser'
});
```

### 2. Создание QR-кода:
```typescript
const qr = await api.qr.create({ name: 'My QR' });
```

### 3. Создание страницы:
```typescript
await api.page.create({
  qr_code_id: qr.data.qr_code.id,
  title: 'My Page',
  content: { /* ... */ }
});
```

### 4. Получение всех данных:
```typescript
const user = await api.user.getMe();
const qrCodes = await api.qr.getAll();
const pages = await api.page.getAll();
```

---

## 🚨 ВАЖНЫЕ ЗАМЕЧАНИЯ

1. **Все запросы с авторизацией требуют JWT токен в cookies**
2. **Content-Type всегда `application/json`** (кроме загрузки файлов)
3. **Используйте `credentials: 'include'`** для отправки cookies
4. **Обрабатывайте ошибки через try/catch**
5. **JWT токен а��томатически обновляется при каждом запросе**

---

## 📝 ПРИМЕР ОБРАБОТКИ ОШИБОК

```typescript
try {
  const response = await api.qr.create({ name: 'Test' });
  console.log('QR создан:', response.data.qr_code);
} catch (error) {
  if (error.message.includes('401')) {
    // Пользователь не авторизован
    navigate('/auth');
  } else if (error.message.includes('400')) {
    // Ошибка валидации
    alert('Проверьте введенные данные');
  } else {
    // Другая ошибка
    console.error('Ошибка:', error);
  }
}
```

---

## 🔧 ТИПЫ ДАННЫХ

Все типы данных находятся в `/services/api.ts`:

- `User` - Пользователь
- `QRCode` - QR-код
- `Page` - Страница
- `ContentBlock` - Блок контента
- `RegisterData` - Данные для регистрации
- `LoginData` - Данные для входа
- `CreateQRData` - Данные для создания QR
- `UpdateQRData` - Данные для обновления QR
- `CreatePageData` - Данные для создания страницы
- `UpdatePageData` - Данные для обновления страницы

---

Готово! 🎉 Теперь у вас есть полная документация по API.
