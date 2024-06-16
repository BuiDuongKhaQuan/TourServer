import express from 'express';
import dealController from '../app/controllers/deal.controller.js';
import { authJwt } from '../middleware/index.js';
const dealRouter = express.Router();

dealRouter.get('/all', dealController.getAll);
dealRouter.get('/all-size', dealController.getSize);
dealRouter.get('/expiry-date', dealController.findAllByExpiryDate);
dealRouter.put('/:id/edit', [authJwt.verifyToken, authJwt.isAdmin], dealController.update);
dealRouter.post('/', [authJwt.verifyToken, authJwt.isAdmin], dealController.create);
dealRouter.get('/', dealController.getLimitOffset);
dealRouter.get('/:id', dealController.find);
dealRouter.delete('/:id', [authJwt.verifyToken, authJwt.isAdmin], dealController.delete);

export default dealRouter;
