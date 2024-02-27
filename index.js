const express = require('express');

const app = express();

const dotenv = require('dotenv').config();

app.get('/', (request, response) => {
    response.send("hello node");
});

app.listen(process.env.PORT, () => console.log(`Node is avalable on port ${process.env.PORT}.`));