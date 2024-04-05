import Model from '../../config/db/model.js';

class BlogModel extends Model {
    constructor() {
        super('blogs');
    }
}

export default new BlogModel();
