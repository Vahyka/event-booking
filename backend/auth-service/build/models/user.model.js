"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@sequelize/core");
// import { PostgresDialect } from '@sequelize/postgres';
const db_config_1 = __importDefault(require("../config/db.config"));
class User extends core_1.Model {
}
User.init({
    id: {
        type: core_1.DataTypes.UUID,
        defaultValue: core_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    username: {
        type: core_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: core_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: core_1.DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: core_1.DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user'
    },
    name: {
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
    modelName: 'User',
    tableName: 'users',
});
exports.default = User;
