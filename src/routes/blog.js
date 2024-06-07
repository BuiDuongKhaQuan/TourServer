import express from 'express';
import multer from 'multer';
import blogController from '../app/controllers/BlogController.js';
const blogRouter = express.Router();
const upload = multer();

blogRouter.get('/all', blogController.get_all);
blogRouter.get('/all-size', blogController.get_all_size);
blogRouter.post('/:id/edit', upload.single('image'), blogController.update);
blogRouter.post('/', upload.single('img'), blogController.create);

blogRouter.get('/', blogController.get_all_limit);
blogRouter.get('/:id', blogController.find);

export { blogRouter };
