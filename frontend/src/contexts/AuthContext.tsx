import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useStore } from './StoreContext';

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userStore } = useStore();
  // Восстанавливаем состояние из localStorage при инициализации
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('user');
  });
  const [isLoading, setIsLoading] = useState(true);

  // Синхронизация MobX userStore с AuthContext
  useEffect(() => {
    if (user) {
      userStore.setUser({ ...user, password: '', role: user.role as 'user' | 'admin' });
    } else {
      userStore.setUser(null);
    }
  }, [user, userStore]);

  const validateAuth = async () => {
    try {
      // ВСЕГДА пробуем валидировать токен
      const userData = await authService.validateToken();
      if (userData?.id) {
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        return;
      }
      // Если не удалось, пробуем refresh
      try {
        await authService.refreshToken();
        const refreshedUserData = await authService.validateToken();
        if (refreshedUserData?.id) {
          setUser(refreshedUserData);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(refreshedUserData));
          return;
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
      }
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    validateAuth();

    // Добавляем обработчик для проверки авторизации при возвращении на страницу
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        validateAuth();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
    }
  };

  // Показываем загрузку до тех пор, пока не проверим авторизацию
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
