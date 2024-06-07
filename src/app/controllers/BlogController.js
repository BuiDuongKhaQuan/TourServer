import blogModel from '../../config/db/models/Blog.js';
import { Readable } from 'stream';
import { filterRequestBody } from '../../utils/index.js';
import { uploadFile } from '../../utils/google.js';
class BlogController {
    async get_all(req, res) {
        try {
            const blogs = await blogModel.get_all();
            if (!blogs) return res.status(401).json({ error: 'Blog does not exist!' });
            const blogsWithImages = await Promise.all(
                blogs.map(async (blog) => {
                    const image = await blogModel.find_image_by_id(blog.id);
                    return {
                        ...blog,
                        img: image ? image.image : null,
                    };
                }),
            );

            return res.json({ message: 'Get successful!', data: blogsWithImages });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    get_all_size(req, res) {
        let result = blogModel.get_all();
        result
            .then(function (value) {
                if (!value || value.length === 0) {
                    res.status(404).json({ error: 'No blogs found' });
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
            const blog = await blogModel.find_by_id(id);
            if (!blog) return res.status(401).json({ error: 'Blog does not exist!' });
            const image = await blogModel.find_image_by_id(id);
            const blogWithImage = {
                ...blog,
                img: image ? image.image : null,
            };
            return res.json({ message: 'Find successful!', data: blogWithImage });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async get_all_limit(req, res) {
        const { start, page } = req.query;
        try {
            const blogs = await blogModel.get_limit_offset(page, start);
            if (!blogs) return res.status(401).json({ error: 'Blog does not exist!' });
            const blogsWithImages = await Promise.all(
                blogs.map(async (blog) => {
                    const image = await blogModel.find_image_by_id(blog.id);
                    return {
                        ...blog,
                        img: image ? image.image : null,
                    };
                }),
            );

            return res.json({ message: 'Find successful!', data: blogsWithImages });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }
    async create(req, res) {
        const { topic, information, status } = req.body;
        try {
            if (!topic || !information || !status) return res.status(400).json({ error: 'Missing required fields!' });

            const newBlog = {
                topic,
                information,
                status,
                create_at: new Date(),
            };
            const blog = await blogModel.create(newBlog);
            const fileStream = new Readable();
            fileStream.push(req.file.buffer);
            fileStream.push(null);
            const data = await uploadFile(fileStream, req.file.originalname);
            const linkImage = `https://drive.google.com/thumbnail?id=${data.id}&sz=w1000`;
            await blogModel.upload_image_by_id(blog.id, linkImage);
            res.send({ message: 'Create successfully', data: { ...blog, img: linkImage } });
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
            let blog = null;
            if (Object.keys(blogData).length !== 0) {
                blog = await blogModel.update_by_id(id, blogData);
            }
            let linkImage = null;
            const imageBlog = await blogModel.find_image_by_id(id);
            if (req.file) {
                const fileStream = new Readable();
                fileStream.push(req.file.buffer);
                fileStream.push(null);
                const data = await uploadFile(fileStream, req.file.originalname);
                linkImage = `https://drive.google.com/thumbnail?id=${data.id}&sz=w1000`;
                if (imageBlog) {
                    await blogModel.update_image_by_id(id, linkImage);
                } else {
                    await blogModel.upload_image_by_id(id, linkImage);
                }
            }
            if (!blog) {
                blog = await blogModel.find_by_id(id);
            }
            res.send({
                message: 'Update successfully',
                data: {
                    ...blog,
                    img: linkImage ? linkImage : imageBlog.image, // Sử dụng liên kết hình ảnh đã tải lên nếu có
                },
            });
        } catch (error) {
            console.log('Error updating blog:', error);
            res.status(500).send('Error updating blog');
        }
    }
}

export default new BlogController();
