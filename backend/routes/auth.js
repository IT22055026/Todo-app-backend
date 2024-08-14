import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Function to validate the password
function validatePassword(password) {
  const errors = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Register a new user
router.post('/register', async (req, res) => {
    console.log("Register route hit");

    const { username, password } = req.body;

    if (!username || typeof username !== 'string' || username.trim().length === 0) {
        return res.status(400).json({ message: "Invalid username" });
    }

    const { isValid, errors } = validatePassword(password);

    if (!isValid) {
        return res.status(400).json({ message: "Password validation failed", errors });
    }

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

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    // Validate input fields
    if (!username || typeof username !== 'string' || username.trim().length === 0) {
        return res.status(400).json({ message: "Invalid username" });
    }

    if (!password || typeof password !== 'string' || password.trim().length === 0) {
        return res.status(400).json({ message: "Password is required" });
    }

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
