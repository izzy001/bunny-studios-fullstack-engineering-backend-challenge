const mongoose = require('mongoose');
const Joi = require('joi');
//const { userSchema } = require('./user');
Joi.objectId = require('joi-objectid')(Joi);

//create schema for tasks
const taskSchema = new mongoose.Schema({
    user: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true
            }
        })
    },
    tasks: [
        {
            description: {
                type: String,
                required: true,
            },
            state: {
                type: String,
                required: true,
                default: 'To-Do'
            }
        }
    ]
});

// taskSchema.statics.lookup = function(user_id, task_id){
//     return this.findOne({
//         'user._id': user_id,
//         'tasks._id': task_id
//     });
// };

const Task = new mongoose.model('Task', taskSchema);

//validate task request
function validateTask(task) {
    const schema = Joi.object({
        description: Joi.string().required(),
        state: Joi.string().default('To-Do'),
        user_id: Joi.objectId().required()
    });
    return schema.validate(task);
};

//validate update task list
function validateNewTask(task){
    const schema = Joi.object({
        tasks: Joi.object().required(),
    });
    return schema.validate(task);
}

//validate a single task data
function validateSingleTask(task){
    const schema = Joi.object({
        state: Joi.string().valid('To-Do', 'done').required()
    });
    return schema.validate(task)
}


exports.Task = Task;
exports.validate = validateTask;
exports.validateNewTask = validateNewTask;
exports.validateSingleTask = validateSingleTask;
