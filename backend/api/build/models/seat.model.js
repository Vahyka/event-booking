"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@sequelize/core");
const db_config_1 = __importDefault(require("../config/db.config"));
const event_model_1 = __importDefault(require("./event.model"));
class Seat extends core_1.Model {
}
Seat.init({
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
    seatNumber: {
        type: core_1.DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: core_1.DataTypes.ENUM('available', 'booked', 'reserved'),
        defaultValue: 'available',
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
    modelName: 'Seat',
    tableName: 'seats',
});
// Define associations
Seat.belongsTo(event_model_1.default, { foreignKey: 'eventId' });
event_model_1.default.hasMany(Seat, { foreignKey: 'eventId' });
exports.default = Seat;
