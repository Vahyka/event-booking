import { TextField, Button } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, LoginData, RegisterData } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import * as styles from './AuthForm.module.css';

type AuthType = 'login' | 'register';

export default function AuthForm({ type }: { type: AuthType }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginData | RegisterData>({
    ...(type === 'login' ? { username: '' } : { username: '', name: '', email: '' }),
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (type === 'login') {
        const response = await authService.login(formData as LoginData);
        login(response.user);
        navigate('/');
      } else {
        const response = await authService.register(formData as RegisterData);
        login(response.user);
        navigate('/');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message === 'Network Error') {
        setError('Ошибка соединения с сервером. Пожалуйста, проверьте подключение.');
      } else {
        setError('Произошла ошибка при авторизации. Пожалуйста, попробуйте позже.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>{type === 'login' ? 'Вход' : 'Регистрация'}</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        {type === 'login' ? (
          <TextField 
            label="Логин" 
            name="username"
            value={(formData as LoginData).username}
            onChange={handleChange}
            fullWidth 
            margin="normal" 
            required
            disabled={isLoading}
          />
        ) : (
          <>
            <TextField 
              label="Логин" 
              name="username"
              value={(formData as RegisterData).username}
              onChange={handleChange}
              fullWidth 
              margin="normal" 
              required
              disabled={isLoading}
            />
            <TextField 
              label="Email" 
              name="email"
              type="email"
              value={(formData as RegisterData).email}
              onChange={handleChange}
              fullWidth 
              margin="normal" 
              required
              disabled={isLoading}
            />
            <TextField 
              label="Имя" 
              name="name"
              value={(formData as RegisterData).name}
              onChange={handleChange}
              fullWidth 
              margin="normal" 
              required
              disabled={isLoading}
            />
          </>
        )}
        <TextField
          label="Пароль"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          disabled={isLoading}
        />
        {error && <div className={styles.error}>{error}</div>}
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth
          className={styles.button}
          type="submit"
          disabled={isLoading}
        >
          {isLoading 
            ? (type === 'login' ? 'Вход...' : 'Регистрация...') 
            : (type === 'login' ? 'Войти' : 'Зарегистрироваться')
          }
        </Button>
      </form>
    </div>
  );
}