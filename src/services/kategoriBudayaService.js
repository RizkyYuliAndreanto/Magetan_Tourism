// src/services/kategoriBudayaService.js
const { Kategori_Budaya, Budaya } = require("../models");

class KategoriBudayaService {
  static async getAllKategoriBudaya() {
    try {
      const kategori = await Kategori_Budaya.findAll({
        include: [{ model: Budaya, as: "budayas" }],
      });
      return kategori;
    } catch (error) {
      throw new Error("Could not fetch culture categories: " + error.message);
    }
  }

  static async getKategoriBudayaById(id) {
    try {
      const kategori = await Kategori_Budaya.findByPk(id, {
        include: [{ model: Budaya, as: "budayas" }],
      });
      return kategori;
    } catch (error) {
      throw new Error("Could not fetch culture category: " + error.message);
    }
  }

  static async createKategoriBudaya(kategoriData, requesterLevelAkses) {
    try {
      if (
        requesterLevelAkses !== "admin" &&
        requesterLevelAkses !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can create culture categories."
        );
      }
      const newKategori = await Kategori_Budaya.create(kategoriData);
      return newKategori;
    } catch (error) {
      throw new Error("Could not create culture category: " + error.message);
    }
  }

  static async updateKategoriBudaya(id, updateData, requesterLevelAkses) {
    try {
      if (
        requesterLevelAkses !== "admin" &&
        requesterLevelAkses !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can update culture categories."
        );
      }
      const kategori = await Kategori_Budaya.findByPk(id);
      if (!kategori) {
        throw new Error("Culture category not found");
      }
      await kategori.update(updateData);
      return kategori;
    } catch (error) {
      throw new Error("Could not update culture category: " + error.message);
    }
  }

  static async deleteKategoriBudaya(id, requesterLevelAkses) {
    try {
      if (
        requesterLevelAkses !== "admin" &&
        requesterLevelAkses !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can delete culture categories."
        );
      }
      const kategori = await Kategori_Budaya.findByPk(id);
      if (!kategori) {
        throw new Error("Culture category not found");
      }
      await kategori.destroy();
      return { message: "Culture category deleted successfully" };
    } catch (error) {
      throw new Error("Could not delete culture category: " + error.message);
    }
  }
}

module.exports = KategoriBudayaService;
