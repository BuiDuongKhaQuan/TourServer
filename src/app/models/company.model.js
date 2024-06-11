import { DataTypes } from 'sequelize';

const Company = (sequelize) => {
    const ComapnyModel = sequelize.define(
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

    ComapnyModel.findAllCompany = async function () {
        return this.findAll({});
    };
    ComapnyModel.getSize = async function () {
        return this.count();
    };
    ComapnyModel.findByIdWithDetails = async function (id) {
        return this.findByPk(id, {});
    };
    ComapnyModel.findAllByColumn = async function (column, value) {
        const whereClause = {};
        whereClause[column] = value;
        return this.findAll({
            where: whereClause,
        });
    };
    ComapnyModel.getLimitOffset = async function (limit, offset) {
        return this.findAll({
            limit: limit,
            offset: offset,
        });
    };

    ComapnyModel.updateById = async function (id, data) {
        await this.update(data, {
            where: { id },
            returning: true, // Trả về các bản ghi đã được cập nhật
        });
        return this.findByIdWithDetails(id); // Lấy lại dữ liệu với đầy đủ chi tiết
    };

    ComapnyModel.createCompany = async function (data) {
        return this.create(data);
    };

    return ComapnyModel;
};

export default Company;
