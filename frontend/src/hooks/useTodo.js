import {useState, useCallback} from 'react';
import {createTodo, getTodos, updateTodo, deleteTodo} from '../service/api';

export const useTodo = () => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTodos = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getTodos();
            setTodos(Array.isArray(data) ? data : []);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const addTodo = useCallback(async (todoData) => {
        setLoading(true);
        setError(null);
        try {
            const data = await createTodo(todoData);
            setTodos((prevTodos) => [...prevTodos, data]);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const editTodo = useCallback(async (todoData) => {
        setLoading(true);
        setError(null);
        try {
            const data = await updateTodo(todoData);
            setTodos((prevTodos) => prevTodos.map((todo) => todo._id === data._id ? data : todo));
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const removeTodo = useCallback(async (todoData) => {
        setLoading(true);
        setError(null);
        try {
            await deleteTodo(todoData);
            setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== todoData.id));
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        todos,
        loading,
        error,
        fetchTodos,
        addTodo,
        editTodo,
        removeTodo,
    };
};
