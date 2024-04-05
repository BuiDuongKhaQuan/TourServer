import express from 'express';
import { default as tourController } from '../app/controllers/TourController.js';
const tourRouter = express.Router();

tourRouter.use('/', tourController.get);
tourRouter.use('/:slug', tourController.show);
tourRouter.use('/', tourController.index);

export { tourRouter };
