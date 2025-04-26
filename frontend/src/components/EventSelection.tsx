import React, { useState } from 'react';
import { Typography, Button, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { Event, Seat } from '../types/types';
import { events } from '../api/mockData';

interface EventSelectionProps {
  onEventSelect: (event: Event, seat: Seat) => void;
}

const EventSelection: React.FC<EventSelectionProps> = ({ onEventSelect }) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    setSelectedSeat(null);
  };

  const handleSeatSelect = (seat: Seat) => {
    if (seat.status === 'available') {
      setSelectedSeat(seat);
    }
  };

  const handleConfirm = () => {
    if (selectedEvent && selectedSeat) {
      onEventSelect(selectedEvent, selectedSeat);
    }
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Выберите мероприятие
      </Typography>
      <Grid container spacing={2}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <Card 
              onClick={() => handleEventSelect(event)}
              sx={{ 
                cursor: 'pointer',
                backgroundColor: selectedEvent?.id === event.id ? 'primary.light' : 'background.paper'
              }}
            >
              <CardMedia
                component="img"
                height="140"
                image={event.image}
                alt={event.title}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {event.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {event.date}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {event.location}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedEvent && (
        <div style={{ marginTop: '20px' }}>
          <Typography variant="h6" gutterBottom>
            Выберите место
          </Typography>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {selectedEvent.seats.map((seat) => (
              <Button
                key={seat.id}
                variant={selectedSeat?.id === seat.id ? 'contained' : 'outlined'}
                color={seat.status === 'available' ? 'primary' : 'error'}
                onClick={() => handleSeatSelect(seat)}
                disabled={seat.status !== 'available'}
              >
                Номер места {seat.seatNumber}
              </Button>
            ))}
          </div>
        </div>
      )}

      {selectedEvent && selectedSeat && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirm}
          sx={{ mt: 2 }}
        >
          Подтвердить выбор
        </Button>
      )}
    </div>
  );
};

export default EventSelection; 