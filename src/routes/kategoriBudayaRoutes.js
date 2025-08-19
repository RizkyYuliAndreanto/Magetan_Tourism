// src/routes/kategoriBudayaRoutes.js
const express = require("express");
const KategoriBudayaController = require("../controllers/kategoriBudayaController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");
const configureMulter = require("../utils/multerConfig");

const router = express.Router();
const upload = configureMulter();

router.get("/", KategoriBudayaController.getAllKategoriBudaya);
router.get("/:id", KategoriBudayaController.getKategoriBudayaById);

router.post(
  "/",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  upload.single("gambar_sampul_kategori_budaya"),
  KategoriBudayaController.createKategoriBudaya
);

router.put(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  upload.single("gambar_sampul_kategori_budaya"),
  KategoriBudayaController.updateKategoriBudaya
);

router.delete(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  KategoriBudayaController.deleteKategoriBudaya
);

module.exports = router;
