import paypalController from '../app/controllers/paypal.controller.js';
import express from 'express';
const paypalRoute = express.Router();

paypalRoute.post('/orders', paypalController.orders);
paypalRoute.post('/orders/:orderID/capture', paypalController.capture);
paypalRoute.post('/orders/sendMail', paypalController.sendMailInforOrder);

export default paypalRoute;
