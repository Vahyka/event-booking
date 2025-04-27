import axios from 'axios';
import { API_URL } from '../config';

// Глобальная настройка axios для работы с куками
axios.defaults.withCredentials = true;

// Создаем инстанс axios с предустановленными настройками
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Перехватчик для автоматического обновления токена
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Если ошибка 401 и это не запрос на обновление токена
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh-token') {
      originalRequest._retry = true;

      try {
        // Пытаемся обновить токен
        await axiosInstance.post('/auth/refresh-token');
        // Повторяем оригинальный запрос
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Если не удалось обновить токен, перенаправляем на страницу входа
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  name: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    username: string;
    name: string;
    role: string;
  };
}

interface VerifyTokenResponse {
  user: AuthResponse['user'];
}

class AuthService {
  hasTokens(): boolean {
    return document.cookie.includes('accessToken=') && document.cookie.includes('refreshToken=');
  }

  async refreshToken(): Promise<void> {
    await axiosInstance.post('/auth/refresh-token');
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data as AuthResponse;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data as AuthResponse;
  }

  async validateToken(): Promise<AuthResponse['user'] | null> {
    try {
      const response = await axiosInstance.post<VerifyTokenResponse>('/auth/verify-token');
      if (response.data?.user?.id) {
        return response.data.user;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async logout(): Promise<void> {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
}

export const authService = new AuthService(); 