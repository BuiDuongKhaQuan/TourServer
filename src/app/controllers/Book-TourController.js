import express from 'express';
import multer from 'multer';
import bookTourModel from '../../config/db/models/Book-tour.js';
import { filterRequestBody } from '../../utils/index.js';

const router = express.Router();
const upload = multer({ dest: 'src/uploads/' });
class BookTourController {
    get_limit_offset(req, res) {
        const { limit, offset } = req.params;
        let result = bookTourModel.get_limit_offset(req.params ? limit : 20, req.params ? offset : 0);
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
        let result = bookTourModel.get_all();
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
        let result = bookTourModel.find_by_id(req.params.id);
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
        const { id_user, id_tour, name, email, phone, id_ticket, person_quantity, child_quantity, date, message } =
            req.body;
        const bookTour = {
            id_user,
            id_tour,
            name,
            email,
            phone,
            id_ticket,
            person_quantity,
            child_quantity,
            date,
            message,
            status: 1,
            create_at: new email(),
        };
        if (
            !id_user ||
            !id_tour ||
            !name ||
            !email ||
            !phone ||
            !id_ticket ||
            !person_quantity ||
            !child_quantity ||
            !date ||
            !message
        )
            return res.status(400).json({ error: 'Missing required fields!!' });
        let result = bookTourModel.create(bookTour);
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
        const allowedFields = [
            'id_user',
            'id_tour',
            'name',
            'email',
            'phone',
            'id_ticket',
            'person_quantity',
            'child_quantity',
            'date',
            'message',
            'status',
        ];
        const bookTourData = filterRequestBody(req.body, allowedFields);
        let result = bookTourModel.update_by_id(req.params.id, bookTourData);
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
        let result = bookTourModel.delete(req.params.id);
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

export default new BookTourController();
