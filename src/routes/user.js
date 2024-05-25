import express from 'express';
import { default as userController } from '../app/controllers/UserController.js';
import multer from 'multer';
const userRouter = express.Router();
const upload = multer();

userRouter.post('/login', userController.login);
userRouter.post('/logout', userController.logout);
userRouter.post('/register', userController.register);
userRouter.post('/upload', upload.single('avatar'), userController.update_avatar);
userRouter.put('/verify', userController.verifyOTP);
userRouter.put('/change-password', userController.change_password);
userRouter.put('/forgot-password', userController.forgot_password);
userRouter.put('/verify-otp-forgot', userController.verify_otp_forgot);

userRouter.get('/:id', userController.find);
userRouter.put('/:id/edit', userController.update);
userRouter.delete('/:id', userController.delete);

userRouter.get('/:limit/:offset', userController.get_limit_offset);

export { userRouter };
