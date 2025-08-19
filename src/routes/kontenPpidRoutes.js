// src/routes/kontenPpidRoutes.js
const express = require("express");
const KontenPpidController = require("../controllers/kontenPpidController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");
const configureMulter = require("../utils/multerConfig");

const router = express.Router();

const upload = configureMulter();

// Public routes
router.get("/", KontenPpidController.getAllKontenPpid);
router.get("/:id", KontenPpidController.getKontenPpidById);

// Protected routes (membutuhkan otentikasi dan otorisasi untuk CREATE, UPDATE, DELETE)
router.post(
  "/",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  upload.fields([
    { name: "file_pdf_ppid", maxCount: 1 }, // Untuk PDF utama
    { name: "gambar_sampul_ppid", maxCount: 1 }, // Untuk gambar sampul

  ]),
  KontenPpidController.createKontenPpid
);

router.put(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  upload.fields([
    { name: "file_pdf_ppid", maxCount: 1 }, // Jika PDF bisa diupdate
    { name: "gambar_sampul_ppid", maxCount: 1 }, // Jika gambar sampul bisa diupdate
   
  ]),
  KontenPpidController.updateKontenPpid
);

router.delete(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  KontenPpidController.deleteKontenPpid
);

module.exports = router;
