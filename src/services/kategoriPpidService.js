// src/services/kategoriPpidService.js
const { Kategori_PPID, Konten_PPID } = require("../models"); // Import model Konten_PPID juga

class KategoriPpidService {
  static async getAllKategoriPpid(options = {}) {
    try {
      const { includeKonten = false, includeSubKategori = false } = options;

      const includeOptions = [];

      // Include Konten_PPID jika diminta
      if (includeKonten) {
        includeOptions.push({
          model: Konten_PPID,
          as: "kontenPPID", // Sesuai alias di model Kategori_PPID
          attributes: [
            "id_konten_ppid",
            "judul_konten",
            "file_pdf_path",
            "tanggal_publikasi",
          ],
        });
      }

      // Include Sub Kategori jika diminta (rekursif)
      if (includeSubKategori) {
        includeOptions.push({
          model: Kategori_PPID,
          as: "subKategoris", // Sesuai alias di model Kategori_PPID
          attributes: ["id_kategori_ppid", "nama_kategori", "level_kategori"],
          // Anda bisa menambahkan include rekursif di sini jika ingin melihat sub-sub-kategori,
          // tapi hati-hati dengan performa dan kedalaman rekursi.
          // include: [{
          //   model: Kategori_PPID,
          //   as: "subKategoris",
          //   attributes: ["id_kategori_ppid", "nama_kategori", "level_kategori"],
          // }]
        });
      }

      const kategoris = await Kategori_PPID.findAll({
        include: includeOptions,
        order: [
          ["level_kategori", "ASC"],
          ["nama_kategori", "ASC"],
        ], // Urutkan berdasarkan level dan nama
      });
      return kategoris;
    } catch (error) {
      throw new Error("Could not fetch PPID categories: " + error.message);
    }
  }

  static async getKategoriPpidById(id, options = {}) {
    try {
      const { includeKonten = false, includeSubKategori = false } = options;

      const includeOptions = [];

      if (includeKonten) {
        includeOptions.push({
          model: Konten_PPID,
          as: "kontenPPID",
          attributes: [
            "id_konten_ppid",
            "judul_konten",
            "file_pdf_path",
            "tanggal_publikasi",
          ],
        });
      }

      if (includeSubKategori) {
        includeOptions.push({
          model: Kategori_PPID,
          as: "subKategoris",
          attributes: ["id_kategori_ppid", "nama_kategori", "level_kategori"],
        });
      }

      const kategori = await Kategori_PPID.findByPk(id, {
        include: includeOptions,
      });
      return kategori;
    } catch (error) {
      throw new Error("Could not fetch PPID category by ID: " + error.message);
    }
  }

  static async createKategoriPpid(kategoriData, requesterLevelAkses) {
    try {
      // Otorisasi: Hanya admin atau superadmin yang bisa membuat kategori PPID
      if (
        requesterLevelAkses !== "admin" &&
        requesterLevelAkses !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can create PPID categories."
        );
      }

      // Jika id_kategori_induk diberikan, validasi keberadaannya
      if (kategoriData.id_kategori_induk) {
        const indukKategori = await Kategori_PPID.findByPk(
          kategoriData.id_kategori_induk
        );
        if (!indukKategori) {
          throw new Error("Parent category not found.");
        }
        // Set level_kategori otomatis jika id_kategori_induk ada
        kategoriData.level_kategori = indukKategori.level_kategori + 1;
      } else {
        kategoriData.level_kategori = 1; // Default ke level 1 jika tidak ada induk
      }

      const newKategori = await Kategori_PPID.create(kategoriData);
      return newKategori;
    } catch (error) {
      throw new Error("Could not create PPID category: " + error.message);
    }
  }

  static async updateKategoriPpid(id, updateData, requesterLevelAkses) {
    try {
      const kategori = await Kategori_PPID.findByPk(id);

      if (!kategori) {
        throw new Error("PPID category not found");
      }

      // Otorisasi: Hanya admin atau superadmin yang bisa update
      if (
        requesterLevelAkses !== "admin" &&
        requesterLevelAkses !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can update PPID categories."
        );
      }

      // Jika id_kategori_induk diupdate, hitung ulang level_kategori
      if (updateData.id_kategori_induk !== undefined) {
        if (updateData.id_kategori_induk === null) {
          updateData.level_kategori = 1;
        } else {
          const indukKategori = await Kategori_PPID.findByPk(
            updateData.id_kategori_induk
          );
          if (!indukKategori) {
            throw new Error("Parent category for update not found.");
          }
          updateData.level_kategori = indukKategori.level_kategori + 1;
        }
      }

      await kategori.update(updateData);
      return kategori;
    } catch (error) {
      throw new Error("Could not update PPID category: " + error.message);
    }
  }

  static async deleteKategoriPpid(id, requesterLevelAkses) {
    try {
      const kategori = await Kategori_PPID.findByPk(id);

      if (!kategori) {
        throw new Error("PPID category not found");
      }

      // Otorisasi: Hanya admin atau superadmin yang bisa delete
      if (
        requesterLevelAkses !== "admin" &&
        requesterLevelAkses !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can delete PPID categories."
        );
      }

      // Opsional: Periksa apakah ada sub-kategori atau konten PPID yang terhubung
      // Jika ada, mungkin Anda ingin melarang penghapusan atau mengubah perilakunya
      const subKategorisCount = await Kategori_PPID.count({
        where: { id_kategori_induk: id },
      });
      const kontenPpidCount = await Konten_PPID.count({
        where: { id_kategori_ppid: id },
      });

      if (subKategorisCount > 0) {
        throw new Error(
          "Cannot delete category with existing sub-categories. Please reassign or delete sub-categories first."
        );
      }
      if (kontenPpidCount > 0) {
        throw new Error(
          "Cannot delete category with existing PPID content. Please reassign or delete content first."
        );
      }

      await kategori.destroy();
      return { message: "PPID category deleted successfully" };
    } catch (error) {
      throw new Error("Could not delete PPID category: " + error.message);
    }
  }
}

module.exports = KategoriPpidService;
