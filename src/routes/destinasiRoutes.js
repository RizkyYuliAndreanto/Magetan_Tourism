// src/routes/destinasiRoutes.js
const express = require("express");
const DestinasiController = require("../controllers/destinasiController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");
const configureMulter = require("../utils/multerConfig"); // Import fungsi configureMulter yang baru
const compressionMiddleware = require("../middleware/compressionMiddleware");
const {
  activityLogger,
  saveOriginalData,
} = require("../middleware/activityLoggerMiddleware");
const { Destinasi } = require("../models");

const router = express.Router();

// Panggil fungsi configureMulter untuk mendapatkan instance Multer
const upload = configureMulter();

// Public routes
router.get("/", DestinasiController.getAllDestinasi);
router.get("/:id", DestinasiController.getDestinasiById);

// Protected routes
router.post(
  "/",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  upload.fields([
    { name: "gambar_utama", maxCount: 1 },
    { name: "media_galeri_files", maxCount: 50 },
  ]),
  compressionMiddleware(), // Kompresi otomatis
  activityLogger("create", "destinasi"),
  DestinasiController.createDestinasi
);
router.put(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  saveOriginalData(Destinasi),
  upload.fields([
    { name: "gambar_utama", maxCount: 1 },
    { name: "media_galeri_files", maxCount: 50 },
  ]),
  compressionMiddleware(), // Kompresi otomatis
  activityLogger("update", "destinasi"),
  DestinasiController.updateDestinasi
);
router.delete(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  saveOriginalData(Destinasi),
  activityLogger("delete", "destinasi"),
  DestinasiController.deleteDestinasi
);

module.exports = router;
