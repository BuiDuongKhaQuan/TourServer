import { Readable } from 'stream';
import { uploadFile } from '../../utils/google.js';
import { filterRequestBody } from '../../utils/index.js';
import { db, Sequelize } from '../models/index.js';

const Tour = db.tour;
const Image = db.image;

class TourController {
    async getAll(req, res) {
        try {
            const tours = await Tour.findAllTour();
            if (!tours) return res.status(401).json({ error: 'Tours does not exist!' });
            return res.json({ message: 'Find successful!', data: tours });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async getSize(req, res) {
        try {
            const size = await Tour.getSize();
            return res.json({ message: 'Get size successful!', data: size });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async find(req, res) {
        const { id } = req.params;
        try {
            const tour = await Tour.findByIdWithDetails(id);
            if (!tour) return res.status(401).json({ error: 'Tour does not exist!' });
            return res.json({ message: 'Find successful!', data: tour });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }

    async findAll(req, res) {
        const { column, value, start, page } = req.query;
        try {
            let tours;
            if (start && page) {
                tours = await Tour.getLimitOffset(Number(page), Number(start));
            } else if (column && value) {
                tours = await Tour.findAllByColumn(column, value);
            } else {
                return res.status(400).json({ error: 'Missing required query parameters.' });
            }
            if (!tours || tours.length === 0) {
                return res.status(404).json({ error: 'Tours do not exist!' });
            }
            return res.json({ message: 'Find successful!', data: tours });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async findAllToursWithValidDeal(req, res) {
        try {
            const tours = await Tour.findAllDeal();
            if (!tours || tours.length === 0) {
                return res.status(404).json({ error: 'Tours do not exist!' });
            }
            return res.json({ message: 'Find successful!', data: tours });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async search(req, res) {
        try {
            const { name, destinations, categories, hasDeal, offset, limit } = req.body;

            const searchCriteria = {};
            if (name) {
                searchCriteria.name = { [Sequelize.Op.like]: `%${name}%` };
            }
            if (destinations && destinations.length > 0) {
                searchCriteria.destinationId = { [Sequelize.Op.in]: destinations };
            }
            if (categories && categories.length > 0) {
                searchCriteria.categoryId = { [Sequelize.Op.in]: categories };
            }
            if (hasDeal) {
                searchCriteria.dealId = { [Sequelize.Op.ne]: null };
            }
            const { count, rows } = await Tour.search(searchCriteria, { offset, limit });
            if (!rows || rows.length === 0) {
                return res.json({ message: 'Tours do not exist!', data: rows });
            }
            return res.json({ message: 'Find successful!', data: rows, total: count });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async create(req, res) {
        const { destinationId, categoryId, dealId, name, date, personQuantity, information, price, status } = req.body;
        console.log(req.body, req.files);
        try {
            if (!destinationId || !categoryId || !name || !date || !personQuantity || !information || !price || !status)
                return res.status(400).json({ error: 'Missing required fields!' });

            const newTour = {
                destinationId,
                categoryId,
                dealId: dealId !== null ? dealId : 0,
                name,
                date,
                personQuantity,
                information,
                price,
                status,
            };
            const tour = await Tour.createTour(newTour);
            if (req.files && req.files.length > 0) {
                // Xử lý tải lên nhiều tệp
                const uploadPromises = req.files.map((file) => {
                    const fileStream = new Readable();
                    fileStream.push(file.buffer);
                    fileStream.push(null);
                    return uploadFile(fileStream, file.originalname).then((data) => {
                        const linkImage = `https://lh3.googleusercontent.com/d/${data.id}=w1000`;
                        return Image.uploadImageByColumn('tourId', tour.id, linkImage);
                    });
                });
                await Promise.all(uploadPromises);
            }
            const tourDetail = await Tour.findByIdWithDetails(tour.id);
            res.send({
                message: 'Create successfully',
                data: tourDetail,
            });
        } catch (error) {
            console.log('Error creating tour:', error);
            res.status(500).send('Error creating tour');
        }
    }
    async update(req, res) {
        const { id } = req.params;
        const allowedFields = [
            'destinationId',
            'categoryId',
            'dealId',
            'name',
            'date',
            'personQuantity',
            'information',
            'price',
            'status',
        ];
        const tourData = filterRequestBody(req.body, allowedFields);
        try {
            const tour = await Tour.updateById(id, tourData);
            res.send({
                message: 'Update successfully',
                data: tour,
                // Sử dụng hình ảnh hiện có nếu không có hình ảnh mới được tải lên
            });
        } catch (error) {
            console.log('Error update tour:', error);
            res.status(500).send('Error update tour');
        }
    }
    async deleteImage(req, res) {
        const { imageId, tourId } = req.body;
        try {
            await Image.deleteByColumn('id', imageId);
            const images = await Image.findAllByColumn('tourId', tourId);
            return res.json({
                message: 'Delete successful!',
                data: images,
            });
        } catch (error) {
            console.log('Error delete tour image:', error);
            res.status(500).send('Error delete tour image!');
        }
    }
    async updateImage(req, res) {
        const { imageId, tourId } = req.body;
        try {
            if (req.file) {
                const fileStream = new Readable();
                fileStream.push(req.file.buffer);
                fileStream.push(null);
                const data = await uploadFile(fileStream, req.file.originalname);
                const linkImg = `https://lh3.googleusercontent.com/d/${data.id}=w1000`;
                await Image.updateByColumn('id', imageId, linkImg);
                console.log(imageId, tourId);
            }
            const images = await Image.findAllByColumn('tourId', tourId);
            res.send({
                message: 'Update successfully',
                data: images, // Sử dụng hình ảnh hiện có nếu không có hình ảnh mới được tải lên
            });
        } catch (error) {
            console.log('Error update tour:', error);
            res.status(500).send('Error update tour');
        }
    }
    async addImage(req, res) {
        const { id } = req.params;
        try {
            if (req.files && req.files.length > 0) {
                const uploadPromises = req.files.map((file) => {
                    const fileStream = new Readable();
                    fileStream.push(file.buffer);
                    fileStream.push(null);
                    return uploadFile(fileStream, file.originalname).then((data) => {
                        const linkImage = `https://lh3.googleusercontent.com/d/${data.id}=w1000`;
                        return Image.uploadImageByColumn('tourId', id, linkImage);
                    });
                });
                await Promise.all(uploadPromises);
            }
            const images = await Image.findAllByColumn('tourId', id);
            res.send({
                message: 'Add image successfully',
                data: images,
            });
        } catch (error) {
            console.log('Error creating tour:', error);
            res.status(500).send('Error creating tour');
        }
    }
    async delete(req, res) {
        const { id } = req.params;
        try {
            await Tour.deleteTour(id);
            const tours = await Tour.findAllTour();
            return res.json({ message: 'Delete successful!', data: tours });
        } catch (error) {
            console.error('Error deleting tour:', error);
            res.status(500).json({ message: 'An error occurred while deleting the tour.' });
        }
    }
}

export default new TourController();
