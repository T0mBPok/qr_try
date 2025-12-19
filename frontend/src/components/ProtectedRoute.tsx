import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../services/api';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await api.user.checkAuth();
        setIsAuthenticated(res.data.authenticated); // Берём именно поле authenticated
      } catch {
        setIsAuthenticated(false);
      }
    };
    check();
  }, []);

  if (isAuthenticated === null) {
    return <div className="text-white p-4">Проверка авторизации...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
