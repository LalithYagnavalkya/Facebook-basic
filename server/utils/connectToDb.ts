import mongoose from 'mongoose'
import { config } from 'dotenv';
config({
    path: './config/config.env'
})
const dbString = <string>process.env.MONGO_CONNECTION_STRING;

const connectToDb = async () => {
    try {
        await mongoose.connect(dbString);
        return Promise.resolve({ error: false });
    } catch (error: any) {
        console.error('Error connecting to the database:', error.message);
        return Promise.reject(error);
    }
};

export default connectToDb;


