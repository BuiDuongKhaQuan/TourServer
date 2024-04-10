import morgan from 'morgan';
import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/routes.js';
import session from 'express-session';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3000;

//Static
app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('combined'));

// Template engine
app.engine('hbs', engine({ extname: 'hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: 'buiduongkhaquan',
        resave: true,
        saveUninitialized: true,
    }),
);

routes(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
