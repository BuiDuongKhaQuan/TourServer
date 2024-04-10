import express from 'express';
import multer from 'multer';
import DestinationModel from '../../config/db/models/Destination.js';

const router = express.Router();
const upload = multer({ dest: 'src/uploads/' });
class DestinationController {
    index(req, res) {
        res.render('login');
    }
    show(req, res) {
        res.send('Bui Duong Kha Quan login');
    }
    async get(req, res) {
        let result = DestinationModel.get_all();
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

export default new DestinationController();
