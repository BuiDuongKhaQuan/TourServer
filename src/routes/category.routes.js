import express from 'express';
import categoryModel from '../app/controllers/category.controller.js';
import { authJwt } from '../middleware/index.js';
const categoryRoute = express.Router();

categoryRoute.get('/all', categoryModel.getAll);
categoryRoute.get('/all-size', categoryModel.getSize);
categoryRoute.post('/:id/edit', [authJwt.verifyToken, authJwt.isAdmin], categoryModel.update);
categoryRoute.post('/', [authJwt.verifyToken, authJwt.isAdmin], categoryModel.create);
categoryRoute.get('/', categoryModel.getLimitOffset);
categoryRoute.get('/:id', categoryModel.find);
categoryRoute.delete('/:id', [authJwt.verifyToken, authJwt.isAdmin], categoryModel.delete);

export default categoryRoute;
