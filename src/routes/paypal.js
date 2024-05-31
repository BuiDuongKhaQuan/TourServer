import paypalController from '../app/controllers/PaypalController.js';
import express from 'express';
const paypalRoute = express.Router();

paypalRoute.post('/orders', paypalController.orders);
paypalRoute.post('/orders/:orderID/capture', paypalController.capture);
paypalRoute.post('/orders/sendMail', paypalController.sendMailInforOrder);

export { paypalRoute };
