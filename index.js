import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import clearanceLevelRoute from './routes/clearanceLevel.js';
import authRoute from './routes/auth.js';
import userRoute from './routes/user.js';
import { CommandSucceededEvent } from 'mongodb';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookieParser());

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

app.use("/api/clearanceLevel", clearanceLevelRoute);

app.use("/api/auth", authRoute);

app.use("/api/user", userRoute);

app.use((obj, req, res, next) => {
    const status = obj.status || 500;
    const message = obj.message || "Internal Server Error.";
    const success = [200, 201, 204].includes(status);
    const response = {
        success: success,
        status: status,
        message: message
    };
    if(obj.stack) {
        response.stack = obj.stack;
    }
    else if(obj.data){
        response.data = obj.data;
    }
    if(obj.cookies){
        for (let [key, value] of Object.entries(obj.cookies)) {
            res.cookie(key, value);
        }
    }
    return res.status(status).json(response);
});


app.listen(process.env.PORT, () => {
    mongoDbAuth();
    console.log(`Node is avalable on port ${process.env.PORT}.`);
});