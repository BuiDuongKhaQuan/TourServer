import express from 'express';
import { default as ticketController } from '../app/controllers/ticket.controller.js';
import { authJwt } from '../middleware/index.js';

const ticketRouter = express.Router();

ticketRouter.get('/all', ticketController.getAll);
ticketRouter.get('/all-size', ticketController.getSize);
ticketRouter.put('/:id/edit', [authJwt.verifyToken, authJwt.isAdmin], ticketController.update);
ticketRouter.post('/', [authJwt.verifyToken, authJwt.isAdmin], authJwt.verifyToken, ticketController.create);
ticketRouter.get('/', ticketController.getLimitOffset);
ticketRouter.get('/:id', ticketController.find);
ticketRouter.delete('/:id', [authJwt.verifyToken, authJwt.isAdmin], ticketController.delete);

export default ticketRouter;
