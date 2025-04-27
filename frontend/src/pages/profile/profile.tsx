import { useState, useEffect } from 'react';
import { Typography, List, ListItem, ListItemText, Button, Dialog, CircularProgress } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import styles from './profile.module.css';
import BookingForm from '../../components/BookingForm';
import EventSelection from '../../components/EventSelection';
import { Event, Seat, Booking } from '../../types/types';
import { getUserBookings, createBooking, cancelBooking } from '../../api/bookingService';

export default function Profile() {
    const { user } = useAuth();
    const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            loadBookings();
        }
    }, [user]);

    const loadBookings = async () => {
        try {
            setIsLoading(true);
            const userBookings = await getUserBookings(user!.id);
            setBookings(userBookings);
            setError(null);
        } catch (err) {
            console.error('Error loading bookings:', err);
            setError('Не удалось загрузить бронирования');
        } finally {
            setIsLoading(false);
        }
    };

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
        loadBookings(); // Обновляем список бронирований
    };

    const handleCancelBooking = async (bookingId: string) => {
        try {
            await cancelBooking(bookingId);
            loadBookings(); // Обновляем список после отмены
        } catch (err) {
            console.error('Error cancelling booking:', err);
            setError('Не удалось отменить бронирование');
        }
    };

    if (isLoading) {
        return (
            <div className={styles.container}>
                <CircularProgress />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Typography variant="h4" gutterBottom>
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
                    {bookings.map((booking) => (
                        <ListItem key={booking.id} className={styles.bookingItem}>
                            <ListItemText
                                primary={booking.event?.title || 'Название события не указано'}
                                secondary={
                                    <>
                                        <Typography component="span" variant="body2">
                                            Дата: {new Date(booking.event?.date || '').toLocaleDateString()}
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
                    ))}
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
        </div>
    );
}