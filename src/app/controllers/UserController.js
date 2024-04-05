import express from 'express';
import multer from 'multer';
import UserModel from '../models/User.js';

const router = express.Router();
const upload = multer({ dest: 'src/uploads/' });

class UserController {
    index(req, res) {
        res.render('home');
    }
    show(req, res) {
        res.send('Bui Duong Kha Quan');
    }
    async get(req, res) {
        let result = UserModel.get_all();
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

export default new UserController();
