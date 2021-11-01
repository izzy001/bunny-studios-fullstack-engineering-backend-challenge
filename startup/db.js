const winston = require('winston');
const mongoose = require('mongoose');

module.exports = function () {
    //connect to mongodb server
    const db = "mongodb://localhost/bunny-studios";
    mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            winston.info(`Connected to ${db} ...`);
        });
}