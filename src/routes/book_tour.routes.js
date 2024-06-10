import express from 'express';
import bookTourController from '../app/controllers/bookTour.controller.js';
const bookTourRouter = express.Router();

bookTourRouter.get('/all', bookTourController.getAll);
bookTourRouter.get('/:id', bookTourController.find);
// bookTourRouter.get('/all-size', bookTourController.get_all_size);
bookTourRouter.get('/', bookTourController.getBookTourByStatus);
bookTourRouter.post('/:id/edit', bookTourController.update);
bookTourRouter.post('/', bookTourController.create);

// bookTourRouter.get('/', bookTourController.get_all_limit);

export default bookTourRouter;
