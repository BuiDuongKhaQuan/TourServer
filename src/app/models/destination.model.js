import { DataTypes } from 'sequelize';
import { db } from './index.js';

const Destination = (sequelize) => {
    const DestinationModel = sequelize.define(
        'destinations',
        {
            name: {
                type: DataTypes.STRING,
            },
            trips: {
                type: DataTypes.STRING,
            },
            information: {
                type: DataTypes.TEXT('long'),
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
    DestinationModel.findAllDestination = async function () {
        return this.findAll({
            include: [{ model: db.image, as: 'image' }],
        });
    };
    DestinationModel.getSize = async function () {
        return this.count();
    };
    DestinationModel.findByIdWithDetails = async function (id) {
        return this.findByPk(id, {
            include: [{ model: db.image, as: 'image' }],
        });
    };

    DestinationModel.getLimitOffset = async function (limit, offset) {
        return this.findAll({
            limit: limit,
            offset: offset,
            include: [{ model: db.image, as: 'image' }],
        });
    };
    DestinationModel.search = async function (searchCriteria, options = {}) {
        const include = [{ model: db.image, as: 'image' }];
        return this.findAndCountAll({
            where: searchCriteria,
            distinct: true, // Sử dụng DISTINCT
            include,
        });
    };
    DestinationModel.updateById = async function (id, data) {
        return this.update(data, {
            where: { id },
            returning: true, // Trả về các bản ghi đã được cập nhật
        });
    };

    DestinationModel.createDestination = async function (data) {
        return this.create(data);
    };

    DestinationModel.deleteDestination = async function (id) {
        return this.destroy({
            where: { id },
        });
    };

    return DestinationModel;
};

export default Destination;
