import jwt from 'jsonwebtoken';
import secret from '../config/auth.config.js';
import { db } from '../app/models/index.js';

const { user: User } = db;

const verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'];
    console.log('token', token);
    if (!token) {
        return res.status(403).send({
            message: 'No token provided!',
        });
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: 'Unauthorized!',
            });
        }
        req.userId = decoded.id;
        next();
    });
};

const isAdmin = (req, res, next) => {
    User.findByPk(req.userId).then((user) => {
        user.getRoles().then((roles) => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === 'admin') {
                    next();
                    return;
                }
            }

            res.status(403).send({
                message: 'Require Admin Role!',
            });
        });
    });
};

const isModerator = (req, res, next) => {
    User.findByPk(req.userId).then((user) => {
        user.getRoles().then((roles) => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === 'moderator') {
                    next();
                    return;
                }
            }

            res.status(403).send({
                message: 'Require Moderator Role!',
            });
        });
    });
};

const isModeratorOrAdmin = (req, res, next) => {
    User.findByPk(req.userId).then((user) => {
        user.getRoles().then((roles) => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === 'moderator' || roles[i].name === 'admin') {
                    next();
                    return;
                }
            }

            res.status(403).send({
                message: 'Require Moderator or Admin Role!',
            });
        });
    });
};

const authJwt = {
    verifyToken,
    isAdmin,
    isModerator,
    isModeratorOrAdmin,
};

export default authJwt;
