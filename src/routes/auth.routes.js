import express from 'express';
import { verifySignUp } from '../middleware/index.js';
import * as controller from '../app/controllers/auth.controller.js';

import { setHeaders } from '../middleware/common.js';

const authRouter = express.Router();

authRouter.use(setHeaders);

authRouter.post(
    '/signup',
    [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
    controller.signup,
);

authRouter.post('/signin', controller.signin);

export default authRouter;
