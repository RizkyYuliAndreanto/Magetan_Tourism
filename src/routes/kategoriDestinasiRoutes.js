// src/routes/kategoriDestinasiRoutes.js
const express = require("express");
const KategoriDestinasiController = require("../controllers/kategoriDestinasiController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");
const configureMulter = require("../utils/multerConfig");

const router = express.Router();
const upload = configureMulter();

router.get("/", KategoriDestinasiController.getAllKategoriDestinasi);
router.get("/:id", KategoriDestinasiController.getKategoriDestinasiById);

// Tambahkan multer middleware di rute POST dan PUT
router.post(
  "/",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  upload.fields([{ name: "sampul_kategori", maxCount: 1 }]), // <-- Perbaikan di sini
  KategoriDestinasiController.createKategoriDestinasi
);
router.put(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  upload.fields([{ name: "sampul_kategori", maxCount: 1 }]), // <-- Perbaikan di sini
  KategoriDestinasiController.updateKategoriDestinasi
);
router.delete(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  KategoriDestinasiController.deleteKategoriDestinasi
);

module.exports = router;
