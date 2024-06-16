import paypalController from '../app/controllers/paypal.controller.js';
import express from 'express';
import { authJwt } from '../middleware/index.js';

const paypalRoute = express.Router();

paypalRoute.post('/orders', authJwt.verifyToken, paypalController.orders);
paypalRoute.post('/orders/:orderID/capture', authJwt.verifyToken, paypalController.capture);
paypalRoute.post('/orders/sendMail', paypalController.sendMailInforOrder);

export default paypalRoute;
