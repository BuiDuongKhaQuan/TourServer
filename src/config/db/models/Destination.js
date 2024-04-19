import Model from '../model.js';

class DestinationModel extends Model {
    constructor() {
        super('destinations');
    }
    update_by_id(id, tour) {
        return this.update('id', id, tour);
    }
    find_by_id(id) {
        return this.find('id', id);
    }
}

export default new DestinationModel();
