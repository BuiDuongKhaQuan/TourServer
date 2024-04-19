import express from 'express';
import { default as destinationController } from '../app/controllers/DestinationController.js';
const destinationRoute = express.Router();

destinationRoute.post('/', destinationController.create);
destinationRoute.get('/', destinationController.get_all);
destinationRoute.get('/:id', destinationController.find);
destinationRoute.put('/:id/edit', destinationController.update);
destinationRoute.delete('/:id', destinationController.delete);

export { destinationRoute };
