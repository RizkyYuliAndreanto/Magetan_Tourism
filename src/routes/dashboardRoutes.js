const express = require("express");
const router = express.Router();
const DashboardController = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/authMiddleware");

// Public routes - tidak perlu auth
router.get("/summary", DashboardController.getSummary);
router.get("/activity", DashboardController.getRecentActivity);

// Protected routes - membutuhkan autentikasi
router.use(authMiddleware);

// Route untuk mendapatkan statistik aktivitas
router.get("/activity-stats", DashboardController.getActivityStats);

// Route untuk mendapatkan ringkasan aktivitas per admin
router.get(
  "/admin-activity-summary",
  DashboardController.getAdminActivitySummary
);

module.exports = router;
