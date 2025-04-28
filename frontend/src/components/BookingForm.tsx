import React, { useState } from 'react';
import { createBooking } from '../api/bookingService';
import { Event, Seat } from '../types/types';



interface BookingFormProps {
  event: Event;
  selectedSeat: Seat | null;
  userId: string;
  onBookingSuccess: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ event, selectedSeat, userId, onBookingSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSeat) {
      setError('Please select a seat');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await createBooking(userId, event.id, selectedSeat.id);
      onBookingSuccess();
    } catch (err) {
      setError('Failed to create booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <h3>Book Your Seat</h3>
      {selectedSeat && (
        <div className="selected-seat">
          <p>Selected Seat: {selectedSeat.seatNumber}</p>
        </div>
      )}
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={isLoading || !selectedSeat}>
        {isLoading ? 'Booking...' : 'Confirm Booking'}
      </button>
    </form>
  );
};

export default BookingForm; 