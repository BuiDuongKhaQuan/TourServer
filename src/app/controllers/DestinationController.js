import { Readable } from 'stream';
import destinationModel from '../../config/db/models/Destination.js';
import { filterRequestBody } from '../../utils/index.js';
import { uploadFile } from '../../utils/google.js';
class DestinationController {
    async get_all(req, res) {
        try {
            const destinations = await destinationModel.get_all();
            if (!destinations) return res.status(401).json({ error: 'Destination does not exist!' });
            const destinationsWithImages = await Promise.all(
                destinations.map(async (destination) => {
                    const image = await destinationModel.find_image_by_id(destination.id);
                    return {
                        ...destination,
                        img: image ? image.image : null,
                    };
                }),
            );

            return res.json({ message: 'Get successful!', data: destinationsWithImages });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    get_all_size(req, res) {
        let result = destinationModel.get_all();
        result
            .then(function (value) {
                if (!value || value.length === 0) {
                    res.status(404).json({ error: 'No destinations found' });
                } else {
                    res.json(value.length);
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
                img: image ? image.image : null,
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
                        img: image ? image.image : null,
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
            const linkImage = `https://drive.google.com/thumbnail?id=${data.id}&sz=w1000`;
            await destinationModel.upload_image_by_id(destination.id, linkImage);
            res.send({ message: 'Create successfully', data: { ...destination, img: linkImage } });
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
            let destination = null;
            if (Object.keys(destinationData).length !== 0) {
                destination = await destinationModel.update_by_id(id, destinationData);
            }
            let linkImage = null;
            if (req.file) {
                const fileStream = new Readable();
                fileStream.push(req.file.buffer);
                fileStream.push(null);
                const data = await uploadFile(fileStream, req.file.originalname);
                linkImage = `https://drive.google.com/thumbnail?id=${data.id}&sz=w1000`;
                const imageDestination = await destinationModel.find_image_by_id(id);
                if (imageDestination) {
                    await destinationModel.update_image_by_id(id, linkImage);
                } else {
                    await destinationModel.upload_image_by_id(id, linkImage);
                }
            }
            if (!destination) {
                destination = await destinationModel.find_by_id(id);
            }
            res.send({
                message: 'Update successfully',
                data: {
                    ...destination,
                    img: linkImage, // Sử dụng liên kết hình ảnh đã tải lên nếu có
                },
            });
        } catch (error) {
            console.log('Error updating destination:', error);
            res.status(500).send('Error updating destination');
        }
    }
}

export default new DestinationController();
