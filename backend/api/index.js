import connectDB from '../src/db/index.js';
import { app } from '../src/app.js';

let dbConnected = false;

export default async function handler(req, res) {
    if (!dbConnected) {
        await connectDB();
        dbConnected = true;
    }
    return app(req, res);
}
