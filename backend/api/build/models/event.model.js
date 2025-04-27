"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@sequelize/core");
const db_config_1 = __importDefault(require("../config/db.config"));
class Event extends core_1.Model {
}
Event.init({
    id: {
        type: core_1.DataTypes.UUID,
        defaultValue: core_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: core_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: core_1.DataTypes.TEXT,
        allowNull: false,
    },
    date: {
        type: core_1.DataTypes.DATE,
        allowNull: false,
    },
    location: {
        type: core_1.DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: core_1.DataTypes.STRING,
        allowNull: false,
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
    modelName: 'Event',
    tableName: 'events',
});
exports.default = Event;
