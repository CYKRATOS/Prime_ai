const express = require('express');
const router = express.Router();
const {
    getTasks,
    setTask,
    updateTask,
    deleteTask,
} = require('../controllers/task.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/').get(protect, getTasks).post(protect, setTask);
router.route('/:id').delete(protect, deleteTask).put(protect, updateTask);

module.exports = router;
