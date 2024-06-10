import { DataTypes } from 'sequelize';

const Ticket = (sequelize) => {
    const TicketModel = sequelize.define(
        'tickets',
        {
            type: {
                type: DataTypes.STRING,
            },
            value: {
                type: DataTypes.DOUBLE,
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
    TicketModel.findAllTicket = async function () {
        return this.findAll({});
    };
    TicketModel.getSize = async function () {
        return this.count();
    };
    TicketModel.findByIdWithDetails = async function (id) {
        return this.findByPk(id, {});
    };

    TicketModel.getLimitOffset = async function (limit, offset) {
        return this.findAll({
            limit: limit,
            offset: offset,
        });
    };

    TicketModel.updateById = async function (id, data) {
        return this.update(data, {
            where: { id },
            returning: true, // Trả về các bản ghi đã được cập nhật
        });
    };

    TicketModel.createTicket = async function (data) {
        return this.create(data);
    };

    TicketModel.deleteTicket = async function (id) {
        return this.destroy({
            where: { id },
        });
    };
    return TicketModel;
};

export default Ticket;
