import express from 'express';
import categoyModel from '../app/controllers/category.controller.js';
const categoryRoute = express.Router();

categoryRoute.get('/all', categoyModel.getAll);
categoryRoute.get('/all-size', categoyModel.getSize);
categoryRoute.post('/:id/edit', categoyModel.update);
categoryRoute.post('/', categoyModel.create);

categoryRoute.get('/', categoyModel.getLimitOffset);
categoryRoute.get('/:id', categoyModel.find);
categoryRoute.delete('/:id', categoyModel.delete);

export default destinationRoute;
