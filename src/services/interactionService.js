// src/services/interactionService.js
const { Like, Komentar, Share_Log } = require("../models");
const { Op } = require("sequelize");

class InteractionService {
  // Like functionality
  static async toggleLike(userId, tipeKonten, idKonten) {
    const existingLike = await Like.findOne({
      where: {
        id_pengunjung: userId,
        tipe_konten: tipeKonten,
        id_konten: idKonten,
      },
    });

    if (existingLike) {
      // Unlike - hapus like
      await existingLike.destroy();
      return { action: "unliked", message: "Like dihapus" };
    } else {
      // Like - tambah like baru
      await Like.create({
        id_pengunjung: userId,
        tipe_konten: tipeKonten,
        id_konten: idKonten,
        tanggal_like: new Date(),
      });
      return { action: "liked", message: "Berhasil like" };
    }
  }

  static async getLikeCount(tipeKonten, idKonten) {
    return await Like.count({
      where: {
        tipe_konten: tipeKonten,
        id_konten: idKonten,
      },
    });
  }

  static async checkUserLike(userId, tipeKonten, idKonten) {
    const like = await Like.findOne({
      where: {
        id_pengunjung: userId,
        tipe_konten: tipeKonten,
        id_konten: idKonten,
      },
    });
    return !!like;
  }

  // Comment functionality
  static async addComment(commentData) {
    const {
      userId,
      tipeKonten,
      idKonten,
      namaKomentator,
      emailKomentator,
      isiKomentar,
    } = commentData;

    return await Komentar.create({
      id_pengunjung: userId,
      tipe_konten: tipeKonten,
      id_konten: idKonten,
      nama_komentator: namaKomentator,
      email_komentator: emailKomentator,
      isi_komentar: isiKomentar,
      tanggal_komentar: new Date(),
      status_komentar: "pending",
    });
  }

  static async getComments(tipeKonten, idKonten, status = "disetujui") {
    return await Komentar.findAll({
      where: {
        tipe_konten: tipeKonten,
        id_konten: idKonten,
        status_komentar: status,
      },
      // Removed Pengunjung include since model doesn't exist
      // Comments will use nama_komentator and email_komentator fields directly
      order: [["tanggal_komentar", "DESC"]],
    });
  }

  static async updateCommentStatus(commentId, status) {
    const comment = await Komentar.findByPk(commentId);
    if (!comment) {
      throw new Error("Komentar tidak ditemukan");
    }

    comment.status_komentar = status;
    await comment.save();
    return comment;
  }

  static async deleteComment(commentId) {
    const comment = await Komentar.findByPk(commentId);
    if (!comment) {
      throw new Error("Komentar tidak ditemukan");
    }

    await comment.destroy();
    return true;
  }

  // Share functionality
  static async addShare(shareData) {
    const { userId, tipeKonten, idKonten, platformShare } = shareData;

    return await Share_Log.create({
      id_pengunjung: userId,
      tipe_konten: tipeKonten,
      id_konten: idKonten,
      platform_share: platformShare,
      tanggal_share: new Date(),
    });
  }

  static async getShareCount(tipeKonten, idKonten, platform = null) {
    const whereClause = {
      tipe_konten: tipeKonten,
      id_konten: idKonten,
    };

    if (platform) {
      whereClause.platform_share = platform;
    }

    return await Share_Log.count({
      where: whereClause,
    });
  }

  static async getShareStats(tipeKonten, idKonten) {
    const shares = await Share_Log.findAll({
      where: {
        tipe_konten: tipeKonten,
        id_konten: idKonten,
      },
      attributes: [
        "platform_share",
        [
          require("sequelize").fn(
            "COUNT",
            require("sequelize").col("platform_share")
          ),
          "count",
        ],
      ],
      group: ["platform_share"],
    });

    return shares.reduce((stats, share) => {
      stats[share.platform_share] = parseInt(share.dataValues.count);
      return stats;
    }, {});
  }

  // Get all interactions for content
  static async getContentInteractions(tipeKonten, idKonten, userId = null) {
    const [likeCount, shareCount, comments] = await Promise.all([
      this.getLikeCount(tipeKonten, idKonten),
      this.getShareCount(tipeKonten, idKonten),
      this.getComments(tipeKonten, idKonten),
    ]);

    const result = {
      likes: likeCount,
      shares: shareCount,
      comments: comments,
      commentCount: comments.length,
    };

    if (userId) {
      result.userLiked = await this.checkUserLike(userId, tipeKonten, idKonten);
    }

    return result;
  }

  // Delete all interactions for content (used when deleting content)
  static async deleteLikesByContent(tipeKonten, idKonten) {
    return await Like.destroy({
      where: {
        tipe_konten: tipeKonten,
        id_konten: idKonten,
      },
    });
  }

  static async deleteCommentsByContent(tipeKonten, idKonten) {
    return await Komentar.destroy({
      where: {
        tipe_konten: tipeKonten,
        id_konten: idKonten,
      },
    });
  }

  static async deleteSharesByContent(tipeKonten, idKonten) {
    return await Share_Log.destroy({
      where: {
        tipe_konten: tipeKonten,
        id_konten: idKonten,
      },
    });
  }

  static async deleteAllInteractionsByContent(tipeKonten, idKonten) {
    await Promise.all([
      this.deleteLikesByContent(tipeKonten, idKonten),
      this.deleteCommentsByContent(tipeKonten, idKonten),
      this.deleteSharesByContent(tipeKonten, idKonten),
    ]);
  }
}

module.exports = InteractionService;
