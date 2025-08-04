// src/services/strukturAnggotaService.js
const { Struktur_Anggota, Admin } = require("../models"); // Pastikan Admin di-import

class StrukturAnggotaService {
  static async getAllStrukturAnggota() {
    try {
      const anggota = await Struktur_Anggota.findAll({
        include: [
          {
            model: Admin,
            as: "adminPengelola", // Sesuai alias di model Struktur_Anggota
            attributes: ["username", "nama_lengkap", "level_akses"],
          },
        ],
        order: [["urutan_tampilan", "ASC"]], // Urutkan berdasarkan urutan tampilan
      });
      return anggota;
    } catch (error) {
      throw new Error("Could not fetch structure members: " + error.message);
    }
  }

  static async getStrukturAnggotaById(id) {
    try {
      const anggota = await Struktur_Anggota.findByPk(id, {
        include: [
          {
            model: Admin,
            as: "adminPengelola",
            attributes: ["username", "nama_lengkap", "email", "level_akses"],
          },
        ],
      });
      return anggota;
    } catch (error) {
      throw new Error(
        "Could not fetch structure member by ID: " + error.message
      );
    }
  }

  static async createStrukturAnggota(anggotaData, requesterLevelAkses) {
    try {
      // Otorisasi: Hanya admin atau superadmin yang bisa membuat anggota struktur
      if (
        requesterLevelAkses !== "admin" &&
        requesterLevelAkses !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can create structure members."
        );
      }

      const newAnggota = await Struktur_Anggota.create(anggotaData);
      return newAnggota;
    } catch (error) {
      throw new Error("Could not create structure member: " + error.message);
    }
  }

  static async updateStrukturAnggota(
    id,
    updateData,
    idAdminRequester,
    levelAksesRequester
  ) {
    try {
      const anggota = await Struktur_Anggota.findByPk(id);

      if (!anggota) {
        throw new Error("Structure member not found");
      }

      // Otorisasi:
      // Super Admin bisa mengedit anggota apapun.
      // Admin hanya bisa mengedit anggota yang dikelolanya sendiri (jika id_admin cocok).
      if (
        levelAksesRequester === "admin" &&
        anggota.id_admin !== idAdminRequester
      ) {
        throw new Error("Forbidden: You can only update members you manage.");
      } else if (
        levelAksesRequester !== "admin" &&
        levelAksesRequester !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can update structure members."
        );
      }

      await anggota.update(updateData);
      return anggota;
    } catch (error) {
      throw new Error("Could not update structure member: " + error.message);
    }
  }

  static async deleteStrukturAnggota(
    id,
    idAdminRequester,
    levelAksesRequester
  ) {
    try {
      const anggota = await Struktur_Anggota.findByPk(id);

      if (!anggota) {
        throw new Error("Structure member not found");
      }

      // Otorisasi:
      // Super Admin bisa menghapus anggota apapun.
      // Admin hanya bisa menghapus anggota yang dikelolanya sendiri.
      if (
        levelAksesRequester === "admin" &&
        anggota.id_admin !== idAdminRequester
      ) {
        throw new Error("Forbidden: You can only delete members you manage.");
      } else if (
        levelAksesRequester !== "admin" &&
        levelAksesRequester !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can delete structure members."
        );
      }

      await anggota.destroy();
      return { message: "Structure member deleted successfully" };
    } catch (error) {
      throw new Error("Could not delete structure member: " + error.message);
    }
  }
}

module.exports = StrukturAnggotaService;
