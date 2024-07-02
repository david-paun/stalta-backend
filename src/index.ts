import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import clearanceLevelRoute from './routes/clearanceLevel.js';
// import authRoute from './routes/auth.js';
// import userRoute from './routes/user.js';
import { CommandSucceededEvent } from 'mongodb';
import cookieParser from 'cookie-parser';
import { SuccessMessage } from './models/SuccessMessage.js';
import { ErrorMessage } from './models/ErrorMessage.js';

const app = express();
app.use(express.json());
app.use(cookieParser());

dotenv.config();

const mongoDbAuth = async (): Promise<void> => {
    const mongoUrlAuth = process.env.MONGO_URL_AUTH;

    if (!mongoUrlAuth) {
        throw new Error("MONGO_URL_AUTH environment variable is not defined");
    }

    try {
        await mongoose.connect(mongoUrlAuth);
        console.log("----------> Connected to Auth DB!");
    } catch (error) {
        console.error("Failed to connect to Auth DB", error);
        throw error;
    }
};

export default mongoDbAuth;


app.get('/', (request, response) => {
    response.send("hello from esm module!");
});

app.use("/api/clearanceLevel", clearanceLevelRoute);

// app.use("/api/auth", authRoute);

// app.use("/api/user", userRoute);

app.use((obj:SuccessMessage|ErrorMessage, req: Request, res: Response, next: NextFunction) => {
    const status = obj.status || 500;
    const message = obj.message || "Internal Server Error.";
    const success = [200, 201, 204].includes(status);
    const response = {
        success: success,
        status: status,
        message: message
    };
    if(obj instanceof ErrorMessage && obj.stack) {
        //response.stack = obj.stack;
    }
    else if(obj instanceof SuccessMessage){
    if(obj.data){
        //response.data = obj.data;
    }
    if(obj.cookies){
        for (let [key, value] of Object.entries(obj.cookies)) {
            res.cookie(key, value);
        }
    }
    }
    return res.status(status).json(response);
});


app.listen(process.env.PORT, () => {
    mongoDbAuth();
    console.log(`Node is avalable on port ${process.env.PORT}.`);
});