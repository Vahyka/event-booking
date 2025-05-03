import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../contexts/StoreContext';
import { Box, Typography, Paper, List, ListItem, ListItemText, CircularProgress, Button, Dialog } from '@mui/material';
import styles from './profile.module.css';
import BookingForm from '../../components/BookingForm';
import EventSelection from '../../components/EventSelection';
import { getSeats } from '../../api/seatsService';
import { Event, Seat } from '../../types/types';

export const Profile = observer(() => {
  const { userStore, eventStore } = useStore();
  const user = userStore.currentUser;

  // --- booking state ---
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [error, setError] = useState<string | null>(null);

  console.log('events', eventStore.events);

  useEffect(() => {
    if (eventStore.events.length === 0) {
      eventStore.fetchEvents();
    }
  }, [eventStore]);

  useEffect(() => {
    if (selectedEvent) {
      getSeats(selectedEvent.id).then(setSeats);
    } else {
      setSeats([]);
    }
  }, [selectedEvent]);

  useEffect(() => {
    if (user) {
      eventStore.fetchUserBookings(user.id);
    }
  }, [user, eventStore]);

  const handleOpenBookingDialog = () => {
    setIsBookingDialogOpen(true);
  };

  const handleCloseBookingDialog = () => {
    setIsBookingDialogOpen(false);
    setSelectedEvent(null);
    setSelectedSeat(null);
  };

  const handleEventSelect = (event: Event, seat: Seat) => {
    setSelectedEvent(event);
    setSelectedSeat(seat);
  };

  const handleBookingSuccess = () => {
    handleCloseBookingDialog();
    if (user) eventStore.fetchUserBookings(user.id);
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      setError(null);
      if (user) {
        console.log('before cancelBooking', eventStore.getUserBookings(user.id));
        await eventStore.cancelBooking(bookingId, user.id);
        console.log('after cancelBooking', eventStore.getUserBookings(user.id));
      }
    } catch (err) {
      setError('Не удалось отменить бронирование');
    }
  };

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>Please log in to view your profile</Typography>
      </Box>
    );
  }

  if (eventStore.loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  const bookings = user ? eventStore.getUserBookings(user.id) : [];
  console.log('bookings in render', bookings);

  return (
    <Box className={styles.container}>
      <Paper elevation={3} className={styles.profileCard}>
        <Typography variant="h4" gutterBottom>
          Profile Information
        </Typography>
        <Box className={styles.userInfo}>
          <Typography variant="h6">Name: {user.name}</Typography>
          <Typography variant="h6">Email: {user.email}</Typography>
          <Typography variant="h6">Role: {user.role}</Typography>
        </Box>

        <Typography variant="h5" className={styles.sectionTitle}>
          Мои бронирования
        </Typography>

        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleOpenBookingDialog}
          sx={{ mb: 3 }}
        >
          Оформить новое бронирование
        </Button>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {bookings.length === 0 ? (
          <Typography variant="body1">У вас пока нет бронирований</Typography>
        ) : (
          <List>
            {bookings.map((booking: any) => {
              const event = eventStore.getEventById(booking.eventId);
              return (
                <ListItem key={booking.id} className={styles.bookingItem}>
                  <ListItemText
                    primary={event?.title || 'Название события не указано'}
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          Дата: {new Date(event?.date || '').toLocaleDateString()}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          Место: {booking.seat?.seatNumber || 'Номер места не указан'}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          Статус: {booking.seat?.status === 'booked' ? 'Забронировано' : 'Доступно'}
                        </Typography>
                      </>
                    }
                  />
                  <Button 
                    variant="outlined" 
                    color="error"
                    onClick={() => handleCancelBooking(booking.id)}
                  >
                    Отменить
                  </Button>
                </ListItem>
              );
            })}
          </List>
        )}

        <Dialog 
          open={isBookingDialogOpen} 
          onClose={handleCloseBookingDialog}
          maxWidth="md"
          fullWidth
        >
          <div style={{ padding: '20px' }}>
            {!selectedEvent || !selectedSeat ? (
              <EventSelection onEventSelect={handleEventSelect} />
            ) : user && (
              <>
                <Typography variant="h5" gutterBottom>
                  Оформление бронирования
                </Typography>
                <BookingForm
                  event={selectedEvent}
                  selectedSeat={selectedSeat}
                  userId={user.id}
                  onBookingSuccess={handleBookingSuccess}
                />
              </>
            )}
          </div>
        </Dialog>
      </Paper>
    </Box>
  );
}); 