import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

configDotenv();

const JWT_SECRET = process.env.JWT_SECRET;

export const generateToken = (user) => {
    return jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
}

export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
}

export const decodeToken = (token) => {
    // jwt.decode doesn't verify the signature, so it doesn't need the secret!
    return jwt.decode(token);
}