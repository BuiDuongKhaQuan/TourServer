import express from 'express';
import multer from 'multer';
import { authJwt, verifySignUp } from '../middleware/index.js';
import { default as userController } from '../app/controllers/user.controller.js';
import { setHeaders } from '../middleware/common.js';

const userRouter = express.Router();
const upload = multer();

userRouter.use(setHeaders);

// Xác thực người dùng cho các routes cần bảo vệ
userRouter.post('/login', userController.signin);
userRouter.post('/logout', userController.logout);
userRouter.get('/all', userController.getAll);
userRouter.post('/register', verifySignUp.checkDuplicateUsernameOrEmail, userController.signup);
userRouter.put('/:id/edit', upload.single('avatar'), userController.update);
userRouter.put('/verify', userController.verifyOTP);
userRouter.put('/:id/change-password', authJwt.verifyToken, userController.changePassword);
userRouter.put('/forgot-password', userController.forgotPassword);
userRouter.put('/verify-otp-forgot', userController.verifyOtpForgot);
userRouter.get('/', userController.getLimitOffset);
userRouter.get('/:id', userController.find);
userRouter.put('/:id/roles', userController.updateUserRoles);
userRouter.delete('/:id', userController.delete);

export default userRouter;
