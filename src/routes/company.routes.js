import express from 'express';
import multer from 'multer';
import companyController from '../app/controllers/company.controller.js';
import { authJwt } from '../middleware/index.js';

const companyRouter = express.Router();
const upload = multer();

companyRouter.get('/all', [authJwt.verifyToken, authJwt.isAdmin], companyController.getAll);
companyRouter.get('/all-size', [authJwt.verifyToken, authJwt.isAdmin], companyController.getSize);
companyRouter.put('/:id/edit', [authJwt.verifyToken, authJwt.isAdmin, upload.single('logo')], companyController.update);
companyRouter.get('/:id', companyController.find);

export default companyRouter;
