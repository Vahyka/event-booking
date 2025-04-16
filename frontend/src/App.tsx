import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Home from '../src/pages/home/Home';
import Profile from '../src/pages/profile/profile';
import Login from '../src/pages/auth/login';
import Register from '../src/pages/auth/register';
import Header from '../src/components/layout/Header';
import { ThemeProvider, GlobalStyles } from '@mui/material';
import theme from "./styles/theme"
import './styles/global.css'

export default function App() {
  return (
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
      <BrowserRouter>
        <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}