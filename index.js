import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import roleRoute from './routes/role.js';
import authRoute from './routes/auth.js';

const app = express();
app.use(express.json());

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

app.use("/api/role", roleRoute);

app.use("/api/auth", authRoute);

app.use((err, req, res, next) => {
    console.error(err.stack); // Log error stack trace to the console
    res.status(500).send('Something broke!'); // Send a 500 response to the client
});

app.listen(process.env.PORT, () => {
    mongoDbAuth();
    console.log(`Node is avalable on port ${process.env.PORT}.`);
});