import { DataTypes } from 'sequelize';
import { db } from './index.js';

const User = (sequelize) => {
    const UserModel = sequelize.define(
        'users',
        {
            name: {
                type: DataTypes.STRING,
            },
            password: {
                type: DataTypes.STRING,
            },
            email: {
                type: DataTypes.STRING,
            },
            phone: {
                type: DataTypes.STRING,
            },
            address: {
                type: DataTypes.STRING,
            },
            gender: {
                type: DataTypes.STRING,
            },
            status: {
                type: DataTypes.INTEGER,
            },
        },
        {
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci',
        },
    );

    UserModel.findByColumn = async function (column, value) {
        const whereClause = {};
        whereClause[column] = value;
        return this.findOne({
            where: whereClause,
            include: [
                { model: db.image, as: 'avatar' },
                { model: db.role, as: 'roles' },
            ],
        });
    };

    UserModel.findAllUser = async function () {
        return this.findAll({
            include: [
                { model: db.image, as: 'avatar' },
                { model: db.role, as: 'roles' },
            ],
        });
    };

    UserModel.getSize = async function () {
        return this.count();
    };

    UserModel.getLimitOffset = async function (limit, offset) {
        return this.findAll({
            limit: limit,
            offset: offset,
            include: [
                { model: db.image, as: 'avatar' },
                { model: db.role, as: 'roles' },
            ],
        });
    };

    UserModel.updateByColumn = async function (column, value, data) {
        const whereClause = {};
        whereClause[column] = value;
        return this.update(data, {
            where: whereClause,
            returning: true, // Trả về các bản ghi đã được cập nhật
        });
    };

    UserModel.createUser = async function (data) {
        return this.create(data);
    };
    return UserModel;
};

export default User;
