import Model from '../model.js';

class BookTour extends Model {
    constructor() {
        super('book_tour');
    }
    update_by_id(id, book_tour) {
        return this.update('id', id, book_tour);
    }
    find_by_id(id) {
        return this.find('id', id);
    }
}

export default new BookTour();
