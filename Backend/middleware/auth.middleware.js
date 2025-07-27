import User from "../models/user.model.js";


const authMiddleware = async (req, res, next) => {
    // Authorization : "Bearer <token>"
    const token = req.headers.authorization?.split(" ")[1]; 
    if (!token) {
        return res.status(401).json({ message: "Unauthorized access." });
    }

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) {
            return res.status(401).json({ message: "Invalid token." });
        }
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: "User not found." });
        }
        req.user = user; 
        next(); 
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({ message: "Invalid or expired token." });
    }
}
export default authMiddleware;