import express from 'express';
import { default as companyController } from '../app/controllers/CompanyController.js';
const companyRouter = express.Router();

companyRouter.get('/', companyController.get_all);
companyRouter.get('/:id', companyController.find);
companyRouter.put('/:id/edit', companyController.update);

export default companyRouter;
