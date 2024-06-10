import { filterRequestBody } from '../../utils/index.js';

import { db } from '../models/index.js';

const Category = db.category;

class CategoryModel {
    async getAll(req, res) {
        try {
            const categorys = await Category.findAllCategory();
            if (!categorys) return res.status(401).json({ error: 'Categorys does not exist!' });
            return res.json({ message: 'Find successful!', data: categorys });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async getSize(req, res) {
        try {
            const size = await Category.getSize();
            return res.json({ message: 'Get size successful!', data: size });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async find(req, res) {
        const { id } = req.params;
        try {
            const category = await Category.findByIdWithDetails(id);
            if (!category) return res.status(401).json({ error: 'Category does not exist!' });
            return res.json({ message: 'Find successful!', data: category });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async getLimitOffset(req, res) {
        const { start, page } = req.query;
        try {
            const categorys = await Category.getLimitOffset(Number(page), Number(start));
            if (!categorys) return res.status(401).json({ error: 'Categorys does not exist!' });
            return res.json({ message: 'Find successful!', data: categorys });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }

    async create(req, res) {
        const { name } = req.body;
        console.log(req.body, req.file);
        try {
            if (!name) return res.status(400).json({ error: 'Missing required fields!' });
            const category = await Category.createCategory(req.body);
            res.send({ message: 'Create successfully', data: category });
        } catch (error) {
            console.log('Error creating category:', error);
            res.status(500).send('Error creating category');
        }
    }
    async update(req, res) {
        const { id } = req.params;
        const allowedFields = ['name'];
        const categoryData = filterRequestBody(req.body, allowedFields);
        try {
            await Category.updateById(id, categoryData);
            const category = await Category.findByIdWithDetails(id);
            res.send({
                message: 'Update successfully',
                data: category,
            });
        } catch (error) {
            console.log('Error updating category:', error);
            res.status(500).send('Error updating category');
        }
    }
    async delete(req, res) {
        const { id } = req.params;
        try {
            await Category.deleteCategory(id);
            const categorys = await Category.findAllCategory();
            return res.json({ message: 'Delete successful!', data: categorys });
        } catch (error) {
            console.error('Error deleting blog:', error);
            res.status(500).json({ message: 'An error occurred while deleting the blog.' });
        }
    }
}

export default new CategoryModel();
