import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const app = express();

dotenv.config();

const mongoDbAuth = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL_AUTH);
        console.log("----------> Connected to Auth DB!");
    } catch (error) {
        throw error;
    }
}

app.get('/', (request, response) => {
    response.send("hello from esm module!");
});

app.listen(process.env.PORT, () => {
    mongoDbAuth();
    console.log(`Node is avalable on port ${process.env.PORT}.`);
});