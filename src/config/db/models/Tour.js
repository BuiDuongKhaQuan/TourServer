import Model from '../model.js';

class TourModel extends Model {
    constructor() {
        super('tours');
    }
    get_image_by_id(id) {
        return this.get_image_by_id('tour_id', id);
    }
    update_by_id(id, tour) {
        return this.update('id', id, tour);
    }
    find_by_id(id) {
        return this.find('id', id);
    }
}

export default new TourModel();
