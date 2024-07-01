import bcrypt from 'bcrypt';
import { Readable } from 'stream';
import { encrypt, filterRequestBody, generateOTP } from '../../utils/index.js';
import { sendEmail } from '../../utils/sendEmails.js';
import { uploadFile } from '../../utils/google.js';
import { db } from '../models/index.js';
import secret from '../../config/auth.config.js';
import jwt from 'jsonwebtoken';
import { htmlOtp } from '../../utils/htmlMail.js';

const User = db.user;
const Role = db.role;
const Image = db.image;
const { Op } = db.Sequelize;

class UserController {
    async getAll(req, res) {
        try {
            const users = await User.findAllUser();
            if (!users) return res.status(401).json({ error: 'Users does not exist!' });
            return res.json({ message: 'Find successful!', data: users });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async getSize(req, res) {
        try {
            const size = await User.getSize();
            return res.json({ message: 'Get size successful!', data: size });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async find(req, res) {
        const { id } = req.params;
        try {
            const user = await User.findByColumn('id', id);
            if (!user) return res.status(401).json({ error: 'User does not exist!' });
            const roles = user.roles.map((role) => role.name);
            return res.json({ message: 'Find successful!', data: { ...user.dataValues, roles } });
            // return res.json({ message: 'Find successful!', data: { ...user.dataValues, roles: authorities } });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async getLimitOffset(req, res) {
        const { start, page } = req.query;
        try {
            const users = await User.getLimitOffset(Number(page), Number(start));
            if (!users) return res.status(401).json({ error: 'Users does not exist!' });
            return res.json({ message: 'Find successful!', data: users });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    signin = async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await User.findByColumn('email', email);

            if (!user) {
                return res.status(404).send({ message: 'User Not found.' });
            }

            const passwordIsValid = bcrypt.compareSync(password, user.password);

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: 'Invalid Password!',
                });
            }

            const token = jwt.sign({ id: user.id }, secret, {
                algorithm: 'HS256',
                allowInsecureKeySizes: true,
                expiresIn: 86400, // 24 hours
            });

            const roles = await user.getRoles();
            const authorities = roles.map((role) => 'ROLE_' + role.name.toUpperCase());

            res.status(200).send({
                data: { ...user.dataValues, roles: authorities, accessToken: token },
            });
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    };
    signup = async (req, res) => {
        const { name, password, email, roles } = req.body;
        try {
            if (!name || !password || !email)
                return res.status(400).json({ error: 'Missing required fields: name, password, email' });
            const userCheck = await User.findByColumn('email', email);

            if (userCheck) {
                return res.status(400).send({ message: 'Email đã tồn tại!!' });
            }
            const user = await User.create({
                name,
                email,
                status: 0,
                password: encrypt(password, 8),
            });
            const otp = generateOTP();
            req.session.otpInfo = {
                email: email,
                otp: otp,
                otpExpiration: Date.now() + 5 * 60 * 1000, // Hết hạn sau 5 phút
            };

            await sendEmail({
                to: email,
                subject: 'Your OTP',
                message: htmlOtp(otp),
            });

            if (roles) {
                const roles = await Role.findAll({
                    where: {
                        name: {
                            [Op.or]: roles,
                        },
                    },
                });
                await user.setRoles(roles);
                res.send({ message: 'User was registered successfully!' });
            } else {
                await user.setRoles([1]);
                res.send({ message: 'User was registered successfully!' });
            }
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    };

    verifyOTP(req, res) {
        const { otp, email } = req.body;
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

        User.updateByColumn('email', email, { status: 1 })
            .then((user) => {
                res.json({ message: 'OTP verified successfully', data: user.dataValues });
                delete req.session.otpInfo;
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json({ error: 'Internal server error' });
            });
    }
    async update(req, res) {
        const { id } = req.params;
        const allowedFields = ['name', 'password', 'email', 'phone', 'address', 'gender', 'status'];
        const userData = filterRequestBody(req.body, allowedFields);
        if (userData.password) {
            userData.password = encrypt(userData.password, 8);
        }
        try {
            if (Object.keys(userData).length !== 0) {
                await User.updateByColumn('id', id, userData);
            }
            if (req.file) {
                const fileStream = new Readable();
                fileStream.push(req.file.buffer);
                fileStream.push(null);
                const data = await uploadFile(fileStream, req.file.originalname);
                const linkImg = `https://lh3.googleusercontent.com/d/${data.id}=w1000`;
                const result = await Image.updateByColumn('userId', id, linkImg);
                console.log(result[1]);
                if (result[1] === 0) {
                    await Image.uploadImageByColumn('userId', id, linkImg);
                }
            }
            const user = await User.findByColumn('id', id);
            const roles = await user.getRoles();
            const authorities = roles.map((role) => 'ROLE_' + role.name.toUpperCase());
            res.json({
                message: 'Update successfully',
                data: { ...user.dataValues, roles: authorities },
            });
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ error: 'An error occurred while updating the user.' });
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

    async changePassword(req, res) {
        const { id } = req.params;
        const { passwordNew, passwordRe, passwordOld } = req.body;
        try {
            if (passwordNew !== passwordRe || !passwordNew || !passwordRe) {
                return res
                    .status(400)
                    .json({ error: 'New password and password confirmation do not match or are missing' });
            }
            const user = await User.findByIdWithDetails(id);
            const validPassword = await bcrypt.compare(passwordOld, user.password);
            if (validPassword) {
                await User.updateByColumn('id', id, { password: encrypt(passwordNew, 8) });
                return res.json({ message: 'Password updated successfully', data: user });
            }
            return res.status(400).json({ error: 'Old passwords do not match' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    forgotPassword(req, res) {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Missing required fields: email' });

        User.findByColumn('email', email)
            .then(async (user) => {
                if (!user) {
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
                    message: htmlOtp(otp),
                });
                res.status(200).json({ success: true, message: 'OTP sent successfully' });
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    }
    verifyOtpForgot(req, res) {
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

        User.updateByColumn('email', email, { password: encrypt(password) })
            .then((user) => {
                res.json({ message: 'Update successfully' });
                delete req.session.otpInfo;
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json({ error: 'Internal server error' });
            });
    }
    async updateUserRoles(req, res) {
        const userId = req.params.id;
        const { roles } = req.body;
        console.log(roles, userId);
        try {
            // Tìm người dùng theo ID
            const user = await User.findByPk(userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Tìm các quyền theo mảng roles
            const rolesToUpdate = await Role.findAll({
                where: {
                    name: {
                        [Op.or]: roles,
                    },
                },
            });

            if (!rolesToUpdate.length) {
                return res.status(400).json({ message: 'Roles not found' });
            }

            // Cập nhật quyền của người dùng
            await user.setRoles(rolesToUpdate);

            res.status(200).json({ message: 'User roles updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'An error occurred', error: error.message });
        }
    }
}

export default new UserController();
