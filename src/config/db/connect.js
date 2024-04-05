import mysql from 'mysql';
import dotenv from 'dotenv';
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    port: process.env.DB_POST,
});

connection.connect((err) => {
    if (err) {
        console.error('Lỗi kết nối:', err);
        return;
    }
    console.log('Kết nối thành công!');
});

export { connection };
