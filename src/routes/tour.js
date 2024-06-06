import express from 'express';
import multer from 'multer';
import tourController from '../app/controllers/TourController.js';
const tourRouter = express.Router();
const upload = multer();

tourRouter.get('/all', tourController.get_all);
tourRouter.get('/all-size', tourController.get_all_size);
tourRouter.post('/', upload.array('images', 5), tourController.create);

tourRouter.get('/:id', tourController.find);
tourRouter.get('/', tourController.get_all_limit);
tourRouter.post('/:id/edit', upload.array('image', 5), tourController.update);
tourRouter.post('/image', tourController.deleteImage);
tourRouter.post('/update-image', upload.single('image'), tourController.update_image);
tourRouter.post('/:id/add-image', upload.array('image', 5), tourController.add_image);

export { tourRouter };
