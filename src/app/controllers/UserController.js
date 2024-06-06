import express from 'express';
import multer from 'multer';
import bcrypt from 'bcrypt';
import { Readable } from 'stream';
import userModel from '../../config/db/models/User.js';
import { encrypt, filterRequestBody, generateOTP } from '../../utils/index.js';
import { sendEmail } from '../../utils/sendEmails.js';
import { uploadFile } from '../../utils/google.js';

const upload = multer({ dest: 'src/uploads/' });
const router = express.Router();

class UserController {
    get_limit_offset(req, res) {
        const { limit, offset } = req.params;
        let result = userModel.get_limit_offset(req.params ? limit : 20, req.params ? offset : 0);
        result
            .then(function (value) {
                console.log(value);
                res.json(value);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    async get_all(req, res) {
        try {
            const users = await userModel.get_all();
            if (!users) return res.status(401).json({ error: 'Users does not exist!' });
            const usersWithImages = await Promise.all(
                users.map(async (user) => {
                    const avatar = await userModel.find_avatar_by_id(user.id);
                    return {
                        ...user,
                        avatar: avatar ? avatar.image : null,
                    };
                }),
            );
            return res.json({ message: 'Get successful!', data: usersWithImages });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    find(req, res) {
        const { id } = req.params;
        let result = userModel.find('id', id);
        result
            .then(function (value) {
                console.log(value);
                res.json(value);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    async login(req, res) {
        const { email, password } = req.body;
        console.log(email);
        try {
            const user = await userModel.find_by_email(email);
            if (!user) return res.status(401).json({ error: 'Email does not exist!' });
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) return res.status(400).json({ error: 'Password incorrect!' });
            const avatar = await userModel.find_avatar_by_id(user.id);
            req.session.login = true;
            req.session.userInfo = {
                id: user.id,
                email: user.email,
            };
            const userWithAvatar = {
                ...user,
                avatar: avatar ? avatar.image : null,
            };

            return res.json({ message: 'Login successful!', user: userWithAvatar });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    register(req, res) {
        const { name, password, email } = req.body;
        console.log(req.body);
        if (!name || !password || !email)
            return res.status(400).json({ error: 'Missing required fields: name, password, email' });

        userModel
            .find_by_email(email)
            .then(async (existingUser) => {
                if (existingUser) {
                    return res.status(409).json({ error: 'Email already exists' });
                }

                const otp = generateOTP();
                req.session.otpInfo = {
                    email: email,
                    otp: otp,
                    otpExpiration: Date.now() + 5 * 60 * 1000, // Hết hạn sau 5 phút
                };
                console.log('Register ', req.session.otpInfo);
                await sendEmail({
                    to: email,
                    subject: 'Your OTP',
                    message: `<p>Your OTP is: <strong>${otp}</strong></p>`,
                });

                const newUser = {
                    name,
                    password: encrypt(password),
                    email,
                    status: 0,
                    role: 1,
                    create_at: new Date(),
                };

                await userModel.create(newUser);

                res.status(200).json({ success: true, message: 'OTP sent successfully' });
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    }
    verifyOTP(req, res) {
        const { otp, email } = req.body;
        const { otpInfo } = req.session;
        console.log('Verifr ', otpInfo);
        console.log('Body ', req.body);

        if (!otp || !otpInfo || !otpInfo.otp || !otpInfo.email) {
            return res.status(400).json({ error: 'OTP information is missing or invalid' });
        }
        if (otp !== otpInfo.otp || email !== otpInfo.email) {
            return res.status(400).json({ error: 'Invalid OTP or Email' });
        }
        if (Date.now() > otpInfo.otpExpiration) {
            return res.status(400).json({ error: 'OTP expired' });
        }

        userModel
            .update_by_email(email, { status: 1 })
            .then((user) => {
                res.json({ message: 'OTP verified successfully', user });
                delete req.session.otpInfo;
            })
            .catch((error) => {
                // Xử lý lỗi nếu có
                console.log(error);
                res.status(500).json({ error: 'Internal server error' });
            });
    }
    async update(req, res) {
        const { id } = req.params;
        const allowedFields = ['name', 'password', 'email', 'phone', 'address', 'gender', 'status', 'role'];
        const userData = filterRequestBody(req.body, allowedFields);
        if (userData.password) {
            userData.password = encrypt(userData.password);
        }
        try {
            const user = await userModel.update_by_id(id, userData);
            const avatar = await userModel.find_avatar_by_id(id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({
                message: 'Update successfully',
                data: { ...user, avatar: avatar ? avatar.image : null },
            });
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ error: 'An error occurred while updating the user.' });
        }
    }

    async update_avatar(req, res) {
        try {
            const { login, userInfo } = req.session;
            if (!login) return res.status(403).json({ error: 'Access denied: You are not logged in' });
            const fileStream = new Readable();
            fileStream.push(req.file.buffer);
            fileStream.push(null);
            const avatarUser = await userModel.find_avatar_by_id(userInfo.id);
            const data = await uploadFile(fileStream, req.file.originalname);
            const linkAvatar = `https://drive.google.com/thumbnail?id=${data.id}&sz=w1000`;
            if (avatarUser) {
                await userModel.update_avatar_by_id(userInfo.id, linkAvatar);
            } else {
                await userModel.upload_avatar_by_id(userInfo.id, linkAvatar);
            }
            res.send({ message: 'Uploaded file successfully', avatar: linkAvatar });
        } catch (error) {
            console.log('Error uploading file:', error);
            res.status(500).send('Error uploading file');
        }
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
        let result = userModel.delete(req.params.id);
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

    async change_password(req, res) {
        try {
            const { passwordNew, passwordRe, passwordOld } = req.body;
            const { email } = req.session;
            if (passwordNew !== passwordRe || !passwordNew || !passwordRe) {
                return res
                    .status(400)
                    .json({ error: 'New password and password confirmation do not match or are missing' });
            }
            const user = await userModel.find_by_email(email);
            const validPassword = await bcrypt.compare(passwordOld, user.password);
            if (validPassword) {
                const updatedUser = await userModel.update_by_email(email, { password: encrypt(passwordNew) });
                return res.json({ message: 'Password updated successfully', user: updatedUser });
            }
            return res.status(400).json({ error: 'New password cannot be the same as current password' });
        } catch (error) {
            // Xử lý lỗi nếu có
            console.log(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    forgot_password(req, res) {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Missing required fields: email' });

        userModel
            .find_by_email(email)
            .then(async (existingUser) => {
                if (!existingUser) {
                    return res.status(409).json({ error: 'Email not exists' });
                }
                const otp = generateOTP();
                req.session.otpInfo = {
                    email: email,
                    otp: otp,
                    otpExpiration: Date.now() + 5 * 60 * 1000, // Hết hạn sau 5 phút
                };
                await sendEmail({
                    to: email,
                    subject: 'Your OTP',
                    message: `<p>Your OTP is: <strong>${otp}</strong></p>`,
                });
                res.status(200).json({ success: true, message: 'OTP sent successfully' });
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    }
    verify_otp_forgot(req, res) {
        const { otp, email, password, passwordRe } = req.body;
        const { otpInfo } = req.session;
        if (!otp || !otpInfo || !otpInfo.otp || !otpInfo.email) {
            return res.status(400).json({ error: 'OTP information is missing or invalid' });
        }
        if (otp !== otpInfo.otp || email !== otpInfo.email) {
            return res.status(400).json({ error: 'Invalid OTP or Email' });
        }
        if (Date.now() > otpInfo.otpExpiration) {
            return res.status(400).json({ error: 'OTP expired' });
        }
        if (password !== passwordRe || !password || !passwordRe) {
            return res
                .status(400)
                .json({ error: 'New password and password confirmation do not match or are missing' });
        }

        userModel
            .update_by_email(email, { password: encrypt(password) })
            .then((user) => {
                res.json({ message: 'Update successfully', user });
                delete req.session.otpInfo;
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json({ error: 'Internal server error' });
            });
    }
}

export default new UserController();
