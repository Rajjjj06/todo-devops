import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const registerUser = async (userData) => {
    const response = await api.post("/register", userData);
    return response.data;
};

export const loginUser = async (userData) => {
    const response = await api.post("/login", userData);
    return response.data;
};

export const getUser = async () => {
    const response = await api.get("/me");
    return response.data;
};

export const createTodo = async (todoData) => {
    const response = await api.post("/", todoData);
    return response.data;
};

export const getTodos = async () => {
    const response = await api.get("/");
    return response.data;
};

export const updateTodo = async (todoData) => {
    const response = await api.put("/", todoData);
    return response.data;
};

export const deleteTodo = async (todoData) => {
    const response = await api.delete("/", { data: todoData });
    return response.data;
};

export const logoutUser = async () => {
    const response = await api.post("/logout");
    return response.data;
};

export default api;