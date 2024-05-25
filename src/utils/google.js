import dotenv from 'dotenv';
import { google } from 'googleapis';
import key from '../../key.json' assert { type: 'json' };
dotenv.config();

const SCOPE = ['https://www.googleapis.com/auth/drive'];

const uploadFile = async (image, name) => {
    try {
        const authClient = await authorize();
        const driver = google.drive({
            version: 'v3',
            auth: authClient,
        });
        const createFile = await driver.files.create({
            resource: {
                name,
                parents: ['1SRMxWlqILPuMPFKUSPYcrok488RmGmzV'],
            },
            media: {
                mimeType: 'image/jpg',
                body: image,
            },
            fields: 'id, webViewLink',
        });
        return createFile.data;
    } catch (error) {
        console.log(error);
    }
};
const authorize = async () => {
    const jwtClient = new google.auth.JWT(key.client_email, null, key.private_key, SCOPE);
    try {
        await jwtClient.authorize();
        console.log('Kết nối Google OAuth2 thành công!');
        return jwtClient;
    } catch (error) {
        console.error('Lỗi kết nối Google OAuth2:', error);
        throw error;
    }
};
export { uploadFile };
