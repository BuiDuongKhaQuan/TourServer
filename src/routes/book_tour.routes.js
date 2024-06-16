import express from 'express';
import bookTourController from '../app/controllers/bookTour.controller.js';
import { authJwt } from '../middleware/index.js';
const bookTourRouter = express.Router();

bookTourRouter.get('/', [authJwt.verifyToken], bookTourController.getBookTourByStatus);
bookTourRouter.get('/all', [authJwt.verifyToken, authJwt.isAdmin], bookTourController.getAll);
bookTourRouter.get('/:id', [authJwt.verifyToken], bookTourController.find);
bookTourRouter.put('/:id/edit', [authJwt.verifyToken, authJwt.isAdmin], bookTourController.update);
bookTourRouter.post('/', [authJwt.verifyToken], bookTourController.create);

export default bookTourRouter;
