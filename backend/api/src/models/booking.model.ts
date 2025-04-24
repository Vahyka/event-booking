import { DataTypes, Model } from '@sequelize/core';
import sequelize from '../config/db.config';
import Event from './event.model';
import Seat from './seat.model';

interface BookingAttributes {
    id: string;
    eventId: string;
    seatId: string;
    userId: string;
    status: 'confirmed' | 'cancelled' | 'pending';
    bookingDate: Date;
    quantity: number;
    createdAt?: Date;
    updatedAt?: Date;
}

class Booking extends Model<BookingAttributes> implements BookingAttributes {
    declare id: string;
    declare eventId: string;
    declare seatId: string;
    declare userId: string;
    declare status: 'confirmed' | 'cancelled' | 'pending';
    declare bookingDate: Date;
    declare quantity: number;
    declare createdAt?: Date;
    declare updatedAt?: Date;
}

Booking.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        eventId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Event,
                key: 'id',
            },
        },
        seatId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Seat,
                key: 'id',
            },
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('confirmed', 'cancelled', 'pending'),
            defaultValue: 'pending',
        },
        bookingDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        modelName: 'Booking',
        tableName: 'bookings',
    }
);

// Define associations
Booking.belongsTo(Event, { foreignKey: 'eventId' });
Event.hasMany(Booking, { foreignKey: 'eventId' });

Booking.belongsTo(Seat, { foreignKey: 'seatId' });
Seat.hasOne(Booking, { foreignKey: 'seatId' });

export default Booking; 