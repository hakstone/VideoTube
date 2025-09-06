// import mongoose from 'mongoose'
// import { DB_NAME } from '../constants.js'

// const connectDB = async () => {
//     try {
//         const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         // console.log(connectionInstance);

//         console.log(`\n MongoDB Connected !! DB Host : ${connectionInstance.connection.host}`)
//     } catch (error) {
//         console.log("MongoDB connection error: ", error)
//         process.exit(1)
//     }
// }

// export default connectDB
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const MONGODB_URI = `${process.env.MONGODB_URI}/${DB_NAME}`;

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
            maxPoolSize: 10,  // Consider tuning for serverless
        }).then((mongoose) => mongoose);
    }
    cached.conn = await cached.promise;
    return cached.conn;
};

export default connectDB;
