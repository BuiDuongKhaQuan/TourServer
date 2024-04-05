import express from 'express';
import { default as userController } from '../app/controllers/UserController.js';
const userRouter = express.Router();

userRouter.use('/', userController.get);
userRouter.use('/:slug', userController.show);
// userRouter.use('/', userController.index);

export { userRouter };
