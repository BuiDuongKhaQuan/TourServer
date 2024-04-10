import randomstring from 'randomstring';

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

export { filterRequestBody, generateOTP };
