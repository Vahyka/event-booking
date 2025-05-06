// frontend/src/api/eventService.ts
import axios from 'axios';
import { Seat } from '../types/types';

const API_URL = 'http://localhost:5005/api/events/';

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  });

export const getSeats = async (eventId: string): Promise<Seat[]> => {
  const response = await axiosInstance.get(`${API_URL}${eventId}/seats`);
  return response.data as Seat[];
};