import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { ENV } from "../config/env.js";

const generateToken = (userId, role) => {
    return jwt.sign({ userId, role }, ENV.JWT_SECRET, { expiresIn: "7d" });
};

export const signup = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Check if it's the specific admin email to force admin role
        const isAdmin = email === "avishekgiri31@gmail.com";
        const role = isAdmin ? "admin" : "customer";

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            name,
            password: hashedPassword,
            role,
            clerkId: "custom-" + Date.now(), // Fallback if clerkId is still required somewhere before model update propagates or if code relies on it
        });

        const token = generateToken(user._id, user.role);

        res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.imageUrl,
            },
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Hardcoded Admin Access for specifically requested credentials
        if (email === "avishekgiri31@gmail.com" && password === "Sinu@2025") {
            // Find or create this admin user to ensure DB consistency
            let user = await User.findOne({ email });

            if (!user) {
                const hashedPassword = await bcrypt.hash(password, 10);
                user = await User.create({
                    email,
                    name: "Admin",
                    password: hashedPassword,
                    role: "admin",
                    clerkId: "admin-" + Date.now(),
                });
            } else {
                // Ensure role is admin
                if (user.role !== "admin") {
                    user.role = "admin";
                    await user.save();
                }
            }

            const token = generateToken(user._id, user.role);
            return res.json({
                message: "Admin login successful",
                token,
                role: "admin",
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    image: user.imageUrl,
                }
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user._id, user.role);

        res.json({
            message: "Login successful",
            token,
            role: user.role,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.imageUrl,
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
