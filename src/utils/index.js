import randomstring from 'randomstring';
import bcrypt from 'bcrypt';
import fetch from 'node-fetch';

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

const encrypt = (value, length) => {
    const salt = bcrypt.genSaltSync(length);
    return bcrypt.hashSync(value, salt);
};

const convertVNDToUSD = async (amountInVND) => {
    const apiKey = 'eee238f5097ed89652d63ede'; // Thay thế bằng API key của bạn
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/VND`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.result === 'success') {
            const rate = data.conversion_rates.USD;
            const amountInUSD = amountInVND * rate;
            console.log(`${amountInVND} VND = ${amountInUSD.toFixed(2)} USD`);
            return amountInUSD;
        } else {
            console.error('Error fetching exchange rate data:', data);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};
export { filterRequestBody, generateOTP, encrypt, convertVNDToUSD };
