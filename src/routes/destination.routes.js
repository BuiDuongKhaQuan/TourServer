import express from 'express';
import multer from 'multer';
import destinationController from '../app/controllers/destination.controller.js';
const destinationRoute = express.Router();
const upload = multer();

destinationRoute.get('/all', destinationController.getAll);
destinationRoute.get('/all-size', destinationController.getSize);
destinationRoute.put('/:id/edit', upload.single('image'), destinationController.update);
destinationRoute.post('/', upload.single('image'), destinationController.create);

destinationRoute.get('/', destinationController.getLimitOffset);
destinationRoute.get('/:id', destinationController.find);
destinationRoute.delete('/:id', destinationController.delete);

export default destinationRoute;
