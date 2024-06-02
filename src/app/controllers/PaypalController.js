import { captureOrder, createOrder } from '../../utils/paypal.js';
import { sendEmail } from '../../utils/sendEmails.js';
import bookTourModel from '../../config/db/models/Book-tour.js';
import { convertVNDToUSD } from '../../utils/index.js';
import { html } from '../../utils/htmlMail.js';

class PaypalController {
    async capture(req, res) {
        try {
            const { orderID } = req.params;
            const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
            res.status(httpStatusCode).json(jsonResponse);
        } catch (error) {
            console.error('Failed to create order:', error);
            res.status(500).json({ error: 'Failed to capture order.' });
        }
    }
    async orders(req, res) {
        try {
            const { cart, price } = req.body;
            const priceLastConvert = await convertVNDToUSD(price);
            console.log(`${priceLastConvert}`);
            const { jsonResponse, httpStatusCode } = await createOrder(cart, `${priceLastConvert.toFixed(2)}`);
            res.status(httpStatusCode).json(jsonResponse);
        } catch (error) {
            console.error('Failed to create order:', error);
            res.status(500).json({ error: 'Failed to create order.' });
        }
    }
    async sendMailInforOrder(req, res) {
        try {
            const { orderData, email, tourBookedId } = req.body;
            await bookTourModel.update_by_id(tourBookedId, { checkout_status: 1 });
            await sendEmail({
                to: email, // receiver's email address
                subject: 'Payment Confirmation',
                message: html(orderData),
            });

            res.status(200).json({ message: 'Email sent successfully.' });
        } catch (error) {
            console.error('Failed to send email:', error);
            res.status(500).json({ error: 'Failed to send email.' });
        }
    }
}
export default new PaypalController();
