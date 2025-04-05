import { useState } from 'react';
import { Typography, List, ListItem, ListItemText } from '@mui/material';
import styles from './profile.module.css';

export default function Profile() {
  // Моковые данные бронирований
  const [bookings] = useState([
    {
      eventId: '1',
      seats: ['s-15', 's-16'],
      date: '2024-04-20'
    },
    {
      eventId: '3',
      seats: ['s-42'],
      date: '2024-06-10'
    }
  ]);

  return (
    <div className={styles.container}>
      <Typography variant="h4" gutterBottom>
        Мои бронирования
      </Typography>
      
      {bookings.length === 0 ? (
        <Typography variant="body1">У вас пока нет бронирований</Typography>
      ) : (
        <List>
          {bookings.map((booking, index) => (
            <ListItem key={index} className={styles.bookingItem}>
              <ListItemText
                primary={`Концерт ${booking.eventId}`}
                secondary={`Дата: ${booking.date} · Места: ${booking.seats.join(', ')}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
}