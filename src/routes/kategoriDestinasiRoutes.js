// src/routes/kategoriDestinasiRoutes.js
const express = require("express");
const KategoriDestinasiController = require("../controller/kategoriDestinasiController");
const authMiddleware = require("../middleware/authMiddleware"); // Pastikan ini ada
const authorize = require("../middleware/authorizeMiddleware"); // Pastikan ini ada

const router = express.Router();

// Public routes (siapa saja bisa melihat kategori)
router.get("/", KategoriDestinasiController.getAllKategoriDestinasi);
router.get("/:id", KategoriDestinasiController.getKategoriDestinasiById);

// Protected routes (memerlukan autentikasi dan otorisasi admin/superadmin)
router.post(
  "/",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  KategoriDestinasiController.createKategoriDestinasi
);
router.put(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  KategoriDestinasiController.updateKategoriDestinasi
);
router.delete(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  KategoriDestinasiController.deleteKategoriDestinasi
);

module.exports = router;
