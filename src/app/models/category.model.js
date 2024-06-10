import { DataTypes } from 'sequelize';

const TourCategory = (sequelize) => {
    const CategoryModel = sequelize.define(
        'categories',
        {
            name: {
                type: DataTypes.STRING,
            },
        },
        {
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci',
        },
    );
    CategoryModel.findAllCategory = async function () {
        return this.findAll({});
    };
    CategoryModel.getSize = async function () {
        return this.count();
    };
    CategoryModel.findByIdWithDetails = async function (id) {
        return this.findByPk(id, {});
    };

    CategoryModel.getLimitOffset = async function (limit, offset) {
        return this.findAll({
            limit: limit,
            offset: offset,
        });
    };

    CategoryModel.updateById = async function (id, data) {
        return this.update(data, {
            where: { id },
            returning: true,
        });
    };

    CategoryModel.createCategory = async function (data) {
        return this.create(data);
    };

    CategoryModel.deleteCategory = async function (id) {
        return this.destroy({
            where: { id },
        });
    };
    return CategoryModel;
};

export default TourCategory;
