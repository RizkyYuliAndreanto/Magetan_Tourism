// src/routes/authRoutes.js
const express = require("express");
const AuthController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware"); //
const authorize = require("../middleware/authorizeMiddleware"); //

// Import validator Joi yang relevan
const {
  validateAdminCreation, // Untuk register admin oleh superadmin
  validateAdminLogin, // Untuk login
  validatePengunjungRegistration, // Untuk register umum/pengunjung
  // Anda mungkin perlu validator untuk forgotPassword dan resetPassword jika ada
} = require("../middleware/validationMiddleware"); //

// Import rate limiter
const { loginLimiter } = require("../middleware/rateLimitMiddleware"); //

const router = express.Router();

// Route pendaftaran umum (default ke 'user' jika level_akses tidak disebutkan)
// Amankan dengan validasi pengunjung
router.post(
  "/register",
  validatePengunjungRegistration,
  AuthController.register
);

// Amankan login dengan rate limiter dan validasi
router.post("/login", loginLimiter, validateAdminLogin, AuthController.login);

// Rute ini sudah diamankan dengan authMiddleware
router.get("/profile", authMiddleware, AuthController.getProfile);

// Route untuk membuat akun admin/super_admin, hanya untuk super_admin
// Amankan dengan validasi admin creation
router.post(
  "/admin/register",
  authMiddleware, // Memastikan pengguna terautentikasi
  authorize(["superadmin"]), // Memastikan hanya superadmin yang bisa mengakses
  validateAdminCreation, // Memvalidasi input untuk pembuatan admin
  AuthController.registerAdminBySuperAdmin
);

// Anda mungkin ingin menambahkan validasi untuk forgot/reset password juga
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);

module.exports = router;
