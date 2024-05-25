import Model from '../model.js';
import imageModel from '../models/Image.js';

class TourModel extends Model {
    constructor() {
        super('tours');
    }
    update_by_id(id, tour) {
        return this.update('id', id, tour);
    }
    find_by_id(id) {
        return this.find('id', id);
    }
    upload_image_by_id(tour_id, image) {
        return imageModel.create({ tour_id, image });
    }
    update_image_by_id(tour_id, image) {
        return imageModel.update_tour_image(tour_id, image);
    }
    find_image_by_id(id) {
        return imageModel.find_tour_image(id);
    }
}

export default new TourModel();
