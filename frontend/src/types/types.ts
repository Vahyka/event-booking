export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    image: string;
    seats: Seat[];
}

export interface Seat {
    id: string;
    eventId: string;
    seatNumber: string;
    status: 'available' | 'booked';
}

export interface Booking {
    id: string;
    userId: string;
    eventId: string;
    seatId: string;
    event?: Event;
    seat?: Seat;
    createdAt: string;
    updatedAt: string;
}

export interface UserAttributes {
    id: string;
    username: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}