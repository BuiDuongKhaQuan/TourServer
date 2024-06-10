import { DataTypes } from 'sequelize';

const Deal = (sequelize) => {
    const DealsModel = sequelize.define(
        'deals',
        {
            offer: {
                type: DataTypes.STRING,
            },
            quantity: {
                type: DataTypes.INTEGER,
            },
            dateExpiration: {
                type: DataTypes.DATE,
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
    DealsModel.findAllDeals = async function () {
        return this.findAll({});
    };
    DealsModel.getSize = async function () {
        return this.count();
    };
    DealsModel.findByIdWithDetails = async function (id) {
        return this.findByPk(id, {});
    };

    DealsModel.getLimitOffset = async function (limit, offset) {
        return this.findAll({
            limit: limit,
            offset: offset,
        });
    };

    DealsModel.updateById = async function (id, data) {
        return this.update(data, {
            where: { id },
            returning: true, // Trả về các bản ghi đã được cập nhật
        });
    };

    DealsModel.createDeals = async function (data) {
        return this.create(data);
    };

    DealsModel.deleteDeals = async function (id) {
        return this.destroy({
            where: { id },
        });
    };
    return DealsModel;
};

export default Deal;
