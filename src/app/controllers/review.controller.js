import { filterRequestBody } from '../../utils/index.js';

import { db } from '../models/index.js';

const Review = db.review;
const User = db.user;
const Image = db.image;

class ReviewController {
    async getAll(req, res) {
        try {
            const reviews = await Review.findAllReview();
            if (!reviews) return res.status(401).json({ error: 'Reviews does not exist!' });
            return res.json({ message: 'Find successful!', data: reviews });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async getSize(req, res) {
        try {
            const size = await Review.getSize();
            return res.json({ message: 'Get size successful!', data: size });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async find(req, res) {
        const { id } = req.params;
        try {
            const review = await Review.findByIdWithDetails(id);
            if (!review) return res.status(401).json({ error: 'Review does not exist!' });
            return res.json({ message: 'Find successful!', data: review });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async findAllByTourId(req, res) {
        const { tourId } = req.query;
        try {
            const review = await Review.findAllByColumn('tourId', tourId);
            if (!review) return res.status(401).json({ error: 'Review does not exist!' });
            return res.json({ message: 'Find successful!', data: review });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async getLimitOffset(req, res) {
        const { start, page } = req.query;
        try {
            const reviews = await Review.getLimitOffset(Number(page), Number(start));
            if (!reviews) return res.status(401).json({ error: 'Reviews does not exist!' });
            return res.json({ message: 'Find successful!', data: reviews });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }

    async create(req, res) {
        const { name, rate, message, email, status } = req.body;
        console.log(req.body);
        try {
            if (!name || !rate || !message || !status || !email)
                return res.status(400).json({ error: 'Missing required fields!' });
            const review = await Review.createReview(req.body);
            const user = await User.findByColumn('id', review.dataValues.userId);
            res.send({
                message: 'Evaluation of success',
                data: { ...review.dataValues, user: { name: user.name, avatar: user.avatar } },
            });
        } catch (error) {
            console.log('Error creating review:', error);
            res.status(500).send('Error creating review');
        }
    }
    async update(req, res) {
        const { id } = req.params;
        const allowedFields = ['name', 'trips', 'information', 'status'];
        const reviewData = filterRequestBody(req.body, allowedFields);
        try {
            if (Object.keys(reviewData).length !== 0) {
                await Review.updateById(id, reviewData);
            }
            if (req.file) {
                const fileStream = new Readable();
                fileStream.push(req.file.buffer);
                fileStream.push(null);
                const data = await uploadFile(fileStream, req.file.originalname);
                const linkImage = `https://lh3.googleusercontent.com/d/${data.id}=w1000`;
                await Image.updateByColumn('reviewId', id, linkImage);
            }
            const review = await Review.findByIdWithDetails(id);
            res.send({
                message: 'Update successfully',
                data: review,
            });
        } catch (error) {
            console.log('Error updating review:', error);
            res.status(500).send('Error updating review');
        }
    }
    async delete(req, res) {
        const { id } = req.params;
        try {
            await Review.deleteReview(id);
            const reviews = await Review.findAllReview();
            return res.json({ message: 'Delete successful!', data: reviews });
        } catch (error) {
            console.error('Error deleting blog:', error);
            res.status(500).json({ message: 'An error occurred while deleting the blog.' });
        }
    }
}

export default new ReviewController();
