const express = require("express");
const router = express.Router();
const DashboardController = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/authMiddleware");

// Semua routes admin membutuhkan autentikasi
router.use(authMiddleware);

// Route untuk mendapatkan aktivitas terbaru (alias untuk dashboard)
router.get("/activity", DashboardController.getRecentActivity);

// Route untuk mendapatkan statistik aktivitas
router.get("/activity-stats", DashboardController.getActivityStats);

// Route untuk mendapatkan ringkasan aktivitas per admin
router.get(
  "/admin-activity-summary",
  DashboardController.getAdminActivitySummary
);

module.exports = router;
