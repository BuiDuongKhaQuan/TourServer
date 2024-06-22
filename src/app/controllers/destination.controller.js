import { Readable } from 'stream';
import { filterRequestBody } from '../../utils/index.js';
import { uploadFile } from '../../utils/google.js';

import { Sequelize, db } from '../models/index.js';

const Destination = db.destination;
const Image = db.image;

class DestinationController {
    async getAll(req, res) {
        try {
            const destinations = await Destination.findAllDestination();
            if (!destinations) return res.status(401).json({ error: 'Destinations does not exist!' });
            return res.json({ message: 'Find successful!', data: destinations });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async getSize(req, res) {
        try {
            const size = await Destination.getSize();
            return res.json({ message: 'Get size successful!', data: size });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async find(req, res) {
        const { id } = req.params;
        try {
            const destination = await Destination.findByIdWithDetails(id);
            if (!destination) return res.status(401).json({ error: 'Destination does not exist!' });
            return res.json({ message: 'Find successful!', data: destination });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async getLimitOffset(req, res) {
        const { start, page } = req.query;
        try {
            const destinations = await Destination.getLimitOffset(Number(page), Number(start));
            if (!destinations) return res.status(401).json({ error: 'Destinations does not exist!' });
            return res.json({ message: 'Find successful!', data: destinations });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async search(req, res) {
        try {
            const { name } = req.body;
            const searchCriteria = {};
            if (name) {
                searchCriteria.name = { [Sequelize.Op.like]: `%${name}%` };
            }
            const { count, rows } = await Destination.search(searchCriteria);
            if (!rows || rows.length === 0) {
                return res.json({ message: 'Destination do not exist!', data: rows });
            }
            return res.json({ message: 'Find successful!', data: rows, total: count });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async create(req, res) {
        const { name, trips, information, status } = req.body;
        console.log(req.body, req.file);
        try {
            if (!name || !trips || !information || !status || !req.file)
                return res.status(400).json({ error: 'Missing required fields!' });
            const destination = await Destination.createDestination(req.body);
            const fileStream = new Readable();
            fileStream.push(req.file.buffer);
            fileStream.push(null);
            const data = await uploadFile(fileStream, req.file.originalname);
            const linkImage = `https://lh3.googleusercontent.com/d/${data.id}=w1000`;
            const image = await Image.uploadImageByColumn('destinationId', destination.dataValues.id, linkImage);
            res.send({ message: 'Create successfully', data: { ...destination.dataValues, image } });
        } catch (error) {
            console.log('Error creating destination:', error);
            res.status(500).send('Error creating destination');
        }
    }
    async update(req, res) {
        const { id } = req.params;
        const allowedFields = ['name', 'trips', 'information', 'status'];
        const destinationData = filterRequestBody(req.body, allowedFields);
        try {
            if (Object.keys(destinationData).length !== 0) {
                await Destination.updateById(id, destinationData);
            }
            if (req.file) {
                const fileStream = new Readable();
                fileStream.push(req.file.buffer);
                fileStream.push(null);
                const data = await uploadFile(fileStream, req.file.originalname);
                const linkImage = `https://lh3.googleusercontent.com/d/${data.id}=w1000`;
                await Image.updateByColumn('destinationId', id, linkImage);
            }
            const destination = await Destination.findByIdWithDetails(id);
            res.send({
                message: 'Update successfully',
                data: destination,
            });
        } catch (error) {
            console.log('Error updating destination:', error);
            res.status(500).send('Error updating destination');
        }
    }
    async delete(req, res) {
        const { id } = req.params;
        try {
            await Destination.deleteDestination(id);
            const destinations = await Destination.findAllDestination();
            return res.json({ message: 'Delete successful!', data: destinations });
        } catch (error) {
            console.error('Error deleting blog:', error);
            res.status(500).json({ message: 'An error occurred while deleting the blog.' });
        }
    }
}

export default new DestinationController();
