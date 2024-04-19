import express from 'express';
import { default as contactController } from '../app/controllers/ContactController.js';
const contactRouter = express.Router();

contactRouter.post('/', contactController.create);
contactRouter.get('/', contactController.get_all);
contactRouter.get('/:id', contactController.find);
contactRouter.put('/:id/edit', contactController.update);
contactRouter.delete('/:id', contactController.delete);

export { contactRouter };
