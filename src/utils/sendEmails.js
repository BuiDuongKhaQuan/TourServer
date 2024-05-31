import nodeMailer from 'nodemailer';

const sendEmail = async (options) => {
    const transporter = nodeMailer.createTransport({
        host: process.env.SMPT_HOST,
        port: process.env.SMPT_PORT,
        secureConnection: false,
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_APP_PASS,
        },
        authMethod: 'LOGIN',
    });

    const mailOptions = {
        from: `Travel ${process.env.SMPT_MAIL}`,
        to: options.to,
        subject: options.subject,
        html: options.message,
    };

    await transporter.sendMail(mailOptions);
};

export { sendEmail };
