// src/routes/budayaRoutes.js
const express = require("express");
const BudayaController = require("../controllers/budayaController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");
const configureMulter = require("../utils/multerConfig");

const router = express.Router();
const upload = configureMulter();

router.get("/", BudayaController.getAllBudaya);
router.get("/:id", BudayaController.getBudayaById);

router.post(
  "/",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  upload.fields([{ name: "gambar_budaya", maxCount: 1 }]),
  BudayaController.createBudaya
);

router.put(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  upload.fields([{ name: "gambar_budaya", maxCount: 1 }]),
  BudayaController.updateBudaya
);

router.delete(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  BudayaController.deleteBudaya
);

module.exports = router;
    