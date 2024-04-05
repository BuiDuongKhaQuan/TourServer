import Model from '../../config/db/model.js';

class UserModel extends Model {
    constructor() {
        super('users');
    }
}

export default new UserModel();
