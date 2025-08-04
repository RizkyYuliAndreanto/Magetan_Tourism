// src/services/beritaService.js
const { Destinasi, Kategori_Destinasi, Admin, Media_Galeri } = require("../models"); // Pastikan path benar

class DestinasiService {
  static async getAllDestinasi() {
    try {
      const destinasi = await Destinasi.findAll({
        include: [
          {
            model: Kategori_Destinasi,
            as: "kategoriDestinasi",
            attributes: ["nama_kategori"],
          },
          {
            model: Admin,
            as: "adminPembuat",
            attributes: ["username", "nama_lengkap", "level_akses"],
          },
          {
            // Tambahkan include untuk Media_Galeri di sini
            model: Media_Galeri,
            as: "galeriDestinasi",
            attributes: [
              "path_file",
              "deskripsi_file",
              "jenis_file",
              "urutan_tampil",
            ],
            order: [["urutan_tampil", "ASC"]], // Urutkan media di galeri
          },
        ],
      });
      return destinasi;
    } catch (error) {
      throw new Error("Could not fetch destinasi: " + error.message);
    }
  }

  static async getDestinasiById(id) {
    try {
      const destinasi = await Destinasi.findByPk(id, {
        include: [
          {
            model: Kategori_Destinasi,
            as: "kategoriDestinasi",
            attributes: ["nama_kategori", "deskripsi_kategori"],
          },
          {
            model: Admin,
            as: "adminPembuat",
            attributes: ["username", "nama_lengkap", "email", "level_akses"],
          },
          {
            // Tambahkan include untuk Media_Galeri di sini
            model: Media_Galeri,
            as: "galeriDestinasi",
            attributes: [
              "path_file",
              "deskripsi_file",
              "jenis_file",
              "urutan_tampil",
            ],
            order: [["urutan_tampil", "ASC"]], // Urutkan media di galeri
          },
          // Anda bisa menambahkan include untuk Komentar, Like, dll. jika diperlukan
          // { model: models.Komentar, as: 'komentarBerita', where: { tipe_konten: 'berita' }, required: false },
        ],
      });
      return destinasi;
    } catch (error) {
      throw new Error("Could not fetch destinasi by ID: " + error.message);
    }
  }

  static async createDestinasi(destinasiData, requesterLevelAkses) {
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

      const newDestinasi = await Destinasi.create(destinasiData);
      return newDestinasi;
    } catch (error) {
      // Sequelize validation errors will be caught here and re-thrown
      throw new Error("Could not create Destinasi: " + error.message);
    }
  }

  static async updateDestinasi(
    id,
    updateData,
    idAdminRequester,
    levelAksesRequester
  ) {
    try {
      const destinasi = await Destinasi.findByPk(id);

      if (!destinasi) {
        throw new Error("Berita not found");
      }

      // Otorisasi:
      // Super Admin bisa mengedit berita apapun.
      // Admin hanya bisa mengedit beritanya sendiri.
      if (
        levelAksesRequester === "admin" &&
        destinasi.id_admin !== idAdminRequester
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

      await destinasi.update(updateData);
      return destinasi;
    } catch (error) {
      throw new Error("Could not update destinasi: " + error.message);
    }
  }

  static async deleteDestinasi(id, idAdminRequester, levelAksesRequester) {
    try {
      const destinasi = await Destinasi.findByPk(id);

      if (!destinasi) {
        throw new Error("Destinasi not found");
      }

      // Otorisasi:
      // Super Admin bisa menghapus berita apapun.
      // Admin hanya bisa menghapus beritanya sendiri.
      if (
        levelAksesRequester === "admin" &&
        Destinasi.id_admin !== idAdminRequester
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

      await destinasi.destroy();
      return { message: "Destinasi deleted successfully" };
    } catch (error) {
      throw new Error("Could not delete berita: " + error.message);
    }
  }
}

module.exports = DestinasiService;
