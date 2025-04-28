import { makeAutoObservable } from 'mobx';
import { RootStore } from './RootStore';
import { UserAttributes } from '../types/types';
import { authService } from '../services/authService';

export class UserStore {
  currentUser: UserAttributes | null = null;
  loading: boolean = false;
  error: string | null = null;
  private token: string | null = null;

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this);
    this.loadUserFromStorage();
    this.validateAuth();
  }

  get authToken() {
    return this.token;
  }

  private loadUserFromStorage = () => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      this.currentUser = JSON.parse(storedUser);
      this.token = storedToken;
    }
  };

  private validateAuth = async () => {
    try {
      if (authService.hasTokens()) {
        try {
          const userData = await authService.validateToken();
          if (userData?.id) {
            this.setUser({
              ...userData,
              password: '',
              role: userData.role as 'user' | 'admin',
            });
            return;
          }
        } catch (error) {
          console.log('Token validation failed, trying to refresh...');
        }

        try {
          await authService.refreshToken();
          const refreshedUserData = await authService.validateToken();
          if (refreshedUserData?.id) {
            this.setUser({
              ...refreshedUserData,
              password: '',
              role: refreshedUserData.role as 'user' | 'admin',
            });
            return;
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }
      }
      
      this.setUser(null);
    } catch (error) {
      console.error('Auth validation error:', error);
      this.setUser(null);
    }
  };

  setUser = (user: UserAttributes | null) => {
    this.currentUser = user;
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  };

  setToken = (token: string | null) => {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  };

  setLoading = (loading: boolean) => {
    this.loading = loading;
  };

  setError = (error: string | null) => {
    this.error = error;
  };

  login = async (email: string, password: string) => {
    try {
      this.setLoading(true);
      const response = await authService.login({ username: email, password });
      this.setUser({
        ...response.user,
        password: '',
        role: response.user.role as 'user' | 'admin',
      });
    } catch (error) {
      this.setError(error instanceof Error ? error.message : 'Failed to login');
    } finally {
      this.setLoading(false);
    }
  };

  logout = async () => {
    try {
      await authService.logout();
    } finally {
      this.setUser(null);
      this.setToken(null);
    }
  };

  get isAuthenticated() {
    return !!this.currentUser;
  }

  get isAdmin() {
    return this.currentUser?.role === 'admin';
  }
} 