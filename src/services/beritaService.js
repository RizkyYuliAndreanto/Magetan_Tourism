// src/services/beritaService.js
const { Berita, Kategori_Berita, Admin } = require("../models"); // Pastikan path benar

class BeritaService {
  static async getAllBerita() {
    try {
      const berita = await Berita.findAll({
        include: [
          {
            model: Kategori_Berita,
            as: "kategoriBerita",
            attributes: ["nama_kategori"],
          },
          {
            model: Admin,
            as: "adminPembuat",
            attributes: ["username", "nama_lengkap", "level_akses"],
          },
        ],
      });
      return berita;
    } catch (error) {
      throw new Error("Could not fetch berita: " + error.message);
    }
  }

  static async getBeritaById(id) {
    try {
      const berita = await Berita.findByPk(id, {
        include: [
          {
            model: Kategori_Berita,
            as: "kategoriBerita",
            attributes: ["nama_kategori", "deskripsi_kategori"],
          },
          {
            model: Admin,
            as: "adminPembuat",
            attributes: ["username", "nama_lengkap", "email", "level_akses"],
          },
          // Anda bisa menambahkan include untuk Komentar, Like, dll. jika diperlukan
          // { model: models.Komentar, as: 'komentarBerita', where: { tipe_konten: 'berita' }, required: false },
        ],
      });
      return berita;
    } catch (error) {
      throw new Error("Could not fetch berita by ID: " + error.message);
    }
  }

  static async createBerita(beritaData, requesterLevelAkses) {
    try {
      // Otorisasi: Hanya admin atau superadmin yang bisa membuat berita
      if (
        requesterLevelAkses !== "admin" &&
        requesterLevelAkses !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can create news."
        );
      }

      const newBerita = await Berita.create(beritaData);
      return newBerita;
    } catch (error) {
      // Sequelize validation errors will be caught here and re-thrown
      throw new Error("Could not create berita: " + error.message);
    }
  }

  static async updateBerita(
    id,
    updateData,
    idAdminRequester,
    levelAksesRequester
  ) {
    try {
      const berita = await Berita.findByPk(id);

      if (!berita) {
        throw new Error("Berita not found");
      }

      // Otorisasi:
      // Super Admin bisa mengedit berita apapun.
      // Admin hanya bisa mengedit beritanya sendiri.
      if (
        levelAksesRequester === "admin" &&
        berita.id_admin !== idAdminRequester
      ) {
        throw new Error("Forbidden: You can only update your own news.");
      } else if (
        levelAksesRequester !== "admin" &&
        levelAksesRequester !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can update news."
        );
      }

      await berita.update(updateData);
      return berita;
    } catch (error) {
      throw new Error("Could not update berita: " + error.message);
    }
  }

  static async deleteBerita(id, idAdminRequester, levelAksesRequester) {
    try {
      const berita = await Berita.findByPk(id);

      if (!berita) {
        throw new Error("Berita not found");
      }

      // Otorisasi:
      // Super Admin bisa menghapus berita apapun.
      // Admin hanya bisa menghapus beritanya sendiri.
      if (
        levelAksesRequester === "admin" &&
        berita.id_admin !== idAdminRequester
      ) {
        throw new Error("Forbidden: You can only delete your own news.");
      } else if (
        levelAksesRequester !== "admin" &&
        levelAksesRequester !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can delete news."
        );
      }

      await berita.destroy();
      return { message: "Berita deleted successfully" };
    } catch (error) {
      throw new Error("Could not delete berita: " + error.message);
    }
  }
}

module.exports = BeritaService;
