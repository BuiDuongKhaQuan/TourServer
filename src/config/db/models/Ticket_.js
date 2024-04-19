import Model from '../model.js';

class Ticket extends Model {
    constructor() {
        super('tickets');
    }
    update_by_id(id, ticket) {
        return this.update('id', id, ticket);
    }
    find_by_id(id) {
        return this.find('id', id);
    }
}

export default new Ticket();
