import express from 'express';
import { default as ticketController } from '../app/controllers/TicketController.js';
const ticketRouter = express.Router();

ticketRouter.post('/', ticketController.create);
ticketRouter.get('/', ticketController.get_all);
ticketRouter.get('/:id', ticketController.find);
ticketRouter.put('/:id/edit', ticketController.update);
ticketRouter.delete('/:id', ticketController.delete);

export { ticketRouter };
