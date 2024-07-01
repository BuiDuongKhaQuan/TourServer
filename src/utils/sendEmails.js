import nodeMailer from 'nodemailer';

const SMPT_HOST = 'smtp.gmail.com';
const SMPT_PORT = 587;
const SMPT_MAIL = 'khaquan9a2.2016@gmail.com';
const SMPT_APP_PASS = 'ivmz lwjl cgrg tfod';

const sendEmail = async (options) => {
    const transporter = nodeMailer.createTransport({
        host: SMPT_HOST,
        port: SMPT_PORT,
        secureConnection: false,
        auth: {
            user: SMPT_MAIL,
            pass: SMPT_APP_PASS,
        },
        authMethod: 'LOGIN',
    });

    const mailOptions = {
        from: `Travel ${SMPT_MAIL}`,
        to: options.to,
        subject: options.subject,
        html: options.message,
    };

    await transporter.sendMail(mailOptions);
};

export { sendEmail };
