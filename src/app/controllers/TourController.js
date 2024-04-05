import express from 'express';
import multer from 'multer';
import TourModel from '../models/Tour.js';

const router = express.Router();
const upload = multer({ dest: 'src/uploads/' });
class TourController {
    index(req, res) {
        res.render('tour');
    }
    show(req, res) {
        res.send('Bui Duong Kha Quan tour');
    }
    async get(req, res) {
        let result = TourModel.get_all();
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

export default new TourController();
