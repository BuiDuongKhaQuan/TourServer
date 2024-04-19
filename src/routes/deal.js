import express from 'express';
import { default as dealController } from '../app/controllers/DealController.js';
const dealRouter = express.Router();

dealRouter.post('/', dealController.create);
dealRouter.get('/', dealController.get_all);
dealRouter.get('/:id', dealController.find);
dealRouter.put('/:id/edit', dealController.update);
dealRouter.delete('/:id', dealController.delete);

export { dealRouter };
