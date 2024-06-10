import express from 'express';
import multer from 'multer';
import tourController from '../app/controllers/tour.controller.js';
const tourRouter = express.Router();
const upload = multer();

tourRouter.get('/all', tourController.getAll);
tourRouter.get('/all-size', tourController.getSize);
tourRouter.post('/', upload.array('images', 5), tourController.create);

tourRouter.get('/:id', tourController.find);
tourRouter.get('/', tourController.getLimitOffset);
tourRouter.post('/:id/edit', tourController.update);
tourRouter.post('/update-image', upload.single('image'), tourController.updateImage);
tourRouter.post('/:id/add-image', upload.array('images', 5), tourController.addImage);
tourRouter.post('/image', tourController.deleteImage);
tourRouter.delete('/:id', tourController.delete);

export default tourRouter;
