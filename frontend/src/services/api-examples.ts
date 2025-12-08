/**
 * ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ API
 * 
 * Этот файл демонстрирует, как использовать API сервис
 * в различных сценариях работы приложения
 */

import api from './api';

// ============================================
// ПРИМЕРЫ: USER API
// ============================================

async function exampleUserRegistration() {
  try {
    const response = await api.user.register({
      email: 'user@example.com',
      password: 'SecurePassword123!',
      username: 'cooluser'
    });
    
    console.log('Зарегистрирован пользователь:', response.data.user);
    console.log('Токен сессии:', response.data.session);
    
    // После регистрации пользователь автоматически авторизован
    // JWT токен сохраняется в cookies
  } catch (error) {
    console.error('Ошибка регистрации:', error);
  }
}

async function exampleUserLogin() {
  try {
    const response = await api.user.login({
      email: 'user@example.com',
      password: 'SecurePassword123!'
    });
    
    console.log('Авторизован:', response.data.user);
    // JWT токен в cookies
  } catch (error) {
    console.error('Ошибка входа:', error);
  }
}

async function exampleCheckAuth() {
  try {
    const response = await api.user.checkAuth();
    
    if (response.data.authenticated) {
      console.log('Пользователь авторизован:', response.data.user);
    } else {
      console.log('Пользователь не авторизован');
    }
  } catch (error) {
    console.error('Ошибка проверки авторизации:', error);
  }
}

async function exampleGetCurrentUser() {
  try {
    const response = await api.user.getMe();
    
    console.log('Данные пользователя:', response.data.user);
    console.log('Статистика:', response.data.stats);
  } catch (error) {
    console.error('Ошибка получения данных:', error);
  }
}

async function exampleUserLogout() {
  try {
    const response = await api.user.logout();
    
    console.log(response.data.message); // "Logged out successfully"
    // Cookies очищены
  } catch (error) {
    console.error('Ошибка выхода:', error);
  }
}

// ============================================
// ПРИМЕРЫ: QR CODE API
// ============================================

async function exampleCreateQRCode() {
  try {
    const response = await api.qr.create({
      name: 'Моя футболка',
      qr_style: {
        pattern: 'dots',
        eye_style: 'rounded',
        colors: {
          foreground: '#7c6afa',
          background: '#ffffff',
          gradient: {
            enabled: true,
            start: '#7c6afa',
            end: '#c89afc'
          }
        },
        logo: {
          enabled: true,
          url: 'https://example.com/logo.png',
          size: 20
        }
      }
    });
    
    console.log('Создан QR-код:', response.data.qr_code);
    console.log('URL изображения:', response.data.qr_image_url);
    
    // Вернет:
    // {
    //   qr_code: {
    //     id: "uuid",
    //     user_id: "uuid",
    //     name: "Моя футболка",
    //     qr_url: "https://qrwear.com/u/abc123",
    //     short_code: "abc123",
    //     qr_style: { ... },
    //     scan_count: 0,
    //     is_active: true,
    //     created_at: "2025-12-07T...",
    //     updated_at: "2025-12-07T..."
    //   },
    //   qr_image_url: "https://storage.../qr_abc123.png"
    // }
  } catch (error) {
    console.error('Ошибка создания QR-кода:', error);
  }
}

async function exampleGetAllQRCodes() {
  try {
    const response = await api.qr.getAll({ 
      page: 1, 
      limit: 10 
    });
    
    console.log('QR-коды:', response.data.qr_codes);
    console.log('Пагинация:', response.data.pagination);
    
    // Вернет массив QR-кодов пользователя
  } catch (error) {
    console.error('Ошибка получения QR-кодов:', error);
  }
}

async function exampleGetQRCodeById() {
  try {
    const qrId = 'some-uuid-here';
    const response = await api.qr.getById(qrId);
    
    console.log('QR-код:', response.data.qr_code);
    console.log('Связанная страница:', response.data.page);
    console.log('Статистика:', response.data.stats);
  } catch (error) {
    console.error('Ошибка получения QR-кода:', error);
  }
}

