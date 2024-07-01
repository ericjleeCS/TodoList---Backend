const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost/todoapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB connected successfully");

    const TodoSchema = new mongoose.Schema({
        task: String,
        completed: Boolean,
        isEditing: Boolean
    });

    const Todo = mongoose.model('Todo', TodoSchema);

    // Define routes after successful connection
    app.get('/todos', async (req, res) => {
        try {
            const todos = await Todo.find();
            res.json(todos);
        } catch (error) {
            console.error("Error fetching todos:", error);
            res.status(500).json({ message: error.message });
        }
    });

    app.post('/todos', async (req, res) => {
        const newTodo = new Todo({
            task: req.body.task,
            completed: false,
            isEditing: false
        });
        try {
            await newTodo.save();
            res.status(201).json(newTodo);
        } catch (error) {
            console.error("Error creating new todo:", error);
            res.status(400).json({ message: error.message });
        }
    });

    app.put('/todos/:id', async (req, res) => {
        const todoId = req.params.id;
        try {
            const updatedTodo = await Todo.findByIdAndUpdate(todoId, req.body, { new: true });
            if (!updatedTodo) {
                return res.status(404).json({ message: 'Todo not found' });
            }
            res.json(updatedTodo);
        } catch (error) {
            console.error(`Error updating todo with id ${todoId}:`, error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    app.delete('/todos/:id', async (req, res) => {
        const todoId = req.params.id;
        console.log(`Deleting todo with id: ${todoId}`); 
        try {
            const deletedTodo = await Todo.findByIdAndDelete(todoId);
            if (!deletedTodo) {
                return res.status(404).json({ message: 'Todo not found' });
            }
            res.json({ message: 'Todo deleted successfully' });
        } catch (error) {
            console.error("Error deleting todo:", error);
            res.status(500).json({ message: error.message });
        }
    });

    // Start server
    const PORT = 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

}).catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit with failure
});
