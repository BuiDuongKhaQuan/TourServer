import express from 'express';
import multer from 'multer';
import destinationController from '../app/controllers/destination.controller.js';
import { authJwt } from '../middleware/index.js';

const destinationRoute = express.Router();
const upload = multer();

destinationRoute.get('/all', destinationController.getAll);
destinationRoute.get('/all-size', destinationController.getSize);
destinationRoute.post('/search', destinationController.search);
destinationRoute.put(
    '/:id/edit',
    [authJwt.verifyToken, authJwt.isAdmin, upload.single('image')],
    destinationController.update,
);
destinationRoute.post(
    '/',
    [authJwt.verifyToken, authJwt.isAdmin, upload.single('image')],
    destinationController.create,
);
destinationRoute.get('/', destinationController.getLimitOffset);
destinationRoute.get('/:id', destinationController.find);
destinationRoute.delete('/:id', [authJwt.verifyToken, authJwt.isAdmin], destinationController.delete);

export default destinationRoute;
