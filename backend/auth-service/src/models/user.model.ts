import { DataTypes, Model } from '@sequelize/core';
import sequelize from '../config/db.config';

interface UserAttributes 
{
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class User extends Model<UserAttributes> implements UserAttributes 
{
    declare id: string;
    username!: string;
    name!: string;
    email!: string;
    role!: 'user' | 'admin';
    password!: string;
    createdAt?: Date;
    updatedAt?: Date;
}

User.init(
{
    id: 
    {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user'
    },
    name: {
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
    modelName: 'User',
    tableName: 'users',
});

export default User;