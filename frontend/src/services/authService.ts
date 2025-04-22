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

class AuthService {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await axiosInstance.post('/auth/login', data);
    console.log('Login response:', response);
    console.log('Response headers:', response.headers);
    console.log('Cookies:', document.cookie);
    return response.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data;
  }

  async validateToken(): Promise<AuthResponse['user'] | null> {
    try {
      const response = await axiosInstance.get('/auth/validate');
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
      // Принудительно очищаем куки на клиенте
      document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Domain=localhost';
      document.cookie = 'session-cookie=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Domain=localhost';
    } catch (error) {
      console.error('Logout error:', error);
      // Даже в случае ошибки, пытаемся очистить куки
      document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Domain=localhost';
      document.cookie = 'session-cookie=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Domain=localhost';
      throw error;
    }
  }
}

export const authService = new AuthService(); 