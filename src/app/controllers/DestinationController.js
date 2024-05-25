import { Readable } from 'stream';
import destinationModel from '../../config/db/models/Destination.js';
import { filterRequestBody } from '../../utils/index.js';
import { uploadFile } from '../../utils/google.js';
class DestinationController {
    get_all(req, res) {
        let result = destinationModel.get_all();
        result
            .then(function (value) {
                if (!value || value.length === 0) {
                    res.status(404).json({ error: 'No destinations found' });
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
            const destination = await destinationModel.find_by_id(id);
            if (!destination) return res.status(401).json({ error: 'Destination does not exist!' });
            const image = await destinationModel.find_image_by_id(destination.id);
            const destinationWithImage = {
                ...destination,
                image: image ? image.image : null,
            };
            return res.json({ message: 'Find successful!', destination: destinationWithImage });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async get_all_limit(req, res) {
        const { start, page } = req.query;
        try {
            const destinations = await destinationModel.get_limit_offset(page, start);
            if (!destinations) return res.status(401).json({ error: 'Destination does not exist!' });
            const destinationsWithImages = await Promise.all(
                destinations.map(async (destination) => {
                    const image = await destinationModel.find_image_by_id(destination.id);
                    return {
                        ...destination,
                        image: image ? image.image : null,
                    };
                }),
            );

            return res.json({ message: 'Find successful!', destinations: destinationsWithImages });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async create(req, res) {
        const { location, trips, information, status } = req.body;
        try {
            if (!location || !trips || !information || !status)
                return res.status(400).json({ error: 'Missing required fields!' });

            const newDestination = {
                location,
                trips,
                information,
                status,
                create_at: new Date(),
            };
            const destination = await destinationModel.create(newDestination);
            const fileStream = new Readable();
            fileStream.push(req.file.buffer);
            fileStream.push(null);
            const data = await uploadFile(fileStream, req.file.originalname);
            const linkImage = `https://drive.google.com/thumbnail?id=${data.id}`;
            await destinationModel.upload_image_by_id(destination.id, linkImage);
            res.send({ message: 'Create successfully', data: { ...destination, image: linkImage } });
        } catch (error) {
            console.log('Error creating destination:', error);
            res.status(500).send('Error creating destination');
        }
    }
    async update(req, res) {
        const { id } = req.params;
        const allowedFields = ['location', 'trips', 'information', 'status'];
        const destinationData = filterRequestBody(req.body, allowedFields);

        try {
            // Cập nhật dữ liệu destination
            const destination = await destinationModel.update_by_id(id, destinationData);

            let linkImage;
            if (req.file) {
                // Xử lý tải lên tệp nếu tệp được cung cấp
                const fileStream = new Readable();
                fileStream.push(req.file.buffer);
                fileStream.push(null);
                const data = await uploadFile(fileStream, req.file.originalname);
                linkImage = `https://drive.google.com/thumbnail?id=${data.id}`;
                await destinationModel.update_image_by_id(destination.id, linkImage);
            }

            res.send({
                message: 'Update successfully',
                data: {
                    ...destination,
                    image: linkImage || destination.image, // Sử dụng hình ảnh hiện có nếu không có hình ảnh mới được tải lên
                },
            });
        } catch (error) {
            console.log('Error updating destination:', error);
            res.status(500).send('Error updating destination');
        }
    }
}

export default new DestinationController();
