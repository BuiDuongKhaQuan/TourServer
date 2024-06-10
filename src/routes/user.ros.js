import express from 'express';
import { authJwt } from '../middleware/index.js';
import * as controller from '../app/controllers/user.controller.js';

const userRouter = express.Router();

userRouter.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
});

userRouter.get('/all', controller.allAccess);

userRouter.get('/user', [authJwt.verifyToken], controller.userBoard);

userRouter.get('/mod', [authJwt.verifyToken, authJwt.isModerator], controller.moderatorBoard);

userRouter.get('/admin', [authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard);

export default userRouter;
