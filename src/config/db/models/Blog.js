import Model from '../model.js';
import imageModel from '../models/Image.js';

class BlogModel extends Model {
    constructor() {
        super('blogs');
    }
    update_by_id(id, blog) {
        return this.update('id', id, blog);
    }
    find_by_id(id) {
        return this.find('id', id);
    }
    upload_image_by_id(blog_id, image) {
        return imageModel.create({ blog_id, image });
    }
    update_image_by_id(blog_id, image) {
        return imageModel.update_blog_image(blog_id, image);
    }
    find_image_by_id(id) {
        return imageModel.find_blog_image(id);
    }
}

export default new BlogModel();
