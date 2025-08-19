// src/services/budayaService.js
const { Budaya, Kategori_Budaya, Admin, Media_Galeri } = require("../models");

class BudayaService {
  static async getAllBudaya() {
    try {
      const budaya = await Budaya.findAll({
        include: [
          {
            model: Kategori_Budaya,
            as: "kategori",
          },
          {
            model: Admin,
            as: "adminPengelola",
            attributes: ["username", "nama_lengkap", "level_akses"],
          },
          {
            model: Media_Galeri,
            as: "galeriBudaya",
            attributes: ["path_file", "deskripsi_file", "jenis_file"],
          },
        ],
      });
      return budaya;
    } catch (error) {
      throw new Error("Could not fetch culture data: " + error.message);
    }
  }

  static async getBudayaById(id) {
    try {
      const budaya = await Budaya.findByPk(id, {
        include: [
          {
            model: Kategori_Budaya,
            as: "kategori",
          },
          {
            model: Admin,
            as: "adminPengelola",
            attributes: ["username", "nama_lengkap", "level_akses"],
          },
          {
            model: Media_Galeri,
            as: "galeriBudaya",
            attributes: ["path_file", "deskripsi_file", "jenis_file"],
          },
        ],
      });
      return budaya;
    } catch (error) {
      throw new Error("Could not fetch culture by ID: " + error.message);
    }
  }

  static async createBudaya(budayaData, requesterLevelAkses) {
    try {
      if (
        requesterLevelAkses !== "admin" &&
        requesterLevelAkses !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can create culture data."
        );
      }
      const newBudaya = await Budaya.create(budayaData);
      return newBudaya;
    } catch (error) {
      throw new Error("Could not create culture data: " + error.message);
    }
  }

  static async updateBudaya(
    id,
    updateData,
    idAdminRequester,
    levelAksesRequester
  ) {
    try {
      const budaya = await Budaya.findByPk(id);
      if (!budaya) {
        throw new Error("Culture data not found");
      }
      if (
        levelAksesRequester === "admin" &&
        budaya.id_admin !== idAdminRequester
      ) {
        throw new Error(
          "Forbidden: You can only update your own culture data."
        );
      } else if (
        levelAksesRequester !== "admin" &&
        levelAksesRequester !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can update culture data."
        );
      }
      await budaya.update(updateData);
      return budaya;
    } catch (error) {
      throw new Error("Could not update culture data: " + error.message);
    }
  }

  static async deleteBudaya(id, idAdminRequester, levelAksesRequester) {
    try {
      const budaya = await Budaya.findByPk(id);
      if (!budaya) {
        throw new Error("Culture data not found");
      }
      if (
        levelAksesRequester === "admin" &&
        budaya.id_admin !== idAdminRequester
      ) {
        throw new Error(
          "Forbidden: You can only delete your own culture data."
        );
      } else if (
        levelAksesRequester !== "admin" &&
        levelAksesRequester !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can delete culture data."
        );
      }
      await budaya.destroy();
      return { message: "Culture data deleted successfully" };
    } catch (error) {
      throw new Error("Could not delete culture data: " + error.message);
    }
  }
}

module.exports = BudayaService;
