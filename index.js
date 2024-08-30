require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./Routes/routes');
require('./db/connection');

const projectServer = express();
projectServer.use(cors());
projectServer.use(express.json());
projectServer.use(routes);

const PORT = process.env.PORT || 4000;
const HOST = '0.0.0.0'; // This will bind to all available network interfaces

projectServer.listen(PORT, HOST, () => {
    console.log(`______Project Server Started At http://${HOST}:${PORT}______`);
});

projectServer.get('/', (req, res) => {
    res.send(`<h1>Project started ...</h1>`);
});
