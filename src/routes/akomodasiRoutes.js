// src/routes/akomodasiRoutes.js
const express = require("express");
const AkomodasiController = require("../controllers/akomodasiController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");
const configureMulter = require("../utils/multerConfig");
const compressionMiddleware = require("../middleware/compressionMiddleware");

const router = express.Router();

const upload = configureMulter();

// Public routes
router.get("/", AkomodasiController.getAllAkomodasi);
router.get("/:id", AkomodasiController.getAkomodasiById);

// Protected routes (membutuhkan otentikasi dan otorisasi untuk CREATE, UPDATE, DELETE)
router.post(
  "/",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  upload.fields([
    { name: "gambar_utama_hotel", maxCount: 1 },
    { name: "media_galeri_files", maxCount: 50 },
  ]),
  compressionMiddleware(), // Kompresi otomatis
  AkomodasiController.createAkomodasi
);

router.put(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  upload.fields([
    { name: "gambar_utama_hotel", maxCount: 1 },
    { name: "media_galeri_files", maxCount: 50 },
  ]),
  compressionMiddleware(), // Kompresi otomatis
  AkomodasiController.updateAkomodasi
);

router.delete(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  AkomodasiController.deleteAkomodasi
);

module.exports = router;
