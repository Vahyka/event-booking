import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button } from '@mui/material';
import styles from './Header.module.css';

export default function Header() {
  return (
    <AppBar position="static" className={styles.header}>
      <Toolbar>
        <Button color="inherit" component={Link} to="/">
          Главная
        </Button>
        <div className={styles.spacer} />
        <Button color="inherit" component={Link} to="/login">
          Вход
        </Button>
        <Button color="inherit" component={Link} to="/register">
          Регистрация
        </Button>
        <Button color="inherit" component={Link} to="/profile">
          Профиль
        </Button>
      </Toolbar>
    </AppBar>
  );
}