import express from 'express';
import multer from 'multer';
import tourController from '../app/controllers/tour.controller.js';
import { authJwt } from '../middleware/index.js';

const tourRouter = express.Router();
const upload = multer();

tourRouter.get('/', tourController.findAll);
tourRouter.get('/all', tourController.getAll);
tourRouter.get('/deal', tourController.findAllToursWithValidDeal);
tourRouter.get('/all-size', tourController.getSize);
tourRouter.post('/', [authJwt.verifyToken, authJwt.isAdmin, upload.array('images', 5)], tourController.create);
tourRouter.post('/search', tourController.search);
tourRouter.get('/:id', tourController.find);
tourRouter.put('/:id/edit', [authJwt.verifyToken, authJwt.isAdmin], tourController.update);
tourRouter.post(
    '/update-image',
    [authJwt.verifyToken, authJwt.isAdmin, upload.single('image')],
    tourController.updateImage,
);
tourRouter.post(
    '/:id/add-image',
    [authJwt.verifyToken, authJwt.isAdmin, upload.array('images', 5)],
    tourController.addImage,
);
tourRouter.delete('/image', [authJwt.verifyToken, authJwt.isAdmin], tourController.deleteImage);
tourRouter.delete('/:id', [authJwt.verifyToken, authJwt.isAdmin], tourController.delete);

export default tourRouter;
