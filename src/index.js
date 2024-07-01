import morgan from 'morgan';
import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/routes.js';
import session from 'express-session';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import { db } from './app/models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3001;
const server = http.createServer(app);
const socketIo = new SocketIOServer(server, {
    cors: {
        origin: process.env.ORIGIN || 'http://localhost:3000',
        credentials: true, //access-control-allow-credentials:true
        optionSuccessStatus: 200,
    },
});
app.use(
    cors({
        origin: process.env.ORIGIN || 'http://localhost:3000',
        credentials: true, //access-control-allow-credentials:true
        optionSuccessStatus: 200,
    }),
);

// import { db } from './app/models/index.js';
// db.sequelize.sync({ force: true }).then(() => {
//     console.log('Drop and Resync Db');
// });

//Static
app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('combined'));

// Template engine
app.engine('hbs', engine({ extname: 'hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(
    session({
        secret: 'q',
        resave: true,
        saveUninitialized: true,
        cookie: { secure: false },
        store: new session.MemoryStore(),
    }),
);

socketIo.on('connection', async (socket) => {
    const Review = db.review; ///Handle khi có connect từ client tới
    console.log('New client connected' + socket.id);

    const reviews = await Review.findAllReview();
    console.log('Reviews', reviews);
    socket.emit('initialData', reviews);

    socket.on('sendDataClient', async (data) => {
        // Save new review to database
        const newReview = await Review.create(data);
        const updatedReviews = await Review.findAllReview();

        // Emit updated reviews to all clients
        socketIo.emit('sendDataServer', updatedReviews);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

routes(app);

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
