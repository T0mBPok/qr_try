import { BrowserRouter, Routes, Route } from 'react-router-dom';

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
import { ProtectedRoute } from './components/ProtectedRoute';
import PageViewer from "./components/ViewPage"

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#040404]">
        <Routes>
          {/* Публичные */}
          <Route path="/" element={<Homepage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/examples" element={<Examples />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/viewPage/:pageId" element={<PageViewer />} />

          {/* Защищённые */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/qr/create"
            element={
              <ProtectedRoute>
                <QRCreator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/qr/:qrId/settings"
            element={
              <ProtectedRoute>
                <QRSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/page/:pageId"
            element={
              <ProtectedRoute>
                <PageEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subscription"
            element={
              <ProtectedRoute>
                <Subscription />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
