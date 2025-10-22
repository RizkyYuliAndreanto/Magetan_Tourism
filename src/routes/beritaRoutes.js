// src/routes/beritaRoutes.js
const express = require("express");
const BeritaController = require("../controllers/beritaController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");
const configureMulter = require("../utils/multerConfig"); // Import multer config
const compressionMiddleware = require("../middleware/compressionMiddleware");
const {
  activityLogger,
  saveOriginalData,
} = require("../middleware/activityLoggerMiddleware");
const { Berita } = require("../models");

const router = express.Router();
const upload = configureMulter(); // Inisialisasi multer

// Public routes
router.get("/", BeritaController.getAllBerita);
router.get("/:id", BeritaController.getBeritaById);

// Protected routes
// PERUBAHAN UTAMA: Menggunakan multer.fields() untuk menangani beberapa field file
router.post(
  "/",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  upload.fields([
    { name: "gambar_hero_berita", maxCount: 1 }, // Untuk gambar hero
    { name: "media_galeri_files", maxCount: 50 }, // Untuk file galeri
  ]),
  compressionMiddleware(), // Kompresi otomatis
  activityLogger("create", "berita"),
  BeritaController.createBerita
);

router.put(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  saveOriginalData(Berita),
  upload.fields([
    { name: "gambar_hero_berita", maxCount: 1 },
    { name: "media_galeri_files", maxCount: 50 },
  ]),
  compressionMiddleware(), // Kompresi otomatis
  activityLogger("update", "berita"),
  BeritaController.updateBerita
);

router.delete(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  saveOriginalData(Berita),
  activityLogger("delete", "berita"),
  BeritaController.deleteBerita
);

module.exports = router;
