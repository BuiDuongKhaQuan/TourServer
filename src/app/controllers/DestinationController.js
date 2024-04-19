import express from 'express';
import multer from 'multer';
import destinationModel from '../../config/db/models/Destination.js';

const router = express.Router();
const upload = multer({ dest: 'src/uploads/' });
class DestinationController {
    get_limit_offset(req, res) {
        const { limit, offset } = req.params;
        let result = destinationModel.get_limit_offset(req.params ? limit : 20, req.params ? offset : 0);
        result
            .then(function (value) {
                console.log(value);
                res.json(value);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    get_all(req, res) {
        let result = destinationModel.get_all();
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
        let result = destinationModel.find_by_id(req.params.id);
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
    create(req, res) {
        const { location, trip, information } = req.body;
        const destination = {
            location,
            trip,
            information,
            status: 1,
            create_at: new Date(),
        };
        if (!location || !location || !trip || !information || !information)
            return res.status(400).json({ error: 'Missing required fields!!' });
        let result = destinationModel.create(destination);
        result
            .then(function (value) {
                console.log(value);
                res.json(value);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    update(req, res) {
        const allowedFields = ['location', 'trip', 'information', 'status'];
        const destinationData = filterRequestBody(req.body, allowedFields);
        let result = destinationModel.update_by_id(req.params.id, destinationData);
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
    delete(req, res) {
        let result = destinationModel.delete(req.params.id);
        result
            .then(function (value) {
                console.log(value);
                res.json({ message: 'Delete successful' });
            })
            .catch(function (error) {
                console.log(error);
                res.status(500).json({ error: error.message });
            });
    }
}

export default new DestinationController();
