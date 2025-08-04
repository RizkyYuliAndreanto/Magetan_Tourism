// src/routes/kategoriPpidRoutes.js
const express = require("express");
const KategoriPpidController = require("../controllers/kategoriPpidController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");

const router = express.Router();

// Public routes (pengunjung bisa melihat kategori PPID)
router.get("/", KategoriPpidController.getAllKategoriPpid);
router.get("/:id", KategoriPpidController.getKategoriPpidById);

// Protected routes (membutuhkan otentikasi dan otorisasi untuk CREATE, UPDATE, DELETE)
router.post(
  "/",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  KategoriPpidController.createKategoriPpid
);

router.put(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  KategoriPpidController.updateKategoriPpid
);

router.delete(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  KategoriPpidController.deleteKategoriPpid
);

module.exports = router;
