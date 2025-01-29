const express = require("express");
const { signup, login, logout } = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

// Signup Route
router.post("/signup", signup);

// Login Route
router.post("/login", login);

// Logout Route
router.post("/logout", logout);

// Get Authenticated User
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
