import { db } from '../models/index.js';
import secret from '../../config/auth.config.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const User = db.user;
const Role = db.role;
const { Op } = db.Sequelize;

export const signup = async (req, res) => {
    try {
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
        });

        if (req.body.roles) {
            const roles = await Role.findAll({
                where: {
                    name: {
                        [Op.or]: req.body.roles,
                    },
                },
            });

            await user.setRoles(roles);
            res.send({ message: 'User was registered successfully!' });
        } else {
            // user role = 1
            await user.setRoles([1]);
            res.send({ message: 'User was registered successfully!' });
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const signin = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                name: req.body.name,
            },
        });

        if (!user) {
            return res.status(404).send({ message: 'User Not found.' });
        }

        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: 'Invalid Password!',
            });
        }

        const token = jwt.sign({ id: user.id }, secret, {
            algorithm: 'HS256',
            allowInsecureKeySizes: true,
            expiresIn: 86400, // 24 hours
        });

        const roles = await user.getRoles();
        const authorities = roles.map((role) => 'ROLE_' + role.name.toUpperCase());

        res.status(200).send({
            id: user.id,
            name: user.name,
            email: user.email,
            roles: authorities,
            accessToken: token,
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};
