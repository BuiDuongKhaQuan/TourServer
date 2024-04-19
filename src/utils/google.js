import dotenv from 'dotenv';
import { google } from 'googleapis';
dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const driver = google.drive({
    version: 'v3',
    auth: oauth2Client,
});

const uploadFile = async (image, name) => {
    try {
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

export { uploadFile };
