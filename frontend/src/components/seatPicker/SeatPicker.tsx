import styles from './SeatPicker.module.css';
import { Seat } from '../../types/types';

export default function SeatPicker({ 
  seats,
  onSelect
}: {
  seats: Seat[];
  onSelect: (seatId: string) => void;
}) {
  return (
    <div className={styles.grid}>
      {seats.map(seat => (
        <button
          key={seat.id}
          className={`${styles.seat} ${styles[seat.status]}`}
          onClick={() => onSelect(seat.id)}
          disabled={seat.status === 'booked'}
        >
          {seat.row}-{seat.number}
        </button>
      ))}
    </div>
  );
}