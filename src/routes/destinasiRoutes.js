// src/routes/destinasiRoutes.js
const express = require("express");
const DestinasiController = require("../controllers/destinasiController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");
const configureMulter = require("../utils/multerConfig"); // Import fungsi configureMulter yang baru

const router = express.Router();

// Panggil fungsi configureMulter untuk mendapatkan instance Multer spesifik untuk "destinasi"
const uploadDestinasi = configureMulter("destinasi");

// Public routes
router.get("/", DestinasiController.getAllDestinasi);
router.get("/:id", DestinasiController.getDestinasiById);

// Protected routes
router.post(
  "/",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  uploadDestinasi.single("gambar_utama"), // Gunakan uploadDestinasi yang sudah merupakan instance Multer
  DestinasiController.createDestinasi
);
router.put(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  uploadDestinasi.single("gambar_utama"), // Gunakan uploadDestinasi yang sudah merupakan instance Multer
  DestinasiController.updateDestinasi
);
router.delete(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  DestinasiController.deleteDestinasi
);

module.exports = router;
