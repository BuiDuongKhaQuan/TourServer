import { DataTypes } from 'sequelize';

const Contact = (sequelize) => {
    const ContactModel = sequelize.define(
        'contacts',
        {
            name: {
                type: DataTypes.STRING,
            },
            email: {
                type: DataTypes.STRING,
            },
            phone: {
                type: DataTypes.STRING(10),
            },
            topic: {
                type: DataTypes.STRING,
            },
            message: {
                type: DataTypes.STRING(5000),
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
    ContactModel.findAllContact = async function () {
        return this.findAll({});
    };
    ContactModel.getSize = async function () {
        return this.count();
    };
    ContactModel.findByIdWithDetails = async function (id) {
        return this.findByPk(id, {});
    };

    ContactModel.getLimitOffset = async function (limit, offset) {
        return this.findAll({
            limit: limit,
            offset: offset,
        });
    };

    ContactModel.updateById = async function (id, data) {
        return this.update(data, {
            where: { id },
            returning: true, // Trả về các bản ghi đã được cập nhật
        });
    };

    ContactModel.createContact = async function (data) {
        return this.create(data);
    };

    ContactModel.deleteContact = async function (id) {
        return this.destroy({
            where: { id },
        });
    };
    return ContactModel;
};

export default Contact;
