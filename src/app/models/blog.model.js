import { DataTypes } from 'sequelize';
import { db } from './index.js';

const Blog = (sequelize) => {
    const BlogModel = sequelize.define(
        'blogs',
        {
            topic: {
                type: DataTypes.STRING(500),
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

    BlogModel.findByIdWithDetails = async function (id) {
        return this.findByPk(id, {
            include: [{ model: db.image, as: 'image' }],
        });
    };
    BlogModel.findAllBlog = async function () {
        return this.findAll({
            include: [{ model: db.image, as: 'image' }],
        });
    };
    BlogModel.getSize = async function () {
        return this.count();
    };
    BlogModel.getLimitOffset = async function (limit, offset) {
        return this.findAll({
            limit: limit,
            offset: offset,
            include: [{ model: db.image, as: 'image' }],
        });
    };
    BlogModel.search = async function (searchCriteria, options = {}) {
        return this.findAndCountAll({
            where: searchCriteria,
            distinct: true, // Sử dụng DISTINCT
            include: [{ model: db.image, as: 'image' }],
        });
    };
    BlogModel.updateById = async function (id, data) {
        await this.update(data, {
            where: { id },
            returning: true, // Trả về các bản ghi đã được cập nhật
        });
    };

    BlogModel.createBlog = async function (data) {
        return this.create(data);
    };

    BlogModel.deleteBlog = async function (id) {
        return this.destroy({
            where: { id },
        });
    };

    return BlogModel;
};

export default Blog;
