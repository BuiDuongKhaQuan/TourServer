import Model from '../model.js';

class Company extends Model {
    constructor() {
        super('company');
    }
    get_logo_by_id(id) {
        return this.get_image_by_id('company_id', id);
    }
    update_by_id(id, company) {
        return this.update('id', id, company);
    }
    find_by_id(id) {
        return this.find('id', id);
    }
}

export default new Company();
