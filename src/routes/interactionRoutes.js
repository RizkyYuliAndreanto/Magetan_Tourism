// src/routes/interactionRoutes.js
const express = require("express");
const router = express.Router();
const InteractionController = require("../controllers/interactionController");
const authMiddleware = require("../middleware/authMiddleware");

// Like routes
router.post("/:tipeKonten/:idKonten/like", InteractionController.toggleLike);
router.get(
  "/:tipeKonten/:idKonten/like-count",
  InteractionController.getLikeCount
);

// Comment routes
router.post("/:tipeKonten/:idKonten/comment", InteractionController.addComment);
router.get(
  "/:tipeKonten/:idKonten/comments",
  InteractionController.getComments
);

// Admin only routes for comment management
router.put(
  "/comment/:commentId/status",
  authMiddleware,
  InteractionController.updateCommentStatus
);
router.delete(
  "/comment/:commentId",
  authMiddleware,
  InteractionController.deleteComment
);

// Share routes
router.post("/:tipeKonten/:idKonten/share", InteractionController.addShare);
router.get(
  "/:tipeKonten/:idKonten/share-stats",
  InteractionController.getShareStats
);

// Get all interactions for content
router.get(
  "/:tipeKonten/:idKonten/interactions",
  InteractionController.getContentInteractions
);

module.exports = router;
