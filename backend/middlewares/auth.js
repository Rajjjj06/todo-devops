import { verifyToken } from "../util/jwt.js";
import User from "../models/user.js";

export const protect = async (req, res, next) => {
    try {
        let token;
        
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
            
            const decoded = verifyToken(token);
            
            req.user = await User.findById(decoded.id).select("-password");
            
            next();
        } else {
            res.status(401).json({ message: "Not authorized, no token provided" });
        }
    } catch (error) {
        console.error("Auth middleware error:", error);
        res.status(401).json({ message: "Not authorized, token failed" });
    }
};
