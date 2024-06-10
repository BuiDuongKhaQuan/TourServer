import { filterRequestBody } from '../../utils/index.js';
import { sendEmail } from '../../utils/sendEmails.js';
import { db } from '../models/index.js';

const Contact = db.contact;

class TourController {
    async getAll(req, res) {
        try {
            const contacts = await Contact.findAllContact();
            if (!contacts) return res.status(401).json({ error: 'Contacts does not exist!' });
            return res.json({ message: 'Find successful!', data: contacts });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async getSize(req, res) {
        try {
            const size = await Contact.getSize();
            return res.json({ message: 'Get size successful!', data: size });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async find(req, res) {
        const { id } = req.params;
        try {
            const contact = await Contact.findByIdWithDetails(id);
            if (!contact) return res.status(401).json({ error: 'Contact does not exist!' });
            return res.json({ message: 'Find successful!', data: contact });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async getLimitOffset(req, res) {
        const { start, page } = req.query;
        try {
            const contacts = await Contact.getLimitOffset(Number(page), Number(start));
            if (!contacts) return res.status(401).json({ error: 'Contacts does not exist!' });
            return res.json({ message: 'Find successful!', data: contacts });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }

    async create(req, res) {
        const { name, email, phone, topic, message } = req.body;
        console.log(req.body, req.file);
        try {
            if (!name || !email || !phone || !topic || !message)
                return res.status(400).json({ error: 'Missing required fields!' });
            const contact = await Contact.createContact({ ...req.body, status: 1 });
            res.send({ message: 'Create successfully', data: contact.dataValues });
        } catch (error) {
            console.log('Error creating contact:', error);
            res.status(500).send('Error creating contact');
        }
    }
    async update(req, res) {
        const { id } = req.params;
        const allowedFields = ['name', 'email', 'phone', 'topic', 'message', 'status'];
        const contactData = filterRequestBody(req.body, allowedFields);
        try {
            await Contact.updateById(id, contactData);
            const contact = await Contact.findByIdWithDetails(id);
            res.send({
                message: 'Update successfully',
                data: contact,
            });
        } catch (error) {
            console.log('Error updating contact:', error);
            res.status(500).send('Error updating contact');
        }
    }
    async answer(req, res) {
        const { id } = req.params;
        const { email, message, topic } = req.body;
        console.log('answer', id, email, message, topic);
        try {
            await sendEmail({
                to: email,
                subject: topic,
                message: message,
            });
            await Contact.updateById(id, { status: 2 });
            res.send({
                message: 'Answer successfully',
            });
        } catch (error) {
            console.log('Error updating contact:', error);
            res.status(500).send('Error updating contact');
        }
    }
    async delete(req, res) {
        const { id } = req.params;
        try {
            await Contact.deleteContact(id);
            const contacts = await Contact.findAllContact();
            return res.json({ message: 'Delete successful!', data: contacts });
        } catch (error) {
            console.error('Error deleting blog:', error);
            res.status(500).json({ message: 'An error occurred while deleting the blog.' });
        }
    }
}

export default new TourController();
