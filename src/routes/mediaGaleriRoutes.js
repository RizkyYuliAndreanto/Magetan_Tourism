// src/routes/mediaGaleriRoutes.js
const express = require("express");
const MediaGaleriController = require("../controllers/mediaGaleriController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");
const configureMulter = require("../utils/multerConfig");

const router = express.Router();

const upload = configureMulter();

// Public routes
router.get("/", MediaGaleriController.getAllMediaGaleri);
router.get("/:id", MediaGaleriController.getMediaGaleriById);

// Protected routes
router.post(
  "/",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  // PERUBAHAN: Menggunakan .array() untuk multi-file
  // Nama field di form-data harus 'media_galeri_files'
  upload.array("media_galeri_files", 10), // Maksimal 10 file
  MediaGaleriController.createMediaGaleri
);

router.put(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  // Jika ingin bisa mengupdate file fisik, gunakan upload.single()
  upload.single("media_galeri_file"), // Tetap single untuk edit
  MediaGaleriController.updateMediaGaleri
);

router.delete(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  MediaGaleriController.deleteMediaGaleri
);

module.exports = router;
