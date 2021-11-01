const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        unique: true,
        lowercase: true
    }
});

//create schema for user
const User = new mongoose.model('User', userSchema);

//validate user data
function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required()
    });

    return schema.validate(user)
}

exports.userSchema = userSchema;
exports.User = User;
exports.validate = validateUser;