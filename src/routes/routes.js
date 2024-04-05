import { blogRouter } from './blog.js';
import { loginRouter } from './login.js';
import { destinationRoute } from './destination.js';
import { tourRouter } from './tour.js';

function route(app) {
    app.use('/blog', blogRouter);
    app.use('/tour', tourRouter);
    app.use('/destination', destinationRoute);
    app.use('/login', loginRouter);
}

export default route;
