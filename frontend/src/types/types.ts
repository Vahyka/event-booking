export interface Event {
    id: string;
    title: string;
    date: string;
    location: string;
    description: string;
    image: string;
    seats: Seat[];
  }
  
  export interface Seat {
    id: string;
    row: number;
    number: number;
    status: 'available' | 'booked';
  }
  
  export interface Booking {
    eventId: string;
    seats: string[];
    date: string;
  }