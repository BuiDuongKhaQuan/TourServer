import express from 'express';
import multer from 'multer';
import dealModel from '../../config/db/models/Deal.js';
import { filterRequestBody } from '../../utils/index.js';

const router = express.Router();
const upload = multer({ dest: 'src/uploads/' });
class TourController {
    get_limit_offset(req, res) {
        const { limit, offset } = req.params;
        let result = dealModel.get_limit_offset(req.params ? limit : 20, req.params ? offset : 0);
        result
            .then(function (value) {
                console.log(value);
                res.json(value);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    get_all(req, res) {
        let result = dealModel.get_all();
        result
            .then(function (value) {
                console.log(value);
                res.json(value);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    find(req, res) {
        let result = dealModel.find_by_id(req.params.id);
        result
            .then(function (value) {
                console.log(value);
                res.json(value);
            })
            .catch(function (error) {
                console.log(error);
                res.status(500).json({ error: error.message });
            });
    }
    create(req, res) {
        const { offer, id_tour, quantity, create_at, date_expiration } = req.body;
        const tour = {
            offer,
            id_tour,
            quantity,
            date_expiration,
            information,
            status: 1,
            create_at: new Date(),
        };
        if (!offer || !id_tour || !quantity || !create_at || !date_expiration)
            return res.status(400).json({ error: 'Missing required fields!!' });
        let result = dealModel.create(tour);
        result
            .then(function (value) {
                console.log(value);
                res.json(value);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    update(req, res) {
        const allowedFields = ['offer', 'id_tour', 'quantity', 'date_expiration', 'status'];
        const tourData = filterRequestBody(req.body, allowedFields);
        let result = dealModel.update_by_id(req.params.id, tourData);
        result
            .then(function (value) {
                console.log(value);
                res.json(value);
            })
            .catch(function (error) {
                console.log(error);
                res.status(500).json({ error: error.message });
            });
    }
    delete(req, res) {
        let result = dealModel.delete(req.params.id);
        result
            .then(function (value) {
                console.log(value);
                res.json({ message: 'Delete successful' });
            })
            .catch(function (error) {
                console.log(error);
                res.status(500).json({ error: error.message });
            });
    }
}

export default new TourController();
