import express from 'express';
import contactController from '../app/controllers/contact.controller.js';
const contactRouter = express.Router();

contactRouter.get('/all', contactController.getAll);
contactRouter.get('/all-size', contactController.getSize);
contactRouter.put('/:id/edit', contactController.update);
contactRouter.put('/:id/answer', contactController.answer);
contactRouter.post('/', contactController.create);

contactRouter.get('/', contactController.getLimitOffset);
contactRouter.get('/:id', contactController.find);
contactRouter.delete('/:id', contactController.delete);

export default contactRouter;
