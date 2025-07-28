// src/services/umkmService.js
const {
  UMKM,
  Admin,
  Komentar,
  Like,
  Media_Galeri,
  Share_Log,
  Halaman,
} = require("../models"); // Pastikan semua model yang terkait di-import

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
          // Anda bisa uncomment ini jika ingin menyertakan relasi terkait
          // {
          //   model: Komentar,
          //   as: "komentarUMKM",
          //   attributes: ["id_komentar", "isi_komentar", "id_pengguna", "tanggal_komentar"],
          // },
          // {
          //   model: Like,
          //   as: "likeUMKM",
          //   attributes: ["id_like", "id_pengguna"],
          // },
          // {
          //   model: Media_Galeri,
          //   as: "galeriUMKM",
          //   attributes: ["id_media", "url_media", "tipe_media"],
          // },
          // {
          //   model: Share_Log,
          //   as: "shareUMKM",
          //   attributes: ["id_share", "id_pengguna", "tanggal_share"],
          // },
          // {
          //   model: Halaman,
          //   as: "halamanUMKM",
          //   attributes: ["id_halaman", "isi_halaman"],
          // },
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
          // Uncomment jika ingin menyertakan relasi terkait saat mengambil detail
          // {
          //   model: Komentar,
          //   as: "komentarUMKM",
          //   attributes: ["id_komentar", "isi_komentar", "id_pengguna", "tanggal_komentar"],
          // },
          // {
          //   model: Like,
          //   as: "likeUMKM",
          //   attributes: ["id_like", "id_pengguna"],
          // },
          // {
          //   model: Media_Galeri,
          //   as: "galeriUMKM",
          //   attributes: ["id_media", "url_media", "tipe_media"],
          // },
          // {
          //   model: Share_Log,
          //   as: "shareUMKM",
          //   attributes: ["id_share", "id_pengguna", "tanggal_share"],
          // },
          // {
          //   model: Halaman,
          //   as: "halamanUMKM",
          //   attributes: ["id_halaman", "isi_halaman"],
          // },
        ],
      });
      return umkm;
    } catch (error) {
      throw new Error("Could not fetch UMKM by ID: " + error.message);
    }
  }

  static async createUMKM(umkmData, requesterLevelAkses) {
    try {
      // Otorisasi: Hanya admin atau superadmin yang bisa membuat UMKM
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

      // Otorisasi:
      // Super Admin bisa mengedit UMKM apapun.
      // Admin hanya bisa mengedit UMKM yang dibuatnya sendiri.
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

      // Otorisasi:
      // Super Admin bisa menghapus UMKM apapun.
      // Admin hanya bisa menghapus UMKM yang dibuatnya sendiri.
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
