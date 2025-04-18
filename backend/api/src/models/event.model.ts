import { DataTypes, Model } from '@sequelize/core';
import sequelize from '../config/db.config';

interface EventAttributes {
    id: string;
    title: string;
    description: string;
    date: Date;
    location: string;
    image: string;
    createdAt?: Date;
    updatedAt?: Date;
}

class Event extends Model<EventAttributes> implements EventAttributes {
    declare id: string;
    declare title: string;
    declare description: string;
    declare date: Date;
    declare location: string;
    declare image: string;
    declare createdAt?: Date;
    declare updatedAt?: Date;
}

Event.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false,
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
        modelName: 'Event',
        tableName: 'events',
    }
);

export default Event; 