import { captureOrder, createOrder } from '../../utils/paypal.js';
import { sendEmail } from '../../utils/sendEmails.js';
import bookTourModel from '../../config/db/models/Book-tour.js';
import { convertVNDToUSD } from '../../utils/index.js';

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
                message: `
                    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                    <h1 style="color: #4CAF50;">Xác nhận thanh toán</h1>
                    <p>Cảm ơn bạn đã mua hàng, <strong>${orderData.payer.name.given_name} ${orderData.payer.name.surname}</strong>.</p>
                    
                    <h2 style="color: #555;">Chi tiết thanh toán</h2>
                    <p><strong>ID giao dịch:</strong> ${orderData.id}</p>
                    <p><strong>Trạng thái:</strong> ${orderData.status}</p>
                    <p><strong>Số tiền:</strong> ${orderData.purchase_units[0].payments.captures[0].amount.currency_code} ${orderData.purchase_units[0].payments.captures[0].amount.value}</p>
                    
                    <h2 style="color: #555;">Địa chỉ giao hàng</h2>
                    <p><strong>Tên:</strong> ${orderData.purchase_units[0].shipping.name.full_name}</p>
                    <p><strong>Địa chỉ:</strong> ${orderData.purchase_units[0].shipping.address.address_line_1}, ${orderData.purchase_units[0].shipping.address.admin_area_2}, ${orderData.purchase_units[0].shipping.address.admin_area_1}, ${orderData.purchase_units[0].shipping.address.postal_code}</p>
                    <p><strong>Quốc gia:</strong> ${orderData.purchase_units[0].shipping.address.country_code}</p>
                </div>
                `,
            });

            res.status(200).json({ message: 'Email sent successfully.' });
        } catch (error) {
            console.error('Failed to send email:', error);
            res.status(500).json({ error: 'Failed to send email.' });
        }
    }
}
export default new PaypalController();
