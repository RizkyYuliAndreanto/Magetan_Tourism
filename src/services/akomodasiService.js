// src/services/akomodasiService.js
const {
  Akomodasi,
  Admin,
  Komentar,
  Like,
  Media_Galeri,
  Share_Log,
  Halaman,
} = require("../models"); // Import semua model terkait

class AkomodasiService {
  static async getAllAkomodasi() {
    try {
      const akomodasi = await Akomodasi.findAll({
        include: [
          {
            model: Admin,
            as: "adminPengelola", // Sesuai alias di model Akomodasi
            attributes: ["username", "nama_lengkap", "level_akses"],
          },
          // Anda bisa uncomment ini jika ingin menyertakan relasi terkait
          // {
          //   model: Komentar,
          //   as: "komentarAkomodasi",
          //   attributes: ["id_komentar", "isi_komentar", "id_pengunjung", "tanggal_komentar"],
          // },
          // {
          //   model: Like,
          //   as: "likeAkomodasi",
          //   attributes: ["id_like", "id_pengunjung"],
          // },
          {
            model: Media_Galeri,
            as: "galeriAkomodasi", // Sesuai alias di model Akomodasi
            attributes: [
              "path_file",
              "deskripsi_file",
              "jenis_file",
              "urutan_tampil",
            ],
            order: [["urutan_tampil", "ASC"]],
          },
          // {
          //   model: Share_Log,
          //   as: "shareAkomodasi",
          //   attributes: ["id_share_log", "id_pengunjung", "tanggal_share"],
          // },
          // {
          //   model: Halaman,
          //   as: "halamanAkomodasi",
          //   attributes: ["id_halaman", "slug_url"],
          // },
        ],
        order: [["nama_hotel", "ASC"]], // Contoh urutan
      });
      return akomodasi;
    } catch (error) {
      throw new Error("Could not fetch accommodations: " + error.message);
    }
  }

  static async getAkomodasiById(id) {
    try {
      const akomodasi = await Akomodasi.findByPk(id, {
        include: [
          {
            model: Admin,
            as: "adminPengelola",
            attributes: ["username", "nama_lengkap", "email", "level_akses"],
          },
          // Uncomment jika ingin menyertakan relasi terkait saat mengambil detail
          // {
          //   model: Komentar,
          //   as: "komentarAkomodasi",
          //   attributes: ["id_komentar", "isi_komentar", "id_pengunjung", "tanggal_komentar"],
          // },
          // {
          //   model: Like,
          //   as: "likeAkomodasi",
          //   attributes: ["id_like", "id_pengunjung"],
          // },
          {
            model: Media_Galeri,
            as: "galeriAkomodasi",
            attributes: [
              "path_file",
              "deskripsi_file",
              "jenis_file",
              "urutan_tampil",
            ],
            order: [["urutan_tampil", "ASC"]],
          },
          // {
          //   model: Share_Log,
          //   as: "shareAkomodasi",
          //   attributes: ["id_share_log", "id_pengunjung", "tanggal_share"],
          // },
          // {
          //   model: Halaman,
          //   as: "halamanAkomodasi",
          //   attributes: ["id_halaman", "slug_url"],
          // },
        ],
      });
      return akomodasi;
    } catch (error) {
      throw new Error("Could not fetch accommodation by ID: " + error.message);
    }
  }

  static async createAkomodasi(akomodasiData, requesterLevelAkses) {
    try {
      // Otorisasi: Hanya admin atau superadmin yang bisa membuat akomodasi
      if (
        requesterLevelAkses !== "admin" &&
        requesterLevelAkses !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can create accommodations."
        );
      }

      const newAkomodasi = await Akomodasi.create(akomodasiData);
      return newAkomodasi;
    } catch (error) {
      throw new Error("Could not create accommodation: " + error.message);
    }
  }

  static async updateAkomodasi(id, updateData, levelAksesRequester) {
    try {
      const akomodasi = await Akomodasi.findByPk(id);

      if (!akomodasi) {
        throw new Error("Accommodation not found");
      }

      // Otorisasi:
      // Admin atau superadmin bisa mengupdate akomodasi.
      // Jika ingin admin hanya bisa update akomodasi yang dikelolanya sendiri, tambahkan:
      // if (levelAksesRequester === "admin" && akomodasi.id_admin !== idAdminRequester) {
      //   throw new Error("Forbidden: You can only update your own accommodations.");
      // }
      if (
        levelAksesRequester !== "admin" &&
        levelAksesRequester !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can update accommodations."
        );
      }

      await akomodasi.update(updateData);
      return akomodasi;
    } catch (error) {
      throw new Error("Could not update accommodation: " + error.message);
    }
  }

  static async deleteAkomodasi(id, levelAksesRequester) {
    try {
      const akomodasi = await Akomodasi.findByPk(id);

      if (!akomodasi) {
        throw new Error("Accommodation not found");
      }

      // Otorisasi:
      // Admin atau superadmin bisa menghapus akomodasi.
      // Jika ingin admin hanya bisa menghapus akomodasi yang dikelolanya sendiri, tambahkan:
      // if (levelAksesRequester === "admin" && akomodasi.id_admin !== idAdminRequester) {
      //   throw new Error("Forbidden: You can only delete your own accommodations.");
      // }
      if (
        levelAksesRequester !== "admin" &&
        levelAksesRequester !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can delete accommodations."
        );
      }

      // Opsional: Hapus file fisik terkait (gambar_utama_hotel)
      // const fs = require('fs');
      // const path = require('path');
      // const uploadDir = path.join(__dirname, '..', '..', 'uploads'); // Sesuaikan dengan root uploads Anda
      // if (akomodasi.gambar_utama_hotel) {
      //   const filePath = path.join(uploadDir, akomodasi.gambar_utama_hotel.replace('/uploads/', ''));
      //   if (fs.existsSync(filePath)) { fs.unlinkSync(filePath); }
      // }

      await akomodasi.destroy();
      return { message: "Accommodation deleted successfully" };
    } catch (error) {
      throw new Error("Could not delete accommodation: " + error.message);
    }
  }
}

module.exports = AkomodasiService;
