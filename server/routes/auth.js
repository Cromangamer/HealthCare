const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();
    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ email: normalizedEmail }, { phone }] });
    if (existingUser ) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email: normalizedEmail,
      phone,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        email: newUser.email,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
        return res.status(400).json({ message: "Email or phone already exists" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
}); // register a new user

router.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
      },
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });

  }
}); // login a user

module.exports = router;