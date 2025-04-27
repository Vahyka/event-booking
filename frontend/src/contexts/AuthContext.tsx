<<<<<<< HEAD
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

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
=======
import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
>>>>>>> 33b1af3 (smth)
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

<<<<<<< HEAD
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const validateAuth = async () => {
    try {
      // Проверяем наличие токенов в куках
      if (authService.hasTokens()) {
        try {
          const userData = await authService.validateToken();
          if (userData?.id) {
            setUser(userData);
            setIsAuthenticated(true);
            return;
          }
        } catch (error) {
          console.log('Token validation failed, trying to refresh...');
        }

        // Если валидация не удалась, пробуем обновить токен
        try {
          await authService.refreshToken();
          const refreshedUserData = await authService.validateToken();
          if (refreshedUserData?.id) {
            setUser(refreshedUserData);
            setIsAuthenticated(true);
            return;
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }
      }
      
      // Если мы дошли до этой точки, значит авторизация не удалась
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Auth validation error:', error);
      setUser(null);
      setIsAuthenticated(false);
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
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
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
=======
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
>>>>>>> 33b1af3 (smth)
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
<<<<<<< HEAD
}; 
=======
} 
>>>>>>> 33b1af3 (smth)
