import { filterRequestBody } from '../../utils/index.js';
import { db } from '../models/index.js';

const BookTour = db.bookTour;

class BookTourController {
    async getAll(req, res) {
        try {
            const bookTours = await BookTour.findAllBookTour();
            if (!bookTours) return res.status(401).json({ error: 'Tours does not exist!' });
            return res.json({ message: 'Get all successful!', data: bookTours });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async getSize(req, res) {
        try {
            const size = await BookTour.getSize();
            return res.json({ message: 'Get size successful!', data: size });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async find(req, res) {
        const { id } = req.params;
        try {
            const bookTour = await BookTour.findByIdWithDetails(id);
            if (!bookTour) return res.status(401).json({ error: 'Tour does not exist!' });
            return res.json({ message: 'Find successful!', data: bookTour });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async getLimitOffset(req, res) {
        const { start, page } = req.query;
        try {
            const bookTours = await BookTour.getLimitOffset(Number(page), Number(start));
            if (!bookTours) return res.status(401).json({ error: 'BookTours does not exist!' });
            return res.json({ message: 'Find successful!', data: bookTours });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }

    async getBookTourByStatus(req, res) {
        const { userId, status } = req.query;
        try {
            let bookings = await BookTour.findAllByConditions(
                {
                    userId,
                    status,
                },
                false,
            );
            if (!bookings || bookings.length === 0) {
                return res.json({ message: 'No bookings found', data: [] });
            }
            res.json({ message: 'Get watting sucessfully', data: bookings });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async create(req, res) {
        try {
            const {
                userId,
                tourId,
                name,
                email,
                phone,
                ticketId,
                adultQuantity,
                childQuantity,
                date,
                totalPrice,
                message,
            } = req.body;
            console.log(req.body);
            const bookTour = {
                userId,
                tourId,
                name,
                email,
                phone,
                ticketId,
                adultQuantity,
                childQuantity,
                date,
                status: 1,
                totalPrice,
                checkoutStatus: 1,
                message,
            };
            if (
                !userId ||
                !tourId ||
                !name ||
                !email ||
                !phone ||
                !ticketId ||
                !adultQuantity ||
                !childQuantity ||
                !date ||
                !totalPrice ||
                !message
            )
                return res.status(400).json({ error: 'Missing required fields!!' });
            const bookNew = await BookTour.create(bookTour);
            const book = await BookTour.findByIdWithDetails(bookNew.dataValues.id);
            res.json({ message: 'Create successfully!', data: book });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const allowedFields = [
                'userId',
                'tourId',
                'name',
                'email',
                'phone',
                'ticketId',
                'adultQuantity',
                'childQuantity',
                'date',
                'status',
                'totalPrice',
                'checkoutStatus',
                'paymentMethod',
                'message',
            ];
            const bookTourData = filterRequestBody(req.body, allowedFields);
            await BookTour.updateById(id, bookTourData);
            const bookings = await BookTour.findByIdWithDetails(id);
            res.json({ message: 'Update sucessfully', data: bookings });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
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
