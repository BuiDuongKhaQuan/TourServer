import express from 'express';
import reviewController from '../app/controllers/review.controller.js';
import { authJwt } from '../middleware/index.js';

const reviewRouter = express.Router();

reviewRouter.get('/', reviewController.findAllByTourId);
reviewRouter.get('/all', reviewController.getAll);
reviewRouter.get('/all-size', reviewController.getSize);
reviewRouter.put('/:id/edit', authJwt.verifyToken, reviewController.update);
reviewRouter.post('/', authJwt.verifyToken, reviewController.create);
reviewRouter.get('/pagination', reviewController.getLimitOffset); // Sửa để tránh trùng lặp route với findAllByTourId
reviewRouter.get('/:id', reviewController.find);
reviewRouter.delete('/:id', [authJwt.verifyToken, authJwt.isAdmin], reviewController.delete);

export default reviewRouter;
