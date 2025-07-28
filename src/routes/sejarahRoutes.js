// src/routes/sejarahRoutes.js
const express = require("express");
const SejarahController = require("../controller/sejarahController"); // Pastikan path ke controllers
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");
const configureMulter = require("../utils/multerConfig"); // Import fungsi configureMulter yang sudah dimodifikasi

const router = express.Router();

// Panggil fungsi configureMulter tanpa argumen, karena logika folder ada di dalamnya
const upload = configureMulter(); // Gunakan satu instance Multer

// Public routes
router.get("/", SejarahController.getAllSejarah);
router.get("/:id", SejarahController.getSejarahById);

// Protected routes
router.post(
  "/",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  upload.fields([
    { name: "gambar_sejarah", maxCount: 1 }, // KOREKSI: Gunakan .fields() dan nama field yang benar
  ]),
  SejarahController.createSejarah
);

router.put(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  upload.fields([
    { name: "gambar_sejarah", maxCount: 1 }, // KOREKSI: Gunakan .fields() dan nama field yang benar
  ]),
  SejarahController.updateSejarah
);

router.delete(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  SejarahController.deleteSejarah
);

module.exports = router;
