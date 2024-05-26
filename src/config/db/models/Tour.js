import Model from '../model.js';
import imageModel from '../models/Image.js';
import destinationModel from '../models/Destination.js';
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
    update_all_image_by_id(tour_id, image, image_id) {
        return imageModel.update_tour_all_image(tour_id, image, image_id);
    }
    find_image_by_id(id) {
        return imageModel.find_tour_image(id);
    }
    find_location(id) {
        return destinationModel.find_by_id(id);
    }
}

export default new TourModel();
