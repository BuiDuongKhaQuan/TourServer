import express from 'express';
import { default as tourController } from '../app/controllers/TourController.js';
const tourRouter = express.Router();

tourRouter.post('/', tourController.create);
tourRouter.get('/', tourController.get_all);
tourRouter.get('/:id', tourController.find);
tourRouter.put('/:id/edit', tourController.update);
tourRouter.delete('/:id', tourController.delete);

export { tourRouter };
