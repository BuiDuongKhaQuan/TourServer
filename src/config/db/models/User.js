import Model from '../model.js';
import { connection } from '../connect.js';

class UserModel extends Model {
    constructor() {
        super('users');
    }
}

export default new UserModel();
