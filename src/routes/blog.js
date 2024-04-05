import express from 'express';
import { default as blogController } from '../app/controllers/BlogController.js';
const blogRouter = express.Router();

blogRouter.use('/', blogController.get);
blogRouter.use('/:slug', blogController.show);
blogRouter.use('/', blogController.index);

export { blogRouter };
