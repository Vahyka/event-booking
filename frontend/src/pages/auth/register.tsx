import AuthForm from '../../components/auth/AuthForm';
import styles from '../../components/auth/AuthForm.module.css';

export default function Register() {
  return (
    <div className={styles.pageContainer}>
      <AuthForm type="register" />
    </div>
  );
}