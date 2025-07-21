// src/services/kategoriBeritaService.js
const { Kategori_Berita, Berita } = require("../models"); // Pastikan path benar

class KategoriBeritaService {
  static async getAllKategoriBerita() {
    try {
      const kategori = await Kategori_Berita.findAll({
        // Anda bisa menyertakan berita terkait jika diinginkan
        // include: {
        //   model: Berita,
        //   as: 'beritaTerkait', // Sesuai alias di model Kategori_Berita
        //   attributes: ['id_berita', 'judul', 'tanggal_publikasi']
        // }
      });
      return kategori;
    } catch (error) {
      throw new Error("Could not fetch categories: " + error.message);
    }
  }

  static async getKategoriBeritaById(id) {
    try {
      const kategori = await Kategori_Berita.findByPk(id, {
        // Anda bisa menyertakan berita terkait jika diinginkan
        // include: {
        //   model: Berita,
        //   as: 'beritaTerkait',
        //   attributes: ['id_berita', 'judul', 'tanggal_publikasi', 'gambar_hero_berita']
        // }
      });
      return kategori;
    } catch (error) {
      throw new Error("Could not fetch category by ID: " + error.message);
    }
  }

  static async createKategoriBerita(kategoriData, requesterLevelAkses) {
    try {
      // Otorisasi: Hanya admin atau superadmin yang bisa membuat kategori
      if (
        requesterLevelAkses !== "admin" &&
        requesterLevelAkses !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can create categories."
        );
      }

      const newKategori = await Kategori_Berita.create(kategoriData);
      return newKategori;
    } catch (error) {
      throw new Error("Could not create category: " + error.message);
    }
  }

  static async updateKategoriBerita(id, updateData, requesterLevelAkses) {
    try {
      const kategori = await Kategori_Berita.findByPk(id);

      if (!kategori) {
        throw new Error("Kategori Berita not found");
      }

      // Otorisasi: Hanya admin atau superadmin yang bisa memperbarui kategori
      if (
        requesterLevelAkses !== "admin" &&
        requesterLevelAkses !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can update categories."
        );
      }

      await kategori.update(updateData);
      return kategori;
    } catch (error) {
      throw new Error("Could not update category: " + error.message);
    }
  }

  static async deleteKategoriBerita(id, requesterLevelAkses) {
    try {
      const kategori = await Kategori_Berita.findByPk(id);

      if (!kategori) {
        throw new Error("Kategori Berita not found");
      }

      // Otorisasi: Hanya admin atau superadmin yang bisa menghapus kategori
      if (
        requesterLevelAkses !== "admin" &&
        requesterLevelAkses !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can delete categories."
        );
      }

      // Opsional: Periksa apakah ada berita yang masih terhubung
      const associatedNews = await Berita.count({ where: { id_kategori: id } });
      if (associatedNews > 0) {
        // Jika ada, lempar error atau putuskan hubungan (set id_kategori ke null)
        throw new Error(
          "Cannot delete category: There are still news articles associated with this category."
        );
      }

      await kategori.destroy();
      return { message: "Kategori Berita deleted successfully" };
    } catch (error) {
      throw new Error("Could not delete category: " + error.message);
    }
  }
}

module.exports = KategoriBeritaService;
