import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import gererateToken from "../util/generateToken.js";

export const Register = async (req, res) => {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }
        const profilePicture = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            profilePicture,
        });
        await newUser.save();
        const token = gererateToken(newUser._id);

        res.status(201).json({
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                profilePicture: newUser.profilePicture
            },
            token
        })
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error." });
    }
}

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long." });
        }
    
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        const token = gererateToken(user._id);

        res.status(200).json({ 
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture
            },
            token 
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error." });
    }
}
export const Logout = async (req, res) => {
    try {
        res.status(200).json({ message: "Logout successful." });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Server error." });
    }
}