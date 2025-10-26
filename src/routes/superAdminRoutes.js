// src/routes/superAdminRoutes.js
const express = require("express");
const router = express.Router();
const SuperAdminController = require("../controllers/superAdminController");
const authMiddleware = require("../middleware/authMiddleware");
const { superAdminOnly } = require("../middleware/superAdminMiddleware");
const { body, param, query } = require("express-validator");
const { validate } = require("../middleware/validationMiddleware");

// Middleware untuk semua routes super admin
router.use(authMiddleware);
router.use(superAdminOnly);

// Validation rules
const createAdminValidation = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Username must be between 3 and 50 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("level_akses")
    .isIn(["admin", "superadmin"])
    .withMessage("level_akses must be either 'admin' or 'superadmin'"),
  body("nama_lengkap")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Full name cannot exceed 100 characters"),
];

const updateUserValidation = [
  param("id").isInt({ gt: 0 }).withMessage("Invalid user ID"),
  body("username")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Username must be between 3 and 50 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("email")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("level_akses")
    .optional()
    .isIn(["user", "admin", "superadmin"])
    .withMessage("level_akses must be user, admin, or superadmin"),
  body("nama_lengkap")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Full name cannot exceed 100 characters"),
];

const toggleStatusValidation = [
  param("id").isInt({ gt: 0 }).withMessage("Invalid user ID"),
  body("is_blocked")
    .isBoolean()
    .withMessage("is_blocked must be a boolean value"),
];

const resetPasswordValidation = [
  param("id").isInt({ gt: 0 }).withMessage("Invalid user ID"),
  body("new_password")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long"),
];

const getUsersValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("search")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Search term cannot exceed 100 characters"),
  query("level_akses")
    .optional()
    .isIn(["user", "admin", "superadmin"])
    .withMessage("Invalid level_akses filter"),
  query("sort")
    .optional()
    .isIn(["created_at", "updated_at", "username", "email", "level_akses"])
    .withMessage("Invalid sort field"),
  query("order")
    .optional()
    .isIn(["ASC", "DESC"])
    .withMessage("Order must be ASC or DESC"),
];

// Routes

// GET /api/super-admin/users - Mendapatkan semua users dengan pagination dan filter
router.get(
  "/users",
  getUsersValidation,
  validate,
  SuperAdminController.getAllUsers
);

// GET /api/super-admin/users/stats - Mendapatkan statistik users
router.get("/users/stats", SuperAdminController.getUsersStats);

// GET /api/super-admin/users/:id - Mendapatkan detail user berdasarkan ID
router.get(
  "/users/:id",
  param("id").isInt({ gt: 0 }).withMessage("Invalid user ID"),
  validate,
  SuperAdminController.getUserById
);

// POST /api/super-admin/users - Membuat admin atau superadmin baru
router.post(
  "/users",
  createAdminValidation,
  validate,
  SuperAdminController.createAdmin
);

// PUT /api/super-admin/users/:id - Update user/admin
router.put(
  "/users/:id",
  updateUserValidation,
  validate,
  SuperAdminController.updateUser
);

// PATCH /api/super-admin/users/:id/status - Blokir/Aktifkan akun user
router.patch(
  "/users/:id/status",
  toggleStatusValidation,
  validate,
  SuperAdminController.toggleUserStatus
);

// PATCH /api/super-admin/users/:id/reset-password - Reset password user
router.patch(
  "/users/:id/reset-password",
  resetPasswordValidation,
  validate,
  SuperAdminController.resetUserPassword
);

// DELETE /api/super-admin/users/:id - Hapus akun user/admin
router.delete(
  "/users/:id",
  param("id").isInt({ gt: 0 }).withMessage("Invalid user ID"),
  validate,
  SuperAdminController.deleteUser
);

module.exports = router;
