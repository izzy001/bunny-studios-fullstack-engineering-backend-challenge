const validateObjectId = require('../middleware/validateObjectId');
const express = require('express');
const router = express.Router();
const tasks = require('../controllers/tasks')

//all tasks routes
router.get('/:id', validateObjectId, tasks.getUserTask);
router.post('/', tasks.createNewTask);
router.post('/add-to-tasks-list/:id', validateObjectId, tasks.updateTaskList)
router.put('/:id', validateObjectId, tasks.updateSingleTaskStatus);
router.delete('/:id', tasks.deleteTask);

module.exports = router;