import Model from '../model.js';
class ImageModel extends Model {
    constructor() {
        super('images');
    }
    update_destination_image(id, image) {
        return this.update('destination_id', id, { image });
    }
    find_destination_image(id) {
        return this.find('destination_id', id);
    }
    find_avatar(id) {
        return this.find('user_id', id);
    }
    update_avatar(id, image) {
        return this.update('user_id', id, { image });
    }
    find_blog_image(id) {
        return this.find('blog_id', id);
    }
    find_tour_image(id) {
        return this.find('tour_id', id);
    }
    find_logo(id) {
        return this.find('company_id', id);
    }
}

export default new ImageModel();