import express from 'express';
import { default as userController } from '../app/controllers/UserController.js';
const userRouter = express.Router();

userRouter.post('/', userController.register);
userRouter.get('/', userController.get_all);
userRouter.get('/login', userController.login);
userRouter.get('/logout', userController.logout);
userRouter.put('/verify', userController.verifyOTP);
userRouter.put('/:id', userController.update);
userRouter.delete('/:id', userController.delete);

export { userRouter };
