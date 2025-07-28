// src/routes/strukturAnggotaRoutes.js
const express = require("express");
const StrukturAnggotaController = require("../controller/strukturAnggotaController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");
const configureMulter = require("../utils/multerConfig"); // Import fungsi configureMulter yang sudah dimodifikasi

const router = express.Router();

// Panggil fungsi configureMulter tanpa argumen
const upload = configureMulter();

// Public routes (jika Anda ingin struktur anggota bisa diakses tanpa login)
router.get("/", StrukturAnggotaController.getAllStrukturAnggota);
router.get("/:id", StrukturAnggotaController.getStrukturAnggotaById);

// Protected routes (membutuhkan otentikasi dan otorisasi untuk CREATE, UPDATE, DELETE)
router.post(
  "/",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  upload.fields([
    { name: "foto_anggota", maxCount: 1 }, // Hanya ada satu field foto
  ]),
  StrukturAnggotaController.createStrukturAnggota
);

router.put(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  upload.fields([{ name: "foto_anggota", maxCount: 1 }]),
  StrukturAnggotaController.updateStrukturAnggota
);

router.delete(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  StrukturAnggotaController.deleteStrukturAnggota
);

module.exports = router;
