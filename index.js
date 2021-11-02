const winston = require('winston');
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors({
    origin: '*',
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}))
require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/validation')();
require('./startup/prod')(app)

const port = process.env.PORT || 8001;
const server = app.listen(port, () => winston.info(`listening on ${port}...`));

module.exports = server;