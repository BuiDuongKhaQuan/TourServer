import Model from '../model.js';
import imageModel from '../models/Image.js';

class DestinationModel extends Model {
    constructor() {
        super('destinations');
    }
    update_by_id(id, destination) {
        return this.update('id', id, destination);
    }
    find_by_id(id) {
        return this.find('id', id);
    }
    upload_image_by_id(destination_id, image) {
        return imageModel.create({ destination_id, image });
    }
    update_image_by_id(destination_id, image) {
        return imageModel.update_destination_image(destination_id, image);
    }
    find_image_by_id(id) {
        return imageModel.find_destination_image(id);
    }
}

export default new DestinationModel();
