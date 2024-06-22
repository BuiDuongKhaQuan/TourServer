import { filterRequestBody } from '../../utils/index.js';
import { db } from '../models/index.js';

const Deals = db.deal;

class DealsController {
    async getAll(req, res) {
        try {
            const deals = await Deals.findAllDeals();
            if (!deals) return res.status(401).json({ error: 'Deals does not exist!' });
            return res.json({ message: 'Find successful!', data: deals });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async getSize(req, res) {
        try {
            const size = await Deals.getSize();
            return res.json({ message: 'Get size successful!', data: size });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async find(req, res) {
        const { id } = req.params;
        try {
            const deals = await Deals.findByIdWithDetails(id);
            if (!deals) return res.status(401).json({ error: 'Deals does not exist!' });
            return res.json({ message: 'Find successful!', data: deals });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async findAllByExpiryDate(req, res) {
        try {
            const deals = await Deals.findAllByExpiryDate();
            if (!deals) return res.status(401).json({ error: 'Deals does not exist!' });
            return res.json({ message: 'Find successful!', data: deals });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async getLimitOffset(req, res) {
        const { start, page } = req.query;
        try {
            const deals = await Deals.getLimitOffset(Number(page), Number(start));
            if (!deals) return res.status(401).json({ error: 'Dealss does not exist!' });
            return res.json({ message: 'Find successful!', data: deals });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }

    async create(req, res) {
        const { offer, quantity, expiryDate, status } = req.body;
        console.log(req.body);
        try {
            if (!offer || !quantity || !expiryDate || !status)
                return res.status(400).json({ error: 'Missing required fields!' });
            const deals = await Deals.createDeals(req.body);
            res.send({ message: 'Create successfully', data: deals.dataValues });
        } catch (error) {
            console.log('Error creating deals:', error);
            res.status(500).send('Error creating deals');
        }
    }
    async update(req, res) {
        const { id } = req.params;
        const allowedFields = ['offer', 'quantity', 'dateExpiration', 'status'];
        const dealsData = filterRequestBody(req.body, allowedFields);
        try {
            await Deals.updateById(id, dealsData);
            const deals = await Deals.findByIdWithDetails(id);
            res.send({
                message: 'Update successfully',
                data: deals,
            });
        } catch (error) {
            console.log('Error updating deals:', error);
            res.status(500).send('Error updating deals');
        }
    }
    async delete(req, res) {
        const { id } = req.params;
        try {
            await Deals.deleteDeals(id);
            const deals = await Deals.findAllDeals();
            return res.json({ message: 'Delete successful!', data: deals });
        } catch (error) {
            console.error('Error deleting blog:', error);
            res.status(500).json({ message: 'An error occurred while deleting the blog.' });
        }
    }
}

export default new DealsController();