async function exampleUpdateQRCode() {
  try {
    const qrId = 'some-uuid-here';
    
    const response = await api.qr.update(qrId, {
      name: 'Обновленное название',
      qr_style: {
        pattern: 'rounded',
        eye_style: 'square',
        colors: {
          foreground: '#df5950',
          background: '#ffffff'
        }
      },
      is_active: true
    });
    
    console.log('Обновлен QR-код:', response.data.qr_code);
    
    // Если стиль изменился, вернется новое изображение
    if (response.data.qr_image_url) {
      console.log('Новое изображение:', response.data.qr_image_url);
    }
  } catch (error) {
    console.error('Ошибка обновления QR-кода:', error);
  }
}

async function exampleDeleteQRCode() {
  try {
    const qrId = 'some-uuid-here';
    
    const response = await api.qr.delete(qrId);
    
    console.log(response.data.message); // "QR code deleted successfully"
  } catch (error) {
    console.error('Ошибка удаления QR-кода:', error);
  }
}

// ============================================
// ПРИМЕРЫ: PAGE API
// ============================================

async function exampleCreatePage() {
  try {
    const response = await api.page.create({
      qr_code_id: 'some-qr-uuid',
      title: 'Моя страница',
      description: 'Личный профиль',
      content: {
        version: '1.0',
        theme: {
          background: {
            type: 'gradient',
            value: 'linear-gradient(135deg, #7c6afa, #c89afc)'
          },
          textColor: '#ffffff',
          accentColor: '#df5950',
          fontFamily: 'Roboto'
        },
        blocks: [
          {
            id: 'block_1',
            type: 'text',
            order: 0,
            visible: true,
            data: {
              text: 'Привет! Я Мария 👋',
              alignment: 'center',
              fontSize: 'large',
              fontWeight: 'bold',
              color: '#ffffff'
            }
          },
          {
            id: 'block_2',
            type: 'social_links',
            order: 1,
            visible: true,
            data: {
              layout: 'icons',
              size: 'large',
              links: [
                {
                  platform: 'instagram',
                  url: 'https://instagram.com/maria',
                  username: '@maria',
                  icon: 'instagram',
                  color: '#E4405F'
                }
              ]
            }
          }
        ],
        seo: {
          metaTitle: 'Мария - Фотограф',
          metaDescription: 'Профессиональная фотография',
          metaImage: 'https://example.com/og-image.jpg'
        },
        settings: {
          animations: {
            enabled: true,
            entrance: 'fadeIn',
            duration: '0.3s'
          }
        }
      }
    });
    
    console.log('Создана страница:', response.data.page);
  } catch (error) {
    console.error('Ошибка создания страницы:', error);
  }
}

async function exampleGetAllPages() {
  try {
    const response = await api.page.getAll();
    
    console.log('Все страницы пользователя:', response.data.pages);
  } catch (error) {
    console.error('Ошибка получения страниц:', error);
  }
}

async function exampleGetPageById() {
  try {
    const pageId = 'some-uuid-here';
    const response = await api.page.getById(pageId);
    
    console.log('Страница:', response.data.page);
  } catch (error) {
    console.error('Ошибка получения страницы:', error);
  }
}

async function exampleUpdatePage() {
  try {
    const pageId = 'some-uuid-here';
    
    const response = await api.page.update(pageId, {
      title: 'Обновленное название',
      content: {
        version: '1.0',
        theme: {
          background: {
            type: 'color',
            value: '#040404'
          },
          textColor: '#ffffff',
          accentColor: '#7c6afa'
        },
        blocks: [
          // Новые блоки
        ]
      },
      published: true
    });
    
    console.log('Обновлена страница:', response.data.page);
  } catch (error) {
    console.error('Ошибка обновления страницы:', error);
  }
}

