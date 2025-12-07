# 🧪 Тестирование публичной страницы

## Как протестировать PublicPage

### Вариант 1: Через код (для разработки)

В `/App.tsx` добавьте временную кнопку для тестирования:

```typescript
// Добавьте в начало компонента App
const [currentPage, setCurrentPage] = useState<Page>('public-page'); // Вместо 'home'
const [publicShortCode] = useState('demo123'); // Тестовый short_code
```

### Вариант 2: Через Homepage

Добавьте кнопку на главной странице:

```typescript
<button 
  onClick={() => navigateToPublicPage('demo123')}
  className="px-8 py-3 rounded-full bg-[#df5950] text-white"
>
  Посмотреть демо страницу
</button>
```

### Вариант 3: Backend Mock

Если backend еще не готов, создайте mock-сервер в `/services/api.ts`:

```typescript
// Временный mock для тестирования
const MOCK_PUBLIC_PAGE = {
  data: {
    page: {
      id: 'demo-page-1',
      qr_code_id: 'demo-qr-1',
      title: 'Мария - Фотограф',
      description: 'Профессиональная фотография событий и портретов',
      content: {
        version: '1.0',
        theme: {
          background: {
            type: 'gradient',
            value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          },
          textColor: '#ffffff',
          accentColor: '#f093fb',
          fontFamily: 'Roboto'
        },
        blocks: [
          {
            id: 'block_1',
            type: 'text',
            order: 0,
            visible: true,
            data: {
              text: '👋 Привет! Я Мария',
              alignment: 'center',
              fontSize: 'xlarge',
              fontWeight: 'bold',
              color: '#ffffff'
            }
          },
          {
            id: 'block_2',
            type: 'image',
            order: 1,
            visible: true,
            data: {
              url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
              alt: 'Maria portrait',
              caption: 'Фотограф из Москвы',
              fit: 'cover'
            }
          },
          {
            id: 'block_3',
            type: 'text',
            order: 2,
            visible: true,
            data: {
              text: '📸 Создаю эмоциональные фотографии, которые сохраняют ваши лучшие моменты на всю жизнь. Работаю со свадьбами, семейными фотосессиями и портретами.',
              alignment: 'center',
              fontSize: 'medium',
              color: '#ffffff'
            }
          },
          {
            id: 'block_4',
            type: 'social_links',
            order: 3,
            visible: true,
            data: {
              layout: 'buttons',
              size: 'large',
              links: [
                {
                  platform: 'instagram',
                  url: 'https://instagram.com/maria_photo',
                  username: '@maria_photo',
                  icon: 'instagram',
                  color: '#E4405F'
                },
                {
                  platform: 'website',
                  url: 'https://mariaphoto.com',
                  username: 'Мой сайт',
                  icon: 'globe',
                  color: '#667eea'
                },
                {
                  platform: 'email',
                  url: 'mailto:maria@example.com',
                  username: 'maria@example.com',
                  icon: 'mail',
                  color: '#f093fb'
                }
              ]
            }
          },
          {
            id: 'block_5',
            type: 'divider',
            order: 4,
            visible: true,
            data: {
              thickness: '1px',
              color: '#ffffff',
              opacity: 0.2
            }
          },
          {
            id: 'block_6',
            type: 'gallery',
            order: 5,
            visible: true,
            data: {
              columns: 3,
              images: [
                { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400', alt: 'Wedding photo' },
                { url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400', alt: 'Portrait' },
                { url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400', alt: 'Family photo' },
                { url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400', alt: 'Event photo' },
                { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400', alt: 'Nature portrait' },
                { url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=400', alt: 'Outdoor shoot' }
              ]
            }
          },
          {
            id: 'block_7',
            type: 'link_button',
            order: 6,
            visible: true,
            data: {
              text: '📅 Забронировать фотосессию',
              url: 'https://calendly.com/maria-photo',
              backgroundColor: '#f093fb',
              textColor: '#ffffff',
              fontSize: '18px',
              fontWeight: 'bold'
            }
          },
          {
            id: 'block_8',
            type: 'contact_form',
            order: 7,
            visible: true,
            data: {
              title: 'Есть вопросы? Напишите мне!'
            }
          }
        ],
        seo: {
          metaTitle: 'Мария - Фотограф | Свадебная и портретная фотография',
          metaDescription: 'Профессиональная фотография в Москве. Свадьбы, портреты, семейные фотосессии.',
          metaImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200'
        },
        settings: {
          animations: {
            enabled: true,
            entrance: 'fadeIn',
            duration: '0.5s'
          }
        }
      },
      published: true,
      created_at: '2025-12-01T10:00:00Z',
      updated_at: '2025-12-07T15:30:00Z'
    },
    qr_code: {
      id: 'demo-qr-1',
      user_id: 'demo-user-1',
      name: 'Футболка Марии',
      qr_url: 'https://qrwear.com/u/demo123',
      short_code: 'demo123',
      qr_style: {
        pattern: 'dots',
        eye_style: 'rounded',
        colors: {
          foreground: '#667eea',
          background: '#ffffff',
          gradient: {
            enabled: true,
            start: '#667eea',
            end: '#764ba2'
          }
        }
      },
      scan_count: 245,
      created_at: '2025-12-01T10:00:00Z',
      updated_at: '2025-12-07T15:30:00Z',
      is_active: true
    }
  }
};

// В publicAPI.getPageByShortCode добавьте:
getPageByShortCode: async (shortCode: string) => {
  // ВРЕМЕННЫЙ MOCK - удалить когда backend будет готов
  if (shortCode === 'demo123') {
    await new Promise(resolve => setTimeout(resolve, 500)); // Имитация задержки
    return MOCK_PUBLIC_PAGE;
  }
  
  // Реальный запрос к backend
  return fetchAPI(`/public/page/${shortCode}/`, {
    method: 'GET',
  });
},
```

