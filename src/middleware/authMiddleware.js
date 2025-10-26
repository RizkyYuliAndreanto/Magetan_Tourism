// src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );

    // Ambil data user dari database untuk mendapatkan status terbaru
    const { Admin } = require("../models");
    const user = await Admin.findByPk(decoded.id, {
      attributes: [
        "id_admin",
        "username",
        "level_akses",
        "is_blocked",
        "email",
      ],
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = {
      id: user.id_admin,
      username: user.username,
      level_akses: user.level_akses,
      is_blocked: user.is_blocked,
      email: user.email,
    };

    // Also set req.admin for consistency with activityLogger
    req.admin = {
      id_admin: user.id_admin,
      level_akses: user.level_akses,
      is_blocked: user.is_blocked,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
