import { TextField, Button } from '@mui/material';
import styles from './AuthForm.module.css';

type AuthType = 'login' | 'register';

export default function AuthForm({ type }: { type: AuthType }) {
  return (
    <div className={styles.container}>
      <h2>{type === 'login' ? 'Вход' : 'Регистрация'}</h2>
      <form className={styles.form}>
        {type === 'register' && (
          <>
            <TextField 
              label="Имя" 
              fullWidth 
              margin="normal" 
            />
            <TextField 
              label="Email" 
              type="email" 
              fullWidth 
              margin="normal" 
            />
          </>
        )}
        <TextField 
          label="Логин" 
          fullWidth 
          margin="normal" 
        />
        <TextField
          label="Пароль"
          type="password"
          fullWidth
          margin="normal"
        />
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth
          className={styles.button}
        >
          {type === 'login' ? 'Войти' : 'Зарегистрироваться'}
        </Button>
      </form>
    </div>
  );
}