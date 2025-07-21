// src/routes/kategoriBeritaRoutes.js
const express = require("express");
const KategoriBeritaController = require("../controller/kategoriBeritaController");
const authMiddleware = require("../middleware/authMiddleware"); // Pastikan ini ada
const authorize = require("../middleware/authorizeMiddleware"); // Pastikan ini ada

const router = express.Router();

// Public routes (siapa saja bisa melihat kategori)
router.get("/", KategoriBeritaController.getAllKategoriBerita);
router.get("/:id", KategoriBeritaController.getKategoriBeritaById);

// Protected routes (memerlukan autentikasi dan otorisasi admin/superadmin)
router.post(
  "/",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  KategoriBeritaController.createKategoriBerita
);
router.put(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  KategoriBeritaController.updateKategoriBerita
);
router.delete(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  KategoriBeritaController.deleteKategoriBerita
);

module.exports = router;
