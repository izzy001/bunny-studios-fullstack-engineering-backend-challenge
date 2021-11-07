const _ = require('lodash');
const { Task } = require('../models/task');
const { User, validate } = require('../models/user');

exports.getAllUsers = async (req, res) => {
    const users = await User.find().sort('name');
    res.send({
        message: 'All Users Retrieved',
        details: users
    });
};

exports.newUser = async (req, res) => {
    //validate user data
    const { error } = validate(req.body);
    if (error) return res.status(400).send({
        message: 'Incomplete data provided!',
        validation_error: error.details[0].message
    });

    //check if user exists
    let user = await User.findOne({ name: req.body.name });
    if (user) return res.status(400).send({
        details: 'This user already exists!'
    });

    user = new User(_.pick(req.body, 'name'));
    await user.save();
    res.send({
        message: 'new user created successfully!',
        details: _.pick(user, 'name')
    })

}

exports.updateUser = async (req, res) => {

    //validate user data
    const { error } = validate(req.body);
    if (error) return res.status(400).send({
        validation_error: error.details[0].message
    });

    const user = await User.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    if (!user) return res.status(404).send({
        details: 'This user does not exist!'
    });
    res.send({
        message: 'user updated successfully!',
        details: user
    });
};

exports.deleteUser = async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id);
    await Task.findOneAndDelete({ "user._id": req.params.id })
    if (!user) return res.status(404).send({
        details: 'This user does not exist!'
    });
    res.send({
        message: 'This user has been deleted successfully!',
        details: user
    });
}