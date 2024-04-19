import express from 'express';
import { default as bookTourController } from '../app/controllers/Book-TourController.js';
const bookTourRouter = express.Router();

bookTourRouter.post('/', bookTourController.create);
bookTourRouter.get('/', bookTourController.get_all);
bookTourRouter.get('/:id', bookTourController.find);
bookTourRouter.put('/:id/edit', bookTourController.update);
bookTourRouter.delete('/:id', bookTourController.delete);

export { bookTourRouter };
