import { captureOrder, createOrder } from '../../utils/paypal.js';
import { sendEmail } from '../../utils/sendEmails.js';
import { convertVNDToUSD } from '../../utils/index.js';
import { htmlOrder } from '../../utils/htmlMail.js';
import { db } from '../models/index.js';

const BookTourModel = db.bookTour;
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
            await BookTourModel.updateById(tourBookedId, { checkoutStatus: 2, paymentMethod: 1 });
            await sendEmail({
                to: email,
                subject: 'Payment Confirmation',
                message: htmlOrder(orderData),
            });

            res.status(200).json({ message: 'Email sent successfully.' });
        } catch (error) {
            console.error('Failed to send email:', error);
            res.status(500).json({ error: 'Failed to send email.' });
        }
    }
}
export default new PaypalController();
