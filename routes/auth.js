const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = new User({ username, password });
        await user.save();
        res.status(201).send({ message: 'User created successfully' });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/signin', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).send({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id }, 'YOUR_SECRET_KEY');
        res.send({ token });
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
