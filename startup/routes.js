const express = require('express');
const error = require('../middleware/error');
const userRouter = require('../routes/users-route');
const taskRouter = require('../routes/tasks-route');

module.exports = function(app) {
    app.use(express.json());
    app.use('/api/users', userRouter);
    app.use('/api/tasks', taskRouter);
      //error middleware
      app.use(error);
}