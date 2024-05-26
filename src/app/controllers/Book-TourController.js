import bookTourModel from '../../config/db/models/Book-tour.js';
import { filterRequestBody } from '../../utils/index.js';

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
        const { id } = req.params;
        let result = bookTourModel.find_by_id(id);
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
            checkout_status: 0,
            create_at: new Date(),
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
        const { id } = req.params;
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
        ];
        const bookTourData = filterRequestBody(req.body, allowedFields);
        let result = bookTourModel.update_by_id(id, bookTourData);
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
        const { id } = req.params;
        let result = bookTourModel.delete(id);
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
