import Model from '../model.js';

class Review extends Model {
    constructor() {
        super('reviews');
    }
    update_by_id(id, review) {
        return this.update('id', id, review);
    }
    find_by_id(id) {
        return this.find('id', id);
    }
}

export default new Review();
