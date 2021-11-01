const validateObjectId = require('../middleware/validateObjectId');
const express = require('express');
const router = express.Router();
const users = require('../controllers/users')

//all user routes
router.get('/', users.getAllUsers);
router.post('/', users.newUser);
router.put('/:id', validateObjectId, users.updateUser);
router.delete('/:id', validateObjectId, users.deleteUser);

module.exports = router;