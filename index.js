import express from 'express';
import dotenv from 'dotenv';

const app = express();

const dotImport = dotenv.config();

app.get('/', (request, response) => {
    response.send("hello from esm module!");
});

app.listen(process.env.PORT, () => console.log(`Node is avalable on port ${process.env.PORT}.`));