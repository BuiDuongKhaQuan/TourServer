import express from 'express';
import { default as reviewController } from '../app/controllers/ReviewController.js';
const reviewRouter = express.Router();

reviewRouter.post('/', reviewController.create);
reviewRouter.get('/', reviewController.get_all);
reviewRouter.get('/:id', reviewController.find);
reviewRouter.put('/:id/edit', reviewController.update);
reviewRouter.delete('/:id', reviewController.delete);

export default reviewRouter;
