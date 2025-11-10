import { useState } from 'react';
import Homepage from './components/Homepage';
import Dashboard from './components/Dashboard';
import AuthPage from './components/AuthPage';
import QRCreator from './components/QRCreator';
import QRLinkSetup from './components/QRLinkSetup';
import PageEditor from './components/PageEditor';
import SubscriptionPage from './components/SubscriptionPage';

type Page = 'home' | 'auth' | 'dashboard' | 'create-qr' | 'link-setup' | 'editor' | 'subscription';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedQRId, setSelectedQRId] = useState<string | null>(null);

  const navigate = (page: Page) => {
    setCurrentPage(page);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('home');
  };

  const handleSelectQR = (qrId: string) => {
    setSelectedQRId(qrId);
    navigate('link-setup');
  };

  const handleEditPage = (qrId: string) => {
    setSelectedQRId(qrId);
    navigate('editor');
  };

  return (
    <div className="min-h-screen bg-[#040404]">
      {currentPage === 'home' && (
        <Homepage 
          onNavigate={navigate} 
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
        />
      )}
      {currentPage === 'auth' && (
        <AuthPage 
          onLogin={handleLogin} 
          onNavigate={navigate}
        />
      )}
      {currentPage === 'dashboard' && (
        <Dashboard 
          onNavigate={navigate}
          onSelectQR={handleSelectQR}
          onEditPage={handleEditPage}
          onLogout={handleLogout}
        />
      )}
      {currentPage === 'create-qr' && (
        <QRCreator 
          onNavigate={navigate}
        />
      )}
      {currentPage === 'link-setup' && (
        <QRLinkSetup 
          qrId={selectedQRId}
          onNavigate={navigate}
          onEditPage={handleEditPage}
        />
      )}
      {currentPage === 'editor' && (
        <PageEditor 
          qrId={selectedQRId}
          onNavigate={navigate}
        />
      )}
      {currentPage === 'subscription' && (
        <SubscriptionPage 
          onNavigate={navigate}
        />
      )}
    </div>
  );
}
