import { blogRouter } from './blog.js';
import { loginRouter } from './login.js';
import { destinationRoute } from './destination.js';
import { tourRouter } from './tour.js';
import { userRouter } from './user.js';

function route(app) {
    app.use('/blog', blogRouter);
    app.use('/tour', tourRouter);
    app.use('/destination', destinationRoute);
    app.use('/login', loginRouter);
    app.get('/users', userRouter);
}

export default route;
