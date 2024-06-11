import express from 'express';
import multer from 'multer';
import tourController from '../app/controllers/tour.controller.js';

const tourRouter = express.Router();
const upload = multer();

// Định nghĩa các tuyến đường không trùng lặp và sử dụng phương thức HTTP thích hợp
tourRouter.get('/', tourController.findAll); // Tìm kiếm theo cột
tourRouter.get('/all', tourController.getAll); // Lấy tất cả các tour
tourRouter.get('/all-size', tourController.getSize); // Lấy kích thước tất cả các tour
tourRouter.post('/', upload.array('images', 5), tourController.create); // Tạo mới một tour

tourRouter.get('/:id', tourController.find); // Tìm tour theo ID
// tourRouter.get('/limit-offset', tourController.getLimitOffset); // Lấy các tour theo limit và offset (đổi URL để không trùng với '/')
tourRouter.patch('/:id/edit', tourController.update); // Cập nhật tour theo ID (sử dụng PATCH thay vì POST cho cập nhật)
tourRouter.post('/update-image', upload.single('image'), tourController.updateImage); // Cập nhật hình ảnh
tourRouter.post('/:id/add-image', upload.array('images', 5), tourController.addImage); // Thêm hình ảnh vào tour
tourRouter.delete('/image', tourController.deleteImage); // Xóa hình ảnh (đổi URL để không trùng với '/')
tourRouter.delete('/:id', tourController.delete); // Xóa tour theo ID

export default tourRouter;
