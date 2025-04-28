import { makeAutoObservable, observable } from 'mobx';
import { RootStore } from './RootStore';
import { Event, Booking } from '../types/types';

const API_URL = 'http://localhost:5005';

export class EventStore {
    

  events: Event[] = [];
  bookings = observable.map<string, Booking[]>([]);
  loading: boolean = false;
  error: string | null = null;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this);
  }

  private getCachedData = (key: string) => {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  };

  private setCachedData = (key: string, data: any) => {
    this.cache.set(key, { data, timestamp: Date.now() });
  };

  setEvents = (events: Event[]) => {
    this.events = events;
    this.setCachedData('events', events);
  };

  setBookings = (userId: string, bookings: Booking[]) => {
    this.bookings.set(userId, bookings);
    this.setCachedData(`bookings-${userId}`, bookings);
  };

  setLoading = (loading: boolean) => {
    this.loading = loading;
  };

  setError = (error: string | null) => {
    this.error = error;
  };

  fetchEvents = async () => {
    try {
      const cachedEvents = this.getCachedData('events');
      if (cachedEvents) {
        this.events = cachedEvents;
        return;
      }

      this.setLoading(true);
      const response = await fetch(`${API_URL}/api/events`);
      const data = await response.json();
      this.setEvents(data);
    } catch (error) {
      this.setError(error instanceof Error ? error.message : 'Failed to fetch events');
    } finally {
      this.setLoading(false);
    }
  };

  fetchUserBookings = async (userId: string) => {
    try {
      const cacheKey = `bookings-${userId}`;
      const cachedBookings = this.getCachedData(cacheKey);
      if (cachedBookings) {
        this.bookings.set(userId, cachedBookings);
        return;
      }

      this.setLoading(true);
      const response = await fetch(`${API_URL}/api/bookings/user/${userId}`);
      const data = await response.json();
      this.setBookings(userId, data);
      this.setCachedData(cacheKey, data);
    } catch (error) {
      this.setError(error instanceof Error ? error.message : 'Failed to fetch bookings');
    } finally {
      this.setLoading(false);
    }
  };

  createBooking = async (eventId: string, seatId: string, userId: string) => {
    try {
      this.setLoading(true);
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.rootStore.userStore.authToken}`,
        },
        body: JSON.stringify({ eventId, seatId }),
      });
      const newBooking = await response.json();
      const userBookings = this.bookings.get(userId) || [];
      this.bookings.set(userId, [...userBookings, newBooking]);
      this.cache.delete(`bookings-${userId}`); // Invalidate cache
    } catch (error) {
      this.setError(error instanceof Error ? error.message : 'Failed to create booking');
    } finally {
      this.setLoading(false);
    }
  };

  getEventById = (id: string) => {
    return this.events.find(event => event.id === id);
  };

  getUserBookings = (userId: string) => {
    return this.bookings.get(userId) || [];
  };

  cancelBooking = async (bookingId: string, userId: string) => {
    try {
      this.setLoading(true);
      await fetch(`${API_URL}/api/bookings/${bookingId}/cancel`, { method: 'PUT' });
      await this.fetchUserBookings(userId);
    } catch (error) {
      this.setError(error instanceof Error ? error.message : 'Failed to cancel booking');
    } finally {
      this.setLoading(false);
    }
  };
} 