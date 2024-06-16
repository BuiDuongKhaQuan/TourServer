import express from 'express';
import contactController from '../app/controllers/contact.controller.js';
import { authJwt } from '../middleware/index.js';

const contactRouter = express.Router();

contactRouter.get('/all', [authJwt.verifyToken, authJwt.isAdmin], contactController.getAll);
contactRouter.get('/all-size', [authJwt.verifyToken, authJwt.isAdmin], contactController.getSize);
contactRouter.put('/:id/edit', [authJwt.verifyToken, authJwt.isAdmin], contactController.update);
contactRouter.put('/:id/answer', [authJwt.verifyToken, authJwt.isAdmin], contactController.answer);
contactRouter.post('/', authJwt.verifyToken, contactController.create);
contactRouter.get('/', contactController.getLimitOffset);
contactRouter.get('/:id', contactController.find);
contactRouter.delete('/:id', [authJwt.verifyToken, authJwt.isAdmin], contactController.delete);

export default contactRouter;
