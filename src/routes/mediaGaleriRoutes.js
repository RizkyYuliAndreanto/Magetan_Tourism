// src/routes/mediaGaleriRoutes.js
const express = require("express");
const MediaGaleriController = require("../controller/mediaGaleriController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");
const configureMulter = require("../utils/multerConfig");

const router = express.Router();

// Panggil fungsi configureMulter tanpa argumen
const upload = configureMulter();

// Public routes (jika Anda ingin media galeri bisa diakses tanpa login)
router.get("/", MediaGaleriController.getAllMediaGaleri);
router.get("/:id", MediaGaleriController.getMediaGaleriById);

// Protected routes (membutuhkan otentikasi dan otorisasi untuk CREATE, UPDATE, DELETE)
router.post(
  "/",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  // Gunakan .single() karena kita mengupload satu file untuk path_file
  // Nama field di form-data Postman harus 'media_galeri_file'
  upload.single("media_galeri_file"),
  MediaGaleriController.createMediaGaleri
);

router.put(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  // Jika ingin bisa mengupdate file fisik, gunakan upload.single() juga
  // Jika hanya ingin update deskripsi/urutan, middleware ini bisa dihilangkan
  upload.single("media_galeri_file"),
  MediaGaleriController.updateMediaGaleri
);

router.delete(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  MediaGaleriController.deleteMediaGaleri
);

module.exports = router;
