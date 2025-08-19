// src/services/umkmService.js
const {
  UMKM,
  Admin,
  Komentar,
  Like,
  Share_Log,
  Halaman,
  Media_Galeri,
  Kategori_UMKM, // Tambahkan import model Kategori_UMKM
} = require("../models");

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
            as: "kategoriUMKM",
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
            as: "kategoriUMKM",
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
      await umkm.update(updateData);
      return umkm;
    } catch (error) {
      throw new Error("Could not update UMKM data: " + error.message);
    }
  }

  static async deleteUMKM(id, idAdminRequester, levelAksesRequester) {
    try {
      const umkm = await UMKM.findByPk(id);
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
      await umkm.destroy();
      return { message: "UMKM data deleted successfully" };
    } catch (error) {
      throw new Error("Could not delete UMKM data: " + error.message);
    }
  }
}

module.exports = UMKMService;
