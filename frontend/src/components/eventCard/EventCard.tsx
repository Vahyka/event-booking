import { Card, CardContent, Typography, CardMedia } from '@mui/material';
import { Event } from '../../types/types';
import styles from './EventCard.module.css';

interface EventCardProps {
  event: Event;
  onClick: () => void; // Добавляем пропс onClick
}

export default function EventCard({ event, onClick }: EventCardProps) {
  return (
    <Card 
      className={styles.card}
      onClick={onClick} // Вешаем обработчик на корневой элемент
    >
      <CardMedia
        component="img"
        height="140"
        image={event.image}
        alt={event.title}
      />
      <CardContent>
        <Typography variant="h5">{event.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {event.location}
        </Typography>
      </CardContent>
    </Card>
  );
}