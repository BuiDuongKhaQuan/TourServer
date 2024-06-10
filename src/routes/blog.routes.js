import express from 'express';
import multer from 'multer';
import blogController from '../app/controllers/blog.controller.js';
const blogRouter = express.Router();
const upload = multer();

blogRouter.get('/all', blogController.getAll);
blogRouter.get('/all-size', blogController.getSize);
blogRouter.put('/:id/edit', upload.single('image'), blogController.update);
blogRouter.post('/', upload.single('image'), blogController.create);

blogRouter.get('/', blogController.getLimitOffset);
blogRouter.get('/:id', blogController.find);
blogRouter.delete('/:id', blogController.delete);

export default blogRouter;
