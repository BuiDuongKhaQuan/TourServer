import express from 'express';
import reviewController from '../app/controllers/review.controller.js';
const reviewRouter = express.Router();

reviewRouter.get('/', reviewController.findAllByTourId);
reviewRouter.get('/all', reviewController.getAll);
reviewRouter.get('/all-size', reviewController.getSize);
reviewRouter.put('/:id/edit', reviewController.update);
reviewRouter.post('/', reviewController.create);

reviewRouter.get('/', reviewController.getLimitOffset);
reviewRouter.get('/:id', reviewController.find);
reviewRouter.delete('/:id', reviewController.delete);

export default reviewRouter;
