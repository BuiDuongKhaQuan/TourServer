import express from 'express';
import { default as blogController } from '../app/controllers/BlogController.js';
const blogRouter = express.Router();

blogRouter.get('/', blogController.get_all);
blogRouter.get('/:slug', blogController.find);

export { blogRouter };
