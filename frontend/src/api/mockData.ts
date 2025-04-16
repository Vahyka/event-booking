import { Event, Seat} from '../types/types';

export const events: Event[] = [
  {
    id: '1',
    title: 'Симфония Бетховена',
    date: '2024-04-20T19:00',
    location: 'Московская консерватория',
    description: 'Исполнение всех 9 симфоний Людвига ван Бетховена',
    image: 'https://cdn.culture.ru/images/d145e976-ce56-5704-8247-7c4a6bc97758',
    seats: generateSeats(100, 10)
  },
  {
    id: '2',
    title: 'Времена года Вивальди',
    date: '2024-05-15T18:30',
    location: 'Концертный зал Чайковского',
    description: 'Четыре скрипичных концерта в исполнении оркестра "Виртуозы Москвы"',
    image: 'https://www.nsartmuseum.ru/public/images/news/507/1669020988.webp',
    seats: generateSeats(100, 10)
  },
  {
    id: '3',
    title: 'Реквием Моцарта',
    date: '2024-06-10T20:00',
    location: 'Кафедральный собор св. Петра',
    description: 'Традиционное исполнение последнего произведения В.А. Моцарта',
    image: 'https://artbene.ru/wp-content/uploads/FYFVV.jpg',
    seats: generateSeats(100, 10)
  }
];

function generateSeats(total: number, seatsPerRow: number): Seat[] {
  return Array.from({ length: total }, (_, i) => ({
    id: `s-${i}`,
    row: Math.floor(i / seatsPerRow) + 1,
    number: (i % seatsPerRow) + 1,
    status: Math.random() > 0.8 ? 'booked' : 'available'
  }));
}