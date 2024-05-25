import express from 'express';
import multer from 'multer';
import destinationController from '../app/controllers/DestinationController.js';
const destinationRoute = express.Router();
const upload = multer();

destinationRoute.get('/all', destinationController.get_all);
destinationRoute.post('/:id/edit', upload.single('image'), destinationController.update);
destinationRoute.post('/', upload.single('image'), destinationController.create);

destinationRoute.get('/', destinationController.get_all_limit);
destinationRoute.get('/:id', destinationController.find);

export { destinationRoute };
