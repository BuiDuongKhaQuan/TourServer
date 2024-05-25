import { Readable } from 'stream';
import tourModel from '../../config/db/models/Tour.js';
import { uploadFile } from '../../utils/google.js';

class TourController {
    get_all(req, res) {
        let result = tourModel.get_all();
        result
            .then(function (value) {
                if (!value || value.length === 0) {
                    res.status(404).json({ error: 'No tours found' });
                } else {
                    res.json(value);
                }
            })
            .catch(function (error) {
                console.log(error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    }
    async find(req, res) {
        const { id } = req.params;
        try {
            const tour = await tourModel.find_by_id(id);
            if (!tour) return res.status(401).json({ error: 'Tour does not exist!' });
            const images = await tourModel.find_image_by_id(tour.id);
            const tourWithImage = {
                ...tour,
                image: images ? images.map((image) => image.image) : null,
            };
            return res.json({ message: 'Find successful!', tour: tourWithImage });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async get_all_limit(req, res) {
        const { start, page } = req.query;
        try {
            const tours = await tourModel.get_limit_offset(page, start);
            if (!tours) return res.status(401).json({ error: 'Tours does not exist!' });
            const toursWithImages = await Promise.all(
                tours.map(async (tour) => {
                    const images = await tourModel.find_image_by_id(tour.id);
                    return {
                        ...tour,
                        image: images ? images.map((image) => image.image) : null,
                    };
                }),
            );

            return res.json({ message: 'Find successful!', tours: toursWithImages });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async create(req, res) {
        const { location, rate, name, date, person_quantity, information, price, status } = req.body;
        try {
            if (!location || !rate || !name || !date || !person_quantity || !information || !price || !status)
                return res.status(400).json({ error: 'Missing required fields!' });

            const newTour = {
                location,
                rate,
                name,
                date,
                person_quantity,
                information,
                price,
                status,
                create_at: new Date(),
            };
            const tour = await tourModel.create(newTour);
            if (req.files && req.files.length > 0) {
                // Xử lý tải lên nhiều tệp
                const uploadPromises = req.files.map((file) => {
                    const fileStream = new Readable();
                    fileStream.push(file.buffer);
                    fileStream.push(null);
                    return uploadFile(fileStream, file.originalname).then((data) => {
                        const linkImage = `https://drive.google.com/thumbnail?id=${data.id}`;
                        return tourModel.upload_image_by_id(tour.id, linkImage);
                    });
                });
                await Promise.all(uploadPromises);
            }
            const images = await tourModel.find_image_by_id(tour.id);
            res.send({
                message: 'Create successfully',
                data: { ...tour, images: images ? images.map((image) => image.image) : [] },
            });
        } catch (error) {
            console.log('Error creating tour:', error);
            res.status(500).send('Error creating tour');
        }
    }
    async update(req, res) {
        const { id } = req.params;
        const allowedFields = ['location', 'rate', 'name', 'date', 'person_quantity', 'information', 'price', 'status'];
        const tourData = filterRequestBody(req.body, allowedFields);

        try {
            // Cập nhật dữ liệu destination
            const tour = await tourModel.update_by_id(id, tourData);

            let linkImage;
            if (req.file) {
                // Xử lý tải lên tệp nếu tệp được cung cấp
                const fileStream = new Readable();
                fileStream.push(req.file.buffer);
                fileStream.push(null);
                const data = await uploadFile(fileStream, req.file.originalname);
                linkImage = `https://drive.google.com/thumbnail?id=${data.id}`;
                await tourModel.update_image_by_id(tour.id, linkImage);
            }

            res.send({
                message: 'Update successfully',
                data: {
                    ...destination,
                    image: linkImage || destination.image, // Sử dụng hình ảnh hiện có nếu không có hình ảnh mới được tải lên
                },
            });
        } catch (error) {
            console.log('Error update tour:', error);
            res.status(500).send('Error update tour');
        }
    }
}

export default new TourController();
