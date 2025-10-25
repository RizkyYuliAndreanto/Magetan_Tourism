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
              "id_media_galeri", // TAMBAHKAN ID_MEDIA_GALERI
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

  /**
   * Update berita beserta media galeri secara atomic menggunakan transaksi
   * @param {number} id - ID berita yang akan diupdate
   * @param {object} beritaData - Data berita yang akan diupdate
   * @param {object} mediaOperations - Operasi media: { keep: [], update: [], delete: [], create: [] }
   * @param {array} newMediaFiles - Array file baru yang diupload
   * @param {number} idAdminRequester - ID admin yang melakukan request
   * @param {string} levelAksesRequester - Level akses admin
   * @returns {object} - Berita yang sudah diupdate beserta media galeri
   */
  static async updateBeritaWithMedia(
    id,
    beritaData,
    mediaOperations,
    newMediaFiles,
    idAdminRequester,
    levelAksesRequester
  ) {
    const { sequelize } = require("../models");
    const transaction = await sequelize.transaction();

    try {
      console.log("=== UPDATE BERITA WITH MEDIA START ===");
      console.log("ID Berita:", id);
      console.log("Berita Data:", beritaData);
      console.log("Media Operations:", mediaOperations);
      console.log("New Media Files:", newMediaFiles?.length || 0, "files");

      // 1. Validasi berita exists
      const berita = await Berita.findByPk(id, { transaction });
      if (!berita) {
        await transaction.rollback();
        throw new Error("Berita not found");
      }

      // 2. Validasi permission
      if (
        levelAksesRequester === "admin" &&
        berita.id_admin !== idAdminRequester
      ) {
        await transaction.rollback();
        throw new Error("Forbidden: You can only update your own news.");
      } else if (
        levelAksesRequester !== "admin" &&
        levelAksesRequester !== "superadmin"
      ) {
        await transaction.rollback();
        throw new Error(
          "Forbidden: Only Admin or Super Admin can update news."
        );
      }

      // 3. Update data berita
      if (beritaData.gambar_hero_berita && berita.gambar_hero_berita) {
        // Hapus file hero lama jika ada yang baru
        FileHelper.deleteFile(berita.gambar_hero_berita);
      }

      await berita.update(beritaData, { transaction });
      console.log("Berita updated successfully");

      // 4. Handle Media Galeri Operations
      if (mediaOperations) {
        const {
          keep = [],
          update = [],
          delete: deleteIds = [],
        } = mediaOperations;

        // 4a. Dapatkan semua media existing untuk berita ini
        const existingMedia = await Media_Galeri.findAll({
          where: {
            id_konten: id,
            tipe_konten: "berita",
          },
          transaction,
        });

        console.log("Existing media count:", existingMedia.length);
        console.log("Keep IDs:", keep);
        console.log("Delete IDs:", deleteIds);

        // 4b. Filter dan validasi ID yang valid
        const existingIds = existingMedia.map((m) => m.id_media_galeri);

        // Filter out null, undefined, dan empty values
        const validKeepIds = keep.filter((id) => id != null && id !== "");
        const validUpdateIds = update
          .map((u) => u.id)
          .filter((id) => id != null && id !== "");
        const validDeleteIds = deleteIds.filter(
          (id) => id != null && id !== ""
        );

        console.log("Filtered valid IDs:", {
          keep: validKeepIds,
          update: validUpdateIds,
          delete: validDeleteIds,
        });

        // Validasi: semua ID yang valid harus ada di database
        const allRequestedIds = [
          ...validKeepIds,
          ...validUpdateIds,
          ...validDeleteIds,
        ];
        const invalidIds = allRequestedIds.filter(
          (id) => !existingIds.includes(id)
        );

        if (invalidIds.length > 0) {
          await transaction.rollback();
          throw new Error(`Media not found with IDs: ${invalidIds.join(", ")}`);
        }

        // Update variables dengan filtered values
        mediaOperations.keep = validKeepIds;
        mediaOperations.update = update.filter(
          (u) => u.id != null && u.id !== ""
        );
        mediaOperations.delete = validDeleteIds;

        // 4c. Hapus media yang ada di delete list
        const finalDeleteIds = mediaOperations.delete;
        if (finalDeleteIds.length > 0) {
          const mediaToDelete = existingMedia.filter((m) =>
            finalDeleteIds.includes(m.id_media_galeri)
          );
          const filesToDelete = mediaToDelete
            .map((m) => m.path_file)
            .filter(Boolean);

          // Delete from database
          await Media_Galeri.destroy({
            where: {
              id_media_galeri: finalDeleteIds,
            },
            transaction,
          });

          // Delete physical files (outside transaction for safety)
          if (filesToDelete.length > 0) {
            FileHelper.deleteMultipleFiles(filesToDelete);
          }

          console.log(`Deleted ${finalDeleteIds.length} media items`);
        }

        // 4d. Update existing media
        const finalUpdateItems = mediaOperations.update;
        if (finalUpdateItems.length > 0) {
          for (const updateItem of finalUpdateItems) {
            await Media_Galeri.update(
              {
                deskripsi_file: updateItem.deskripsi_file,
                urutan_tampil: updateItem.urutan_tampil,
              },
              {
                where: { id_media_galeri: updateItem.id },
                transaction,
              }
            );
          }
          console.log(`Updated ${finalUpdateItems.length} media items`);
        }

        // 4e. Tambah media baru
        if (newMediaFiles && newMediaFiles.length > 0) {
          const newMediaRecords = newMediaFiles.map((file, index) => ({
            id_konten: id,
            tipe_konten: "berita",
            path_file: `/uploads/galeri/${file.filename}`,
            deskripsi_file: file.deskripsi_file || "",
            jenis_file: file.mimetype.startsWith("image") ? "gambar" : "video",
            urutan_tampil: file.urutan_tampil || 100 + index, // Default urutan tinggi untuk media baru
          }));

          await Media_Galeri.bulkCreate(newMediaRecords, { transaction });
          console.log(`Created ${newMediaFiles.length} new media items`);
        }
      }

      // 5. Commit transaksi
      await transaction.commit();
      console.log("Transaction committed successfully");

      // 6. Return updated berita with media
      const updatedBerita = await Berita.findByPk(id, {
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
            model: Media_Galeri,
            as: "galeriBerita",
            attributes: [
              "id_media_galeri",
              "path_file",
              "deskripsi_file",
              "jenis_file",
              "urutan_tampil",
            ],
            order: [["urutan_tampil", "ASC"]],
          },
        ],
      });

      console.log("=== UPDATE BERITA WITH MEDIA END ===");
      return updatedBerita;
    } catch (error) {
      console.log("ERROR in updateBeritaWithMedia:", error.message);
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = BeritaService;
