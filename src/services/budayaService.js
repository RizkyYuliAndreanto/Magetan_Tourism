// src/services/budayaService.js
const { Budaya, Admin, Media_Galeri } = require("../models");
const FileHelper = require("../utils/fileHelper");
const InteractionService = require("./interactionService");

class BudayaService {
  static async getAllBudaya() {
    try {
      const budaya = await Budaya.findAll({
        include: [
          {
            model: Admin,
            as: "adminPengelola",
            attributes: ["username", "nama_lengkap", "level_akses"],
          },
          {
            model: Media_Galeri,
            as: "galeriBudaya",
            attributes: [
              "id_media_galeri",
              "path_file",
              "deskripsi_file",
              "jenis_file",
              "urutan_tampil",
            ],
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
            model: Admin,
            as: "adminPengelola",
            attributes: ["username", "nama_lengkap", "level_akses"],
          },
          {
            model: Media_Galeri,
            as: "galeriBudaya",
            attributes: [
              "id_media_galeri",
              "path_file",
              "deskripsi_file",
              "jenis_file",
              "urutan_tampil",
            ],
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

      // Hapus file gambar lama jika ada gambar baru
      const fileFields = ["gambar_budaya"];
      FileHelper.deleteOldFiles(budaya, updateData, fileFields);

      await budaya.update(updateData);
      return budaya;
    } catch (error) {
      throw new Error("Could not update culture data: " + error.message);
    }
  }

  static async deleteBudaya(id, idAdminRequester, levelAksesRequester) {
    try {
      const budaya = await Budaya.findByPk(id, {
        include: [
          {
            model: Media_Galeri,
            as: "galeriBudaya",
            attributes: ["path_file"],
          },
        ],
      });

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

      // Hapus file gambar budaya
      const filesToDelete = [];
      if (budaya.gambar_budaya) filesToDelete.push(budaya.gambar_budaya);

      // Hapus file galeri terkait
      if (budaya.galeriBudaya && budaya.galeriBudaya.length > 0) {
        const galeriFiles = budaya.galeriBudaya.map((item) => item.path_file);
        filesToDelete.push(...galeriFiles);
      }

      FileHelper.deleteMultipleFiles(filesToDelete);

      // Hapus interactions terkait
      await InteractionService.deleteAllInteractionsByContent("budaya", id);

      await budaya.destroy();
      return { message: "Culture data deleted successfully" };
    } catch (error) {
      throw new Error("Could not delete culture data: " + error.message);
    }
  }

  // Method untuk mendapatkan budaya dengan interaksi
  static async getBudayaWithInteractions(id, userId = null) {
    try {
      const budaya = await this.getBudayaById(id);
      if (!budaya) {
        throw new Error("Budaya not found");
      }

      const interactions = await InteractionService.getContentInteractions(
        "budaya",
        id,
        userId
      );

      return {
        ...budaya.toJSON(),
        interactions,
      };
    } catch (error) {
      throw new Error(
        "Could not fetch budaya with interactions: " + error.message
      );
    }
  }
}

module.exports = BudayaService;
