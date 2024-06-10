import { filterRequestBody } from '../../utils/index.js';
import { db } from '../models/index.js';

const Ticket = db.ticket;

class TicketController {
    async getAll(req, res) {
        try {
            const tickets = await Ticket.findAllTicket();
            if (!tickets) return res.status(401).json({ error: 'Tickets does not exist!' });
            return res.json({ message: 'Find successful!', data: tickets });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async getSize(req, res) {
        try {
            const size = await Ticket.getSize();
            return res.json({ message: 'Get size successful!', data: size });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async find(req, res) {
        const { id } = req.params;
        try {
            const ticket = await Ticket.findByIdWithDetails(id);
            if (!ticket) return res.status(401).json({ error: 'Ticket does not exist!' });
            return res.json({ message: 'Find successful!', data: ticket });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async getLimitOffset(req, res) {
        const { start, page } = req.query;
        try {
            const tickets = await Ticket.getLimitOffset(Number(page), Number(start));
            if (!tickets) return res.status(401).json({ error: 'Tickets does not exist!' });
            return res.json({ message: 'Find successful!', data: tickets });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }

    async create(req, res) {
        const { type, value, status } = req.body;
        try {
            if (!type || !value || !status) return res.status(400).json({ error: 'Missing required fields!' });
            const ticket = await Ticket.createTicket(req.body);
            res.send({ message: 'Create successfully', data: ticket });
        } catch (error) {
            console.log('Error creating ticket:', error);
            res.status(500).send('Error creating ticket');
        }
    }
    async update(req, res) {
        const { id } = req.params;
        const allowedFields = ['type', 'value', 'status'];
        const ticketData = filterRequestBody(req.body, allowedFields);
        try {
            await Ticket.updateById(id, ticketData);
            const ticket = await Ticket.findByIdWithDetails(id);
            res.send({
                message: 'Update successfully',
                data: ticket,
            });
        } catch (error) {
            console.log('Error updating ticket:', error);
            res.status(500).send('Error updating ticket');
        }
    }
    async delete(req, res) {
        const { id } = req.params;
        try {
            await Ticket.deleteTicket(id);
            const tickets = await Ticket.findAllTicket();
            return res.json({ message: 'Delete successful!', data: tickets });
        } catch (error) {
            console.error('Error deleting blog:', error);
            res.status(500).json({ message: 'An error occurred while deleting the blog.' });
        }
    }
}

export default new TicketController();
