import { db } from '../app/models/index.js';

const { ROLES, user: User } = db;

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
    try {
        // Email
        const user = await User.findOne({
            where: {
                email: req.body.email,
            },
        });

        if (user) {
            return res.status(400).send({
                message: 'Failed! Email is already in use!',
            });
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            message: 'An error occurred while checking duplicate name or email.',
        });
    }
};

const checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                return res.status(400).send({
                    message: 'Failed! Role does not exist = ' + req.body.roles[i],
                });
            }
        }
    }

    next();
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail,
    checkRolesExisted,
};

export default verifySignUp;
