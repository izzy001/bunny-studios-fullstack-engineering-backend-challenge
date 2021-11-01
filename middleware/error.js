const winston = require('winston');

module.exports = function (err, res, next) {
    winston.error(err.message, err);
    res.status(500).send('Something failed!');
    next();
}