import express from 'express';
import multer from 'multer';
import blogController from '../app/controllers/blog.controller.js';
import { authJwt } from '../middleware/index.js';
const blogRouter = express.Router();
const upload = multer();

blogRouter.get('/all', blogController.getAll);
blogRouter.get('/all-size', blogController.getSize);
blogRouter.post('/search', blogController.search);
blogRouter.put('/:id/edit', [authJwt.verifyToken, authJwt.isAdmin, upload.single('image')], blogController.update);
blogRouter.post('/', [authJwt.verifyToken, authJwt.isAdmin, upload.single('image')], blogController.create);
blogRouter.get('/', blogController.getLimitOffset);
blogRouter.get('/:id', blogController.find);
blogRouter.delete('/:id', [authJwt.verifyToken, authJwt.isAdmin], blogController.delete);

export default blogRouter;
