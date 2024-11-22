const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

// Sign Up
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  // Check if the user already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).send("User already exists");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    password: hashedPassword,
  });

  try {
    await user.save();
    res.status(201).send("User registered successfully");
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send("An error occurred while registering the user");
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log("User attempting to log in:", username);
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.log("Invalid credentials for user: ", user);
      return res.status(401).send("Invalid credentials");
    }

    // Sign JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "iamchandankumar", // Use your own secret key
      {
        expiresIn: "1y", // Optional: Set token expiration time
      }
    );

    console.log("User logged in:", user.username);
    console.log("Token generated:", token);
    res.json({
      token,
      user: { id: user._id, username: user.username },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("An error occurred. Please try again.");
  }
});

module.exports = router;
