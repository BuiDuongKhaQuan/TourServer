import { DataTypes } from 'sequelize';
import { db } from './index.js';

const Review = (sequelize) => {
    const ReviewModel = sequelize.define(
        'reviews',
        {
            tourId: {
                type: DataTypes.INTEGER,
            },
            userId: {
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
    ReviewModel.findAllReview = async function () {
        return this.findAll({
            include: [{ model: db.image, as: 'images' }],
        });
    };
    ReviewModel.getSize = async function () {
        return this.count();
    };
    ReviewModel.findByIdWithDetails = async function (id) {
        return this.findByPk(id, {
            include: [
                { model: db.image, as: 'images' },
                { model: db.user, as: 'user' },
            ],
        });
    };
    ReviewModel.findAllByColumn = async function (column, value) {
        const whereClause = {};
        whereClause[column] = value;
        return this.findAll({
            where: whereClause,
        });
    };
    ReviewModel.getLimitOffset = async function (limit, offset) {
        return this.findAll({
            limit: limit,
            offset: offset,
            include: [
                { model: db.image, as: 'images' },
                { model: db.user, as: 'user' },
            ],
        });
    };

    ReviewModel.updateById = async function (id, data) {
        await this.update(data, {
            where: { id },
            returning: true, // Trả về các bản ghi đã được cập nhật
        });
        return this.findByIdWithDetails(id); // Lấy lại dữ liệu với đầy đủ chi tiết
    };

    ReviewModel.createReview = async function (data) {
        return this.create(data);
    };

    ReviewModel.deleteReview = async function (id) {
        return this.destroy({
            where: { id },
        });
    };

    return ReviewModel;
};

export default Review;
