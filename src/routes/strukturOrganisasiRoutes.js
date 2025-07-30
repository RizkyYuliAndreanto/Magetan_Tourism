// src/routes/strukturOrganisasiRoutes.js
const express = require("express");
const StrukturOrganisasiController = require("../controllers/strukturOrganisasiController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");
const configureMulter = require("../utils/multerConfig"); // Import configureMulter

const router = express.Router();

const upload = configureMulter(); // Inisialisasi Multer

// Route untuk mendapatkan struktur organisasi (biasanya hanya satu entri aktif)
// Tidak menggunakan ID di URL karena umumnya hanya ada satu struktur utama
router.get("/", StrukturOrganisasiController.getStrukturOrganisasi);

// Protected routes (membutuhkan otentikasi dan otorisasi untuk CREATE, UPDATE, DELETE)
router.post(
  "/",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  // Gunakan upload.fields() karena ada file yang akan diupload
  upload.fields([
    { name: "gambar_struktur_organisasi", maxCount: 1 }, // Nama field untuk file gambar struktur
  ]),
  StrukturOrganisasiController.createStrukturOrganisasi
);

router.put(
  "/:id", // Menggunakan ID untuk update, memungkinkan pengelolaan versi atau entri utama
  authMiddleware,
  authorize(["admin", "superadmin"]),
  // Gunakan upload.fields() untuk update jika file juga bisa diupdate
  upload.fields([{ name: "gambar_struktur_organisasi", maxCount: 1 }]),
  StrukturOrganisasiController.updateStrukturOrganisasi
);

router.delete(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  StrukturOrganisasiController.deleteStrukturOrganisasi
);

module.exports = router;
