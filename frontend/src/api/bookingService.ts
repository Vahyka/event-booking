import axios from 'axios';
import { Booking } from '../types/types';

const API_URL ='http://localhost:5005/';

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

export const createBooking = async (userId: string, eventId: string, seatId: string): Promise<Booking> => {
  const response = await axiosInstance.post('http://localhost:5005/api/bookings/create', {
    userId,
    eventId,
    seatId,
  });
  return response.data as Booking;
};

export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  const response = await axiosInstance.get(`http://localhost:5005/api/bookings/user/${userId}`);
  return response.data as Booking[];
};

export const cancelBooking = async (bookingId: string): Promise<Booking> => {
  const response = await axiosInstance.put(`http://localhost:5005/api/bookings/${bookingId}/cancel`);
  return response.data as Booking;
};