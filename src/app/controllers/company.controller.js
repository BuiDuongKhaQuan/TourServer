import { db } from '../models/index.js';
import { filterRequestBody } from '../../utils/index.js';
import { Readable } from 'stream';
import { uploadFile } from '../../utils/google.js';

const Company = db.company;
const Image = db.image;

class CompanyController {
    async getAll(req, res) {
        try {
            const company = await Company.findAllCompany();
            if (!company) return res.status(401).json({ error: 'Companys does not exist!' });
            return res.json({ message: 'Find successful!', data: company });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async getSize(req, res) {
        try {
            const size = await Company.getSize();
            return res.json({ message: 'Get size successful!', data: size });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async find(req, res) {
        const { id } = req.params;
        try {
            const company = await Company.findByIdWithDetails(id);
            if (!company) return res.status(401).json({ error: 'Company does not exist!' });
            return res.json({ message: 'Find successful!', data: company });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async findAll(req, res) {
        const { column, value, start, page } = req.query;
        try {
            let company;

            if (start && page) {
                company = await Company.getLimitOffset(Number(page), Number(start));
            } else if (column && value) {
                company = await Company.findAllByColumn(column, value);
            } else {
                return res.status(400).json({ error: 'Missing required query parameters.' });
            }
            if (!company || company.length === 0) {
                return res.status(404).json({ error: 'Companys do not exist!' });
            }
            return res.json({ message: 'Find successful!', data: company });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async update(req, res) {
        const { id } = req.params;
        const allowedFields = ['logan', 'phone', 'email', 'address'];
        const destinationData = filterRequestBody(req.body, allowedFields);
        console.log(req.body);
        try {
            if (Object.keys(destinationData).length !== 0) {
                await Company.updateById(id, destinationData);
            }
            if (req.file) {
                const fileStream = new Readable();
                fileStream.push(req.file.buffer);
                fileStream.push(null);
                const data = await uploadFile(fileStream, req.file.originalname);
                const linkImage = `https://lh3.googleusercontent.com/d/${data.id}=w1000`;
                await Company.updateById(id, { logo: linkImage });
            }
            const destination = await Company.findByIdWithDetails(id);
            res.send({
                message: 'Update successfully',
                data: destination,
            });
        } catch (error) {
            console.log('Error updating destination:', error);
            res.status(500).send('Error updating destination');
        }
    }
}

export default new CompanyController();
