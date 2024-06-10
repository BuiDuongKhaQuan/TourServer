import { DataTypes } from 'sequelize';

const Review = (sequelize) => {
    return sequelize.define(
        'reviews',
        {
            tourId: {
                type: DataTypes.INTEGER,
            },
            rate: {
                type: DataTypes.DOUBLE,
            },
            message: {
                type: DataTypes.STRING(2000),
            },
            name: {
                type: DataTypes.STRING,
            },
            email: {
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
};

export default Review;
