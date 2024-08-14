import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    console.log("Register route hit");
    
    const { username, password } = req.body;

    try {
        const userExists = await User.findOne({ username });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({
            username,
            password
        });

        res.status(201).json({
            _id: user._id,
            username: user.username
        });
    } catch (error) {
        res.status(500).json({ message: "Error in registration", error: error.message });
    }
});

// Login a user and return a JWT
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (user && (await user.matchPassword(password))) {
            const token = jwt.sign(
                { _id: user._id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: "30d" }
            );

            res.json({
                _id: user._id,
                username: user.username,
                token: token
            });
        } else {
            res.status(401).json({ message: "Invalid username or password" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error in login", error: error.message });
    }
});

export default router;
