import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const defaultUri = process.env.DATABASE_URL || process.env.MONGO_URI || '';

/**
 * Fungsi untuk koneksi database Mongoose.
 * @param dbName Nama database yang ingin diakses
 */
export async function connectMongoDb(dbName: string, uri: string = defaultUri): Promise<void> {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(uri, { dbName });
            console.log('Successfully connected to MongoDB server (Mongoose)');
        }
    } catch (error) {
        console.error(`Error connecting to MongoDB database: ${dbName}`, error);
        throw error;
    }
}

/**
 * Fungsi untuk menutup koneksi jika aplikasi dimatikan
 */
export async function disconnectMongodb() {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB (Mongoose)');
    }
}