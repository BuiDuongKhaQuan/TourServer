import blogRouter from './blog.routes.js';
import authRouter from './auth.routes.js';
import destinationRoute from './destination.routes.js';
import tourRouter from './tour.routes.js';
import userRouter from './user.routes.js';
import bookTourRouter from './book_tour.routes.js';
import companyRouter from './company.routes.js';
import contactRouter from './contact.routes.js';
import dealRouter from './deal.routes.js';
import reviewRouter from './review.routes.js';
import ticketRouter from './ticket.routes.js';
import paypalRoute from './paypal.routes.js';
import categoriesRoute from './category.routes.js';
import { setHeaders } from '../middleware/common.js';

function route(app) {
    app.use(setHeaders);
    app.use('/api/blogs', blogRouter);
    app.use('/api/tours', tourRouter);
    app.use('/api/destinations', destinationRoute);
    app.use('/api/users', userRouter);
    app.use('/api/bookings', bookTourRouter);
    app.use('/api/company', companyRouter);
    app.use('/api/contacts', contactRouter);
    app.use('/api/deals', dealRouter);
    app.use('/api/reviews', reviewRouter);
    app.use('/api/tickets', ticketRouter);
    app.use('/api/paypal', paypalRoute);
    app.use('/api/categories', categoriesRoute);
    app.use('/api/auth', authRouter);
}

export default route;
