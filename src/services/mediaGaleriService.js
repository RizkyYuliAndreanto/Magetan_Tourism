// src/services/mediaGaleriService.js
const {
  Media_Galeri,
  Berita,
  Destinasi,
  Event,
  UMKM,
  Sejarah,
  Budaya,
  Akomodasi,
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
          {
            model: Akomodasi,
            as: "akomodasi",
            attributes: ["id_akomodasi", "nama_hotel"],
            required: false,
          },
          {
            model: Budaya,
            as: "budaya",
            attributes: ["id_budaya", "judul_budaya"],
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
          case "budaya":
            contentExists = await Budaya.findByPk(mediaData.id_konten);
            break;
          case "akomodasi":
            contentExists = await Akomodasi.findByPk(mediaData.id_konten);
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

      const mediaRecords = uploadedFiles.map((file, idx) => ({
        id_konten: mediaData.id_konten || null,
        tipe_konten: mediaData.tipe_konten || null,
        path_file: `/uploads/galeri/${file.filename}`,
        deskripsi_file: Array.isArray(mediaData.deskripsi_file)
          ? mediaData.deskripsi_file[idx] || ""
          : mediaData.deskripsi_file || "",
        jenis_file: file.mimetype.startsWith("image") ? "gambar" : "video",
        urutan_tampil: mediaData.urutan_tampil || 0,
      }));

      // Tambahkan console.log untuk debugging
      console.log("Records to be inserted:", mediaRecords);

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

      // Pastikan id_konten dan tipe_konten divalidasi jika ada di updateData
      if (updateData.tipe_konten && updateData.id_konten) {
        let contentExists = false;
        switch (updateData.tipe_konten) {
          case "berita":
            contentExists = await Berita.findByPk(updateData.id_konten);
            break;
          case "destinasi":
            contentExists = await Destinasi.findByPk(updateData.id_konten);
            break;
          case "event":
            contentExists = await Event.findByPk(updateData.id_konten);
            break;
          case "umkm":
            contentExists = await UMKM.findByPk(updateData.id_konten);
            break;
          case "sejarah":
            contentExists = await Sejarah.findByPk(updateData.id_konten);
            break;
          case "budaya":
            contentExists = await Budaya.findByPk(updateData.id_konten);
            break;
          case "akomodasi":
            contentExists = await Akomodasi.findByPk(updateData.id_konten);
            break;
          default:
            throw new Error("Invalid tipe_konten provided for update.");
        }
        if (!contentExists) {
          throw new Error(
            `Content with ID ${updateData.id_konten} and type ${updateData.tipe_konten} not found for update.`
          );
        }
      }

      // Pastikan path_file tidak diupdate jika tidak ada file baru
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
