import Sequelize from 'sequelize';
import dbConfig from '../../config/db.config.js';
import UserModel from './user.model.js';
import RoleModel from './role.model.js';
import BlogModel from './blog.model.js';
import BookTourModel from './book-tour.model.js';
import CompanyModel from './company.model.js';
import ContactModel from './contact.model.js';
import DealModel from './deal.model.js';
import ImageModel from './image.model.js';
import ReviewModel from './review.model.js';
import TicketModel from './ticket.model.js';
import TourModel from './tour.model.js';
import CategoryModel from './category.model.js';
import DestinationModel from './destination.model.js';

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    timezone: dbConfig.timezone,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
    },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = UserModel(sequelize);
db.role = RoleModel(sequelize);
db.blog = BlogModel(sequelize);
db.bookTour = BookTourModel(sequelize);
db.company = CompanyModel(sequelize);
db.contact = ContactModel(sequelize);
db.deal = DealModel(sequelize);
db.image = ImageModel(sequelize);
db.review = ReviewModel(sequelize);
db.ticket = TicketModel(sequelize);
db.tour = TourModel(sequelize);
db.category = CategoryModel(sequelize);
db.destination = DestinationModel(sequelize);

//User
db.role.belongsToMany(db.user, { through: 'user_roles' });
db.user.belongsToMany(db.role, { through: 'user_roles' });
db.user.hasOne(db.image, { foreignKey: 'userId', as: 'avatar' });
db.image.belongsTo(db.user, { foreignKey: 'userId', as: 'users' });

//Tour
db.tour.belongsTo(db.destination, { foreignKey: 'destinationId', as: 'destination' });
db.tour.belongsTo(db.category, { foreignKey: 'categoryId', as: 'category' });
db.tour.belongsTo(db.deal, { foreignKey: 'dealId', as: 'deal' });
db.tour.hasMany(db.image, { foreignKey: 'tourId', as: 'images' });
db.tour.hasMany(db.review, { foreignKey: 'tourId', as: 'reviews' });

//Blog
db.blog.hasOne(db.image, { foreignKey: 'blogId', as: 'image' });
db.image.belongsTo(db.blog, { foreignKey: 'blogId', as: 'blogs' });

//Destionation
db.destination.hasOne(db.image, { foreignKey: 'destinationId', as: 'image' });
db.image.belongsTo(db.destination, { foreignKey: 'destinationId', as: 'destinations' });

//BookTour
db.user.hasMany(db.bookTour, { foreignKey: 'userId', as: 'user' });
db.tour.hasMany(db.bookTour, { foreignKey: 'tourId', as: 'bookTour' });
db.ticket.hasMany(db.bookTour, { foreignKey: 'ticketId', as: 'ticket' });
db.bookTour.belongsTo(db.user, { foreignKey: 'userId', as: 'user' });
db.bookTour.belongsTo(db.tour, { foreignKey: 'tourId', as: 'tour' });
db.bookTour.belongsTo(db.ticket, { foreignKey: 'ticketId', as: 'ticket' });

//Review
db.review.belongsTo(db.user, { foreignKey: 'userId', as: 'user' });
db.review.hasMany(db.image, { foreignKey: 'reviewId', as: 'images' });
db.user.hasMany(db.review, { foreignKey: 'userId', as: 'reviews' });
db.image.belongsTo(db.review, { foreignKey: 'reviewId', as: 'review' });

// Định nghĩa mảng các role có thể có
db.ROLES = ['user', 'admin', 'moderator'];

export { db, sequelize, Sequelize };
