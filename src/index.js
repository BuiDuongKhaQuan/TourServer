import morgan from 'morgan';
import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3000;

//Static
app.use(express.static(path.join(__dirname, 'public')));

const connection = mysql.createConnection({
    host: 'localhost', // Thay đổi tùy theo host MySQL của bạn
    user: 'root', // Thay đổi tùy theo tên người dùng MySQL của bạn
    database: 'tour', // Thay đổi tùy theo tên cơ sở dữ liệu bạn muốn kết nối
});
connection.connect((err) => {
    if (err) {
        console.error('Lỗi kết nối:', err);
        return;
    }
    console.log('Kết nối thành công!');
});
connection.query('SELECT * FROM user', (err, rows) => {
    if (err) {
        console.error('Lỗi truy vấn:', err);
        return;
    }
    console.log('Dữ liệu từ truy vấn:', rows);
});
connection.query('SELECT * FROM blog', (err, rows) => {
    if (err) {
        console.error('Lỗi truy vấn:', err);
        return;
    }
    console.log('Dữ liệu từ truy vấn:', rows);
});
connection.query('SELECT * FROM book_tour', (err, rows) => {
    if (err) {
        console.error('Lỗi truy vấn:', err);
        return;
    }
    console.log('Dữ liệu từ truy vấn:', rows);
});
connection.query('SELECT * FROM company', (err, rows) => {
    if (err) {
        console.error('Lỗi truy vấn:', err);
        return;
    }
    console.log('Dữ liệu từ truy vấn:', rows);
});
connection.query('SELECT * FROM contact', (err, rows) => {
    if (err) {
        console.error('Lỗi truy vấn:', err);
        return;
    }
    console.log('Dữ liệu từ truy vấn:', rows);
});
connection.query('SELECT * FROM deals', (err, rows) => {
    if (err) {
        console.error('Lỗi truy vấn:', err);
        return;
    }
    console.log('Dữ liệu từ truy vấn:', rows);
});
connection.query('SELECT * FROM destination', (err, rows) => {
    if (err) {
        console.error('Lỗi truy vấn:', err);
        return;
    }
    console.log('Dữ liệu từ truy vấn:', rows);
});
connection.query('SELECT * FROM review', (err, rows) => {
    if (err) {
        console.error('Lỗi truy vấn:', err);
        return;
    }
    console.log('Dữ liệu từ truy vấn:', rows);
});
connection.query('SELECT * FROM ticket', (err, rows) => {
    if (err) {
        console.error('Lỗi truy vấn:', err);
        return;
    }
    console.log('Dữ liệu từ truy vấn:', rows);
});
connection.query('SELECT * FROM tour', (err, rows) => {
    if (err) {
        console.error('Lỗi truy vấn:', err);
        return;
    }
    console.log('Dữ liệu từ truy vấn:', rows);
});
connection.end();
// HTTP logger

app.use(morgan('combined'));

// Template engine
app.engine('hbs', engine({ extname: 'hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));

app.get('/ti', (req, res) => {
    res.render('home');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
