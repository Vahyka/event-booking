// frontend/src/api/eventService.ts
import axios from 'axios';
import { Event } from '../types/types';

const API_URL = 'http://localhost:5005/api/events';

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  });

export const getEvents = async (): Promise<Event[]> => {
  const response = await axiosInstance.get(API_URL);
  return response.data as Event[];
};