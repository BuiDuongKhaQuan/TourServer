import express from 'express';
import multer from 'multer';
import UserModel from '../../config/db/models/User.js';
import bcrypt from 'bcrypt';
import { filterRequestBody, generateOTP } from '../../utils/index.js';
import { sendEmail } from '../../utils/sendEmails.js';
const upload = multer({ dest: 'src/uploads/' });
const router = express.Router();

class UserController {
    get_all(req, res) {
        let result = UserModel.get_all();
        result
            .then(function (value) {
                console.log(value);
                res.json(value);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    login(req, res) {
        const { email, password } = req.body;
        const user = UserModel.find('email', email);
        user.then(async (user) => {
            const validPassword = await bcrypt.compare(password, user.password);
            if (validPassword) {
                req.session.login = true;
                req.session.email = email;
                console.log(req.session);
                res.json({ message: 'Login successful!', user });
            } else {
                res.status(400).json({ error: 'Password incorrect!' });
            }
        }).catch((error) => {
            console.log(error);
            res.status(401).json({ error: 'Email not exit!' });
        });
    }
    register(req, res) {
        const { name, password, email } = req.body;
        if (!name || !password || !email)
            return res.status(400).json({ error: 'Missing required fields: name, password, email' });
        UserModel.find('email', email)
            .then((existingUser) => {
                if (existingUser) {
                    res.status(409).json({ error: 'Email already exists' });
                    return;
                } else {
                    const salt = bcrypt.genSaltSync(10);
                    const pass_encrypt = bcrypt.hashSync(password, salt);
                    const newUser = {
                        name,
                        password: pass_encrypt,
                        email,
                        status: 0,
                        role: 1,
                        create_at: new Date(),
                    };
                    return UserModel.create(newUser);
                }
            })
            .then(() => {
                sendOTP(req, res);
                return;
            })
            .catch((error) => {
                // Xử lý lỗi nếu có
                console.log(error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    }
    update(req, res) {
        const allowedFields = ['name', 'password', 'email', 'phone', 'address', 'gender', 'status', 'role'];
        const userData = filterRequestBody(req.body, allowedFields);
        if (userData.password) {
            const salt = bcrypt.genSaltSync(10);
            const pass_encrypt = bcrypt.hashSync(userData.password, salt);
            userData.password = pass_encrypt;
        }
        let result = UserModel.update(req.params.id, userData);
        result
            .then(function (value) {
                console.log(value);
                res.json(value);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    logout(req, res) {
        try {
            req.session.destroy();
            res.json({ message: 'Logout successful' });
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    delete(req, res) {
        let result = UserModel.delete(req.params.id);
        result
            .then(function (value) {
                console.log(value);
                res.json({ message: 'Delete successful' });
            })
            .catch(function (error) {
                console.log(error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    }

    verifyOTP(req, res) {
        const { otp, email } = req.body;
        const { otpInfo } = req.session;
        console.log('OTP', otpInfo);
        if (!otp || !otpInfo || !otpInfo.otp || !otpInfo.email) {
            return res.status(400).json({ error: 'OTP information is missing or invalid' });
        }
        if (otp !== otpInfo.otp || email !== otpInfo.email) {
            return res.status(400).json({ error: 'Invalid OTP or Email' });
        }
        if (Date.now() > otpInfo.otpExpiration) {
            return res.status(400).json({ error: 'OTP expired' });
        }

        UserModel.update(req.params.id, { status: 1 })
            .then((updatedUser) => {
                res.json({ message: 'OTP verified successfully', user: updatedUser });
            })
            .catch((error) => {
                // Xử lý lỗi nếu có
                console.log(error);
                res.status(500).json({ error: 'Internal server error' });
            });
    }
}

const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const otp = generateOTP();
        req.session.otpInfo = {
            email: email,
            otp: otp,
            otpExpiration: Date.now() + 5 * 60 * 1000, // Hết hạn sau 5 phút
        };
        console.log(req.session.otpInfo);
        // Send OTP via email
        await sendEmail({
            to: email,
            subject: 'Your OTP',
            message: `<p>Your OTP is: <strong>${otp}</strong></p>`,
        });
        return res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

export default new UserController();
