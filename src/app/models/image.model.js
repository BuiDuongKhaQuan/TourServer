import { DataTypes, where } from 'sequelize';

const Image = (sequelize) => {
    const ImageModel = sequelize.define(
        'images',
        {
            userId: {
                type: DataTypes.INTEGER,
            },
            tourId: {
                type: DataTypes.INTEGER,
            },
            companyId: {
                type: DataTypes.INTEGER,
            },
            blogId: {
                type: DataTypes.INTEGER,
            },
            destinationId: {
                type: DataTypes.INTEGER,
            },
            reviewId: {
                type: DataTypes.INTEGER,
            },
            url: {
                type: DataTypes.STRING(1000),
            },
        },
        {
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci',
        },
    );
    ImageModel.findAllByColumn = async function (column, value) {
        const whereClause = {};
        whereClause[column] = value;
        return this.findAll({
            where: whereClause,
        });
    };
    ImageModel.uploadImageByColumn = async function (column, value, url) {
        const data = {};
        data[column] = value;
        data.url = url;
        return this.create(data);
    };

    // Phương thức cập nhật hình ảnh
    ImageModel.updateByColumn = async function (column, value, url) {
        const whereClause = {};
        whereClause[column] = value;
        return this.update(
            { url },
            {
                where: whereClause,
                returning: true, // Trả về các bản ghi đã được cập nhật
            },
        );
    };

    // Phương thức xoá hình ảnh
    ImageModel.deleteByColumn = async function (column, value) {
        const whereClause = {};
        whereClause[column] = value;
        return this.destroy({
            where: whereClause,
        });
    };

    return ImageModel;
};

export default Image;
