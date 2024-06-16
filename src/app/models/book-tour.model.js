import { DataTypes } from 'sequelize';
import { db } from './index.js';

const BookTour = (sequelize) => {
    const BookTourModel = sequelize.define(
        'book_tours',
        {
            userId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            tourId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'tours',
                    key: 'id',
                },
            },
            name: {
                type: DataTypes.STRING,
            },
            email: {
                type: DataTypes.STRING,
            },
            phone: {
                type: DataTypes.STRING,
            },
            ticketId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'tickets',
                    key: 'id',
                },
            },
            adultQuantity: {
                type: DataTypes.STRING,
            },
            childQuantity: {
                type: DataTypes.STRING,
            },
            date: {
                type: DataTypes.DATE,
            },
            message: {
                type: DataTypes.STRING(5000),
            },
            status: {
                type: DataTypes.INTEGER,
            },
            totalPrice: {
                type: DataTypes.DECIMAL,
            },
            checkoutStatus: {
                type: DataTypes.INTEGER,
            },
            paymentMethod: {
                type: DataTypes.INTEGER,
            },
        },
        {
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci',
        },
    );

    BookTourModel.findAllBookTour = async function () {
        return this.findAll({
            include: [
                { model: db.user, as: 'user' },
                { model: db.tour, as: 'tour' },
                { model: db.ticket, as: 'ticket' },
            ],
        });
    };

    BookTourModel.getSize = async function () {
        return this.count();
    };

    BookTourModel.findByIdWithDetails = async function (id) {
        return this.findByPk(id, {
            include: [
                { model: db.user, as: 'user' },
                { model: db.tour, as: 'tour' },
                { model: db.ticket, as: 'ticket' },
            ],
        });
    };

    BookTourModel.getLimitOffset = async function (limit, offset) {
        return this.findAll({
            limit: limit,
            offset: offset,
            include: [
                { model: db.user, as: 'user' },
                { model: db.tour, as: 'tour' },
                { model: db.ticket, as: 'ticket' },
            ],
        });
    };
    BookTourModel.findAllByConditions = async function (conditions, useOr = false) {
        const { Op } = db.Sequelize;
        const whereClause = useOr ? { [Op.or]: [] } : { [Op.and]: [] };
        // Xây dựng whereClause từ các điều kiện truyền vào
        for (const [column, value] of Object.entries(conditions)) {
            const condition = {};
            condition[column] = value;
            if (useOr) {
                whereClause[Op.or].push(condition);
            } else {
                whereClause[Op.and].push(condition);
            }
        }
        return this.findAll({
            where: whereClause,
            include: [
                { model: db.user, as: 'user' },
                { model: db.tour, as: 'tour' },
                { model: db.ticket, as: 'ticket' },
            ],
        });
    };

    BookTourModel.updateById = async function (id, data) {
        await this.update(data, {
            where: { id },
            returning: true, // Trả về các bản ghi đã được cập nhật
        });
        return this.findByIdWithDetails(id); // Lấy lại dữ liệu với đầy đủ chi tiết
    };

    BookTourModel.createBookTour = async function (data) {
        return this.create(data);
    };

    return BookTourModel;
};

export default BookTour;
