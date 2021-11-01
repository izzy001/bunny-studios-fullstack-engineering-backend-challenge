const _ = require('lodash');
const { Task, validate, validateNewTask, validateSingleTask } = require('../models/task');
const { User } = require('../models/user');
const mongoose = require('mongoose');

exports.getUserTask = async (req, res) => {

    const user_id = req.params.id;
    const user_task = await Task.findOne({ "user._id": user_id });

    if (!user_task) return res.status(404).send({ message: 'Tasks not found for this user' });

    res.send({
        message: 'Tasks retrieved successfully',
        data: user_task
    });

};


exports.createNewTask = async (req, res) => {
    //create new task
    //Object Id Validation
    // if (!mongoose.Types.ObjectId.isValid(req.body.user_id))
    //     return res.status(404).send('Invalid user');

    //validate task data
    const { error } = validate(req.body);
    if (error) return res.status(400).send({
        validation_error: error.details[0].message
    });

    const user = await User.findById(req.body.user_id);
    if (!user) return res.status(400).send('Invalid user');

    let task = new Task({
        user: {
            _id: user._id,
            name: user.name,
        },
        tasks: {
            description: req.body.description
        }
    });

    await task.save()

    res.send(task);
};

//update a taskList
exports.updateTaskList = async (req, res) => {

    //validate new task to be added to task List
    const { error } = validateNewTask(req.body);
    if (error) return res.status(400).send({
        validation_error: error.details[0].message
    });

    //check if task ID exists
    const taskId = await Task.findById(req.params.id);
    // console.log('This is the taskId '+ taskId);
    if (!taskId) return res.status(404).send('Invalid task id');
    const task = await Task.findByIdAndUpdate(
        { _id: req.params.id },
        { $addToSet: { tasks: req.body.tasks } },
        { safe: true, multi: true, new: true }
    );

    res.send({
        message: 'Task List updated successfully',
        details: task
    });
};

//update a task status
exports.updateSingleTaskStatus = async (req, res) => {
    //validate new task to be added to task List
    const { error } = validateSingleTask(req.body);
    if (error) return res.status(400).send({
        validation_error: error.details[0].message
    });
    
    const task = await Task.findOneAndUpdate({ 'tasks._id': req.params.id }, { $set: { 'tasks.$.state': req.body.state } }, { new: true });
    if (!task) return res.status(404).send('Task not found');

    res.send({
        message: 'Task status updated successfully',
        details: task
    });
};

//delete a task for user
exports.deleteTask = async (req, res) => {
    //not included in requirements but will include
}