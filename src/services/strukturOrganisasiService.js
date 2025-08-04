// src/services/strukturOrganisasiService.js
const { Struktur_Organisasi, Admin } = require("../models"); // Pastikan Admin di-import

class StrukturOrganisasiService {
  static async getStrukturOrganisasi() {
    // Metode ini mengambil satu entri terbaru, bukan semua
    try {
      const struktur = await Struktur_Organisasi.findOne({
        include: [
          {
            model: Admin,
            as: "adminPengelola", // Sesuai alias di model Struktur_Organisasi
            attributes: ["username", "nama_lengkap", "level_akses"],
          },
        ],
        order: [["tanggal_pembaruan", "DESC"]], // Ambil yang terbaru jika ada banyak
      });
      return struktur;
    } catch (error) {
      throw new Error(
        "Could not fetch organizational structure: " + error.message
      );
    }
  }

  static async createStrukturOrganisasi(strukturData, requesterLevelAkses) {
    try {
      // Otorisasi: Hanya admin atau superadmin yang bisa membuat struktur organisasi
      if (
        requesterLevelAkses !== "admin" &&
        requesterLevelAkses !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can create organizational structure."
        );
      }
      // Opsional: Jika Anda hanya ingin satu entri struktur organisasi yang aktif,
      // Anda bisa menghapus yang lama sebelum membuat yang baru.
      // Hati-hati dengan truncate: true di produksi!
      // await Struktur_Organisasi.destroy({ truncate: true });

      const newStruktur = await Struktur_Organisasi.create(strukturData);
      return newStruktur;
    } catch (error) {
      throw new Error(
        "Could not create organizational structure: " + error.message
      );
    }
  }

  static async updateStrukturOrganisasi(
    id, // id_struktur_organisasi dari parameter URL
    updateData,
    levelAksesRequester
  ) {
    try {
      const struktur = await Struktur_Organisasi.findByPk(id);

      if (!struktur) {
        throw new Error("Organizational structure not found");
      }

      // Otorisasi:
      // Admin atau superadmin bisa mengupdate struktur organisasi.
      if (
        levelAksesRequester !== "admin" &&
        levelAksesRequester !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can update organizational structure."
        );
      }

      await struktur.update(updateData);
      return struktur;
    } catch (error) {
      throw new Error(
        "Could not update organizational structure: " + error.message
      );
    }
  }

  static async deleteStrukturOrganisasi(id, levelAksesRequester) {
    try {
      const struktur = await Struktur_Organisasi.findByPk(id);

      if (!struktur) {
        throw new Error("Organizational structure not found");
      }

      // Otorisasi:
      // Admin atau superadmin bisa menghapus struktur organisasi.
      if (
        levelAksesRequester !== "admin" &&
        levelAksesRequester !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can delete organizational structure."
        );
      }
      // Opsional: Hapus file fisik terkait
      // const fs = require('fs');
      // const path = require('path');
      // const uploadDir = path.join(__dirname, '..', '..', 'uploads'); // Sesuaikan dengan root uploads Anda
      // if (struktur.gambar_struktur_path) {
      //   const filePath = path.join(uploadDir, struktur.gambar_struktur_path.replace('/uploads/', ''));
      //   if (fs.existsSync(filePath)) { fs.unlinkSync(filePath); }
      // }

      await struktur.destroy();
      return { message: "Organizational structure deleted successfully" };
    } catch (error) {
      throw new Error(
        "Could not delete organizational structure: " + error.message
      );
    }
  }
}

module.exports = StrukturOrganisasiService;
