import axios, { AxiosError } from 'axios';
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
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Если ошибка 401 и это не запрос на обновление токена
    if (error.response?.status === 401 && 
        originalRequest && 
        !originalRequest._retry && 
        originalRequest.url !== '/auth/refresh-token') {
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

export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  role: string;
  permissions: string[];
}

export interface AuthResponse {
  user: User;
  message: string;
}

class AuthService {
  // Проверка наличия токенов
  hasTokens(): boolean {
    return document.cookie.includes('accessToken=') && document.cookie.includes('refreshToken=');
  }

  // Шаг 1: Аутентификация пользователя
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', data);
    return response.data;
  }

  // Шаг 2: Регистрация нового пользователя
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>('/auth/register', data);
    return response.data;
  }

  // Шаг 3: Проверка валидности токена
  async validateToken(): Promise<User | null> {
    try {
      const response = await axiosInstance.post<AuthResponse>('/auth/verify-token');
      return response.data.user;
    } catch (error) {
      return null;
    }
  }

  // Шаг 4: Обновление токена
  async refreshToken(): Promise<void> {
    await axiosInstance.post('/auth/refresh-token');
  }

  // Выход из системы
  async logout(): Promise<void> {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Проверка наличия определенного разрешения
  hasPermission(user: User | null, permission: string): boolean {
    return user?.permissions?.includes(permission) || false;
  }
}

export const authService = new AuthService(); 