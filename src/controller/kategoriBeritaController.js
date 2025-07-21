// src/controllers/kategoriBeritaController.js
const KategoriBeritaService = require("../services/kategoriBeritaService");
const { UniqueConstraintError, ValidationError } = require("sequelize");

class KategoriBeritaController {
  // GET all Kategori_Berita
  static async getAllKategoriBerita(req, res) {
    try {
      const kategori = await KategoriBeritaService.getAllKategoriBerita();
      res.status(200).json(kategori);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET Kategori_Berita by ID
  static async getKategoriBeritaById(req, res) {
    try {
      const { id } = req.params;
      const kategori = await KategoriBeritaService.getKategoriBeritaById(id);
      if (!kategori) {
        return res.status(404).json({ message: "Kategori Berita not found" });
      }
      res.status(200).json(kategori);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // CREATE new Kategori_Berita
  static async createKategoriBerita(req, res) {
    const { nama_kategori, deskripsi_kategori } = req.body;
    const requesterLevelAkses = req.user.level_akses; // Diambil dari token

    try {
      const newKategori = await KategoriBeritaService.createKategoriBerita(
        { nama_kategori, deskripsi_kategori },
        requesterLevelAkses
      );
      res
        .status(201)
        .json({
          message: "Kategori Berita created successfully",
          kategori: newKategori,
        });
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        return res
          .status(400)
          .json({
            error: `Kategori '${req.body.nama_kategori}' already exists. Please choose another name.`,
          });
      } else if (error instanceof ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      res.status(403).json({ error: error.message }); // Untuk error otorisasi
    }
  }

  // UPDATE Kategori_Berita by ID
  static async updateKategoriBerita(req, res) {
    const { id } = req.params;
    const updateData = req.body;
    const requesterLevelAkses = req.user.level_akses; // Diambil dari token

    try {
      const updatedKategori = await KategoriBeritaService.updateKategoriBerita(
        id,
        updateData,
        requesterLevelAkses
      );
      res
        .status(200)
        .json({
          message: "Kategori Berita updated successfully",
          kategori: updatedKategori,
        });
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        return res
          .status(400)
          .json({
            error: `Kategori '${req.body.nama_kategori}' already exists. Please choose another name.`,
          });
      } else if (error instanceof ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === "Kategori Berita not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(403).json({ error: error.message }); // Untuk error otorisasi
    }
  }

  // DELETE Kategori_Berita by ID
  static async deleteKategoriBerita(req, res) {
    const { id } = req.params;
    const requesterLevelAkses = req.user.level_akses; // Diambil dari token

    try {
      await KategoriBeritaService.deleteKategoriBerita(id, requesterLevelAkses);
      res.status(200).json({ message: "Kategori Berita deleted successfully" });
    } catch (error) {
      if (error.message === "Kategori Berita not found") {
        return res.status(404).json({ error: error.message });
      }
      // Khusus untuk delete, jika ada berita yang masih terhubung
      if (error.name === "SequelizeForeignKeyConstraintError") {
        return res
          .status(400)
          .json({
            error:
              "Cannot delete category: There are still news articles associated with this category. Please reassign or delete them first.",
          });
      }
      res.status(403).json({ error: error.message }); // Untuk error otorisasi
    }
  }
}

module.exports = KategoriBeritaController;
