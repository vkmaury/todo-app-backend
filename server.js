const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost:27017/todo-app', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());

const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
