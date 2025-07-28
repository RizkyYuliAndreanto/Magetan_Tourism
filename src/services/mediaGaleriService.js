// src/services/mediaGaleriService.js
const {
  Media_Galeri,
  Berita,
  Destinasi,
  Event,
  UMKM,
  Sejarah,
} = require("../models"); // Import semua model konten

class MediaGaleriService {
  static async getAllMediaGaleri() {
    try {
      // Mengambil semua media galeri, dengan detail konten terkait
      const mediaGaleri = await Media_Galeri.findAll({
        include: [
          // Anda bisa memilih untuk meng-include hanya model yang relevan,
          // atau semua jika ingin melihat ke mana saja media ini terkait.
          // Ingat, hanya satu dari 'berita', 'destinasi', 'event', 'umkm', 'sejarah' yang akan terisi untuk setiap baris.
          {
            model: Berita,
            as: "berita",
            attributes: ["id_berita", "judul"],
            required: false, // Gunakan required: false agar baris tetap muncul meskipun tidak ada Berita terkait
          },
          {
            model: Destinasi,
            as: "destinasi",
            attributes: ["id_destinasi", "nama_destinasi"],
            required: false,
          },
          {
            model: Event,
            as: "event",
            attributes: ["id_event", "nama_event"],
            required: false,
          },
          {
            model: UMKM,
            as: "umkm",
            attributes: ["id_umkm", "nama_umkm"],
            required: false,
          },
          {
            model: Sejarah,
            as: "sejarah",
            attributes: ["id_sejarah", "judul"],
            required: false,
          },
        ],
      });
      return mediaGaleri;
    } catch (error) {
      throw new Error("Could not fetch media gallery: " + error.message);
    }
  }

  static async getMediaGaleriById(id) {
    try {
      const mediaGaleri = await Media_Galeri.findByPk(id, {
        include: [
          {
            model: Berita,
            as: "berita",
            attributes: ["id_berita", "judul"],
            required: false,
          },
          {
            model: Destinasi,
            as: "destinasi",
            attributes: ["id_destinasi", "nama_destinasi"],
            required: false,
          },
          {
            model: Event,
            as: "event",
            attributes: ["id_event", "nama_event"],
            required: false,
          },
          {
            model: UMKM,
            as: "umkm",
            attributes: ["id_umkm", "nama_umkm"],
            required: false,
          },
          {
            model: Sejarah,
            as: "sejarah",
            attributes: ["id_sejarah", "judul"],
            required: false,
          },
        ],
      });
      return mediaGaleri;
    } catch (error) {
      throw new Error("Could not fetch media gallery by ID: " + error.message);
    }
  }

  static async createMediaGaleri(mediaData, requesterLevelAkses) {
    try {
      // Otorisasi: Hanya admin atau superadmin yang bisa membuat media galeri
      if (
        requesterLevelAkses !== "admin" &&
        requesterLevelAkses !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can upload media."
        );
      }

      // Pastikan id_konten dan tipe_konten disediakan
      if (!mediaData.id_konten || !mediaData.tipe_konten) {
        throw new Error("id_konten and tipe_konten are required.");
      }

      // Opsional: Validasi apakah id_konten benar-benar ada di model terkait
      // Ini akan membuat query tambahan ke database
      let contentExists = false;
      switch (mediaData.tipe_konten) {
        case "berita":
          contentExists = await Berita.findByPk(mediaData.id_konten);
          break;
        case "destinasi":
          contentExists = await Destinasi.findByPk(mediaData.id_konten);
          break;
        case "event":
          contentExists = await Event.findByPk(mediaData.id_konten);
          break;
        case "umkm":
          contentExists = await UMKM.findByPk(mediaData.id_konten);
          break;
        case "sejarah":
          contentExists = await Sejarah.findByPk(mediaData.id_konten);
          break;
        default:
          throw new Error("Invalid tipe_konten provided.");
      }

      if (!contentExists) {
        throw new Error(
          `Content with ID ${mediaData.id_konten} and type ${mediaData.tipe_konten} not found.`
        );
      }

      const newMedia = await Media_Galeri.create(mediaData);
      return newMedia;
    } catch (error) {
      throw new Error("Could not upload media: " + error.message);
    }
  }

  static async updateMediaGaleri(
    id,
    updateData,
    idAdminRequester, // Mungkin tidak diperlukan jika tidak ada id_admin di model Media_Galeri
    levelAksesRequester
  ) {
    try {
      const media = await Media_Galeri.findByPk(id);

      if (!media) {
        throw new Error("Media not found");
      }

      // Otorisasi:
      // Karena Media_Galeri tidak memiliki id_admin langsung,
      // kita harus otorisasi berdasarkan level_akses global atau
      // mengecek admin dari konten asalnya (lebih kompleks).
      // Untuk sederhana, kita asumsikan admin/superadmin bisa mengupdate media apapun.
      if (
        levelAksesRequester !== "admin" &&
        levelAksesRequester !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can update media."
        );
      }

      await media.update(updateData);
      return media;
    } catch (error) {
      throw new Error("Could not update media: " + error.message);
    }
  }

  static async deleteMediaGaleri(
    id,
    idAdminRequester, // Mungkin tidak diperlukan jika tidak ada id_admin di model Media_Galeri
    levelAksesRequester
  ) {
    try {
      const media = await Media_Galeri.findByPk(id);

      if (!media) {
        throw new Error("Media not found");
      }

      // Otorisasi:
      // Sama seperti update, asumsikan admin/superadmin bisa menghapus media apapun.
      if (
        levelAksesRequester !== "admin" &&
        levelAksesRequester !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can delete media."
        );
      }

      // Opsional: Hapus file fisik dari server
      // const fs = require('fs');
      // const path = require('path');
      // const uploadDir = path.join(__dirname, '..', '..', 'uploads'); // Sesuaikan dengan root uploads Anda
      // const filePath = path.join(uploadDir, media.path_file.replace('/uploads/', '')); // Hapus '/uploads/' dari path
      // if (fs.existsSync(filePath)) {
      //   fs.unlinkSync(filePath);
      // }

      await media.destroy();
      return { message: "Media deleted successfully" };
    } catch (error) {
      throw new Error("Could not delete media: " + error.message);
    }
  }
}

module.exports = MediaGaleriService;
