// src/services/mediaGaleriService.js
const {
  Media_Galeri,
  Berita,
  Destinasi,
  Event,
  UMKM,
  Sejarah,
} = require("../models");

class MediaGaleriService {
  static async getAllMediaGaleri() {
    try {
      const mediaGaleri = await Media_Galeri.findAll();
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

  static async createMediaGaleri(
    mediaData,
    uploadedFiles,
    requesterLevelAkses
  ) {
    try {
      if (
        requesterLevelAkses !== "admin" &&
        requesterLevelAkses !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can upload media."
        );
      }

      let contentExists = false;
      if (mediaData.tipe_konten && mediaData.id_konten) {
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
      }

      // PERBAIKAN: Menggunakan map untuk membuat record yang valid
      const mediaRecords = uploadedFiles.map((file, index) => ({
        id_konten: mediaData.id_konten || null,
        tipe_konten: mediaData.tipe_konten || null,
        path_file: `/uploads/galeri/${file.filename}`,
        deskripsi_file: mediaData.deskripsi_file[index],
        jenis_file: file.mimetype.startsWith("image") ? "gambar" : "video",
        urutan_tampil: mediaData.urutan_tampil[index],
      }));

      const newMedia = await Media_Galeri.bulkCreate(mediaRecords);
      return newMedia;
    } catch (error) {
      throw new Error("Could not upload media: " + error.message);
    }
  }

  static async updateMediaGaleri(
    id,
    updateData,
    idAdminRequester,
    levelAksesRequester
  ) {
    try {
      const media = await Media_Galeri.findByPk(id);

      if (!media) {
        throw new Error("Media not found");
      }

      if (
        levelAksesRequester !== "admin" &&
        levelAksesRequester !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can update media."
        );
      }

      if (updateData.path_file === null || updateData.path_file === undefined) {
        delete updateData.path_file;
      }

      await media.update(updateData);
      return media;
    } catch (error) {
      throw new Error("Could not update media: " + error.message);
    }
  }

  static async deleteMediaGaleri(id, idAdminRequester, levelAksesRequester) {
    try {
      const media = await Media_Galeri.findByPk(id);

      if (!media) {
        throw new Error("Media not found");
      }

      if (
        levelAksesRequester !== "admin" &&
        levelAksesRequester !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can delete media."
        );
      }

      await media.destroy();
      return { message: "Media deleted successfully" };
    } catch (error) {
      throw new Error("Could not delete media: " + error.message);
    }
  }
}

module.exports = MediaGaleriService;
