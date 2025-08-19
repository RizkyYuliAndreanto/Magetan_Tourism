// src/routes/beritaRoutes.js
const express = require("express");
const BeritaController = require("../controllers/beritaController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");
const configureMulter = require("../utils/multerConfig"); // Import multer config

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
  BeritaController.createBerita
);

router.put(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  upload.fields([
    { name: "gambar_hero_berita", maxCount: 1 },
    { name: "media_galeri_files", maxCount: 50 },
  ]),
  BeritaController.updateBerita
);

router.delete(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  BeritaController.deleteBerita
);

module.exports = router;
