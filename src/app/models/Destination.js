import Model from '../../config/db/model.js';

class DestinationModel extends Model {
    constructor() {
        super('destinations');
    }
}

export default new DestinationModel();
