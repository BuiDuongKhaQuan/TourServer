import morgan from 'morgan';
import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/routes.js';
import session from 'express-session';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3000;

app.use(
    cors({
        origin: 'http://localhost:2908',
        credentials: true, //access-control-allow-credentials:true
        optionSuccessStatus: 200,
    }),
);
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

routes(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
