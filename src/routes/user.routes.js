import express from 'express';
import multer from 'multer';
import { authJwt, verifySignUp } from '../middleware/index.js';
import userController from '../app/controllers/user.controller.js';

const userRouter = express.Router();
const upload = multer();

userRouter.post('/login', userController.signin);
userRouter.post('/logout', userController.logout);
userRouter.get('/all', [authJwt.verifyToken, authJwt.isAdmin], userController.getAll);
userRouter.post('/register', verifySignUp.checkDuplicateUsernameOrEmail, userController.signup);
userRouter.put('/:id/edit', [authJwt.verifyToken, upload.single('avatar')], userController.update);
userRouter.put('/verify', userController.verifyOTP);
userRouter.put('/:id/change-password', authJwt.verifyToken, userController.changePassword);
userRouter.put('/forgot-password', userController.forgotPassword);
userRouter.put('/verify-otp-forgot', userController.verifyOtpForgot);
userRouter.get('/', userController.getLimitOffset);
userRouter.get('/:id', userController.find);
userRouter.put('/:id/roles', [authJwt.verifyToken, authJwt.isAdmin], userController.updateUserRoles);
userRouter.delete('/:id', [authJwt.verifyToken, authJwt.isAdmin], userController.delete);

export default userRouter;
