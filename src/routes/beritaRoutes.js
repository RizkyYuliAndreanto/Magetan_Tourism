// src/routes/beritaRoutes.js
const express = require("express");
const BeritaController = require("../controller/beritaController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");
const configureMulter = require("../utils/multerConfig"); // Import multer config

const router = express.Router();
const uploadBerita = configureMulter("Berita");

// Public routes
router.get("/", BeritaController.getAllBerita);
router.get("/:id", BeritaController.getBeritaById);

// Protected routes
router.post(
  "/",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  uploadBerita.single("gambar_hero_berita"), // Middleware Multer untuk satu file dengan nama field 'gambar_hero_berita'
  BeritaController.createBerita
);
router.put(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  uploadBerita.single("gambar_hero_berita"), // Middleware Multer untuk update juga
  BeritaController.updateBerita
);
router.delete(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  BeritaController.deleteBerita
);

module.exports = router;
