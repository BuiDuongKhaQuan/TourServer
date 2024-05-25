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
    async update_by_id(id, user) {
        const data = await this.update('id', id, user);
        let imageData;
        if (user) {
            imageData = await imageModel.find_avatar(id);
        }
        return { ...data, avatar: imageData ? imageData.image : null };
    }
    update_by_email(email, user) {
        return this.update('email', email, user);
    }
    async find_by_email(email) {
        return this.find('email', email);
    }
    find_avatar_by_id(id) {
        return imageModel.find_avatar(id);
    }
}

export default new UserModel();
