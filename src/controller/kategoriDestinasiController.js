// src/controllers/kategoriDestinasiController.js
const KategoriDestinasiService = require("../services/kategoriDestinasiService");
const { UniqueConstraintError, ValidationError } = require("sequelize");

class KategoriDestinasiController {
  // GET all Kategori_Destinasi
  static async getAllKategoriDestinasi(req, res) {
    try {
      const kategori = await KategoriDestinasiService.getAllKategoriDestinasi();
      res.status(200).json(kategori);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET Kategori_Destinasi by ID
  static async getKategoriDestinasiById(req, res) {
    try {
      const { id } = req.params;
      const kategori = await KategoriDestinasiService.getKategoriDestinasiById(id);
      if (!kategori) {
        return res.status(404).json({ message: "Kategori Destinasi not found" });
      }
      res.status(200).json(kategori);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // CREATE new Kategori_Destinasi
  static async createKategoriDestinasi(req, res) {
    const { nama_kategori, deskripsi_kategori } = req.body;
    const requesterLevelAkses = req.user.level_akses; // Diambil dari token

    try {
      const newKategori = await KategoriDestinasiService.createKategoriDestinasi(
        { nama_kategori, deskripsi_kategori },
        requesterLevelAkses
      );
      res.status(201).json({
        message: "Kategori Destinasi created successfully",
        kategori: newKategori,
      });
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        return res.status(400).json({
          error: `Kategori '${req.body.nama_kategori}' already exists. Please choose another name.`,
        });
      } else if (error instanceof ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      res.status(403).json({ error: error.message }); // Untuk error otorisasi
    }
  }

  // UPDATE Kategori_Destinasi by ID
  static async updateKategoriDestinasi(req, res) {
    const { id } = req.params;
    const updateData = req.body;
    const requesterLevelAkses = req.user.level_akses; // Diambil dari token

    try {
      const updatedKategori = await KategoriDestinasiService.updateKategoriDestinasi(
        id,
        updateData,
        requesterLevelAkses
      );
      res.status(200).json({
        message: "Kategori Destinasi updated successfully",
        kategori: updatedKategori,
      });
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        return res.status(400).json({
          error: `Kategori '${req.body.nama_kategori}' already exists. Please choose another name.`,
        });
      } else if (error instanceof ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === "Kategori Destinasi not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(403).json({ error: error.message }); // Untuk error otorisasi
    }
  }

  // DELETE Kategori_Destinasi by ID
  static async deleteKategoriDestinasi(req, res) {
    const { id } = req.params;
    const requesterLevelAkses = req.user.level_akses; // Diambil dari token

    try {
      await KategoriDestinasiService.deleteKategoriDestinasi(id, requesterLevelAkses);
      res.status(200).json({ message: "Kategori Destinasi deleted successfully" });
    } catch (error) {
      if (error.message === "Kategori Destinasi not found") {
        return res.status(404).json({ error: error.message });
      }
      // Khusus untuk delete, jika ada berita yang masih terhubung
      if (error.name === "SequelizeForeignKeyConstraintError") {
        return res.status(400).json({
          error:
            "Cannot delete category: There are still news articles associated with this category. Please reassign or delete them first.",
        });
      }
      res.status(403).json({ error: error.message }); // Untuk error otorisasi
    }
  }
}

module.exports = KategoriDestinasiController;
