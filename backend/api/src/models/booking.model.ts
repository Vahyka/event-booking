import { DataTypes, Model } from '@sequelize/core';
import sequelize from '../config/db.config';
import Event from './event.model';
import Seat from './seat.model';

interface BookingAttributes {
    id: string;
    userId: string;
    eventId: string;
    seatId: string;
}

class Booking extends Model<BookingAttributes> implements BookingAttributes {
    declare id: string;
    userId!: string;
    eventId!: string;
    seatId!: string;
}

Booking.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        eventId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        seatId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Booking',
        tableName: 'bookings',
        timestamps: true,
    }
)

// Define associations
Booking.belongsTo(Event, { foreignKey: 'eventId' });
Event.hasMany(Booking, { foreignKey: 'eventId' });

Booking.belongsTo(Seat, { foreignKey: 'seatId' });
Seat.hasOne(Booking, { foreignKey: 'seatId' });

export default Booking; 