import Model from '../model.js';

class BlogModel extends Model {
    constructor() {
        super('blogs');
    }
    get_image_by_id(id) {
        return this.get_image_by_id('blog_id', id);
    }
    update_by_id(id, tour) {
        return this.update('id', id, tour);
    }
    find_by_id(id) {
        return this.find('id', id);
    }
}

export default new BlogModel();
