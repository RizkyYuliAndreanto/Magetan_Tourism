// src/routes/umkmRoutes.js
const express = require("express");
const UMKMController = require("../controllers/umkmController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");
const configureMulter = require("../utils/multerConfig"); // Import fungsi configureMulter yang sudah dimodifikasi

const router = express.Router();

// Panggil fungsi configureMulter tanpa argumen, karena logika folder ada di dalamnya
const upload = configureMulter(); // Gunakan satu instance Multer

// Public routes (jika UMKM bisa diakses publik)
router.get("/", UMKMController.getAllUMKM);
router.get("/:id", UMKMController.getUMKMById);

// Protected routes (membutuhkan otentikasi dan otorisasi)
router.post(
  "/",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  upload.fields([
    { name: "gambar_produk_utama", maxCount: 1 }, // Nama field sesuai model
    { name: "gambar_sampul", maxCount: 1 },
  ]),
  UMKMController.createUMKM
);

router.put(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  upload.fields([
    { name: "gambar_produk_utama", maxCount: 1 }, // Nama field sesuai model
    { name: "gambar_sampul", maxCount: 1 },
  ]),
  UMKMController.updateUMKM
);

router.delete(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  UMKMController.deleteUMKM
);

module.exports = router;
