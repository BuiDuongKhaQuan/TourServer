import express from 'express';
import { default as blogController } from '../app/controllers/BlogController.js';
const blogRouter = express.Router();

blogRouter.post('/', blogController.create);
blogRouter.get('/', blogController.get_all);
blogRouter.get('/:id', blogController.find);
blogRouter.put('/:id/edit', blogController.update);
blogRouter.delete('/:id', blogController.delete);

export { blogRouter };
