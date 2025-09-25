// src/controllers/interactionController.js
const InteractionService = require("../services/interactionService");

class InteractionController {
  // Like/Unlike content
  static async toggleLike(req, res) {
    try {
      const { tipeKonten, idKonten } = req.params;
      const userId = req.user?.id || req.body.userId; // Support both authenticated and guest users

      if (!userId) {
        return res.status(400).json({ error: "User ID diperlukan untuk like" });
      }

      const result = await InteractionService.toggleLike(
        userId,
        tipeKonten,
        idKonten
      );
      const likeCount = await InteractionService.getLikeCount(
        tipeKonten,
        idKonten
      );

      res.status(200).json({
        message: result.message,
        action: result.action,
        likeCount,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get like count for content
  static async getLikeCount(req, res) {
    try {
      const { tipeKonten, idKonten } = req.params;
      const likeCount = await InteractionService.getLikeCount(
        tipeKonten,
        idKonten
      );

      res.status(200).json({ likeCount });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Add comment
  static async addComment(req, res) {
    try {
      const { tipeKonten, idKonten } = req.params;
      const { namaKomentator, emailKomentator, isiKomentar } = req.body;
      const userId = req.user?.id || req.body.userId;

      const commentData = {
        userId,
        tipeKonten,
        idKonten: parseInt(idKonten),
        namaKomentator,
        emailKomentator,
        isiKomentar,
      };

      const comment = await InteractionService.addComment(commentData);

      res.status(201).json({
        message: "Komentar berhasil ditambahkan (menunggu persetujuan)",
        comment,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get comments for content
  static async getComments(req, res) {
    try {
      const { tipeKonten, idKonten } = req.params;
      const { status = "disetujui" } = req.query;

      const comments = await InteractionService.getComments(
        tipeKonten,
        idKonten,
        status
      );

      res.status(200).json({
        comments,
        count: comments.length,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update comment status (admin only)
  static async updateCommentStatus(req, res) {
    try {
      const { commentId } = req.params;
      const { status } = req.body;

      if (!["pending", "disetujui", "ditolak"].includes(status)) {
        return res.status(400).json({ error: "Status tidak valid" });
      }

      const comment = await InteractionService.updateCommentStatus(
        commentId,
        status
      );

      res.status(200).json({
        message: "Status komentar berhasil diupdate",
        comment,
      });
    } catch (error) {
      if (error.message === "Komentar tidak ditemukan") {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // Delete comment
  static async deleteComment(req, res) {
    try {
      const { commentId } = req.params;

      await InteractionService.deleteComment(commentId);

      res.status(200).json({ message: "Komentar berhasil dihapus" });
    } catch (error) {
      if (error.message === "Komentar tidak ditemukan") {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // Add share log
  static async addShare(req, res) {
    try {
      const { tipeKonten, idKonten } = req.params;
      const { platformShare } = req.body;
      const userId = req.user?.id || req.body.userId;

      const shareData = {
        userId,
        tipeKonten,
        idKonten: parseInt(idKonten),
        platformShare,
      };

      const share = await InteractionService.addShare(shareData);
      const shareCount = await InteractionService.getShareCount(
        tipeKonten,
        idKonten
      );

      res.status(201).json({
        message: "Share berhasil dicatat",
        share,
        shareCount,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get share statistics
  static async getShareStats(req, res) {
    try {
      const { tipeKonten, idKonten } = req.params;

      const [shareCount, shareStats] = await Promise.all([
        InteractionService.getShareCount(tipeKonten, idKonten),
        InteractionService.getShareStats(tipeKonten, idKonten),
      ]);

      res.status(200).json({
        shareCount,
        shareStats,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get all interactions for content
  static async getContentInteractions(req, res) {
    try {
      const { tipeKonten, idKonten } = req.params;
      const userId = req.user?.id || req.query.userId;

      const interactions = await InteractionService.getContentInteractions(
        tipeKonten,
        parseInt(idKonten),
        userId
      );

      res.status(200).json(interactions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = InteractionController;
