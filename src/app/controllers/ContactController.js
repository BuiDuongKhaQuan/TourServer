import express from 'express';
import multer from 'multer';
import contactModel from '../../config/db/models/Contact.js';
import { filterRequestBody } from '../../utils/index.js';

const router = express.Router();
const upload = multer({ dest: 'src/uploads/' });
class TourController {
    get_limit_offset(req, res) {
        const { limit, offset } = req.params;
        let result = contactModel.get_limit_offset(req.params ? limit : 20, req.params ? offset : 0);
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
        let result = contactModel.get_all();
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
        let result = contactModel.find_by_id(req.params.id);
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
        const { name, email, phone, topic, message } = req.body;
        const tour = {
            name,
            email,
            phone,
            topic,
            message,
            status: 1,
            create_at: new Date(),
        };
        if (!name || !email || !phone || !topic || !message)
            return res.status(400).json({ error: 'Missing required fields!!' });
        let result = contactModel.create(tour);
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
        const allowedFields = ['name', 'email', 'phone', 'topic', 'message', 'status'];
        const tourData = filterRequestBody(req.body, allowedFields);
        let result = contactModel.update_by_id(req.params.id, tourData);
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
        let result = contactModel.delete(req.params.id);
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
