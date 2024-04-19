import { blogRouter } from './blog.js';
import { destinationRoute } from './destination.js';
import { tourRouter } from './tour.js';
import { userRouter } from './user.js';
import { bookTourRouter } from './book_tour.js';
import { companyRouter } from './company.js';
import { contactRouter } from './contact.js';
import { dealRouter } from './deal.js';
import { reviewRouter } from './review.js';
import { ticketRouter } from './ticket.js';

function route(app) {
    app.use('/blogs', blogRouter);
    app.use('/tours', tourRouter);
    app.use('/destinations', destinationRoute);
    app.use('/users', userRouter);
    app.use('/book', bookTourRouter);
    app.use('/company', companyRouter);
    app.use('/contact', contactRouter);
    app.use('/deal', dealRouter);
    app.use('/review', reviewRouter);
    app.use('/ticket', ticketRouter);
}

export default route;
