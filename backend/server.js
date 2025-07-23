const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://shahalshazz:shazz2001@cluster0.xn5hj.mongodb.net/task?retryWrites=true&w=majority&appName=Cluster0');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  due_date: { type: Date, required: true },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending',
  },
});

const Task = mongoose.model('Task', taskSchema);

// List all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a new task
app.post('/api/tasks', async (req, res) => {
  const { title, description, due_date, status } = req.body;
  if (!title || !due_date) {
    return res.status(400).json({ error: 'Title and due_date are required.' });
  }
  try {
    const task = new Task({ title, description, due_date, status });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a task
app.put('/api/tasks/:id', async (req, res) => {
  const { title, description, due_date, status } = req.body;
  if (!title || !due_date) {
    return res.status(400).json({ error: 'Title and due_date are required.' });
  }
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, due_date, status },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 