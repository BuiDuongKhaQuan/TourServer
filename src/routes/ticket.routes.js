import express from 'express';
import { default as ticketController } from '../app/controllers/ticket.controller.js';

const ticketRouter = express.Router();

ticketRouter.get('/all', ticketController.getAll);
ticketRouter.get('/all-size', ticketController.getSize);
ticketRouter.put('/:id/edit', ticketController.update);
ticketRouter.post('/', ticketController.create);

ticketRouter.get('/', ticketController.getLimitOffset);
ticketRouter.get('/:id', ticketController.find);
ticketRouter.delete('/:id', ticketController.delete);

export default ticketRouter;
