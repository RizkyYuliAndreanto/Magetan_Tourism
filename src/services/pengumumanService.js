// src/services/pengumumanService.js
const { Pengumuman, Admin } = require("../models"); // Pastikan Admin di-import

class PengumumanService {
  static async getAllPengumuman() {
    try {
      const pengumuman = await Pengumuman.findAll({
        include: [
          {
            model: Admin,
            as: "adminPengelola", // Sesuai alias di model Pengumuman
            attributes: ["username", "nama_lengkap", "level_akses"],
          },
        ],
        order: [["tanggal_publikasi", "DESC"]], // Urutkan dari yang terbaru
      });
      return pengumuman;
    } catch (error) {
      throw new Error("Could not fetch announcements: " + error.message);
    }
  }

  static async getPengumumanById(id) {
    try {
      const pengumuman = await Pengumuman.findByPk(id, {
        include: [
          {
            model: Admin,
            as: "adminPengelola",
            attributes: ["username", "nama_lengkap", "email", "level_akses"],
          },
        ],
      });
      return pengumuman;
    } catch (error) {
      throw new Error("Could not fetch announcement by ID: " + error.message);
    }
  }

  static async createPengumuman(pengumumanData, requesterLevelAkses) {
    try {
      // Otorisasi: Hanya admin atau superadmin yang bisa membuat pengumuman
      if (
        requesterLevelAkses !== "admin" &&
        requesterLevelAkses !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can create announcements."
        );
      }

      const newPengumuman = await Pengumuman.create(pengumumanData);
      return newPengumuman;
    } catch (error) {
      throw new Error("Could not create announcement: " + error.message);
    }
  }

  static async updatePengumuman(id, updateData, levelAksesRequester) {
    try {
      const pengumuman = await Pengumuman.findByPk(id);

      if (!pengumuman) {
        throw new Error("Announcement not found");
      }

      // Otorisasi:
      // Admin atau superadmin bisa mengupdate pengumuman.
      // Jika ingin admin hanya bisa update pengumumannya sendiri, tambahkan:
      // if (levelAksesRequester === "admin" && pengumuman.id_admin !== idAdminRequester) {
      //   throw new Error("Forbidden: You can only update your own announcements.");
      // }
      if (
        levelAksesRequester !== "admin" &&
        levelAksesRequester !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can update announcements."
        );
      }

      await pengumuman.update(updateData);
      return pengumuman;
    } catch (error) {
      throw new Error("Could not update announcement: " + error.message);
    }
  }

  static async deletePengumuman(id, levelAksesRequester) {
    try {
      const pengumuman = await Pengumuman.findByPk(id);

      if (!pengumuman) {
        throw new Error("Announcement not found");
      }

      // Otorisasi:
      // Admin atau superadmin bisa menghapus pengumuman.
      // Jika ingin admin hanya bisa menghapus pengumumannya sendiri, tambahkan:
      // if (levelAksesRequester === "admin" && pengumuman.id_admin !== idAdminRequester) {
      //   throw new Error("Forbidden: You can only delete your own announcements.");
      // }
      if (
        levelAksesRequester !== "admin" &&
        levelAksesRequester !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can delete announcements."
        );
      }

      // Opsional: Hapus file PDF fisik terkait dari server
      // const fs = require('fs');
      // const path = require('path');
      // const uploadDir = path.join(__dirname, '..', '..', 'uploads'); // Sesuaikan dengan root uploads Anda
      // const filePath = path.join(uploadDir, pengumuman.file_pdf_path.replace('/uploads/', '')); // Hapus '/uploads/' dari path
      // if (fs.existsSync(filePath)) {
      //   fs.unlinkSync(filePath);
      // }

      await pengumuman.destroy();
      return { message: "Announcement deleted successfully" };
    } catch (error) {
      throw new Error("Could not delete announcement: " + error.message);
    }
  }
}

module.exports = PengumumanService;
