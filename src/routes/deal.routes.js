import express from 'express';
import { default as dealController } from '../app/controllers/deal.controller.js';
const dealRouter = express.Router();

dealRouter.get('/all', dealController.getAll);
dealRouter.get('/all-size', dealController.getSize);
dealRouter.put('/:id/edit', dealController.update);
dealRouter.post('/', dealController.create);

dealRouter.get('/', dealController.getLimitOffset);
dealRouter.get('/:id', dealController.find);
dealRouter.delete('/:id', dealController.delete);

export default dealRouter;
