"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@sequelize/core");
const db_config_1 = __importDefault(require("../config/db.config"));
const event_model_1 = __importDefault(require("./event.model"));
const seat_model_1 = __importDefault(require("./seat.model"));
class Booking extends core_1.Model {
}
Booking.init({
    id: {
        type: core_1.DataTypes.UUID,
        defaultValue: core_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    eventId: {
        type: core_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: event_model_1.default,
            key: 'id',
        },
    },
    seatId: {
        type: core_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: seat_model_1.default,
            key: 'id',
        },
    },
    userId: {
        type: core_1.DataTypes.UUID,
        allowNull: false,
    },
    status: {
        type: core_1.DataTypes.ENUM('confirmed', 'cancelled', 'pending'),
        defaultValue: 'pending',
    },
    bookingDate: {
        type: core_1.DataTypes.DATE,
        defaultValue: core_1.DataTypes.NOW,
    },
    createdAt: {
        type: core_1.DataTypes.DATE,
        defaultValue: core_1.DataTypes.NOW,
    },
    updatedAt: {
        type: core_1.DataTypes.DATE,
        defaultValue: core_1.DataTypes.NOW,
    },
}, {
    sequelize: db_config_1.default,
    modelName: 'Booking',
    tableName: 'bookings',
});
// Define associations
Booking.belongsTo(event_model_1.default, { foreignKey: 'eventId' });
event_model_1.default.hasMany(Booking, { foreignKey: 'eventId' });
Booking.belongsTo(seat_model_1.default, { foreignKey: 'seatId' });
seat_model_1.default.hasOne(Booking, { foreignKey: 'seatId' });
exports.default = Booking;
