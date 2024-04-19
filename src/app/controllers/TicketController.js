import express from 'express';
import multer from 'multer';
import ticketModel from '../../config/db/models/Ticket_.js';
import { filterRequestBody } from '../../utils/index.js';

const router = express.Router();
const upload = multer({ dest: 'src/uploads/' });
class TourController {
    get_limit_offset(req, res) {
        const { limit, offset } = req.params;
        let result = ticketModel.get_limit_offset(req.params ? limit : 20, req.params ? offset : 0);
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
        let result = ticketModel.get_all();
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
        let result = ticketModel.find_by_id(req.params.id);
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
        const { type } = req.body;
        const tour = {
            type,
            status: 1,
            create_at: new Date(),
        };
        if (!type) return res.status(400).json({ error: 'Missing required fields!!' });
        let result = ticketModel.create(tour);
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
        const allowedFields = ['type', 'status'];
        const tourData = filterRequestBody(req.body, allowedFields);
        let result = ticketModel.update_by_id(req.params.id, tourData);
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
        let result = ticketModel.delete(req.params.id);
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
