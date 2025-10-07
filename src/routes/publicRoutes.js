const express = require("express");
const router = express.Router();
const { ActivityLog } = require("../models");

// Public endpoint untuk check server status
router.get("/status", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Public endpoint untuk check auth status
router.get("/auth-status", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  res.json({
    success: true,
    hasToken: !!token,
    isAuthenticated: false, // This would need proper JWT verification
    message: token ? "Token present" : "No token provided",
  });
});

module.exports = router;
