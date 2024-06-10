import express from 'express';
import multer from 'multer';
import { filterRequestBody } from '../../utils/index.js';

const router = express.Router();
const upload = multer({ dest: 'src/uploads/' });
class TourController {
    get_all(req, res) {
        let result = companyModel.get_all();
        result
            .then(function (value) {
                console.log(value);
                res.json(value);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    find(req, res) {
        let result = companyModel.find_by_id(req.params.id);
        result
            .then(function (value) {
                console.log(value);
                res.json(value);
            })
            .catch(function (error) {
                console.log(error);
                res.status(500).json({ error: error.message });
            });
    }
    update(req, res) {
        const allowedFields = ['logo', 'logan', 'phone', 'email', 'address', 'social'];
        const companyData = filterRequestBody(req.body, allowedFields);
        let result = companyModel.update_by_id(req.params.id, companyData);
        result
            .then(function (value) {
                console.log(value);
                res.json(value);
            })
            .catch(function (error) {
                console.log(error);
                res.status(500).json({ error: error.message });
            });
    }
}

export default new TourController();
