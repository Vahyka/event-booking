import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import Home from './pages/home/Home';
import { Profile } from './pages/profile/profile';
import Header from './components/layout/Header';
import { ThemeProvider, GlobalStyles } from '@mui/material';
import theme from "./styles/theme"
import './styles/global.css'
import { AuthProvider } from './contexts/AuthContext';
import AuthForm from './components/auth/AuthForm';
import { StoreProvider } from './contexts/StoreContext';

export default function App() {
  return (
    <StoreProvider>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <GlobalStyles
            styles={(theme) => ({
              ':root': {
                '--primary-main': theme.palette.primary.main,
                '--primary-contrastText': theme.palette.primary.contrastText,
                '--secondary-main': theme.palette.secondary.main,
                '--secondary-light': theme.palette.secondary.light,
                '--background-default': theme.palette.background.default,
                '--background-paper': theme.palette.background.paper,
              }
            })}
          />
          <Router>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<AuthForm type="login" />} />
              <Route path="/register" element={<AuthForm type="register" />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </StoreProvider>
  );
}