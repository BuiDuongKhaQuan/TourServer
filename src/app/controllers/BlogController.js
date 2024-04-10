import express from 'express';
import multer from 'multer';
import BlogModel from '../../config/db/models/Blog.js';

const router = express.Router();
const upload = multer({ dest: 'src/uploads/' });
class BlogController {
    index(req, res) {
        res.render('home');
    }
    show(req, res) {
        res.send('Bui Duong Kha Quan');
    }
    async get(req, res) {
        let result = BlogModel.get_all();
        result
            .then(function (value) {
                console.log(value);
                res.json(value);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

export default new BlogController();
