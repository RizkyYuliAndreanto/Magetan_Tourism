// src/services/umkmService.js
const {
  UMKM,
  Admin,
  Komentar,
  Like,
  Share_Log,
  Halaman,
  Media_Galeri,
  Kategori_UMKM,
} = require("../models");
const FileHelper = require("../utils/fileHelper");
const InteractionService = require("./interactionService");

class UMKMService {
  static async getAllUMKM() {
    try {
      const umkm = await UMKM.findAll({
        include: [
          {
            model: Admin,
            as: "adminPembuat",
            attributes: ["username", "nama_lengkap", "level_akses"],
          },
          {
            model: Kategori_UMKM,
            as: "kategoriUMKM", // samakan dengan model
          },
          {
            model: Media_Galeri,
            as: "galeriUMKM",
            attributes: [
              "path_file",
              "deskripsi_file",
              "jenis_file",
              "urutan_tampil",
            ],
          },
        ],
        order: [
          [{ model: Media_Galeri, as: "galeriUMKM" }, "urutan_tampil", "ASC"],
        ],
      });
      return umkm;
    } catch (error) {
      throw new Error("Could not fetch UMKM data: " + error.message);
    }
  }

  static async getUMKMById(id) {
    try {
      const umkm = await UMKM.findByPk(id, {
        include: [
          {
            model: Admin,
            as: "adminPembuat",
            attributes: ["username", "nama_lengkap", "email", "level_akses"],
          },
          {
            model: Kategori_UMKM,
            as: "kategoriUmkm", // Perbaikan di sini
          },
          {
            model: Media_Galeri,
            as: "galeriUMKM",
            attributes: [
              "path_file",
              "deskripsi_file",
              "jenis_file",
              "urutan_tampil",
            ],
            order: [["urutan_tampil", "ASC"]],
          },
        ],
      });
      return umkm;
    } catch (error) {
      throw new Error("Could not fetch UMKM by ID: " + error.message);
    }
  }

  static async createUMKM(umkmData, requesterLevelAkses) {
    try {
      if (
        requesterLevelAkses !== "admin" &&
        requesterLevelAkses !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can create UMKM data."
        );
      }
      const newUMKM = await UMKM.create(umkmData);
      return newUMKM;
    } catch (error) {
      throw new Error("Could not create UMKM data: " + error.message);
    }
  }

  static async updateUMKM(
    id,
    updateData,
    idAdminRequester,
    levelAksesRequester
  ) {
    try {
      const umkm = await UMKM.findByPk(id);
      if (!umkm) {
        throw new Error("UMKM data not found");
      }
      if (
        levelAksesRequester === "admin" &&
        umkm.id_admin !== idAdminRequester
      ) {
        throw new Error("Forbidden: You can only update your own UMKM data.");
      } else if (
        levelAksesRequester !== "admin" &&
        levelAksesRequester !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can update UMKM data."
        );
      }

      // Hapus file gambar lama jika ada gambar baru
      const fileFields = ["gambar_produk_utama", "gambar_sampul"];
      FileHelper.deleteOldFiles(umkm, updateData, fileFields);

      await umkm.update(updateData);
      return umkm;
    } catch (error) {
      throw new Error("Could not update UMKM data: " + error.message);
    }
  }

  static async deleteUMKM(id, idAdminRequester, levelAksesRequester) {
    try {
      const umkm = await UMKM.findByPk(id, {
        include: [
          {
            model: Media_Galeri,
            as: "galeriUMKM",
            attributes: ["path_file"],
          },
        ],
      });

      if (!umkm) {
        throw new Error("UMKM data not found");
      }

      if (
        levelAksesRequester === "admin" &&
        umkm.id_admin !== idAdminRequester
      ) {
        throw new Error("Forbidden: You can only delete your own UMKM data.");
      } else if (
        levelAksesRequester !== "admin" &&
        levelAksesRequester !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can delete UMKM data."
        );
      }

      // Hapus file gambar UMKM
      const filesToDelete = [];
      if (umkm.gambar_produk_utama)
        filesToDelete.push(umkm.gambar_produk_utama);
      if (umkm.gambar_sampul) filesToDelete.push(umkm.gambar_sampul);

      // Hapus file galeri terkait
      if (umkm.galeriUMKM && umkm.galeriUMKM.length > 0) {
        const galeriFiles = umkm.galeriUMKM.map((item) => item.path_file);
        filesToDelete.push(...galeriFiles);
      }

      FileHelper.deleteMultipleFiles(filesToDelete);

      // Hapus interactions terkait
      await InteractionService.deleteAllInteractionsByContent("umkm", id);

      await umkm.destroy();
      return { message: "UMKM data deleted successfully" };
    } catch (error) {
      throw new Error("Could not delete UMKM data: " + error.message);
    }
  }

  // Method untuk mendapatkan UMKM dengan interaksi
  static async getUMKMWithInteractions(id, userId = null) {
    try {
      const umkm = await this.getUMKMById(id);
      if (!umkm) {
        throw new Error("UMKM not found");
      }

      const interactions = await InteractionService.getContentInteractions(
        "umkm",
        id,
        userId
      );

      return {
        ...umkm.toJSON(),
        interactions,
      };
    } catch (error) {
      throw new Error(
        "Could not fetch UMKM with interactions: " + error.message
      );
    }
  }
}

module.exports = UMKMService;
