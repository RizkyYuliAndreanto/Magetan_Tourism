// src/services/beritaService.js
const { Berita, Kategori_Berita, Admin, Media_Galeri } = require("../models"); // Pastikan Media_Galeri di-import
const FileHelper = require("../utils/fileHelper");
const InteractionService = require("./interactionService");

class BeritaService {
  static async getAllBerita() {
    try {
      const berita = await Berita.findAll({
        include: [
          {
            model: Kategori_Berita,
            as: "kategoriBerita",
            attributes: ["nama_kategori"],
          },
          {
            model: Admin,
            as: "adminPembuat",
            attributes: ["username", "nama_lengkap", "level_akses"],
          },
          {
            // Tambahkan include untuk Media_Galeri
            model: Media_Galeri,
            as: "galeriBerita", // Menggunakan alias yang benar dari model Berita
            attributes: [
              "path_file",
              "deskripsi_file",
              "jenis_file",
              "urutan_tampil",
            ],
            order: [["urutan_tampil", "ASC"]],
          },
        ],
      });
      return berita;
    } catch (error) {
      throw new Error("Could not fetch berita: " + error.message);
    }
  }

  static async getBeritaById(id) {
    try {
      const berita = await Berita.findByPk(id, {
        include: [
          {
            model: Kategori_Berita,
            as: "kategoriBerita",
            attributes: ["nama_kategori", "deskripsi_kategori"],
          },
          {
            model: Admin,
            as: "adminPembuat",
            attributes: ["username", "nama_lengkap", "email", "level_akses"],
          },
          {
            // Tambahkan include untuk Media_Galeri
            model: Media_Galeri,
            as: "galeriBerita", // Menggunakan alias yang benar
            attributes: [
              "path_file",
              "deskripsi_file",
              "jenis_file",
              "urutan_tampil",
            ],
            order: [["urutan_tampil", "ASC"]],
          },
        ],
      });
      return berita;
    } catch (error) {
      throw new Error("Could not fetch berita by ID: " + error.message);
    }
  }

  static async createBerita(beritaData, requesterLevelAkses) {
    try {
      console.log("📥 [DEBUG] Data diterima untuk pembuatan berita:");
      console.log(JSON.stringify(beritaData, null, 2));

      console.log("📥 [DEBUG] requesterLevelAkses:", requesterLevelAkses);

      if (
        requesterLevelAkses !== "admin" &&
        requesterLevelAkses !== "superadmin"
      ) {
        console.warn("❌ [ACCESS DENIED] Level akses tidak diizinkan");
        throw new Error(
          "Forbidden: Only Admin or Super Admin can create news."
        );
      }

      // Konversi id_kategori ke integer
      beritaData.id_kategori = parseInt(beritaData.id_kategori);
      beritaData.id_admin = parseInt(beritaData.id_admin);

      console.log("✅ [DEBUG] Parsed id_kategori:", beritaData.id_kategori);
      console.log("✅ [DEBUG] Parsed id_admin:", beritaData.id_admin);

      const kategori = await Kategori_Berita.findByPk(beritaData.id_kategori);
      if (!kategori) {
        console.error(
          `❌ [NOT FOUND] Kategori ID ${beritaData.id_kategori} tidak ditemukan`
        );
        throw new Error(
          `Kategori dengan ID ${beritaData.id_kategori} tidak ditemukan.`
        );
      } else {
        console.log(
          `✅ [FOUND] Kategori ditemukan: ${
            kategori.nama_kategori || "tanpa nama"
          }`
        );
      }

      const admin = await Admin.findByPk(beritaData.id_admin);
      if (!admin) {
        console.error(
          `❌ [NOT FOUND] Admin ID ${beritaData.id_admin} tidak ditemukan`
        );
        throw new Error(
          `Admin dengan ID ${beritaData.id_admin} tidak ditemukan.`
        );
      } else {
        console.log(
          `✅ [FOUND] Admin ditemukan: ${admin.username || "tanpa username"}`
        );
      }

      const newBerita = await Berita.create(beritaData);
      console.log("✅ [SUCCESS] Berita berhasil dibuat:", newBerita.id_berita);
      return newBerita;
    } catch (error) {
      console.error("🔥 [ERROR] Gagal membuat berita:", error.message);
      throw new Error("Could not create berita: " + error.message);
    }
  }

  static async updateBerita(
    id,
    updateData,
    idAdminRequester,
    levelAksesRequester
  ) {
    try {
      const berita = await Berita.findByPk(id);
      if (!berita) {
        throw new Error("Berita not found");
      }
      if (
        levelAksesRequester === "admin" &&
        berita.id_admin !== idAdminRequester
      ) {
        throw new Error("Forbidden: You can only update your own news.");
      } else if (
        levelAksesRequester !== "admin" &&
        levelAksesRequester !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can update news."
        );
      }

      // Hapus file gambar lama jika ada gambar baru
      if (updateData.gambar_hero_berita && berita.gambar_hero_berita) {
        FileHelper.deleteFile(berita.gambar_hero_berita);
      }

      await berita.update(updateData);
      return berita;
    } catch (error) {
      throw new Error("Could not update berita: " + error.message);
    }
  }

  static async deleteBerita(id, idAdminRequester, levelAksesRequester) {
    try {
      const berita = await Berita.findByPk(id, {
        include: [
          {
            model: Media_Galeri,
            as: "galeriBerita",
            attributes: ["path_file"],
          },
        ],
      });

      if (!berita) {
        throw new Error("Berita not found");
      }

      if (
        levelAksesRequester === "admin" &&
        berita.id_admin !== idAdminRequester
      ) {
        throw new Error("Forbidden: You can only delete your own news.");
      } else if (
        levelAksesRequester !== "admin" &&
        levelAksesRequester !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can delete news."
        );
      }

      // Hapus file gambar hero
      if (berita.gambar_hero_berita) {
        FileHelper.deleteFile(berita.gambar_hero_berita);
      }

      // Hapus semua file di galeri yang terkait
      if (berita.galeriBerita && berita.galeriBerita.length > 0) {
        const filePaths = berita.galeriBerita.map((item) => item.path_file);
        FileHelper.deleteMultipleFiles(filePaths);
      }

      // Hapus data interactions terkait (likes, comments, shares)
      await Promise.all([
        InteractionService.deleteLikesByContent("berita", id),
        InteractionService.deleteCommentsByContent("berita", id),
        InteractionService.deleteSharesByContent("berita", id),
      ]);

      await berita.destroy();
      return { message: "Berita deleted successfully" };
    } catch (error) {
      throw new Error("Could not delete berita: " + error.message);
    }
  }

  // Method untuk mendapatkan berita dengan interaksi
  static async getBeritaWithInteractions(id, userId = null) {
    try {
      const berita = await this.getBeritaById(id);
      if (!berita) {
        throw new Error("Berita not found");
      }

      const interactions = await InteractionService.getContentInteractions(
        "berita",
        id,
        userId
      );

      return {
        ...berita.toJSON(),
        interactions,
      };
    } catch (error) {
      throw new Error(
        "Could not fetch berita with interactions: " + error.message
      );
    }
  }
}

module.exports = BeritaService;
