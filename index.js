const express = require('express');

const app = express();

app.get('/', (request, response) => {
    response.send("hello node");
});

app.listen(3000, () => console.log('Node is avalable on port 3000.'));