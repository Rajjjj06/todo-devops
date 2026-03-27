import express from "express";
import { protect } from "../middlewares/auth.js";
import { createTodo, getTodos, updateTodo, deleteTodo } from "../controllers/todo.controller.js";

const router = express.Router();

router.post("/", protect, createTodo);
router.get("/", protect, getTodos);
router.put("/", protect, updateTodo);
router.delete("/", protect, deleteTodo);

export default router;