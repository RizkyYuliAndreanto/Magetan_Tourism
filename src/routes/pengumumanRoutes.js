// src/routes/pengumumanRoutes.js
const express = require("express");
const PengumumanController = require("../controllers/pengumumanController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");
const configureMulter = require("../utils/multerConfig");

const router = express.Router();

const upload = configureMulter(); // Gunakan instance Multer yang sama

// Public routes
router.get("/", PengumumanController.getAllPengumuman);
router.get("/:id", PengumumanController.getPengumumanById);

// Protected routes
router.post(
  "/",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  upload.fields([
    { name: "file_pdf_pengumuman", maxCount: 1 }, // Untuk file PDF
    { name: "sampul_pengumuman", maxCount: 1 }, // Untuk gambar sampul
  ]),
  PengumumanController.createPengumuman
);

router.put(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  upload.fields([
    { name: "file_pdf_pengumuman", maxCount: 1 },
    { name: "sampul_pengumuman", maxCount: 1 },
  ]),
  PengumumanController.updatePengumuman
);

router.delete(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  PengumumanController.deletePengumuman
);

module.exports = router;
