// src/routes/visiMisiRoutes.js
const express = require("express");
const VisiMisiController = require("../controllers/visiMisiController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");
const configureMulter = require("../utils/multerConfig"); // Import Multer

const router = express.Router();

const upload = configureMulter(); // Inisialisasi Multer

// Route untuk mendapatkan visi dan misi (biasanya hanya satu entri aktif)
router.get("/", VisiMisiController.getVisiMisi);

// Protected routes (membutuhkan otentikasi dan otorisasi untuk CREATE, UPDATE, DELETE)
router.post(
  "/",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  // Gunakan upload.fields() karena ada file yang bisa diupload
  upload.fields([
    { name: "visi_misi_file", maxCount: 1 }, // Nama field untuk file gambar/PDF Visi Misi
  ]),
  VisiMisiController.createVisiMisi
);

router.put(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  // Gunakan upload.fields() untuk update jika file juga bisa diupdate
  upload.fields([{ name: "visi_misi_file", maxCount: 1 }]),
  VisiMisiController.updateVisiMisi
);

router.delete(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  VisiMisiController.deleteVisiMisi
);

module.exports = router;
