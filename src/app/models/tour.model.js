import { DataTypes, Sequelize } from 'sequelize';
import { db } from './index.js';

const Tour = (sequelize) => {
    const TourModel = sequelize.define(
        'tours',
        {
            destinationId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'destinations',
                    key: 'id',
                },
            },
            categoryId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'categories',
                    key: 'id',
                },
            },
            dealId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'deals',
                    key: 'id',
                },
            },
            name: {
                type: DataTypes.STRING,
            },
            date: {
                type: DataTypes.STRING,
            },
            personQuantity: {
                type: DataTypes.INTEGER,
            },
            information: {
                type: DataTypes.TEXT('long'),
            },
            price: {
                type: DataTypes.DECIMAL,
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
    TourModel.findAllTour = async function () {
        return this.findAll({
            include: [
                { model: db.destination, as: 'destination' },
                { model: db.category, as: 'category' },
                { model: db.image, as: 'images' },
                { model: db.review, as: 'reviews', required: false },
                { model: db.deal, as: 'deal', required: false },
            ],
        });
    };
    TourModel.getSize = async function () {
        return this.count();
    };
    TourModel.findByIdWithDetails = async function (id) {
        return this.findByPk(id, {
            include: [
                { model: db.destination, as: 'destination' }, // Đổi 'destinations' thành 'destination'
                { model: db.category, as: 'category' },
                { model: db.image, as: 'images' },
                { model: db.review, as: 'reviews', required: false },
                { model: db.deal, as: 'deal', required: false },
            ],
        });
    };
    TourModel.findAllByColumn = async function (column, value) {
        const whereClause = {};
        whereClause[column] = value;
        return this.findAll({
            where: whereClause,
            include: [
                { model: db.destination, as: 'destination' }, // Đổi 'destinations' thành 'destination'
                { model: db.category, as: 'category' },
                { model: db.image, as: 'images' },
                { model: db.review, as: 'reviews', required: false },
                { model: db.deal, as: 'deal', required: false },
            ],
        });
    };
    TourModel.search = async function (searchCriteria, options = {}) {
        const { offset = 0, limit = 10 } = options;
        const include = [
            { model: db.destination, as: 'destination' },
            { model: db.category, as: 'category' },
            { model: db.image, as: 'images' },
            { model: db.review, as: 'reviews', required: false },
            { model: db.deal, as: 'deal', required: false },
        ];

        if (searchCriteria.hasDeal) {
            include.push({
                model: db.deal,
                as: 'deal',
                where: {
                    expiryDate: { [Sequelize.Op.gt]: new Date() },
                },
                required: true, // Nếu muốn lọc bỏ các tour không có deal, sử dụng true thay vì false
            });
        }
        return this.findAndCountAll({
            where: searchCriteria,
            distinct: true, // Sử dụng DISTINCT
            include,
            offset,
            limit,
        });
    };
    TourModel.findAllDeal = async function () {
        return this.findAll({
            where: {
                dealId: {
                    [Sequelize.Op.ne]: null,
                },
            },
            include: [
                {
                    model: db.deal,
                    as: 'deal',
                    where: {
                        expiryDate: { [Sequelize.Op.gt]: new Date() },
                    },
                },
                { model: db.destination, as: 'destination' },
                { model: db.category, as: 'category' },
                { model: db.image, as: 'images' },
                { model: db.review, as: 'reviews', required: false },
            ],
        });
    };

    TourModel.getLimitOffset = async function (limit, offset) {
        return this.findAll({
            limit: limit,
            offset: offset,
            include: [
                { model: db.destination, as: 'destination' },
                { model: db.category, as: 'category' },
                { model: db.image, as: 'images' },
                { model: db.review, as: 'reviews', required: false },
                { model: db.deal, as: 'deal', required: false },
            ],
        });
    };

    TourModel.updateById = async function (id, data) {
        await this.update(data, {
            where: { id },
            returning: true, // Trả về các bản ghi đã được cập nhật
        });
        return this.findByIdWithDetails(id); // Lấy lại dữ liệu với đầy đủ chi tiết
    };

    TourModel.createTour = async function (data) {
        return this.create(data);
    };

    TourModel.deleteTour = async function (id) {
        return this.destroy({
            where: { id },
        });
    };

    return TourModel;
};

export default Tour;
