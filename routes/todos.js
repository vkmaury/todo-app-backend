const express = require('express');
const Todo = require('../models/Todo');
const auth = require('../middleware/auth');

const router = express.Router();

// Create Todo
router.post('/', auth, async (req, res) => {
    const { title, description, isFavorite } = req.body;
    const todo = new Todo({
        userId: req.user.userId,
        title,
        description,
        isFavorite
    });
    try {
        await todo.save();
        res.status(201).send(todo);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get Todos with Pagination and Search
router.get('/', auth, async (req, res) => {
    const { page = 1, limit = 10, search = '' } = req.query;
    try {
        const todos = await Todo.find({ 
            userId: req.user.userId, 
            title: { $regex: search, $options: 'i' } 
        })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
        const count = await Todo.countDocuments({ userId: req.user.userId, title: { $regex: search, $options: 'i' } });
        res.json({
            todos,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get Single Todo
router.get('/:id', auth, async (req, res) => {
    try {
        const todo = await Todo.findOne({ _id: req.params.id, userId: req.user.userId });
        if (!todo) return res.status(404).send({ message: 'Todo not found' });
        res.send(todo);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Update Todo
router.put('/:id', auth, async (req, res) => {
    try {
        const todo = await Todo.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.userId },
            req.body,
            { new: true }
        );
        if (!todo) return res.status(404).send({ message: 'Todo not found' });
        res.send(todo);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete Todo
router.delete('/:id', auth, async (req, res) => {
    try {
        const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
        if (!todo) return res.status(404).send({ message: 'Todo not found' });
        res.send({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
