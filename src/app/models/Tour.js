import Model from '../../config/db/model.js';

class TourModel extends Model {
    constructor() {
        super('tours');
    }
}

export default new TourModel();
