// src/routes/authRoutes.js
const express = require("express");
const AuthController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware"); // Buat middleware ini

const router = express.Router();

// Route pendaftaran umum (default ke 'user' jika level_akses tidak disebutkan)
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/profile", authMiddleware, AuthController.getProfile);

// Route untuk membuat akun admin/super_admin, hanya untuk super_admin
router.post(
  "/admin/register",
  authMiddleware,
  authorize(["superadmin"]), // Hanya super_admin yang bisa mengakses
  AuthController.registerAdminBySuperAdmin // Metode baru di controller
);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);

module.exports = router;
