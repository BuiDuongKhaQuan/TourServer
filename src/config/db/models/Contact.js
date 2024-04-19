import Model from '../model.js';

class Contact extends Model {
    constructor() {
        super('contacts');
    }
    update_by_id(id, contact) {
        return this.update('id', id, contact);
    }
    find_by_id(id) {
        return this.find('id', id);
    }
}

export default new Contact();
