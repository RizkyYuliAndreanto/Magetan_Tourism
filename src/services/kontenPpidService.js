// src/services/kontenPpidService.js
const {
  Konten_PPID,
  Kategori_PPID,
  Admin,
  Media_Galeri,
} = require("../models"); // Import semua model terkait

class KontenPpidService {
  static async getAllKontenPpid() {
    try {
      const konten = await Konten_PPID.findAll({
        include: [
          {
            model: Kategori_PPID,
            as: "kategoriPPID", // Sesuai alias di model Konten_PPID
            attributes: ["id_kategori_ppid", "nama_kategori", "level_kategori"],
          },
          {
            model: Admin,
            as: "adminPengelola", // Sesuai alias di model Konten_PPID
            attributes: ["username", "nama_lengkap", "level_akses"],
          },
          {
            model: Media_Galeri,
            as: "galeriKontenPPID", // Sesuai alias di model Konten_PPID
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
        order: [["tanggal_publikasi", "DESC"]], // Urutkan dari yang terbaru
      });
      return konten;
    } catch (error) {
      throw new Error("Could not fetch PPID content: " + error.message);
    }
  }

  static async getKontenPpidById(id) {
    try {
      const konten = await Konten_PPID.findByPk(id, {
        include: [
          {
            model: Kategori_PPID,
            as: "kategoriPPID",
            attributes: [
              "id_kategori_ppid",
              "nama_kategori",
              "deskripsi_kategori",
              "level_kategori",
            ],
            include: [
              {
                // Opsional: Untuk mendapatkan kategori induk juga
                model: Kategori_PPID,
                as: "kategoriInduk",
                attributes: [
                  "id_kategori_ppid",
                  "nama_kategori",
                  "level_kategori",
                ],
              },
            ],
          },
          {
            model: Admin,
            as: "adminPengelola",
            attributes: ["username", "nama_lengkap", "email", "level_akses"],
          },
          {
            model: Media_Galeri,
            as: "galeriKontenPPID",
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
      return konten;
    } catch (error) {
      throw new Error("Could not fetch PPID content by ID: " + error.message);
    }
  }

  static async createKontenPpid(kontenData, requesterLevelAkses) {
    try {
      // Otorisasi: Hanya admin atau superadmin yang bisa membuat konten PPID
      if (
        requesterLevelAkses !== "admin" &&
        requesterLevelAkses !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can create PPID content."
        );
      }

      // Validasi id_kategori_ppid
      const kategori = await Kategori_PPID.findByPk(
        kontenData.id_kategori_ppid
      );
      if (!kategori) {
        throw new Error("Related PPID category not found.");
      }

      const newKonten = await Konten_PPID.create(kontenData);
      return newKonten;
    } catch (error) {
      throw new Error("Could not create PPID content: " + error.message);
    }
  }

  static async updateKontenPpid(id, updateData, requesterLevelAkses) {
    try {
      const konten = await Konten_PPID.findByPk(id);

      if (!konten) {
        throw new Error("PPID content not found");
      }

      // Otorisasi:
      // Admin atau superadmin bisa mengupdate konten PPID.
      // Jika ingin admin hanya bisa update konten yang dikelolanya sendiri, tambahkan:
      // if (levelAksesRequester === "admin" && konten.id_admin !== idAdminRequester) {
      //   throw new Error("Forbidden: You can only update your own PPID content.");
      // }
      if (
        requesterLevelAkses !== "admin" &&
        requesterLevelAkses !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can update PPID content."
        );
      }

      // Jika id_kategori_ppid diupdate, validasi keberadaannya
      if (updateData.id_kategori_ppid) {
        const kategori = await Kategori_PPID.findByPk(
          updateData.id_kategori_ppid
        );
        if (!kategori) {
          throw new Error("Related PPID category for update not found.");
        }
      }

      await konten.update(updateData);
      return konten;
    } catch (error) {
      throw new Error("Could not update PPID content: " + error.message);
    }
  }

  static async deleteKontenPpid(id, requesterLevelAkses) {
    try {
      const konten = await Konten_PPID.findByPk(id);

      if (!konten) {
        throw new Error("PPID content not found");
      }

      // Otorisasi:
      // Admin atau superadmin bisa menghapus konten PPID.
      // Jika ingin admin hanya bisa menghapus konten yang dikelolanya sendiri, tambahkan:
      // if (levelAksesRequester === "admin" && konten.id_admin !== idAdminRequester) {
      //   throw new Error("Forbidden: You can only delete your own PPID content.");
      // }
      if (
        requesterLevelAkses !== "admin" &&
        requesterLevelAkses !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can delete PPID content."
        );
      }

      // Opsional: Hapus file fisik terkait (PDF utama dan galeri)
      // const fs = require('fs');
      // const path = require('path');
      // const uploadDir = path.join(__dirname, '..', '..', 'uploads');
      // if (konten.file_pdf_path) {
      //   const pdfPath = path.join(uploadDir, konten.file_pdf_path.replace('/uploads/', ''));
      //   if (fs.existsSync(pdfPath)) { fs.unlinkSync(pdfPath); }
      // }
      // // Hapus juga media galeri terkait
      // const relatedMedia = await Media_Galeri.findAll({
      //   where: {
      //     id_konten: konten.id_konten_ppid,
      //     tipe_konten: 'ppid_konten'
      //   }
      // });
      // for (const media of relatedMedia) {
      //   const mediaFilePath = path.join(uploadDir, media.path_file.replace('/uploads/', ''));
      //   if (fs.existsSync(mediaFilePath)) { fs.unlinkSync(mediaFilePath); }
      //   await media.destroy();
      // }

      await konten.destroy();
      return { message: "PPID content deleted successfully" };
    } catch (error) {
      throw new Error("Could not delete PPID content: " + error.message);
    }
  }
}

module.exports = KontenPpidService;