async function exampleDeletePage() {
  try {
    const pageId = 'some-uuid-here';
    
    const response = await api.page.delete(pageId);
    
    console.log(response.data.message); // "Page deleted successfully"
  } catch (error) {
    console.error('Ошибка удаления страницы:', error);
  }
}

// ============================================
// ПОЛНЫЙ СЦЕНАРИЙ: Создание QR-кода с страницей
// ============================================

async function exampleFullWorkflow() {
  try {
    // 1. Регистрация пользователя
    await api.user.register({
      email: 'newuser@example.com',
      password: 'Password123!',
      username: 'newuser'
    });
    
    // 2. Создание QR-кода
    const qrResponse = await api.qr.create({
      name: 'Моя первая футболка',
      qr_style: {
        pattern: 'dots',
        eye_style: 'rounded',
        colors: {
          foreground: '#7c6afa',
          background: '#ffffff'
        }
      }
    });
    
    const qrCodeId = qrResponse.data.qr_code.id;
    console.log('QR-код создан:', qrCodeId);
    
    // 3. Создание страницы для QR-кода
    const pageResponse = await api.page.create({
      qr_code_id: qrCodeId,
      title: 'Моя страница',
      content: {
        version: '1.0',
        theme: {
          background: {
            type: 'gradient',
            value: 'linear-gradient(135deg, #7c6afa, #c89afc)'
          },
          textColor: '#ffffff',
          accentColor: '#df5950'
        },
        blocks: [
          {
            id: 'block_1',
            type: 'text',
            order: 0,
            visible: true,
            data: {
              text: 'Добро пожаловать!',
              alignment: 'center',
              fontSize: 'large'
            }
          }
        ]
      }
    });
    
    console.log('Страница создана:', pageResponse.data.page.id);
    
    // 4. Получение всех QR-кодов
    const allQRs = await api.qr.getAll();
    console.log('Всего QR-кодов:', allQRs.data.qr_codes.length);
    
  } catch (error) {
    console.error('Ошибка в процессе:', error);
  }
}

// ============================================
// ПРИМЕР ИСПОЛЬЗОВАНИЯ В REACT КОМПОНЕНТЕ
// ============================================

/*
import { useState, useEffect } from 'react';
import api from './services/api';

function Dashboard() {
  const [qrCodes, setQRCodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQRCodes() {
      try {
        const response = await api.qr.getAll();
        setQRCodes(response.data.qr_codes);
      } catch (error) {
        console.error('Ошибка загрузки:', error);
      } finally {
        setLoading(false);
      }
    }

    loadQRCodes();
  }, []);

  const handleCreateQR = async () => {
    try {
      const response = await api.qr.create({
        name: 'Новый QR-код',
      });
      
      setQRCodes([...qrCodes, response.data.qr_code]);
    } catch (error) {
      console.error('Ошибка создания:', error);
    }
  };

  const handleDeleteQR = async (qrId) => {
    try {
      await api.qr.delete(qrId);
      setQRCodes(qrCodes.filter(qr => qr.id !== qrId));
    } catch (error) {
      console.error('Ошибка удаления:', error);
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <button onClick={handleCreateQR}>Создать QR-код</button>
      {qrCodes.map(qr => (
        <div key={qr.id}>
          <h3>{qr.name}</h3>
          <button onClick={() => handleDeleteQR(qr.id)}>Удалить</button>
        </div>
      ))}
    </div>
  );
}
*/

export {
  exampleUserRegistration,
  exampleUserLogin,
  exampleCheckAuth,
  exampleGetCurrentUser,
  exampleUserLogout,
  exampleCreateQRCode,
  exampleGetAllQRCodes,
  exampleGetQRCodeById,
  exampleUpdateQRCode,
  exampleDeleteQRCode,
  exampleCreatePage,
  exampleGetAllPages,
  exampleGetPageById,
  exampleUpdatePage,
  exampleDeletePage,
  exampleFullWorkflow,
};
