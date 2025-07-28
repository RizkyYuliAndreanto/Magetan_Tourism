// src/routes/eventRoutes.js
const express = require("express");
const EventController = require("../controller/eventController"); // Pastikan path ke controllers
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");
const configureMulter = require("../utils/multerConfig"); // Sesuaikan path jika berbeda

const router = express.Router();

// Panggil configureMulter tanpa argumen, karena logika folder ada di dalamnya
const upload = configureMulter();

// Public routes
router.get("/", EventController.getAllEvent);
router.get("/:id", EventController.getEventById);

// Protected routes
// Gunakan .fields() untuk menangani multiple file upload dengan fieldname berbeda
router.post(
  "/",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  upload.fields([
    { name: "brosur_event", maxCount: 1 },
    { name: "gambar_event", maxCount: 1 },
  ]),
  EventController.createEvent
);

router.put(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  upload.fields([
    { name: "brosur_event", maxCount: 1 },
    { name: "gambar_event", maxCount: 1 },
  ]),
  EventController.updateEvent
);

router.delete(
  "/:id",
  authMiddleware,
  authorize(["admin", "superadmin"]),
  EventController.deleteEvent
);

module.exports = router;
