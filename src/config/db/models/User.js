import Model from '../model.js';
import imageModel from '../models/Image.js';
class UserModel extends Model {
    constructor() {
        super('users');
    }
    update_avatar_by_id(user_id, image) {
        return imageModel.update_avatar(user_id, image);
    }
    upload_avatar_by_id(user_id, image) {
        return imageModel.create({ user_id, image });
    }
    get_image_by_id(id) {
        return this.get_image_by_id('user_id', id);
    }
    update_by_id(id, user) {
        return this.update('id', id, user);
    }
    update_by_email(email, user) {
        return this.update('email', email, user);
    }
    async find_by_email(email) {
        const user = await this.find('email', email);
        const imageData = await imageModel.find_avatar(user.id);
        return { ...user, avatar: imageData.image };
    }
    find_avatar_by_id(id) {
        return imageModel.find_avatar(id);
    }
}

export default new UserModel();
