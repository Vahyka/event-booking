import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../src/pages/home/Home';
import Profile from '../src/pages/profile/profile';
import Login from '../src/pages/auth/login';
import Register from '../src/pages/auth/register';
import Header from '../src/components/layout/Header';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}