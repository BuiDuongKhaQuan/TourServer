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
    app.use('/blogs', blogRouter);
    app.use('/tours', tourRouter);
    app.use('/destinations', destinationRoute);
    app.use('/users', userRouter);
    app.use('/bookings', bookTourRouter);
    app.use('/company', companyRouter);
    app.use('/contacts', contactRouter);
    app.use('/deals', dealRouter);
    app.use('/reviews', reviewRouter);
    app.use('/tickets', ticketRouter);
    app.use('/paypal', paypalRoute);
    app.use('/categories', categoriesRoute);
    app.use('/auth', authRouter);
}

export default route;
