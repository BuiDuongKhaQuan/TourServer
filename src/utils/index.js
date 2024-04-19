import randomstring from 'randomstring';
import bcrypt from 'bcrypt';

const filterRequestBody = (body, fields) => {
    const filteredData = {};
    for (const field of fields) {
        if (body[field] !== undefined) {
            filteredData[field] = body[field];
        }
    }
    return filteredData;
};

const generateOTP = () => {
    return randomstring.generate({
        length: 6,
        charset: 'numeric',
    });
};

const encrypt = (value) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(value, salt);
};

export { filterRequestBody, generateOTP, encrypt };
