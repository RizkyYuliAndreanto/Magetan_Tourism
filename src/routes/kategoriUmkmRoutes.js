// src/routes/kategoriUmkmRoutes.js
const express = require("express");
const KategoriUMKMController = require("../controllers/kategoriUmkmController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");
const configureMulter = require("../utils/multerConfig");

const router = express.Router();
const upload = configureMulter();

// Public routes
router.get("/", KategoriUMKMController.getAllKategoriUMKM);
router.get("/:id", KategoriUMKMController.getKategoriUMKMById);

// Protected routes
router.post(
  "/",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  upload.single("gambar_sampul"),
  KategoriUMKMController.createKategoriUMKM
);

router.put(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  upload.single("gambar_sampul"),
  KategoriUMKMController.updateKategoriUMKM
);

router.delete(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  KategoriUMKMController.deleteKategoriUMKM
);

module.exports = router;
