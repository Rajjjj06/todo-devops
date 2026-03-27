import User from "../models/user.js";
import { generateToken } from "../util/jwt.js";

export const registerUser = async (req, res) => {
    try {
        const { name, password } = req.body;
        
        const userExists = await User.findOne({ name });
        
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        
        const user = await User.create({ name, password });
        
        res.status(201).json({
            _id: user._id,
            name: user.name,
            token: generateToken(user)
        });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { name, password } = req.body;
        
        const user = await User.findOne({ name });
        
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                token: generateToken(user)
            });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getUser = async (req,res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const logoutUser = async (req, res) => {
    try {
        // Since we are using standard JWTs, the actual logout happens on the frontend 
        // by deleting the token from localStorage. We just return a success message here.
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Server error" });
    }
};