// src/services/visiMisiService.js
const { Visi_Misi, Admin } = require("../models");

class VisiMisiService {
  static async getVisiMisi() {
    try {
      const visiMisi = await Visi_Misi.findOne({
        include: [
          {
            model: Admin,
            as: "adminPengelola",
            attributes: ["username", "nama_lengkap", "level_akses"],
          },
        ],
        order: [["tanggal_pembaruan", "DESC"]],
      });
      return visiMisi;
    } catch (error) {
      throw new Error("Could not fetch Vision and Mission: " + error.message);
    }
  }

  static async createVisiMisi(vmData, requesterLevelAkses) {
    try {
      if (
        requesterLevelAkses !== "admin" &&
        requesterLevelAkses !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can create Vision and Mission."
        );
      }
      // Opsional: Hapus yang lama jika hanya ingin satu entri aktif
      // await Visi_Misi.destroy({ truncate: true });

      const newVisiMisi = await Visi_Misi.create(vmData);
      return newVisiMisi;
    } catch (error) {
      throw new Error("Could not create Vision and Mission: " + error.message);
    }
  }

  static async updateVisiMisi(id, updateData, levelAksesRequester) {
    try {
      const visiMisi = await Visi_Misi.findByPk(id);

      if (!visiMisi) {
        throw new Error("Vision and Mission not found");
      }

      if (
        levelAksesRequester !== "admin" &&
        levelAksesRequester !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can update Vision and Mission."
        );
      }

      await visiMisi.update(updateData);
      return visiMisi;
    } catch (error) {
      throw new Error("Could not update Vision and Mission: " + error.message);
    }
  }

  static async deleteVisiMisi(id, levelAksesRequester) {
    try {
      const visiMisi = await Visi_Misi.findByPk(id);

      if (!visiMisi) {
        throw new Error("Vision and Mission not found");
      }

      if (
        levelAksesRequester !== "admin" &&
        levelAksesRequester !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can delete Vision and Mission."
        );
      }

      // Opsional: Hapus file fisik terkait
      // const fs = require('fs');
      // const path = require('path');
      // const uploadDir = path.join(__dirname, '..', '..', 'uploads'); // Sesuaikan dengan root uploads Anda
      // if (visiMisi.visi_misi_file_path) {
      //   const filePath = path.join(uploadDir, visiMisi.visi_misi_file_path.replace('/uploads/', ''));
      //   if (fs.existsSync(filePath)) {
      //     fs.unlinkSync(filePath);
      //   }
      // }

      await visiMisi.destroy();
      return { message: "Vision and Mission deleted successfully" };
    } catch (error) {
      throw new Error("Could not delete Vision and Mission: " + error.message);
    }
  }
}

module.exports = VisiMisiService;
