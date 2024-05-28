import { connection } from '../connect.js';
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
    find_all_by_idUser(idUser, status) {
        let cThis = this;
        return new Promise(function (myResolve, myReject) {
            connection.query(
                'SELECT * FROM ?? WHERE id_user = ? AND status = ?',
                [cThis.table, idUser, status],
                function (error, result) {
                    if (error) throw error;
                    myResolve(result);
                },
            );
        });
    }
}

export default new BookTour();
