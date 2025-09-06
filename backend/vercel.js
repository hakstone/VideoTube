import connectDB from './src/db/index.js';
import { app } from './src/app.js';

export default async function handler(req, res) {
    await connectDB();
    app(req, res);
}