---

## 📝 Тестовые сценарии

### 1. ✅ Загрузка страницы
- [ ] Открывается loader
- [ ] Загружается контент
- [ ] Показывается заголовок страницы
- [ ] Отображаются все блоки в правильном порядке

### 2. ✅ Шапка (Header)
- [ ] Логотип виден
- [ ] Кнопка "Войти" работает
- [ ] При скролле шапка остается наверху
- [ ] Прозрачность и blur эффект работают

### 3. ✅ Блоки контента
- [ ] Текст: отображается с правильным выравниванием и цветом
- [ ] Изображение: загружается, caption виден
- [ ] Соцсети: иконки правильные, ссылки работают
- [ ] Кнопка-ссылка: открывается в новой вкладке
- [ ] Галерея: изображения в сетке, hover эффект
- [ ] Разделитель: виден с правильной прозрачностью
- [ ] Форма: поля работают

### 4. ✅ Тема (Theme)
- [ ] Фон применяется (color/gradient/image/video)
- [ ] Цвет текста правильный
- [ ] Акцентный цвет на кнопках

### 5. ✅ Анимации
- [ ] Блоки появляются с fadeIn
- [ ] Задержка между блоками работает

### 6. ✅ Адаптивность
- [ ] На мобильном: все элементы видны
- [ ] На планшете: правильные отступы
- [ ] На десктопе: максимальная ширина контента

### 7. ✅ Ошибки
- [ ] Несуществующий short_code: показывает "Страница не найдена"
- [ ] Неопубликованная страница: показывает "Не опубликована"
- [ ] Проблемы с сетью: показывает ошибку

---

## 🚀 Быстрый запуск тестирования

### Шаг 1: Добавить mock в api.ts
Скопируйте `MOCK_PUBLIC_PAGE` в `/services/api.ts`

### Шаг 2: Открыть публичную страницу
В консоли браузера:
```javascript
// Если используете React DevTools
navigateToPublicPage('demo123');
```

Или добавьте в `Homepage.tsx` временную кнопку:
```typescript
<button 
  onClick={() => {
    // @ts-ignore - временный хак для тестирования
    window.testPublicPage = () => navigateToPublicPage('demo123');
  }}
>
  Тест
</button>
```

Затем в консоли:
```javascript
window.testPublicPage();
```

### Шаг 3: Проверить все функции
Пройдите по чек-листу выше ✅

---

## 🎨 Демо страницы для разных профессий

Создайте разные mock'и для тестирования:

### Музыкант
```json
{
  "title": "DJ Alex",
  "theme": {
    "background": {
      "type": "gradient",
      "value": "linear-gradient(135deg, #ff0844 0%, #ffb199 100%)"
    }
  },
  "blocks": [
    { "type": "text", "data": { "text": "🎧 Electronic Music Producer" } },
    { "type": "social_links", "data": { "links": [
      { "platform": "spotify", "url": "..." },
      { "platform": "soundcloud", "url": "..." }
    ]}}
  ]
}
```

### Бизнес
```json
{
  "title": "Иван Петров - Entrepreneur",
  "theme": {
    "background": {
      "type": "color",
      "value": "#1a1a2e"
    }
  },
  "blocks": [
    { "type": "text", "data": { "text": "💼 Founder & CEO" } },
    { "type": "link_button", "data": { "text": "Мой стартап", "url": "..." } }
  ]
}
```

---

## 🐛 Отладка

### Проверка запросов
Откройте DevTools → Network:
- Должен быть запрос: `GET /public/page/demo123/`
- Должен быть запрос: `POST /public/scan/demo123/`

### Проверка состояния
React DevTools → Components → PublicPage:
- `loading`: должен стать false
- `error`: должен быть null
- `pageData`: должен содержать данные страницы

### Логи
PublicPage автоматически логирует ошибки:
```typescript
console.error('Error loading page:', err);
console.error('Error registering scan:', err);
```

---

Готово! 🎉 Теперь вы можете полноценно тестировать публичные страницы!
