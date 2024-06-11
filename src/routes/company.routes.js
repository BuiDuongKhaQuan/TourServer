import express from 'express';
import multer from 'multer';
import companyController from '../app/controllers/company.controller.js';
const companyRouter = express.Router();
const upload = multer();

companyRouter.get('/all', companyController.getAll);
companyRouter.get('/all-size', companyController.getSize);
companyRouter.put('/:id/edit', upload.single('logo'), companyController.update);
companyRouter.get('/:id', companyController.find);

export default companyRouter;
