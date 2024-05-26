import express from 'express';
import bookTourController from '../app/controllers/Book-TourController.js';
const bookTourRouter = express.Router();

bookTourRouter.get('/all', bookTourController.get_all);
// bookTourRouter.get('/all-size', bookTourController.get_all_size);
bookTourRouter.post('/:id/edit', bookTourController.update);
bookTourRouter.post('/', bookTourController.create);

// bookTourRouter.get('/', bookTourController.get_all_limit);
bookTourRouter.get('/:id', bookTourController.find);

export { bookTourRouter };
