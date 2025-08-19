// src/services/kategoriUmkmService.js
const { Kategori_UMKM, UMKM } = require("../models");

class KategoriUMKMService {
  static async getAllKategoriUMKM() {
    try {
      const kategori = await Kategori_UMKM.findAll({
        include: [{ model: UMKM, as: "umkms" }],
      });
      return kategori;
    } catch (error) {
      throw new Error("Could not fetch UMKM categories: " + error.message);
    }
  }

  static async getKategoriUMKMById(id) {
    try {
      const kategori = await Kategori_UMKM.findByPk(id, {
        include: [{ model: UMKM, as: "umkms" }],
      });
      return kategori;
    } catch (error) {
      throw new Error("Could not fetch UMKM category: " + error.message);
    }
  }

  static async createKategoriUMKM(kategoriData, requesterLevelAkses) {
    try {
      if (
        requesterLevelAkses !== "admin" &&
        requesterLevelAkses !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can create UMKM categories."
        );
      }
      const newKategori = await Kategori_UMKM.create(kategoriData);
      return newKategori;
    } catch (error) {
      throw new Error("Could not create UMKM category: " + error.message);
    }
  }

  static async updateKategoriUMKM(id, updateData, requesterLevelAkses) {
    try {
      if (
        requesterLevelAkses !== "admin" &&
        requesterLevelAkses !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can update UMKM categories."
        );
      }
      const kategori = await Kategori_UMKM.findByPk(id);
      if (!kategori) {
        throw new Error("UMKM category not found");
      }
      await kategori.update(updateData);
      return kategori;
    } catch (error) {
      throw new Error("Could not update UMKM category: " + error.message);
    }
  }

  static async deleteKategoriUMKM(id, requesterLevelAkses) {
    try {
      if (
        requesterLevelAkses !== "admin" &&
        requesterLevelAkses !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can delete UMKM categories."
        );
      }
      const kategori = await Kategori_UMKM.findByPk(id);
      if (!kategori) {
        throw new Error("UMKM category not found");
      }
      await kategori.destroy();
      return { message: "UMKM category deleted successfully" };
    } catch (error) {
      throw new Error("Could not delete UMKM category: " + error.message);
    }
  }
}

module.exports = KategoriUMKMService;
