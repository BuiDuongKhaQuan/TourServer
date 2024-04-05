import express from 'express';
import { default as destinationController } from '../app/controllers/DestinationController.js';
const destinationRoute = express.Router();

destinationRoute.use('/:slug', destinationController.show);
destinationRoute.use('/', destinationController.index);

export { destinationRoute };
