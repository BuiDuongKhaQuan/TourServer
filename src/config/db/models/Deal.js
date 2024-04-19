import Model from '../model.js';

class Deal extends Model {
    constructor() {
        super('deals');
    }
    update_by_id(id, deal) {
        return this.update('id', id, deal);
    }
    find_by_id(id) {
        return this.find('id', id);
    }
}

export default new Deal();
