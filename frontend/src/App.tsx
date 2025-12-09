import { useState } from 'react';
import { Homepage } from './components/Homepage';
import { Dashboard } from './components/Dashboard';
import { Auth } from './components/Auth';
import { QRCreator } from './components/QRCreator';
import { QRSettings } from './components/QRSettings';
import { PageEditor } from './components/PageEditor';
import { Subscription } from './components/Subscription';
import { PreviewPage } from './components/PreviewPage';
import { Examples } from './components/Examples';
import { Instructions } from './components/Instructions';
import { Contacts } from './components/Contacts';
import { PublicPage } from './components/PublicPage';

type Page = 'home' | 'dashboard' | 'auth' | 'qr-creator' | 'qr-settings' | 'page-editor' | 'subscription' | 'preview' | 'examples' | 'instructions' | 'contacts' | 'public-page';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedQRId, setSelectedQRId] = useState<string | null>(null);
  const [publicShortCode, setPublicShortCode] = useState<string | null>(null);

  const navigate = (page: Page, qrId?: string) => {
    if (qrId) {
      setSelectedQRId(qrId);
    }
    setCurrentPage(page);
  };

  const navigateToPublicPage = (shortCode: string) => {
    setPublicShortCode(shortCode);
    setCurrentPage('public-page');
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('home');
  };

  const handleEditQR = (qrId: string) => {
    setSelectedQRId(qrId);
    navigate('qr-settings');
  };

  const handleEditPage = (qrId: string) => {
    setSelectedQRId(qrId);
    navigate('page-editor');
  };

  return (
    <div className="min-h-screen bg-[#040404]">
      {currentPage === 'home' && (
        <Homepage 
          onNavigate={navigate}
          isAuthenticated={isAuthenticated}
        />
      )}
      {currentPage === 'auth' && (
        <Auth 
          onLogin={handleLogin}
          onNavigate={navigate}
        />
      )}
      {currentPage === 'dashboard' && (
        <Dashboard 
          onNavigate={navigate}
          onLogout={handleLogout}
          onEditQR={handleEditQR}
          onEditPage={handleEditPage}
        />
      )}
      {currentPage === 'qr-creator' && (
        <QRCreator 
          onNavigate={navigate}
          onComplete={() => navigate('dashboard')}
        />
      )}
      {currentPage === 'qr-settings' && (
        <QRSettings 
          onNavigate={navigate}
          qrId={selectedQRId}
          onEditPage={handleEditPage}
        />
      )}
      {currentPage === 'page-editor' && (
        <PageEditor 
          onNavigate={navigate}
          qrId={selectedQRId}
        />
      )}
      {currentPage === 'subscription' && (
        <Subscription 
          onNavigate={navigate}
        />
      )}
      {currentPage === 'preview' && (
        <PreviewPage 
          onNavigate={navigate}
        />
      )}
      {currentPage === 'examples' && (
        <Examples 
          onNavigate={navigate}
          isAuthenticated={isAuthenticated}
        />
      )}
      {currentPage === 'instructions' && (
        <Instructions 
          onNavigate={navigate}
          isAuthenticated={isAuthenticated}
        />
      )}
      {currentPage === 'contacts' && (
        <Contacts 
          onNavigate={navigate}
          isAuthenticated={isAuthenticated}
        />
      )}
      {currentPage === 'public-page' && publicShortCode && (
        <PublicPage 
          onNavigate={navigate}
          shortCode={publicShortCode}
        />
      )}
    </div>
  );
}