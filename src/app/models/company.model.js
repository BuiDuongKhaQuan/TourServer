import { DataTypes } from 'sequelize';

const Company = (sequelize) => {
    return sequelize.define(
        'company',
        {
            logo: {
                type: DataTypes.STRING,
            },
            logan: {
                type: DataTypes.STRING(5000),
            },
            phone: {
                type: DataTypes.STRING(10),
            },
            email: {
                type: DataTypes.STRING,
            },
            address: {
                type: DataTypes.STRING,
            },
            social: {
                type: DataTypes.STRING,
            },
        },
        {
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci',
        },
    );
};

export default Company;
