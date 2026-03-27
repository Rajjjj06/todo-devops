import { createContext, useState, useEffect } from "react";
import { loginUser, registerUser, getUser as fetchUser } from "../service/api";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const userData = await fetchUser();
                    setUser(userData);
                } catch (error) {
                    console.error("Failed to fetch user", error);
                    localStorage.removeItem("token");
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (credentials) => {
        const data = await loginUser(credentials);
        localStorage.setItem("token", data.token);
        setUser({ _id: data._id, name: data.name });
    }

    const register = async (userData) => {
        const data = await registerUser(userData);
        localStorage.setItem("token", data.token);
        setUser({ _id: data._id, name: data.name });
    }

    const logout = async () => {
        localStorage.removeItem("token");
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};