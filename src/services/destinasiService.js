// src/services/destinasiService.js
const {
  Destinasi,
  Kategori_Destinasi,
  Admin,
  Media_Galeri,
} = require("../models"); // Pastikan path benar
const FileHelper = require("../utils/fileHelper");
const InteractionService = require("./interactionService");

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
        throw new Error("Destinasi not found");
      }

      // Otorisasi:
      if (
        levelAksesRequester === "admin" &&
        destinasi.id_admin !== idAdminRequester
      ) {
        throw new Error("Forbidden: You can only update your own destinasi.");
      } else if (
        levelAksesRequester !== "admin" &&
        levelAksesRequester !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can update destinasi."
        );
      }

      // Hapus file gambar lama jika ada gambar baru
      const fileFields = ["gambar_utama"];
      FileHelper.deleteOldFiles(destinasi, updateData, fileFields);

      await destinasi.update(updateData);
      return destinasi;
    } catch (error) {
      throw new Error("Could not update destinasi: " + error.message);
    }
  }

  static async deleteDestinasi(id, idAdminRequester, levelAksesRequester) {
    try {
      const destinasi = await Destinasi.findByPk(id, {
        include: [
          {
            model: Media_Galeri,
            as: "galeriDestinasi",
            attributes: ["path_file"],
          },
        ],
      });

      if (!destinasi) {
        throw new Error("Destinasi not found");
      }

      // Otorisasi:
      if (
        levelAksesRequester === "admin" &&
        destinasi.id_admin !== idAdminRequester
      ) {
        throw new Error("Forbidden: You can only delete your own destinasi.");
      } else if (
        levelAksesRequester !== "admin" &&
        levelAksesRequester !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can delete destinasi."
        );
      }

      // Hapus file gambar destinasi
      const filesToDelete = [];
      if (destinasi.gambar_utama) filesToDelete.push(destinasi.gambar_utama);

      // Hapus file galeri terkait
      if (destinasi.galeriDestinasi && destinasi.galeriDestinasi.length > 0) {
        const galeriFiles = destinasi.galeriDestinasi.map(
          (item) => item.path_file
        );
        filesToDelete.push(...galeriFiles);
      }

      FileHelper.deleteMultipleFiles(filesToDelete);

      // Hapus interactions terkait
      await InteractionService.deleteAllInteractionsByContent("destinasi", id);

      await destinasi.destroy();
      return { message: "Destinasi deleted successfully" };
    } catch (error) {
      throw new Error("Could not delete destinasi: " + error.message);
    }
  }

  // Method untuk mendapatkan destinasi dengan interaksi
  static async getDestinasiWithInteractions(id, userId = null) {
    try {
      const destinasi = await this.getDestinasiById(id);
      if (!destinasi) {
        throw new Error("Destinasi not found");
      }

      const interactions = await InteractionService.getContentInteractions(
        "destinasi",
        id,
        userId
      );

      return {
        ...destinasi.toJSON(),
        interactions,
      };
    } catch (error) {
      throw new Error(
        "Could not fetch destinasi with interactions: " + error.message
      );
    }
  }
}

module.exports = DestinasiService;
