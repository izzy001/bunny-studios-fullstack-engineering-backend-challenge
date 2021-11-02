const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function () {
    //connect to mongodb server
    //const db = "mongodb://localhost/bunny-studios";
    const db = config.get('db')
    mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            winston.info(`Connected to ${db} ...`);
        });
}