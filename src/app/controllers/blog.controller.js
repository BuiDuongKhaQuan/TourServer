import { Readable } from 'stream';
import { filterRequestBody } from '../../utils/index.js';
import { uploadFile } from '../../utils/google.js';
import { Sequelize, db } from '../models/index.js';

const Blog = db.blog;
const Image = db.image;

class BlogController {
    async getAll(req, res) {
        try {
            const blogs = await Blog.findAllBlog();
            if (!blogs) return res.status(401).json({ error: 'Blogs does not exist!' });
            return res.json({ message: 'Find successful!', data: blogs });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async getSize(req, res) {
        try {
            const size = await Blog.getSize();
            return res.json({ message: 'Get size successful!', data: size });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async find(req, res) {
        const { id } = req.params;
        try {
            const blog = await Blog.findByIdWithDetails(id);
            if (!blog) return res.status(401).json({ error: 'Blog does not exist!' });
            return res.json({ message: 'Find successful!', data: blog });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async getLimitOffset(req, res) {
        const { start, page } = req.query;
        try {
            const blogs = await Blog.getLimitOffset(Number(page), Number(start));
            if (!blogs) return res.status(401).json({ error: 'Blogs does not exist!' });
            return res.json({ message: 'Find successful!', data: blogs });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async search(req, res) {
        try {
            const { name } = req.body;
            console.log(name);
            const searchCriteria = {};
            if (name) {
                searchCriteria.topic = { [Sequelize.Op.like]: `%${name}%` };
            }
            const { count, rows } = await Blog.search(searchCriteria);
            if (!rows || rows.length === 0) {
                return res.json({ message: 'Blog do not exist!', data: rows });
            }
            return res.json({ message: 'Find successful!', data: rows, total: count });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async create(req, res) {
        const { topic, information, status } = req.body;
        try {
            if (!topic || !information || !status || !req.file)
                return res.status(400).json({ error: 'Missing required fields!' });
            const blog = await Blog.createBlog(req.body);
            const fileStream = new Readable();
            fileStream.push(req.file.buffer);
            fileStream.push(null);
            const data = await uploadFile(fileStream, req.file.originalname);
            const linkImage = `https://lh3.googleusercontent.com/d/${data.id}=w1000`;
            const image = await Image.uploadImageByColumn('blogId', blog.dataValues.id, linkImage);
            res.send({ message: 'Create successfully', data: { ...blog.dataValues, image } });
        } catch (error) {
            console.log('Error creating blog:', error);
            res.status(500).send('Error creating blog');
        }
    }
    async update(req, res) {
        const { id } = req.params;
        const allowedFields = ['topic', 'information', 'status'];
        const blogData = filterRequestBody(req.body, allowedFields);

        try {
            if (Object.keys(blogData).length !== 0) {
                await Blog.updateById(id, blogData);
            }
            if (req.file) {
                const fileStream = new Readable();
                fileStream.push(req.file.buffer);
                fileStream.push(null);
                const data = await uploadFile(fileStream, req.file.originalname);
                const linkImage = `https://lh3.googleusercontent.com/d/${data.id}=w1000`;
                await Image.updateByColumn('blogId', id, linkImage);
            }
            const blog = await Blog.findByIdWithDetails(id);
            res.send({
                message: 'Update successfully',
                data: blog,
            });
        } catch (error) {
            console.log('Error updating blog:', error);
            res.status(500).send('Error updating blog');
        }
    }
    async delete(req, res) {
        const { id } = req.params;
        try {
            await Blog.deleteBlog(id);
            const blogs = await Blog.findAllBlog();
            return res.json({ message: 'Delete successful!', data: blogs });
        } catch (error) {
            console.error('Error deleting blog:', error);
            res.status(500).json({ message: 'An error occurred while deleting the blog.' });
        }
    }
}

export default new BlogController();
