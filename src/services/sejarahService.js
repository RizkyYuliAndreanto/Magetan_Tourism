// src/services/sejarahService.js // Nama file harus 'sejarahService.js', bukan 'beritaService.js'
const { Sejarah, Admin } = require("../models"); // Pastikan path benar

class SejarahService {
  static async getAllSejarah() {
    // Perbaikan: capital 'S' pada 'sejarah'
    try {
      const sejarah = await Sejarah.findAll({
        include: [
          {
            model: Admin,
            as: "adminPembuat",
            attributes: ["username", "nama_lengkap", "level_akses"],
          },
        ],
      });
      return sejarah;
    } catch (error) {
      throw new Error("Could not fetch sejarah: " + error.message); // Perbaikan: typo 'sejarah;'
    }
  }

  static async getSejarahById(id) {
    try {
      const sejarah = await Sejarah.findByPk(id, {
        // Perbaikan: capital 'S' pada 'sejarah.findByPk'
        include: [
          {
            model: Admin,
            as: "adminPembuat",
            attributes: ["username", "nama_lengkap", "email", "level_akses"],
          },
          // Anda bisa menambahkan include untuk Komentar, Like, dll. jika diperlukan
        ],
      });
      return sejarah;
    } catch (error) {
      throw new Error("Could not fetch sejarah by ID: " + error.message);
    }
  }

  static async createSejarah(sejarahData, requesterLevelAkses) {
    try {
      // Otorisasi: Hanya admin atau superadmin yang bisa membuat sejarah (bukan berita)
      if (
        requesterLevelAkses !== "admin" &&
        requesterLevelAkses !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can create historical data." // Perbaikan pesan
        );
      }

      const newSejarah = await Sejarah.create(sejarahData);
      return newSejarah;
    } catch (error) {
      throw new Error("Could not create new Sejarah: " + error.message); // Perbaikan pesan
    }
  }

  static async updateSejarah(
    id,
    updateData,
    idAdminRequester,
    levelAksesRequester
  ) {
    try {
      const sejarah = await Sejarah.findByPk(id);

      if (!sejarah) {
        throw new Error("Historical data not found"); // Perbaikan pesan
      }

      // Otorisasi:
      // Super Admin bisa mengedit sejarah apapun.
      // Admin hanya bisa mengedit sejarah yang dibuatnya sendiri.
      if (
        levelAksesRequester === "admin" &&
        sejarah.id_admin !== idAdminRequester // Perbaikan: gunakan 'sejarah.id_admin'
      ) {
        throw new Error(
          "Forbidden: You can only update your own historical data."
        ); // Perbaikan pesan
      } else if (
        levelAksesRequester !== "admin" &&
        levelAksesRequester !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can update historical data." // Perbaikan pesan
        );
      }

      await sejarah.update(updateData);
      return sejarah;
    } catch (error) {
      throw new Error("Could not update sejarah: " + error.message); // Perbaikan pesan
    }
  }

  static async deleteSejarah(id, idAdminRequester, levelAksesRequester) {
    try {
      const sejarah = await Sejarah.findByPk(id);

      if (!sejarah) {
        throw new Error("Historical data not found"); // Perbaikan pesan
      }

      // Otorisasi:
      // Super Admin bisa menghapus sejarah apapun.
      // Admin hanya bisa menghapus sejarah yang dibuatnya sendiri.
      if (
        levelAksesRequester === "admin" &&
        sejarah.id_admin !== idAdminRequester // Perbaikan: gunakan 'sejarah.id_admin'
      ) {
        throw new Error(
          "Forbidden: You can only delete your own historical data."
        ); // Perbaikan pesan
      } else if (
        levelAksesRequester !== "admin" &&
        levelAksesRequester !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can delete historical data." // Perbaikan pesan
        );
      }

      await sejarah.destroy();
      return { message: "Sejarah deleted successfully" };
    } catch (error) {
      throw new Error("Could not delete historical data: " + error.message); // Perbaikan pesan
    }
  }
}

module.exports = SejarahService;
