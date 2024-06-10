import { DataTypes } from 'sequelize';

const Role = (sequelize) => {
    return sequelize.define(
        'roles',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
            },
        },
        {
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci',
        },
    );
};

export default Role;
