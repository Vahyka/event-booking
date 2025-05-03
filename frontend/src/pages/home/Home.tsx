import { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import EventCard from '../../components/eventCard/EventCard';
import styles from './Home.module.css';
import { Event } from '../../types/types';
import { getEvents } from '../../api/eventService';

export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  useEffect(() => { getEvents().then(setEvents); }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Классические концерты</h1>
      
      <Grid container spacing={3} className={styles.eventsGrid}>
        {events.map(event => (
          <Grid 
            item
            component="div"
            xs={12}
            sm={6}
            md={4}
            key={event.id}
          >
            <EventCard 
              event={event} 
              onClick={() => setSelectedEvent(event)}
            />
          </Grid>
        ))}
      </Grid>

      <Modal
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        aria-labelledby="event-modal"
        aria-describedby="event-description"
      >
        <div className={styles.modalContent}>
          {selectedEvent && (
            <>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>{selectedEvent.title}</h2>
                <p className={styles.modalDescription}>
                  {selectedEvent.description}
                </p>
                <p className={styles.modalDescription}>
                  Дата: {new Date(selectedEvent.date).toLocaleDateString()} · 
                  Локация: {selectedEvent.location}
                </p>
                <p>

                </p>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}