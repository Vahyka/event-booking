import { DataTypes, Model } from '@sequelize/core';
import sequelize from '../config/db.config';
import Event from './event.model';

interface SeatAttributes {
    id: string;
    eventId: string;
    seatNumber: string;
    status: 'available' | 'booked';
    createdAt?: Date;
    updatedAt?: Date;
}

class Seat extends Model<SeatAttributes> implements SeatAttributes {
    declare id: string;
    declare eventId: string;
    declare seatNumber: string;
    declare status: 'available' | 'booked';
    declare createdAt?: Date;
    declare updatedAt?: Date;
}

Seat.init(
    {
        id: {
            type: DataTypes.STRING,
            defaultValue: DataTypes.STRING,
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
        seatNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('available', 'booked', 'reserved'),
            defaultValue: 'available',
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
        modelName: 'Seat',
        tableName: 'seats',
    }
);

// Define associations
Seat.belongsTo(Event, { foreignKey: 'eventId' });
Event.hasMany(Seat, { foreignKey: 'eventId' });

export default Seat;