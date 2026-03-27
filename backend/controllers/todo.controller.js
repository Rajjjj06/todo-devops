import Todo from "../models/todo.js";

export const createTodo = async (req, res) => {
    try {
        
        const userId = req.user.id;
        if(!userId){
            return res.status(401).json({ message: "Not authorized, no token provided" });
        }

        const { title } = req.body;
        if(!title){
            return res.status(400).json({ message: "Title is required" });
        }

        const todo = await Todo.create({ title, user: userId });
        res.status(201).json(todo);
    } catch (error) {
        console.error("Create todo error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const getTodos = async (req, res) => {
    try {
        const userId = req.user.id;
        if(!userId){
            return res.status(401).json({ message: "Not authorized, no token provided" });
        }

        const todos = await Todo.find({ user: userId });
        res.status(200).json(todos);
    } catch (error) {
        console.error("Get todos error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const updateTodo = async (req, res) => {
    try {
        const userId = req.user.id;
        if(!userId){
            return res.status(401).json({ message: "Not authorized, no token provided" });
        }

        const { id, title, completed } = req.body;
        if(!id){
            return res.status(400).json({ message: "Todo ID is required" });
        }

        const todo = await Todo.findById(id);
        if(!todo){
            return res.status(404).json({ message: "Todo not found" });
        }

        if(todo.user.toString() !== userId){
            return res.status(401).json({ message: "Not authorized" });
        }

        todo.title = title || todo.title;
        todo.completed = completed !== undefined ? completed : todo.completed;

        await todo.save();
        res.status(200).json(todo);
    } catch (error) {
        console.error("Update todo error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const deleteTodo = async (req, res) => {
    try {
        const userId = req.user.id;
        if(!userId){
            return res.status(401).json({ message: "Not authorized, no token provided" });
        }

        const { id } = req.body;
        if(!id){
            return res.status(400).json({ message: "Todo ID is required" });
        }

        const todo = await Todo.findById(id);
        if(!todo){
            return res.status(404).json({ message: "Todo not found" });
        }

        if(todo.user.toString() !== userId){
            return res.status(401).json({ message: "Not authorized" });
        }

        await todo.deleteOne();
        res.status(200).json({ message: "Todo deleted successfully" });
    } catch (error) {
        console.error("Delete todo error:", error);
        res.status(500).json({ message: "Server error" });
    }
}
